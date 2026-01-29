import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koralytics",
  description: "Koralytics authentication portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Koralytics
              </p>
              <h1 className="text-2xl font-semibold text-white">
                Accès sécurisé à votre intelligence
              </h1>
            </div>
            <nav className="flex items-center gap-3 text-sm text-slate-300">
              <a className="rounded-full border border-slate-700 px-4 py-2" href="/">
                Accueil
              </a>
              <a
                className="rounded-full border border-slate-700 px-4 py-2"
                href="/auth/login"
              >
                Connexion
              </a>
              <a
                className="rounded-full bg-blue-500 px-4 py-2 text-slate-900"
                href="/auth/register"
              >
                Créer un compte
              </a>
            </nav>
          </header>
          <main className="flex-1 py-10">{children}</main>
          <footer className="text-xs text-slate-500">
            © 2024 Koralytics — Portail sécurisé de diaspora intelligence
          </footer>
        </div>
      </body>
    </html>
  );
}
