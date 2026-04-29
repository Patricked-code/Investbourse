import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";

export const metadata: Metadata = {
  title: "Réinitialisation accès client | Investbourse",
  description: "Page de demande de réinitialisation d’accès pour les utilisateurs institutionnels Investbourse.",
  robots: { index: false, follow: false },
};

export default function AccountRecoveryPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-slate-50 px-5 py-16 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10">
          <Badge>Sécurité du compte</Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">Réinitialiser votre accès client</h1>
          <h2 className="mt-5 text-2xl font-semibold text-slate-800">Recevoir un lien sécurisé par e-mail</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Cette page prépare le futur parcours de récupération d’accès. La demande devra être transmise au service d’authentification, journalisée, limitée en fréquence et traitée sans révéler publiquement l’existence ou non du compte.
          </p>
          <form className="mt-8 grid gap-4" method="post" action="/api/auth/access-recovery">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email professionnel
              <input name="email" type="email" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="nom@institution.com" />
            </label>
            <button type="submit" className="rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700">Recevoir le lien sécurisé</button>
            <Link href="/auth/login" className="text-sm font-semibold text-emerald-700">Retour à la connexion</Link>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
