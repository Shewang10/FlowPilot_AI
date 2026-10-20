import { extractDomain } from '../utils/sanitizer.js';
import type { NormalizedLead, CleaningOptions } from '../types/data.js';

export interface DeduplicationResult {
  uniqueRecords: NormalizedLead[];
  duplicates: NormalizedLead[];
  duplicateCount: number;
}

/**
 * Deduplicates a list of normalized leads using configurable strategy.
 */
export function deduplicateLeads(
  records: NormalizedLead[],
  options: CleaningOptions = {}
): DeduplicationResult {
  if (options.deduplicate === false) {
    return {
      uniqueRecords: records,
      duplicates: [],
      duplicateCount: 0,
    };
  }

  const strategy = options.dedupeStrategy || 'email_or_domain';
  const seenEmails = new Map<string, NormalizedLead>();
  const seenDomains = new Map<string, NormalizedLead>();

  const uniqueRecords: NormalizedLead[] = [];
  const duplicates: NormalizedLead[] = [];

  for (const record of records) {
    let isDupe = false;
    let reason = '';
    let duplicateOf: NormalizedLead | undefined;

    const emailKey = record.email.toLowerCase().trim();
    const websiteDomain = extractDomain(record.website);
    const emailDomain = extractDomain(record.email);
    const domainKey = websiteDomain || emailDomain;

    // Check Email Match
    if ((strategy === 'email' || strategy === 'email_or_domain') && emailKey.length > 0) {
      if (seenEmails.has(emailKey)) {
        isDupe = true;
        duplicateOf = seenEmails.get(emailKey);
        reason = `Duplicate email match with ${duplicateOf?.fullName || duplicateOf?.id} (${emailKey})`;
      }
    }

    // Check Domain Match if not already flagged as duplicate
    if (!isDupe && (strategy === 'domain' || strategy === 'email_or_domain') && domainKey.length > 0) {
      // Don't dedupe generic email providers (gmail, yahoo, outlook, hotmail, icloud)
      const isGenericProvider = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'].includes(domainKey);
      if (!isGenericProvider && seenDomains.has(domainKey)) {
        isDupe = true;
        duplicateOf = seenDomains.get(domainKey);
        reason = `Same company domain (${domainKey}) as ${duplicateOf?.fullName || duplicateOf?.company || duplicateOf?.id}`;
      }
    }

    if (isDupe && duplicateOf) {
      const dupeRecord: NormalizedLead = {
        ...record,
        isDuplicate: true,
        duplicateOfId: duplicateOf.id,
        duplicateReason: reason,
      };
      duplicates.push(dupeRecord);
    } else {
      // Mark as primary
      uniqueRecords.push(record);
      if (emailKey.length > 0) {
        seenEmails.set(emailKey, record);
      }
      if (domainKey.length > 0) {
        seenDomains.set(domainKey, record);
      }
    }
  }

  return {
    uniqueRecords,
    duplicates,
    duplicateCount: duplicates.length,
  };
}
