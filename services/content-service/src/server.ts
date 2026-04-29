import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadServiceEnv } from "@investbourse/config";
import { seoPageInputSchema } from "@investbourse/validators";
import type { SeoPage } from "@investbourse/types";

const env = loadServiceEnv({ ...process.env, PORT: process.env.PORT ?? "4020" });
const server = Fastify({ logger: true });

await server.register(cors, {
  origin: env.CORS_ORIGIN.split(","),
  credentials: true,
});

const now = new Date().toISOString();
const seoPages = new Map<string, SeoPage>([
  [
    "/",
    {
      id: "SEO-HOME",
      slug: "/",
      title: "Conseil en investissements boursiers institutionnels UEMOA",
      metaTitle: "Investbourse | Conseil en investissements boursiers institutionnels UEMOA",
      description: "Conseil en investissements boursiers pour institutionnels UEMOA : analyse de marchés, sélection OPCVM, appels d’offres, analyse de partenaires et gouvernance.",
      schemaType: "FinancialService",
      h1: "Conseil en investissements boursiers pour investisseurs institutionnels UEMOA",
      h2: "Analyse, sélection, appels d’offres et suivi des décisions d’investissement",
      h3: "Une approche construite pour les comités d’investissement",
      h4: "Traçabilité, gouvernance et transparence des recommandations",
      h5: "Cabinet sans réception de fonds ni conservation de titres",
      keywords: ["UEMOA", "OPCVM", "conseil investissement", "institutionnels"],
      isPublished: true,
      createdAt: now,
    },
  ],
]);

server.get("/health", async () => ({
  status: "ok",
  service: "content-service",
  persistence: "memory-temporary",
  timestamp: new Date().toISOString(),
}));

server.get("/seo-pages", async () => ({
  ok: true,
  data: Array.from(seoPages.values()).sort((a, b) => a.slug.localeCompare(b.slug)),
}));

server.get("/seo-pages/:slug", async (request, reply) => {
  const params = request.params as { slug: string };
  const normalizedSlug = params.slug === "home" ? "/" : `/${params.slug}`;
  const page = seoPages.get(normalizedSlug);

  if (!page) {
    return reply.status(404).send({ ok: false, error: "SEO_PAGE_NOT_FOUND" });
  }

  return { ok: true, data: page };
});

server.post("/seo-pages", async (request, reply) => {
  const parsed = seoPageInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const existing = seoPages.get(parsed.data.slug);
  const page: SeoPage = {
    id: existing?.id ?? `SEO-${Date.now()}`,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...parsed.data,
  };

  seoPages.set(page.slug, page);
  return reply.status(existing ? 200 : 201).send({ ok: true, data: page, mode: existing ? "updated" : "created" });
});

try {
  await server.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
