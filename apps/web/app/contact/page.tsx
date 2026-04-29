import type { Metadata } from "next";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { ContactForm } from "@/components/molecules/ContactForm";
import { JsonLd } from "@/components/atoms/JsonLd";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { sitePages } from "@/lib/site-data";
import { buildFinancialServiceSchema, pageUrl } from "@/lib/schema";

const page = sitePages["/contact"];

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: pageUrl(page) },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildFinancialServiceSchema(page)} />
      <Header />
      <main>
        <section className="bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#ffffff,#f8fafc)] px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Badge>Contact institutionnel</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">{page.h1}</h1>
              <h2 className="mt-6 text-2xl font-semibold text-slate-800">{page.h2}</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">{page.description}</p>
              <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900">
                <h3 className="font-semibold">{page.h3}</h3>
                <p className="mt-2">Les messages envoyés depuis le site doivent être enregistrés dans le service de contact, rendus consultables dans le cockpit administrateur et journalisés pour assurer la traçabilité commerciale et opérationnelle.</p>
                <h4 className="mt-4 font-semibold">{page.h4}</h4>
                <p className="mt-2">Chaque demande doit pouvoir être qualifiée : type de mission, urgence, pays, organisation, interlocuteur, statut, assignation et prochaines actions.</p>
                <h5 className="mt-4 font-semibold">{page.h5}</h5>
                <p className="mt-2">Les informations reçues doivent être traitées avec confidentialité et ne doivent pas être utilisées hors du cadre professionnel de la demande.</p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {["Diagnostic d’investissement", "Sélection de fonds", "Appel d’offres", "Gouvernance et suivi"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                    <Icon name="check" className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
