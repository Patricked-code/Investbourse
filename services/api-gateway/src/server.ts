import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";

const server = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

await server.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(",") ?? true,
  credentials: true,
});

const contactRequestSchema = z.object({
  fullName: z.string().min(2),
  organization: z.string().min(2),
  email: z.string().email(),
  requestType: z.string().min(2),
  message: z.string().min(10),
});

server.get("/health", async () => ({
  status: "ok",
  service: "api-gateway",
  mode: "rest-microservices",
  timestamp: new Date().toISOString(),
}));

server.post("/api/contact-requests", async (request, reply) => {
  const parsed = contactRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      ok: false,
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  return reply.status(202).send({
    ok: true,
    status: "accepted",
    message: "Contact request received by API gateway. Forwarding to contact-service will be wired in the next implementation step.",
    data: {
      id: `REQ-${Date.now()}`,
      ...parsed.data,
      receivedAt: new Date().toISOString(),
    },
  });
});

try {
  await server.listen({ port, host });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
