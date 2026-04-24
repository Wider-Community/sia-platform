# Tasks: Digital Signature Flow

## Phase 1 — Research
- [x] 1.1 Study react-pdf (wojtekmaj): PDF rendering, page navigation, zoom, canvas output
- [x] 1.2 Study pdf-lib (Hopding): PDF loading, image embedding at coordinates, page manipulation
- [x] 1.3 Study signature_pad + react-signature-canvas: draw/clear/undo, export to PNG data URL, canvas resolution
- [x] 1.4 Study @dnd-kit/core: draggable/droppable patterns, coordinate tracking, overlay positioning on canvas
- [x] 1.5 Study react-email: template components, HTML rendering, provider-agnostic sending
- [x] 1.6 Study Gotenberg: Docker deployment, HTML-to-PDF API, Chromium rendering, LibreOffice routes for DOCX/XLSX/PPTX (future)
- [x] 1.7 Study Documenso (AGPL — UX patterns only): signature field placement UX, multi-signer flow, status tracking
- [x] 1.8 Document research findings and gaps

## Phase 2 — Design
- [x] 2.1 Create ERD: SigningRequest, SignatureField, Signer nodes and relationships to Organization, Contact, FileRecord in Mujarrad
- [x] 2.2 Create sequence diagram: full signing flow (upload → place fields → assign signers → send → sign → assemble PDF)
- [x] 2.3 Create state diagram: signing request lifecycle (draft → sent → partially_signed → completed → cancelled)
- [x] 2.4 Create state diagram: signer lifecycle (pending → signed → declined)
- [x] 2.5 Design public signing page architecture: token-based access outside `<Authenticated>`, rate limiting
- [x] 2.6 Design PDF coordinate system: how signature field positions map between react-pdf canvas and pdf-lib embedding
- [x] 2.7 Design email templates: signing request email, reminder email
- [x] 2.8 Define Mujarrad node schemas for signing resources
- [x] 2.9 Review and approve all design artifacts before proceeding

## Phase 3 — Design Implementation
- [x] 3.1 Install dependencies: react-pdf, pdf-lib, signature_pad, react-signature-canvas, @dnd-kit/core, react-email
- [x] 3.2 Define refine resources: signing-requests, signature-fields, signers
- [x] 3.3 Build PDF viewer component with react-pdf (page navigation, zoom)
- [x] 3.4 Build signature field overlay with @dnd-kit (draggable/resizable rectangles on PDF canvas)
- [x] 3.5 Build signature capture component with react-signature-canvas (draw/type/upload modes)
- [x] 3.6 Build public signing page route outside `<Authenticated>` boundary
- [x] 3.7 Build react-email templates for signing request and reminder emails
- [x] 3.8 Build PDF assembly API route with pdf-lib (server-side, atomic completion check, embed signature images at coordinates, store result in R2)
- [x] 3.8a Deploy Gotenberg Docker sidecar for HTML-to-PDF conversion

## Phase 4 — Design Testing
- [x] 4.1 Verify PDF viewer: renders multi-page PDFs, page navigation works, zoom works
- [x] 4.2 Verify field placement: drag creates field at correct coordinates, resize works, field persists position on page change
- [x] 4.3 Verify signature capture: draw mode produces PNG, type mode renders text as image, upload mode accepts image file
- [x] 4.4 Verify coordinate mapping: field positions from react-pdf canvas match exact positions when embedded by pdf-lib
- [x] 4.5 Verify public signing page: accessible without auth via token, rejects invalid tokens
- [x] 4.6 Verify email templates: render correctly, contain signing link with token
- [x] 4.7 Verify PDF assembly: all signatures embedded at correct positions, output PDF is valid
- [x] 4.8 Document design issues and resolve before proceeding

## Phase 5 — Implementation
- [x] 5.1 Build "Documents" sidebar nav item and signing requests list page (refine `useTable` + shadcn-admin table)
- [x] 5.2 Build "New Signing Request" flow: upload PDF, render in viewer
- [x] 5.3 Build signature field placement toolbar and drag-drop interaction on PDF pages
- [x] 5.4 Build signer assignment: popover on each field, autocomplete from contacts via refine `useList`
- [x] 5.5 Build "Send for Signing" confirmation dialog and email dispatch
- [x] 5.6 Build public signing page: PDF viewer + highlighted fields + signature capture modal
- [x] 5.7 Build signing submission: capture signature, update field/signer status, check if all signed
- [x] 5.8 Build PDF assembly on completion: server-side API route, embed all signatures via pdf-lib, atomic field count check, store final PDF in Cloudflare R2
- [x] 5.9 Build signing request detail page: status tracking, per-signer progress, resend button
- [x] 5.10 Build download action for completed signed PDFs
- [x] 5.11 Log all signing events to activity system (request created, sent, viewed, signed, declined, completed)
- [x] 5.12 Unify look and feel: style react-pdf viewer, signature pad, dnd-kit overlays, public signing page to match SIA design tokens
- [x] 5.13 Build completion, decline, and cancellation notification emails (react-email + Resend)
- [x] 5.14 Build Resend bounce webhook handler: update signer status to `bounced`
- [x] 5.15 Test full end-to-end signing flow against all Definition of Done criteria
