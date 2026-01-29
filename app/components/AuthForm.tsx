"use client";

import { useMemo, useState } from "react";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type AuthMode = "login" | "register" | "reset";

type AuthFormProps = {
  mode: AuthMode;
};

type FormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const MODE_COPY: Record<
  AuthMode,
  { title: string; description: string; submit: string; endpoint: string }
> = {
  login: {
    title: "Connexion",
    description: "Accédez à votre espace Koralytics en toute sécurité.",
    submit: "Se connecter",
    endpoint: "/api/auth/login",
  },
  register: {
    title: "Créer un compte",
    description: "Rejoignez la plateforme et configurez vos accès.",
    submit: "Créer un compte",
    endpoint: "/api/auth/register",
  },
  reset: {
    title: "Mot de passe oublié",
    description: "Recevez un lien pour réinitialiser votre mot de passe.",
    submit: "Envoyer le lien",
    endpoint: "/api/auth/reset",
  },
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const copy = MODE_COPY[mode];
  const canCheckPassword = mode !== "reset";

  const validationMessage = useMemo(() => {
    if (!formState.email.trim()) {
      return "L'adresse email est requise.";
    }
    if (!EMAIL_PATTERN.test(formState.email)) {
      return "Veuillez saisir une adresse email valide.";
    }
    if (mode === "register" && !formState.fullName.trim()) {
      return "Le nom complet est requis pour créer un compte.";
    }
    if (canCheckPassword && !formState.password) {
      return "Le mot de passe est requis.";
    }
    if (mode === "register" && formState.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (
      mode === "register" &&
      formState.password !== formState.confirmPassword
    ) {
      return "Les mots de passe ne correspondent pas.";
    }
    return null;
  }, [canCheckPassword, formState, mode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(copy.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formState.fullName.trim(),
          email: formState.email.trim(),
          password: formState.password,
          confirmPassword: formState.confirmPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.message ?? "Une erreur est survenue.");
        return;
      }

      setSuccess(payload?.message ?? "Opération réussie.");
      setFormState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Impossible de contacter le serveur."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="text-sm text-slate-300">{copy.description}</p>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "register" && (
          <label className="block text-sm text-slate-300">
            Nom complet
            <input
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white"
              name="fullName"
              placeholder="Marie Diallo"
              value={formState.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
          </label>
        )}
        <label className="block text-sm text-slate-300">
          Adresse email
          <input
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white"
            name="email"
            type="email"
            placeholder="nom@entreprise.com"
            value={formState.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </label>
        {canCheckPassword && (
          <label className="block text-sm text-slate-300">
            Mot de passe
            <input
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              required
            />
          </label>
        )}
        {mode === "register" && (
          <label className="block text-sm text-slate-300">
            Confirmez le mot de passe
            <input
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white"
              name="confirmPassword"
              type="password"
              value={formState.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>
        )}
        {error && (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            {success}
          </p>
        )}
        <button
          className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Traitement..." : copy.submit}
        </button>
      </form>
    </div>
  );
}
