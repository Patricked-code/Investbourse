import { z } from "zod";

const numberFromEnv = (fallback: number) => z.coerce.number().int().positive().default(fallback);

export const serviceEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: numberFromEnv(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().optional(),
  CONTACT_SERVICE_URL: z.string().url().default("http://localhost:4010"),
  CONTENT_SERVICE_URL: z.string().url().default("http://localhost:4020"),
  AUTH_SERVICE_URL: z.string().url().default("http://localhost:4030"),
  ADMIN_SERVICE_URL: z.string().url().default("http://localhost:4040"),
  OFFICE_SERVICE_URL: z.string().url().default("http://localhost:4040"),
});

export type ServiceEnv = z.infer<typeof serviceEnvSchema>;

export function loadServiceEnv(overrides: NodeJS.ProcessEnv = process.env): ServiceEnv {
  return serviceEnvSchema.parse(overrides);
}

export const sessionConfig = {
  cookieName: "investbourse_session",
  localBypassCookieName: "investbourse_admin_bypass",
  maxAgeSeconds: 60 * 60 * 8,
};

export const publicSiteConfig = {
  name: "Investbourse",
  areaServed: "UEMOA",
  defaultLocale: "fr-FR",
  regulatoryNotice:
    "Les prestations de conseil en investissements boursiers, d’apport d’affaires ou de mise en relation sur le marché financier régional doivent être exercées dans le respect des habilitations requises par l’AMF-UMOA. Le cabinet ne reçoit ni fonds ni titres de la clientèle.",
};
