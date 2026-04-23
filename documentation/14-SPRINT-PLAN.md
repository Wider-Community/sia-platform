# SIA Portal — Prioritized Sprint Plan

**Version:** 1.0
**Date:** April 2026
**Based on:** 13-PRIORITIZATION-QA.md answers, 12-OPEN-SOURCE-RESOURCES.md stack
**Architect:** Claude (product strategy session)

---

## 1. Sprint Priority Order

Priorities are ordered by a single question: *What stops Omar from losing information today?*

| Sprint | Theme | Rationale |
|--------|-------|-----------|
| **S1** (Weeks 1-2) | **Central Nervous System** — Admin shell + Organization registry + File vault | Replaces WhatsApp/email/web chaos with one screen. Every partner and every file gets a permanent home. Information loss stops on day 1. |
| **S2** (Weeks 3-4) | **Digital Signature Flow** — Upload any doc, place signatures, send for signing, track status | Founder's stated highest-priority module. Eliminates the manual sign-scan-email loop and creates the first external touchpoint (partners receive signing links). |
| **S3** (Weeks 5-6) | **Operations Dashboard** — SLA/OLA tracker, activity timeline, task/reminder system, email notifications | Solves the second pain: "I can't prioritize, I can't track expectations, I can't nurture relationships." Gives Omar a single view of who's overdue and what needs attention. |
| S4 (Weeks 7-8) | **Relationship Pipeline** — Kanban deal stages, relationship health, contact graph | Moves from "organized storage" to "active deal management." |
| S5 (Weeks 9-10) | **Partner Self-Service** — Onboarding forms, partner portal (read-only), notification inbox | Shifts data entry burden from Omar to partners. |
| S6 (Weeks 11-12) | **Reporting & Analytics** — Dashboard charts, PDF report export, corridor metrics | Board-ready outputs. Decision support for matching. |

**This document details Sprints 1-3 only.** Sprints 4-6 will be scoped after S3 ships and real usage data exists.

---

## 2. Sprint 1 — Central Nervous System (Weeks 1-2)

### What Ships

A single-user admin panel where Omar can:
1. Log in (JWT auth against Mujarrad)
2. See all organizations in a searchable, filterable table
3. Create/edit an organization with contacts, type, status, and notes
4. Upload files (PDF/DOCX/XLSX/PPTX) to any organization and browse them
5. Search globally across organizations, contacts, and files

### Architecture Decisions

- **Shell:** Fork `satnaing/shadcn-admin` as the app skeleton. It provides sidebar navigation, dark/light mode, command palette (global search), data tables, form pages, toast notifications, and auth pages — all in our exact stack.
- **Data layer:** Build a Mujarrad data provider following refine.dev's provider pattern (`getList`, `getOne`, `create`, `update`, `delete`). This abstraction means every feature built on top is backend-agnostic. The Mujarrad agent will fill in the API mapping; the frontend codes against the provider interface.
- **State:** Zustand for client state (sidebar, UI preferences). React Query for all server state (organizations, files). No Redux.
- **Tables:** Use `sadmann7/tablecn` patterns for the organization list — server-side pagination, column sorting, toolbar filters, row selection with bulk actions.
- **File upload:** `react-dropzone` for the upload UI (lightweight, hooks-based, pairs with shadcn). Files stored as Mujarrad nodes linked to the organization node.
- **Forms:** `react-hook-form` + `Zod` schemas for all create/edit forms (already in shadcn-admin).

### User Flows

**Flow 1 — Login**
1. Omar opens the app, sees a login page (email + password, Google OAuth button).
2. Credentials sent to Mujarrad auth endpoint. JWT stored in memory (React Query cache) + httpOnly cookie or localStorage fallback.
3. Redirect to dashboard.

**Flow 2 — Organization List**
1. Dashboard sidebar: "Organizations" nav item.
2. Table loads with columns: Name, Type (investor/company/gov/startup), Country, Status (active/prospect/inactive), Primary Contact, Last Activity, File Count.
3. Toolbar: search input, type filter dropdown, status filter dropdown, "Add Organization" button.
4. Click a row to open the organization detail page.

