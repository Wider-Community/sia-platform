# SIA Portal — Refine.dev Analysis

**Version:** 1.0
**Date:** April 2026
**Purpose:** Evaluate refine.dev as an architectural reference for SIA's data layer.

---

## 1. What Refine Is

A headless React meta-framework for data-intensive apps. Architecture is built around pluggable providers:
- **Data Provider** — CRUD abstraction (`getList`, `getOne`, `create`, `update`, `delete`)
- **Auth Provider** — login/logout/check/permissions hooks
- **Access Control Provider** — `can({ resource, action })` -> `{ can: boolean }`
- **Routing** — resource-based route definitions

## 2. Stack Compatibility

| Layer | Compatible? | Notes |
|---|---|---|
| React 19 | Yes | Refine v5 supports React 19 |
| Vite | Yes | Default scaffolding tool |
| TypeScript | Yes | Full support |
| Tailwind + shadcn/ui | Yes | Official shadcn/ui integration in v5 |
| React Query | **Overlap** | Refine uses TanStack Query v5 internally. Must share QueryClient or accept two caches. |
| Zustand | No conflict | Refine doesn't touch global state |
| react-hook-form + Zod | Yes | `@refinedev/react-hook-form` wraps RHF with data-provider-aware hooks |

## 3. CRM Template Analysis

The official CRM example (`examples/app-crm`) includes:
- Dashboard with KPI cards and charts
- Companies + Contacts CRUD
- Sales Pipeline (Kanban drag-and-drop)
- Calendar / appointments
- Quotes management
- Activity timeline / aggregated logs

**Caveat:** CRM template is tightly coupled to **Ant Design** (UI) and **GraphQL** (data). Patterns are reusable; actual components are not portable to shadcn/ui.

## 4. Mapping to SIA Needs

| SIA Requirement | Refine Coverage | Gap |
|---|---|---|
| Organization/Partner CRUD | Companies + Contacts patterns cover basic CRUD | Multi-member org logic is custom |
| Document Storage | No file/document management concept | 100% custom |
| Digital Signature Flow | Not covered at all | 100% custom |
| Address Book (multi-org contacts) | Contacts module covers basics | Multi-org linking is custom |
| SLA/OLA Dashboard | Dashboard patterns available | All domain logic is custom |
| Relationship Management | Company-contact relationships only | Org-to-org relationships are custom |

**Bottom line:** Refine covers ~25-30% of SIA's needs (CRUD scaffolding, auth, access control). The differentiating features are 100% custom regardless.

## 5. Data Provider for Mujarrad

Conceptual mapping:

| Refine Concept | Mujarrad Concept |
|---|---|
| `resource` | Node type (contextType) |
| `getOne({ id })` | Fetch node by ID with attributes |
| `getList({ filters })` | Query nodes in a space with filters |
| `create({ variables })` | Create node with attributes |
| `update({ id, variables })` | Update node (creates version) |
| `delete({ id })` | Delete node |
| `meta.space` | Mujarrad space context |
| `custom` method | Relationship CRUD, traversal queries |

**Where it gets awkward:**
- Relationships are second-class in refine (flat CRUD model). Creating an edge between two orgs doesn't fit `create("organizations")`. Need `useCustom` or a separate resource.
- Traversal queries don't fit `getList`. Need `useCustom`.
- Mujarrad nodes of the same type can have varying attribute schemas — loses type-safety.

## 6. Verdict

### Our Decision: Use refine's DATA PROVIDER PATTERN, not the framework.

**Why not adopt refine as a dependency:**
- We already have React Query + Zustand + react-hook-form + Zod — refine adds a layer on top of tools we already know
- Refine's CRUD-centric worldview is a mediocre fit for a knowledge graph backend
- The CRM template's valuable parts (Kanban, pipeline) are Ant Design components we can't reuse
- The pattern itself is ~200 lines of custom code without the framework dependency

**What we take from refine:**
- The `DataProvider` interface pattern (getList/getOne/create/update/delete)
- The auth provider pattern
- The resource definition pattern
- The `meta` passthrough for backend-specific context

**Implementation:** We define our own `DataProvider` interface (see 14-SPRINT-PLAN.md appendix) and build a Mujarrad adapter that implements it. All features code against this interface. If we swap backends, only the adapter changes.

This gives us refine's core architectural benefit (backend-agnostic CRUD) without the framework overhead, and without fighting the flat-CRUD model when we need graph operations.
