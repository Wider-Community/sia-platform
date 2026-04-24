import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["partner", "investor", "vendor", "client"], { message: "Type is required" }),
  status: z.enum(["active", "inactive", "prospect"], { message: "Status is required" }),
  country: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.string().optional(),
  organizationId: z.string().optional(),
});

export const fileRecordSchema = z.object({
  name: z.string().min(1),
  mimeType: z.enum([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ]),
  size: z.number().max(100 * 1024 * 1024, "File must be under 100MB"),
  r2ObjectKey: z.string().min(1),
  uploadedBy: z.string().min(1),
  organizationId: z.string().min(1),
});

export const noteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty"),
  createdBy: z.string().min(1),
  organizationId: z.string().min(1),
});

export const activityEventSchema = z.object({
  action: z.enum(["created", "updated", "deleted"]),
  entityType: z.enum(["organization", "contact", "file", "note"]),
  entityId: z.string().min(1),
  entityName: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
  performedBy: z.string().min(1),
  organizationId: z.string().optional(),
});

export const userSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  avatar: z.string().optional(),
  role: z.enum(["admin", "client"]),
  locale: z.string().optional(),
  theme: z.enum(["light", "dark"]).optional(),
});

export type Organization = z.infer<typeof organizationSchema> & { id: string; createdAt: string; updatedAt: string };
export type Contact = z.infer<typeof contactSchema> & { id: string; createdAt: string; updatedAt: string };
export type FileRecord = z.infer<typeof fileRecordSchema> & { id: string; createdAt: string };
export type Note = z.infer<typeof noteSchema> & { id: string; createdAt: string };
export type ActivityEvent = z.infer<typeof activityEventSchema> & { id: string; createdAt: string };
export type User = z.infer<typeof userSchema> & { id: string; lastLoginAt?: string; createdAt: string; updatedAt: string };

// ── Signing ──

export const signingRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["draft", "sent", "partially_signed", "completed", "cancelled"]),
  pdfUrl: z.string().min(1, "PDF is required"),
  pdfFileName: z.string().min(1),
  message: z.string().optional(),
  createdBy: z.string().min(1),
  completedPdfUrl: z.string().optional(),
});

export const signatureFieldSchema = z.object({
  signingRequestId: z.string().min(1),
  signerId: z.string().min(1),
  page: z.number().int().min(1),
  xPct: z.number().min(0).max(100),
  yPct: z.number().min(0).max(100),
  widthPct: z.number().min(0).max(100),
  heightPct: z.number().min(0).max(100),
  signedImageUrl: z.string().optional(),
});

export const signerSchema = z.object({
  signingRequestId: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  status: z.enum(["pending", "signed", "declined"]),
  token: z.string().min(1),
  signedAt: z.string().optional(),
  color: z.string().optional(),
});

export type SigningRequest = z.infer<typeof signingRequestSchema> & { id: string; createdAt: string; updatedAt: string };
export type SignatureField = z.infer<typeof signatureFieldSchema> & { id: string; createdAt: string };
export type Signer = z.infer<typeof signerSchema> & { id: string; createdAt: string };
