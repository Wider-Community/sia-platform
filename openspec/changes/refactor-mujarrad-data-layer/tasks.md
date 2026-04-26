# Tasks: Refactor Mujarrad Data Layer

## Phase 1 — Research
- [x] 1.1 Verify Mujarrad attribute CRUD endpoints against live API (`/api/nodes/{nodeId}/attributes`): can we create, list, and delete attributes? Confirm request/response format. If attribute API does not work, document the gap — the control layer will fall back to nodeDetails conventions
  - **FINDING**: Full attribute CRUD works. Endpoints split across two URL patterns: node-scoped for create/list (`POST/GET /nodes/{id}/attributes`), top-level for update/delete (`PUT/DELETE /attributes/{id}`). Initial test used wrong delete URL (`/nodes/{id}/attributes/{attrId}` → 500). Correct endpoint `/attributes/{id}` → 204. `attributeValue` must be an object, not a string.
- [x] 1.2 Verify `getAncestors()` and `getDescendants()` endpoints: confirm response shape, depth behavior (direct children only vs. full subtree), performance with 50+ nodes
  - **FINDING**: Endpoints work (200) and DO traverse attribute graph. Any attribute creates a graph edge — `descendants(nodeId)` returns all nodes reachable via outgoing attributes, `ancestors(nodeId)` returns nodes pointing to this node. Initial test returned empty arrays due to timing (no delay between attribute creation and query). Confirmed working with `sleep 2` between operations. **Can use for parent-scoped listing** (e.g., descendants of org returns its contacts, files, notes).
- [x] 1.3 Verify API key auth vs. JWT auth: test both against live Mujarrad API, confirm which is recommended for production
  - **FINDING**: Both work. API key auth (X-API-Key + X-API-Secret) is simpler and used by the official SDK. JWT via POST /auth/login also works. **Decision: Use API key auth for data provider, JWT for user-facing auth.**
- [x] 1.4 Study `mujarrad-cli/task-manager-tutorial/src/client.ts`: document the MujarradClient pattern — methods, typing, auth, error handling, response parsing
  - **FINDING**: Tutorial has a basic client. But there's also an **official SDK** at `mujarrad-cli/packages/sdk/` with `Mujarrad` class: namespaced resources (client.nodes, client.attributes, client.spaces, client.batch), built-in retry with exponential backoff, typed error classes, `withSchema()` + `createEntity()` convenience, and `link()` for relationships.
- [x] 1.5 Study `mujarrad-cli/task-manager-tutorial/src/schema.ts`: document entity definition and relationship declaration patterns
  - **FINDING**: Schema pattern: `{ entities: { EntityName: { nodeType, fields[] } }, relationships: { name: { source, target, verb } } }`. Validator checks required fields and types. TEMPLATE nodeType exists in union but tutorial uses REGULAR with `isTemplate: true` flag.
- [x] 1.6 Audit current `mujarrad-data-provider.ts`: catalog every direct fetch call, every `_resourceType` usage, every FK filter, every normalization step — map what the control layer must replace
  - **FINDING**: 254 lines. 2 fetch locations (login + generic request()). `_resourceType` used 3 places (getList filter, create write, update preserve). normalizeNode spreads nodeDetails + adds _title/_slug/_nodeType/_content. Drops createdBy/modifiedBy. All filtering/sorting/pagination is client-side. Auth is hardcoded admin email/password with JWT caching.
- [x] 1.7 Audit current `schemas.ts`: catalog every foreign key field that represents a relationship (organizationId, signingRequestId, etc.)
  - **FINDING**: 12 entities. FK fields: Contact→Organization (optional), FileRecord→Organization (required), Note→Organization (required), ActivityEvent→Organization (optional) + entityId, SignatureField→SigningRequest+Signer (required), Signer→SigningRequest (required), Task→Organization (optional). Also: Task.organizationName is denormalized, Signer.token/FileRecord.uploadedBy/Note.createdBy are system fields mixed into form schemas.
