import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/components/templates/MarketingPageTemplate";
import { sitePages } from "@/lib/site-data";
import { pageUrl } from "@/lib/schema";

const page = sitePages["/conseil-investissement-institutionnel"];

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: pageUrl(page) },
  openGraph: {
    title: page.metaTitle,
    description: page.description,
    url: pageUrl(page),
    type: "website",
    locale: "fr_FR",
  },
};

export default function ConseilInvestissementInstitutionnelPage() {
  return <MarketingPageTemplate page={page} />;
}
