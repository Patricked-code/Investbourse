import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";

type ContactRequestPayload = {
  ok: boolean;
  data?: Array<{
    id: string;
    fullName: string;
    organization: string;
    email: string;
    requestType: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
  }>;
};

async function fetchContactRequests(): Promise<ContactRequestPayload | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/contact-requests`, { cache: "no-store" });
    return (await response.json()) as ContactRequestPayload;
  } catch {
    return null;
  }
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

export async function ContactRequestsLivePanel() {
  const payload = await fetchContactRequests();
  const requests = payload?.data ?? [];

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6" aria-labelledby="live-contact-requests-title">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h3 id="live-contact-requests-title" className="text-2xl font-semibold">Demandes contact persistées</h3>
          <p className="mt-3 leading-7 text-slate-300">
            Ce bloc interroge les routes Next.js puis l’API Gateway, le contact-service et PostgreSQL via Prisma. Il remplace progressivement les données statiques du cockpit.
          </p>
        </div>
        <div className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950">
          {requests.length} demande{requests.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {requests.length === 0 ? (
          <div className="rounded-2xl bg-white/10 p-5 text-sm leading-7 text-slate-300">
            Aucune demande persistée n’est encore disponible. Dès qu’un formulaire sera envoyé depuis la page contact, la demande apparaîtra ici après enregistrement par le contact-service.
          </div>
        ) : (
          requests.map((request) => (
            <article key={request.id} className="rounded-2xl bg-white p-5 text-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{request.fullName} — {request.organization}</p>
                  <p className="mt-1 text-sm text-slate-500">{request.email} · {new Date(request.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{statusLabel(request.status)}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">Besoin : {requestTypeLabel(request.requestType)}</p>
              <p className="mt-2 line-clamp-3 leading-7 text-slate-600">{request.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/admin/demandes/${request.id}`} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white">
                  Ouvrir la demande <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
                <Link href={`/admin/demandes/${request.id}#qualification`} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
                  Qualifier
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
