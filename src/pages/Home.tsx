import { Link } from 'react-router-dom';

const Home = () => (
  <section className="space-y-10">
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Diaspora Intelligence</p>
      <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
        Une plateforme volontaire et conforme RGPD pour valoriser les talents de la diaspora.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-slate-200">
        Nous collectons des données avec consentement granulaire pour produire des statistiques
        utiles, identifier des profils pseudonymisés et faciliter des mises en relation, lorsque
        vous l’autorisez explicitement.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/form"
          className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900"
        >
          S’inscrire / Contribuer
        </Link>
        <Link
          to="/consentement"
          className="rounded-full border border-white/60 px-6 py-2 text-sm font-semibold text-white"
        >
          Comprendre le consentement
        </Link>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {[
        {
          title: 'Collecte volontaire et transparente',
          body: 'Chaque catégorie de données est optionnelle et accompagnée d’un opt-in explicite.'
        },
        {
          title: 'Analyse agrégée ou ciblée',
          body: 'Choisissez si vos données servent uniquement des statistiques ou des analyses avancées.'
        },
        {
          title: 'Contrôle et retrait',
          body: 'Retirez votre consentement à tout moment et exportez vos informations localement.'
        }
      ].map((card) => (
        <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{card.body}</p>
        </div>
      ))}
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Ressources légales</h2>
      <p className="mt-2 text-sm text-slate-600">
        Consultez la page dédiée au consentement et la notice GDPR avant de contribuer.
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
        <Link to="/consentement">Page Consentement</Link>
        <Link to="/gdpr">Page GDPR</Link>
      </div>
    </div>
  </section>
);

export default Home;
