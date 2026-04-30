import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { ClientMessageForm } from "@/components/molecules/ClientMessageForm";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = { title: "Messages | Espace institutionnel Investbourse", description: "Messagerie sécurisée entre le client institutionnel et le cabinet Investbourse.", robots: { index: false, follow: false } };

type MessagesPayload = { ok: boolean; data?: Array<{ id: string; subject: string; body: string; senderType: string; senderLabel: string; createdAt: string; contactRequest?: { id: string; requestType: string } | null }> };

async function getMessages(): Promise<MessagesPayload | null> {
  try { const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"; const response = await fetch(`${baseUrl}/api/me/messages`, { cache: "no-store" }); return await response.json(); } catch { return null; }
}

export default async function ClientMessagesPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/auth/login?redirect=/espace-institutionnel/messages");
  const payload = await getMessages();
  const messages = payload?.data ?? [];

  return <><Header /><main className="bg-slate-50 px-5 py-12 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Badge>Messagerie</Badge><h1 className="mt-5 text-4xl font-semibold text-slate-950 md:text-6xl">Messages avec le cabinet</h1><h2 className="mt-4 text-xl font-semibold text-slate-700">Échanges sécurisés autour de vos demandes et livrables</h2><p className="mt-4 text-sm text-slate-500">Connecté : {session.user.fullName} · {session.user.email}</p></div><Link href="/espace-institutionnel" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Retour espace</Link></div><div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]"><section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h3 className="text-2xl font-semibold text-slate-950">Historique des échanges</h3><p className="mt-3 leading-7 text-slate-600">Tous les messages liés à votre compte sont conservés et auditables.</p></div><span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">{messages.length} message{messages.length > 1 ? "s" : ""}</span></div><div className="mt-6 grid gap-4">{messages.length === 0 ? <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">Aucun message pour le moment.</div> : messages.map((message) => <article key={message.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-slate-950">{message.subject}</p><p className="mt-1 text-sm text-slate-500">{message.senderLabel} · {message.senderType} · {new Date(message.createdAt).toLocaleString("fr-FR")}</p></div><Icon name={message.senderType === "ADMIN" ? "shield" : "mail"} className="h-6 w-6 text-emerald-600" /></div><p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{message.body}</p></article>)}</div></section><ClientMessageForm mode="client" defaultSubject="Message au cabinet Investbourse" /></div></div></main><Footer /></>;
}
