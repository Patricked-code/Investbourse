import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadServiceEnv } from "@investbourse/config";
import { officeMessageInputSchema } from "@investbourse/validators";
import { createWorkItem, getWorkDashboard, listWorkItems } from "./repositories/work.repository.js";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4040" });
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

server.get("/health", async () => ({
  status: "ok",
  service: "office-service",
  persistence: "postgres-prisma",
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
