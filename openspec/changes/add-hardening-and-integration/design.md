## Context
Sprints 1-3 built the portal UI with a localStorage mock provider. Sprint 4 transitions to production-readiness: real backends (Mujarad knowledge graph), multi-tenant R2 storage, and new modules (graph-driven pipeline, map, contacts). The portal serves SIA's investor/partner relationship management needs.

Mujarad is a knowledge graph platform (v0.5.0) that provides flexible node/relationship/attribute storage. The frontend renders whatever Mujarad gives it — no hardcoded schemas.

## Goals / Non-Goals
- Goals:
  - Multi-tenant R2 folder structure with file versioning across signing stages
  - Graph-driven pipeline system powered by Mujarad (configurable stages, checklists, hierarchies)
  - Geographic map visualization of organizations (global view)
  - Real backend integration (Mujarad, Typesense, Resend email)
  - Hardened signature flow with audit trail
  - Standalone contacts page
- Non-Goals:
  - Multi-user RBAC (single admin user for now)
  - Real-time collaboration / WebSocket updates
  - Mobile native app
  - AI-powered features (deferred to S5+)

## Decisions

### Mujarad as the Data Backend
- **Decision**: All portal data lives in Mujarad as nodes in the `sia-portal` space. Organizations are regular nodes for now; a dedicated entity API is coming in future Mujarad releases.
- **Why**: Mujarad's graph model supports the flexible, configurable pipeline system Omar needs — arbitrary node types, relationships, hierarchies, and runtime schema changes.
- **API**: `https://mujarrad.onrender.com/api` (production). Swagger: `/swagger-ui/index.html`. Version 0.5.0.
- **Forward compatibility**: The mujarrad-data-provider abstraction layer isolates the frontend from API changes. When the entity API ships, update the provider internals without touching UI components.
- **Local dev**: `.env.local` should point to `http://localhost:8080` (not 3000, which is Discourse). Production fallback: `https://mujarrad.onrender.com/api`.

### Mujarad API Summary (v0.5.0)
Key primitives available:

**Nodes** — `POST/GET/PUT/DELETE /api/spaces/{spaceSlug}/nodes`
- Fields: title, slug, nodeType (REGULAR|CONTEXT|ASSUMPTION|ATTRIBUTE|TEMPLATE), content (markdown), nodeDetails (freeform JSON)
- Versioning: `/nodes/{nodeId}/versions` with snapshot/restore
- Hierarchy: `/nodes/{nodeId}/ancestors` and `/nodes/{nodeId}/descendants`

**Attributes/Relationships** — `POST/GET /api/nodes/{nodeId}/attributes`
- Connect any two nodes: sourceNodeId → targetNodeId
- Named relationships: attributeName (e.g., "contains", "references", "depends_on")
- Types: TYPED or SCHEMALESS
- Data types: TEXT, NUMBER, BOOLEAN, DATE, NODE_REF, LIST
- Freeform properties JSON

**Universal Relationship Types** (built-in):
- RELATES_TO — generic connection
- REFERENCES — soft link / citation
- INSPIRED_BY — creative connection
- SIMILAR_TO — semantic similarity
- PRECEDES — temporal ordering
- CONTAINS — containment / parent-child hierarchy

**Context Types** — `POST/GET /api/spaces/{spaceId}/context-types`
- Runtime-configurable schemas: define attribute schemas and relationship definitions per type
- Example: context type "task" with `{title: STRING, status: STRING, dueDate: DATE}`
- Schema relationships define expected connections between context types

**Attribute Promotion** — `POST/DELETE /api/spaces/{spaceSlug}/attributes/{attributeId}/promote`
- Promote an attribute to a full node (and demote back)

**Batch Upload** — `POST /api/spaces/{spaceId}/upload/batch`
- Bulk file upload to a space with session tracking

**Auth** — `POST /api/auth/login`, `POST /api/auth/oauth/google`, `GET /api/auth/me`
- JWT token-based. Google OAuth via idToken exchange.
- Real auth provider already built at `app/src/portal/providers/auth-provider.ts`

**Note**: GET /nodes currently has no query params for filtering/pagination in the Swagger spec. Filtering may need to be done client-side or via future API updates.

