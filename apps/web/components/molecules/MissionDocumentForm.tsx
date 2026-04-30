"use client";

import { useState } from "react";

const categories = [
  "NOTE_CADRAGE",
  "RAPPORT_ANALYSE",
  "GRILLE_SCORING",
  "CAHIER_CHARGES",
  "CONTRAT",
  "LIVRABLE",
  "AUTRE",
];

const visibilities = ["INTERNAL_ONLY", "CLIENT_VISIBLE"];

type MissionDocumentFormProps = {
  users: Array<{ id: string; fullName: string; email: string }>;
  contactRequests: Array<{ id: string; fullName: string; organization: string }>;
};

export function MissionDocumentForm({ users, contactRequests }: MissionDocumentFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    fileName: "",
    fileUrl: "",
    category: "LIVRABLE",
    visibility: "CLIENT_VISIBLE",
    userId: "",
    contactRequestId: "",
  });
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          userId: form.userId || null,
          contactRequestId: form.contactRequestId || null,
          description: form.description || null,
        }),
      });

      const payload = await response.json();

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? "MISSION_DOCUMENT_CREATE_FAILED");
      }

      setState("success");
      setForm({ title: "", description: "", fileName: "", fileUrl: "", category: "LIVRABLE", visibility: "CLIENT_VISIBLE", userId: "", contactRequestId: "" });
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-slate-950">Ajouter un document ou livrable</h3>
      <p className="mt-3 leading-7 text-slate-600">Enregistrez un lien documentaire associé à un client, une demande ou une mission. Le fichier peut être hébergé sur un stockage externe sécurisé.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Titre
          <input required value={form.title} onChange={(event) => updateField("title", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Nom du fichier
          <input required value={form.fileName} onChange={(event) => updateField("fileName", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          URL du fichier
          <input required value={form.fileUrl} onChange={(event) => updateField("fileUrl", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="https://..." />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Catégorie
          <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Visibilité
          <select value={form.visibility} onChange={(event) => updateField("visibility", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
            {visibilities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Utilisateur associé
          <select value={form.userId} onChange={(event) => updateField("userId", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
            <option value="">Non associé</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.fullName} — {user.email}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Demande associée
          <select value={form.contactRequestId} onChange={(event) => updateField("contactRequestId", event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
            <option value="">Non associée</option>
            {contactRequests.map((request) => <option key={request.id} value={request.id}>{request.fullName} — {request.organization}</option>)}
          </select>
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
        Description
        <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={5} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
      </label>

      <button disabled={state === "submitting"} type="submit" className="mt-6 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
        {state === "submitting" ? "Enregistrement..." : "Ajouter le document"}
      </button>

      {state === "success" ? <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Document ajouté.</p> : null}
      {state === "error" ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Erreur : {errorMessage}</p> : null}
    </form>
  );
}
