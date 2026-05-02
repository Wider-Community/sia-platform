# SIA Portal — PRD Gap Analysis: Built vs. Required

**Date:** May 2, 2026
**Purpose:** Map every PRD/Story Map requirement against what's built, identify the path to the Constitution objective.

---

## Module Coverage Matrix

### M1 — Partner Registry (PRD: Sprint 1, MUST HAVE)

| Story | Status | What Exists | What's Missing |
|-------|--------|-------------|----------------|
| REG-01 Multi-step onboarding | **NOT BUILT** | Org form is admin-facing, single-step | Need: 4-path onboarding wizard (investor/company/gov/startup) with 2-4 fields per step, progress bar, Framer transitions |
| REG-02 Profile completeness | **NOT BUILT** | — | Need: completeness score, prompts on dashboard |
| REG-03 Document upload | **BUILT** | File upload on org detail | Works, but no link to partner profile specifically |
| REG-04 Profile edit with versioning | **PARTIAL** | Org edit form works | Mujarrad versioning logs changes automatically, but no UI to view version history |
| REG-05 Public partner card | **NOT BUILT** | — | Need: toggle public/private, privacy controls, preview card |
| REG-06 Admin verification | **NOT BUILT** | — | Need: verification queue, approve/reject with reason, badge |

### M2 — AI-Powered Matching (PRD: Sprint 2, MUST HAVE)

| Story | Status | What Exists | What's Missing |
|-------|--------|-------------|----------------|
| MATCH-01 Manual match creation | **NOT BUILT** | — | Need: admin selects two orgs → creates match → both see match card |
| MATCH-02 Match cards | **NOT BUILT** | — | Need: match list page, cards with partner info + reason + score |
| MATCH-03 Accept/decline | **NOT BUILT** | — | Need: two-way accept/decline flow, relationship created on mutual accept |
| MATCH-04 Match filtering | **NOT BUILT** | — | Need: filter by country/sector/size/type |
| MATCH-05 Match history | **NOT BUILT** | — | Need: history tab showing all matches |

### M3 — Relationship Management (PRD: Sprint 2, MUST HAVE)

| Story | Status | What Exists | What's Missing |
|-------|--------|-------------|----------------|
| REL-01 Relationship dashboard | **PARTIAL** | Pipeline shows engagements by stage | Missing: org-to-org relationship entity (currently SIA→org only, not org↔org) |
| REL-02 Relationship timeline | **BUILT** | Activity tab on org + engagement detail | Works via VerticalTimeline |
| REL-03 Status progression | **PARTIAL** | Engagement stages exist | Missing: two-party confirmation on stage changes |
| REL-04 Meeting logger | **NOT BUILT** | — | Need: meeting form (date, attendees, summary, outcome) → appended to timeline |
| REL-05 Document sharing in relationship | **PARTIAL** | Files tab on org detail | Not scoped per relationship/engagement |
| REL-06 Notes and tags | **BUILT** | Notes on org + engagement detail, tags on orgs | Works |
| REL-07 Relationship alerts | **PARTIAL** | SLA alerts for staleness | Need: configurable thresholds per relationship |
| REL-08 Health scores | **BUILT** | Engagement level score | Works (computed from engagement stages) |
| REL-09 Kanban view | **BUILT** | Pipeline Kanban with engagements | Works with filters, drag-and-drop |

### M4 — Portfolio Management (PRD: Sprint 3, MUST HAVE)

| Story | Status | What's Missing |
|-------|--------|----------------|
| PORT-01 Portfolio dashboard | **NOT BUILT** | Need: visual summary of assets per org |
| PORT-02 Add portfolio entries | **NOT BUILT** | Need: asset form (name, type, status, sector, valuation) |
| PORT-03 Investor deal tracker | **NOT BUILT** | Need: investor-specific portfolio view |
| PORT-04 Company project registry | **NOT BUILT** | Need: company-specific portfolio view |
| PORT-05 Government program registry | **NOT BUILT** | Need: government-specific portfolio view |
| PORT-06 Shareable portfolio | **NOT BUILT** | Need: read-only link with token |