### Graph-Driven Pipeline (Not Hardcoded)
- **Decision**: Pipelines, stages, checklist items, tasks — all are Mujarad nodes connected by relationships. Nothing is hardcoded in the frontend.
- **Why**: Omar needs fully configurable pipeline structures — create new pipelines, add custom stages per instance, link documents/emails/meetings to checklist items, support multi-level hierarchies (mission → stage → task → subtask), cross-level dependencies, and percentage-based completion tracking.
- **Data model**:
  - `pipeline-template` node → CONTAINS → `stage-template` nodes (ordered) → CONTAINS → `checklist-item-template` nodes
  - `pipeline-instance` node → RELATES_TO → template, RELATES_TO → organization
  - `stage-instance` node → CONTAINS → `checklist-item-instance` nodes
  - Per-instance customization without altering template
  - Checklist items can link to documents, emails, meetings via relationships
  - Stage completion = all required checklist items checked → percentage derived from checked/total
- **Kanban view**: Generic renderer that groups any set of nodes by a configurable field. Same data also viewable as list/table.
- **Hierarchy**: Multi-level (L1 mission → L2 stage → L3 task → L4 subtask) with cross-level dependencies via PRECEDES/RELATES_TO relationships.
- **Default stages** (configurable): prospect → engaged → due_diligence → negotiation → active_partner → inactive

### R2 Folder Structure
- **Decision**: User-scoped hierarchy with stage-based file versioning
- **Why**: Prevents data mixing between users, provides audit trail for document lifecycle across signing stages
- **Structure**:
  ```
  {userId}/
  ├── profile/                          # User's own files
  ├── templates/                        # User's uploaded templates
  └── organizations/
      └── {orgId}-{orgSlug}/
          ├── general/                  # General org files
          └── files/
              └─��� {fileId}-{fileSlug}/
                  ├── original/         # Uploaded version
                  ├── pre-signed/       # Version sent for signing
                  └── post-signed/      # Completed signed version
  ```
- **Migration**: Existing files at `orgs/{orgId}/{fileName}` moved to new structure via one-time script
- **Current R2 state**: 1 file exists — `orgs/org-1/Wider Company Profile .pdf` (65MB)

### Map Library
- **Decision**: react-simple-maps (lightweight, SVG-based)
- **Why**: Country-level visualization only, ~50KB vs leaflet 200KB+. Global view by default.

### Email Provider
- **Decision**: Resend (confirmed by Omar)
- **Why**: Native react-email integration, simple API, good deliverability

## Risks / Trade-offs
- Mujarad GET /nodes has no server-side filtering in current API → client-side filtering for now, may need API update for large datasets
- R2 migration could fail for large files → dry-run mode, rollback script
- Mujarad entity API for organizations is upcoming → design provider layer to swap easily
- react-simple-maps may lack interactivity for future needs → can swap to leaflet later

## Migration Plan
1. Deploy new upload server with path-aware upload endpoint
2. Run migration script to move existing R2 files to new structure
3. Update FileUploader and file browser to use new paths
4. Fix PortalApp.tsx provider toggle to wire real mujarradDataProvider
5. Fix .env.local to point to correct Mujarad API URL
6. Test all CRUD against live Mujarad API
7. Rollback: `VITE_USE_MOCK=true` reverts to localStorage

## Resolved Questions
- **Mujarad backend**: Live at `https://mujarrad.onrender.com/api`, Swagger accessible
- **Email provider**: Resend (confirmed)
- **Map view**: Global view by default
- **Pipeline stages**: Configurable at runtime, defaults: prospect → engaged ��� due_diligence → negotiation → active_partner → inactive
- **Organizations in Mujarad**: Stored as regular nodes in `sia-portal` space for now; will migrate to dedicated entity API when released

## Open Questions
- What Mujarad user credentials should the portal use for API calls? (Or does each portal user get their own Mujarad account?)
- Does the Mujarad API support server-side filtering/pagination on node listing? (Not visible in current Swagger — may need client-side approach or API enhancement)
- Should pipeline templates be shared across users or per-user?
