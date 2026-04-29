import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";

const server = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 4010);
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

type ContactRequest = z.infer<typeof contactRequestSchema> & {
  id: string;
  status: "NEW" | "QUALIFIED" | "IN_PROGRESS" | "CLOSED";
  receivedAt: string;
};

const contactRequests = new Map<string, ContactRequest>();

server.get("/health", async () => ({
  status: "ok",
  service: "contact-service",
  timestamp: new Date().toISOString(),
}));

server.get("/contact-requests", async () => ({
  ok: true,
  data: Array.from(contactRequests.values()).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)),
}));

server.post("/contact-requests", async (request, reply) => {
  const parsed = contactRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      ok: false,
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten(),
    });
  }

  const item: ContactRequest = {
    id: `REQ-${Date.now()}`,
    status: "NEW",
    receivedAt: new Date().toISOString(),
    ...parsed.data,
  };

  contactRequests.set(item.id, item);

  return reply.status(201).send({ ok: true, data: item });
});

try {
  await server.listen({ port, host });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
