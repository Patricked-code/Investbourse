import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Badge } from "@/components/atoms/Badge";

export const metadata: Metadata = {
  title: "Accès développement cockpit | Investbourse",
  description: "Page de bypass local temporaire pour développer le cockpit Investbourse avant l’authentification finale.",
  robots: { index: false, follow: false },
};

async function enableBypass() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.set("investbourse_admin_bypass", "enabled", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 4,
  });
  redirect("/admin");
}

async function disableBypass() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("investbourse_admin_bypass");
  redirect("/auth/login");
}

export default function DevAdminAccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-slate-50 px-5 py-16 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-[2rem] border border-amber-200 bg-white p-8 shadow-xl shadow-slate-900/10">
          <Badge>Développement local</Badge>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">Accès temporaire au cockpit</h1>
          <h2 className="mt-5 text-2xl font-semibold text-slate-800">Bypass strictement réservé au développement</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Cette page sert uniquement à tester les écrans protégés avant la finalisation de l’authentification. En production, elle doit rester désactivée et l’accès doit passer par une vraie session utilisateur avec rôles.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <form action={enableBypass}>
              <button type="submit" className="w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-700">Activer l’accès local</button>
            </form>
            <form action={disableBypass}>
              <button type="submit" className="w-full rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-slate-700 hover:border-red-300 hover:text-red-700">Désactiver l’accès local</button>
            </form>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-500">
            Variable requise : <code className="rounded bg-slate-100 px-2 py-1">NEXT_PUBLIC_ENABLE_LOCAL_ADMIN_BYPASS=true</code> en développement uniquement.
          </p>
          <Link href="/auth/login" className="mt-6 inline-flex text-sm font-semibold text-emerald-700">Retour connexion</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
