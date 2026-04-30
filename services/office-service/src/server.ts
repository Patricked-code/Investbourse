import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { loadServiceEnv } from "@investbourse/config";
import { officeMessageInputSchema } from "@investbourse/validators";
import { createMissionDocument, listMissionDocuments, listMissionDocumentsByContactRequest, listMissionDocumentsForUser } from "./repositories/document.repository.js";
import { createWorkItem, getWorkDashboard, listAuditItemsByContactRequest, listRecentAuditItems, listWorkItems, listWorkItemsByContactRequest } from "./repositories/work.repository.js";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4040" });
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

const missionDocumentSchema = z.object({
  title: z.string().trim().min(2).max(220),
  description: z.string().trim().max(2000).optional().nullable(),
  fileName: z.string().trim().min(2).max(260),
  fileUrl: z.string().trim().min(2).max(2000),
  category: z.enum(["NOTE_CADRAGE", "RAPPORT_ANALYSE", "GRILLE_SCORING", "CAHIER_CHARGES", "CONTRAT", "LIVRABLE", "AUTRE"]).default("AUTRE"),
  visibility: z.enum(["INTERNAL_ONLY", "CLIENT_VISIBLE"]).default("INTERNAL_ONLY"),
  contactRequestId: z.string().trim().optional().nullable(),
  userId: z.string().trim().optional().nullable(),
  uploadedByLabel: z.string().trim().max(160).optional().nullable(),
  actorUserId: z.string().trim().optional().nullable(),
});

server.get("/health", async () => ({
  status: "ok",
  service: "office-service",
  persistence: "postgres-prisma",
  modules: ["messages", "audit", "documents"],
  timestamp: new Date().toISOString(),
}));

server.get("/office/messages", async (_request, reply) => {
  try {
    const data = await listWorkItems();
    return { ok: true, data };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ ok: false, error: "OFFICE_MESSAGES_LIST_FAILED" });
  }
});

server.get("/office/messages/by-contact-request/:contactRequestId", async (request, reply) => {
  const { contactRequestId } = request.params as { contactRequestId: string };

  try {
    const data = await listWorkItemsByContactRequest(contactRequestId);
    return { ok: true, data };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "OFFICE_MESSAGES_BY_CONTACT_LIST_FAILED" });
  }
});

server.get("/office/audit", async (_request, reply) => {
  try {
    const data = await listRecentAuditItems();
    return { ok: true, data };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ ok: false, error: "OFFICE_AUDIT_LIST_FAILED" });
  }
});

server.get("/office/audit/by-contact-request/:contactRequestId", async (request, reply) => {
  const { contactRequestId } = request.params as { contactRequestId: string };

  try {
    const data = await listAuditItemsByContactRequest(contactRequestId);
    return { ok: true, data };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "OFFICE_AUDIT_BY_CONTACT_LIST_FAILED" });
  }
});

server.get("/office/documents", async (_request, reply) => {
  try {
    const data = await listMissionDocuments();
    return { ok: true, data };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ ok: false, error: "MISSION_DOCUMENTS_LIST_FAILED" });
  }
});

server.get("/office/documents/by-user/:userId", async (request, reply) => {
  const { userId } = request.params as { userId: string };

  try {
    const data = await listMissionDocumentsForUser(userId);
    return { ok: true, data };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "MISSION_DOCUMENTS_BY_USER_LIST_FAILED" });
  }
});

server.get("/office/documents/by-contact-request/:contactRequestId", async (request, reply) => {
  const { contactRequestId } = request.params as { contactRequestId: string };

  try {
    const data = await listMissionDocumentsByContactRequest(contactRequestId);
    return { ok: true, data };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "MISSION_DOCUMENTS_BY_CONTACT_LIST_FAILED" });
  }
});

server.post("/office/documents", async (request, reply) => {
  const parsed = missionDocumentSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const data = await createMissionDocument(parsed.data);
    return reply.status(201).send({ ok: true, data });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "MISSION_DOCUMENT_CREATE_FAILED" });
  }
});

server.post("/office/messages", async (request, reply) => {
  const parsed = officeMessageInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const data = await createWorkItem(parsed.data);
    return reply.status(201).send({ ok: true, data });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "OFFICE_MESSAGE_CREATE_FAILED" });
  }
});

server.get("/office/dashboard", async (_request, reply) => {
  try {
    const data = await getWorkDashboard();
    return { ok: true, data };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ ok: false, error: "OFFICE_DASHBOARD_FAILED" });
  }
});

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
