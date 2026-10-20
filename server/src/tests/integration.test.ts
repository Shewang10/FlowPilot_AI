import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanLeadBatch } from '../services/cleaner.js';
import { deduplicateLeads } from '../services/deduplicator.js';
import { generateMockEnrichment } from '../services/mockData.js';
import { sanitizeForCsv } from '../utils/sanitizer.js';
import type { RawLead } from '../types/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sampleDataDir = path.resolve(__dirname, '../../../sample-data');

function parseSimpleCsv(content: string): RawLead[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0]!.split(',').map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const fields: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    fields.push(cur.trim());

    const record: RawLead = {};
    headers.forEach((h, idx) => {
      let val = fields[idx] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      record[h] = val;
    });
    return record;
  });
}

test('End-to-End Pipeline on Sample Messy Leads CSV', async (t) => {
  const filePath = path.join(sampleDataDir, 'sample_messy_leads.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const rawData = parseSimpleCsv(fileContent);

  assert.equal(rawData.length, 11, 'Should parse 11 rows from sample leads CSV');

  await t.test('Step 1: Normalization', () => {
    const cleaned = cleanLeadBatch(rawData);
    assert.equal(cleaned.length, 11);

    // Verify JOHN DOE became John Doe
    assert.equal(cleaned[0]?.fullName, 'John Doe');
    // Verify phone normalized
    assert.equal(cleaned[0]?.phone, '+1 (555) 019-2834');
    // Verify website normalized
    assert.equal(cleaned[0]?.website, 'https://acmecorp.com');
  });

  await t.test('Step 2: Deduplication across email and company domain', () => {
    const cleaned = cleanLeadBatch(rawData);
    const dedupe = deduplicateLeads(cleaned, { dedupeStrategy: 'email_or_domain' });

    assert.equal(dedupe.duplicates.length, 3, 'Should detect exactly 3 duplicate leads');
    assert.equal(dedupe.uniqueRecords.length, 8, 'Should preserve 8 unique leads');
  });

  await t.test('Step 3: Formula Injection Protection on Malicious Row', () => {
    const maliciousRow = rawData.find((r) => r['First Name']?.startsWith('='));
    assert.ok(maliciousRow, 'Malicious formula row should exist in sample data');

    const sanitized = sanitizeForCsv(maliciousRow['First Name']);
    assert.equal(sanitized, "'=1+1", 'Must prefix formula with single quote');
  });

  await t.test('Step 4: AI Enrichment Generation', () => {
    const cleaned = cleanLeadBatch(rawData);
    const dedupe = deduplicateLeads(cleaned, { dedupeStrategy: 'email_or_domain' });
    const enriched = dedupe.uniqueRecords.map((r) => ({
      ...r,
      ...generateMockEnrichment(r),
    }));

    // VP of Sales should be Tier A
    const vpLead = enriched.find((r) => r.title.includes('Vice President'));
    assert.equal(vpLead?.tier, 'Tier A');
    assert.ok(vpLead?.icebreaker.includes('pipeline outbound'));
  });
});

test('Resilience on Malformed CSV File', async () => {
  const malformedPath = path.join(sampleDataDir, 'malformed_test.csv');
  const malformedContent = fs.readFileSync(malformedPath, 'utf-8');
  const rawData = parseSimpleCsv(malformedContent);

  const cleaned = cleanLeadBatch(rawData);
  assert.ok(Array.isArray(cleaned), 'Cleaner must return array without crashing');
  assert.ok(cleaned.length > 0, 'Should extract salvageable rows');
});

