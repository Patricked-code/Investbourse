import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadServiceEnv } from "@investbourse/config";
import { contactRequestInputSchema } from "@investbourse/validators";
import { createContactRequest, getContactRequestById, listContactRequests, listContactRequestsByUser } from "./repositories/contact-request.repository.js";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4010" });
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

server.get("/health", async () => ({
  status: "ok",
  service: "contact-service",
  persistence: "postgres-prisma",
  modules: ["contact-requests", "user-linking"],
  timestamp: new Date().toISOString(),
}));

server.get("/contact-requests", async (_request, reply) => {
  try {
    const data = await listContactRequests();
    return { ok: true, data };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ ok: false, error: "CONTACT_REQUEST_LIST_FAILED" });
  }
});

server.get("/contact-requests/by-user/:userId", async (request, reply) => {
  const { userId } = request.params as { userId: string };

  try {
    const data = await listContactRequestsByUser(userId);
    return { ok: true, data };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "CONTACT_REQUEST_BY_USER_LIST_FAILED" });
  }
});

server.post("/contact-requests", async (request, reply) => {
  const parsed = contactRequestInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const item = await createContactRequest(parsed.data);
    return reply.status(201).send({ ok: true, data: item });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "CONTACT_REQUEST_CREATE_FAILED" });
  }
});

server.get("/contact-requests/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  try {
    const item = await getContactRequestById(id);

    if (!item) {
      return reply.status(404).send({ ok: false, error: "CONTACT_REQUEST_NOT_FOUND" });
    }

    return { ok: true, data: item };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "CONTACT_REQUEST_READ_FAILED" });
  }
});

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