### M5 — Financial Model (PRD: Sprint 3, MUST HAVE)

| Story | Status | What's Missing |
|-------|--------|----------------|
| FIN-01 Financial model builder | **INVESTOR PORTAL ONLY** | Exists as investor financial model (investor portal), not as partner-facing feature |
| FIN-02 Model types | **NOT BUILT** | Need: type-driven form fields |
| FIN-03 Financial summary card | **NOT BUILT** | Need: standardized output card |
| FIN-04 Visibility controls | **NOT BUILT** | Need: matched-only visibility |
| FIN-05 Investor interest signal | **NOT BUILT** | Need: one-click interest → relationship |

### M6 — Integration Journey (PRD: Sprint 3, Tiers 1-2 MUST HAVE)

| Story | Status | What's Missing |
|-------|--------|----------------|
| INT-01 Journey launcher | **NOT BUILT** | Need: both parties opt in from "engaged" status |
| INT-02 Progress tracker | **NOT BUILT** | Need: visual stepper (Tier 1 → Tier 2) |
| INT-03 Tier 1 sign-off | **NOT BUILT** | Need: define action + digital signature gate |
| INT-04 Tier 2 MOU | **NOT BUILT** | Need: MOU upload + project scope + milestones |
| INT-05 Document vault per journey | **NOT BUILT** | Need: structured storage per tier |
| INT-06 Journey notifications | **NOT BUILT** | Need: step-by-step prompts |

### Admin & Operations

| Story | Status | What Exists | What's Missing |
|-------|--------|-------------|----------------|
| ADMIN-01 Verification queue | **NOT BUILT** | — | Need: queue page for partner document review |
| ADMIN-02 Manual match creation | **NOT BUILT** | — | Need: admin match tool |
| ADMIN-03 Relationship oversight | **PARTIAL** | Pipeline + dashboard | Missing: filter by tier/sector |
| ADMIN-04 Analytics dashboard | **PARTIAL** | Dashboard with KPIs | Simplified — needs enrichment |
| ADMIN-05 Announcements | **NOT BUILT** | — | Need: broadcast system |

### Organization & Team

| Story | Status | What's Missing |
|-------|--------|----------------|
| ORG-01 Create org during onboarding | **PARTIAL** | Org creation exists but not during onboarding flow |
| ORG-02 Invite members by email | **NOT BUILT** | Need: invitation flow |
| ORG-03 Join org via Gmail | **NOT BUILT** | Need: invitation link → OAuth → auto-join |
| ORG-04 Shared workspace | **NOT BUILT** | Current portal is single-user admin |
| ORG-05 Manage team | **NOT BUILT** | Need: members list, remove option |

### Platform Features

| Story | Status | What's Missing |
|-------|--------|----------------|
| NOTIF-01 In-app toasts | **BUILT** | Sonner toasts work |
| NOTIF-02 Email notifications | **NOT BUILT** | Need: email service integration |
| I18N-01 English + Arabic | **PARTIAL** | Landing page has i18n, portal is English-only |
| AUDIT-01 Immutable audit trail | **BUILT** | Activity events auto-logged |

---

## The Gap Between Here and the Constitution

```
WHAT'S BUILT (Internal Operations):
  SIA admin manages orgs, contacts, engagements, tasks, files, signatures
  Pipeline tracks engagement stages
  Dashboard shows KPIs and SLA alerts
  ↓
  This is the BACKBONE — it works.

WHAT'S MISSING (Connection Layer):
  1. MATCHING — org-to-org connection discovery
  2. PARTNER PORTAL — orgs see their own dashboard, not just SIA admin
  3. PORTFOLIO — what each org brings to the table
  4. INTEGRATION JOURNEY — structured tiers for deepening connections
  5. MULTI-USER — teams within orgs, shared workspace
  ↓
  This is the VALUE ENGINE — it doesn't exist yet.
```

