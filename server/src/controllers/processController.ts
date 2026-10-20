import type { Request, Response } from 'express';
import { cleanLeadBatch } from '../services/cleaner.js';
import { deduplicateLeads } from '../services/deduplicator.js';
import { enrichLeadsWithGemini } from '../services/gemini.js';
import type { ProcessRequest, ProcessResponse, ProcessSummary } from '../types/data.js';

const MAX_ROWS = 25000;

export async function handleProcessLeads(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  const body = req.body as ProcessRequest;

  if (!body || !Array.isArray(body.records)) {
    res.status(400).json({
      success: false,
      records: [],
      duplicates: [],
      summary: {
        totalInputRows: 0,
        validRows: 0,
        cleanedCount: 0,
        duplicatesFound: 0,
        uniqueRowsRemaining: 0,
        enrichedCount: 0,
        durationMs: 0,
      },
      errors: ['Invalid request format. Expected an array of records.'],
    });
    return;
  }

  const { records, cleaningOptions = {}, aiOptions = {} } = body;

  if (records.length === 0) {
    res.json({
      success: true,
      records: [],
      duplicates: [],
      summary: {
        totalInputRows: 0,
        validRows: 0,
        cleanedCount: 0,
        duplicatesFound: 0,
        uniqueRowsRemaining: 0,
        enrichedCount: 0,
        durationMs: Date.now() - startTime,
      },
    });
    return;
  }

  if (records.length > MAX_ROWS) {
    res.status(400).json({
      success: false,
      records: [],
      duplicates: [],
      summary: {
        totalInputRows: records.length,
        validRows: 0,
        cleanedCount: 0,
        duplicatesFound: 0,
        uniqueRowsRemaining: 0,
        enrichedCount: 0,
        durationMs: Date.now() - startTime,
      },
      errors: [`Dataset exceeds maximum limit of ${MAX_ROWS} rows for free-tier local processing.`],
    });
    return;
  }

  try {
    // 1. Deterministic Cleaning & Normalization
    const cleanedRecords = cleanLeadBatch(records, cleaningOptions);
    const cleanedCount = cleanedRecords.filter((r) => r.cleanedFields.length > 0).length;

    // 2. Deduplication
    const dedupeResult = deduplicateLeads(cleanedRecords, cleaningOptions);
    let finalRecords = dedupeResult.uniqueRecords;

    // 3. AI Enrichment (if requested)
    let enrichedCount = 0;
    const warnings: string[] = [];

    if (aiOptions.generateIcebreaker || aiOptions.classifyTier) {
      const enrichment = await enrichLeadsWithGemini(finalRecords, aiOptions);
      finalRecords = enrichment.enriched;
      enrichedCount = finalRecords.length;
      if (enrichment.warning) {
        warnings.push(enrichment.warning);
      }
    }

    const durationMs = Date.now() - startTime;

    const summary: ProcessSummary = {
      totalInputRows: records.length,
      validRows: cleanedRecords.length,
      cleanedCount,
      duplicatesFound: dedupeResult.duplicateCount,
      uniqueRowsRemaining: finalRecords.length,
      enrichedCount,
      durationMs,
    };

    const responsePayload: ProcessResponse = {
      success: true,
      records: finalRecords,
      duplicates: dedupeResult.duplicates,
      summary,
      errors: warnings.length > 0 ? warnings : undefined,
    };

    res.json(responsePayload);
  } catch (error: any) {
    console.error('[Process Controller] Processing error:', error);
    res.status(500).json({
      success: false,
      records: [],
      duplicates: [],
      summary: {
        totalInputRows: records.length,
        validRows: 0,
        cleanedCount: 0,
        duplicatesFound: 0,
        uniqueRowsRemaining: 0,
        enrichedCount: 0,
        durationMs: Date.now() - startTime,
      },
      errors: [error?.message || 'An unexpected error occurred during data processing.'],
    });
  }
}
