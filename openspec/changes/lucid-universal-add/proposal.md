# Change: Lucid — Universal Quick-Add Component

## Why

The portal currently has multiple "Add" buttons scattered across pages — "New Task" on the task page, "New Engagement" on the engagement page, "Add Contact" on the org detail page, "New Task" on the org detail page. Each navigates to a different form on a different page. This creates friction:

1. **Context switching** — You're on an org page, you want to log a task, you navigate away, fill a form, submit, then navigate back. You've lost your place.
2. **No universal entry point** — There's no single "capture this thought" action. If you just came out of a meeting and need to quickly log a task, a note, and an engagement, that's three different buttons on three different pages.
3. **Rigid typing** — Each button creates exactly one entity type. But often the user doesn't know the type upfront — "I need to log this thing" comes before "is this a task or a note or an engagement?"

## What: The Lucid Component

**Lucid** is a universal quick-add popup that replaces all individual "Add X" buttons with a single action. When the user clicks Lucid, a popover/modal appears with:

1. **Type selector** — What are you creating? Task | Engagement | Note | Contact | Signing Request
2. **Contextual fields** — Based on the selected type, show the minimum required fields inline (not a full form page)
3. **Pre-filled context** — If opened from an org page, `organizationId` is pre-filled. If opened from an engagement detail, both `organizationId` and `engagementId` are pre-filled.

### User Flow

```
User clicks "+" (Lucid button)
       |
       v
Popup appears: "What would you like to add?"
  [ Task ]  [ Engagement ]  [ Note ]  [ Contact ]  [ Document ]
       |
       v (user picks "Task")
Inline form appears in the popup:
  Title: [________________]
  Due Date: [____]  Priority: [med v]
  Organization: [Pre-filled if context known]
  Engagement: [Optional dropdown]
  [Create]  [Cancel]
       |
       v
Created. Toast confirmation. Popup closes.
User stays on the same page.
```

### Where Lucid Appears

| Location | Context Pre-filled | Replaces |
|----------|-------------------|----------|
| Global header (always visible) | None | New — no existing equivalent |
| Organization detail page | organizationId, organizationName | "New Task", "Add Contact", "New Engagement" buttons |
| Engagement detail page | engagementId, organizationId | "New Task" button |
| Task list page | None | "New Task" button |
| Pipeline page | None | — (no add button currently) |
| Dashboard | None | — (new) |

### Type-Specific Inline Fields

Each type shows minimal fields for quick capture. Full editing happens on the entity's own page after creation.

| Type | Inline Fields | Auto-filled |
|------|--------------|-------------|
| **Task** | Title*, Due Date*, Priority | organizationId, engagementId (from context), status="open", createdBy |
| **Engagement** | Title*, Category, Stage | organizationId (from context), priority="medium", createdBy |
| **Note** | Content* | organizationId, engagementId (from context), createdBy |
| **Contact** | First Name*, Last Name*, Email, Role | organizationId (from context) |
| **Document** | File upload, Title | organizationId, engagementId (from context) |

`*` = required

### Component Architecture

```
LucidButton (trigger — "+" icon or "Add" button)
  └── LucidPopover (popup container)
       ├── TypeSelector (icon grid: Task, Engagement, Note, Contact, Document)
       └── InlineForm (appears after type is selected)
            ├── Fields vary by type
            ├── Context fields (org, engagement) pre-filled and optionally editable
            ├── Create button (calls useCreate from refine)
            └── Cancel button (closes popover)
```

### Design Principles

1. **Stay in context** — Never navigate away. Create and continue.
2. **Minimum viable fields** — Quick capture, not full form. User can always edit later.
3. **Type is a choice, not a constraint** — The Lucid button doesn't assume what you want. You decide.
4. **Progressive disclosure** — Show type selector first, then fields. Don't overwhelm.
5. **Extensible** — New entity types can be added to Lucid's type registry without changing the component structure.

## Entity Types Registry (for Lucid)

