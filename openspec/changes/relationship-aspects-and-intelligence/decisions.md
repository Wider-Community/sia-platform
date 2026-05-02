# Decisions — Relationship Engagements & Market Intelligence

**Date:** May 2, 2026
**Based on:** 3 audit reports (data architecture, UX/product, implementation feasibility)
**Status:** APPROVED — proceeding with implementation

---

## Decisions

### D1. Naming: "Engagements" (not "Aspects")
- Entity name: `engagements`
- UI label: "Engagements"
- The "engaged" pipeline stage renamed to "in_progress" to avoid collision
- Final stages: `prospect | in_progress | negotiating | formalized | active | completed | dormant`

### D2. Market Intelligence: Separate PR (PR 5)
- Deferred from core change — orthogonal concern
- Ships independently, no dependency on engagements
- ~50-80 lines (detail page + relationships tab already implemented)
- Only needs: schema enum + form dropdown + list page source column

### D3. Migration: Auto-seed + Fallback
- Auto-create one "General" engagement per existing active org
- Seed stage from org's current status (mapped)
- Keep org-based pipeline as secondary "Organizations" tab during transition
- Stage mapping: prospect→prospect, engaged→in_progress, due_diligence→negotiating, negotiation→negotiating, active_partner→active, inactive→dormant

### D4. Health Score → "Engagement Level"
- Renamed from "health score" to "engagement level"
- Formula: average stage weight of active engagements only
- Exclude completed AND dormant from average
- Completed count drives volume context (shown as "X completed" badge)
- No volume bonus in formula — keep it simple
- Subtle badge on org card, not prominent dashboard metric
- Labels: No activity (0) | Exploring (1-25) | Developing (26-50) | Strong (51-75) | Strategic (76-100)

### D5. Phasing: 5 PRs

| PR | What | Est. Lines | Dependencies | Priority |
|----|------|-----------|-------------|----------|
| 1 | Engagements entity + schema + registry + pages (list, form, detail) | ~700 | None | Start here |
| 2 | Link tasks/notes/files/signing-requests to engagements (optional aspectId→engagementId) | ~175 | PR 1 | After PR 1 |
| 3 | Pipeline rewrite (engagements-based Kanban + org fallback tab) | ~325 | PR 1 | After PR 1 |
| 4a | Engagement level score + org detail Engagements tab | ~200 | PR 1 | Parallel with PR 3 |
| 4b | Task board by engagement (Kanban grouped by engagement) | ~350 | PR 1 + PR 2 | After PR 2 |
| 5 | Market intelligence restore (market_entity type + source badges) | ~65 | None | Anytime |

**Total: ~1,815 lines across 5 PRs**

### Additional Items (from audits)

- Add `createdBy` to engagement required fields
- Soft-delete engagements (mark archived, don't hard delete) to avoid orphaned FKs
- Add inactivity alerts (engagement with no activity for N days)
- Add SLA/target date breach warnings on engagements
- Allow inline engagement creation from task form ("+ New Engagement")
- Pipeline: default-hide completed/dormant, show card count per column
- Pipeline: compact mode toggle for dense boards
- Consider adding `organizationId` to signing-requests for consistency
