/**
 * CSV Formula Injection Sanitizer and string normalization helpers.
 */

const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Sanitizes a string to prevent CSV Formula Injection (CWE-1236).
 * Prepend a single quote if the value begins with a formula trigger.
 */
export function sanitizeForCsv(value: string | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }
  const str = String(value).trim();
  if (str.length === 0) return '';

  const firstChar = str.charAt(0);
  if (FORMULA_TRIGGERS.includes(firstChar)) {
    // Neutralize formula trigger
    return `'${str}`;
  }
  return str;
}

/**
 * Strips whitespace, null characters, and collapses multiple spaces.
 */
export function cleanText(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value)
    .replace(/\0/g, '') // remove null bytes
    .replace(/[\r\n\t]+/g, ' ') // collapse newlines/tabs
    .replace(/\s+/g, ' ') // collapse multi-spaces
    .trim();
}

/**
 * Extracts a normalized root/subdomain from either a URL or an email address.
 * E.g.:
 * - "https://www.AcmeCorp.com/team" -> "acmecorp.com"
 * - "john@sub.domain.co.uk" -> "sub.domain.co.uk"
 * - "http://globallogistics.io/" -> "globallogistics.io"
 */
export function extractDomain(input: string): string {
  if (!input) return '';
  let cleaned = cleanText(input).toLowerCase();

  // If it's an email address, extract after @
  if (cleaned.includes('@')) {
    const parts = cleaned.split('@');
    cleaned = parts[parts.length - 1];
  }

  // Remove protocols
  cleaned = cleaned.replace(/^https?:\/\//i, '');

  // Remove www.
  cleaned = cleaned.replace(/^www\./i, '');

  // Remove trailing slashes and paths
  const slashIndex = cleaned.indexOf('/');
  if (slashIndex !== -1) {
    cleaned = cleaned.substring(0, slashIndex);
  }

  // Remove port if present
  const colonIndex = cleaned.indexOf(':');
  if (colonIndex !== -1) {
    cleaned = cleaned.substring(0, colonIndex);
  }

  return cleaned.trim();
}