**Flow 3 — Create/Edit Organization**
1. "Add Organization" opens a slide-over panel (not a new page — keeps context).
2. Form fields: Name, Type (select), Country, Website, Description, Tags.
3. Contacts section: add multiple contacts (Name, Role, Email, Phone). Each contact is a sub-form row.
4. Save creates a Mujarrad node (type: `Organization`) with contact nodes linked via relationships.

**Flow 4 — Organization Detail Page**
1. Header: org name, type badge, country, status toggle.
2. Tabs: Overview | Contacts | Files | Notes | Activity.
3. **Overview tab:** key fields, primary contact card, quick stats.
4. **Contacts tab:** table of people linked to this org. Add/edit/remove contacts. A contact can be linked to multiple orgs (relationship graph).
5. **Files tab:** grid/list view of uploaded files. Upload button triggers react-dropzone modal. File card shows: name, type icon, upload date, size. Click to preview (basic — just open in new tab for now; PDF viewer comes in S2).
6. **Notes tab:** simple text notes with timestamps. Markdown optional. This is the "I just got off a call, let me capture this" input.
7. **Activity tab:** auto-generated log of all actions on this org (created, file uploaded, contact added, note added). Simple chronological list — no fancy timeline component yet.

**Flow 5 — Global Search**
1. `Cmd+K` opens the command palette (already in shadcn-admin via cmdk).
2. Search across org names, contact names, file names.
3. Results grouped by type. Click to navigate.

### Open-Source Usage

| Component | Source | What We Take |
|-----------|--------|-------------|
| App shell, sidebar, nav, dark mode, command palette, auth pages, settings page | `satnaing/shadcn-admin` | Fork entire repo as starting point |
| Data tables | `sadmann7/tablecn` | Column definition patterns, toolbar filter patterns, pagination |
| File upload zone | `react-dropzone` | `useDropzone` hook, wrap in shadcn-styled component |
| Forms + validation | `react-hook-form` + `Zod` | Already in shadcn-admin |
| Toasts | `sonner` | Already in shadcn-admin |

### Data Model (Frontend Types)

```
Organization {
  id, name, type, country, website, description,
  status, tags[], contacts[], files[], notes[],
  createdAt, updatedAt
}

Contact {
  id, firstName, lastName, email, phone, role,
  organizationIds[], createdAt, updatedAt
}

FileRecord {
  id, name, mimeType, size, url,
  organizationId, uploadedBy, createdAt
}

Note {
  id, content, organizationId, createdBy, createdAt
}
```

These types map to Mujarrad nodes. The data provider translates between these frontend types and Mujarrad's node/attribute/relationship API.

### Definition of Done — Sprint 1
- [ ] Omar can log in and see a dashboard
- [ ] Omar can create an organization with contacts
- [ ] Omar can upload a file to an organization
- [ ] Omar can add a note to an organization
- [ ] Omar can search across all organizations via Cmd+K
- [ ] Omar can filter/sort the organization table
- [ ] All data persists to Mujarrad (or a mock data provider if Mujarrad integration is not ready)

---

## 3. Sprint 2 — Digital Signature Flow (Weeks 3-4)

### What Ships

A DocuSign-like flow where Omar can:
1. Upload any PDF document
2. View the PDF in-browser with page navigation
3. Place signature fields anywhere on the document (drag and drop)
4. Assign each signature field to a signer (contact from the address book)
5. Send signing requests via email
6. Signers receive a link, view the document, and sign (draw/type/upload)
7. Track signing status (pending/signed/declined) per document
8. Download the final signed PDF

### Architecture Decisions

