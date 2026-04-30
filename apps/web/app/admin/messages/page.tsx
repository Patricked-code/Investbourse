import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { ClientMessageForm } from "@/components/molecules/ClientMessageForm";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

export const metadata: Metadata = { title: "Messages clients | Cockpit Investbourse", description: "Messagerie administrateur avec les clients institutionnels Investbourse.", robots: { index: false, follow: false } };

type MessagesPayload = { ok: boolean; data?: Array<{ id: string; subject: string; body: string; senderType: string; senderLabel: string; userId?: string | null; contactRequestId?: string | null; createdAt: string; user?: { id: string; fullName: string; email: string } | null; contactRequest?: { id: string; fullName: string; organization: string } | null }> };
type UsersPayload = { ok: boolean; data?: Array<{ id: string; fullName: string; email: string }> };

async function getJson<T>(path: string): Promise<T | null> { try { const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"; const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" }); return await response.json(); } catch { return null; } }

export default async function AdminMessagesPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/auth/login?redirect=/admin/messages");
  if (!canAccessAdmin(session.user.role)) redirect("/espace-institutionnel");

  const [messagesPayload, usersPayload] = await Promise.all([getJson<MessagesPayload>("/api/admin/client-messages"), getJson<UsersPayload>("/api/admin/users")]);
  const messages = messagesPayload?.data ?? [];
  const users = usersPayload?.data ?? [];
  const firstUser = users[0];

  return <><Header /><main className="bg-slate-950 px-5 py-12 text-white lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Badge>Messages clients</Badge><h1 className="mt-5 text-4xl font-semibold md:text-6xl">Messagerie administrateur</h1><h2 className="mt-4 text-xl font-semibold text-emerald-100">Centraliser les échanges entre le cabinet et les clients institutionnels</h2><p className="mt-4 text-sm text-slate-300">Connecté : {session.user.fullName} · {session.user.role}</p></div><Link href="/admin" className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">Retour cockpit</Link></div><div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]"><section className="rounded-[2rem] border border-white/10 bg-white/5 p-6"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h3 className="text-2xl font-semibold">Historique global</h3><p className="mt-3 leading-7 text-slate-300">Messages créés par les clients et les administrateurs.</p></div><span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">{messages.length} message{messages.length > 1 ? "s" : ""}</span></div><div className="mt-6 grid gap-4">{messages.length === 0 ? <div className="rounded-2xl bg-white/10 p-5 text-sm leading-7 text-slate-300">Aucun message n’est encore disponible.</div> : messages.map((message) => <article key={message.id} className="rounded-2xl bg-white p-5 text-slate-900"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{message.subject}</p><p className="mt-1 text-sm text-slate-500">{message.senderLabel} · {message.senderType} · {new Date(message.createdAt).toLocaleString("fr-FR")}</p><p className="mt-1 text-xs text-slate-400">Client : {message.user ? `${message.user.fullName} — ${message.user.email}` : message.userId ?? "Non associé"}</p></div><Icon name={message.senderType === "ADMIN" ? "shield" : "mail"} className="h-6 w-6 text-emerald-600" /></div><p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{message.body}</p></article>)}</div></section><div className="rounded-[2rem] bg-white p-1 text-slate-900"><ClientMessageForm mode="admin" userId={firstUser?.id} defaultSubject="Réponse du cabinet Investbourse" /><p className="px-6 pb-6 text-xs leading-6 text-slate-500">Le formulaire répond au premier utilisateur disponible par défaut. Pour une version finale métier avancée, la réponse ciblée peut être déclenchée depuis une fiche utilisateur ou une fiche demande.</p></div></div></div></main><Footer /></>;
}
