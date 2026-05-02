# SIA Portal — UX Completeness Audit

**Date:** May 2, 2026
**Branch:** feature/openspec-sprint-1-3
**Audited by:** 6 specialized agents (CRUD, states, navigation, forms, feedback, relationships)

---

## Verdict: NOT PRODUCTION-READY

37 gaps identified across 6 audit dimensions. The portal works for basic flows but has significant UX holes that would frustrate daily use.

---

## Priority 1 — CRITICAL (Must fix before shipping)

| # | Gap | Source | Fix |
|---|-----|--------|-----|
| C1 | **Tasks have no detail/edit/delete pages** | CRUD, Nav, Relations | Create TaskDetailPage, TaskEditPage. Add delete with confirmation. Add routes + resource paths. |
| C2 | **Engagements has no sidebar link** | Nav | Add "Engagements" to PortalSidebar navItems |
| C3 | **~~No success toasts~~** CORRECTED: Refine auto-toasts work. **But signing flows produce toast spam (5-10 toasts)** | Feedback | Suppress intermediate toasts in multi-mutation signing flows |
| C4 | **No error handling in async signing workflows + no global error boundary** | States, Feedback | Signing create/submit only logs to console. Add user-facing error toasts. Add React ErrorBoundary. |
| C5 | **ContactFormPage ignores org pre-fill from URL** | Relations | Add useSearchParams to ContactFormPage, read organizationId and pre-fill |
| C6 | **Org detail contact rows not clickable** | Nav, Relations | Add onClick navigate to /portal/contacts/:id on each contact row |
| C7 | **Task list org/engagement columns not clickable** | Nav, Relations | Replace plain text with Link components |

## Priority 2 — HIGH (Should fix before shipping)

| # | Gap | Source | Fix |
|---|-----|--------|-----|
| H1 | **No global error boundary** | States | Add React ErrorBoundary wrapping portal routes |
| H2 | **Engagement detail notes tab is hardcoded empty** | CRUD, States | Wire notes to engagementId filter (like tasks tab) |
| H3 | **Signing requests disconnected from org/engagement** | Relations | Add org/engagement selector to NewSigningRequestPage, display on detail page |
| H4 | **Task board cards not clickable** | Nav, Relations | Add onClick navigate to task detail (once C1 is done) |
| H5 | **Engagements + signing missing from Cmd+K search** | Nav | Add dynamic search for engagements and signing-requests in CommandPalette |
| H6 | **Contact list uses confirm() instead of AlertDialog** | CRUD, Forms | Replace native confirm with AlertDialog component |
| H7 | **Schema mismatches between form local schemas and schemas.ts** | Forms | Use shared schemas from schemas.ts in all forms, remove local duplicates |
| H8 | **No unsaved-data warning on any form** | Forms | Add Refine's warnWhenUnsavedChanges (already enabled in options but needs form-level support) |
| H9 | **Cascade delete missing — deleting org/engagement orphans children** | Relations | Either prevent delete when children exist, or cascade cleanup |

## Priority 3 — MEDIUM (Fix for polish)

| # | Gap | Source | Fix |
|---|-----|--------|-----|
| M1 | **Notes can't be edited or deleted** | CRUD | Add edit/delete buttons on individual notes in org detail |
| M2 | **SLA rules have no "Add Rule" button** | CRUD | Add create-new-rule form on SlaSettingsPage |
| M3 | **Alerts entity has no UI** | CRUD | Either implement notification center or remove from registry |
| M4 | **Dashboard empty states use plain text, not EmptyState** | States | Replace <p> tags with EmptyState components |
| M5 | **Activity tabs show empty VerticalTimeline with no message** | States | Add empty state when zero events |
| M6 | **ContactFormPage edit mode has no not-found guard** | States | Add check: if id param provided but contact not found, show "Not found" |
| M7 | **Pipeline list tab has no empty state** | States | Add EmptyState when zero engagements |
| M8 | **TaskBoardPage loading state is plain text** | States | Replace "Loading..." with skeleton |
| M9 | **TaskCreatePage has no loading state** | States | Add PageShell loading |
| M10 | **NewSigningRequestPage has no Zod validation** | Forms | Add zodResolver for field validation |
| M11 | **SlaSettingsPage inline edit has no validation** | Forms | Apply slaRuleSchema from schemas.ts |
| M12 | **Task board drag doesn't update denormalized name fields** | Relations | Update engagementName when dragging task between columns |
| M13 | **Engagement tags field is text input but schema expects string[]** | Forms | Parse comma-separated input into array before submit |
| M14 | **Org detail has no tasks tab** | Relations | Add Tasks tab showing tasks filtered by organizationId |
| M15 | **Date fields use native input[type=date]** | Forms | Acceptable but inconsistent with design system |
| M16 | **No pagination on contact list** | CRUD | Add pagination (currently loads all) |
| M17 | **Engagement list has no delete from list page** | CRUD | Add trash icon per row |
| M18 | **SlaSettingsPage missing backTo on PageHeader** | Nav | Add backTo="/portal" |
| M19 | **Google OAuth dynamic import of useGoogleLogin won't work** | Forms | Hooks can't be dynamically imported — needs static import |
| M20 | **Mutations lack error feedback on most pages** | Feedback | Add onError callbacks to useCreate/useUpdate/useDelete |

---

## Audit Source Summary

| Audit | Agent | Gaps Found |
|-------|-------|-----------|
| CRUD completeness | crud-auditor | 11 entity gaps |
| Empty/loading/error states | states-auditor | 18 state gaps |
| Navigation | nav-auditor | 11 nav gaps |
| Forms & validation | forms-auditor | 18 form gaps |
| Feedback & notifications | feedback-auditor | (merged into above) |
| Cross-entity relationships | relationships-auditor | 9 relationship gaps |

---

## Recommended Fix Order

### Sprint A (Critical — 1 day)
1. C1: Task detail/edit/delete pages (~300 lines)
2. C2: Engagements sidebar link (~5 lines)
3. C3: Success toasts on all mutations (~50 lines)
4. C4: Error boundaries + error toasts (~80 lines)
5. C5: ContactFormPage org pre-fill (~10 lines)
6. C6: Clickable contact rows in org detail (~5 lines)
7. C7: Clickable org/engagement in task list (~15 lines)

### Sprint B (High — 1 day)
8. H2: Engagement detail notes tab wired up (~30 lines)
9. H3: Signing request org/engagement link (~40 lines)
10. H4: Task board cards clickable (~5 lines)
11. H5: Engagements + signing in Cmd+K (~20 lines)
12. H6: AlertDialog for contact list delete (~15 lines)
13. H7: Schema consolidation (~-50 lines)
14. H9: Cascade delete protection (~30 lines)
15. H1: Global error boundary (~20 lines)

### Sprint C (Medium — 1 day)
16. M1-M20: Polish items (~200 lines total)

**Total estimated: ~800-900 lines of fixes across 3 sprints.**

---

## What's Working Well

- Organization CRUD is complete and polished
- Engagement CRUD is complete (just needs sidebar link)
- Pipeline Kanban with engagements works (3 tabs: engagements, orgs, list)
- Signing flow (wizard + PDF + signatures) is functional
- Login with error handling works
- Global search (Cmd+K) works for orgs/contacts
- SLA engine computes correctly
- Engagement level score displays on org detail
- React Query caching prevents redundant fetches
- Request dedup layer in MujarradClient works