---

## Recommended Path Forward

### Phase A: Matching + Opportunities (the connection layer)
**Why first:** Without matching, the platform is a CRM. With matching, it's a marketplace.

| What | PRD Stories | Effort |
|------|-----------|--------|
| Match entity (admin creates org↔org match) | MATCH-01 | M |
| Match list page (partner sees matches) | MATCH-02 | L |
| Accept/decline flow (two-way) | MATCH-03 | M |
| On mutual accept → engagement created | MATCH-03 → REL-01 | S |
| Match filtering (country/sector/size) | MATCH-04 | M |

### Phase B: Partner Self-Service Portal
**Why second:** Partners need to log in and see their own view.

| What | PRD Stories | Effort |
|------|-----------|--------|
| Multi-step onboarding wizard | REG-01 | L |
| Partner Home dashboard | HOME-01 to HOME-04 | L |
| Profile completeness score | REG-02 | M |
| Org invitation flow | ORG-02, ORG-03 | M |
| Team management | ORG-05 | S |

### Phase C: Portfolio + Financial Models
**Why third:** Partners need to present what they have before matching makes sense at scale.

| What | PRD Stories | Effort |
|------|-----------|--------|
| Portfolio entity + CRUD | PORT-01, PORT-02 | L |
| Type-specific portfolio views | PORT-03, PORT-04, PORT-05 | L |
| Financial model builder | FIN-01, FIN-02, FIN-03 | L |
| Visibility controls | FIN-04 | M |
| Interest signals | FIN-05 | S |

### Phase D: Integration Journey (Tiers 1-2)
**Why fourth:** Once matches become engagements, the journey formalizes them.

| What | PRD Stories | Effort |
|------|-----------|--------|
| Journey launcher (both parties opt in) | INT-01 | M |
| Tier 1: Service Level sign-off | INT-03 | M |
| Tier 2: MOU + project scope + milestones | INT-04 | L |
| Document vault per journey | INT-05 | M |
| Progress tracker stepper | INT-02 | M |

### Phase E: Admin Hardening
**Why last:** Admin tools are operational — they serve the platform, not the user.

| What | PRD Stories | Effort |
|------|-----------|--------|
| Verification queue | ADMIN-01 | M |
| Analytics enrichment | ADMIN-04 | M |
| Announcements | ADMIN-05 | M |
| Email notifications | NOTIF-02 | M |

---

## Story Map Coverage Summary

| Module | Total Stories | Built | Partial | Not Built | Coverage |
|--------|-------------|-------|---------|-----------|----------|
| M1 Partner Registry | 6 | 1 | 1 | 4 | 25% |
| M2 Matching | 5 (MVP) | 0 | 0 | 5 | 0% |
| M3 Relationships | 7 (MVP) | 3 | 3 | 1 | 57% |
| M4 Portfolio | 6 (MVP) | 0 | 0 | 6 | 0% |
| M5 Financial Model | 6 (MVP) | 0 | 0 | 6 | 0% |
| M6 Integration Journey | 6 (MVP) | 0 | 0 | 6 | 0% |
| Admin | 5 (MVP) | 0 | 2 | 3 | 20% |
| Organization/Team | 5 | 0 | 1 | 4 | 10% |
| Platform (Auth/Doc/Sig/Notif) | 10 | 4 | 2 | 4 | 50% |
| **Total MVP** | **56** | **8** | **9** | **39** | **30%** |

**We've built 30% of the MVP. The internal operations backbone is solid. The value engine (matching, portal, portfolio, journey) is 0%.**

---

## The Decision Point

The current platform serves **SIA as the operator**. To achieve the Constitution's objective (connect organizations to mutual opportunities), you need the **connection layer** — and that starts with **matching**.

The question: do you want to build matching next (the biggest value-add) or partner self-service next (the biggest operational relief)?

My recommendation: **Matching first.** It's the core value prop. Partners can see matches via email/link even without a full portal. Self-service portal is usability — matching is the product.
