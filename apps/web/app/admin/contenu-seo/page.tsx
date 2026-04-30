import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { SeoPageEditorForm } from "@/components/molecules/SeoPageEditorForm";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Contenu SEO | Cockpit Investbourse",
  description: "Administration des pages SEO, slugs, balises Hn et données schema.org du site Investbourse.",
  robots: { index: false, follow: false },
};

type SeoPagesPayload = {
  ok: boolean;
  data?: Array<{
    id: string;
    slug: string;
    title: string;
    metaTitle: string;
    description: string;
    schemaType: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    keywords: string[];
    isPublished: boolean;
    createdAt: string;
    updatedAt?: string;
  }>;
};

async function getSeoPages(): Promise<SeoPagesPayload | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/seo-pages`, { cache: "no-store" });
    return (await response.json()) as SeoPagesPayload;
  } catch {
    return null;
  }
}

export default async function AdminSeoContentPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login?redirect=/admin/contenu-seo");
  }

  if (!canAccessAdmin(session.user.role)) {
    redirect("/espace-institutionnel");
  }

  const payload = await getSeoPages();
  const pages = payload?.data ?? [];
  const firstPage = pages[0];

  return (
    <>
      <Header />
      <main className="bg-slate-50 px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge>Contenu SEO</Badge>
              <h1 className="mt-5 text-4xl font-semibold text-slate-950 md:text-6xl">Administration des pages SEO</h1>
              <h2 className="mt-4 text-xl font-semibold text-slate-700">Slugs, metadata, H1 à H5, keywords et données schema.org</h2>
              <p className="mt-4 text-sm text-slate-500">Connecté : {session.user.fullName} · {session.user.role}</p>
            </div>
            <Link href="/admin" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Retour cockpit</Link>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">Pages enregistrées</h3>
                  <p className="mt-3 leading-7 text-slate-600">Liste des pages SEO stockées dans content-service via PostgreSQL/Prisma.</p>
                </div>
                <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">{pages.length} page{pages.length > 1 ? "s" : ""}</span>
              </div>

              <div className="mt-6 grid gap-4">
                {pages.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">Aucune page SEO n’est encore disponible.</div>
                ) : (
                  pages.map((page) => (
                    <article key={page.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{page.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{page.slug} · {page.schemaType}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{page.isPublished ? "Publié" : "Brouillon"}</span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{page.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {page.keywords.map((keyword) => (
                          <span key={keyword} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">{keyword}</span>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <SeoPageEditorForm initialData={firstPage} />
          </div>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Icon name="shield" className="h-8 w-8 text-emerald-600" />
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">Règles SEO applicatives</h3>
                <p className="mt-3 leading-7 text-slate-600">Chaque page doit conserver un slug stable, un H1 unique, une meta description précise, une cohérence entre le contenu visible et les données structurées, ainsi qu’un type schema.org adapté au service présenté.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
