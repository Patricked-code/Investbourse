"use client";

import { useState } from "react";

type ClientMessageFormProps = {
  mode: "client" | "admin";
  userId?: string;
  contactRequestId?: string;
  defaultSubject?: string;
};

export function ClientMessageForm({ mode, userId, contactRequestId, defaultSubject = "" }: ClientMessageFormProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    try {
      const endpoint = mode === "admin" ? "/api/admin/client-messages" : "/api/me/messages";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject, body, userId: userId ?? null, contactRequestId: contactRequestId ?? null }),
      });
      const payload = await response.json();
      if (!response.ok || payload?.ok === false) throw new Error(payload?.error ?? "MESSAGE_CREATE_FAILED");
      setState("success");
      setBody("");
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-slate-950">{mode === "admin" ? "Répondre au client" : "Envoyer un message"}</h3>
      <p className="mt-3 leading-7 text-slate-600">Les échanges sont conservés dans le journal applicatif et rattachés à votre compte ou à la demande concernée.</p>
      <label className="mt-6 grid gap-2 text-sm font-medium text-slate-700">
        Sujet
        <input required value={subject} onChange={(event) => setSubject(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
      </label>
      <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
        Message
        <textarea required value={body} onChange={(event) => setBody(event.target.value)} rows={7} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
      </label>
      <button disabled={state === "submitting"} type="submit" className="mt-6 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
        {state === "submitting" ? "Envoi..." : "Envoyer"}
      </button>
      {state === "success" ? <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Message envoyé.</p> : null}
      {state === "error" ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Erreur : {errorMessage}</p> : null}
    </form>
  );
}
