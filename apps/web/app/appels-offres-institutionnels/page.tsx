import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/components/templates/MarketingPageTemplate";
import { sitePages } from "@/lib/site-data";
import { pageUrl } from "@/lib/schema";

const page = sitePages["/appels-offres-institutionnels"];

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: pageUrl(page) },
};

export default function AppelsOffresInstitutionnelsPage() {
  return <MarketingPageTemplate page={page} />;
}
