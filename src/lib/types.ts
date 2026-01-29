export interface IdentityData {
  pseudonym: string;
  firstName: string;
  lastName: string;
  email: string;
  originCountry: string;
  residenceCountry: string;
  city: string;
}

export interface SocioData {
  ageRange: string;
  familyStatus: string;
  timeAbroad: string;
  adminStatus: string;
}

export interface SkillsData {
  educationLevel: string;
  expertiseDomains: string[];
  currentRole: string;
  sectors: string[];
  seniority: string;
  languages: string[];
}

export interface IntentionData {
  contributionModes: string[];
  returnInterest: string;
  barriers: string[];
  priorityDomains: string[];
}

export interface EconomicData {
  investmentCapacity: string;
  diasporaBonds: string;
  entrepreneurshipInterest: string;
}

export interface ConsentFlags {
  aggregatedStats: boolean;
  pseudonymizedAnalysis: boolean;
  contactOptIn: boolean;
  partnerSharing: boolean;
  readConsentPage: boolean;
  readGdprPage: boolean;
}

export interface ConsentMeta {
  timestamp: string;
  version: string;
  locale: string;
}

export interface FormData {
  respondentId: string;
  identityOptIn: boolean;
  socioOptIn: boolean;
  skillsOptIn: boolean;
  intentionOptIn: boolean;
  economicOptIn: boolean;
  identity: IdentityData;
  socio: SocioData;
  skills: SkillsData;
  intention: IntentionData;
  economic: EconomicData;
  consents: ConsentFlags;
  consentMeta: ConsentMeta;
  submittedAt?: string;
}

export interface Step {
  id: string;
  label: string;
}
