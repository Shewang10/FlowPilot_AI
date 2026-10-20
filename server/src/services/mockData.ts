import type { NormalizedLead } from '../types/data.js';

export interface AIEnrichmentResult {
  tier: 'Tier A' | 'Tier B' | 'Tier C';
  icebreaker: string;
  reasoning: string;
}

/**
 * Deterministically generates realistic ICP tiers and tailored cold outreach icebreakers
 * without requiring any internet connection or API keys.
 */
export function generateMockEnrichment(lead: NormalizedLead): AIEnrichmentResult {
  const titleLower = (lead.title || '').toLowerCase();
  const company = lead.company || 'your team';
  const firstName = lead.firstName || 'there';

  // Deterministic Tier Assignment
  let tier: 'Tier A' | 'Tier B' | 'Tier C' = 'Tier C';
  let reasoning = 'Standard prospect profile.';

  const isTierA =
    titleLower.includes('ceo') ||
    titleLower.includes('cto') ||
    titleLower.includes('cfo') ||
    titleLower.includes('cmo') ||
    titleLower.includes('coo') ||
    titleLower.includes('cro') ||
    titleLower.includes('cio') ||
    titleLower.includes('founder') ||
    titleLower.includes('president') ||
    titleLower.includes('vp') ||
    titleLower.includes('vice president') ||
    titleLower.includes('chief') ||
    titleLower.includes('head of') ||
    titleLower.includes('director') ||
    titleLower.includes('partner');

  const isTierB =
    titleLower.includes('manager') ||
    titleLower.includes('lead') ||
    titleLower.includes('principal') ||
    titleLower.includes('supervisor') ||
    titleLower.includes('strategist');

  if (isTierA) {
    tier = 'Tier A';
    reasoning = `Tier A: High-priority executive decision maker (${lead.title || 'Executive'}) at ${company}.`;
  } else if (isTierB) {
    tier = 'Tier B';
    reasoning = `Tier B: Operational leader / internal champion (${lead.title || 'Manager'}) at ${company}.`;
  } else {
    tier = 'Tier C';
    reasoning = `Tier C: Individual contributor or general inquiry (${lead.title || 'Professional'}) at ${company}.`;
  }

  // Tailored Icebreaker Generation
  let icebreaker = `Hi ${firstName}, loved following the growth and recent momentum at ${company}!`;

  if (titleLower.includes('sales') || titleLower.includes('revenue')) {
    icebreaker = `Hi ${firstName}, noticed how ${company} is expanding its market reach—curious how your sales team is handling pipeline outbound this quarter?`;
  } else if (titleLower.includes('tech') || titleLower.includes('engineer') || titleLower.includes('developer')) {
    icebreaker = `Hi ${firstName}, impressed by the technical infrastructure ${company} is building—are you exploring AI automation to accelerate internal sprints?`;
  } else if (titleLower.includes('operations') || titleLower.includes('logistics')) {
    icebreaker = `Hi ${firstName}, with ${company}'s operational footprint scaling, I was curious if automating manual data workflows is a focus right now?`;
  } else if (titleLower.includes('marketing') || titleLower.includes('growth')) {
    icebreaker = `Hi ${firstName}, really enjoyed ${company}'s brand positioning—how are you currently scaling your personalized customer engagement?`;
  } else if (titleLower.includes('legal') || titleLower.includes('law')) {
    icebreaker = `Hi ${firstName}, admiring ${company}'s advisory track record—wanted to share a quick case study on streamlining client intake workflows.`;
  }

  return {
    tier,
    icebreaker,
    reasoning,
  };
}

/**
 * Batch enriches a list of leads with mock AI results.
 */
export function enrichLeadsWithMock(records: NormalizedLead[]): NormalizedLead[] {
  return records.map((record) => {
    const enrichment = generateMockEnrichment(record);
    return {
      ...record,
      tier: enrichment.tier,
      icebreaker: enrichment.icebreaker,
      aiReasoning: enrichment.reasoning,
    };
  });
}
