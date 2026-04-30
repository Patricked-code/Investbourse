import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { loadServiceEnv } from "@investbourse/config";
import { userLoginInputSchema, userRegistrationInputSchema } from "@investbourse/validators";
import { authenticateIdentity, getIdentityById, registerIdentity } from "./repositories/identity.repository.js";
import { confirmPasswordReset, requestPasswordReset } from "./repositories/password-reset.repository.js";
import { getUserForAdministration, listUsersForAdministration, updateUserRoleAndStatus } from "./repositories/user-admin.repository.js";
import { createSessionToken, verifySessionToken } from "./lib/session.js";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4030" });
const server = Fastify({ logger: true });

await server.register(cors, { origin: env.CORS_ORIGIN.split(","), credentials: true });

const userAdminUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional(),
  status: z.enum(["PENDING_VERIFICATION", "ACTIVE", "DISABLED"]).optional(),
  actorUserId: z.string().optional().nullable(),
});
const passwordResetRequestSchema = z.object({ email: z.string().email() });
const passwordResetConfirmSchema = z.object({ token: z.string().min(20), password: z.string().min(8) });

server.get("/health", async () => ({ status: "ok", service: "auth-service", persistence: "postgres-prisma", modules: ["identity", "users", "password-reset"], timestamp: new Date().toISOString() }));

server.post("/auth/register", async (request, reply) => {
  const parsed = userRegistrationInputSchema.safeParse(request.body);
  if (!parsed.success) return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  try {
    const result = await registerIdentity(parsed.data);
    if (!result.ok) return reply.status(409).send(result);
    const token = createSessionToken({ id: result.data.id, email: result.data.email, role: result.data.role });
    return reply.status(201).send({ ok: true, data: { user: result.data, token } });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "REGISTER_FAILED" });
  }
});

server.post("/auth/login", async (request, reply) => {
  const parsed = userLoginInputSchema.safeParse(request.body);
  if (!parsed.success) return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  try {
    const result = await authenticateIdentity(parsed.data.email, parsed.data.password);
    if (!result.ok) return reply.status(401).send(result);
    const token = createSessionToken({ id: result.data.id, email: result.data.email, role: result.data.role });
    return reply.status(200).send({ ok: true, data: { user: result.data, token } });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "LOGIN_FAILED" });
  }
});

server.post("/auth/password-reset/request", async (request, reply) => {
  const parsed = passwordResetRequestSchema.safeParse(request.body);
  if (!parsed.success) return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  try {
    const result = await requestPasswordReset(parsed.data.email);
    return reply.status(200).send(result);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "PASSWORD_RESET_REQUEST_FAILED" });
  }
});

server.post("/auth/password-reset/confirm", async (request, reply) => {
  const parsed = passwordResetConfirmSchema.safeParse(request.body);
  if (!parsed.success) return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  try {
    const result = await confirmPasswordReset(parsed.data);
    if (!result.ok) return reply.status(400).send(result);
    return reply.status(200).send(result);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "PASSWORD_RESET_CONFIRM_FAILED" });
  }
});

server.post("/auth/session", async (request, reply) => {
  const body = request.body as { token?: string } | undefined;
  const payload = verifySessionToken(body?.token);
  if (!payload) return reply.status(401).send({ ok: false, error: "INVALID_SESSION" });
  const user = await getIdentityById(payload.sub);
  if (!user) return reply.status(401).send({ ok: false, error: "USER_NOT_FOUND" });
  return { ok: true, data: { user, session: payload } };
});

server.get("/auth/users", async (_request, reply) => {
  try { return { ok: true, data: await listUsersForAdministration() }; } catch (error) { server.log.error(error); return reply.status(500).send({ ok: false, error: "USERS_LIST_FAILED" }); }
});
server.get("/auth/users/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  try { const data = await getUserForAdministration(id); return data ? { ok: true, data } : reply.status(404).send({ ok: false, error: "USER_NOT_FOUND" }); } catch (error) { request.log.error(error); return reply.status(500).send({ ok: false, error: "USER_READ_FAILED" }); }
});
server.patch("/auth/users/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const parsed = userAdminUpdateSchema.safeParse(request.body);
  if (!parsed.success) return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  try { return { ok: true, data: await updateUserRoleAndStatus({ id, ...parsed.data }) }; } catch (error) { request.log.error(error); return reply.status(500).send({ ok: false, error: "USER_UPDATE_FAILED" }); }
});

try { await server.listen({ port: env.PORT, host: env.HOST }); } catch (error) { server.log.error(error); process.exit(1); }