- **PDF viewing:** `wojtekmaj/react-pdf` to render PDF pages as canvas elements inside the app.
- **PDF manipulation:** `Hopding/pdf-lib` to embed signature images into the final PDF. Runs entirely in-browser — no server-side PDF processing needed.
- **Signature capture:** `szimek/signature_pad` (core engine) wrapped via `react-signature-canvas` for the React component. Three modes: draw on canvas, type (render text as cursive font on canvas), upload image.
- **Signature field placement:** Custom drag-and-drop layer using `@dnd-kit` (already available from the kanban resource). Overlay transparent draggable rectangles on top of the rendered PDF pages. Each rectangle stores: page number, x, y, width, height, assignedSignerId.
- **Email:** `resend/react-email` for the signing request email template. The email contains a unique link to the signing page. Actual SMTP sending will be wired to whatever email service the Mujarrad agent configures.
- **Signing page:** A public (no auth required) page where the signer views the document and provides their signature. Minimal UI — document viewer + signature pad + submit button.

### User Flows

**Flow 1 — Upload Document for Signing**
1. Omar navigates to "Documents" in the sidebar (new nav item).
2. Clicks "New Signing Request."
3. Uploads a PDF via react-dropzone.
4. The PDF renders in the viewer (page-by-page, zoom controls, page navigation).

**Flow 2 — Place Signature Fields**
1. A toolbar appears above the PDF viewer: "Add Signature Field" button.
2. Clicking it creates a draggable/resizable rectangle on the current page.
3. Omar drags the rectangle to the exact position where the signature should appear.
4. A popover on the rectangle lets Omar assign it to a signer (autocomplete from contacts in the address book).
5. Omar can add multiple signature fields across multiple pages for multiple signers.
6. Each field shows the signer's name as a label.

**Flow 3 — Send for Signing**
1. Omar clicks "Send for Signing."
2. A confirmation dialog shows: document name, list of signers with their email addresses, number of signature fields per signer.
3. On confirm, the system:
   - Creates a signing request record (Mujarrad node) linked to the document and the organization.
   - Generates a unique token per signer.
   - Sends an email to each signer with a link: `/sign/{token}`.
   - Sets status to "Pending" for each signer.

**Flow 4 — Signer Signs the Document**
1. Signer clicks the link in the email. No login required.
2. The signing page loads: SIA branding header, PDF viewer showing the full document.
3. The signer's signature fields are highlighted (yellow border, "Sign Here" label).
4. Clicking a signature field opens a modal with three tabs:
   - **Draw:** Canvas powered by signature_pad. Signer draws with mouse/touch. Clear and redo buttons.
   - **Type:** Text input. Renders in a cursive/handwriting font. Live preview.
   - **Upload:** File input for a signature image (PNG/JPG). Preview shown.
5. Signer places their signature in all required fields.
6. Clicks "Complete Signing." Confirmation dialog: "This is legally binding."
7. Signature images are embedded into the PDF using pdf-lib at the exact coordinates.
8. Status updated to "Signed." Timestamp recorded.

**Flow 5 — Track Signing Status**
1. Omar sees a "Signing Requests" table in the Documents section.
2. Columns: Document Name, Organization, Signers (with status badges: pending/signed/declined), Created Date, Last Activity.
3. Click a row to see the detail: PDF preview, signer-by-signer status, ability to resend email to pending signers (manual trigger per Q3 answer).
4. Once all signers have signed, status changes to "Completed." Omar can download the final signed PDF.

**Flow 6 — Resend / Remind**
1. On the signing request detail page, each pending signer has a "Resend" button.
2. Clicking it re-sends the signing email. A toast confirms "Reminder sent to [name]."
3. Activity log records the resend action with timestamp.

### Open-Source Usage

| Component | Source | What We Take |
|-----------|--------|-------------|
| PDF rendering | `wojtekmaj/react-pdf` | `<Document>` and `<Page>` components for in-browser PDF display |
| PDF modification | `Hopding/pdf-lib` | `PDFDocument.load()`, `embedPng()`, `drawImage()` to place signatures on pages |
| Signature drawing | `szimek/signature_pad` via `react-signature-canvas` | Canvas component with draw/clear/undo, export to PNG data URL |
| Drag-and-drop field placement | `@dnd-kit/core` + `@dnd-kit/utilities` | Draggable + droppable for positioning signature fields on PDF pages |
| Email templates | `resend/react-email` | React components for the signing request email |
| File upload | `react-dropzone` | Same as S1 |

### Data Model (Frontend Types)

