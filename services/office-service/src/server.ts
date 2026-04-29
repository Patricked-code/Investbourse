import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { loadServiceEnv } from "@investbourse/config";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4040" });
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

type OfficeMessage = {
  id: string;
  contactRequestId: string;
  status: "OPEN" | "REVIEW" | "ANSWERED" | "ARCHIVED";
  priority: "LOW" | "NORMAL" | "HIGH";
  assignedTo?: string | null;
  note?: string | null;
  updatedAt: string;
};

const officeMessages = new Map<string, OfficeMessage>();

const updateMessageSchema = z.object({
  contactRequestId: z.string().min(1),
  status: z.enum(["OPEN", "REVIEW", "ANSWERED", "ARCHIVED"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).default("NORMAL"),
  assignedTo: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

server.get("/health", async () => ({
  status: "ok",
  service: "office-service",
  timestamp: new Date().toISOString(),
}));

server.get("/office/messages", async () => ({
  ok: true,
  data: Array.from(officeMessages.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
}));

server.post("/office/messages", async (request, reply) => {
  const parsed = updateMessageSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const record: OfficeMessage = {
    id: `OFF-${Date.now()}`,
    contactRequestId: parsed.data.contactRequestId,
    status: parsed.data.status,
    priority: parsed.data.priority,
    assignedTo: parsed.data.assignedTo,
    note: parsed.data.note,
    updatedAt: new Date().toISOString(),
  };

  officeMessages.set(record.id, record);
  return reply.status(201).send({ ok: true, data: record });
});

server.get("/office/dashboard", async () => ({
  ok: true,
  data: {
    total: officeMessages.size,
    open: Array.from(officeMessages.values()).filter((item) => item.status === "OPEN").length,
    review: Array.from(officeMessages.values()).filter((item) => item.status === "REVIEW").length,
    answered: Array.from(officeMessages.values()).filter((item) => item.status === "ANSWERED").length,
    archived: Array.from(officeMessages.values()).filter((item) => item.status === "ARCHIVED").length,
  },
}));

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
