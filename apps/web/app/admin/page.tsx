import type { Metadata } from "next";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";

export const metadata: Metadata = {
  title: "Cockpit administrateur | Investbourse",
  description: "Cockpit administrateur Investbourse pour suivre les messages, demandes institutionnelles, utilisateurs, contenus SEO et journaux d’activité.",
  robots: { index: false, follow: false },
};

const adminStats = [
  ["12", "Messages reçus", "mail"],
  ["4", "Nouveaux", "file"],
  ["6", "Dossiers qualifiés", "clipboard"],
  ["2", "Rendez-vous à fixer", "users"],
];

const messages = [
  {
    id: "MSG-2026-001",
    status: "Nouveau",
    from: "Directeur financier",
    org: "Caisse de retraite régionale",
    email: "direction.finance@example.com",
    need: "Appel d’offres",
    date: "Aujourd’hui 09:42",
    text: "Nous souhaitons structurer une consultation pour sélectionner une société de gestion obligataire UEMOA avec reporting trimestriel.",
  },
  {
    id: "MSG-2026-002",
    status: "À qualifier",
    from: "Responsable trésorerie",
    org: "Groupe industriel",
    email: "tresorerie@example.com",
    need: "Placement de trésorerie",
    date: "Hier 17:18",
    text: "Nous cherchons une grille comparative entre solutions monétaires et solutions obligataires court terme.",
  },
  {
    id: "MSG-2026-003",
    status: "Traité",
    from: "Secrétaire général",
    org: "Fondation institutionnelle",
    email: "sg@example.com",
    need: "Politique de placement",
    date: "24 avril 2026",
    text: "Nous souhaitons formaliser notre politique de placement et disposer d’une méthode de sélection documentée.",
  },
];

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-950 px-5 py-12 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge>Cockpit administrateur</Badge>
              <h1 className="mt-5 text-4xl font-semibold md:text-6xl">Administration des messages et demandes entrantes</h1>
              <h2 className="mt-4 text-xl font-semibold text-emerald-100">Réception, qualification, suivi commercial, SEO et conformité</h2>
            </div>
            <button className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">Exporter les messages</button>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {adminStats.map(([value, label, icon]) => (
              <article key={label} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <Icon name={icon} className="h-7 w-7 text-emerald-300" />
                <p className="mt-5 text-3xl font-bold">{value}</p>
                <p className="mt-1 text-sm text-slate-300">{label}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6" aria-labelledby="admin-messages-title">
              <h3 id="admin-messages-title" className="text-2xl font-semibold">Messages du site</h3>
              <div className="mt-5 grid gap-4">
                {messages.map((message) => (
                  <article key={message.id} className="rounded-2xl bg-white p-5 text-slate-900">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{message.from} — {message.org}</p>
                        <p className="text-sm text-slate-500">{message.email} · {message.date}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{message.status}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">Besoin : {message.need}</p>
                    <p className="mt-2 leading-7 text-slate-600">{message.text}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white">Qualifier</button>
                      <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">Assigner</button>
                      <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">Répondre</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h3 className="text-2xl font-semibold">Modules admin prévus</h3>
              <div className="mt-5 grid gap-3">
                {["Gestion des messages", "Gestion des utilisateurs", "Qualification CRM", "Documents et livrables", "Paramètres SEO", "Journaux d’activité", "Export CSV/XLSX", "Notifications e-mail"].map((module) => (
                  <div key={module} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                    <Icon name="check" className="h-5 w-5 text-emerald-300" />
                    <p className="text-sm font-medium text-slate-100">{module}</p>
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
