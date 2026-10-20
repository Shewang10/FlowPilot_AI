import { cleanText, extractDomain } from '../utils/sanitizer.js';
import type { RawLead, NormalizedLead, CleaningOptions } from '../types/data.js';

/**
 * Capitalizes a word respecting hyphens and apostrophes (e.g., "o'connor", "smith-jones").
 */
export function toTitleCase(input: string): string {
  if (!input) return '';
  const trimmed = cleanText(input).toLowerCase();

  return trimmed.replace(/(?:^|[\s\-\'\"])\S/g, (char) => char.toUpperCase());
}

/**
 * Normalizes email address to lowercase and trimmed.
 */
export function normalizeEmail(input: string): string {
  if (!input) return '';
  return cleanText(input).toLowerCase();
}

/**
 * Validates whether an email has a plausible format.
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Normalizes phone numbers.
 * Cleans punctuation, handles 10-digit North American numbers to +1 (XXX) XXX-XXXX,
 * or preserves international E.164-like formatting.
 */
export function normalizePhone(input: string): string {
  if (!input) return '';
  const cleaned = cleanText(input);
  if (!cleaned) return '';

  // Extract digits and leading +
  const hasPlus = cleaned.startsWith('+');
  const digits = cleaned.replace(/\D/g, '');

  if (digits.length === 10) {
    // Standard US/Canada 10-digit
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // US 11-digit with country code
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else if (digits.length > 6) {
    // International standard fallback
    return hasPlus ? `+${digits}` : digits;
  }

  return cleaned;
}

/**
 * Normalizes website URLs (e.g., "http://globallogistics.io/" -> "https://globallogistics.io").
 */
export function normalizeWebsite(input: string): string {
  if (!input) return '';
  const cleaned = cleanText(input);
  if (!cleaned) return '';

  const domain = extractDomain(cleaned);
  if (!domain) return cleaned;

  return `https://${domain}`;
}

/**
 * Finds the value for a target concept from a raw dictionary with varied column naming.
 */
function findColumnValue(row: RawLead, aliases: string[]): string {
  const keys = Object.keys(row);
  for (const alias of aliases) {
    const matchedKey = keys.find(
      (k) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === alias.toLowerCase().replace(/[^a-z0-9]/g, '')
    );
    if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
      const val = cleanText(row[matchedKey]);
      if (val.length > 0) return val;
    }
  }
  return '';
}

/**
 * Normalizes a single raw record based on provided cleaning options.
 */
export function normalizeLeadRecord(
  raw: RawLead,
  index: number,
  options: CleaningOptions = {}
): NormalizedLead {
  const id = `lead_${index + 1}_${Date.now().toString(36)}`;
  const cleanedFields: string[] = [];

  // Extract raw values using common aliases
  const rawFirstName = findColumnValue(raw, ['firstname', 'first_name', 'fname', 'first', 'givenname']);
  const rawLastName = findColumnValue(raw, ['lastname', 'last_name', 'lname', 'last', 'surname', 'familyname']);
  const rawFullName = findColumnValue(raw, ['name', 'fullname', 'full_name', 'leadname', 'contact', 'contactname']);
  const rawCompany = findColumnValue(raw, ['company', 'companyname', 'organization', 'account', 'business', 'org']);
  const rawTitle = findColumnValue(raw, ['title', 'jobtitle', 'job_title', 'role', 'position', 'occupation']);
  const rawEmail = findColumnValue(raw, ['email', 'emailaddress', 'email_address', 'workemail', 'corporateemail', 'mail']);
  const rawPhone = findColumnValue(raw, ['phone', 'phonenumber', 'phone_number', 'mobile', 'tel', 'telephone', 'cell', 'cellular']);
  const rawWebsite = findColumnValue(raw, ['website', 'url', 'web', 'companywebsite', 'domain', 'site']);
  const rawNotes = findColumnValue(raw, ['notes', 'note', 'description', 'comments', 'about', 'summary']);

  // Handle Name Parsing
  let firstName = rawFirstName;
  let lastName = rawLastName;
  if (!firstName && !lastName && rawFullName) {
    const parts = rawFullName.split(' ');
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }

  if (options.normalizeNames !== false) {
    const newFirst = toTitleCase(firstName);
    const newLast = toTitleCase(lastName);
    if (newFirst !== firstName) cleanedFields.push('firstName');
    if (newLast !== lastName) cleanedFields.push('lastName');
    firstName = newFirst;
    lastName = newLast;
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || rawFullName;

  // Company and Title normalization
  let company = rawCompany;
  let title = rawTitle;
  if (options.normalizeNames !== false) {
    if (company) {
      const newCompany = toTitleCase(company);
      if (newCompany !== company) cleanedFields.push('company');
      company = newCompany;
    }
    if (title) {
      const newTitle = toTitleCase(title);
      if (newTitle !== title) cleanedFields.push('title');
      title = newTitle;
    }
  }

  // Email normalization
  let email = rawEmail;
  if (options.normalizeEmails !== false && email) {
    const newEmail = normalizeEmail(email);
    if (newEmail !== email) cleanedFields.push('email');
    email = newEmail;
  }

  // Phone normalization
  let phone = rawPhone;
  if (options.normalizePhones !== false && phone) {
    const newPhone = normalizePhone(phone);
    if (newPhone !== phone) cleanedFields.push('phone');
    phone = newPhone;
  }

  // Website normalization
  let website = rawWebsite;
  if (options.normalizeWebsites !== false && website) {
    const newWebsite = normalizeWebsite(website);
    if (newWebsite !== website) cleanedFields.push('website');
    website = newWebsite;
  }

  return {
    id,
    firstName,
    lastName,
    fullName,
    company,
    title,
    email,
    phone,
    website,
    notes: rawNotes,
    cleanedFields,
    raw,
  };
}

/**
 * Batch clean and normalize a list of raw records.
 */
export function cleanLeadBatch(
  rawRecords: RawLead[],
  options: CleaningOptions = {}
): NormalizedLead[] {
  return rawRecords.map((record, index) => normalizeLeadRecord(record, index, options));
}
