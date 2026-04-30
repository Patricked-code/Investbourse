import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { LogoutButton } from "@/components/molecules/LogoutButton";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Espace institutionnel | Investbourse",
  description: "Tableau de bord institutionnel Investbourse pour suivre les demandes, missions, documents et livrables.",
  robots: { index: false, follow: false },
};

const requests = [
  {
    title: "Consultation société de gestion obligataire",
    status: "En cours",
    date: "Ouvert aujourd’hui",
    text: "Cadrage du besoin, préparation du cahier des charges et définition des critères de notation.",
  },
  {
    title: "Comparatif de fonds monétaires",
    status: "À valider",
    date: "Mis à jour hier",
    text: "Analyse comparative des supports, frais, liquidité, performance et risques observés.",
  },
];

const documents = [
  "Note de cadrage — politique de placement.pdf",
  "Grille scoring supports.xlsx",
  "Cahier des charges consultation.docx",
];

export default async function InstitutionalAreaPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login?redirect=/espace-institutionnel");
  }

  return (
    <>
      <Header />
      <main className="bg-slate-50 px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge>Espace utilisateur</Badge>
              <h1 className="mt-5 text-4xl font-semibold text-slate-950 md:text-6xl">Tableau de bord institutionnel</h1>
              <h2 className="mt-3 text-xl font-semibold text-slate-700">Suivi des demandes, missions, documents et livrables</h2>
              <p className="mt-4 text-sm text-slate-500">Connecté : {session.user.fullName} · {session.user.email} · rôle {session.user.role}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Nouvelle demande</Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[["3", "Demandes ouvertes", "mail"], ["2", "Documents à valider", "file"], ["1", "Mission en cours", "clipboard"], ["5", "Notifications", "shield"]].map(([value, label, icon]) => (
              <article key={label} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <Icon name={icon} className="h-7 w-7 text-emerald-600" />
                <p className="mt-5 text-3xl font-bold text-slate-950">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="requests-title">
              <h3 id="requests-title" className="text-2xl font-semibold">Mes demandes</h3>
              <p className="mt-3 leading-7 text-slate-600">Cette zone sera reliée aux demandes rattachées à l’utilisateur connecté. La phase actuelle sécurise déjà l’accès par session.</p>
              <div className="mt-5 grid gap-4">
                {requests.map((request) => (
                  <article key={request.title} className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-slate-950">{request.title}</p>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{request.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{request.date}</p>
                    <p className="mt-3 leading-7 text-slate-600">{request.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold">Documents récents</h3>
              <div className="mt-5 grid gap-3">
                {documents.map((document) => (
                  <div key={document} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                    <Icon name="file" className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-medium text-slate-700">{document}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
