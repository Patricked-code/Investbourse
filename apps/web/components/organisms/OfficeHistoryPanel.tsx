type OfficeHistoryPayload = {
  ok: boolean;
  data?: Array<{
    id: string;
    contactRequestId: string;
    status: string;
    priority: string;
    assignedToLabel?: string | null;
    note?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

type OfficeHistoryPanelProps = {
  contactRequestId: string;
};

async function fetchOfficeHistory(contactRequestId: string): Promise<OfficeHistoryPayload | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/office/messages/by-contact-request/${contactRequestId}`, { cache: "no-store" });
    return (await response.json()) as OfficeHistoryPayload;
  } catch {
    return null;
  }
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    OPEN: "Ouvert",
    REVIEW: "En revue",
    ANSWERED: "Répondu",
    ARCHIVED: "Archivé",
  };

  return labels[status] ?? status;
}

function priorityLabel(priority: string) {
  const labels: Record<string, string> = {
    LOW: "Faible",
    NORMAL: "Normale",
    HIGH: "Haute",
  };

  return labels[priority] ?? priority;
}

export async function OfficeHistoryPanel({ contactRequestId }: OfficeHistoryPanelProps) {
  const payload = await fetchOfficeHistory(contactRequestId);
  const items = payload?.data ?? [];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Historique back-office</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Suivis, notes, priorités et statuts créés depuis la fiche demande. Ces données proviennent d’office-service via l’API Gateway.
          </p>
        </div>
        <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          {items.length} suivi{items.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Aucun suivi back-office n’a encore été créé pour cette demande. Utilisez le formulaire de qualification pour créer la première entrée.
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{statusLabel(item.status)}</p>
                  <p className="mt-1 text-sm text-slate-500">Priorité : {priorityLabel(item.priority)} · {new Date(item.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                {item.assignedToLabel ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.assignedToLabel}</span> : null}
              </div>
              {item.note ? <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{item.note}</p> : <p className="mt-4 text-sm text-slate-500">Aucune note interne renseignée.</p>}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
