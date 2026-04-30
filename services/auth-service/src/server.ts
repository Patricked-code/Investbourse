import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadServiceEnv } from "@investbourse/config";
import { userLoginInputSchema, userRegistrationInputSchema } from "@investbourse/validators";
import { authenticateIdentity, getIdentityById, registerIdentity } from "./repositories/identity.repository.js";
import { createSessionToken, verifySessionToken } from "./lib/session.js";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4030" });
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

server.get("/health", async () => ({
  status: "ok",
  service: "auth-service",
  persistence: "postgres-prisma",
  timestamp: new Date().toISOString(),
}));

server.post("/auth/register", async (request, reply) => {
  const parsed = userRegistrationInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const result = await registerIdentity(parsed.data);

    if (!result.ok) {
      return reply.status(409).send(result);
    }

    const token = createSessionToken({ id: result.data.id, email: result.data.email, role: result.data.role });
    return reply.status(201).send({ ok: true, data: { user: result.data, token } });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "REGISTER_FAILED" });
  }
});

server.post("/auth/login", async (request, reply) => {
  const parsed = userLoginInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const result = await authenticateIdentity(parsed.data.email, parsed.data.password);

    if (!result.ok) {
      return reply.status(401).send(result);
    }

    const token = createSessionToken({ id: result.data.id, email: result.data.email, role: result.data.role });
    return reply.status(200).send({ ok: true, data: { user: result.data, token } });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "LOGIN_FAILED" });
  }
});

server.post("/auth/session", async (request, reply) => {
  const body = request.body as { token?: string } | undefined;
  const payload = verifySessionToken(body?.token);

  if (!payload) {
    return reply.status(401).send({ ok: false, error: "INVALID_SESSION" });
  }

  const user = await getIdentityById(payload.sub);
  if (!user) {
    return reply.status(401).send({ ok: false, error: "USER_NOT_FOUND" });
  }

  return { ok: true, data: { user, session: payload } };
});

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
