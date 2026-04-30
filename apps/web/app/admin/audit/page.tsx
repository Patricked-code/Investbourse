import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

type AuditPayload = {
  ok: boolean;
  data?: Array<{
    id: string;
    actorUserId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown> | null;
    createdAt: string;
  }>;
};

export const metadata: Metadata = {
  title: "Journal d’audit | Investbourse",
  description: "Journal d’audit global du cockpit Investbourse.",
  robots: { index: false, follow: false },
};

async function getAuditItems(): Promise<AuditPayload | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/office/audit`, { cache: "no-store" });
    return (await response.json()) as AuditPayload;
  } catch {
    return null;
  }
}

function actionLabel(action: string) {
  const labels: Record<string, string> = {
    OFFICE_MESSAGE_CREATED: "Suivi back-office créé",
    USER_REGISTERED: "Utilisateur inscrit",
    USER_LOGIN_SUCCESS: "Connexion réussie",
    SUPERADMIN_BOOTSTRAPPED: "Super administrateur initialisé",
  };

  return labels[action] ?? action;
}

export default async function AdminAuditPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login?redirect=/admin/audit");
  }

  if (!canAccessAdmin(session.user.role)) {
    redirect("/espace-institutionnel");
  }

  const payload = await getAuditItems();
  const items = payload?.data ?? [];

  return (
    <>
      <Header />
      <main className="bg-slate-950 px-5 py-12 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge>Audit global</Badge>
              <h1 className="mt-5 text-4xl font-semibold md:text-6xl">Journal d’audit du cockpit</h1>
              <h2 className="mt-4 text-xl font-semibold text-emerald-100">Traçabilité des actions sensibles, connexions et qualifications</h2>
              <p className="mt-4 text-sm text-slate-300">Connecté : {session.user.fullName} · {session.user.role}</p>
            </div>
            <Link href="/admin" className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">Retour cockpit</Link>
          </div>

          <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h3 className="text-2xl font-semibold">Derniers événements</h3>
                <p className="mt-3 leading-7 text-slate-300">Lecture directe des derniers événements depuis office-service et la table AuditLog.</p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">{items.length} événement{items.length > 1 ? "s" : ""}</span>
            </div>

            <div className="mt-6 grid gap-4">
              {items.length === 0 ? (
                <div className="rounded-2xl bg-white/10 p-5 text-sm leading-7 text-slate-300">Aucun événement d’audit n’est disponible pour le moment.</div>
              ) : (
                items.map((item) => (
                  <article key={item.id} className="rounded-2xl bg-white p-5 text-slate-900">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{actionLabel(item.action)}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.entityType} · {item.entityId ?? "sans identifiant"}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{new Date(item.createdAt).toLocaleString("fr-FR")}</span>
                    </div>
                    {item.metadata ? <pre className="mt-4 max-h-52 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-emerald-100">{JSON.stringify(item.metadata, null, 2)}</pre> : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
