import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { loadServiceEnv } from "@investbourse/config";

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

async function forwardJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(payload));
  }

  return payload as T;
}

server.get("/health", async () => ({
  status: "ok",
  service: "api-gateway",
  mode: "rest-microservices",
  services: {
    contact: env.CONTACT_SERVICE_URL,
    content: env.CONTENT_SERVICE_URL,
    auth: env.AUTH_SERVICE_URL,
    admin: env.ADMIN_SERVICE_URL,
  },
  timestamp: new Date().toISOString(),
}));

server.post("/api/contact-requests", async (request, reply) => {
  const parsed = contactRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const payload = await forwardJson(`${env.CONTACT_SERVICE_URL}/contact-requests`, parsed.data);
    return reply.status(201).send(payload);
  } catch (error) {
    request.log.error(error);
    return reply.status(502).send({ ok: false, error: "CONTACT_SERVICE_UNAVAILABLE" });
  }
});

server.get("/api/seo-pages", async (_request, reply) => {
  try {
    const response = await fetch(`${env.CONTENT_SERVICE_URL}/seo-pages`);
    const payload = await response.json();
    return reply.status(response.status).send(payload);
  } catch (error) {
    server.log.error(error);
    return reply.status(502).send({ ok: false, error: "CONTENT_SERVICE_UNAVAILABLE" });
  }
});

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
