# Schema & Architecture Assessment

**Date:** May 2, 2026
**Status:** ARCHITECTURE REVIEW — must resolve before building more features

---

## Current State: Mujarrad Used as Flat Store, Not Graph

### Problem 1: Dual Storage, Single Read Path
Every relationship is stored twice:
- **nodeDetails FK** (e.g., `contact.organizationId = "abc123"`) — **THIS IS READ**
- **Mujarrad attribute** (graph edge: contact → org, verb: "belongs_to") — **THIS IS NEVER READ**

The attribute creation is fire-and-forget (`.catch(() => {})`). If it fails, the FK still works because all reads use nodeDetails. The graph edges are decorative.

**Impact:** The "connection map" requirement (REQ-MAP-1) needs graph traversal. If attributes don't reliably exist, the map can't show connections by querying the graph.

### Problem 2: Full Table Scan on Every List
`listEntities()` calls `client.listNodes()` which returns ALL nodes in the space. With 14 entity types and growing data, every page load downloads everything.

**Impact:** Performance degrades linearly with data volume. At 500 orgs with 2000 tasks, every task list query downloads 2500+ nodes.

### Problem 3: No Graph Traversal
The client has `getDescendants()` and `getAncestors()` but they're never used. All queries are: fetch all → filter client-side.

**Impact:** Cannot answer "what orgs are connected to Org X?" without downloading all matches and filtering.

### Problem 4: Silent Attribute Failures
All attribute operations use `.catch(() => {})`:
- `createSupplementaryAttributes` (line 161)
- `updateSupplementaryAttributes` (line 188)
- `cleanupAttributes` (line 206)

If any fail, the graph is inconsistent but nobody knows.

---

## What Needs to Change

### Fix 1: Attributes Must Be Reliable (CRITICAL)
Stop fire-and-forget. Await attribute operations. If they fail, the entity creation should fail or at least log the error visibly.

```typescript
// BEFORE (broken)
this.client.createAttribute(sourceId, targetId, rel.verb).catch(() => {});

// AFTER (reliable)
try {
  await this.client.createAttribute(sourceId, targetId, rel.verb);
} catch (err) {
  console.error(`Failed to create ${rel.verb} attribute from ${sourceId} to ${targetId}:`, err);
  // Don't swallow — let the caller know the relationship is incomplete
}
```

### Fix 2: Attribute-First for Matches (CRITICAL)
Matches are the most important graph relationship. When a match is created:
1. Create the match node (stores metadata: score, reason, category)
2. Create TWO attributes: matchNode → OrgA (verb: "matches"), matchNode → OrgB (verb: "matches")
3. ALSO create a direct attribute: OrgA → OrgB (verb: "matched_with", metadata: { matchId, score, status })

This makes the connection traversable: "Give me all attributes of OrgA" returns the matched_with edge to OrgB.

### Fix 3: Use `_resourceType` Filter Server-Side (HIGH)
Currently Mujarrad's `listNodes` API accepts a `search` param but no `nodeDetails` filter. Options:
- A: Keep client-side filter but add caching (current approach with 5s TTL)
- B: Use context types to differentiate entities (Mujarrad BACKEND mode)
- C: Accept the full-scan for now, optimize later with Typesense

**Recommendation:** Keep current approach (A) for now. The 5s cache + React Query 15s staleTime means most list operations hit cache. Optimize when node count exceeds 1000.

### Fix 4: Graph Traversal for Connection Queries (HIGH)
For the connection map (REQ-MAP-1), use Mujarrad's attribute API to find connections:
```
GET /api/nodes/{orgId}/attributes → returns all edges from this org
Filter by verb: "matched_with", "belongs_to", etc.
```

This requires Fix 1 (reliable attributes) to work.

---

## Entity-Relationship Diagram (Current)

