import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";

export const metadata: Metadata = {
  title: "Connexion espace utilisateur | Investbourse",
  description: "Connexion à l’espace utilisateur Investbourse : accès client institutionnel, suivi des demandes, documents, messages et livrables.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#f8fafc,#ffffff)] px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-center">
            <Badge>Espace sécurisé</Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">Connexion à l’espace utilisateur institutionnel</h1>
            <h2 className="mt-6 text-2xl font-semibold text-slate-800">Suivre les demandes, documents, missions et livrables</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">L’espace utilisateur permettra aux clients de consulter leurs demandes, suivre les échanges, accéder aux documents transmis, télécharger les livrables et gérer leur profil.</p>
            <div className="mt-8 grid gap-3 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Connexion Google, Facebook et Microsoft prévue via OAuth.</p>
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Connexion e-mail et mot de passe avec vérification sécurisée.</p>
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Réinitialisation d’accès via lien sécurisé.</p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/10" aria-labelledby="login-title">
            <h3 id="login-title" className="text-2xl font-semibold text-slate-950">Se connecter</h3>
            <div className="mt-6 grid gap-3">
              <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50" type="button"><Icon name="users" className="h-5 w-5" /> Continuer avec Google</button>
              <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50" type="button"><Icon name="users" className="h-5 w-5" /> Continuer avec Facebook</button>
              <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50" type="button"><Icon name="building" className="h-5 w-5" /> Continuer avec Microsoft</button>
            </div>
            <div className="my-6 flex items-center gap-4"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-semibold uppercase tracking-widest text-slate-400">ou</span><div className="h-px flex-1 bg-slate-200" /></div>
            <form className="grid gap-4" method="post" action="/api/auth/login">
              <label className="grid gap-2 text-sm font-medium text-slate-700">Email<input name="email" type="email" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="nom@institution.com" /></label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">Mot de passe<input name="password" type="password" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="••••••••" /></label>
              <button type="submit" className="rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700">Accéder à mon espace</button>
              <Link href="/compte/recuperation" className="text-sm font-semibold text-emerald-700">Accès oublié ?</Link>
              <Link href="/auth/register" className="text-sm font-semibold text-slate-700">Créer un compte institutionnel</Link>
            </form>
            <p className="mt-5 text-xs leading-6 text-slate-500">En production : Auth.js/NextAuth, OAuth Google/Facebook/Microsoft, hash de mot de passe, double facteur optionnel et journaux de connexion.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
