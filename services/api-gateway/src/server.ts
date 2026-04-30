import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { loadServiceEnv } from "@investbourse/config";
import { userLoginInputSchema, userRegistrationInputSchema } from "@investbourse/validators";

const env = loadServiceEnv();
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

const contactRequestSchema = z.object({
  fullName: z.string().min(2),
  organization: z.string().min(2),
  email: z.string().email(),
  requestType: z.string().min(2),
  message: z.string().min(10),
});

const officeMessageSchema = z.object({
  contactRequestId: z.string().min(1),
  status: z.enum(["OPEN", "REVIEW", "ANSWERED", "ARCHIVED"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).default("NORMAL"),
  assignedTo: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

const sessionValidationSchema = z.object({ token: z.string().min(10) });
const userAdminUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional(),
  status: z.enum(["PENDING_VERIFICATION", "ACTIVE", "DISABLED"]).optional(),
  actorUserId: z.string().optional().nullable(),
});

async function forwardPatch<T>(url: string, body: unknown): Promise<{ status: number; payload: T }> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as T;
  return { status: response.status, payload };
}

async function forwardPost<T>(url: string, body: unknown): Promise<{ status: number; payload: T }> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as T;
  return { status: response.status, payload };
}

async function forwardGet<T>(url: string): Promise<{ status: number; payload: T }> {
  const response = await fetch(url);
  const payload = (await response.json()) as T;
  return { status: response.status, payload };
}

server.get("/health", async () => ({
  status: "ok",
  service: "api-gateway",
  mode: "rest-microservices",
  services: {
    contact: env.CONTACT_SERVICE_URL,
    content: env.CONTENT_SERVICE_URL,
    auth: env.AUTH_SERVICE_URL,
    office: env.OFFICE_SERVICE_URL,
  },
  timestamp: new Date().toISOString(),
}));

server.post("/api/auth/register", async (request, reply) => {
  const parsed = userRegistrationInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const { status, payload } = await forwardPost(`${env.AUTH_SERVICE_URL}/auth/register`, parsed.data);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "AUTH_SERVICE_UNAVAILABLE" });
  }
});

server.post("/api/auth/login", async (request, reply) => {
  const parsed = userLoginInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const { status, payload } = await forwardPost(`${env.AUTH_SERVICE_URL}/auth/login`, parsed.data);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "AUTH_SERVICE_UNAVAILABLE" });
  }
});

server.post("/api/auth/session", async (request, reply) => {
  const parsed = sessionValidationSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const { status, payload } = await forwardPost(`${env.AUTH_SERVICE_URL}/auth/session`, parsed.data);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "AUTH_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/auth/users", async (_request, reply) => {
  try {
    const { status, payload } = await forwardGet(`${env.AUTH_SERVICE_URL}/auth/users`);
    return reply.status(status).send(payload);
  } catch (error) {
    server.log.error(error);
    return reply.status(502).send({ ok: false, error: "AUTH_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/auth/users/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  try {
    const { status, payload } = await forwardGet(`${env.AUTH_SERVICE_URL}/auth/users/${id}`);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "AUTH_SERVICE_UNAVAILABLE" });
  }
});

server.patch("/api/auth/users/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const parsed = userAdminUpdateSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const { status, payload } = await forwardPatch(`${env.AUTH_SERVICE_URL}/auth/users/${id}`, parsed.data);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "AUTH_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/contact-requests", async (_request, reply) => {
  try {
    const { status, payload } = await forwardGet(`${env.CONTACT_SERVICE_URL}/contact-requests`);
    return reply.status(status).send(payload);
  } catch (error) {
    server.log.error(error);
    return reply.status(502).send({ ok: false, error: "CONTACT_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/contact-requests/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  try {
    const { status, payload } = await forwardGet(`${env.CONTACT_SERVICE_URL}/contact-requests/${id}`);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "CONTACT_SERVICE_UNAVAILABLE" });
  }
});

server.post("/api/contact-requests", async (request, reply) => {
  const parsed = contactRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const { status, payload } = await forwardPost(`${env.CONTACT_SERVICE_URL}/contact-requests`, parsed.data);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "CONTACT_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/seo-pages", async (_request, reply) => {
  try {
    const { status, payload } = await forwardGet(`${env.CONTENT_SERVICE_URL}/seo-pages`);
    return reply.status(status).send(payload);
  } catch (error) {
    server.log.error(error);
    return reply.status(502).send({ ok: false, error: "CONTENT_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/office/dashboard", async (_request, reply) => {
  try {
    const { status, payload } = await forwardGet(`${env.OFFICE_SERVICE_URL}/office/dashboard`);
    return reply.status(status).send(payload);
  } catch (error) {
    server.log.error(error);
    return reply.status(502).send({ ok: false, error: "OFFICE_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/office/messages", async (_request, reply) => {
  try {
    const { status, payload } = await forwardGet(`${env.OFFICE_SERVICE_URL}/office/messages`);
    return reply.status(status).send(payload);
  } catch (error) {
    server.log.error(error);
    return reply.status(502).send({ ok: false, error: "OFFICE_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/office/messages/by-contact-request/:contactRequestId", async (request, reply) => {
  const { contactRequestId } = request.params as { contactRequestId: string };

  try {
    const { status, payload } = await forwardGet(`${env.OFFICE_SERVICE_URL}/office/messages/by-contact-request/${contactRequestId}`);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "OFFICE_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/office/audit", async (_request, reply) => {
  try {
    const { status, payload } = await forwardGet(`${env.OFFICE_SERVICE_URL}/office/audit`);
    return reply.status(status).send(payload);
  } catch (error) {
    server.log.error(error);
    return reply.status(502).send({ ok: false, error: "OFFICE_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/office/audit/by-contact-request/:contactRequestId", async (request, reply) => {
  const { contactRequestId } = request.params as { contactRequestId: string };

  try {
    const { status, payload } = await forwardGet(`${env.OFFICE_SERVICE_URL}/office/audit/by-contact-request/${contactRequestId}`);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "OFFICE_SERVICE_UNAVAILABLE" });
  }
});

server.post("/api/office/messages", async (request, reply) => {
  const parsed = officeMessageSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const { status, payload } = await forwardPost(`${env.OFFICE_SERVICE_URL}/office/messages`, parsed.data);
    return reply.status(status).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "OFFICE_SERVICE_UNAVAILABLE" });
  }
});

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
