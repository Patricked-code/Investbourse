import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { RegisterForm } from "@/components/molecules/RegisterForm";
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
            <p className="mt-5 text-lg leading-8 text-slate-600">La création de compte permet de suivre les demandes, échanger avec le cabinet, récupérer les livrables et conserver une traçabilité des missions.</p>
            <div className="mt-8 grid gap-3 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Création utilisateur persistée dans PostgreSQL.</p>
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Mot de passe hashé côté auth-service.</p>
              <p className="flex items-center gap-2"><Icon name="check" className="h-5 w-5 text-emerald-600" /> Session httpOnly créée après inscription réussie.</p>
            </div>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/10" aria-labelledby="register-title">
            <h3 id="register-title" className="text-2xl font-semibold text-slate-950">Créer un compte</h3>
            <RegisterForm />
            <Link href="/auth/login" className="mt-4 inline-flex text-sm font-semibold text-emerald-700">J’ai déjà un compte</Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
