# Change: Relationship Aspects, Market Intelligence & Task Board

## Why

The current portal models organizations as flat entities with a single pipeline stage. Reality is different:

1. **Multiple threads per partner** — SIA has concurrent deals, projects, and initiatives with the same organization. An MOU negotiation, a financing discussion, and an embassy introduction can happen in parallel, each at a different stage.
2. **No relationship health signal** — There's no way to measure how strong a partnership is beyond gut feel. The number and progress of active threads IS the signal.
3. **Tasks float in space** — Tasks link to organizations but not to the specific initiative they serve. "Draft MOU" means nothing without knowing which deal it belongs to.
4. **Market intelligence is siloed** — Lead-gen pipelines produce enriched company data (team size, tech stack, ratings, competitive relationships) that has no home in the portal.

## What This Change Introduces

### 1. Relationship Aspects (new entity)

An **aspect** is a discrete thread of engagement with an organization — a deal, project, opportunity, or initiative. It is the unit of work in a relationship.

**Entity: `aspects`**

```
aspects {
  id                  UUID
  title               string        "Cyberjaya Data Center MOU"
  organizationId      FK → orgs     which partner
  stage               enum          prospect | engaged | negotiating | formalized | active | completed | dormant
  category            enum          deal | project | opportunity | initiative | regulatory | diplomatic
  description         string        context and goals
  priority            enum          low | medium | high | critical
  assignedTo          string?       owner within SIA
  startDate           date?         when this thread started
  targetDate          date?         expected completion
  value               string?       deal value or budget estimate
  tags                string[]      free-form labels
  createdBy           string
  createdAt           timestamp
  updatedAt           timestamp
}
```

**Relationships:**
- `aspect → organization` via `organizationId` (belongs_to)
- `task → aspect` via `aspectId` (belongs_to, optional — tasks can still exist without an aspect)
- `note → aspect` via `aspectId` (belongs_to, optional)
- `file → aspect` via `aspectId` (belongs_to, optional)
- `signing-request → aspect` via `aspectId` (belongs_to, optional)

**Stage progression:**
```
prospect → engaged → negotiating → formalized → active → completed
                                                      ↘ dormant
```

Any stage can transition to `dormant` (stalled/paused). `completed` and `dormant` are terminal but can be reopened.

### 2. Relationship Health Score (computed, not stored)

The health of a relationship with an organization is derived from its aspects:

**Stage weights:**
| Stage | Weight |
|-------|--------|
| prospect | 10% |
| engaged | 25% |
| negotiating | 50% |
| formalized | 75% |
| active | 90% |
| completed | 100% |
| dormant | 0% (excluded from average) |

**Score formula:**
```
activeAspects = aspects.filter(a => a.stage !== 'dormant')
if (activeAspects.length === 0) → score = 0, label = "No activity"

averageProgress = sum(weight(a.stage) for a in activeAspects) / activeAspects.length
completedCount = aspects.filter(a => a.stage === 'completed').length

score = averageProgress
volumeBonus = min(completedCount * 5, 20)  // up to +20% for repeat business
finalScore = min(score + volumeBonus, 100)
```

**Labels:**
| Score | Label | Color |
|-------|-------|-------|
| 0 | No activity | gray |
| 1-25 | Exploring | blue |
| 26-50 | Developing | amber |
| 51-75 | Strong | green |
| 76-100 | Strategic | gold |

This is calculated client-side by the SLA engine (extended) — not stored as a node.

### 3. Pipeline Evolution

The pipeline Kanban changes from showing **organizations** to showing **aspects**:

**Current:** Each column = org stage. One card per org.
**New:** Each column = aspect stage. Multiple cards per org. Cards show:
- Aspect title (bold)
- Organization name (subtitle)
- Category badge (deal/project/opportunity)
- Priority indicator
- Target date (if set)
- Task count (e.g., "3 tasks, 1 overdue")

**Drag-and-drop** moves an aspect between stages (with confirmation for backward moves).

**Filters:**
- By organization (see all threads with one partner)
- By category (all deals, all projects)
- By assignee
- By priority

**Organization detail page** gets a new "Aspects" tab showing all aspects for that org, with the health score at the top.

### 4. Task Board View

A new Kanban view for tasks, grouped by aspect:

**Columns:** Each aspect is a column (or swimlane). Tasks within each aspect shown as cards.
**Ungrouped tasks:** Tasks without an `aspectId` go into an "Unassigned" column.
**Card content:** Task title, due date, priority badge, status checkbox.

This is a separate route: `/portal/tasks/board` (the existing `/portal/tasks` list view stays).

### 5. Market Intelligence (restored + extended)

Restore the `market_entity` organization type with intelligence fields:

**Organization types:** partner, investor, vendor, client, market_entity

**Intelligence fields (in nodeDetails):**
- team_size, founded_year, hourly_rate
- google_rating, google_reviews_count
- linkedin_url
- services[], industries_served[], tech_stack[]
- data_sources[] (provenance tracking)

**Inter-org relationships:** Stored as Mujarrad attributes with verbs like `competes_with`, `partners_with`, `supplies_to`. Metadata includes `confidence` (0-100) and `signals[]`.

