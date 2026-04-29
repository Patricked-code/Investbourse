import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadServiceEnv } from "@investbourse/config";
import { contactRequestInputSchema } from "@investbourse/validators";
import type { ContactRequest } from "@investbourse/types";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4010" });
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

const contactRequests = new Map<string, ContactRequest>();

server.get("/health", async () => ({
  status: "ok",
  service: "contact-service",
  persistence: "memory-temporary",
  timestamp: new Date().toISOString(),
}));

server.get("/contact-requests", async () => ({
  ok: true,
  data: Array.from(contactRequests.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
}));

server.post("/contact-requests", async (request, reply) => {
  const parsed = contactRequestInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const item: ContactRequest = {
    id: `REQ-${Date.now()}`,
    status: "NEW",
    assignedToUserId: null,
    createdAt: new Date().toISOString(),
    ...parsed.data,
  };

  contactRequests.set(item.id, item);

  return reply.status(201).send({ ok: true, data: item });
});

server.get("/contact-requests/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const item = contactRequests.get(id);

  if (!item) {
    return reply.status(404).send({ ok: false, error: "CONTACT_REQUEST_NOT_FOUND" });
  }

  return { ok: true, data: item };
});

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
