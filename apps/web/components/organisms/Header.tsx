import Link from "next/link";
import { publicPages, siteConfig } from "@/lib/site-data";
import { Icon } from "@/components/atoms/Icon";

export function Header() {
  const navPages = publicPages.slice(0, 7);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
            <Icon name="landmark" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-950">{siteConfig.name}</p>
            <p className="text-xs text-slate-500">Conseil institutionnel UEMOA</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Navigation principale">
          {navPages.map((item) => (
            <Link key={item.slug} href={item.slug} className="text-sm font-medium text-slate-600 transition hover:text-emerald-700">
              {item.nav}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/auth/login" className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
            Connexion
          </Link>
          <Link href="/admin" className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-emerald-700">
            Cockpit admin
          </Link>
        </div>
      </div>
    </header>
  );
}