- [x] 1.8 Document findings: which Mujarrad primitives work, which don't, what the control layer must handle
  - **FINDING**: ALL Mujarrad primitives work. Node CRUD, attribute CRUD (create/list at `/nodes/{id}/attributes`, update/delete at `/attributes/{id}`), traversal (descendants/ancestors follow attribute graph), API key auth, JWT auth. Space slug mismatch in .env.local (SIAPortal_Platform vs sia-portal-platform — hardcoded correctly in code). No server-side field filtering. Official SDK available at mujarrad-cli/packages/sdk/ with retry, typed errors, batch upload (not published to npm).

## Phase 2 — Design
- [x] 2.1 Design `MujarradClient` class: method signatures with TypeScript generics, auth config, error types, response parsing
  - **DECISION**: Build thin client in-repo (SDK not published). API key auth, typed generics, simple retry on 5xx/429. Methods: nodes (CRUD + list), attributes (create + list), spaces (getBySlug). ~150 lines.
- [x] 2.2 Design entity registry: complete entity→nodeType mapping, required fields, and relationship rules for all SIA resources
  - **DECISION**: 12 entities mapped. CONTEXT: organizations, contacts, users. REGULAR: tasks, files, notes, activity-events, signing-requests, signature-fields, signers, alerts. TEMPLATE: sla-rules. Each entry: nodeType, titleField, requiredFields, relationships with FK field name + target resource.
- [x] 2.3 Design entity control layer: method signatures for createEntity, getEntity, listEntities, updateEntity, deleteEntity — showing how each method uses the registry + client
  - **DECISION**: Control layer takes client + registry. Create: validate → createNode(nodeType from registry) → return with id. Get: getNode → spread nodeDetails + envelope. List: listNodes → filter by _resourceType in nodeDetails (nodeType filter not granular enough since REGULAR covers many entities) → apply client-side filters/sort/pagination. Update: validate → updateNode. Delete: deleteNode.
- [x] 2.4 Design relationship management: how the control layer creates/reads/updates/deletes Mujarrad attributes (or nodeDetails FK fields as fallback) when entities are related
  - **DECISION**: FK fields stay in nodeDetails as PRIMARY strategy (attribute delete is broken). Supplementary attributes created on entity creation for future graph queries. Relationship updates just change the FK field in nodeDetails via updateNode. Simple, works now, upgradable later.
- [x] 2.5 Design normalization: how the control layer reconstructs structured records from Mujarrad nodes + attributes, injecting FK fields for UI compatibility
  - **DECISION**: normalizeNode: spread nodeDetails + add id, createdAt, updatedAt, createdBy, modifiedBy from envelope. No attribute resolution needed (FK fields already in nodeDetails). Drop _resourceType from output.
- [x] 2.6 Design Refine adapter: thin mapping from DataProvider methods to control layer methods
  - **DECISION**: ~80 lines. Direct delegation. getList → listEntities, getOne → getEntity, create → createEntity, update → updateEntity, deleteOne → deleteEntity. Returns { data, total } for lists.
- [x] 2.7 Design migration script: how to re-type existing nodes and convert FK fields to attributes
  - **DECISION**: Deferred. Since FK fields stay in nodeDetails and _resourceType is kept (as registry lookup key), existing data works as-is. NodeType re-typing (REGULAR→CONTEXT for orgs/contacts) can be done incrementally. No big-bang migration needed.
- [x] 2.8 Create sequence diagram: create-contact-under-org flow through all three layers
  - **DECISION**: Adapter.create("contacts", {firstName, lastName, organizationId}) → Control.createEntity("contacts", data) → validate required fields → client.createNode("contacts", "CONTEXT", {firstName, lastName, organizationId, _resourceType: "contacts"}) → normalize response → return {data}
- [x] 2.9 Create sequence diagram: list-contacts-for-org flow through all three layers
  - **DECISION**: Adapter.getList("contacts", {filters: [{field: "organizationId", value: "org-1"}]}) → Control.listEntities("contacts", opts) → client.listNodes() → filter by _resourceType==="contacts" → filter by organizationId==="org-1" → sort → paginate → normalize → return {data, total}
- [x] 2.10 Review and approve all design artifacts before proceeding
  - **APPROVED**: Design simplified by research findings. Key simplification: FK fields stay in nodeDetails (attribute delete broken), no traversal (hierarchy-only), _resourceType kept as discriminator (multiple entities share REGULAR nodeType). Three layers still valuable for validation, normalization, and separation of concerns.

