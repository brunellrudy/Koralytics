import AuthForm from "../../components/AuthForm";

export default function LoginPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">
          Reprenez le contrôle de vos analyses
        </h2>
        <p className="text-sm text-slate-300">
          Connectez-vous pour accéder aux tableaux de bord, alertes et
          recommandations personnalisées.
        </p>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
          <p className="font-semibold text-white">Besoin d'aide ?</p>
          <p className="mt-2">
            Utilisez la récupération de mot de passe si vous ne retrouvez plus
            vos identifiants.
          </p>
          <a className="mt-3 inline-flex" href="/auth/forgot">
            Réinitialiser mon mot de passe
          </a>
        </div>
      </div>
      <AuthForm mode="login" />
    </section>
  );
}
