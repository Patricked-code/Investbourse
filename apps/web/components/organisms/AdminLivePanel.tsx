import { Icon } from "@/components/atoms/Icon";

type OfficeDashboardPayload = {
  ok: boolean;
  data?: {
    total: number;
    open: number;
    review: number;
    answered: number;
    archived: number;
  };
};

type OfficeMessagesPayload = {
  ok: boolean;
  data?: Array<{
    id: string;
    contactRequestId: string;
    status: string;
    priority: string;
    assignedTo?: string | null;
    note?: string | null;
    updatedAt: string;
  }>;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function AdminLivePanel() {
  const dashboard = await fetchJson<OfficeDashboardPayload>("/api/office/dashboard");
  const messages = await fetchJson<OfficeMessagesPayload>("/api/office/messages");

  const stats = dashboard?.data
    ? [
        [String(dashboard.data.total), "Total office", "mail"],
        [String(dashboard.data.open), "Ouverts", "file"],
        [String(dashboard.data.review), "En revue", "clipboard"],
        [String(dashboard.data.answered), "Répondus", "check"],
      ]
    : [
        ["—", "Total office", "mail"],
        ["—", "Ouverts", "file"],
        ["—", "En revue", "clipboard"],
        ["—", "Répondus", "check"],
      ];

  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6" aria-labelledby="live-office-title">
      <h3 id="live-office-title" className="text-2xl font-semibold">Flux back-office connecté API</h3>
      <p className="mt-3 leading-7 text-slate-300">
        Ce bloc interroge les routes Next.js qui relaient vers l’API Gateway puis vers office-service. Il sert de première preuve d’intégration full REST.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-4">
        {stats.map(([value, label, icon]) => (
          <article key={label} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <Icon name={icon} className="h-6 w-6 text-emerald-300" />
            <p className="mt-4 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-slate-300">{label}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-3">
        {(messages?.data ?? []).length === 0 ? (
          <div className="rounded-2xl bg-white/10 p-5 text-sm leading-7 text-slate-300">
            Aucun message office n’est encore présent dans le service. Les prochains enregistrements créés via l’API apparaîtront ici.
          </div>
        ) : (
          messages?.data?.map((message) => (
            <article key={message.id} className="rounded-2xl bg-white p-5 text-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">{message.contactRequestId}</p>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{message.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Priorité : {message.priority} · {message.updatedAt}</p>
              {message.note ? <p className="mt-3 leading-7 text-slate-600">{message.note}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
