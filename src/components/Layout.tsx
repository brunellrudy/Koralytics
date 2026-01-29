import { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
  }`;

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold text-slate-900">
          Diaspora Intelligence
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/form" className={navLinkClass}>
            Formulaire
          </NavLink>
          <NavLink to="/consentement" className={navLinkClass}>
            Consentement
          </NavLink>
          <NavLink to="/gdpr" className={navLinkClass}>
            GDPR
          </NavLink>
        </nav>
      </div>
    </header>
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </main>
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
        <span>
          Projet démonstrateur — "Nom de l’organisation" (placeholder) · contact@domaine.tld
        </span>
        <span>© 2024 Diaspora Intelligence — Tous droits réservés.</span>
      </div>
    </footer>
  </div>
);

export default Layout;
