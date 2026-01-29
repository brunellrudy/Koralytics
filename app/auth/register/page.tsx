import AuthForm from "../../components/AuthForm";

export default function RegisterPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">
          Créez un accès sécurisé pour votre équipe
        </h2>
        <p className="text-sm text-slate-300">
          Renseignez vos informations pour démarrer votre espace Koralytics et
          recevoir vos premières recommandations.
        </p>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
          <p className="font-semibold text-white">Déjà membre ?</p>
          <p className="mt-2">
            Retrouvez votre compte en vous connectant directement.
          </p>
          <a className="mt-3 inline-flex" href="/auth/login">
            Accéder à la connexion
          </a>
        </div>
      </div>
      <AuthForm mode="register" />
    </section>
  );
}
