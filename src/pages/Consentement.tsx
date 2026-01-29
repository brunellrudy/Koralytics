import { Link } from 'react-router-dom';

const Consentement = () => (
  <div className="space-y-8">
    <header className="space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Consentement</p>
      <h1 className="text-3xl font-semibold text-slate-900">Votre consentement, votre contrôle.</h1>
      <p className="max-w-3xl text-sm text-slate-600">
        Cette plateforme est gérée par « Nom de l’organisation » (placeholder). Les données sont
        collectées pour produire des statistiques agrégées et, si vous le souhaitez, permettre des
        analyses pseudonymisées ou un contact direct. La base légale est le consentement explicite.
      </p>
    </header>

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Principes clés</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
        <li>Vous choisissez les catégories de données que vous souhaitez partager.</li>
        <li>Vous pouvez retirer votre consentement à tout moment via le formulaire.</li>
        <li>Vos données ne sont jamais revendues et restent limitées aux finalités déclarées.</li>
      </ul>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Niveaux d’accès aux données</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[
          {
            title: 'Niveau 0 — Agrégé national',
            body: 'Statistiques globales sans aucune identification individuelle.'
          },
          {
            title: 'Niveau 1 — Agrégé sectoriel',
            body: 'Statistiques par secteur ou zone, toujours sans profil individuel.'
          },
          {
            title: 'Niveau 2 — Profils pseudonymisés',
            body: 'Analyse avancée sur des profils non identifiants.'
          },
          {
            title: 'Niveau 3 — Données identifiantes',
            body: 'Informations nominatives, jamais collectées par défaut.'
          },
          {
            title: 'Niveau 4 — Contact direct',
            body: 'Contact explicite pour des opportunités spécifiques, uniquement opt-in.'
          }
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Vos droits</h2>
      <p className="mt-2 text-sm text-slate-600">
        Vous pouvez accéder, rectifier ou supprimer vos données. Pour toute demande, contactez le
        DPO à contact@domaine.tld (placeholder).
      </p>
      <p className="mt-3 text-xs text-slate-400">
        À adapter juridiquement selon l’organisation, la finalité et les partenaires.
      </p>
    </section>

    <div className="flex flex-wrap gap-3">
      <Link
        to="/form?step=consentement"
        className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white"
      >
        Gérer mon consentement
      </Link>
      <Link
        to="/gdpr"
        className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700"
      >
        Lire la page GDPR
      </Link>
    </div>
  </div>
);

export default Consentement;
