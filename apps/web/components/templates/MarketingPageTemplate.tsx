import Link from "next/link";
import { JsonLd } from "@/components/atoms/JsonLd";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { services, type SitePage } from "@/lib/site-data";
import { buildFinancialServiceSchema } from "@/lib/schema";

type MarketingPageTemplateProps = {
  page: SitePage;
};

export function MarketingPageTemplate({ page }: MarketingPageTemplateProps) {
  return (
    <>
      <JsonLd data={buildFinancialServiceSchema(page)} />
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8fafc_42%,#ecfeff_100%)]">
          <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div>
              <div className="mb-6 flex flex-wrap gap-3">
                <Badge>Conseil institutionnel</Badge>
                <Badge>UEMOA</Badge>
                <Badge>Page SEO dédiée</Badge>
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">{page.h1}</h1>
              <h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-tight text-slate-800 md:text-3xl">{page.h2}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.description}</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-1 hover:bg-emerald-700">Demander un diagnostic</Link>
                <Link href="/appels-offres-institutionnels" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-semibold text-slate-800 transition hover:-translate-y-1 hover:border-emerald-300 hover:text-emerald-700">Structurer un appel d’offres</Link>
              </div>
            </div>
            <aside className="rounded-[2rem] border border-white bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Référencement</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">Structure sémantique de la page</h3>
              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-950">Slug :</span> {page.slug}</p>
                <p><span className="font-semibold text-slate-950">Title :</span> {page.metaTitle}</p>
                <p><span className="font-semibold text-slate-950">Schema :</span> {page.schemaType}</p>
                <p><span className="font-semibold text-slate-950">Keywords :</span> {page.keywords.join(", ")}</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-white px-5 py-20 lg:px-8" aria-labelledby="editorial-content">
          <article className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Contenu éditorial institutionnel</p>
            <h2 id="editorial-content" className="mt-4 text-3xl font-semibold text-slate-950">{page.h2}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{page.description}</p>
            <h3 className="mt-8 text-2xl font-semibold text-slate-900">{page.h3}</h3>
            <p className="mt-4 leading-8 text-slate-600">
              L’intervention vise à transformer un besoin d’investissement en processus documenté : définition du besoin, analyse des contraintes, identification des solutions disponibles, comparaison objective des propositions et formalisation d’une recommandation exploitable par un comité d’investissement.
            </p>
            <h4 className="mt-8 text-xl font-semibold text-slate-900">{page.h4}</h4>
            <p className="mt-4 leading-8 text-slate-600">
              La démarche repose sur des critères explicites : adéquation au profil institutionnel, liquidité, niveau de risque, qualité du processus de gestion, frais, transparence du reporting, historique, robustesse opérationnelle et cohérence avec la politique de placement.
            </p>
            <h5 className="mt-8 text-lg font-semibold text-slate-900">{page.h5}</h5>
            <p className="mt-3 leading-8 text-slate-600">
              Le cabinet ne reçoit ni fonds ni titres de la clientèle. Toute prestation réglementée doit être exercée dans le cadre des habilitations applicables et avec une transparence complète sur le rôle du cabinet, les limites de son intervention et les éventuelles rémunérations contractuelles.
            </p>
          </article>
        </section>

        <section className="px-5 py-20 lg:px-8" aria-labelledby="related-services">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Services associés</p>
              <h2 id="related-services" className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Relier le conseil, la sélection et le suivi</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Chaque mission peut être complétée par une analyse récurrente, une due diligence ou un processus d’appel d’offres.</p>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon name={service.icon} className="h-7 w-7" /></div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-950">{service.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{service.text}</p>
                  <Link href={service.slug} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Consulter la page <Icon name="arrow" className="h-4 w-4" /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
