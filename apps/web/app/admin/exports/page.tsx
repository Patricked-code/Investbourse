import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Exports | Cockpit Investbourse",
  description: "Exports CSV administrateur pour les demandes institutionnelles et le journal d’audit Investbourse.",
  robots: { index: false, follow: false },
};

const exportCards = [
  {
    href: "/api/admin/exports/contact-requests",
    title: "Demandes institutionnelles",
    description: "Export CSV des demandes reçues depuis le formulaire contact : organisation, email, besoin, statut, message et dates.",
    icon: "mail",
  },
  {
    href: "/api/admin/exports/audit",
    title: "Journal d’audit",
    description: "Export CSV des événements d’audit : connexions, inscriptions, actions back-office et modifications de comptes.",
    icon: "shield",
  },
];

export default async function AdminExportsPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login?redirect=/admin/exports");
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
              <Badge>Exports</Badge>
              <h1 className="mt-5 text-4xl font-semibold md:text-6xl">Exports administrateur</h1>
              <h2 className="mt-4 text-xl font-semibold text-emerald-100">Télécharger les données opérationnelles du cockpit</h2>
              <p className="mt-4 text-sm text-slate-300">Connecté : {session.user.fullName} · {session.user.role}</p>
            </div>
            <Link href="/admin" className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">Retour cockpit</Link>
          </div>

          <section className="mt-10 grid gap-5 md:grid-cols-2">
            {exportCards.map((item) => (
              <a key={item.href} href={item.href} className="rounded-[2rem] border border-white/10 bg-white p-7 text-slate-900 transition hover:-translate-y-1 hover:shadow-2xl">
                <Icon name={item.icon} className="h-8 w-8 text-emerald-600" />
                <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{item.description}</p>
                <span className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Télécharger CSV</span>
              </a>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
