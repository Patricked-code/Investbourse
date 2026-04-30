import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { PasswordResetRequestForm } from "@/components/molecules/PasswordResetRequestForm";
import { Badge } from "@/components/atoms/Badge";

export const metadata: Metadata = {
  title: "Récupération d’accès | Investbourse",
  description: "Demande de réinitialisation du mot de passe pour l’espace institutionnel Investbourse.",
  robots: { index: false, follow: false },
};

export default function PasswordRecoveryPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#f8fafc,#ffffff)] px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-center">
            <Badge>Compte utilisateur</Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">Récupération d’accès</h1>
            <h2 className="mt-6 text-2xl font-semibold text-slate-800">Réinitialiser un mot de passe oublié</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">La demande génère un jeton temporaire, hashé en base de données et valable pendant une durée limitée. En production, ce jeton devra être envoyé par email via SMTP ou Resend.</p>
            <Link href="/auth/login" className="mt-8 inline-flex text-sm font-semibold text-emerald-700">Retour à la connexion</Link>
          </section>
          <PasswordResetRequestForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