**UI changes:**
- Detail page: conditional "Market Intelligence" card
- Detail page: "Relationships" tab with confidence bars
- List page: "Source" column with provenance badges
- Form/filter: "Market Entity" type option

### 6. Tasks Link to Aspects

**Schema change:** Add optional `aspectId` to tasks:

```
tasks {
  ...existing fields...
  aspectId            FK → aspects   (optional)
}
```

**UI change:** Task create/edit form gets an "Aspect" dropdown (filtered by selected organization). Task list shows aspect name as a column.

---

## Entity Registry Changes

```typescript
// NEW
aspects: {
  nodeType: "REGULAR",
  titleField: "title",
  requiredFields: ["title", "organizationId", "stage", "category"],
  relationships: [
    { targetResource: "organizations", fkField: "organizationId", verb: "belongs_to", direction: "outgoing" },
  ],
}

// MODIFIED — add optional aspectId
tasks: {
  ...existing...
  relationships: [
    { targetResource: "organizations", fkField: "organizationId", verb: "relates_to", direction: "outgoing" },
    { targetResource: "aspects", fkField: "aspectId", verb: "belongs_to", direction: "outgoing" },  // NEW
  ],
}

// MODIFIED — add optional aspectId
notes: {
  ...existing...
  relationships: [
    ...existing...,
    { targetResource: "aspects", fkField: "aspectId", verb: "belongs_to", direction: "outgoing" },  // NEW
  ],
}

// MODIFIED — add optional aspectId
files: {
  ...existing...
  relationships: [
    ...existing...,
    { targetResource: "aspects", fkField: "aspectId", verb: "belongs_to", direction: "outgoing" },  // NEW
  ],
}

// MODIFIED — add optional aspectId
"signing-requests": {
  ...existing...
  relationships: [
    { targetResource: "aspects", fkField: "aspectId", verb: "belongs_to", direction: "outgoing" },  // NEW
  ],
}
```

## Zod Schemas (new/modified)

```typescript
// NEW
export const aspectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  organizationId: z.string().min(1, "Organization is required"),
  stage: z.enum(["prospect", "engaged", "negotiating", "formalized", "active", "completed", "dormant"]),
  category: z.enum(["deal", "project", "opportunity", "initiative", "regulatory", "diplomatic"]),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  assignedTo: z.string().optional(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
  value: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// MODIFIED — add aspectId
export const taskSchema = z.object({
  ...existing fields...,
  aspectId: z.string().optional(),
});

// RESTORED
export const organizationSchema — type enum includes "market_entity"
```

## Refine Resource (new)

```typescript
{
  name: "aspects",
  list: "/portal/aspects",
  create: "/portal/aspects/create",
  edit: "/portal/aspects/edit/:id",
  show: "/portal/aspects/:id",
  meta: { label: "Aspects", icon: <Layers /> },
}
```

## Routes (new/modified)

```
/portal/aspects              → AspectListPage (table view)
/portal/aspects/create       → AspectFormPage
/portal/aspects/edit/:id     → AspectFormPage (edit mode)
/portal/aspects/:id          → AspectDetailPage (timeline, tasks, notes, files)
/portal/pipeline             → PipelinePage (MODIFIED — shows aspects, not orgs)
/portal/tasks/board           → TaskBoardPage (NEW — Kanban by aspect)
```

## Impact

- **New entity:** aspects (1 new Mujarrad node type)
- **Modified entities:** tasks, notes, files, signing-requests (optional aspectId added)
- **New pages:** AspectListPage, AspectFormPage, AspectDetailPage, TaskBoardPage
- **Modified pages:** PipelinePage (aspects instead of orgs), OrganizationDetailPage (Aspects tab + health score), TaskListPage (aspect column), TaskCreatePage (aspect dropdown)
- **Restored:** market_entity type, intelligence fields, relationships tab, source badges
- **New logic:** Relationship health score calculator (client-side, in sla-engine.ts)
- **Backward compatible:** All existing data works. aspectId is optional everywhere.

## Files Affected (estimated)

| Area | Files | Lines (est.) |
|------|-------|-------------|
| Entity registry + schemas | 2 | ~60 |
| Aspect pages (list, form, detail) | 3 | ~500 |
| Pipeline page (rewrite to aspects) | 1 | ~200 |
| Task board page | 1 | ~250 |
| Org detail (aspects tab + health) | 1 | ~150 |
| Task form/list (aspect dropdown) | 2 | ~50 |
| Market intelligence UI (restore) | 3 | ~250 |
| SLA engine (health score) | 1 | ~80 |
| Router + PortalApp resources | 2 | ~30 |
| **Total** | **~16 files** | **~1,570 lines** |

## Risks

| Risk | Mitigation |
|------|------------|
| Aspect proliferation (too many cards) | Filter by org, category, priority. Completed/dormant hidden by default |
| Performance with many aspects | React Query caching (15s stale). Pagination on list views |
| Health score gaming | Score is read-only, derived. No manual override |
| Migration of existing pipeline data | Existing orgs keep working. Pipeline defaults to showing aspects; if none exist for an org, show a prompt to create one |
| Market entity data stale | data_sources badges show provenance. Manual refresh via re-import |
