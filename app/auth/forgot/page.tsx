import AuthForm from "../../components/AuthForm";

export default function ForgotPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">
          Réinitialisez votre mot de passe
        </h2>
        <p className="text-sm text-slate-300">
          Nous vous enverrons un lien sécurisé pour récupérer l'accès à votre
          compte.
        </p>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
          <p className="font-semibold text-white">Pas encore inscrit ?</p>
          <p className="mt-2">
            Créez un compte pour accéder au portail Koralytics.
          </p>
          <a className="mt-3 inline-flex" href="/auth/register">
            Créer un compte
          </a>
        </div>
      </div>
      <AuthForm mode="reset" />
    </section>
  );
}
