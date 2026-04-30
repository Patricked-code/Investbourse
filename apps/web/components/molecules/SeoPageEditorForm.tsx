"use client";

import { useState } from "react";

type SeoPageEditorFormProps = {
  initialData?: {
    slug: string;
    title: string;
    metaTitle: string;
    description: string;
    schemaType: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    keywords: string[];
    isPublished: boolean;
  };
};

export function SeoPageEditorForm({ initialData }: SeoPageEditorFormProps) {
  const [form, setForm] = useState({
    slug: initialData?.slug ?? "/nouvelle-page",
    title: initialData?.title ?? "",
    metaTitle: initialData?.metaTitle ?? "",
    description: initialData?.description ?? "",
    schemaType: initialData?.schemaType ?? "Service",
    h1: initialData?.h1 ?? "",
    h2: initialData?.h2 ?? "",
    h3: initialData?.h3 ?? "",
    h4: initialData?.h4 ?? "",
    h5: initialData?.h5 ?? "",
    keywords: initialData?.keywords?.join(", ") ?? "",
    isPublished: initialData?.isPublished ?? false,
  });
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/seo-pages/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          keywords: form.keywords.split(",").map((item) => item.trim()).filter(Boolean),
        }),
      });

      const payload = await response.json();

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? "SEO_PAGE_SAVE_FAILED");
      }

      setState("success");
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-slate-950">Éditer une page SEO</h3>
      <p className="mt-3 leading-7 text-slate-600">Création ou mise à jour d’une page SEO dans content-service via PostgreSQL/Prisma.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ["slug", "Slug"],
          ["title", "Titre interne"],
          ["metaTitle", "Meta title"],
          ["schemaType", "Schema.org type"],
          ["h1", "H1"],
          ["h2", "H2"],
          ["h3", "H3"],
          ["h4", "H4"],
          ["h5", "H5"],
          ["keywords", "Keywords séparés par virgules"],
        ].map(([field, label]) => (
          <label key={field} className="grid gap-2 text-sm font-medium text-slate-700">
            {label}
            <input value={String(form[field as keyof typeof form])} onChange={(event) => updateField(field as keyof typeof form, event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
          </label>
        ))}
      </div>

      <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
        Meta description
        <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={5} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
      </label>

      <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={form.isPublished} onChange={(event) => updateField("isPublished", event.target.checked)} className="h-5 w-5 rounded border-slate-300" />
        Page publiée
      </label>

      <button disabled={state === "submitting"} type="submit" className="mt-6 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
        {state === "submitting" ? "Enregistrement..." : "Enregistrer la page SEO"}
      </button>

      {state === "success" ? <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Page SEO enregistrée.</p> : null}
      {state === "error" ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Erreur : {errorMessage}</p> : null}
    </form>
  );
}
