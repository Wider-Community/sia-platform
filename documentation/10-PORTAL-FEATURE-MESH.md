# SIA Portal — Feature Mesh & Implementation Strategy

## Software Category

**Deal Flow CRM with Client Portal and Configurable Workflow Engine**

Also known as: B2B Investment Portal, Investor Intake & Deal Management Platform.

---

## Architecture Model

```
Phase 1 (MVP): Hardcoded workflows in frontend, Mujarrad stores data
Phase 2 (Full): XyOps configures processes, Mujarrad stores data, Tally.so-style dynamic forms
```

```
User → Google Login (Mujarrad) → Select request type → Tally-style form → Submit
    → Dashboard: see all requests + status
    → Request detail: timeline, documents, signatures
```

**MVP principle:** Simple, working, clean. Configure later.

---

## Modules (Deduplicated)

| # | Module | MVP Scope | Phase 2 | Reference |
|---|--------|-----------|---------|-----------|
| **1** | **Authentication** | Google OAuth via Mujarrad. JWT in Zustand + localStorage. Protected routes | Add email/password option | Mujarrad-Frontend (own) |
| **2** | **Business Profile & Organizations** | Shared org account. Invite members by email → they sign up with Gmail → join same org. All members have equal access. Org profile: company name, registration, country, sector, description | Teams under org with role-based access | — |
| **3** | **Request Intake (Tally-style)** | One-question-at-a-time flow (like Tally.so). Clean, focused, conversational. 3 request types hardcoded: Deal Inquiry, Partnership, Consultation. Each type has its own question sequence | Dynamic form builder. Mujarrad-Frontend upgraded to Tally-style form engine. Admin creates form sequences | Tally.so (UX reference), Mujarrad-Frontend (base to upgrade) |
| **4** | **Process Stages** | Hardcoded stages per request type. Linear progression. Status stored in Mujarrad | XyOps integration for configurable process definitions. Each step as a workflow node. Branching, parallel stages, conditions | XyOps (own) |
| **5** | **Status Dashboard** | User sees all org requests in a table. Each shows: type, current stage, progress bar, date submitted. Click to see detail | Filters, search, sort. Kanban view for admin | shadcn-admin (Vite + shadcn) |
| **6** | **Request Detail & Timeline** | Vertical timeline: every stage change, document upload, signature event. Current stage highlighted. Next action shown | Comments, internal notes (admin-only) | Peppermint (ticket history) |
| **7** | **Document Management** | Upload files per request. View/download. Tied to specific stage. Org-level document storage | Version history, permission controls per doc | Papermark |
| **8** | **Digital Signatures** | Sign documents within the platform. Single signer or multi-signer. Signature request as a stage action: SIA uploads doc → user(s) sign → process advances. Audit trail per signature | Signature templates, bulk signing, legally binding with timestamp + IP | Documenso (Next.js + TS, 9k stars, MIT) |
| **9** | **Notifications** | In-app toasts (sonner, already installed). Email on key events: new signature request, stage change, invitation to org | Configurable templates, digest mode, notification preferences | sonner (installed) |
| **10** | **Localization (i18n)** | Arabic RTL + English LTR. All UI, form questions, stage labels | Workflow labels bilingual in Mujarrad | react-i18next (already implemented) |
| **11** | **Audit Trail** | Automatic via Mujarrad node versioning. Every state change, signature, upload logged | Exportable audit report for compliance | Mujarrad versioning (built-in) |

**Removed:** Meeting & Calendar (users meet externally), Admin Workflow Designer (Phase 2 via XyOps), Reporting & Analytics (Phase 2), Process Type Registry (Phase 2 via XyOps).

---

## Organization & Team Model (MVP)

```
Organization (shared account)
├── Owner (whoever created it)
├── Member (invited via email, signs up with Gmail, same access as owner)
├── Member
└── Member

All members see the same requests, documents, and org profile.
No roles in MVP — everyone has equal access.
```

**Invitation flow:**
1. Owner goes to Org Settings → Invite Member
2. Enters email address
3. Invitee receives email with signup/login link
4. Invitee signs up or logs in with Gmail
5. Invitee is automatically added to the org
6. Both see the same dashboard, requests, documents

---

## Signature Flow

```
1. SIA team uploads a document to a request (e.g., NDA, term sheet)
2. SIA marks which users need to sign (one or multiple from the org)
3. Each signer gets a notification
4. Signer opens document → reviews → draws/types signature → submits
5. Once all required signers complete → document is finalized
6. Signed document with audit trail (timestamp, IP, signer identity) stored
7. If signature was a stage requirement → process automatically advances
```

---

## Tally.so-Style Form Experience

Instead of a traditional form with all fields visible, the intake experience is conversational:

