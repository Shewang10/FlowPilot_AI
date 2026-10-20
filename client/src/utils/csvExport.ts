import type { NormalizedLead } from '../types/data.ts';

const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Sanitizes a string to prevent CSV Formula Injection (CWE-1236).
 */
export function sanitizeForCsv(val: unknown): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (str.length === 0) return '';

  if (FORMULA_TRIGGERS.includes(str.charAt(0))) {
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
    'Notes',
    'Cleaned Fields'
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
    escapeCsvCell(lead.notes),
    escapeCsvCell(lead.cleanedFields.join('; '))
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
