# SIA Portal — Digital Signature Module Research

**Version:** 1.0
**Date:** April 2026
**Purpose:** Architecture research for building a DocuSign-like signing flow using open-source tools (all MIT/Apache 2.0).

---

## 1. Recommended Tool Selection (per layer)

### Layer A — Signature Capture (client-side)

| Tool | License | Role | Verdict |
|------|---------|------|---------|
| **signature_pad** (szimek) v5.1.3 | MIT | Core canvas engine: Bezier-interpolated drawing, outputs PNG/SVG/data-point arrays | **USE** |
| **react-signature-canvas** v1.x | Apache 2.0 | Thin React wrapper (~150 LOC) around signature_pad; exposes refs, typed, 100% test coverage | **USE** |

Three signing modes from this pair:
- **Draw**: user draws on the canvas directly
- **Type**: render typed name onto a hidden canvas with a script font, then export as PNG (~30 lines custom)
- **Upload**: user uploads a PNG/JPG of their saved signature (~20 lines custom)

### Layer B — PDF Viewing (client-side)

| Tool | License | Role | Verdict |
|------|---------|------|---------|
| **react-pdf** (wojtekmaj) v10.4.1 | MIT | Renders PDF pages as canvas/SVG using Mozilla's PDF.js | **USE** |
| **@react-pdf/renderer** (diegomura) | MIT | Generates new PDFs from React JSX | **SKIP** — for generating audit certificates later, not core signing |
| **pdfme** v6.0.6 | MIT | WYSIWYG template designer + PDF generation | **SKIP** — overkill for arbitrary document signing |

### Layer C — PDF Modification (client or server)

| Tool | License | Role | Verdict |
|------|---------|------|---------|
| **pdf-lib** (Hopding) v1.17.1 | MIT | Load existing PDF, embed PNG signature images at exact coordinates, save | **USE** |

Workflow: `PDFDocument.load(bytes)` -> `embedPng(signatureImage)` -> `drawImage(x, y, w, h)` -> `save()`.

### Layer D — Non-PDF Document Conversion (server-side)

| Tool | License | Verdict |
|------|---------|---------|
| **libreoffice-convert** (npm) | MIT | **USE** — Node.js wrapper around LibreOffice headless for DOCX/XLSX/PPTX -> PDF |
| **mammoth.js** | BSD 2-Clause | **SKIP** — HTML output loses layout fidelity |

Strategy: All non-PDF documents get converted to PDF server-side before entering the signing flow.

### Layer E — Audit Trail & Hashing

Node.js built-in `crypto` module:
- `crypto.createHash('sha256').update(pdfBytes).digest('hex')` for document hashing
- Store: signer identity, timestamp (ISO 8601), IP address, user-agent, document SHA-256 before and after signing

### Layer F — Email & Signing Links

| Tool | License | Role |
|------|---------|------|
| **resend/react-email** | MIT | Build signing request email templates as React components |
| **jsonwebtoken** or custom UUID tokens | MIT | Generate secure, time-limited signing URLs |

---

## 2. Complete User Flow

### Flow 1: Document Owner prepares

```
Upload file (PDF/DOCX/XLSX/PPTX)
       |
       v
[Server] If not PDF --> libreoffice-convert --> PDF
       |
       v
[Server] Store original file + generated PDF
[Server] Compute SHA-256 hash of the PDF
       |
       v
[Client] Open PDF in react-pdf viewer
       |
       v
[Client] Drag-and-drop signature field placeholders onto PDF pages
         - Each field: positioned <div> overlay on the PDF canvas
         - Assign each field to a recipient (signer email)
         - Field types: Signature, Initials, Date, Text
       |
       v
[Client] Add recipients (name + email per signer)
       |
       v
[Client] Click "Send for Signing"
       |
       v
[Server] Create signing session in DB
[Server] Generate unique token per recipient
[Server] Send email with signing link
```

### Flow 2: Recipient signs

```
Recipient clicks email link
       |
       v
[Client] Token-authenticated page loads
[Client] PDF rendered with react-pdf
[Client] Their assigned fields are highlighted
       |
       v
[Client] Click signature field --> Modal with 3 tabs:
         Tab 1: Draw (react-signature-canvas)
         Tab 2: Type (name in script font on canvas)
         Tab 3: Upload (drag-drop signature image)
       |
       v
[Client] Confirms signature --> captured as PNG data URL
       |
       v
[Client] Click "Complete Signing"
       |
       v
[Server] Receive: signature PNG + field coordinates + signer identity
[Server] pdf-lib: embed signature image into PDF at exact coordinates
[Server] Compute new SHA-256 hash
[Server] Record audit trail:
         - Signer name, email, IP, user-agent
         - Timestamp (UTC)
         - Document hash before and after
         - Field positions signed
       |
       v
[Server] If more signers remain --> send next email
[Server] If all signed --> mark complete, notify owner
```

---

## 3. What's Free vs Custom Code

### Covered by open-source libraries:

