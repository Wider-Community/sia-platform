# SIA Platform — Distilled Open-Source Stack

**Version:** 1.0
**Date:** April 2026
**Purpose:** The exact tools needed for Sprints 1-3. Nothing more.

---

## Foundation Framework

| Tool | Stars | License | What It Does For You |
|------|-------|---------|---------------------|
| **[refine.dev](https://github.com/refinedev/refine)** | 34.5k | MIT | **THE framework.** Headless React meta-framework for data-intensive B2B apps. Provides: data provider abstraction (CRUD against any backend via custom adapter), auth provider (login/logout/permissions), access control (RBAC/ABAC), React Query integration, resource routing, `@refinedev/react-hook-form` for forms, official shadcn/ui integration (v5). CRM template as architectural reference (companies, contacts, deal pipeline, kanban, calendar, activity feeds). We build a custom Mujarrad data provider that plugs into refine — every feature built on top is backend-agnostic. |

## UI Shell & Utilities (Sprint 1)

| Tool | Stars | License | What It Does For You |
|------|-------|---------|---------------------|
| [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) | 11.8k | MIT | Reference for app shell patterns — sidebar, command palette, data tables, auth pages, settings. Exact stack match (React 19 + Vite + Tailwind + shadcn/ui + Zustand) |
| [react-dropzone](https://github.com/react-dropzone/react-dropzone) | 11k | MIT | File upload drag-and-drop. Hooks-based, pairs with shadcn |

## Digital Signature Flow (Sprint 2)

| Tool | Stars | License | What It Does For You |
|------|-------|---------|---------------------|
| [wojtekmaj/react-pdf](https://github.com/wojtekmaj/react-pdf) | 9k+ | MIT | Render PDFs in-browser for viewing and signing |
| [Hopding/pdf-lib](https://github.com/Hopding/pdf-lib) | 8.4k | MIT | Embed signature images into PDFs at exact coordinates. Zero deps, runs in browser |
| [szimek/signature_pad](https://github.com/szimek/signature_pad) | 11.9k | MIT | Signature drawing engine (Bezier curves, export PNG/SVG) |
| [react-signature-canvas](https://github.com/agilgur5/react-signature-canvas) | 650 | Apache 2.0 | React wrapper for signature_pad. 150 lines, typed |
| [@dnd-kit/core](https://github.com/clauderic/dnd-kit) | 13k+ | MIT | Drag-and-drop for placing signature fields on PDF pages. Reused later for Kanban |

## Email & Notifications (Sprint 2-3)

| Tool | Stars | License | What It Does For You |
|------|-------|---------|---------------------|
| [resend/react-email](https://github.com/resend/react-email) | 18.9k | MIT | Build signing request and reminder emails as React components |

## Operations Dashboard (Sprint 3)

| Tool | Stars | License | What It Does For You |
|------|-------|---------|---------------------|
| [prabhuignoto/react-chrono](https://github.com/prabhuignoto/react-chrono) | 4.2k | MIT | Activity timeline per organization (vertical mode, custom content) |

## Already In Stack (no install needed)

| Tool | Purpose |
|------|---------|
| recharts | Dashboard charts (KPIs, bar, donut) |
| sonner | Toast notifications |
| react-hook-form + Zod | Forms + validation |
| Zustand | Client state |
| React Query (TanStack Query) | Server state + caching |
| react-i18next | i18n (English now, Arabic later) |
| @react-oauth/google | Google sign-in |

## Server-Side (signing backend)

| Tool | License | What It Does |
|------|---------|-------------|
| [libreoffice-convert](https://www.npmjs.com/package/libreoffice-convert) | MIT | Convert DOCX/XLSX/PPTX to PDF for signing |
| pdf-lib (same as above) | MIT | Embed signatures server-side |

## Inspiration Only (AGPL — study UX, do NOT copy code)

| Tool | Stars | Study For |
|------|-------|-----------|
| [documenso](https://github.com/documenso/documenso) | 12.7k | Signing field placement UX, multi-signer flow |
| [atomic-crm](https://github.com/marmelab/atomic-crm) | 936 | CRM activity timeline, deal pipeline patterns |

---

**Total: 11 tools to install + 2 inspiration references.** All MIT or Apache 2.0.
