import type { NormalizedLead } from '../types/data.ts';

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
 */
export function sanitizeForCsv(val: unknown): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (str.length === 0) return '';

  if (isFormulaInjection(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Escapes an individual CSV cell value according to RFC 4180.
 */
function escapeCsvCell(val: unknown): string {
  const safeVal = sanitizeForCsv(val);
  // If the cell contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
  if (safeVal.includes('"') || safeVal.includes(',') || safeVal.includes('\n') || safeVal.includes('\r')) {
    return `"${safeVal.replace(/"/g, '""')}"`;
  }
  return safeVal;
}

/**
 * Converts NormalizedLead array to a safe CSV formatted string and triggers browser download.
 */
export function exportLeadsToCsv(records: NormalizedLead[], filename = 'flowpilot_cleaned_leads.csv'): void {
  if (records.length === 0) return;

  const headers = [
    'First Name',
    'Last Name',
    'Full Name',
    'Company',
    'Title',
    'Email',
    'Phone',
    'Website',
    'Tier',
    'AI Icebreaker',
    'Notes'
  ];

  const rows = records.map((lead) => [
    escapeCsvCell(lead.firstName),
    escapeCsvCell(lead.lastName),
    escapeCsvCell(lead.fullName),
    escapeCsvCell(lead.company),
    escapeCsvCell(lead.title),
    escapeCsvCell(lead.email),
    escapeCsvCell(lead.phone),
    escapeCsvCell(lead.website),
    escapeCsvCell(lead.tier || 'Unassigned'),
    escapeCsvCell(lead.icebreaker || ''),
    escapeCsvCell(lead.notes)
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  // Create downloadable Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
