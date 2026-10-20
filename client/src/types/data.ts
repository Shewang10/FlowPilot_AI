export interface RawLead {
  [key: string]: string | undefined;
}

export interface NormalizedLead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  notes: string;
  isDuplicate?: boolean;
  duplicateOfId?: string;
  duplicateReason?: string;
  cleanedFields: string[];
  tier?: 'Tier A' | 'Tier B' | 'Tier C';
  icebreaker?: string;
  aiReasoning?: string;
  raw: RawLead;
}

export interface CleaningOptions {
  normalizeNames: boolean;
  normalizeEmails: boolean;
  normalizePhones: boolean;
  normalizeWebsites: boolean;
  deduplicate: boolean;
  dedupeStrategy: 'email' | 'domain' | 'email_or_domain';
}

export interface AIOptions {
  generateIcebreaker: boolean;
  classifyTier: boolean;
  useDemoMock: boolean;
  userApiKey?: string;
}

export interface ProcessSummary {
  totalInputRows: number;
  validRows: number;
  cleanedCount: number;
  duplicatesFound: number;
  uniqueRowsRemaining: number;
  enrichedCount: number;
  durationMs: number;
}

export interface ProcessResponse {
  success: boolean;
  records: NormalizedLead[];
  duplicates: NormalizedLead[];
  summary: ProcessSummary;
  errors?: string[];
}