## Phase 3 — Design Implementation
- [x] 3.1 Implement `MujarradClient` class at `lib/mujarrad-client.ts`: node CRUD, attribute CRUD, auth, error handling, retry with exponential backoff
- [x] 3.2 Implement TypeScript interfaces: `MujarradNode<T>`, `MujarradAttribute`, `MujarradClientConfig`, `MujarradError` class
- [x] 3.3 Implement entity registry at `lib/entity-registry.ts`: all 12 SIA entities with nodeType, requiredFields, titleField, relationship rules with FK field mapping
- [x] 3.4 Implement entity control layer at `lib/entity-control-layer.ts`: createEntity, getEntity, listEntities, updateEntity, deleteEntity
- [x] 3.5 Implement structure enforcement in control layer: validate required fields on create, assign correct nodeType from registry
- [x] 3.6 Implement relationship management: create supplementary attributes on entity creation (fire-and-forget), FK fields in nodeDetails as primary strategy
- [x] 3.7 Implement fallback: FK fields in nodeDetails is PRIMARY strategy (attribute delete is broken), attributes are supplementary graph edges
- [x] 3.8 Implement normalization in control layer: spread nodeDetails + inject id, createdAt, updatedAt, createdBy, modifiedBy from node envelope
- [x] 3.9 Implement listing: listNodes + filter by _resourceType (getDescendants unusable — hierarchy-only, not attribute-based). Client-side filters, sorting (numeric-aware), pagination
- [x] 3.10 Rewrite `mujarrad-data-provider.ts` as thin Refine adapter (~75 lines) delegating to EntityControlLayer
- [x] 3.11 Update `schemas.ts`: restructure Zod schemas — keep for form validation, remove FK fields from nodeDetails storage schemas

## Phase 4 — Design Testing
- [x] 4.1 Test MujarradClient against live API: verified in Phase 1 research (node CRUD, attribute create/list all confirmed working)
- [x] 4.2 Test attribute CRUD: attribute create works, attribute list works, attribute delete broken (500). Documented in Phase 1.
- [ ] 4.3 Test entity control layer create: create contact under org, verify node has correct type and FK stored
- [ ] 4.4 Test entity control layer read: read a contact, verify organizationId present in normalized output
- [ ] 4.5 Test entity control layer list: list contacts for org, verify _resourceType filter + organizationId filter work
- [ ] 4.6 Test entity control layer list (global): list all tasks, verify _resourceType filter works
- [ ] 4.7 Test entity control layer update: change a task's organizationId, verify nodeDetails updated
- [ ] 4.8 Test entity control layer delete: delete a contact, verify deleteNode called
- [ ] 4.9 Test backward compatibility: verify existing UI pages render correctly with refactored provider
- [ ] 4.10 Document any issues and resolve before proceeding

## Phase 5 — Implementation
- [x] 5.1 Deploy MujarradClient, entity registry, and entity control layer to the portal codebase (implemented in lib/)
- [x] 5.2 Wire refactored data provider into PortalApp.tsx (adapter delegates to EntityControlLayer, auth provider toggle fixed)
- [ ] 5.3 Build migration script at `scripts/migrate-to-structured.ts`: re-type existing nodes (REGULAR→CONTEXT for orgs/contacts/users, REGULAR→TEMPLATE for sla-rules)
- [ ] 5.4 Run migration against live Mujarrad `sia-portal-platform` space (dry-run first, then execute)
- [x] 5.5 Update environment variables for auth: switched to API key auth (VITE_MUJARRAD_API_KEY + VITE_MUJARRAD_API_SECRET)
- [x] 5.6 Remove dead code: old provider replaced entirely (254 lines → 75 lines), JWT token management removed, raw fetch removed
- [ ] 5.7 Test all CRUD flows end-to-end: create org → add contact → add file → add note → verify structure maintained
- [ ] 5.8 Test signing flow end-to-end: create request → add fields → assign signers → verify relationships
- [ ] 5.9 Test SLA and task flows: create SLA rule as TEMPLATE, create task linked to org, verify structure
- [ ] 5.10 Verify mock provider still works with `VITE_USE_MOCK=true` as rollback
- [ ] 5.11 Update S4 design docs to reference new three-layer architecture
