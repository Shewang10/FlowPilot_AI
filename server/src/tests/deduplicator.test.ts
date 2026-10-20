import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanLeadBatch } from '../services/cleaner.js';
import { deduplicateLeads } from '../services/deduplicator.js';

test('Lead Deduplication Engine', async (t) => {
  const sampleLeads = [
    {
      'First Name': 'John',
      'Last Name': 'Doe',
      'Company': 'Acme Corp',
      'Email': 'john.doe@acmecorp.com',
      'Website': 'https://acmecorp.com'
    },
    {
      'First Name': 'JOHN',
      'Last Name': 'DOE',
      'Company': 'Acme Corporation',
      'Email': 'john.doe@acmecorp.com',
      'Website': 'acmecorp.com'
    },
    {
      'First Name': 'Sarah',
      'Last Name': 'Smith',
      'Company': 'Global Logistics',
      'Email': 'sarah@globallogistics.io',
      'Website': 'globallogistics.io'
    },
    {
      'First Name': 'Emily',
      'Last Name': 'Watson',
      'Company': 'Acme Corp',
      'Email': 'emily@acmecorp.com',
      'Website': 'acmecorp.com'
    }
  ];

  await t.test('deduplicates exact email matches', () => {
    const cleaned = cleanLeadBatch(sampleLeads);
    const result = deduplicateLeads(cleaned, { dedupeStrategy: 'email' });

    assert.equal(result.uniqueRecords.length, 3);
    assert.equal(result.duplicates.length, 1);
    assert.equal(result.duplicates[0]?.email, 'john.doe@acmecorp.com');
  });

  await t.test('deduplicates same company domain matches', () => {
    const cleaned = cleanLeadBatch(sampleLeads);
    const result = deduplicateLeads(cleaned, { dedupeStrategy: 'email_or_domain' });

    // John Doe #1 (kept), John Doe #2 (dupe email), Emily Watson (dupe domain acmecorp.com), Sarah (kept)
    assert.equal(result.uniqueRecords.length, 2);
    assert.equal(result.duplicates.length, 2);
  });

  await t.test('preserves generic email providers like gmail', () => {
    const gmailLeads = [
      { 'First Name': 'Alice', 'Company': 'Freelance', 'Email': 'alice@gmail.com' },
      { 'First Name': 'Bob', 'Company': 'Consulting', 'Email': 'bob@gmail.com' }
    ];

    const cleaned = cleanLeadBatch(gmailLeads);
    const result = deduplicateLeads(cleaned, { dedupeStrategy: 'email_or_domain' });

    assert.equal(result.uniqueRecords.length, 2);
    assert.equal(result.duplicates.length, 0);
  });
});

