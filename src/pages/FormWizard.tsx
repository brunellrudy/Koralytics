import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import {
  ageRanges,
  adminStatuses,
  barriers,
  contributionModes,
  educationLevels,
  expertiseDomains,
  familyStatuses,
  investmentCapacities,
  languages,
  priorityDomains,
  returnInterests,
  sectors,
  seniorityLevels,
  timeAbroadOptions
} from '../data/options';
import {
  clearFormData,
  downloadJson,
  getDefaultFormData,
  loadFormData,
  saveFormData
} from '../lib/storage';
import { FormData } from '../lib/types';

const steps = [
  { id: 'identite', label: 'Identité' },
  { id: 'socio', label: 'Socio-démo' },
  { id: 'skills', label: 'Compétences' },
  { id: 'intentions', label: 'Intentions' },
  { id: 'economique', label: 'Capacités' },
  { id: 'consentements', label: 'Consentements' },
  { id: 'review', label: 'Review' }
];

const FormWizard = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>(() => loadFormData() ?? getDefaultFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stepQuery = new URLSearchParams(location.search).get('step');
    if (stepQuery === 'consentement') {
      setCurrentStep(5);
    }
  }, [location.search]);

  useEffect(() => {
    saveFormData(data);
  }, [data]);

  const handleIdentityChange = (field: keyof FormData['identity'], value: string) => {
    setData((prev) => ({
      ...prev,
      identity: { ...prev.identity, [field]: value }
    }));
  };

  const handleSocioChange = (field: keyof FormData['socio'], value: string) => {
    setData((prev) => ({
      ...prev,
      socio: { ...prev.socio, [field]: value }
    }));
  };

  const handleSkillsChange = (field: keyof FormData['skills'], value: string | string[]) => {
    setData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [field]: value }
    }));
  };

  const handleIntentionChange = (field: keyof FormData['intention'], value: string | string[]) => {
    setData((prev) => ({
      ...prev,
      intention: { ...prev.intention, [field]: value }
    }));
  };

  const handleEconomicChange = (field: keyof FormData['economic'], value: string) => {
    setData((prev) => ({
      ...prev,
      economic: { ...prev.economic, [field]: value }
    }));
  };

  const toggleArrayValue = (array: string[], value: string) =>
    array.includes(value) ? array.filter((item) => item !== value) : [...array, value];

  const updateConsents = (field: keyof FormData['consents'], checked: boolean) => {
    setData((prev) => ({
      ...prev,
      consents: { ...prev.consents, [field]: checked }
    }));
  };

  const updateConsentMeta = (field: keyof FormData['consentMeta'], value: string) => {
    setData((prev) => ({
      ...prev,
      consentMeta: { ...prev.consentMeta, [field]: value }
    }));
  };

  const validateStep = (stepIndex: number) => {
    const nextErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!data.identity.originCountry) {
        nextErrors.originCountry = 'Le pays d’origine est obligatoire.';
      }
      if (!data.identity.residenceCountry) {
        nextErrors.residenceCountry = 'Le pays de résidence est obligatoire.';
      }
      if (data.identityOptIn) {
        const hasName = data.identity.firstName || data.identity.lastName;
        if (!data.identity.pseudonym && !hasName) {
          nextErrors.pseudonym = 'Ajoutez un pseudonyme ou un nom.';
        }
      }
      if (data.consents.contactOptIn && !data.identity.email) {
        nextErrors.email = 'Un email est requis pour le contact direct.';
      }
    }

    if (stepIndex === 5) {
      if (!data.consents.readConsentPage) {
        nextErrors.readConsentPage = 'Veuillez confirmer la lecture de la page Consentement.';
      }
      if (!data.consents.readGdprPage) {
        nextErrors.readGdprPage = 'Veuillez confirmer la lecture de la page GDPR.';
      }
      if (data.consents.contactOptIn && !data.identity.email) {
        nextErrors.email = 'Un email est requis pour le contact direct.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!validateStep(5)) {
      setCurrentStep(5);
      return;
    }
    setData((prev) => ({
      ...prev,
      submittedAt: new Date().toISOString(),
      consentMeta: {
        ...prev.consentMeta,
        timestamp: new Date().toISOString(),
        locale: 'fr-FR'
      }
    }));
    setSubmitted(true);
  };

  const handleReset = () => {
    clearFormData();
    setData(getDefaultFormData());
    setErrors({});
    setCurrentStep(0);
    setSubmitted(false);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then((content) => {
        const imported = JSON.parse(content) as FormData;
        setData(imported);
        setSubmitted(false);
      })
      .catch(() => {
        setErrors({ import: 'Le fichier JSON est invalide.' });
      });
  };

  const consentProof = useMemo(
    () => ({
      respondentId: data.respondentId,
      consents: data.consents,
      consentMeta: {
        ...data.consentMeta,
        timestamp: data.consentMeta.timestamp || new Date().toISOString()
      }
    }),
    [data]
  );

  if (submitted) {
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Merci pour votre contribution.</h1>
          <p className="mt-2 text-sm text-slate-600">
            Votre réponse a été enregistrée localement avec une preuve de consentement horodatée.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
              onClick={() => downloadJson(data, 'diaspora-intelligence.json')}
            >
              Télécharger le JSON
            </button>
            <button
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
              onClick={() => downloadJson(consentProof, 'preuve-consentement.json')}
            >
              Télécharger la preuve de consentement
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-semibold">Retirer mon consentement</p>
          <p className="mt-2">Effacez vos données locales et recommencez si nécessaire.</p>
          <button
            className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white"
            onClick={handleReset}
          >
            Effacer mes données
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Formulaire Diaspora</h1>
          <p className="text-sm text-slate-600">
            Wizard multi-étapes avec consentement granulaire et sauvegarde locale.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Importer JSON
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={() => downloadJson(data, 'diaspora-intelligence.json')}
          >
            Exporter JSON
          </button>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={handleReset}
          >
            Recommencer
          </button>
        </div>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {errors.import && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {errors.import}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Étape 1 — Identité minimale</h2>
              <p className="text-sm text-slate-600">
                Cette section est optionnelle par défaut. Les pays d’origine et de résidence restent
                obligatoires pour les statistiques.
              </p>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <input
                type="checkbox"
                checked={data.identityOptIn}
                onChange={(event) =>
                  setData((prev) => ({ ...prev, identityOptIn: event.target.checked }))
                }
                className="h-4 w-4"
              />
              Je consens à fournir des données identifiantes (nom/email).
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="pseudonym">
                  Pseudonyme (recommandé)
                </label>
                <input
                  id="pseudonym"
                  type="text"
                  value={data.identity.pseudonym}
                  onChange={(event) => handleIdentityChange('pseudonym', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  aria-describedby={errors.pseudonym ? 'pseudonym-error' : undefined}
                />
                {errors.pseudonym && (
                  <p id="pseudonym-error" className="mt-1 text-xs text-red-600" role="alert">
                    {errors.pseudonym}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="city">
                  Ville (facultatif)
                </label>
                <input
                  id="city"
                  type="text"
                  value={data.identity.city}
                  onChange={(event) => handleIdentityChange('city', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {(data.identityOptIn || data.consents.contactOptIn) && (
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="firstName">
                    Prénom (facultatif)
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={data.identity.firstName}
                    onChange={(event) => handleIdentityChange('firstName', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="lastName">
                    Nom (facultatif)
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={data.identity.lastName}
                    onChange={(event) => handleIdentityChange('lastName', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="email">
                    Email (facultatif, requis pour contact direct)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.identity.email}
                    onChange={(event) => handleIdentityChange('email', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="originCountry">
                  Pays d’origine *
                </label>
                <input
                  id="originCountry"
                  type="text"
                  value={data.identity.originCountry}
                  onChange={(event) => handleIdentityChange('originCountry', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  aria-describedby={errors.originCountry ? 'origin-error' : undefined}
                  required
                />
                {errors.originCountry && (
                  <p id="origin-error" className="mt-1 text-xs text-red-600" role="alert">
                    {errors.originCountry}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="residenceCountry">
                  Pays de résidence *
                </label>
                <input
                  id="residenceCountry"
                  type="text"
                  value={data.identity.residenceCountry}
                  onChange={(event) => handleIdentityChange('residenceCountry', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  aria-describedby={errors.residenceCountry ? 'residence-error' : undefined}
                  required
                />
                {errors.residenceCountry && (
                  <p id="residence-error" className="mt-1 text-xs text-red-600" role="alert">
                    {errors.residenceCountry}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Étape 2 — Profil socio-démographique
              </h2>
              <p className="text-sm text-slate-600">Section optionnelle avec opt-in séparé.</p>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <input
                type="checkbox"
                checked={data.socioOptIn}
                onChange={(event) => setData((prev) => ({ ...prev, socioOptIn: event.target.checked }))}
                className="h-4 w-4"
              />
              Je consens à fournir ces données socio-démographiques.
            </label>

            {data.socioOptIn && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Tranche d’âge</label>
                  <select
                    value={data.socio.ageRange}
                    onChange={(event) => handleSocioChange('ageRange', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {ageRanges.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Situation familiale</label>
                  <select
                    value={data.socio.familyStatus}
                    onChange={(event) => handleSocioChange('familyStatus', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {familyStatuses.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Ancienneté dans le pays d’accueil
                  </label>
                  <select
                    value={data.socio.timeAbroad}
                    onChange={(event) => handleSocioChange('timeAbroad', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {timeAbroadOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Statut administratif</label>
                  <select
                    value={data.socio.adminStatus}
                    onChange={(event) => handleSocioChange('adminStatus', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {adminStatuses.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Étape 3 — Compétences & parcours</h2>
              <p className="text-sm text-slate-600">Section optionnelle avec opt-in séparé.</p>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <input
                type="checkbox"
                checked={data.skillsOptIn}
                onChange={(event) => setData((prev) => ({ ...prev, skillsOptIn: event.target.checked }))}
                className="h-4 w-4"
              />
              Je consens à fournir mes compétences et parcours.
            </label>

            {data.skillsOptIn && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Niveau d’études</label>
                  <select
                    value={data.skills.educationLevel}
                    onChange={(event) => handleSkillsChange('educationLevel', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {educationLevels.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Poste actuel</label>
                  <input
                    type="text"
                    value={data.skills.currentRole}
                    onChange={(event) => handleSkillsChange('currentRole', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Seniorité</label>
                  <select
                    value={data.skills.seniority}
                    onChange={(event) => handleSkillsChange('seniority', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {seniorityLevels.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Domaines d’expertise</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {expertiseDomains.map((domain) => (
                      <label key={domain} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.skills.expertiseDomains.includes(domain)}
                          onChange={() =>
                            handleSkillsChange(
                              'expertiseDomains',
                              toggleArrayValue(data.skills.expertiseDomains, domain)
                            )
                          }
                          className="h-4 w-4"
                        />
                        {domain}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Secteurs</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sectors.map((sector) => (
                      <label key={sector} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.skills.sectors.includes(sector)}
                          onChange={() =>
                            handleSkillsChange(
                              'sectors',
                              toggleArrayValue(data.skills.sectors, sector)
                            )
                          }
                          className="h-4 w-4"
                        />
                        {sector}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Langues</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <label key={language} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.skills.languages.includes(language)}
                          onChange={() =>
                            handleSkillsChange(
                              'languages',
                              toggleArrayValue(data.skills.languages, language)
                            )
                          }
                          className="h-4 w-4"
                        />
                        {language}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Étape 4 — Intention & engagement</h2>
              <p className="text-sm text-slate-600">Section optionnelle avec opt-in séparé.</p>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <input
                type="checkbox"
                checked={data.intentionOptIn}
                onChange={(event) =>
                  setData((prev) => ({ ...prev, intentionOptIn: event.target.checked }))
                }
                className="h-4 w-4"
              />
              Je consens à fournir mes intentions et engagements.
            </label>

            {data.intentionOptIn && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Souhaite contribuer via</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {contributionModes.map((mode) => (
                      <label key={mode} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.intention.contributionModes.includes(mode)}
                          onChange={() =>
                            handleIntentionChange(
                              'contributionModes',
                              toggleArrayValue(data.intention.contributionModes, mode)
                            )
                          }
                          className="h-4 w-4"
                        />
                        {mode}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Intérêt pour retour</label>
                  <select
                    value={data.intention.returnInterest}
                    onChange={(event) => handleIntentionChange('returnInterest', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {returnInterests.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Freins principaux</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {barriers.map((item) => (
                      <label key={item} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.intention.barriers.includes(item)}
                          onChange={() =>
                            handleIntentionChange(
                              'barriers',
                              toggleArrayValue(data.intention.barriers, item)
                            )
                          }
                          className="h-4 w-4"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Domaines prioritaires pour le pays
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {priorityDomains.map((item) => (
                      <label key={item} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.intention.priorityDomains.includes(item)}
                          onChange={() =>
                            handleIntentionChange(
                              'priorityDomains',
                              toggleArrayValue(data.intention.priorityDomains, item)
                            )
                          }
                          className="h-4 w-4"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Étape 5 — Capacités économiques
              </h2>
              <p className="text-sm text-slate-600">
                Données sensibles. Toujours en tranches, jamais en montant exact.
              </p>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <input
                type="checkbox"
                checked={data.economicOptIn}
                onChange={(event) =>
                  setData((prev) => ({ ...prev, economicOptIn: event.target.checked }))
                }
                className="h-4 w-4"
              />
              Je consens à fournir ces données économiques.
            </label>

            {data.economicOptIn && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Plage de capacité d’investissement
                  </label>
                  <select
                    value={data.economic.investmentCapacity}
                    onChange={(event) => handleEconomicChange('investmentCapacity', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {investmentCapacities.map((option) => (
                      <option key={option} value={option}>
                        {option} (tranche)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Intérêt pour obligations diaspora
                  </label>
                  <select
                    value={data.economic.diasporaBonds}
                    onChange={(event) => handleEconomicChange('diasporaBonds', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Intérêt entrepreneuriat
                  </label>
                  <select
                    value={data.economic.entrepreneurshipInterest}
                    onChange={(event) =>
                      handleEconomicChange('entrepreneurshipInterest', event.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Étape 6 — Consentements</h2>
              <p className="text-sm text-slate-600">
                Cette étape est obligatoire. Les cases ne sont jamais pré-cochées.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={data.consents.aggregatedStats}
                  onChange={(event) => updateConsents('aggregatedStats', event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  J’accepte l’utilisation de mes données sous forme agrégée et anonymisée pour des
                  statistiques.
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={data.consents.pseudonymizedAnalysis}
                  onChange={(event) => updateConsents('pseudonymizedAnalysis', event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  J’accepte l’utilisation de mes données sous forme pseudonymisée pour analyses avancées.
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={data.consents.contactOptIn}
                  onChange={(event) => updateConsents('contactOptIn', event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  J’accepte d’être contacté pour des opportunités (réseau, missions, investissement).
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={data.consents.partnerSharing}
                  onChange={(event) => updateConsents('partnerSharing', event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  J’accepte que mes données soient partagées avec des institutions partenaires (à
                  préciser) aux niveaux autorisés.
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={data.consents.readConsentPage}
                  onChange={(event) => updateConsents('readConsentPage', event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>J’ai lu la page Consentement.</span>
              </label>
              {errors.readConsentPage && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.readConsentPage}
                </p>
              )}
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={data.consents.readGdprPage}
                  onChange={(event) => updateConsents('readGdprPage', event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>J’ai lu la page GDPR.</span>
              </label>
              {errors.readGdprPage && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.readGdprPage}
                </p>
              )}
            </div>

            {errors.email && (
              <p className="text-xs text-red-600" role="alert">
                {errors.email}
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="consentVersion">
                  Version du texte
                </label>
                <input
                  id="consentVersion"
                  type="text"
                  value={data.consentMeta.version}
                  onChange={(event) => updateConsentMeta('version', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Preuve de consentement</label>
                <button
                  type="button"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
                  onClick={() => downloadJson(consentProof, 'preuve-consentement.json')}
                >
                  Télécharger ma preuve de consentement (JSON)
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Étape 7 — Review & Soumission</h2>
              <p className="text-sm text-slate-600">
                Vérifiez vos informations avant de soumettre.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>

            <button
              className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white"
              onClick={handleSubmit}
            >
              Soumettre
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={goBack}
          disabled={currentStep === 0}
        >
          Précédent
        </button>
        {currentStep < steps.length - 1 && (
          <button
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            onClick={goNext}
          >
            Suivant
          </button>
        )}
      </div>
    </section>
  );
};

export default FormWizard;
