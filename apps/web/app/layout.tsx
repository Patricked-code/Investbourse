import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site-data";
import { buildOrganizationSchema } from "@/lib/schema";
import { JsonLd } from "@/components/atoms/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: "Conseil en investissements boursiers pour investisseurs institutionnels UEMOA : analyse de marchés, sélection OPCVM, appels d’offres, due diligence et gouvernance.",
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  keywords: [
    "conseil investissement UEMOA",
    "OPCVM UEMOA",
    "investisseurs institutionnels",
    "appels d’offres société de gestion",
    "sélection fonds",
    "AMF UMOA",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.domain,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: "Plateforme de conseil, sélection, appels d’offres et suivi pour investisseurs institutionnels UEMOA.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: "Conseil institutionnel UEMOA : analyse, sélection de fonds, appels d’offres et gouvernance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <JsonLd data={buildOrganizationSchema()} />
        {children}
      </body>
    </html>
  );
}
