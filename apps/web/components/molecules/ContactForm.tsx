export function ContactForm() {
  return (
    <form className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm" method="post" action="/api/contact-requests">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Nom complet
          <input name="fullName" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Votre nom" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Organisation
          <input name="organization" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Institution / société" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email professionnel
          <input name="email" required type="email" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="nom@institution.com" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Type de besoin
          <select name="requestType" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100">
            <option value="analyse-recurrente">Analyse récurrente</option>
            <option value="selection-fonds">Sélection de fonds</option>
            <option value="appel-offres">Appel d’offres</option>
            <option value="revue-partenaire">Revue de partenaire</option>
            <option value="politique-placement">Politique de placement</option>
          </select>
        </label>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-medium text-slate-700">
        Message
        <textarea name="message" required rows={6} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" placeholder="Décrivez votre besoin, votre horizon, les montants concernés, les contraintes de liquidité ou le type de consultation envisagée." />
      </label>
      <button type="submit" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-700">
        Envoyer la demande vers le cockpit administrateur
      </button>
      <p className="mt-4 text-xs leading-6 text-slate-500">
        En production, ce formulaire appellera le gateway REST, créera une entrée dans le service de contact, notifiera l’administrateur et journalisera l’action.
      </p>
    </form>
  );
}
