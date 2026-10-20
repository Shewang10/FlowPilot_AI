import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toTitleCase,
  normalizeEmail,
  isValidEmail,
  normalizePhone,
  normalizeWebsite,
  normalizeLeadRecord
} from '../services/cleaner.js';

test('Text and casing normalization', async (t) => {
  await t.test('converts ALL CAPS and lowercase to clean Title Case', () => {
    assert.equal(toTitleCase('JOHN DOE'), 'John Doe');
    assert.equal(toTitleCase('sarah smith'), 'Sarah Smith');
    assert.equal(toTitleCase('o\'connor'), "O'Connor");
    assert.equal(toTitleCase('smith-jones'), 'Smith-Jones');
  });
});

test('Email normalization and validation', async (t) => {
  await t.test('lowercases and trims email', () => {
    assert.equal(normalizeEmail('  JOHN.DOE@AcmeCorp.COM  '), 'john.doe@acmecorp.com');
  });

  await t.test('validates standard email formats', () => {
    assert.equal(isValidEmail('john@acmecorp.com'), true);
    assert.equal(isValidEmail('invalid-email'), false);
    assert.equal(isValidEmail(''), false);
  });
});

test('Phone normalization', async (t) => {
  await t.test('normalizes 10-digit North American numbers', () => {
    assert.equal(normalizePhone('5550192834'), '+1 (555) 019-2834');
    assert.equal(normalizePhone('555-019-2834'), '+1 (555) 019-2834');
    assert.equal(normalizePhone('(555) 019-2834'), '+1 (555) 019-2834');
    assert.equal(normalizePhone('555.019.2834'), '+1 (555) 019-2834');
  });

  await t.test('normalizes 11-digit numbers with country code', () => {
    assert.equal(normalizePhone('15550192834'), '+1 (555) 019-2834');
    assert.equal(normalizePhone('+1 555 019 2834'), '+1 (555) 019-2834');
  });
});

test('Website normalization', async (t) => {
  await t.test('normalizes varied URL formats into canonical https', () => {
    assert.equal(normalizeWebsite('http://globallogistics.io/'), 'https://globallogistics.io');
    assert.equal(normalizeWebsite('www.acmecorp.com'), 'https://acmecorp.com');
    assert.equal(normalizeWebsite('https://apexcloud.co/contact'), 'https://apexcloud.co');
  });
});

test('Lead record auto-mapping and normalization', async (t) => {
  await t.test('maps messy aliases and records cleaned fields', () => {
    const raw = {
      'First Name': 'ALEX',
      'last_name': 'JOHNSON',
      'Company Name': 'apex cloud solutions',
      'Job Title': 'head of engineering',
      'Work Email': 'ALEX.J@APEXCLOUD.CO',
      'Telephone': '5550197711',
      'URL': 'http://apexcloud.co/'
    };

    const normalized = normalizeLeadRecord(raw, 0);

    assert.equal(normalized.firstName, 'Alex');
    assert.equal(normalized.lastName, 'Johnson');
    assert.equal(normalized.company, 'Apex Cloud Solutions');
    assert.equal(normalized.title, 'Head Of Engineering');
    assert.equal(normalized.email, 'alex.j@apexcloud.co');
    assert.equal(normalized.phone, '+1 (555) 019-7711');
    assert.equal(normalized.website, 'https://apexcloud.co');
    assert.ok(normalized.cleanedFields.includes('firstName'));
    assert.ok(normalized.cleanedFields.includes('email'));
    assert.ok(normalized.cleanedFields.includes('phone'));
  });
});

