import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NormalizedLead, AIOptions } from '../types/data.js';
import { generateMockEnrichment } from './mockData.js';

interface BatchEnrichmentItem {
  id: string;
  tier: 'Tier A' | 'Tier B' | 'Tier C';
  icebreaker: string;
  reasoning: string;
}

/**
 * Enriches leads using Google Gemini Flash API with structured JSON output,
 * with automatic batching to respect free tier rate limits (15 RPM).
 */
export async function enrichLeadsWithGemini(
  records: NormalizedLead[],
  options: AIOptions = {}
): Promise<{ enriched: NormalizedLead[]; usedFallback: boolean; warning?: string }> {
  const apiKey = options.userApiKey?.trim() || process.env.GEMINI_API_KEY?.trim();

  // If in demo mode or no API key, use deterministic mock
  if (options.useDemoMock || !apiKey) {
    return {
      enriched: records.map((rec) => {
        const mock = generateMockEnrichment(rec);
        return {
          ...rec,
          tier: mock.tier,
          icebreaker: mock.icebreaker,
          aiReasoning: mock.reasoning,
        };
      }),
      usedFallback: true,
      warning: options.useDemoMock
        ? 'Processed in Demo Mode (deterministic mock, zero API quota used).'
        : 'No Gemini API key provided. Processed in Demo Mode.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.0-flash or gemini-1.5-flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const BATCH_SIZE = 10;
    const enrichedResults = new Map<string, BatchEnrichmentItem>();

    // Process in batches to stay well within 15 RPM
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);

      const promptPayload = batch.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        title: r.title,
        company: r.company,
        website: r.website,
        notes: r.notes,
      }));

      const prompt = `You are an elite B2B sales development representative and business intelligence analyst.
Analyze the following batch of business leads. For each lead:
1. "tier": Classify into "Tier A" (Executive / Decision Maker: VP, C-Suite, Founder, Director), "Tier B" (Manager, Lead, Internal Champion), or "Tier C" (Individual Contributor or general inquiry).
2. "icebreaker": Craft a concise, high-converting, professional 1-sentence personalized outreach opening line referencing their role and company.
3. "reasoning": Provide a 1-sentence explanation of why they belong in this tier.

Input leads:
${JSON.stringify(promptPayload, null, 2)}

Return a strict JSON array of objects adhering to this schema:
[
  {
    "id": "string (matching input id)",
    "tier": "Tier A" | "Tier B" | "Tier C",
    "icebreaker": "string",
    "reasoning": "string"
  }
]`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const parsedItems: BatchEnrichmentItem[] = JSON.parse(text);

      for (const item of parsedItems) {
        if (item.id) {
          enrichedResults.set(item.id, item);
        }
      }
    }

    // Merge results with records
    const enriched = records.map((rec) => {
      const aiData = enrichedResults.get(rec.id);
      if (aiData) {
        return {
          ...rec,
          tier: aiData.tier,
          icebreaker: aiData.icebreaker,
          aiReasoning: aiData.reasoning,
        };
      }
      // If a specific record wasn't in AI response, fallback for that record
      const mock = generateMockEnrichment(rec);
      return {
        ...rec,
        tier: mock.tier,
        icebreaker: mock.icebreaker,
        aiReasoning: mock.reasoning,
      };
    });

    return { enriched, usedFallback: false };
  } catch (error: any) {
    console.warn('[Gemini Service] API call failed, falling back to mock:', error?.message || error);
    // Graceful fallback to deterministic mock
    const enriched = records.map((rec) => {
      const mock = generateMockEnrichment(rec);
      return {
        ...rec,
        tier: mock.tier,
        icebreaker: mock.icebreaker,
        aiReasoning: mock.reasoning,
      };
    });

    return {
      enriched,
      usedFallback: true,
      warning: `Gemini API call failed (${error?.message || 'Network error'}). Results generated via local fallback engine.`,
    };
  }
}

