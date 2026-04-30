import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = { title: "Mes demandes | Investbourse", description: "Demandes institutionnelles rattachées au compte client Investbourse.", robots: { index: false, follow: false } };

type Payload = { ok: boolean; data?: Array<{ id: string; requestType: string; message: string; status: string; createdAt: string; updatedAt: string }> };

async function getRequests(): Promise<Payload | null> {
  try { const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"; const response = await fetch(`${baseUrl}/api/me/contact-requests`, { cache: "no-store" }); return await response.json(); } catch { return null; }
}

export default async function MyRequestsPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/auth/login?redirect=/espace-institutionnel/demandes");
  const payload = await getRequests();
  const requests = payload?.data ?? [];

  return <><Header /><main className="bg-slate-50 px-5 py-12 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Badge>Espace client</Badge><h1 className="mt-5 text-4xl font-semibold text-slate-950 md:text-6xl">Mes demandes</h1><h2 className="mt-4 text-xl font-semibold text-slate-700">Suivi des demandes institutionnelles rattachées à votre compte</h2><p className="mt-4 text-sm text-slate-500">Connecté : {session.user.fullName} · {session.user.email}</p></div><Link href="/espace-institutionnel" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Retour espace</Link></div><section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h3 className="text-2xl font-semibold text-slate-950">Demandes rattachées</h3><p className="mt-3 leading-7 text-slate-600">Une demande est automatiquement rattachée à votre compte lorsque l’e-mail utilisé dans le formulaire correspond à celui de votre compte.</p></div><span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">{requests.length} demande{requests.length > 1 ? "s" : ""}</span></div><div className="mt-6 grid gap-4 md:grid-cols-2">{requests.length === 0 ? <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">Aucune demande n’est encore rattachée à votre compte.</div> : requests.map((request) => <article key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><Icon name="mail" className="h-7 w-7 text-emerald-600" /><h4 className="mt-5 text-xl font-semibold text-slate-950">{request.requestType}</h4><p className="mt-2 text-sm text-slate-500">Statut : {request.status} · Créée le {new Date(request.createdAt).toLocaleString("fr-FR")}</p><p className="mt-4 line-clamp-4 leading-7 text-slate-600">{request.message}</p><Link href="/espace-institutionnel/messages" className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Écrire au cabinet</Link></article>)}</div></section></div></main><Footer /></>;
}
