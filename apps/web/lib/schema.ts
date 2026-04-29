import { siteConfig, type SitePage } from "./site-data";

export function pageUrl(page: Pick<SitePage, "slug">) {
  return `${siteConfig.domain}${page.slug === "/" ? "" : page.slug}`;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.domain,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: siteConfig.areaServed,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abidjan",
      addressCountry: "CI",
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.domain,
    description: siteConfig.tagline,
    publisher: buildOrganizationSchema(),
  };
}

export function buildFinancialServiceSchema(page: SitePage) {
  return {
    "@context": "https://schema.org",
    "@type": page.schemaType,
    name: page.title,
    headline: page.h1,
    description: page.description,
    url: pageUrl(page),
    provider: buildOrganizationSchema(),
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Investisseurs institutionnels, caisses de retraite, compagnies d’assurance, banques, fondations, trésoreries d’entreprise",
    },
    areaServed: siteConfig.areaServed,
    keywords: page.keywords.join(", "),
  };
}
