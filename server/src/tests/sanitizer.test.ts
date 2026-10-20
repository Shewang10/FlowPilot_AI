import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeForCsv, cleanText, extractDomain } from '../utils/sanitizer.js';

test('CSV Formula Injection Prevention', async (t) => {
  await t.test('neutralizes equals sign', () => {
    assert.equal(sanitizeForCsv('=SUM(A1:A10)'), "'=SUM(A1:A10)");
  });

  await t.test('neutralizes plus sign', () => {
    assert.equal(sanitizeForCsv('+1+1'), "'+1+1");
  });

  await t.test('neutralizes minus sign', () => {
    assert.equal(sanitizeForCsv('-cmd|"/C calc"!A0'), "'-cmd|\"/C calc\"!A0");
  });

  await t.test('neutralizes at sign', () => {
    assert.equal(sanitizeForCsv('@SUM'), "'@SUM");
  });

  await t.test('leaves benign text unmodified', () => {
    assert.equal(sanitizeForCsv('John Doe'), 'John Doe');
    assert.equal(sanitizeForCsv('john.doe@acme.com'), 'john.doe@acme.com');
  });

  await t.test('handles empty and null values gracefully', () => {
    assert.equal(sanitizeForCsv(''), '');
    assert.equal(sanitizeForCsv(null), '');
    assert.equal(sanitizeForCsv(undefined), '');
  });
});

test('cleanText utility', async (t) => {
  await t.test('removes control chars and extra spaces', () => {
    assert.equal(cleanText('  Hello \t\n world   '), 'Hello world');
  });
});

test('extractDomain utility', async (t) => {
  await t.test('extracts clean domain from full URLs', () => {
    assert.equal(extractDomain('https://www.acmecorp.com/about/team?ref=1'), 'acmecorp.com');
    assert.equal(extractDomain('http://globallogistics.io/'), 'globallogistics.io');
    assert.equal(extractDomain('acmecorp.com'), 'acmecorp.com');
  });

  await t.test('extracts domain from email addresses', () => {
    assert.equal(extractDomain('sarah.smith@globallogistics.io'), 'globallogistics.io');
  });
});

