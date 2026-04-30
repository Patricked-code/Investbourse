import { z } from "zod";

const numberFromEnv = (fallback: number) => z.coerce.number().int().positive().default(fallback);
const optionalUrl = z.string().url().optional().or(z.literal(""));

export const serviceEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: numberFromEnv(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  API_GATEWAY_INTERNAL_URL: z.string().url().default("http://localhost:4000"),
  CONTACT_SERVICE_URL: z.string().url().default("http://localhost:4010"),
  CONTENT_SERVICE_URL: z.string().url().default("http://localhost:4020"),
  AUTH_SERVICE_URL: z.string().url().default("http://localhost:4030"),
  ADMIN_SERVICE_URL: z.string().url().default("http://localhost:4040"),
  OFFICE_SERVICE_URL: z.string().url().default("http://localhost:4040"),
  INTERNAL_SERVICE_TOKEN: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  EMAIL_PROVIDER: z.enum(["disabled", "smtp", "resend"]).default("disabled"),
  EMAIL_FROM: z.string().default("Investbourse <no-reply@assetmanagement.chainsolutions.fr>"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z.coerce.boolean().default(true),
  RESEND_API_KEY: z.string().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),
  PASSWORD_RESET_TOKEN_EXPOSE_IN_DEV: z.coerce.boolean().default(false),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  SENTRY_DSN: optionalUrl,
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
  canonicalBaseUrl: "https://assetmanagement.chainsolutions.fr",
  regulatoryNotice:
    "Les prestations de conseil en investissements boursiers, d’apport d’affaires ou de mise en relation sur le marché financier régional doivent être exercées dans le respect des habilitations requises par l’AMF-UMOA. Le cabinet ne reçoit ni fonds ni titres de la clientèle.",
};
