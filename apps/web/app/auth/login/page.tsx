import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { LoginForm } from "@/components/molecules/LoginForm";
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
            <p className="mt-5 text-lg leading-8 text-slate-600">L’espace utilisateur permet aux clients de consulter leurs demandes, suivre les échanges, accéder aux documents transmis, télécharger les livrables et gérer leur profil.</p>
            <div className="mt-8 grid gap-3 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Connexion e-mail et mot de passe branchée sur auth-service.</p>
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Session sécurisée via cookie httpOnly.</p>
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> OAuth Google, Facebook et Microsoft prévu dans une phase dédiée.</p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/10" aria-labelledby="login-title">
            <h3 id="login-title" className="text-2xl font-semibold text-slate-950">Se connecter</h3>
            <div className="mt-6 grid gap-3">
              <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 opacity-60" type="button"><Icon name="users" className="h-5 w-5" /> Continuer avec Google bientôt</button>
              <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 opacity-60" type="button"><Icon name="users" className="h-5 w-5" /> Continuer avec Facebook bientôt</button>
              <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 opacity-60" type="button"><Icon name="building" className="h-5 w-5" /> Continuer avec Microsoft bientôt</button>
            </div>
            <div className="my-6 flex items-center gap-4"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-semibold uppercase tracking-widest text-slate-400">ou</span><div className="h-px flex-1 bg-slate-200" /></div>
            <LoginForm />
            <div className="mt-4 grid gap-2">
              <Link href="/compte/recuperation" className="text-sm font-semibold text-emerald-700">Accès oublié ?</Link>
              <Link href="/auth/register" className="text-sm font-semibold text-slate-700">Créer un compte institutionnel</Link>
            </div>
            <p className="mt-5 text-xs leading-6 text-slate-500">Le formulaire est connecté à /api/auth/login, qui passe par l’API Gateway puis auth-service. En cas de succès, un cookie httpOnly est créé.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