```
SigningRequest {
  id, documentFileId, organizationId, title,
  status: 'draft' | 'sent' | 'partially_signed' | 'completed' | 'cancelled',
  signatureFields[], signers[],
  createdBy, createdAt, updatedAt
}

SignatureField {
  id, signingRequestId, signerId,
  pageNumber, x, y, width, height,
  status: 'pending' | 'signed',
  signatureImageUrl?, signedAt?
}

Signer {
  id, contactId, email, name,
  token, status: 'pending' | 'signed' | 'declined',
  signedAt?, remindersSent: number, lastReminderAt?
}
```

### Definition of Done — Sprint 2
- [ ] Omar can upload a PDF and view it in-browser with page navigation
- [ ] Omar can place signature fields on specific locations on PDF pages
- [ ] Omar can assign signature fields to contacts and send signing requests
- [ ] A signer can open a link, view the document, and sign via draw/type/upload
- [ ] Signatures are embedded into the final PDF
- [ ] Omar can track signing status (pending/signed) per document
- [ ] Omar can resend reminders to pending signers
- [ ] Omar can download the completed signed PDF

---

## 4. Sprint 3 — Operations Dashboard (Weeks 5-6)

### What Ships

An operations command center where Omar can:
1. See a priority-ranked list of all overdue items across all organizations (SLA/OLA dashboard)
2. View an activity timeline per organization showing the full history of interactions
3. Create and manage tasks/reminders tied to organizations or contacts
4. Receive visual alerts when SLA thresholds are approaching or breached
5. Send email notifications manually (resend invites, follow-ups, reminders)

### Architecture Decisions

- **SLA engine:** Pure frontend logic in Sprint 3. Each organization gets configurable SLA rules (e.g., "respond within 7 days of document send," "sign within 14 days"). The engine compares `lastActivityDate` against the rule's threshold and flags items as: On Track (green), At Risk (amber, <48h remaining), Overdue (red). This runs as a React Query-powered derived state — no backend cron jobs needed yet.
- **Timeline:** `prabhuignoto/react-chrono` in vertical mode for the organization activity timeline. Events sourced from the existing activity log (S1) plus signing events (S2).
- **Tasks:** Simple task model stored as Mujarrad nodes. Not a full project management tool — just: title, description, due date, linked org/contact, status (open/done), priority. Displayed as a filterable table and as a "My Tasks" widget on the dashboard.
- **Dashboard layout:** Extend the shadcn-admin dashboard page with new widgets. Use Recharts (already in shadcn-admin) for simple bar/donut charts.
- **Email notifications:** Build email templates with `resend/react-email` for: follow-up reminders, document submission requests, general messages. Omar triggers sends manually from the UI — no automated sending yet.

### User Flows

**Flow 1 — SLA/OLA Priority Dashboard (Home Screen)**
1. After login, Omar lands on the Operations Dashboard (replaces the generic dashboard from S1).
2. Top section: KPI cards showing:
   - Total organizations (count)
   - Pending signatures (count, links to signing requests)
   - Overdue items (count, red if > 0)
   - Tasks due today (count)
3. Main section: **Priority Queue** — a ranked table of items needing attention.
   - Columns: Organization, Item (e.g., "Unsigned MOU," "No response since intake"), Days Overdue, SLA Status (badge: on-track/at-risk/overdue), Action button.
   - Default sort: overdue first, then at-risk, then on-track.
   - Filters: by organization, by type (signature/response/task), by status.
   - Clicking an item navigates to the relevant detail page (org detail, signing request, task).
4. Right sidebar (or below on mobile): **Today's Tasks** — simple checklist of tasks due today. Check to mark done.

**Flow 2 — Organization Activity Timeline**
1. On the Organization detail page, the Activity tab is upgraded.
2. Uses react-chrono vertical timeline instead of the simple list from S1.
3. Each event shows: icon (by type), title, description, timestamp, actor.
4. Event types: Organization created, Contact added/removed, File uploaded, Note added, Signing request sent, Signature received, Reminder sent, Task created/completed, Email sent.
5. Timeline is chronological (newest first) with infinite scroll or "Load more."

