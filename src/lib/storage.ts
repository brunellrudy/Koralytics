import { FormData } from './types';

const STORAGE_KEY = 'diaspora-intel-form';

export const createRespondentId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Math.random().toString(16).slice(2)}-${Date.now()}`;
};

export const getDefaultFormData = (): FormData => ({
  respondentId: createRespondentId(),
  identityOptIn: false,
  socioOptIn: false,
  skillsOptIn: false,
  intentionOptIn: false,
  economicOptIn: false,
  identity: {
    pseudonym: '',
    firstName: '',
    lastName: '',
    email: '',
    originCountry: '',
    residenceCountry: '',
    city: ''
  },
  socio: {
    ageRange: '',
    familyStatus: '',
    timeAbroad: '',
    adminStatus: ''
  },
  skills: {
    educationLevel: '',
    expertiseDomains: [],
    currentRole: '',
    sectors: [],
    seniority: '',
    languages: []
  },
  intention: {
    contributionModes: [],
    returnInterest: '',
    barriers: [],
    priorityDomains: []
  },
  economic: {
    investmentCapacity: '',
    diasporaBonds: '',
    entrepreneurshipInterest: ''
  },
  consents: {
    aggregatedStats: false,
    pseudonymizedAnalysis: false,
    contactOptIn: false,
    partnerSharing: false,
    readConsentPage: false,
    readGdprPage: false
  },
  consentMeta: {
    timestamp: '',
    version: 'CONSENT_V1.0',
    locale: 'fr-FR'
  }
});

export const loadFormData = (): FormData | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FormData;
  } catch (error) {
    console.error('Impossible de charger les données locales.', error);
    return null;
  }
};

export const saveFormData = (data: FormData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearFormData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const downloadJson = (payload: unknown, filename: string) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export { STORAGE_KEY };
