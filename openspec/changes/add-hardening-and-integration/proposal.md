# Change: Hardening, Integration & New Modules (Sprint 4)

## Why
Sprints 1-3 delivered a working UI shell with mock data (localStorage). To make the portal production-ready, we need to: (1) wire the real Mujarad knowledge graph backend, (2) implement a multi-tenant R2 folder structure with file versioning across signing stages, (3) build a graph-driven pipeline system where stages, checklists, and hierarchies are all Mujarad nodes — fully configurable at runtime, (4) add a geographic map view, (5) harden the signature flow, (6) wire Typesense search and Resend email, and (7) build standalone contacts.

## What Changes

### 1. Wire Mujarad Backend
- Fix PortalApp.tsx provider toggle (currently both branches point to mockDataProvider)
- Fix .env.local (currently points to localhost:3000 which is Discourse, not Mujarad)
- Wire `mujarradDataProvider` and real `authProvider` when `VITE_USE_MOCK=false`
- Create context types in Mujarad for all resource types
- Organizations stored as regular nodes for now; will migrate to dedicated entity API when Mujarad releases it
- Client-side filtering needed (Mujarad GET /nodes has no server-side filter params currently)
- API: `https://mujarrad.onrender.com/api` (v0.5.0), Swagger at `/swagger-ui/index.html`

### 2. R2 Storage Architecture (Multi-Tenant, Versioned)
- Redesign R2 folder structure to be user-scoped and stage-aware:
  ```
  {userId}/
  ├── profile/                    # User's own files
  ├── templates/                  # User's uploaded templates
  └── organizations/
      └── {orgId}-{orgSlug}/
          ├── general/            # General org files
          └── files/
              └── {fileId}-{fileSlug}/
                  ├── original/   # Original uploaded version
                  ├── pre-signed/ # Version sent for signing
                  └── post-signed/# Completed signed version
  ```
- Upload server updated to accept `path` and `userId` parameters
- File browser UI with folder navigation, breadcrumbs, and create-folder
- File download wired to R2 (currently no-op)
- Migration of existing file: `orgs/org-1/Wider Company Profile.pdf`

### 3. Graph-Driven Pipeline Module (Mujarad-Powered)
- **NOT hardcoded stages** — all pipeline structures are Mujarad nodes and relationships
- Pipeline templates: create reusable templates with ordered stages and checklist items
- Pipeline instances: assign template to an org, then customize per-instance without altering the template
- Checklist items: each stage has a checklist; completing all items = stage complete (percentage tracking)
- Checklist item types: manual task, document upload, email sent, meeting, signature obtained
- Linked actions: checklist items can reference documents, emails, meetings via Mujarad relationships
- Hierarchical tasks: L1 (mission) → L2 (stage) → L3 (task) → L4 (subtask), with cross-level dependencies
- Generic Kanban view: renders any node set as cards grouped by configurable field, drag to change
- List/table view toggle for same data
- Label/type filtering on both views
- Default stages (configurable): prospect → engaged → due_diligence → negotiation → active_partner → inactive
- Pipeline analytics on dashboard

### 4. Map View Module
- Global world map visualization of organizations (react-simple-maps, SVG-based)
- Markers colored by pipeline stage, clustered by country
- Click marker → org detail; filter by stage/type/status

### 5. Wire Typesense to Cmd+K
- Connect existing search adapter to command palette
- Grouped results: organizations, contacts, files
- Typo tolerance

### 6. Email Integration (Resend)
- Wire EmailComposeModal to actually send via Resend API
- Signing notifications: send, remind, complete, decline
- All sent emails logged to activity events

### 7. Signature Flow Hardening
- Decline flow (signer can decline with reason)
- Signing audit trail (viewed, signed, declined timestamps)
- Token expiration (configurable, default 30 days)
- Resend functionality (regenerate expired tokens)
- Error boundaries around PDF assembly

### 8. Standalone Contacts Page
- Full CRUD contacts page independent of org context
- Contact detail page with tabs
- Link contacts to organizations

### 9. UX Polish
- Fix broken interactions, consistent loading/error states, mobile audit, dark mode audit

## Impact
- Affected specs: storage-architecture (NEW), relationship-pipeline (NEW), map-view (NEW), contacts-management (NEW), email-integration (NEW), signature-hardening (MODIFIED)
- Affected code: All providers, upload server, all pages, new pipeline/map/contacts pages, router, sidebar
- New dependencies: react-simple-maps (map), resend (email)
- **BREAKING**: R2 folder structure changes require migration. Provider toggle fix changes data source.
- 9 workstreams, 70+ tasks