**Flow 3 — Task Management**
1. "Tasks" nav item in the sidebar.
2. Task list table: Title, Organization, Due Date, Priority (high/medium/low), Status (open/done).
3. "Add Task" button opens a form: title, description, due date, priority, linked organization (autocomplete), linked contact (optional).
4. Tasks can also be created from an organization detail page ("Add Task" button on the org page creates a task pre-linked to that org).
5. Overdue tasks automatically appear in the Priority Queue on the dashboard.

**Flow 4 — SLA Configuration**
1. Settings > SLA Rules page.
2. Table of SLA rules: Name, Trigger (e.g., "signing request sent"), Expected Response Time (days), Escalation Threshold (days).
3. Default rules pre-configured:
   - "Signature SLA" — 14 days to sign, at-risk at 12 days.
   - "Onboarding Response" — 7 days to respond, at-risk at 5 days.
   - "Document Submission" — 21 days to submit, at-risk at 17 days.
4. Omar can edit thresholds. Rules are stored locally (Zustand persisted to localStorage) or as Mujarrad config nodes.

**Flow 5 — Manual Email Send**
1. From any organization or contact detail page, Omar clicks "Send Email."
2. A compose modal opens: pre-filled "To" (contact email), subject line, body (rich text or plain text).
3. Optional: attach files from the organization's file vault.
4. "Send" dispatches via the configured email service.
5. The sent email is logged in the organization's activity timeline.

**Flow 6 — Notification Center**
1. Bell icon in the top nav bar (from shadcn-admin shell).
2. Dropdown shows recent alerts: "MOU with [Org] overdue by 3 days," "Task [Title] due tomorrow."
3. Alerts generated client-side from the SLA engine's calculations.
4. Click an alert to navigate to the relevant item.
5. Mark as read / dismiss.

### Open-Source Usage

| Component | Source | What We Take |
|-----------|--------|-------------|
| Activity timeline | `prabhuignoto/react-chrono` | Vertical timeline component for org activity history |
| Dashboard charts | `recharts` (already in shadcn-admin) | Bar chart (items by status), donut chart (orgs by type) |
| KPI stat cards | Custom shadcn/ui cards | shadcn `Card` component styled as KPI widgets |
| Email templates | `resend/react-email` | Reusable email components for follow-ups and reminders |
| Notification toasts | `sonner` (already in stack) | Ephemeral alerts |
| Notification dropdown | Custom shadcn/ui `Popover` | Bell icon + list — no need for Novu yet at single-user scale |

### Data Model (Frontend Types)

```
Task {
  id, title, description, dueDate,
  priority: 'high' | 'medium' | 'low',
  status: 'open' | 'done',
  organizationId?, contactId?,
  createdBy, createdAt, completedAt?
}

SLARule {
  id, name, triggerEvent: string,
  expectedDays: number,
  atRiskDays: number
}

ActivityEvent {
  id, organizationId, type: string,
  title, description, metadata: Record<string, any>,
  actorId, createdAt
}

Alert {
  id, type: 'overdue' | 'at_risk' | 'due_today',
  title, description,
  linkedEntityType: 'organization' | 'signing_request' | 'task',
  linkedEntityId, isRead: boolean,
  createdAt
}
```

### Definition of Done — Sprint 3
- [ ] Dashboard shows KPI cards (total orgs, pending signatures, overdue items, tasks due today)
- [ ] Priority Queue table ranks all overdue/at-risk items across all organizations
- [ ] Organization detail page shows a visual timeline of all activity
- [ ] Omar can create, complete, and filter tasks linked to organizations
- [ ] SLA rules are configurable and drive the at-risk/overdue calculations
- [ ] Omar can send an email to a contact from within the app
- [ ] Bell icon shows alerts for overdue items and upcoming due dates

---

## 5. Open-Source Stack Selection

Final mapping of every tool selected for Sprints 1-3.

