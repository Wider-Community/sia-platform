import type { NodeType } from "./mujarrad-client";

export interface RelationshipDef {
  targetResource: string;
  fkField: string;
  verb: string;
  direction: "outgoing" | "incoming";
}

export interface EntityDef {
  nodeType: NodeType;
  titleField: string;
  requiredFields: string[];
  relationships: RelationshipDef[];
}

export const ENTITY_REGISTRY: Record<string, EntityDef> = {
  organizations: {
    nodeType: "CONTEXT",
    titleField: "name",
    requiredFields: ["name", "type", "status"],
    relationships: [],
  },
  contacts: {
    nodeType: "CONTEXT",
    titleField: "firstName",
    requiredFields: ["firstName", "lastName"],
    relationships: [
      {
        targetResource: "organizations",
        fkField: "organizationId",
        verb: "belongs_to",
        direction: "outgoing",
      },
    ],
  },
  files: {
    nodeType: "REGULAR",
    titleField: "name",
    requiredFields: ["name", "mimeType", "size", "r2ObjectKey", "uploadedBy", "organizationId"],
    relationships: [
      {
        targetResource: "organizations",
        fkField: "organizationId",
        verb: "belongs_to",
        direction: "outgoing",
      },
      {
        targetResource: "engagements",
        fkField: "engagementId",
        verb: "belongs_to",
        direction: "outgoing",
      },
    ],
  },
  notes: {
    nodeType: "REGULAR",
    titleField: "content",
    requiredFields: ["content", "createdBy", "organizationId"],
    relationships: [
      {
        targetResource: "organizations",
        fkField: "organizationId",
        verb: "belongs_to",
        direction: "outgoing",
      },
      {
        targetResource: "engagements",
        fkField: "engagementId",
        verb: "belongs_to",
        direction: "outgoing",
      },
    ],
  },
  engagements: {
    nodeType: "REGULAR",
    titleField: "title",
    requiredFields: ["title", "organizationId", "stage", "category", "createdBy"],
    relationships: [
      {
        targetResource: "organizations",
        fkField: "organizationId",
        verb: "belongs_to",
        direction: "outgoing",
      },
    ],
  },
  tasks: {
    nodeType: "REGULAR",
    titleField: "title",
    requiredFields: ["title", "dueDate", "status", "priority"],
    relationships: [
      {
        targetResource: "organizations",
        fkField: "organizationId",
        verb: "relates_to",
        direction: "outgoing",
      },
      {
        targetResource: "engagements",
        fkField: "engagementId",
        verb: "belongs_to",
        direction: "outgoing",
      },
    ],
  },
  "signing-requests": {
    nodeType: "REGULAR",
    titleField: "title",
    requiredFields: ["title", "status", "pdfUrl", "pdfFileName", "createdBy"],
    relationships: [
      {
        targetResource: "organizations",
        fkField: "organizationId",
        verb: "belongs_to",
        direction: "outgoing",
      },
      {
        targetResource: "engagements",
        fkField: "engagementId",
        verb: "belongs_to",
        direction: "outgoing",
      },
    ],
  },
  "signature-fields": {
    nodeType: "REGULAR",
    titleField: "page",
    requiredFields: ["signingRequestId", "signerId", "page", "xPct", "yPct", "widthPct", "heightPct"],
    relationships: [
      {
        targetResource: "signing-requests",
        fkField: "signingRequestId",
        verb: "belongs_to",
        direction: "outgoing",
      },
      {
        targetResource: "signers",
        fkField: "signerId",
        verb: "assigned_to",
        direction: "outgoing",
      },
    ],
  },
  signers: {
    nodeType: "REGULAR",
    titleField: "name",
    requiredFields: ["signingRequestId", "name", "email", "status", "token"],
    relationships: [
      {
        targetResource: "signing-requests",
        fkField: "signingRequestId",
        verb: "belongs_to",
        direction: "outgoing",
      },
    ],
  },
  "activity-events": {
    nodeType: "REGULAR",
    titleField: "action",
    requiredFields: ["action", "entityType", "entityId", "performedBy"],
    relationships: [
      {
        targetResource: "organizations",
        fkField: "organizationId",
        verb: "relates_to",
        direction: "outgoing",
      },
    ],
  },
  users: {
    nodeType: "CONTEXT",
    titleField: "name",
    requiredFields: ["email", "name", "role"],
    relationships: [],
  },
  "sla-rules": {
    nodeType: "REGULAR",
    titleField: "name",
    requiredFields: ["name", "entityType", "thresholdDays"],
    relationships: [],
  },
  alerts: {
    nodeType: "REGULAR",
    titleField: "title",
    requiredFields: ["type", "title", "message", "read"],
    relationships: [],
  },
};

export function getEntityDef(resource: string): EntityDef | undefined {
  return ENTITY_REGISTRY[resource];
}
