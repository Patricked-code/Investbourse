import { z } from "zod";

export const contactRequestInputSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  organization: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(240),
  requestType: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(5000),
});

export const officeMessageInputSchema = z.object({
  contactRequestId: z.string().trim().min(1).max(160),
  status: z.enum(["OPEN", "REVIEW", "ANSWERED", "ARCHIVED"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).default("NORMAL"),
  assignedTo: z.string().trim().max(160).optional().nullable(),
  note: z.string().trim().max(5000).optional().nullable(),
});

export const seoPageInputSchema = z.object({
  slug: z.string().trim().min(1).startsWith("/").max(180),
  title: z.string().trim().min(3).max(180),
  metaTitle: z.string().trim().min(3).max(220),
  description: z.string().trim().min(20).max(500),
  schemaType: z.string().trim().min(3).max(80),
  h1: z.string().trim().min(3).max(220),
  h2: z.string().trim().min(3).max(220),
  h3: z.string().trim().min(3).max(220),
  h4: z.string().trim().min(3).max(220),
  h5: z.string().trim().min(3).max(220),
  keywords: z.array(z.string().trim().min(1).max(80)).default([]),
  isPublished: z.boolean().default(false),
});

export const userRegistrationInputSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  organization: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(240),
  password: z.string().min(8).max(200),
});

export const userLoginInputSchema = z.object({
  email: z.string().trim().email().max(240),
  password: z.string().min(1).max(200),
});

export type ContactRequestInput = z.infer<typeof contactRequestInputSchema>;
export type OfficeMessageInput = z.infer<typeof officeMessageInputSchema>;
export type SeoPageInput = z.infer<typeof seoPageInputSchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationInputSchema>;
export type UserLoginInput = z.infer<typeof userLoginInputSchema>;