| Feature | Primary Tool | Why This One | License |
|---------|-------------|-------------|---------|
| **App shell / layout** | `satnaing/shadcn-admin` | Exact stack match (React 19, Vite, TS, Tailwind, shadcn, Zustand, Recharts, Zod, RHF). 11.8k stars, actively maintained. Ships sidebar, dark mode, command palette, auth pages, data tables, settings. Saves 2+ weeks of boilerplate. | MIT |
| **Data tables** | `sadmann7/tablecn` (patterns) | Most-starred shadcn table implementation. Server-side pagination, auto-generated filters, Notion-style advanced filtering. We extract patterns, not the full Next.js app. | MIT |
| **File upload** | `react-dropzone` | Hooks-based, zero UI opinion, 11k stars. Pairs perfectly with shadcn for custom styled upload areas. Lightweight vs Uppy (which is overkill for MVP). | MIT |
| **PDF viewer** | `wojtekmaj/react-pdf` | Standard React PDF renderer. 9k+ stars. Renders PDF pages as canvas — required for signature field overlay. | MIT |
| **PDF manipulation** | `Hopding/pdf-lib` | In-browser PDF modification. Embed signature images at exact coordinates. No server needed. Zero dependencies. 8.4k stars. | MIT |
| **Signature capture** | `szimek/signature_pad` + `react-signature-canvas` | signature_pad is the gold standard (11.9k stars, zero deps). react-signature-canvas is a thin 150-line React wrapper. Together they provide draw/clear/undo/export-to-PNG. | MIT + Apache 2.0 |
| **Drag-and-drop** | `@dnd-kit/core` | Used for signature field placement on PDF pages (S2) and later for Kanban (S4). Same library used by the react-dnd-kit-tailwind-shadcn-ui reference. | MIT |
| **Activity timeline** | `prabhuignoto/react-chrono` | 4.2k stars. Vertical mode fits org activity feed. Supports custom content, media, nested timelines. | MIT |
| **Dashboard charts** | `recharts` | Already bundled in shadcn-admin. 27k stars. Covers bar, donut, line charts for KPI dashboard. | MIT |
| **Email templates** | `resend/react-email` | Build emails as React components using our existing stack. 18.9k stars. Provider-agnostic — works with any SMTP. | MIT |
| **Forms + validation** | `react-hook-form` + `Zod` | Already in shadcn-admin. Industry standard. | MIT |
| **Client state** | `Zustand` | Already in shadcn-admin. Minimal boilerplate, no providers. | MIT |
| **Server state** | `React Query (TanStack Query)` | Already in shadcn-admin. Caching, background refetch, optimistic updates. | MIT |
| **Toast notifications** | `sonner` | Already in shadcn-admin. shadcn/ui official integration. | MIT |

### What We Evaluated But Did NOT Select (and Why)

| Tool | Reason for Rejection |
|------|---------------------|
| `uppy` | Overkill for MVP. We need simple drag-and-drop upload, not resumable uploads, webcam capture, or Dropbox import. react-dropzone is sufficient. |
| `filepond` | Same reasoning as uppy. Plugin architecture adds complexity without MVP value. |
| `novu` | Notification infrastructure for multi-user apps with channels (email, SMS, push). Omar is the only user right now. A shadcn Popover with a list is enough. Revisit in S5 when partners get portals. |
| `formity` / `stepperize` | Multi-step form wizards needed for partner self-onboarding (S5), not for admin CRUD (S1-S3). Deferred. |
| `atomic-crm` | Great patterns for activity timelines and deal pipelines, but it's built on react-admin (different data layer). We study its UX, but don't fork it. Patterns inform S4 (Relationship Pipeline). |
| `react-dnd-kit-tailwind-shadcn-ui` | Kanban board needed in S4, not S1-S3. The underlying `@dnd-kit` library IS used in S2 for signature field placement. |
| `react-chrono` alternatives | `react-vertical-timeline` is simpler but less capable. react-chrono's custom content rendering and nested timeline support justify the slightly larger bundle. |

---

## 6. What We Are NOT Building Yet

### Deferred to Sprint 4+ (Planned)

