import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AdminLivePanel } from "@/components/organisms/AdminLivePanel";
import { ContactRequestsLivePanel } from "@/components/organisms/ContactRequestsLivePanel";
import { LogoutButton } from "@/components/molecules/LogoutButton";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Cockpit administrateur | Investbourse",
  description: "Cockpit administrateur Investbourse pour suivre les messages, demandes institutionnelles, utilisateurs, contenus SEO et journaux d’activité.",
  robots: { index: false, follow: false },
};

const adminStats = [
  ["Live", "Demandes persistées", "mail"],
  ["API", "Gateway REST", "file"],
  ["DB", "PostgreSQL Prisma", "clipboard"],
  ["SEO", "Content service", "users"],
];

const adminLinks = [
  { href: "/admin/utilisateurs", label: "Utilisateurs", text: "Comptes, statuts et niveaux d’accès", icon: "users" },
  { href: "/admin/audit", label: "Audit global", text: "Traçabilité des connexions et actions", icon: "shield" },
  { href: "/admin", label: "Demandes", text: "Messages institutionnels et qualification", icon: "mail" },
];

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login?redirect=/admin");
  }

  if (!canAccessAdmin(session.user.role)) {
    redirect("/espace-institutionnel");
  }

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
              <p className="mt-4 text-sm text-slate-300">Connecté : {session.user.fullName} · {session.user.email} · rôle {session.user.role}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">Exporter les messages</button>
              <LogoutButton />
            </div>
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

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-2xl font-semibold">Navigation administrateur</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {adminLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl bg-white p-5 text-slate-900 transition hover:-translate-y-1 hover:shadow-xl">
                  <Icon name={item.icon} className="h-7 w-7 text-emerald-600" />
                  <p className="mt-4 font-semibold">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                </Link>
              ))}
            </div>
          </section>

          <ContactRequestsLivePanel />
          <AdminLivePanel />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6" aria-labelledby="admin-roadmap-title">
              <h3 id="admin-roadmap-title" className="text-2xl font-semibold">Roadmap cockpit connecté</h3>
              <div className="mt-5 grid gap-4">
                {[
                  "Lire les demandes contact persistées depuis PostgreSQL",
                  "Ouvrir une fiche demande détaillée",
                  "Créer un suivi back-office lié à la demande",
                  "Administrer les comptes et niveaux d’accès",
                  "Journaliser chaque action sensible",
                  "Exporter les données en CSV/XLSX",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                    <Icon name="check" className="h-5 w-5 text-emerald-300" />
                    <p className="text-sm font-medium text-slate-100">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h3 className="text-2xl font-semibold">Modules back-office actifs</h3>
              <div className="mt-5 grid gap-3">
                {["Gestion des messages", "Gestion des utilisateurs", "Qualification CRM", "Audit global", "Documents et livrables", "Paramètres SEO", "Export CSV/XLSX", "Notifications e-mail"].map((module) => (
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
