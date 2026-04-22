# SIA Portal — Open Source Resource Registry

**Version:** 1.0
**Date:** April 2026
**Purpose:** Curated open source repos matching our stack (React + Vite + TypeScript + Tailwind + shadcn/ui) with permissive licenses for safe commercial use. Each resource maps to one or more PRD modules.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Zustand · React Query · Zod · react-hook-form · react-i18next · Recharts

> **License Policy:** Only repos with **MIT**, **Apache 2.0**, **ISC**, or **BSD** licenses are recommended for direct code use. AGPL/GPL repos are listed as **inspiration only** — do not copy code from them into our codebase.

---

## Table of Contents

1. [Admin Dashboard Shells](#1-admin-dashboard-shells)
2. [CRM & Relationship Management](#2-crm--relationship-management)
3. [Kanban & Drag-and-Drop](#3-kanban--drag-and-drop)
4. [Data Tables](#4-data-tables)
5. [Charts & Analytics](#5-charts--analytics)
6. [Digital Signatures](#6-digital-signatures)
7. [Document Management](#7-document-management)
8. [Multi-Step Forms & Onboarding](#8-multi-step-forms--onboarding)
9. [Authentication & OAuth](#9-authentication--oauth)
10. [Internationalization & RTL](#10-internationalization--rtl)
11. [File Upload](#11-file-upload)
12. [Notifications & Announcements](#12-notifications--announcements)
13. [Onboarding Tours](#13-onboarding-tours)
14. [Portfolio & Finance (Inspiration Only)](#14-portfolio--finance-inspiration-only)

---

## 1. Admin Dashboard Shells

**Maps to:** Admin Panel, Partner Home Dashboard, all layout/navigation

### satnaing/shadcn-admin ★ TOP PICK

- **URL:** https://github.com/satnaing/shadcn-admin
- **Stars:** ~11,800 · **License:** MIT
- **Stack:** React 19, Vite 8, TypeScript, Tailwind CSS 4, shadcn/ui, TanStack Router, TanStack Table, Zustand, Recharts, Zod, react-hook-form, Lucide icons
- **Modules:**
  - Collapsible sidebar with nested navigation
  - Light/dark mode toggle
  - Global search command palette (cmdk)
  - 10+ pre-built pages (dashboard, auth, errors, settings, users)
  - Data tables with sorting, filtering, pagination (TanStack Table)
  - Charts and analytics widgets (Recharts)
  - Forms with validation (react-hook-form + Zod)
  - Auth pages (sign-in, sign-up, forgot password, OTP)
  - RTL (right-to-left) support
  - Toast notifications (Sonner)
  - Fully responsive and accessible
- **Why:** Exact stack match. Most mature Vite-based shadcn admin dashboard. Actively maintained.

### shadcnstore/shadcn-dashboard-landing-template

- **URL:** https://github.com/shadcnstore/shadcn-dashboard-landing-template
- **Stars:** ~663 · **License:** MIT
- **Stack:** React 19, TypeScript, Vite (has `vite-version/` directory), Tailwind CSS v4, shadcn/ui v3, Recharts
- **Modules:**
  - 30+ pages total
  - 2 dashboard variants (overview + analytics)
  - App demos: Mail, Tasks, Chat, Calendar, Users
  - Auth pages (login, signup)
  - Settings and error pages
  - FAQ and pricing pages
  - Data tables with sorting, filtering, pagination
  - Multiple sidebar layout variants
  - Live theme customizer (tweakcn)
  - Landing page template included
- **Why:** More pages than shadcn-admin. Ships both Vite and Next.js versions — use the `vite-version/` directory.

### yluiop123/orange

- **URL:** https://github.com/yluiop123/orange
- **Stars:** ~491 · **License:** MIT
- **Stack:** React 19, Vite 6, Zustand, shadcn/ui, Tailwind CSS, React Router v7, react-intl, MSW
- **Modules:**
  - Dashboard page with charts
  - Forms
  - Internationalization (react-intl)
  - Mock Service Worker for API mocking during development
- **Why:** Has i18n built in. Useful as a reference for multi-language Vite + Zustand setup.

---

## 2. CRM & Relationship Management

**Maps to:** M2 (Matching), M3 (Relationship Management), M6 (Integration Journey)

### marmelab/atomic-crm ★ TOP PICK

- **URL:** https://github.com/marmelab/atomic-crm
- **Stars:** ~936 · **License:** MIT
- **Stack:** React, TypeScript, shadcn/ui, Tailwind CSS, react-admin, TanStack Query, Supabase, PostgreSQL
- **Modules:**
  - Contact management (Contacts, Companies)
  - Deal pipeline with Kanban board
  - Notes and Tasks with reminders
  - Activity timeline / aggregated activity logs
  - Email capture (CC the CRM to auto-save emails as notes)
  - Contact enrichment (auto-pulls avatars)
  - Tags system
  - Import/Export
  - AI assistant integration for natural language queries
  - Multilingual support
  - Custom fields on all entities
- **Why:** Exact stack match (shadcn/ui + Tailwind). Small codebase (~15k lines) — easy to study and extract patterns. Deal pipeline + activity timeline directly maps to M3.

### pdovhomilja/nextcrm-app

- **URL:** https://github.com/pdovhomilja/nextcrm-app
- **Stars:** ~579 · **License:** MIT
- **Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Prisma 7, PostgreSQL, Better Auth
- **Modules:**
  - CRM with contacts and companies
  - Deal/opportunity management
  - Project management
  - Invoicing system (multi-currency, tax rates, PDF generation)
  - Document storage (S3-compatible)
  - Email client
  - Activity feed (notes, calls, emails, meetings, tasks) linked to CRM entities
  - Audit log and history with soft delete and field-level change trail
  - AI enrichment for contact/company data
- **Why:** Also shadcn/ui + Tailwind + TypeScript. The audit trail and activity feed patterns map directly to M3 relationship timeline.

### refinedev/refine

- **URL:** https://github.com/refinedev/refine
- **Stars:** ~34,500 · **License:** MIT
- **Stack:** React, TypeScript, Vite, supports multiple UI frameworks, GraphQL and REST data providers
- **Modules (CRM template):**
  - Dashboard with key metrics
  - Sales pipeline (Kanban-style)
  - Contact management (Companies, Contacts)
  - Calendar / appointment scheduling
  - Scrumboard / project management
  - Quotes generation
  - Swappable UI library and API layer
- **Why:** Massive community. Data provider abstraction pattern is excellent for building backend-agnostic features. CRM template demonstrates complete pipeline architecture.

### harryho/react-crm

- **URL:** https://github.com/harryho/react-crm
- **Stars:** ~522 · **License:** MIT
- **Stack:** React, TypeScript, Redux, Material-UI
- **Modules:**
  - Contact management
  - Lead management
  - Opportunity/deal tracking
  - Dashboard
- **Why:** Simple CRM data models and entity relationship patterns. Good lightweight reference.

---

## 3. Kanban & Drag-and-Drop

**Maps to:** M3 (Relationship status kanban), M6 (Integration journey tracking)

### Georgegriff/react-dnd-kit-tailwind-shadcn-ui ★ TOP PICK

- **URL:** https://github.com/Georgegriff/react-dnd-kit-tailwind-shadcn-ui
- **Stars:** ~809 · **License:** MIT
- **Stack:** React, TypeScript, @dnd-kit, Tailwind CSS, shadcn/ui
- **Modules:**
  - Accessible kanban board with drag-and-drop columns and cards
  - Built specifically with @dnd-kit + shadcn/ui
  - Live demo on GitHub Pages
- **Why:** Exact stack match (dnd-kit + shadcn/ui + Tailwind). Clean, reference-quality kanban implementation.

### hello-pangea/dnd

- **URL:** https://github.com/hello-pangea/dnd
- **Stars:** ~3,900 · **License:** Apache 2.0
- **Stack:** TypeScript, React
- **Modules:**
  - Maintained fork of react-beautiful-dnd (drop-in replacement)
  - Vertical, horizontal, and cross-list movement
  - Virtual list support (10,000 items at 60fps)
  - Multi-drag, keyboard/screen-reader accessibility
  - Auto-scrolling, custom drag handles, SSR support
- **Why:** Battle-tested library with 2M+ weekly npm downloads. Use if you need virtual list support for large datasets.

### mehrdadrafiee/recursive-dnd-kanban-board

- **URL:** https://github.com/mehrdadrafiee/recursive-dnd-kanban-board
- **Stars:** ~80 · **License:** MIT
- **Stack:** Next.js, TypeScript, @dnd-kit, Tailwind CSS, shadcn/ui
- **Modules:**
  - Recursively-generated column structure (dynamic, flexible layout)
  - Full accessibility support
- **Why:** Good reference for deeply nested task hierarchies and dynamic column structures.

---

## 4. Data Tables

**Maps to:** Admin Panel (verification queue, partner lists), M2 (match history), M4 (portfolio asset lists)

### sadmann7/tablecn ★ TOP PICK

- **URL:** https://github.com/sadmann7/tablecn
- **Stars:** ~6,100 · **License:** MIT
- **Stack:** Next.js, TanStack Table, shadcn/ui, Tailwind CSS, Drizzle ORM, Zod
- **Modules:**
  - Server-side pagination, sorting, and filtering
  - Auto-generated filters from column definitions
  - Dynamic toolbar with search, filters, and actions
  - Advanced Notion/Airtable-style filtering
  - Linear-style command palette filter menu
  - Action bar triggered by row selection
  - Customizable columns
- **Why:** Most-starred shadcn data table implementation. Comprehensive feature set for admin panel tables.

### openstatusHQ/data-table-filters

- **URL:** https://github.com/openstatusHQ/data-table-filters
- **Stars:** ~2,000 · **License:** MIT
- **Stack:** React, TypeScript, TanStack Table, TanStack Query, shadcn/ui, Zustand, nuqs, dnd-kit, Zod, Recharts
- **Modules:**
  - Declarative schema system with `col.*` factories
  - Four filter types with command palette + keyboard shortcuts
  - Infinite scroll with server-side filtering
  - Multiple state adapters (URL-based, client-side, in-memory)
  - Cell renderers for common data types
  - Row detail panels + drag-and-drop
  - AI-powered natural language filter inference
  - Installable as shadcn registry blocks
- **Why:** Uses Zustand (matches our state management). Infinite scroll pattern useful for large partner/match lists.

---

## 5. Charts & Analytics

**Maps to:** Admin analytics dashboard, M4 (portfolio analytics), Partner Home dashboard

### recharts/recharts

- **URL:** https://github.com/recharts/recharts
- **Stars:** ~27,000 · **License:** MIT
- **Stack:** TypeScript, React, D3
- **Modules:**
  - Composable chart components (Line, Bar, Area, Pie, Radar, Scatter, Treemap)
  - Responsive containers
  - Customizable tooltips and legends
  - Animation support
- **Why:** Already in our stack. The charting library that shadcn/ui chart components wrap.

### tremorlabs/tremor

- **URL:** https://github.com/tremorlabs/tremor
- **Stars:** ~3,400 · **License:** Apache 2.0
- **Stack:** TypeScript, React, Tailwind CSS, Radix UI
- **Modules:**
  - Dashboard-specific components (AreaChart, BarChart, DonutChart, LineChart)
  - KPI cards and stat trackers
  - Progress bars
  - Designed specifically for analytics dashboards
- **Why:** Works alongside shadcn/ui. Provides higher-level dashboard components (KPI cards, stat trackers) that complement raw Recharts.

---

## 6. Digital Signatures

**Maps to:** M6 (Integration journey sign-offs), Digital Signature Flow

### szimek/signature_pad ★ TOP PICK

- **URL:** https://github.com/szimek/signature_pad
- **Stars:** ~11,900 · **License:** MIT
- **Stack:** TypeScript, vanilla JS (framework-agnostic)
- **Modules:**
  - Smooth Bezier curve-based signature rendering
  - Export to PNG/SVG/data URL
  - Undo support
  - Responsive canvas
  - Touch + mouse support
  - Zero dependencies
- **Why:** The core drawing engine. Wrap it in our own shadcn/ui styled component.

### agilgur5/react-signature-canvas

- **URL:** https://github.com/agilgur5/react-signature-canvas
- **Stars:** ~650 · **License:** Apache 2.0
- **Stack:** TypeScript, React
- **Modules:**
  - Thin React wrapper for szimek/signature_pad (<150 LoC)
  - Canvas trimming (removes whitespace)
  - All signature_pad methods exposed
  - TypeScript types included
- **Why:** Ready-to-use React component. Lightweight wrapper — easy to style with our design system.

### michaeldzjap/react-signature-pad-wrapper

- **URL:** https://github.com/michaeldzjap/react-signature-pad-wrapper
- **Stars:** ~230 · **License:** MIT
- **Stack:** TypeScript, React
- **Modules:**
  - React wrapper for signature_pad
  - Automatic canvas resizing
  - TypeScript support
- **Why:** Alternative React wrapper with auto-resizing canvas.

---

## 7. Document Management

**Maps to:** Document vault per org/engagement, M6 (journey document vault)

> **Note:** The major open source document platforms (Documenso, Papermark) use **AGPL-3.0** licenses, which are copyleft and incompatible with proprietary use without purchasing a commercial license. Listed below as architectural inspiration only.

### AGPL — Inspiration Only

| Repo | Stars | License | Use For |
|------|-------|---------|---------|
| [documenso/documenso](https://github.com/documenso/documenso) | ~12,700 | AGPL-3.0 | Document signing flow UX, multi-recipient patterns, audit trail design |
| [OpenSignLabs/OpenSign](https://github.com/OpenSignLabs/OpenSign) | ~6,200 | AGPL-3.0 | PDF signing UX, template system |
| [papermark/papermark](https://github.com/papermark/papermark) | ~8,200 | AGPL-3.0 | Document sharing analytics, page-by-page tracking, data room patterns, NDA/email capture before viewing |

### Recommended Approach

Build a custom document vault using permissive-licensed building blocks:
- **react-dropzone** for upload UI (see [File Upload](#11-file-upload))
- **react-signature-canvas** for signature capture (see [Digital Signatures](#6-digital-signatures))
- **Mujarrad** for document node storage and versioning
- Study Papermark and Documenso for UX patterns but implement from scratch

---

## 8. Multi-Step Forms & Onboarding

**Maps to:** M1 (Partner onboarding), M5 (Financial model builder)

### jcmcneal/react-step-wizard

- **URL:** https://github.com/jcmcneal/react-step-wizard
- **Stars:** ~590 · **License:** MIT
- **Stack:** JavaScript, React
- **Modules:**
  - Hash-based routing for steps
  - Animated transitions
  - Named step navigation
  - No UI opinion (bring your own styling — pairs with shadcn/ui)
  - Lazy-mountable steps
- **Why:** Flexible, unstyled step wizard that we can wrap with shadcn/ui components and Framer Motion transitions.

### srdjan/react-multistep

- **URL:** https://github.com/srdjan/react-multistep
- **Stars:** ~670 · **License:** MIT
- **Stack:** TypeScript, React
- **Modules:**
  - Simple step-based navigation
  - Progress indicator
  - Configurable step titles
  - Lightweight
- **Why:** Simple and quick to integrate. Good for straightforward linear flows.

### martiserra99/formity

- **URL:** https://github.com/martiserra99/formity
- **Stars:** ~405 · **License:** MIT
- **Stack:** TypeScript, React
- **Modules:**
  - Conditional step logic and branching flows
  - Form state management across steps
  - Validation per step
  - Dynamic step ordering
- **Why:** Perfect for SIA onboarding where different user types (investor/company/gov/startup) see different form paths.

### damianricobelli/stepperize

- **URL:** https://github.com/damianricobelli/stepperize
- **Stars:** ~1,600 · **License:** Check repo
- **Stack:** TypeScript, React
- **Modules:**
  - Type-safe step definitions
  - Hooks-based API
  - Works with any UI library (pairs with shadcn/ui)
  - Step validation and navigation guards
- **Why:** Type-safe stepper designed to compose with shadcn/ui. Hooks-based API integrates cleanly with react-hook-form + Zod validation.

---

## 9. Authentication & OAuth

**Maps to:** Auth (Google OAuth), Org/Team model, protected routes

### better-auth/better-auth ★ TOP PICK

- **URL:** https://github.com/better-auth/better-auth
- **Stars:** ~27,900 · **License:** MIT
- **Stack:** TypeScript (100%)
- **Modules:**
  - Framework-agnostic (works with React, Vite)
  - Google, GitHub, Apple, Discord social providers built-in
  - 2FA, multi-tenancy (teams, roles, invitations, access control)
  - SSO, SAML 2.0, SCIM, directory sync
  - Plugin ecosystem (Stripe, passkeys, magic links, API keys, JWTs)
  - React client: `createAuthClient` from `better-auth/react`
- **Why:** Comprehensive, TypeScript-first. Built-in multi-tenancy with teams/roles/invitations maps directly to SIA's Org/Team model.

### MomenSherif/react-oauth

- **URL:** https://github.com/MomenSherif/react-oauth
- **Stars:** ~1,300 · **License:** MIT
- **Stack:** TypeScript, React
- **Modules:**
  - `@react-oauth/google` — Google Identity Services SDK wrapper
  - Sign In With Google button, One-tap sign-up, auto sign-in
  - Implicit and Authorization Code flows
  - Built-in CSRF protection
  - Zero runtime dependencies
- **Why:** Lightweight Google-only client-side SDK. If Mujarrad handles backend auth, this provides the frontend Google OAuth button.

### wpcodevo/google-github-oath2-reactjs

- **URL:** https://github.com/wpcodevo/google-github-oath2-reactjs
- **Stars:** ~28 · **License:** Not specified
- **Stack:** TypeScript, React, Vite, Tailwind CSS, Zustand
- **Modules:**
  - Google OAuth2 + GitHub OAuth implementation
  - Zustand store for auth state management
  - Protected page access
  - Token-based auth flow
- **Why:** Reference for wiring Zustand + OAuth together — matches our exact state management pattern (Zustand + localStorage for auth).

---

## 10. Internationalization & RTL

**Maps to:** English + Arabic (MVP), Bahasa Malaysia (Phase 2)

### i18next/react-i18next ★ ALREADY IN STACK

- **URL:** https://github.com/i18next/react-i18next
- **Stars:** ~10,000 · **License:** MIT
- **Stack:** JavaScript, TypeScript, React
- **Modules:**
  - Hooks-based API (`useTranslation`)
  - ICU message syntax (interpolation, plurals, rich text)
  - Trans component for JSX-embedded translations
  - Massive plugin ecosystem (language detection, backend loaders, caching)
  - RTL support via `dir` attribute detection based on active language
- **Why:** Already in our dependencies. Industry standard for React i18n.

### RTL Implementation Pattern

For Arabic RTL support with Tailwind CSS:
- Use Tailwind's `rtl:` variant for directional styles
- Toggle `dir="rtl"` on `<html>` based on active i18next language
- Reference: [saifabusaleh/react-i18n-rtl-demo](https://github.com/saifabusaleh/react-i18n-rtl-demo) for wiring pattern

---

## 11. File Upload

**Maps to:** M1 (document upload), M6 (document vault), profile/org documents

### transloadit/uppy ★ TOP PICK

- **URL:** https://github.com/transloadit/uppy
- **Stars:** ~30,700 · **License:** MIT
- **Stack:** TypeScript, JavaScript, React (`@uppy/react` package)
- **Modules:**
  - Drag-and-drop with file previews (images/video/audio)
  - Upload progress bars
  - Resumable uploads (tus protocol)
  - Webcam capture
  - Import from Dropbox/Google Drive/URL
  - Image editing/cropping
  - Modular plugin architecture
- **Why:** Most full-featured upload library. Plugin architecture means we only include what we need.

### react-dropzone/react-dropzone

- **URL:** https://github.com/react-dropzone/react-dropzone
- **Stars:** ~11,000 · **License:** MIT
- **Stack:** JavaScript, React (hooks-based)
- **Modules:**
  - Drag-and-drop zone
  - File type/size validation
  - Multiple file support
  - Accessible, hooks-based (`useDropzone`)
  - Lightweight and composable
- **Why:** Minimal drop zone — pairs perfectly with shadcn/ui for custom styled upload areas. Build our own preview/progress UI on top.

### pqina/filepond

- **URL:** https://github.com/pqina/filepond
- **Stars:** ~16,400 · **License:** MIT
- **Stack:** JavaScript (React adapter: `react-filepond`)
- **Modules:**
  - Drag-and-drop with image preview
  - File validation
  - Upload progress
  - Image editing/cropping/resizing
  - Plugin-based architecture (preview, size validation, type validation, image transform)
- **Why:** Plugin-based like Uppy but with a different UI approach. Good middle ground between Uppy (heavy) and react-dropzone (minimal).

---

## 12. Notifications & Announcements

**Maps to:** Relationship alerts, journey notifications, admin announcement broadcaster

### novuhq/novu ★ TOP PICK

- **URL:** https://github.com/novuhq/novu
- **Stars:** ~38,800 · **License:** MIT (core) + Commercial Enterprise
- **Stack:** TypeScript
- **Modules:**
  - Embeddable In-App Inbox component with real-time support
  - Multi-channel: Email (14+ providers), SMS (15+), Push (5), Chat (4)
  - Digest engine (combines multiple notifications into one)
  - No-code email block editor
  - Notification workflow engine
  - User preference management component
  - React, Vue, Angular components + headless JS SDK
- **Why:** Full notification center with inbox, multi-channel delivery, and workflow engine. Ideal for investor portal announcement system + relationship alerts.

### emilkowalski/sonner ★ ALREADY IN STACK

- **URL:** https://github.com/emilkowalski/sonner
- **Stars:** ~12,300 · **License:** MIT
- **Stack:** TypeScript, React
- **Modules:**
  - Opinionated toast component for React
  - Official shadcn/ui integration
  - Simple API: place `<Toaster />`, call `toast()` anywhere
  - Beautiful animations, swipe-to-dismiss
- **Why:** Already in our dependencies. Use for ephemeral in-app toasts. Novu handles persistent notification center.

---

## 13. Onboarding Tours

**Maps to:** First-time user experience, feature discovery

### gilbarbara/react-joyride

- **URL:** https://github.com/gilbarbara/react-joyride
- **Stars:** ~7,700 · **License:** MIT
- **Stack:** TypeScript, React
- **Modules:**
  - Step-by-step guided tours
  - Spotlight/overlay effects
  - Tooltip positioning
  - Scroll-to-step
  - Callback events
  - Custom styling
  - Controlled/uncontrolled modes
- **Why:** Industry standard for React guided tours. Perfect for walking new partners through the dashboard after onboarding.

---

## 14. Portfolio & Finance (Inspiration Only)

**Maps to:** M4 (Portfolio Management), M5 (Financial Model Deployment)

> These repos use **AGPL** licenses. Study their UX patterns and data models but do **not** copy code.

| Repo | Stars | License | Inspiration For |
|------|-------|---------|-----------------|
| [maybe-finance/maybe](https://github.com/maybe-finance/maybe) | ~54,000 | AGPL-3.0 | Portfolio dashboard UI, net worth tracking, asset allocation visualizations |
| [ghostfolio/ghostfolio](https://github.com/ghostfolio/ghostfolio) | ~8,200 | AGPL-3.0 | Portfolio performance tracking, benchmark comparison, multi-currency, dividend tracking |

---

## Quick Reference Matrix

| PRD Module | Primary Resource | Secondary Resources |
|------------|-----------------|---------------------|
| **M1 — Partner Registry** | formity, stepperize | react-step-wizard, react-dropzone |
| **M2 — AI Matching** | atomic-crm (match cards) | tablecn (match filtering/history) |
| **M3 — Relationship Mgmt** | atomic-crm (timeline, pipeline) | react-dnd-kit-tailwind-shadcn-ui (kanban), nextcrm-app (audit trail) |
| **M4 — Portfolio** | recharts, tremor (analytics) | maybe/ghostfolio (UX inspiration) |
| **M5 — Financial Model** | formity (structured form) | recharts (summary cards) |
| **M6 — Integration Journey** | stepperize (tier stepper) | react-signature-canvas (signatures), react-dropzone (doc vault) |
| **Admin Panel** | satnaing/shadcn-admin (shell) | tablecn (verification queue), novu (announcements) |
| **Auth** | react-oauth (Google button) | better-auth (full auth + teams) |
| **i18n / RTL** | react-i18next (already installed) | Tailwind `rtl:` variant |
| **Dashboard Home** | satnaing/shadcn-admin | recharts, sonner |

---

## License Summary

| License | Repos | Safe for SIA? |
|---------|-------|---------------|
| **MIT** | shadcn-admin, atomic-crm, nextcrm-app, refine, tablecn, data-table-filters, recharts, signature_pad, react-signature-canvas, react-step-wizard, react-multistep, formity, react-i18next, react-joyride, uppy, react-dropzone, filepond, sonner, novu (core), react-oauth, better-auth, react-dnd-kit-tailwind-shadcn-ui, orange, react-crm | Yes — full commercial use |
| **Apache 2.0** | hello-pangea/dnd, tremor, react-signature-canvas | Yes — full commercial use |
| **ISC** | next-auth (Auth.js) | Yes — full commercial use |
| **AGPL-3.0** | documenso, OpenSign, papermark, maybe, ghostfolio, twenty, erxes, frappe/crm | **No** — inspiration only |