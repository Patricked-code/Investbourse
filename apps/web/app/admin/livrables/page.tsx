import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { MissionDocumentForm } from "@/components/molecules/MissionDocumentForm";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Livrables | Cockpit Investbourse",
  description: "Administration des livrables client Investbourse.",
  robots: { index: false, follow: false },
};

type Item = {
  id: string;
  title: string;
  description?: string | null;
  fileName: string;
  fileUrl: string;
  category: string;
  visibility: string;
  createdAt: string;
  uploadedByLabel?: string | null;
  contactRequest?: { id: string; fullName: string; organization: string } | null;
  user?: { id: string; fullName: string; email: string; organization?: string | null } | null;
};

type DocumentsPayload = { ok: boolean; data?: Item[] };
type UsersPayload = { ok: boolean; data?: Array<{ id: string; fullName: string; email: string }> };
type ContactRequestsPayload = { ok: boolean; data?: Array<{ id: string; fullName: string; organization: string }> };

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export default async function AdminLivrablesPage() {
  const session = await getCurrentSession();

  if (!session) redirect("/auth/login?redirect=/admin/livrables");
  if (!canAccessAdmin(session.user.role)) redirect("/espace-institutionnel");

  const [documentsPayload, usersPayload, requestsPayload] = await Promise.all([
    getJson<DocumentsPayload>("/api/admin/documents"),
    getJson<UsersPayload>("/api/admin/users"),
    getJson<ContactRequestsPayload>("/api/contact-requests"),
  ]);

  const documents = documentsPayload?.data ?? [];
  const users = usersPayload?.data ?? [];
  const contactRequests = requestsPayload?.data ?? [];

  return (
    <>
      <Header />
      <main className="bg-slate-50 px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge>Livrables</Badge>
              <h1 className="mt-5 text-4xl font-semibold text-slate-950 md:text-6xl">Documents et livrables client</h1>
              <h2 className="mt-4 text-xl font-semibold text-slate-700">Notes, rapports, grilles, cahiers des charges et contrats</h2>
              <p className="mt-4 text-sm text-slate-500">Connecté : {session.user.fullName} · {session.user.role}</p>
            </div>
            <Link href="/admin" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Retour cockpit</Link>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">Bibliothèque opérationnelle</h3>
                  <p className="mt-3 leading-7 text-slate-600">Livrables enregistrés dans office-service et rattachables à un utilisateur ou à une demande.</p>
                </div>
                <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">{documents.length} élément{documents.length > 1 ? "s" : ""}</span>
              </div>

              <div className="mt-6 grid gap-4">
                {documents.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">Aucun livrable n’est encore enregistré.</div>
                ) : (
                  documents.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.fileName} · {item.category}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.visibility === "CLIENT_VISIBLE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.visibility === "CLIENT_VISIBLE" ? "Visible client" : "Interne"}</span>
                      </div>
                      {item.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p> : null}
                      <p className="mt-4 text-xs text-slate-500">Utilisateur : {item.user ? `${item.user.fullName} — ${item.user.email}` : "Non associé"}</p>
                      <p className="mt-2 text-xs text-slate-500">Demande : {item.contactRequest ? `${item.contactRequest.fullName} — ${item.contactRequest.organization}` : "Non associée"}</p>
                      <a href={item.fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white">
                        Ouvrir <Icon name="arrow" className="h-3.5 w-3.5" />
                      </a>
                    </article>
                  ))
                )}
              </div>
            </section>

            <MissionDocumentForm users={users} contactRequests={contactRequests} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
