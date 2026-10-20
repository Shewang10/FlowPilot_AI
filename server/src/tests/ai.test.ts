import test from 'node:test';
import assert from 'node:assert/strict';
import { generateMockEnrichment } from '../services/mockData.js';
import { cleanLeadBatch } from '../services/cleaner.js';
import { enrichLeadsWithGemini } from '../services/gemini.js';

test('AI Mock Enrichment Engine', async (t) => {
  await t.test('classifies VP / Executive roles as Tier A', () => {
    const raw = {
      'First Name': 'Jane',
      'Last Name': 'Doe',
      'Title': 'Vice President of Sales',
      'Company': 'Acme Corp'
    };
    const lead = cleanLeadBatch([raw])[0]!;
    const result = generateMockEnrichment(lead);

    assert.equal(result.tier, 'Tier A');
    assert.ok(result.reasoning.includes('Tier A'));
    assert.ok(result.icebreaker.includes('Jane'));
    assert.ok(result.icebreaker.includes('Acme Corp'));
  });

  await t.test('classifies Manager / Lead roles as Tier B', () => {
    const raw = {
      'First Name': 'Mark',
      'Last Name': 'Evans',
      'Title': 'Operations Manager',
      'Company': 'Logistics Hub'
    };
    const lead = cleanLeadBatch([raw])[0]!;
    const result = generateMockEnrichment(lead);

    assert.equal(result.tier, 'Tier B');
    assert.ok(result.icebreaker.includes('Logistics Hub'));
  });

  await t.test('classifies generic roles as Tier C', () => {
    const raw = {
      'First Name': 'Sam',
      'Last Name': 'Taylor',
      'Title': 'Intern',
      'Company': 'Startup Labs'
    };
    const lead = cleanLeadBatch([raw])[0]!;
    const result = generateMockEnrichment(lead);

    assert.equal(result.tier, 'Tier C');
  });

  await t.test('enrichLeadsWithGemini works deterministically in demo mode without key', async () => {
    const raw = [
      { 'First Name': 'Alex', 'Title': 'CTO', 'Company': 'Cloud Corp', 'Email': 'alex@cloud.com' }
    ];
    const leads = cleanLeadBatch(raw);
    const result = await enrichLeadsWithGemini(leads, { useDemoMock: true });

    assert.equal(result.usedFallback, true);
    assert.equal(result.enriched.length, 1);
    assert.equal(result.enriched[0]?.tier, 'Tier A');
    assert.ok(result.enriched[0]?.icebreaker?.length! > 10);
  });
});
