import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";

export const metadata: Metadata = {
  title: "Créer un compte institutionnel | Investbourse",
  description: "Création d’un compte utilisateur institutionnel Investbourse pour suivre les demandes, messages, missions et livrables.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-slate-50 px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section>
            <Badge>Compte institutionnel</Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">Créer un accès client sécurisé</h1>
            <h2 className="mt-6 text-2xl font-semibold text-slate-800">Un espace dédié aux investisseurs institutionnels</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">La création de compte permettra de suivre les demandes, échanger avec le cabinet, récupérer les livrables et conserver une traçabilité des missions.</p>
            <div className="mt-8 grid gap-3 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Validation e-mail obligatoire.</p>
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Rôle utilisateur séparé du rôle administrateur.</p>
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Journalisation des connexions et actions sensibles.</p>
            </div>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/10" aria-labelledby="register-title">
            <h3 id="register-title" className="text-2xl font-semibold text-slate-950">Créer un compte</h3>
            <form className="mt-6 grid gap-4" method="post" action="/api/auth/register">
              <label className="grid gap-2 text-sm font-medium text-slate-700">Nom complet<input name="fullName" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Votre nom" /></label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">Organisation<input name="organization" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Institution" /></label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">Email professionnel<input name="email" type="email" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="nom@institution.com" /></label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">Mot de passe<input name="password" type="password" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="••••••••" /></label>
              <button type="submit" className="rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700">Créer mon compte</button>
              <Link href="/auth/login" className="text-sm font-semibold text-emerald-700">J’ai déjà un compte</Link>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
