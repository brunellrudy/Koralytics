const Gdpr = () => (
  <div className="space-y-8">
    <header className="space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">GDPR</p>
      <h1 className="text-3xl font-semibold text-slate-900">
        Notice RGPD — À adapter juridiquement.
      </h1>
      <p className="max-w-3xl text-sm text-slate-600">
        Ce document est un modèle factuel destiné à être complété par l’organisation responsable du
        traitement. Aucun élément ne constitue un avis juridique.
      </p>
    </header>

    <section className="grid gap-6 md:grid-cols-2">
      {[
        {
          title: 'Responsable de traitement',
          body: 'Nom de l’organisation, adresse, représentant légal (placeholder).'
        },
        {
          title: 'Finalités',
          body: 'Statistiques agrégées, analyses pseudonymisées, mise en relation sur opt-in.'
        },
        {
          title: 'Base légale',
          body: 'Consentement explicite de la personne concernée.'
        },
        {
          title: 'Catégories de données',
          body: 'Identité minimale, profil socio-démographique, compétences, intentions, capacités.'
        },
        {
          title: 'Destinataires',
          body: 'Équipe interne habilitée, institutions partenaires (catégories à préciser).'
        },
        {
          title: 'Durées de conservation',
          body: 'Exemple : 24 mois après la dernière interaction (à ajuster).'
        },
        {
          title: 'Transferts hors UE',
          body: 'À préciser si applicable, avec garanties appropriées.'
        },
        {
          title: 'Sécurité',
          body: 'Mesures techniques et organisationnelles générales (accès limité, chiffrement, etc.).'
        }
      ].map((item) => (
        <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{item.body}</p>
        </div>
      ))}
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Droits des personnes</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
        <li>Droit d’accès, de rectification et d’effacement.</li>
        <li>Droit à la limitation et à l’opposition.</li>
        <li>Droit à la portabilité des données.</li>
        <li>Droit de retirer son consentement à tout moment.</li>
        <li>Réclamation auprès de l’autorité de contrôle compétente.</li>
      </ul>
      <p className="mt-3 text-sm text-slate-600">
        Contact DPO (placeholder) : contact@domaine.tld
      </p>
      <p className="mt-3 text-xs text-slate-400">À adapter juridiquement selon votre contexte.</p>
    </section>
  </div>
);

export default Gdpr;
