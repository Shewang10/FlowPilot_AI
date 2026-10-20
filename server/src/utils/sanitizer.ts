/**
 * CSV Formula Injection Sanitizer and string normalization helpers.
 */

const FORMULA_CHARS = ['=', '@', '\t', '\r'];

/**
 * Checks whether a cell value is a potentially malicious spreadsheet formula (CWE-1236).
 * Distinguishes legitimate international phone numbers (e.g. "+1 (555) 019-2834") from formulas.
 */
export function isFormulaInjection(str: string): boolean {
  if (!str) return false;
  const first = str.charAt(0);

  // Dangerous triggers: '=', '@', tab, carriage return
  if (FORMULA_CHARS.includes(first)) {
    return true;
  }

  // '+' and '-' triggers: check if it's NOT a phone number or ordinary number
  if (first === '+' || first === '-') {
    // If it's a phone number like +1 (555) 019-2834 or +44 20 ..., it's safe text
    if (/^[\+\-]\d[\d\s\(\)\-\.]+$/.test(str)) {
      return false;
    }
    // If it's a plain integer or decimal like +100 or -42.5, it's safe numeric text
    if (/^[\+\-]\d+(\.\d+)?$/.test(str)) {
      return false;
    }
    // Otherwise it's something like +cmd, -2+3, etc.
    return true;
  }

  return false;
}

/**
 * Sanitizes a string to prevent CSV Formula Injection (CWE-1236).
 * Prepends a single quote only if the value is an actual formula trigger.
 */
export function sanitizeForCsv(value: string | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }
  const str = String(value).trim();
  if (str.length === 0) return '';

  if (isFormulaInjection(str)) {
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
