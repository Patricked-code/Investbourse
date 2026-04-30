"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function PasswordResetConfirmForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = await response.json();
      if (!response.ok || payload?.ok === false) throw new Error(payload?.error ?? "PASSWORD_RESET_CONFIRM_FAILED");
      setState("success");
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/10">
      <h3 className="text-2xl font-semibold text-slate-950">Définir un nouveau mot de passe</h3>
      <p className="mt-3 leading-7 text-slate-600">Saisissez le token reçu et choisissez un nouveau mot de passe robuste.</p>
      <label className="mt-6 grid gap-2 text-sm font-medium text-slate-700">
        Token de réinitialisation
        <input required value={token} onChange={(event) => setToken(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
      </label>
      <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
        Nouveau mot de passe
        <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
      </label>
      <button disabled={state === "submitting"} type="submit" className="mt-6 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
        {state === "submitting" ? "Mise à jour..." : "Mettre à jour le mot de passe"}
      </button>
      {state === "success" ? <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Mot de passe mis à jour. Vous pouvez vous connecter.</p> : null}
      {state === "error" ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Erreur : {errorMessage}</p> : null}
    </form>
  );
}
