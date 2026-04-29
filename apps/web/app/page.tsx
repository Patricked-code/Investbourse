import Link from "next/link";
import { sitePages, siteConfig, services, clientTypes, processSteps, offers } from "@/lib/site-data";
import { JsonLd } from "@/components/atoms/JsonLd";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { buildFinancialServiceSchema, buildWebsiteSchema } from "@/lib/schema";

export default function HomePage() {
  const page = sitePages["/"];

  return (
    <>
      <JsonLd data={[buildWebsiteSchema(), buildFinancialServiceSchema(page)]} />
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8fafc_42%,#ecfeff_100%)]">
          <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div>
              <div className="mb-6 flex flex-wrap gap-3">
                <Badge>Conseil en investissements boursiers</Badge>
                <Badge>Institutionnels UEMOA</Badge>
                <Badge>Full API REST microservices</Badge>
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">{page.h1}</h1>
              <h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-tight text-slate-800 md:text-3xl">{page.h2}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.description}</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-1 hover:bg-emerald-700">Demander un diagnostic</Link>
                <Link href="/selection-fonds-opcvm" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-semibold text-slate-800 transition hover:-translate-y-1 hover:border-emerald-300 hover:text-emerald-700">Voir les missions</Link>
              </div>
              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
                {[["H1-H5", "structure éditoriale"], ["JSON-LD", "schema.org"], ["Slugs", "pages SEO"]].map(([value, label]) => (
                  <div key={value} className="rounded-3xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur">
                    <p className="text-2xl font-bold text-slate-950">{value}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <aside className="rounded-[2rem] border border-white bg-white/75 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl" aria-label="Tableau de bord institutionnel de démonstration">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-emerald-300">Tableau de bord institutionnel</p><h3 className="mt-1 text-2xl font-semibold">Revue allocation</h3></div>
                  <div className="rounded-2xl bg-white/10 p-3"><Icon name="chart" className="h-6 w-6" /></div>
                </div>
                <div className="mt-8 grid gap-4">
                  {[["OPCVM monétaires", "Liquidité élevée", 78], ["Obligataire UEMOA", "Portage & duration", 64], ["Actions BRVM", "Sélectivité renforcée", 42]].map(([name, note, score]) => (
                    <div key={String(name)} className="rounded-2xl bg-white/10 p-4">
                      <div className="flex items-center justify-between"><div><p className="font-semibold">{name}</p><p className="mt-1 text-sm text-slate-300">{note}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">{score}</div></div>
                      <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-emerald-400" style={{ width: `${score}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-white px-5 py-20 lg:px-8" aria-labelledby="positionnement-title">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Positionnement</p>
              <h2 id="positionnement-title" className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Un cabinet pensé pour les comités d’investissement institutionnels</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">L’objectif est d’aider les investisseurs à prendre des décisions documentées, comparables et défendables, avec une approche rigoureuse des risques, de la gouvernance et de la sélection des partenaires de gestion.</p>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl shadow-slate-900/10">
                <Icon name="building" className="h-10 w-10 text-emerald-300" />
                <h3 className="mt-6 text-2xl font-semibold">Clients accompagnés</h3>
                <p className="mt-4 leading-7 text-slate-300">Notre approche s’adresse aux organisations qui doivent investir avec méthode, prudence, transparence et responsabilité fiduciaire.</p>
                <div className="mt-7 grid gap-3">{clientTypes.map((client) => <span key={client} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200">{client}</span>)}</div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Lecture du besoin</p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-950">Gouvernance, sélection et suivi</h3>
                <p className="mt-5 text-lg leading-8 text-slate-600">Chaque mission doit permettre de mieux formaliser la politique de placement, de sélectionner les supports avec méthode et de documenter les raisons de la décision.</p>
                <div className="mt-8 grid gap-4 md:grid-cols-2">{["Politique de placement", "Contraintes de liquidité", "Sélection de gérants", "Suivi des risques", "Reporting au comité", "Traçabilité des décisions"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"><Icon name="check" className="h-5 w-5 shrink-0 text-emerald-600" /><span className="text-sm font-medium text-slate-700">{item}</span></div>)}</div>
                <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm"><h4 className="font-semibold text-slate-950">Principe d’intervention</h4><p className="mt-3 leading-7 text-slate-600">Le cabinet n’encaisse pas les fonds des clients, ne conserve pas les titres et n’agit pas comme société de gestion. Son rôle est d’analyser, conseiller, structurer la sélection et accompagner la prise de décision, dans les limites des habilitations réglementaires obtenues.</p><h5 className="mt-4 font-semibold text-slate-950">Transparence des rémunérations</h5><p className="mt-2 leading-7 text-slate-600">Toute rémunération, commission ou rétrocession éventuelle doit être contractualisée, documentée et présentée de manière transparente selon le cadre réglementaire applicable.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8" aria-labelledby="services-title">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center"><p className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Services</p><h2 id="services-title" className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Des pages dédiées, indexables et structurées par besoin institutionnel</h2><p className="mt-5 text-lg leading-8 text-slate-600">Chaque service dispose d’un slug, d’un titre SEO, d’une meta description, d’un H1 clair, de sous-titres H2 à H5 et d’un bloc schema.org adapté.</p></div>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => <article key={service.title} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon name={service.icon} className="h-7 w-7" /></div><h3 className="mt-6 text-xl font-semibold text-slate-950">{service.title}</h3><p className="mt-4 leading-7 text-slate-600">{service.text}</p><Link href={service.slug} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Ouvrir la page SEO <Icon name="arrow" className="h-4 w-4" /></Link></article>)}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-5 py-20 text-white lg:px-8" aria-labelledby="method-title">
          <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div><p className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-300">Méthode d’intervention</p><h2 id="method-title" className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">Une chaîne de décision claire, documentée et défendable.</h2><h3 className="mt-6 text-xl font-semibold text-emerald-100">Diagnostic, sélection, consultation, recommandation, décision et suivi.</h3><p className="mt-4 text-lg leading-8 text-slate-300">L’accompagnement est conçu pour sécuriser le processus de décision des institutionnels et produire des livrables exploitables par les comités d’investissement.</p></div>
            <div className="grid gap-4">{processSteps.map((item) => <article key={item.step} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur"><div className="flex gap-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-bold text-slate-950">{item.step}</div><div><h4 className="text-lg font-semibold">{item.title}</h4><p className="mt-2 leading-7 text-slate-300">{item.text}</p></div></div></article>)}</div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 lg:px-8" aria-labelledby="offers-title">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center"><p className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Offres</p><h2 id="offers-title" className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Trois formats de mission pour les besoins institutionnels</h2><p className="mt-5 text-lg leading-8 text-slate-600">Les offres sont conçues pour être vendues sous forme de missions ponctuelles ou d’accompagnements récurrents, selon la maturité de l’investisseur et la complexité de son besoin.</p></div>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">{offers.map((offer, index) => <article key={offer.name} className={`rounded-[2rem] border p-7 shadow-sm ${index === 1 ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}><div className="flex items-center justify-between gap-4"><h3 className="text-2xl font-semibold text-slate-950">{offer.name}</h3><span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{offer.tag}</span></div><p className="mt-4 leading-7 text-slate-600">{offer.description}</p><p className="mt-7 text-3xl font-bold text-slate-950">{offer.price}</p><div className="mt-7 grid gap-3">{offer.features.map((feature) => <div key={feature} className="flex items-start gap-3"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><span className="text-sm leading-6 text-slate-700">{feature}</span></div>)}</div></article>)}</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
