import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Mes livrables | Investbourse",
  description: "Documents et livrables visibles dans l’espace institutionnel Investbourse.",
  robots: { index: false, follow: false },
};

type DocumentsPayload = {
  ok: boolean;
  data?: Array<{
    id: string;
    title: string;
    description?: string | null;
    fileName: string;
    fileUrl: string;
    category: string;
    createdAt: string;
    contactRequest?: { id: string; requestType: string; status: string } | null;
  }>;
};

async function getDocuments(): Promise<DocumentsPayload | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/me/documents`, { cache: "no-store" });
    return (await response.json()) as DocumentsPayload;
  } catch {
    return null;
  }
}

export default async function MyDeliverablesPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login?redirect=/espace-institutionnel/livrables");
  }

  const payload = await getDocuments();
  const documents = payload?.data ?? [];

  return (
    <>
      <Header />
      <main className="bg-slate-50 px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge>Espace client</Badge>
              <h1 className="mt-5 text-4xl font-semibold text-slate-950 md:text-6xl">Mes livrables</h1>
              <h2 className="mt-4 text-xl font-semibold text-slate-700">Documents, rapports, notes et supports partagés par le cabinet</h2>
              <p className="mt-4 text-sm text-slate-500">Connecté : {session.user.fullName} · {session.user.email}</p>
            </div>
            <Link href="/espace-institutionnel" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Retour espace</Link>
          </div>

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">Bibliothèque client</h3>
                <p className="mt-3 leading-7 text-slate-600">Seuls les livrables marqués comme visibles client et associés à votre compte apparaissent ici.</p>
              </div>
              <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">{documents.length} document{documents.length > 1 ? "s" : ""}</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {documents.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">Aucun livrable visible n’est encore associé à votre compte.</div>
              ) : (
                documents.map((document) => (
                  <article key={document.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <Icon name="file" className="h-7 w-7 text-emerald-600" />
                    <h4 className="mt-5 text-xl font-semibold text-slate-950">{document.title}</h4>
                    <p className="mt-2 text-sm text-slate-500">{document.fileName} · {document.category}</p>
                    {document.description ? <p className="mt-4 leading-7 text-slate-600">{document.description}</p> : null}
                    <p className="mt-4 text-xs text-slate-500">Ajouté le {new Date(document.createdAt).toLocaleString("fr-FR")}</p>
                    <a href={document.fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Ouvrir le document</a>
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
