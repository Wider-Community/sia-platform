# Matching System — Requirements & Sprint Plan

**Date:** May 2, 2026
**Phase:** A (Connection Layer)
**PRD Module:** M2 — AI-Powered Matching
**Story Map References:** MATCH-01 through MATCH-05

---

## Requirements

### REQ-A1: Match Entity (MATCH-01)
**As an admin, I can manually create a match between two organizations.**

- Select two organizations from dropdowns (A and B)
- Set match score (0-100 slider)
- Write match reason (why they should connect)
- Select category: investment | partnership | joint_venture | technology | regulatory
- Optionally set sector and expiry date
- Preview both org cards side-by-side before confirming
- Match saved as Mujarrad node with relationships to both orgs

**Acceptance criteria:**
- Admin selects two orgs → creates match → both visible in match list
- Cannot match an org with itself
- Cannot create duplicate match between same two orgs

### REQ-A2: Match List Page (MATCH-02)
**As an admin, I see all matches with status, score, and parties.**

- Table columns: Org A, Org B, Score, Category, Status, Created Date
- Status badges: pending (amber), accepted_a/b (blue), mutual (green), declined (red), expired (gray)
- Filters: by status, by category
- Search: by org name
- Click row → match detail page
- "Create Match" button in header

### REQ-A3: Match Detail Page (MATCH-02)
**As an admin, I see full match details and can manage status.**

- Header: "Match: [Org A] ↔ [Org B]"
- Score visual (progress bar or gauge)
- Reason card (the narrative of why these two should connect)
- Category badge
- Status timeline: when created, who accepted/declined, when
- If mutual: link to auto-created engagement
- Admin actions:
  - Accept on behalf of Org A
  - Accept on behalf of Org B
  - Decline match
  - Expire match
  - Edit reason/score

### REQ-A4: Accept/Decline Flow (MATCH-03)
**As an admin (MVP), I can accept or decline on behalf of either party.**

- Accept Org A → status changes to `accepted_a`
- Accept Org B → status changes to `accepted_b`
- If both accepted → status changes to `mutual`
- On mutual: auto-create engagement (see REQ-A7)
- Decline → status changes to `declined`, record who and why
- Each status change logged as activity event

**Note:** In Phase B (partner portal), partners accept/decline themselves. In MVP, SIA admin does it on their behalf based on conversations/meetings.

### REQ-A5: Match Filtering (MATCH-04)
**As an admin, I can filter matches by criteria.**

- Filter by status: pending, accepted, mutual, declined, expired
- Filter by category: investment, partnership, etc.
- Search by org name (either party)
- Sort by: score (desc), date (desc), status

### REQ-A6: Match History (MATCH-05)
**As an admin, I see the full history of a match.**

- Timeline on match detail page showing:
  - Match created (by whom)
  - Org A accepted/declined (when)
  - Org B accepted/declined (when)
  - Engagement created (if mutual)
- This uses the existing activity-events system

### REQ-A7: Auto-Create Engagement on Mutual Accept
**When both parties accept, an engagement is automatically created.**

- Engagement title: "[Org A] ↔ [Org B] — [category]"
- Organization: Org A (SIA manages from A's perspective)
- Stage: "prospect"
- Category: mapped from match category (investment→deal, partnership→initiative, etc.)
- Description: match reason
- Link match → engagement via Mujarrad attribute
- Toast: "Both parties accepted! Engagement created."
- Match detail page shows link to engagement

### REQ-A8: Dashboard Matches Section
**Dashboard shows recent match activity.**

- "Recent Matches" card showing last 5 matches
- Each shows: Org A ↔ Org B, score, status badge
- KPI cards: Pending matches count, Mutual connections this month
- "Create Match" quick button

### REQ-A9: Organization Detail — Matches Tab
**Each org's detail page shows its matches.**

- New "Matches" tab on OrganizationDetailPage
- Shows all matches involving this org (as A or B)
- Each row: other org name (clickable), score, reason, category, status
- "Create Match" button (pre-fills this org as Org A)
- Count in tab header: "Matches (3)"

### REQ-A10: Sidebar Navigation
**Matches is accessible from the sidebar.**

- Add "Matches" to PortalSidebar between "Engagements" and "Contacts"
- Icon: Link2 (lucide-react)

---

## Sprint Plan

### Sprint A-1: Foundation (Day 1)
- [ ] Match schema in schemas.ts
- [ ] Match entity in entity-registry.ts
- [ ] Match resource in PortalApp.tsx
- [ ] Match routes in router.tsx
- [ ] Matches sidebar link
- [ ] MatchListPage (table with filters)
- [ ] MatchCreatePage (form with org selectors)

### Sprint A-2: Detail + Logic (Day 2)
- [ ] MatchDetailPage (full detail with status management)
- [ ] Accept/decline logic (status transitions)
- [ ] Auto-create engagement on mutual accept
- [ ] Activity event logging for match status changes
- [ ] Dashboard matches section

### Sprint A-3: Integration (Day 3)
- [ ] Organization detail Matches tab
- [ ] Match history timeline
- [ ] QC: test all flows end-to-end
- [ ] Update CONSTITUTION status

---

## Dependency on Existing Systems

| Dependency | Status | Notes |
|-----------|--------|-------|
| Organizations (to match between) | BUILT | Full CRUD |
| Engagements (auto-created on mutual) | BUILT | Full CRUD with pipeline |
| Activity events (for history) | BUILT | Auto-logged by ECL |
| Mujarrad client (for node creation) | BUILT | With request dedup |
| Entity control layer | BUILT | Handles normalize/denormalize |
| Notification provider | BUILT | Sonner toasts |

No new infrastructure needed. Matching builds on top of everything we have.

---

## Future Extensions (Not in This Change)

- **Phase B:** Partners log in and accept/decline their own matches
- **Phase 2:** Wider Labs auto-generates matches from profile analysis
- **Connection map:** Graph visualization of org↔org matches
- **Match suggestions:** AI recommends matches based on portfolio overlap, sector alignment
- **Opportunity board:** Curated feed of opportunities ranked by relevance (MATCH-06)
