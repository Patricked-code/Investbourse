import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadServiceEnv } from "@investbourse/config";
import { seoPageInputSchema } from "@investbourse/validators";
import { getSeoPageBySlug, listSeoPages, upsertSeoPage } from "./repositories/seo-page.repository.js";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4020" });
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

server.get("/health", async () => ({
  status: "ok",
  service: "content-service",
  persistence: "postgres-prisma",
  timestamp: new Date().toISOString(),
}));

server.get("/seo-pages", async (_request, reply) => {
  try {
    const data = await listSeoPages();
    return { ok: true, data };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ ok: false, error: "SEO_PAGE_LIST_FAILED" });
  }
});

server.get("/seo-pages/:slug", async (request, reply) => {
  const params = request.params as { slug: string };
  const normalizedSlug = params.slug === "home" ? "/" : `/${params.slug}`;

  try {
    const page = await getSeoPageBySlug(normalizedSlug);

    if (!page) {
      return reply.status(404).send({ ok: false, error: "SEO_PAGE_NOT_FOUND" });
    }

    return { ok: true, data: page };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "SEO_PAGE_READ_FAILED" });
  }
});

server.post("/seo-pages", async (request, reply) => {
  const parsed = seoPageInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  try {
    const page = await upsertSeoPage(parsed.data);
    return reply.status(200).send({ ok: true, data: page });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ ok: false, error: "SEO_PAGE_SAVE_FAILED" });
  }
});

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