```
CONTEXT NODES (long-lived reference entities):
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  organizations   │     │    contacts       │     │     users        │
│  ─────────────   │     │  ─────────────    │     │  ─────────────   │
│  name            │◄────│  organizationId   │     │  email           │
│  type            │     │  firstName        │     │  name            │
│  status          │     │  lastName         │     │  role            │
│  locations[]     │     │  email            │     └──────────────────┘
│  website         │     │  phone            │
│  description     │     │  role             │
│  tags[]          │     └──────────────────┘
└────────┬─────────┘
         │
         │ belongs_to / relates_to
         ▼
REGULAR NODES (operational/transactional):
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   engagements    │     │     tasks         │     │     notes        │
│  ─────────────   │     │  ─────────────    │     │  ─────────────   │
│  organizationId  │     │  organizationId   │     │  organizationId  │
│  title           │     │  engagementId     │     │  engagementId    │
│  stage           │     │  title            │     │  content         │
│  category        │     │  dueDate          │     │  createdBy       │
│  priority        │     │  status           │     └──────────────────┘
│  targetDate      │     │  priority         │
│  value           │     │  assignedTo       │     ┌──────────────────┐
│  tags[]          │     └──────────────────┘     │     files         │
└──────────────────┘                               │  ─────────────   │
                                                   │  organizationId  │
┌──────────────────┐     ┌──────────────────┐     │  engagementId    │
│    matches       │     │ signing-requests  │     │  name            │
│  ─────────────   │     │  ─────────────    │     │  mimeType        │
│  organizationAId │     │  organizationId   │     │  r2ObjectKey     │
│  organizationBId │     │  engagementId     │     └──────────────────┘
│  status          │     │  title            │
│  matchScore      │     │  status           │     ┌──────────────────┐
│  matchReason     │     │  pdfUrl           │     │ activity-events  │
│  category        │     │  createdBy        │     │  ─────────────   │
│  suggestedBy     │     └──────────────────┘     │  action           │
└──────────────────┘                               │  entityType      │
                         ┌──────────────────┐     │  entityId        │
                         │    signers       │     │  organizationId  │
                         │  ─────────────   │     └──────────────────┘
                         │  signingRequestId│
                         │  name            │     ┌──────────────────┐
                         │  email           │     │   sla-rules      │
                         │  status          │     │  ─────────────   │
                         │  token           │     │  name            │
                         └──────────────────┘     │  entityType      │
                                                   │  thresholdDays   │
                         ┌──────────────────┐     └──────────────────┘
                         │ signature-fields │
                         │  ─────────────   │     ┌──────────────────┐
                         │  signingRequestId│     │    alerts        │
                         │  signerId        │     │  ─────────────   │
                         │  page, x, y, w, h│     │  type            │
                         └──────────────────┘     │  title, message  │
                                                   │  read            │
                                                   └──────────────────┘
```

## Graph Edges (Mujarrad Attributes)

```
RELATIONSHIP EDGES (created by EntityControlLayer):
contact ──belongs_to──► organization
file ──belongs_to──► organization
file ──belongs_to──► engagement
note ──belongs_to──► organization
note ──belongs_to──► engagement
engagement ──belongs_to──► organization
task ──relates_to──► organization
task ──belongs_to──► engagement
signing-request ──belongs_to──► organization
signing-request ──belongs_to──► engagement
signature-field ──belongs_to──► signing-request
signature-field ──assigned_to──► signer
signer ──belongs_to──► signing-request
activity-event ──relates_to──► organization
match ──matches_with──► organization (A)
match ──matches_with──► organization (B)

MISSING (should exist for graph traversal):
organization ──matched_with──► organization (direct edge for connection queries)
```

---

## Action Items

| # | What | Priority | Effort |
|---|------|----------|--------|
| 1 | Make attribute operations awaited, not fire-and-forget | CRITICAL | S |
| 2 | Add direct org↔org attribute on match creation | CRITICAL | S |
| 3 | Add error logging for failed attribute operations | HIGH | S |
| 4 | Document the full ERD in a formal schema file | HIGH | M |
| 5 | Verify all existing attributes actually exist in Mujarrad | HIGH | M |
| 6 | Add graph traversal for connection map queries | HIGH | M |
| 7 | Consider context types for entity type filtering | MEDIUM | L |

---

## Status

**ARCHITECTURE REVIEW — these items should be addressed before building the Items entity or connection map features.**