```
Screen 1: "What type of request?"
           [Deal Inquiry]  [Partnership]  [Consultation]

Screen 2: "What's your company name?"
           [____________________]

Screen 3: "Which sector?"
           [Halal & Food]  [Healthcare]  [Real Estate]  ...

Screen 4: "Estimated deal size?"
           [$2M-$5M]  [$5M-$15M]  [$15M-$50M]

Screen 5: "Tell us about the opportunity"
           [textarea]

Screen 6: "Upload any supporting documents"
           [Drop files here]

Screen 7: ✓ "Request submitted! We'll review within 48 hours."
```

- One question per screen
- Progress bar at top
- Keyboard navigation (Enter to advance)
- Smooth transitions (Framer Motion)
- Mobile-first
- Builds on Mujarrad-Frontend (upgrade to this UX)

---

## Pages (MVP)

| Route | Page | Auth Required |
|-------|------|--------------|
| `/` | Landing page (current SIA website) | No |
| `/login` | Google OAuth login | No |
| `/onboarding` | Create or join org + business profile setup | Yes |
| `/dashboard` | Request list + status overview | Yes |
| `/request/new` | Tally-style intake form | Yes |
| `/request/:id` | Request detail + timeline + documents + signatures | Yes |
| `/settings` | Org profile, members, invitations | Yes |

---

## Components Needed (MVP)

| Component | shadcn/ui Components | New or Copy |
|-----------|---------------------|-------------|
| GoogleLoginButton | Button | Copy from Mujarrad-Frontend |
| AuthStore (Zustand) | — | Copy from Mujarrad-Frontend |
| ProtectedRoute | — | Copy from Mujarrad-Frontend |
| OrgOnboarding | Card, Input, Button | New |
| TallyForm (one-question-at-a-time) | Input, Select, Textarea, Button, Progress | New (core component) |
| ProcessTypeSelector | Card, Badge | New |
| RequestList | Table, Badge, Progress | New |
| RequestDetail | Card, Badge, Separator | New |
| StatusTimeline | — (Framer Motion custom) | New |
| DocumentUpload | Input, Button, Card | New |
| SignatureCanvas | Dialog, Button | New (canvas-based) |
| SignatureRequest | Card, Badge, Button | New |
| OrgSettings | Input, Button, Table, Dialog | New |
| InviteMember | Dialog, Input, Button | New |
| DashboardLayout | Sidebar, ScrollArea | Reference shadcn-admin |

---

## Hardcoded Workflows (MVP)

### Deal Inquiry
```
Submission → SIA Review → Initial Assessment → Documentation & Signatures → In Progress → Completed
```
Form: company, sector, deal type, deal size, target market, description, documents

### Partnership Request
```
Application → Review → Due Diligence → Documentation & Signatures → Onboarding → Active
```
Form: company, registration, partnership type, expertise areas, track record, references

### General Consultation
```
Request Submitted → Under Review → Response Sent → Completed
```
Form: name, company, role, topic, preferred language, message

---

## Open Source Reference Matrix

| What | From | Stars | Stack Match |
|------|------|-------|-------------|
| Dashboard shell (sidebar, tables) | satnaing/shadcn-admin | 11.8k | **Exact** (Vite + React + TS + shadcn) |
| Auth (Google OAuth, store, protected routes) | Mujarrad-Frontend (own) | — | **Exact** |
| Tally-style form UX | Tally.so | — | UX reference only |
| Form engine base | Mujarrad-Frontend (own) | — | To be upgraded |
| Ticket lifecycle (submit → track) | Peppermint | 3.1k | Medium (Next.js) |
| Digital signatures | Documenso | 9k | High (Next.js + TS + Prisma) |
| Document sharing | Papermark | 6k | High (Next.js + TS) |
| CRM deal patterns | NextCRM | 579 | High (Next.js + shadcn) |

---

## Fastest Implementation Path

1. **Auth** — Copy Google OAuth from Mujarrad-Frontend, adapt for Vite
2. **Routing** — Add react-router-dom, set up pages (landing, login, dashboard, request, settings)
3. **Org onboarding** — Simple org creation form, store in Mujarrad
4. **Tally-style form** — Build the one-question-at-a-time component with Framer Motion transitions
5. **3 request types** — Hardcoded question sequences, submit to Mujarrad API
6. **Dashboard** — Fetch requests, render with shadcn Table + Badge + Progress
7. **Request detail** — Timeline + document list + signature status
8. **Signatures** — Canvas-based signature capture, multi-signer support, PDF embedding
9. **Invitations** — Invite by email, join org on signup
10. **Replace CTAs** — All "Schedule a Conversation" → "Get Started" → login flow
