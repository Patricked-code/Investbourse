import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { OfficeHistoryPanel } from "@/components/organisms/OfficeHistoryPanel";
import { OfficeQualificationForm } from "@/components/molecules/OfficeQualificationForm";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";

export const metadata: Metadata = {
  title: "Détail demande institutionnelle | Investbourse",
  description: "Fiche détaillée d’une demande institutionnelle dans le cockpit Investbourse.",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

type ContactRequestResponse = {
  ok: boolean;
  data?: {
    id: string;
    fullName: string;
    organization: string;
    email: string;
    requestType: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
  };
  error?: string;
};

async function getContactRequest(id: string): Promise<ContactRequestResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/contact-requests/${id}`, { cache: "no-store" });
    return (await response.json()) as ContactRequestResponse;
  } catch {
    return null;
  }
}

function requestTypeLabel(requestType: string) {
  const labels: Record<string, string> = {
    "analyse-recurrente": "Analyse récurrente",
    "selection-fonds": "Sélection de fonds",
    "appel-offres": "Appel d’offres",
    "revue-partenaire": "Revue partenaire",
    "politique-placement": "Politique de placement",
  };

  return labels[requestType] ?? requestType;
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    NEW: "Nouveau",
    QUALIFIED: "Qualifié",
    IN_PROGRESS: "En cours",
    CLOSED: "Clôturé",
  };

  return labels[status] ?? status;
}

export default async function AdminDemandDetailPage({ params }: PageProps) {
  const { id } = await params;
  const payload = await getContactRequest(id);
  const request = payload?.data;

  return (
    <>
      <Header />
      <main className="bg-slate-50 px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Badge>Fiche demande</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">Détail de la demande institutionnelle</h1>
              <h2 className="mt-4 text-xl font-semibold text-slate-700">Qualification, historique back-office et prochaine action</h2>
            </div>
            <Link href="/admin" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
              Retour cockpit
            </Link>
          </div>

          {!request ? (
            <section className="rounded-[2rem] border border-red-100 bg-white p-8 shadow-sm">
              <Icon name="file" className="h-10 w-10 text-red-500" />
              <h3 className="mt-5 text-2xl font-semibold text-slate-950">Demande introuvable</h3>
              <p className="mt-3 leading-7 text-slate-600">La demande demandée n’a pas pu être chargée. Elle peut ne pas exister, ou le service de contact peut être indisponible.</p>
              <p className="mt-3 text-sm text-slate-500">Erreur : {payload?.error ?? "CONTACT_REQUEST_UNAVAILABLE"}</p>
            </section>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-8">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Demande #{request.id}</p>
                      <h3 className="mt-4 text-3xl font-semibold text-slate-950">{request.fullName}</h3>
                      <p className="mt-2 text-lg font-medium text-slate-700">{request.organization}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{statusLabel(request.status)}</span>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Email</p>
                      <p className="mt-2 font-medium text-slate-800">{request.email}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Type de besoin</p>
                      <p className="mt-2 font-medium text-slate-800">{requestTypeLabel(request.requestType)}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Création</p>
                      <p className="mt-2 font-medium text-slate-800">{new Date(request.createdAt).toLocaleString("fr-FR")}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Dernière mise à jour</p>
                      <p className="mt-2 font-medium text-slate-800">{request.updatedAt ? new Date(request.updatedAt).toLocaleString("fr-FR") : "Non disponible"}</p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                    <h4 className="text-xl font-semibold text-slate-950">Message initial</h4>
                    <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">{request.message}</p>
                  </div>
                </section>

                <OfficeHistoryPanel contactRequestId={request.id} />
              </div>

              <OfficeQualificationForm contactRequestId={request.id} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
