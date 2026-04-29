import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";

const server = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 4020);
const host = process.env.HOST ?? "0.0.0.0";

await server.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(",") ?? true,
  credentials: true,
});

const seoPages = [
  {
    slug: "/",
    title: "Conseil en investissements boursiers institutionnels UEMOA",
    metaTitle: "Investbourse | Conseil en investissements boursiers institutionnels UEMOA",
    description: "Conseil en investissements boursiers pour institutionnels UEMOA : analyse de marchés, sélection OPCVM, appels d’offres, due diligence et gouvernance.",
    schemaType: "FinancialService",
    h1: "Conseil en investissements boursiers pour investisseurs institutionnels UEMOA",
    h2: "Analyse, sélection, appels d’offres et suivi des décisions d’investissement",
    h3: "Une approche construite pour les comités d’investissement",
    h4: "Traçabilité, gouvernance et transparence des recommandations",
    h5: "Cabinet sans réception de fonds ni conservation de titres",
    isPublished: true,
  },
  {
    slug: "/selection-fonds-opcvm",
    title: "Sélection de fonds OPCVM et sociétés de gestion",
    metaTitle: "Sélection fonds OPCVM UEMOA | Investbourse",
    description: "Analyse qualitative et quantitative des OPCVM, comparaison des sociétés de gestion, sélection de fonds, scoring, risques, frais et reporting.",
    schemaType: "Service",
    h1: "Sélection de fonds OPCVM et sociétés de gestion",
    h2: "Comparer les fonds au-delà de la performance brute",
    h3: "Performance, volatilité, drawdown, frais, liquidité et régularité",
    h4: "Analyse qualitative des équipes, processus et reporting",
    h5: "Scoring transparent et justification des choix",
    isPublished: true,
  },
];

const pageSchema = z.object({
  slug: z.string().min(1).startsWith("/"),
  title: z.string().min(3),
  metaTitle: z.string().min(3),
  description: z.string().min(20),
  schemaType: z.string().min(3),
  h1: z.string().min(3),
  h2: z.string().min(3),
  h3: z.string().min(3),
  h4: z.string().min(3),
  h5: z.string().min(3),
  isPublished: z.boolean().default(false),
});

server.get("/health", async () => ({
  status: "ok",
  service: "content-service",
  timestamp: new Date().toISOString(),
}));

server.get("/seo-pages", async () => ({
  ok: true,
  data: seoPages,
}));

server.get("/seo-pages/:slug", async (request, reply) => {
  const params = request.params as { slug: string };
  const normalizedSlug = params.slug === "home" ? "/" : `/${params.slug}`;
  const page = seoPages.find((item) => item.slug === normalizedSlug);

  if (!page) {
    return reply.status(404).send({ ok: false, error: "SEO_PAGE_NOT_FOUND" });
  }

  return { ok: true, data: page };
});

server.post("/seo-pages", async (request, reply) => {
  const parsed = pageSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const existingIndex = seoPages.findIndex((item) => item.slug === parsed.data.slug);

  if (existingIndex >= 0) {
    seoPages[existingIndex] = parsed.data;
    return reply.status(200).send({ ok: true, data: parsed.data, mode: "updated" });
  }

  seoPages.push(parsed.data);
  return reply.status(201).send({ ok: true, data: parsed.data, mode: "created" });
});

try {
  await server.listen({ port, host });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
