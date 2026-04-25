# Tasks: Hardening, Integration & New Modules (Sprint 4)

## 1. R2 Storage Architecture
- [ ] 1.1 Update upload server to accept `path` and `userId` query parameters
- [ ] 1.2 Implement slug generation for org names in R2 keys (`{orgId}-{orgSlug}`)
- [ ] 1.3 Add folder creation endpoint (`POST /folder?path=...`)
- [ ] 1.4 Add folder listing endpoint (`GET /browse?prefix=...`) returning files and subfolders
- [ ] 1.5 Write migration script to move existing `orgs/{orgId}/` files to new `{userId}/organizations/{orgId}-{slug}/files/` structure
- [ ] 1.6 Run migration on existing R2 files (currently: `orgs/org-1/Wider Company Profile.pdf`)
- [ ] 1.7 Build folder browser UI component: breadcrumbs, folder navigation, create-folder dialog
- [ ] 1.8 Update FileUploader to use new path-aware upload endpoint
- [ ] 1.9 Wire download button to R2 via `/download?key=...` endpoint (streaming proxy)
- [ ] 1.10 Add in-browser PDF preview (open in new tab via blob URL)
- [ ] 1.11 Add file versioning support: original/pre-signed/post-signed stage folders
- [ ] 1.12 Update signing flow to copy files to pre-signed/post-signed folders on stage transitions

## 2. Wire Mujarad Backend
- [ ] 2.1 Fix .env.local: change VITE_MUJARRAD_API_URL from localhost:3000 to correct URL
- [ ] 2.2 Fix PortalApp.tsx: wire `mujarradDataProvider` when `VITE_USE_MOCK=false` (currently both branches use mockDataProvider)
- [ ] 2.3 Fix auth provider toggle to use real Mujarad auth when not mock
- [ ] 2.4 Study Mujarad API in depth: test node CRUD, attribute creation, context types, hierarchy traversal against live API
- [ ] 2.5 Create `sia-portal` space in Mujarad if it doesn't exist
- [ ] 2.6 Create context types for current resources: organization, contact, file, note, task, signing-request, pipeline-template, stage-template, checklist-item
- [ ] 2.7 Update mujarrad-data-provider to handle nodeDetails ↔ resource field mapping for each context type
- [ ] 2.8 Handle client-side filtering/sorting (Mujarad GET /nodes currently has no server-side filter params)
- [ ] 2.9 Test getList, getOne, create, update, deleteOne for all resources against live Mujarad API
- [ ] 2.10 Add error handling for Mujarad API failures (toast notifications, retry)
- [ ] 2.11 Seed initial data in Mujarad space (organizations, contacts from current mock seed)

## 3. Graph-Driven Pipeline Module
- [ ] 3.1 Define context types in Mujarad: `pipeline-template`, `stage-template`, `checklist-item-template`, `pipeline-instance`, `stage-instance`, `checklist-item-instance`
- [ ] 3.2 Build pipeline template editor: create template → add stages (ordered) → add checklist items per stage
- [ ] 3.3 Build checklist item types: manual task, document upload, email sent, meeting, signature
- [ ] 3.4 Build pipeline assignment: assign template to organization → create instance nodes with stage/checklist instances
- [ ] 3.5 Build per-instance customization: add/remove/edit stages and items on an instance without altering the template
- [ ] 3.6 Build generic Kanban view component: renders any node set as cards grouped by configurable field
- [ ] 3.7 Implement drag-and-drop between Kanban columns (updates grouping field in Mujarad)
- [ ] 3.8 Build list/table view toggle for same data set
- [ ] 3.9 Build card component: title, type label, completion %, linked org, last activity
- [ ] 3.10 Build label/type filtering on Kanban and list views
- [ ] 3.11 Build stage detail view: checklist with completion tracking, linked documents, percentage bar
- [ ] 3.12 Build hierarchical task view: expand card to see children (L1 mission → L2 stage → L3 task → L4 subtask)
- [ ] 3.13 Build cross-level dependency indicators (blocked tasks whose dependencies are incomplete)
- [ ] 3.14 Log all stage transitions and checklist completions to activity events
- [ ] 3.15 Auto-advance stage when all required checklist items are complete
- [ ] 3.16 Add "Pipeline" nav item to PortalSidebar
- [ ] 3.17 Add pipeline routes to router.tsx (board, template editor, instance detail)
- [ ] 3.18 Build pipeline analytics widget: count per stage, completion chart
- [ ] 3.19 Add pipeline summary to dashboard page
- [ ] 3.20 Build pipeline settings: create/edit/delete pipeline templates from Settings page

## 4. Map View Module
- [ ] 4.1 Install react-simple-maps dependency
- [ ] 4.2 Build MapPage with world map SVG and organization markers
- [ ] 4.3 Map country names to geographic coordinates (lookup table)
- [ ] 4.4 Color markers by pipeline stage
- [ ] 4.5 Add tooltip on marker hover (org name, stage, type)
- [ ] 4.6 Add click-to-navigate to org detail
- [ ] 4.7 Add filter controls: stage, type, status
- [ ] 4.8 Add "Map" nav item to PortalSidebar
- [ ] 4.9 Add map route to router.tsx

## 5. Wire Typesense to Cmd+K
- [ ] 5.1 Connect Typesense search adapter to CommandPalette component
- [ ] 5.2 Implement grouped results (organizations, contacts, files)
- [ ] 5.3 Add type indicators and keyboard navigation
- [ ] 5.4 Test search with typo tolerance

## 6. Email Integration (Resend)
- [ ] 6.1 Install Resend SDK (`resend` npm package)
- [ ] 6.2 Add email sending endpoint to upload server (or separate email server)
- [ ] 6.3 Wire EmailComposeModal to send via Resend API
- [ ] 6.4 Build signing request email template (react-email)
- [ ] 6.5 Build signing reminder email template
- [ ] 6.6 Build signing completion notification email template
- [ ] 6.7 Wire signing flow to send emails at each stage
- [ ] 6.8 Log all sent emails to activity events

## 7. Signature Flow Hardening
- [ ] 7.1 Add "Decline" button and reason dialog to PublicSigningPage
- [ ] 7.2 Update signer status to `declined` with reason stored
- [ ] 7.3 Add signing audit trail events: `signing_viewed`, `field_signed`, `signing_declined`
- [ ] 7.4 Add token expiration field to signing requests (default 30 days)
- [ ] 7.5 Show expiration error page for expired tokens
- [ ] 7.6 Implement "Resend" button on SigningDetailPage (regenerate token if expired)
- [ ] 7.7 Add error boundaries around PDF viewer and assembly
- [ ] 7.8 Notify admin on decline via activity event and optional email

## 8. Standalone Contacts Page
- [ ] 8.1 Build ContactListPage with refine useTable + shadcn table
- [ ] 8.2 Build ContactFormPage (create/edit) with org linking
- [ ] 8.3 Build ContactDetailPage with tabs: Overview, Organizations, Activity, Files
- [ ] 8.4 Add "Contacts" nav item to PortalSidebar (between Organizations and Documents)
- [ ] 8.5 Add contact routes to router.tsx

## 9. UX Polish
- [ ] 9.1 Audit all pages for broken interactions and fix
- [ ] 9.2 Ensure consistent loading skeletons on all data-fetching pages
- [ ] 9.3 Add error states for failed API calls (retry button)
- [ ] 9.4 Mobile responsiveness audit and fixes
- [ ] 9.5 Verify dark mode consistency across new pages
