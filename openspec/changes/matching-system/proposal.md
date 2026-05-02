# Change: Matching System — Org-to-Org Connection Discovery

## Why

The platform currently manages SIA's internal operations (orgs, contacts, engagements, tasks). But the Constitution's objective is to **connect organizations to mutual opportunities**. Without matching, the platform is a CRM. With matching, it's a marketplace.

Matching is the bridge between "SIA knows about these organizations" and "these organizations should work together."

## What This Change Introduces

### 1. Match Entity

A **match** represents a potential connection between two organizations, created by SIA admin.

**Entity: `matches`**

```
matches {
  id                  UUID
  organizationAId     FK → orgs     first party
  organizationBId     FK → orgs     second party
  status              enum          pending | accepted_a | accepted_b | mutual | declined | expired
  matchScore          number        0-100 strength score
  matchReason         string        why these two should connect (admin writes this)
  sector              string?       shared sector/opportunity area
  category            enum          investment | partnership | joint_venture | technology | regulatory
  suggestedBy         string        admin who created the match
  declinedBy          string?       which party declined (orgA or orgB)
  declineReason       string?       why they declined
  expiresAt           string?       auto-expire if no response
  createdAt           timestamp
  updatedAt           timestamp
}
```

**Status flow:**
```
pending → accepted_a (org A accepted, waiting on B)
pending → accepted_b (org B accepted, waiting on A)
accepted_a + accepted_b → mutual (BOTH accepted → create engagement)
pending → declined (either party declined)
pending → expired (no response before expiresAt)
```

When status reaches `mutual`: auto-create an engagement between the two orgs with stage "prospect" and category based on match category.

### 2. Match Pages (Admin Side)

**MatchCreatePage** (`/portal/matches/create`):
- Select Organization A (dropdown)
- Select Organization B (dropdown, excludes A)
- Match score (slider 0-100)
- Match reason (textarea — why these two should connect)
- Category (investment/partnership/joint_venture/technology/regulatory)
- Sector (optional text)
- Expiry date (optional)
- Preview: shows both org cards side-by-side with the connection reason

**MatchListPage** (`/portal/matches`):
- Table: Org A | Org B | Score | Category | Status | Created
- Status badges: pending (amber), accepted (blue), mutual (green), declined (red), expired (gray)
- Filters: status, category
- Click row → MatchDetailPage

**MatchDetailPage** (`/portal/matches/:id`):
- Header: "Match: [Org A] ↔ [Org B]"
- Score gauge (visual)
- Reason card
- Status timeline (who accepted/declined when)
- If mutual: link to created engagement
- Admin actions: expire match, edit reason/score

### 3. Match Visualization on Dashboard

Add a **"Recent Matches"** section to the dashboard:
- Shows last 5 matches with status badges
- Count cards: pending matches, mutual connections this month
- Quick-create: "Create Match" button

### 4. Match on Organization Detail Page

Add a **"Matches"** tab to the org detail page:
- Shows all matches involving this org (as A or B)
- Each match card shows: other org name, score, reason, status
- "Create Match for this Org" button (pre-fills org A)

### 5. Connection View (Future-Ready)

While full partner portal is Phase B, the match data enables a **connection map** visualization:
- Graph view: orgs as nodes, matches as edges
- Color by status: pending (amber lines), mutual (green lines), declined (red dashed)
- This is a read-only admin view showing the corridor's connection network

Not in this PR but the data model supports it.

---

## Entity Registry

```typescript
matches: {
  nodeType: "REGULAR",
  titleField: "matchReason",
  requiredFields: ["organizationAId", "organizationBId", "status", "matchScore", "matchReason", "category", "suggestedBy"],
  relationships: [
    { targetResource: "organizations", fkField: "organizationAId", verb: "matches_with", direction: "outgoing" },
    { targetResource: "organizations", fkField: "organizationBId", verb: "matches_with", direction: "outgoing" },
  ],
}
```

## Zod Schema

```typescript
export const MATCH_CATEGORIES = ["investment", "partnership", "joint_venture", "technology", "regulatory"] as const;
export const MATCH_STATUSES = ["pending", "accepted_a", "accepted_b", "mutual", "declined", "expired"] as const;

export const matchSchema = z.object({
  organizationAId: z.string().min(1, "First organization is required"),
  organizationBId: z.string().min(1, "Second organization is required"),
  status: z.enum(MATCH_STATUSES),
  matchScore: z.number().min(0).max(100),
  matchReason: z.string().min(1, "Match reason is required"),
  category: z.enum(MATCH_CATEGORIES),
  sector: z.string().optional(),
  suggestedBy: z.string().min(1),
  declinedBy: z.string().optional(),
  declineReason: z.string().optional(),
  expiresAt: z.string().optional(),
});
```

## Refine Resource

```typescript
{
  name: "matches",
  list: "/portal/matches",
  create: "/portal/matches/create",
  show: "/portal/matches/:id",
  meta: { label: "Matches", icon: <Link2 /> },
}
```

## Routes

```
/portal/matches              → MatchListPage
/portal/matches/create       → MatchCreatePage
/portal/matches/:id          → MatchDetailPage
```

## Sidebar

Add "Matches" between "Engagements" and "Contacts" with Link2 icon.

## Auto-Create Engagement on Mutual Accept

When match status changes to `mutual`:
1. Create an engagement with:
   - title: "Match: [Org A] ↔ [Org B] — [category]"
   - organizationId: organizationAId (SIA manages from A's perspective)
   - stage: "prospect"
   - category: mapped from match category
   - description: match reason
2. Create a Mujarrad attribute: engagement → match (linked_from)
3. Toast: "Match accepted! Engagement created."

This bridges matching (discovery) to engagements (operations).

## Impact

| Area | Files | Lines (est.) |
|------|-------|-------------|
| Schema + registry | 2 | ~40 |
| MatchListPage | 1 | ~200 |
| MatchCreatePage | 1 | ~250 |
| MatchDetailPage | 1 | ~300 |
| Dashboard matches section | 1 | ~50 |
| Org detail matches tab | 1 | ~80 |
| Sidebar + PortalApp + Router | 3 | ~30 |
| **Total** | **~10 files** | **~950 lines** |

## What This Enables

- SIA admin can now say "these two orgs should work together" and create a match
- Match status tracks whether both parties are interested
- Mutual acceptance auto-creates an engagement (bridging to existing pipeline)
- Org detail shows all potential connections
- Dashboard shows match activity
- Data model is ready for future: partner self-service (Phase B) where partners accept/decline matches themselves, and AI matching (Phase 2) where Wider Labs auto-generates matches

## Status

**PROPOSAL — awaiting approval.**
