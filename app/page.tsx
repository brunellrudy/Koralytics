export default function Home() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
          Plateforme d'authentification
        </p>
        <h2 className="text-4xl font-semibold leading-tight text-white">
          Centralisez l'accès à vos analyses et sécurisez vos données
        </h2>
        <p className="text-base text-slate-300">
          Koralytics vous offre un point d'entrée unique pour consulter vos
          tableaux de bord et gérer vos informations sensibles. Connectez-vous
          ou créez un compte pour continuer.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-slate-950"
            href="/auth/login"
          >
            Se connecter
          </a>
          <a
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100"
            href="/auth/register"
          >
            Créer un compte
          </a>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg">
        <h3 className="text-lg font-semibold text-white">
          Pourquoi un portail dédié ?
        </h3>
        <ul className="mt-4 space-y-4 text-sm text-slate-300">
          <li className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            Accès chiffré et parcours simplifié pour vos équipes.
          </li>
          <li className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            Gestion des identités centralisée pour suivre l'activité.
          </li>
          <li className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            Assistance intégrée pour la récupération des accès.
          </li>
        </ul>
      </div>
    </section>
  );
}
