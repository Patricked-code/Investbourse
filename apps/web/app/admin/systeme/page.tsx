import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Système | Cockpit Investbourse",
  description: "État des services de la plateforme Investbourse.",
  robots: { index: false, follow: false },
};

type PlatformStatusPayload = {
  ok: boolean;
  data?: {
    gateway: { status: string; timestamp: string };
    checks: Array<{
      name: string;
      ok: boolean;
      status: number;
      latencyMs: number;
      payload?: unknown;
      error?: string;
    }>;
  };
};

async function getPlatformStatus(): Promise<PlatformStatusPayload | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/platform-status`, { cache: "no-store" });
    return (await response.json()) as PlatformStatusPayload;
  } catch {
    return null;
  }
}

export default async function AdminSystemPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login?redirect=/admin/systeme");
  }

  if (!canAccessAdmin(session.user.role)) {
    redirect("/espace-institutionnel");
  }

  const platformStatus = await getPlatformStatus();
  const checks = platformStatus?.data?.checks ?? [];

  return (
    <>
      <Header />
      <main className="bg-slate-950 px-5 py-12 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge>Système</Badge>
              <h1 className="mt-5 text-4xl font-semibold md:text-6xl">Santé de la plateforme</h1>
              <h2 className="mt-4 text-xl font-semibold text-emerald-100">API Gateway, services, latence et disponibilité</h2>
              <p className="mt-4 text-sm text-slate-300">Connecté : {session.user.fullName} · {session.user.role}</p>
            </div>
            <Link href="/admin" className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">Retour cockpit</Link>
          </div>

          <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h3 className="text-2xl font-semibold">État consolidé</h3>
                <p className="mt-3 leading-7 text-slate-300">Cette page interroge l’API Gateway, qui interroge ensuite les endpoints /health des microservices.</p>
              </div>
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${platformStatus?.ok ? "bg-emerald-400 text-slate-950" : "bg-red-400 text-white"}`}>{platformStatus?.ok ? "Tous les services répondent" : "Incident ou service indisponible"}</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {checks.length === 0 ? (
                <div className="rounded-2xl bg-white/10 p-5 text-sm leading-7 text-slate-300">Aucun statut service disponible.</div>
              ) : (
                checks.map((check) => (
                  <article key={check.name} className="rounded-2xl bg-white p-5 text-slate-900">
                    <div className="flex items-center justify-between gap-3">
                      <Icon name={check.ok ? "check" : "shield"} className={`h-6 w-6 ${check.ok ? "text-emerald-600" : "text-red-600"}`} />
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${check.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{check.ok ? "OK" : "KO"}</span>
                    </div>
                    <h4 className="mt-5 text-xl font-semibold">{check.name}</h4>
                    <p className="mt-2 text-sm text-slate-500">HTTP {check.status} · {check.latencyMs} ms</p>
                    {check.error ? <p className="mt-3 text-sm text-red-600">{check.error}</p> : null}
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
