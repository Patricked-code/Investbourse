"use client";

import { useState } from "react";

const accessLevels = ["USER", "ADMIN", "SUPERADMIN"] as const;
const accountStates = ["PENDING_VERIFICATION", "ACTIVE", "DISABLED"] as const;

type AccountAccessFormProps = {
  accountId: string;
  initialAccessLevel: string;
  initialAccountState: string;
};

export function AccountAccessForm({ accountId, initialAccessLevel, initialAccountState }: AccountAccessFormProps) {
  const [accessLevel, setAccessLevel] = useState(initialAccessLevel);
  const [accountState, setAccountState] = useState(initialAccountState);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${accountId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: accessLevel, status: accountState }),
      });

      const payload = await response.json();

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? "ACCOUNT_UPDATE_FAILED");
      }

      setState("success");
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Niveau d’accès
        <select value={accessLevel} onChange={(event) => setAccessLevel(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
          {accessLevels.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
        État du compte
        <select value={accountState} onChange={(event) => setAccountState(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
          {accountStates.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <button disabled={state === "submitting"} type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
        {state === "submitting" ? "Mise à jour..." : "Mettre à jour"}
      </button>
      {state === "success" ? <p className="text-sm font-semibold text-emerald-700 md:col-span-3">Compte mis à jour.</p> : null}
      {state === "error" ? <p className="text-sm font-semibold text-red-700 md:col-span-3">Erreur : {errorMessage}</p> : null}
    </form>
  );
}
