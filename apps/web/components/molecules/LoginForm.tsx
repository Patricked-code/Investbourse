"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/espace-institutionnel";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? "LOGIN_FAILED");
      }

      window.location.href = redirectTo;
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Email
        <input
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          placeholder="nom@institution.com"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Mot de passe
        <input
          name="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          placeholder="••••••••"
        />
      </label>
      <button disabled={state === "submitting"} type="submit" className="rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
        {state === "submitting" ? "Connexion..." : "Accéder à mon espace"}
      </button>
      {state === "error" ? <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Erreur : {errorMessage}</p> : null}
    </form>
  );
}
