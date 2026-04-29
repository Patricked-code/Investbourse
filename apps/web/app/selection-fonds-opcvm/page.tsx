import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/components/templates/MarketingPageTemplate";
import { sitePages } from "@/lib/site-data";
import { pageUrl } from "@/lib/schema";

const page = sitePages["/selection-fonds-opcvm"];

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: pageUrl(page) },
};

export default function SelectionFondsOpcvmPage() {
  return <MarketingPageTemplate page={page} />;
}
