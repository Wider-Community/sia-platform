## ADDED Requirements

### Requirement: Graph-Driven Pipeline System
The system SHALL render pipelines, stages, tasks, and their hierarchies by querying Mujarad's node and relationship graph. Pipeline structures SHALL NOT be hardcoded — all pipeline templates, stages, checklist items, and relationships SHALL be Mujarad nodes connected via named relationships. Users SHALL be able to create, configure, and customize pipelines at runtime through the UI.

#### Scenario: User creates a new pipeline template
- **WHEN** user creates a pipeline template (e.g., "Partnership Onboarding")
- **THEN** a Mujarad node of context type `pipeline-template` SHALL be created
- **AND** user SHALL be able to add stage nodes linked via `contains` relationships
- **AND** each stage SHALL support checklist item nodes linked via `contains` relationships

#### Scenario: User assigns a pipeline to an organization
- **WHEN** user assigns the "Partnership Onboarding" pipeline to an organization
- **THEN** a pipeline instance node SHALL be created linked to both the template and the organization
- **AND** stage instances and checklist item instances SHALL be created from the template
- **AND** per-instance customization SHALL be possible without altering the template

### Requirement: Configurable Pipeline Stages
Pipeline stages SHALL be fully configurable at runtime. Users SHALL create, rename, reorder, and delete stages within a pipeline template. Each stage SHALL track completion via its checklist items — a stage is complete when all required checklist items are checked.

#### Scenario: User adds a custom stage to a pipeline instance
- **WHEN** user adds a stage "Special Due Diligence" to a specific org's pipeline
- **THEN** the stage SHALL be added to that instance only, without modifying the template

#### Scenario: Stage completion percentage
- **WHEN** a stage has 5 checklist items and 3 are completed
- **THEN** the stage SHALL display 60% completion
- **AND** when all 5 are completed, the stage status SHALL change to complete

### Requirement: Hierarchical Task Structure
The system SHALL support multi-level hierarchies of work items (missions → stages → tasks → subtasks) connected via Mujarad relationships. Items at any level MAY have dependencies on items at the same or different levels. The hierarchy SHALL be traversable via Mujarad's `ancestors` and `descendants` endpoints.

#### Scenario: User views task hierarchy
- **WHEN** user expands a stage card
- **THEN** the system SHALL display child tasks fetched via Mujarad descendants API
- **AND** each task MAY show its own children (subtasks)

#### Scenario: Cross-level dependencies
- **WHEN** a task in Stage 2 depends on a document in Stage 1
- **THEN** the dependency SHALL be represented as a Mujarad relationship
- **AND** the UI SHALL indicate blocked tasks whose dependencies are incomplete

### Requirement: Generic Kanban View
The system SHALL provide a Kanban board that renders any set of Mujarad nodes as cards grouped by a configurable field (status, stage, type, or any `nodeDetails` attribute). Users SHALL drag cards between columns to update the grouping field. The same data SHALL also be viewable as a list/table.

#### Scenario: User views pipeline as Kanban
- **WHEN** user navigates to the Pipeline page and selects Kanban view
- **THEN** nodes SHALL be displayed as cards in columns based on the selected grouping field
- **AND** each card SHALL show its title, type label, and completion indicator

#### Scenario: User drags card to new column
- **WHEN** user drags a card from one column to another
- **THEN** the node's grouping field SHALL be updated in Mujarad
- **AND** an activity event SHALL be logged with `from` and `to` values

#### Scenario: User filters cards by label
- **WHEN** user selects a type/label filter
- **THEN** only cards matching that label SHALL be displayed across all columns

#### Scenario: User switches to list view
- **WHEN** user toggles to list view
- **THEN** the same nodes SHALL be displayed in a sortable, filterable table

### Requirement: Checklist Items with Linked Actions
Each checklist item within a stage MAY be linked to a specific action type: manual task, document upload, email sent, meeting scheduled, or signature obtained. Completing the action SHALL automatically check the item.

#### Scenario: Checklist item linked to document
- **WHEN** a checklist item requires "Upload signed NDA"
- **THEN** uploading the NDA to the organization's files SHALL mark the item as complete
- **AND** the document SHALL be linked to the checklist item via a Mujarad relationship

#### Scenario: Checklist item is manual
- **WHEN** a checklist item is a manual task ("Schedule introductory call")
- **THEN** the user SHALL manually check it as complete

### Requirement: Pipeline Analytics
The system SHALL display pipeline analytics derived from Mujarad graph queries: count per stage, completion percentages, and node distribution across pipeline instances.

#### Scenario: Dashboard shows pipeline summary
- **WHEN** user views the dashboard
- **THEN** a pipeline summary widget SHALL show the count of organizations per active stage
- **AND** a chart SHALL visualize the distribution