| Feature | Why Deferred | Planned Sprint |
|---------|-------------|---------------|
| **Kanban deal pipeline** | Omar needs to store and find information before he can manage deal stages. Pipeline assumes organized data exists. | S4 |
| **Relationship health scores** | Requires historical data from S1-S3 usage to be meaningful. | S4 |
| **Contact graph visualization** | Useful but not urgent. The multi-org contact linking from S1 captures the data; visualization can wait. | S4 |
| **Partner self-service portal** | Partners need to log in, view their org, upload files, fill forms. Requires auth for external users, role-based access, and onboarding wizard. Not needed while Omar is the only user. | S5 |
| **Multi-step onboarding forms** | Partners fill out intake forms (formity/stepperize). Blocked on partner portal. | S5 |
| **Novu notification center** | Multi-channel notifications for partners. Single-user admin doesn't need this. | S5 |
| **PDF report generation** | Board-ready corridor reports (@react-pdf/renderer, pdfme). Needs data to exist first. | S6 |
| **Dashboard analytics** | Recharts-powered analytics (deal volume, sector breakdown, corridor metrics). Needs enough data to be meaningful. | S6 |

### Deferred Indefinitely (Not in MVP)

| Feature | Why Not Now |
|---------|------------|
| **Document parsing/extraction** | Founder explicitly said "not in MVP." Store files only. |
| **AI matching engine** | "Matching decisions go to the Board." AI matching is a product differentiator but depends on having a populated organization registry first. |
| **Collaborative document editor** | Plate/Tiptap + Yjs real-time editing. Significant build. Partners need basic access before they need to co-edit. |
| **Business Model Canvas** | Value-add feature, not a pain-point solver. |
| **OKR / Goal management** | Internal team tool. Omar is solo right now. |
| **Chat / Deal rooms** | Real-time messaging. Premature — Omar's communication happens on WhatsApp and that's fine for now. The portal solves storage and tracking, not communication. |
| **AI chat interface** | Advisory agent. Requires AI infrastructure and training data. |
| **Subscription / Paywall** | No paying customers yet. Build when partners are onboarded and pricing is validated. |
| **Gantt charts / Milestones** | Program management visualization. Needs project/deal data from S4+. |
| **Compliance checklists** | Regulatory workflows. Important but not the first pain point. |
| **i18n / RTL (Arabic)** | Architecture supports it (react-i18next in stack), but English-only for MVP. Arabic added when KSA partners start using the portal. |
| **Onboarding tours** | react-joyride guided tours. No external users to onboard yet. |
| **Legal document templates** | Accord Project template library. Requires the document editor and a template management UI. |

### Key Principle

Everything deferred is deferred because it either:
1. **Requires data that doesn't exist yet** (analytics, AI matching, health scores)
2. **Requires users that don't exist yet** (partner portal, notifications, onboarding)
3. **Doesn't solve the core pain** (information loss, inability to organize, inability to track)

Sprints 1-3 solve the core pain. Everything else builds on top of that foundation.

---

## Appendix: Data Provider Interface

All sprints build on a single data provider abstraction (inspired by refine.dev). This is the contract between the frontend and Mujarrad. The Mujarrad agent implements this interface.

```typescript
interface DataProvider {
  getList(resource: string, params: {
    pagination?: { page: number; perPage: number };
    sort?: { field: string; order: 'asc' | 'desc' };
    filter?: Record<string, any>;
  }): Promise<{ data: any[]; total: number }>;

  getOne(resource: string, params: {
    id: string;
  }): Promise<{ data: any }>;

  create(resource: string, params: {
    data: Record<string, any>;
  }): Promise<{ data: any }>;

  update(resource: string, params: {
    id: string;
    data: Record<string, any>;
  }): Promise<{ data: any }>;

  delete(resource: string, params: {
    id: string;
  }): Promise<{ data: any }>;

  // S2 addition
  upload(resource: string, params: {
    file: File;
    meta: Record<string, any>;
  }): Promise<{ data: any }>;
}
```

Resources: `organizations`, `contacts`, `files`, `notes`, `signing-requests`, `signature-fields`, `tasks`, `sla-rules`, `activity-events`.
