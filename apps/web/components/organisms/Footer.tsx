import Link from "next/link";
import { publicPages, siteConfig } from "@/lib/site-data";
import { Icon } from "@/components/atoms/Icon";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-5 py-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr_1fr]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Icon name="landmark" className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold uppercase tracking-[0.16em] text-slate-950">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-slate-500">Conseil institutionnel — UEMOA</p>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Toute prestation réglementée doit être exercée dans le cadre des habilitations applicables. Le cabinet ne reçoit ni fonds ni titres de la clientèle.
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-950">Pages SEO</h4>
          <div className="mt-4 grid gap-2">
            {publicPages.slice(1, 7).map((page) => (
              <Link key={page.slug} href={page.slug} className="text-left text-sm text-slate-500 hover:text-emerald-700">
                {page.nav} — {page.slug}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-950">Accès</h4>
          <div className="mt-4 grid gap-2">
            <Link href="/auth/login" className="text-left text-sm text-slate-500 hover:text-emerald-700">Espace utilisateur</Link>
            <Link href="/admin" className="text-left text-sm text-slate-500 hover:text-emerald-700">Cockpit administrateur</Link>
            <Link href="/contact" className="text-left text-sm text-slate-500 hover:text-emerald-700">Contact institutionnel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