| Capability | Library |
|-----------|---------|
| Smooth signature drawing | signature_pad + react-signature-canvas |
| PDF rendering in browser | react-pdf (wojtekmaj) |
| Embedding signature images into PDF | pdf-lib |
| DOCX/XLSX/PPTX to PDF conversion | libreoffice-convert |
| Document SHA-256 hashing | Node.js crypto (built-in) |
| Email sending | Nodemailer / Resend |

### Requires custom code:

| Component | Complexity | Notes |
|-----------|-----------|-------|
| **Drag-and-drop field placement UI** | HIGH | Overlay layer on react-pdf. Handle page scaling, zoom, coordinate mapping. Hardest part of the project. |
| **Coordinate mapping system** | HIGH | Screen pixels -> PDF points. PDF Y-axis is inverted (origin bottom-left). Formula: `pdfX = (screenX / renderedWidth) * pdfPageWidth; pdfY = pdfPageHeight - ((screenY / renderedHeight) * pdfPageHeight)` |
| **Multi-recipient signing orchestration** | MEDIUM | DB schema for documents, recipients, fields, sessions. Token generation, expiration, status tracking. |
| **Signature capture modal (3-tab)** | MEDIUM | Draw = react-signature-canvas. Type = canvas + Google Font ("Dancing Script"). Upload = file input + preview. All output consistent PNG. |
| **Signing link authentication** | MEDIUM | JWT or DB token. Handle expiration, one-time use, email verification. |
| **Audit trail generation** | LOW-MEDIUM | Logging is easy. Formatted audit PDF adds work. |

---

## 4. Complexity Assessment

### The Hard Parts:

1. **Drag-and-drop field editor** — Mini design tool on top of PDF viewer. Must sync overlay positions across zoom levels, handle multi-page docs, be responsive. Follow Documenso's pattern: percentage-based coordinates relative to page dimensions (zoom-independent).

2. **Coordinate mapping** — Screen-to-PDF translation accounting for rendered canvas size vs PDF point dimensions, Y-axis inversion, DPI scaling, container offsets.

3. **Backend for signing** — Needs: file storage, signing session management, token auth, email dispatch. Mujarrad handles node storage; file serving and email need additional infrastructure.

### The Easy Parts:

- Signature capture (react-signature-canvas handles it)
- Embedding signatures into PDFs (pdf-lib: ~20 lines)
- Hashing documents (1 line)
- PDF viewing (react-pdf: `<Document file={url}><Page pageNumber={n}/></Document>`)

---

## 5. Documenso (AGPL — Inspiration Only)

Cannot copy code. Study these UX patterns and reimplement:

- Left sidebar with field types (Signature, Initials, Date, Text) you drag onto the document
- Fields color-coded by recipient
- Click field to select; drag corners to resize
- Three-step wizard: (1) Upload, (2) Add recipients + place fields, (3) Review + send
- Signer view: fields pulse/glow to guide signing

---

## 6. Architecture Summary

```
CLIENT (React + Vite + Tailwind + shadcn/ui)
├── Upload page (react-dropzone)
├── Field Editor page
│   ├── react-pdf — renders PDF pages
│   ├── Custom overlay layer — draggable fields (@dnd-kit)
│   └── Recipient manager sidebar
├── Signing page (public, no auth)
│   ├── react-pdf — renders PDF
│   ├── react-signature-canvas — draw signature
│   ├── Canvas + Google Font — type signature
│   └── File upload — saved signature image
└── Dashboard — document status tracking

SERVER (Express/Fastify + Node.js)
├── POST /documents/upload — upload + convert to PDF
├── POST /documents/:id/send — create session + send emails
├── GET  /signing/:token — get document + fields for signer
├── POST /signing/:token/complete — embed signature with pdf-lib
├── GET  /documents/:id/download — download signed PDF
└── GET  /documents/:id/audit — download audit trail

DATA MODEL
├── documents (id, title, originalFile, pdfFile, status, hash, ownerId)
├── recipients (id, documentId, name, email, signingOrder, status, token, signedAt)
├── fields (id, documentId, recipientId, type, pageNumber, xPercent, yPercent, widthPercent, heightPercent)
└── audit_logs (id, documentId, recipientId, action, ip, userAgent, documentHash, timestamp)
```

### NPM Packages

**Client:** `react-pdf` (wojtekmaj), `react-signature-canvas`, `pdf-lib`, `@dnd-kit/core`
**Server:** `pdf-lib`, `libreoffice-convert`, `nodemailer`/`resend`, `jsonwebtoken`

### What NOT to use:
- **@react-pdf/renderer** — generates PDFs from JSX; we modify existing PDFs
- **pdfme** — template-based form generation, not arbitrary document signing
- **mammoth.js** — HTML output lacks fidelity for signing

---

## 7. Development Phases

1. **Phase 1 (MVP, ~2-3 weeks):** PDF upload, viewing, signature capture, embed into PDF, download. Single signer, no email.
2. **Phase 2 (~2 weeks):** Drag-and-drop field placement editor with @dnd-kit.
3. **Phase 3 (~1-2 weeks):** Multi-recipient flow. Email sending, token-based links, signing order.
4. **Phase 4 (~1 week):** Non-PDF support via LibreOffice conversion. Audit trail. Dashboard.
5. **Phase 5 (ongoing):** Mobile responsive, sequential signing, reminders, templates.
