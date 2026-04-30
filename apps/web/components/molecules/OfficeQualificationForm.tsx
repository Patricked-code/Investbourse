"use client";

import { useState } from "react";

const statuses = [
  { value: "OPEN", label: "Ouvert" },
  { value: "REVIEW", label: "En revue" },
  { value: "ANSWERED", label: "Répondu" },
  { value: "ARCHIVED", label: "Archivé" },
];

const priorities = [
  { value: "LOW", label: "Faible" },
  { value: "NORMAL", label: "Normale" },
  { value: "HIGH", label: "Haute" },
];

type OfficeQualificationFormProps = {
  contactRequestId: string;
};

export function OfficeQualificationForm({ contactRequestId }: OfficeQualificationFormProps) {
  const [status, setStatus] = useState("REVIEW");
  const [priority, setPriority] = useState("NORMAL");
  const [assignedTo, setAssignedTo] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/office/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contactRequestId,
          status,
          priority,
          assignedTo: assignedTo.trim() || null,
          note: note.trim() || null,
        }),
      });

      const payload = await response.json();

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? "OFFICE_QUALIFICATION_FAILED");
      }

      setState("success");
      setNote("");
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  return (
    <form id="qualification" onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-950">Qualifier la demande</h2>
      <p className="mt-3 leading-7 text-slate-600">
        Cette action crée une entrée de suivi back-office liée à la demande contact persistée. Elle passe par la route Next.js, l’API Gateway, puis office-service.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Statut de suivi
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
            {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Priorité
          <select value={priority} onChange={(event) => setPriority(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
            {priorities.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-medium text-slate-700">
        Assignation / responsable interne
        <input value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Nom ou équipe responsable" />
      </label>

      <label className="mt-5 grid gap-2 text-sm font-medium text-slate-700">
        Note interne
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={6} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Première qualification, contexte, prochaine action, niveau d’urgence, documents à demander..." />
      </label>

      <button disabled={state === "submitting"} type="submit" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
        {state === "submitting" ? "Enregistrement..." : "Créer le suivi back-office"}
      </button>

      {state === "success" ? <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">Suivi back-office créé avec succès.</p> : null}
      {state === "error" ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">Erreur : {errorMessage}</p> : null}
    </form>
  );
}
