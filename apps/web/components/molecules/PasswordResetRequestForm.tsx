"use client";

import { useState } from "react";

export function PasswordResetRequestForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);
    setResetToken(null);

    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok || payload?.ok === false) throw new Error(payload?.error ?? "PASSWORD_RESET_REQUEST_FAILED");
      setResetToken(payload?.data?.resetToken ?? null);
      setState("success");
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/10">
      <h3 className="text-2xl font-semibold text-slate-950">Réinitialiser l’accès</h3>
      <p className="mt-3 leading-7 text-slate-600">Entrez votre email. En production, le lien sera envoyé par email. En développement, le token peut être affiché pour faciliter les tests.</p>
      <label className="mt-6 grid gap-2 text-sm font-medium text-slate-700">
        Email professionnel
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
      </label>
      <button disabled={state === "submitting"} type="submit" className="mt-6 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
        {state === "submitting" ? "Demande en cours..." : "Recevoir un lien de réinitialisation"}
      </button>
      {state === "success" ? <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm leading-7 text-emerald-800"><p className="font-semibold">Demande prise en compte.</p>{resetToken ? <p className="mt-2 break-all">Token développement : {resetToken}</p> : null}</div> : null}
      {state === "error" ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Erreur : {errorMessage}</p> : null}
    </form>
  );
}
