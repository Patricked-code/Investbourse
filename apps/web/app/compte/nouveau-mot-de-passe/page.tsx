import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { PasswordResetConfirmForm } from "@/components/molecules/PasswordResetConfirmForm";
import { Badge } from "@/components/atoms/Badge";

export const metadata: Metadata = {
  title: "Nouveau mot de passe | Investbourse",
  description: "Définition d’un nouveau mot de passe pour l’espace institutionnel Investbourse.",
  robots: { index: false, follow: false },
};

export default function NewPasswordPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-slate-50 px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-center">
            <Badge>Sécurité</Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">Nouveau mot de passe</h1>
            <h2 className="mt-6 text-2xl font-semibold text-slate-800">Finaliser la réinitialisation d’accès</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Le token est vérifié côté auth-service. S’il est valide, non expiré et non utilisé, le mot de passe est remplacé par un hash sécurisé et le compte est réactivé.</p>
            <Link href="/auth/login" className="mt-8 inline-flex text-sm font-semibold text-emerald-700">Retour à la connexion</Link>
          </section>
          <PasswordResetConfirmForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