```typescript
interface LucidType {
  id: string;                    // "task" | "engagement" | "note" | "contact" | "document"
  label: string;                 // "Task"
  icon: LucideIcon;             // CheckSquare
  resource: string;              // refine resource name
  fields: LucidField[];         // inline form fields
  defaults: Record<string, unknown>;  // auto-filled values
}

interface LucidField {
  name: string;                  // field key
  label: string;                 // display label
  type: "text" | "textarea" | "date" | "select" | "file";
  required: boolean;
  options?: { value: string; label: string }[];  // for select type
}
```

This registry makes Lucid data-driven — adding a new type is a config change, not a component rewrite.

## Context Propagation

Lucid receives context from its parent:

```typescript
interface LucidContext {
  organizationId?: string;
  organizationName?: string;
  engagementId?: string;
  engagementName?: string;
}
```

When opened from an org page, the context includes `organizationId`. The inline form shows the org name as a read-only badge (editable via dropdown if the user wants to change it).

## What Changes in Existing Pages

| Page | Current | After Lucid |
|------|---------|-------------|
| TaskListPage | "New Task" button → navigates to /portal/tasks/create | "New Task" button replaced by Lucid button (pre-selected to Task type) |
| OrganizationDetailPage | Multiple add buttons (Task, Contact, Engagement) | Single Lucid button in header, pre-filled with org context |
| EngagementDetailPage | "New Task" button | Lucid button, pre-filled with engagement + org context |
| Global header | None | Lucid "+" button always visible |
| TaskCreatePage | Full-page form | Still exists for complex task creation. Lucid is for quick capture. |

**The full-page forms are NOT removed.** Lucid is for quick capture. The full forms remain for when the user needs all fields, validation feedback, and detailed editing.

## Impact

- **New component:** LucidButton, LucidPopover, LucidTypeSelector, LucidInlineForm
- **New file:** `src/portal/components/Lucid.tsx` (single file, all subcomponents)
- **Modified pages:** TaskListPage, OrganizationDetailPage, EngagementDetailPage, PortalHeader
- **No schema changes** — uses existing entity schemas and refine resources
- **No data layer changes** — uses existing `useCreate` hooks

## Files Affected (estimated)

| Area | Files | Lines (est.) |
|------|-------|-------------|
| Lucid component (button + popover + type selector + inline forms) | 1 | ~350 |
| PortalHeader (add global Lucid button) | 1 | ~10 |
| OrganizationDetailPage (replace add buttons) | 1 | ~-30 / +15 |
| EngagementDetailPage (replace add button) | 1 | ~-10 / +10 |
| TaskListPage (replace add button) | 1 | ~-5 / +10 |
| **Total** | **5 files** | **~350 net new** |

## Tasks

- [ ] Design Lucid type registry with all 5 entity types and their inline fields
- [ ] Build LucidButton trigger component (icon button with tooltip)
- [ ] Build LucidPopover container (shadcn Popover or Dialog)
- [ ] Build LucidTypeSelector (icon grid with labels)
- [ ] Build LucidInlineForm (dynamic form based on selected type)
- [ ] Wire useCreate for each entity type with proper defaults
- [ ] Add Lucid to PortalHeader (global)
- [ ] Add Lucid to OrganizationDetailPage (with org context)
- [ ] Add Lucid to EngagementDetailPage (with engagement + org context)
- [ ] Replace "New Task" on TaskListPage with Lucid (pre-selected Task type)
- [ ] Test: create each entity type via Lucid from different page contexts
- [ ] Test: verify created entities appear in their respective list pages
- [ ] Test: verify context pre-fill works correctly

## Risks

| Risk | Mitigation |
|------|------------|
| Inline form too cramped for complex entities | Keep fields minimal. Full form still available. |
| Users confused by type selector | Show most common types first (Task, Note). Use clear icons. |
| Popover dismissed accidentally | Use Dialog (modal) instead of Popover on mobile |
| File upload in popup is awkward | Document type could open the full file upload flow instead |
| Scope creep — adding more types | Type registry is extensible but start with 5 |

## Status

**PROPOSAL — awaiting approval.** No code written.
