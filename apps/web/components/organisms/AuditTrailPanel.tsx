type AuditTrailPayload = {
  ok: boolean;
  data?: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown> | null;
    createdAt: string;
  }>;
};

type AuditTrailPanelProps = {
  contactRequestId: string;
};

async function fetchAuditTrail(contactRequestId: string): Promise<AuditTrailPayload | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/office/audit/by-contact-request/${contactRequestId}`, { cache: "no-store" });
    return (await response.json()) as AuditTrailPayload;
  } catch {
    return null;
  }
}

function actionLabel(action: string) {
  const labels: Record<string, string> = {
    OFFICE_MESSAGE_CREATED: "Suivi back-office créé",
  };

  return labels[action] ?? action;
}

export async function AuditTrailPanel({ contactRequestId }: AuditTrailPanelProps) {
  const payload = await fetchAuditTrail(contactRequestId);
  const items = payload?.data ?? [];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Journal d’audit</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Traçabilité des actions sensibles liées à cette demande. Ce journal est enregistré dans la table AuditLog via office-service.
          </p>
        </div>
        <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          {items.length} action{items.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Aucun événement d’audit n’est encore associé à cette demande. Les prochaines qualifications back-office seront journalisées ici.
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{actionLabel(item.action)}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.entityType} · {item.entityId ?? "sans identifiant"}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{new Date(item.createdAt).toLocaleString("fr-FR")}</span>
              </div>
              {item.metadata ? (
                <pre className="mt-4 max-h-40 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-emerald-100">{JSON.stringify(item.metadata, null, 2)}</pre>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
