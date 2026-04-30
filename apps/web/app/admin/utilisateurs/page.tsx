import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AccountAccessForm } from "@/components/molecules/AccountAccessForm";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

type UsersPayload = {
  ok: boolean;
  data?: Array<{
    id: string;
    fullName: string;
    organization?: string | null;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  error?: string;
};

export const metadata: Metadata = {
  title: "Utilisateurs | Cockpit Investbourse",
  description: "Administration des comptes utilisateurs institutionnels et administrateurs Investbourse.",
  robots: { index: false, follow: false },
};

async function getUsers(): Promise<UsersPayload | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/users`, { cache: "no-store" });
    return (await response.json()) as UsersPayload;
  } catch {
    return null;
  }
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    USER: "Utilisateur",
    ADMIN: "Administrateur",
    SUPERADMIN: "Super administrateur",
  };

  return labels[role] ?? role;
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING_VERIFICATION: "En attente",
    ACTIVE: "Actif",
    DISABLED: "Désactivé",
  };

  return labels[status] ?? status;
}

export default async function AdminUsersPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login?redirect=/admin/utilisateurs");
  }

  if (!canAccessAdmin(session.user.role)) {
    redirect("/espace-institutionnel");
  }

  const payload = await getUsers();
  const users = payload?.data ?? [];

  return (
    <>
      <Header />
      <main className="bg-slate-950 px-5 py-12 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge>Comptes</Badge>
              <h1 className="mt-5 text-4xl font-semibold md:text-6xl">Administration des utilisateurs</h1>
              <h2 className="mt-4 text-xl font-semibold text-emerald-100">Comptes institutionnels, administrateurs, statuts et niveaux d’accès</h2>
              <p className="mt-4 text-sm text-slate-300">Connecté : {session.user.fullName} · {session.user.role}</p>
            </div>
            <Link href="/admin" className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">Retour cockpit</Link>
          </div>

          <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h3 className="text-2xl font-semibold">Liste des comptes</h3>
                <p className="mt-3 leading-7 text-slate-300">Lecture depuis auth-service via API Gateway. Les modifications de niveau d’accès et d’état sont journalisées dans AuditLog.</p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">{users.length} compte{users.length > 1 ? "s" : ""}</span>
            </div>

            <div className="mt-6 grid gap-4">
              {users.length === 0 ? (
                <div className="rounded-2xl bg-white/10 p-5 text-sm leading-7 text-slate-300">Aucun utilisateur n’est disponible ou le service d’authentification est indisponible.</div>
              ) : (
                users.map((user) => (
                  <article key={user.id} className="rounded-2xl bg-white p-5 text-slate-900">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-semibold">{user.fullName}</p>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{roleLabel(user.role)}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{statusLabel(user.status)}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{user.email} · {user.organization ?? "Organisation non renseignée"}</p>
                        <p className="mt-2 text-xs text-slate-400">Créé le {new Date(user.createdAt).toLocaleString("fr-FR")}</p>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Icon name="users" className="h-5 w-5" />
                        <span className="text-xs font-semibold uppercase tracking-widest">{user.id}</span>
                      </div>
                    </div>
                    <div className="mt-5">
                      <AccountAccessForm accountId={user.id} initialAccessLevel={user.role} initialAccountState={user.status} />
                    </div>
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
