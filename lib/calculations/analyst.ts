'use client';

import { DEMO_QUOTES, DEMO_RFX, DEMO_VENDORS } from '../seed';
import { computeVendorTotal, computeSplitAward, formatINR, formatINRShort } from './index';

// ─── Intent detection ─────────────────────────────────────────────────────────

type AnalystIntent =
  | 'lowest_total'
  | 'split_award'
  | 'qualified_split'
  | 'incomplete_quotes'
  | 'review_required'
  | 'vendor_comparison'
  | 'unknown';

function detectIntent(question: string): AnalystIntent {
  const q = question.toLowerCase();
  if (q.match(/lowest|cheapest|best price|minimum cost|total cost.*vendor/)) return 'lowest_total';
  if (q.match(/split.*qualif|qualif.*split|qualified.*cheapest|only qualif/)) return 'qualified_split';
  if (q.match(/split|each line|line.*cheapest|cheapest.*line|optimal split/)) return 'split_award';
  if (q.match(/incomplete|missing|not quoted|coverage|partial/)) return 'incomplete_quotes';
  if (q.match(/review|low confidence|should.*check|ambiguous|verify|flag/)) return 'review_required';
  if (q.match(/compare|vs|versus|between vendor/)) return 'vendor_comparison';
  return 'unknown';
}

// ─── Response builders ────────────────────────────────────────────────────────

export interface AnalystResponse {
  answer: string;
  calculation: string[];
  data_used: string[];
  assumptions: string[];
  exceptions_noted: string[];
  is_sufficient: boolean;
}

function buildLowestTotal(): AnalystResponse {
  const results = DEMO_VENDORS.map((v) => {
    const total = computeVendorTotal(v.vendor_id);
    return { vendor: v, total };
  });
  results.sort((a, b) => {
    if (a.total.total_value === null) return 1;
    if (b.total.total_value === null) return -1;
    return a.total.total_value - b.total.total_value;
  });

  const lines = results.map((r) => {
    const val = r.total.total_value !== null ? formatINRShort(r.total.total_value) : 'Cannot calculate';
    const coverage = `${r.total.comparable_lines}/${r.total.total_lines} lines`;
    return `${r.vendor.short_name}: ${val} (${coverage} comparable)`;
  });

  const best = results.find((r) => r.total.total_value !== null);
  const answerText = best
    ? `**${best.vendor.name}** has the lowest total cost at **${formatINRShort(best.total.total_value)}** for ${best.total.comparable_lines} comparable lines.`
    : 'Unable to determine lowest total cost — no vendor has a fully comparable quote.';

  return {
    answer: answerText,
    calculation: [
      'For each vendor: sum(normalized_price × quantity) across all comparable lines.',
      'Lines with status "not_quoted", "cannot_normalize", or "needs_review" are excluded.',
      'USD prices converted to INR at ₹84/USD.',
      ...lines,
    ],
    data_used: [
      '30 RFx line items with quantities',
      '150 quote cells across 5 vendors',
      'Normalized prices (INR equivalent)',
    ],
    assumptions: [
      'Conditional discounts (BoxCraft 5%) not applied.',
      'Freight excluded — not included in unit prices for most vendors.',
      'Missing/unresolvable lines not counted as zero.',
      'FX rate: 1 USD = ₹84 (demo fixed rate).',
    ],
    exceptions_noted: [
      'PackPro (A): 30/30 lines comparable.',
      'BoxCraft (B): 30/30 comparable, 5% conditional discount not applied.',
      `GlobalPack (C): 28/30 — L22 and L27 not quoted.`,
      `SwiftPack (D): 26/30 comparable — 3 "cannot normalize" (unit ambiguity), 1 missing.`,
      `QuickBox (E): 23/30 comparable — 5 "needs review" (ambiguous reference), 3 not quoted.`,
    ],
    is_sufficient: true,
  };
}

function buildSplitAward(qualifiedOnly: boolean): AnalystResponse {
  const result = computeSplitAward(qualifiedOnly);
  const vendorNames = DEMO_VENDORS.reduce<Record<string, string>>((acc, v) => {
    acc[v.vendor_id] = v.short_name;
    return acc;
  }, {});

  const allocLines = result.vendor_allocation.map(
    (a) => `${vendorNames[a.vendor_id]}: ${a.lines_awarded} lines — ${formatINRShort(a.award_value)}`
  );

  const prefix = qualifiedOnly
    ? 'Quality-qualified split award (PackPro + BoxCraft only)'
    : 'Optimal split award (all vendors)';

  return {
    answer: `**${prefix}**: Total cost **${formatINRShort(result.total_value)}** across ${result.lines.filter((l) => l.is_covered).length} covered lines.${result.uncovered_lines.length > 0 ? ` ${result.uncovered_lines.length} lines uncovered.` : ''}`,
    calculation: [
      'For each line item, find the lowest valid normalized price across eligible vendors.',
      'Sum winner_price × quantity for all covered lines.',
      `Total: ${formatINR(result.total_value)}`,
      'Vendor allocation:',
      ...allocLines,
    ],
    data_used: [
      `${DEMO_RFX.line_items.length} RFx line items`,
      qualifiedOnly ? 'Qualified vendors: PackPro (A), BoxCraft (B)' : 'All 5 vendors',
      'Comparable normalized prices only',
    ],
    assumptions: result.assumptions,
    exceptions_noted: [
      `Uncovered lines (no valid price): ${result.uncovered_lines.length > 0 ? result.uncovered_lines.join(', ') : 'None'}`,
      `Incomparable lines (cannot normalize): ${result.incomparable_lines.length > 0 ? result.incomparable_lines.join(', ') : 'None'}`,
      qualifiedOnly
        ? `Excluded vendors: ${result.excluded_vendors.map((id) => vendorNames[id]).join(', ')} (not qualified)`
        : '',
    ].filter(Boolean),
    is_sufficient: true,
  };
}

function buildIncompleteQuotes(): AnalystResponse {
  const rows = DEMO_VENDORS.map((v) => {
    const t = computeVendorTotal(v.vendor_id);
    return `${v.name}: ${t.comparable_lines} comparable, ${t.missing_lines.length} missing, ${t.not_normalizable_lines.length} cannot normalize, ${t.needs_review_lines.length} needs review`;
  });

  return {
    answer:
      'Here is the quote coverage summary across all 5 vendors:',
    calculation: rows,
    data_used: ['30 RFx line items', '150 quote cells'],
    assumptions: [
      '"Missing" = not included in vendor response.',
      '"Cannot normalize" = quoted but unit/currency cannot be converted.',
      '"Needs review" = quoted but requires buyer verification (e.g. ambiguous reference).',
    ],
    exceptions_noted: [
      'QuickBox (E) has the most gaps — 5 "needs review" and 3 "not quoted".',
      'SwiftPack (D) has 3 lines where unit "box" cannot be normalized to pieces.',
    ],
    is_sufficient: true,
  };
}

function buildReviewRequired(): AnalystResponse {
  const reviewItems = DEMO_QUOTES.filter(
    (q) =>
      q.confidence === 'low' ||
      q.status === 'needs_review' ||
      q.status === 'cannot_normalize' ||
      q.discount?.type === 'conditional' ||
      q.freight.state === 'unknown'
  );

  const byVendor: Record<string, number> = {};
  for (const q of reviewItems) {
    byVendor[q.vendor_id] = (byVendor[q.vendor_id] || 0) + 1;
  }

  const vendorNames = DEMO_VENDORS.reduce<Record<string, string>>((acc, v) => {
    acc[v.vendor_id] = v.short_name;
    return acc;
  }, {});

  const rows = Object.entries(byVendor).map(([vid, count]) => `${vendorNames[vid]}: ${count} items need review`);

  return {
    answer: `**${reviewItems.length} price cells require review** before use in award calculations.`,
    calculation: [
      'Items flagged: low confidence + needs_review + cannot_normalize + conditional discounts + unknown freight',
      ...rows,
    ],
    data_used: ['All 150 quote cells', 'Exception records'],
    assumptions: [],
    exceptions_noted: [
      'BoxCraft conditional 5% discount — threshold not yet met/verified.',
      'SwiftPack OCR values — medium confidence, should be vendor-confirmed.',
      'QuickBox "same as last year" references — no historical data available.',
      'SwiftPack L01–L03 "box" unit ambiguity — cannot normalize.',
      'GlobalPack/SwiftPack/QuickBox freight state unknown — landed cost not calculable.',
    ],
    is_sufficient: true,
  };
}

function buildUnknown(question: string): AnalystResponse {
  return {
    answer: `I wasn't able to identify the specific analysis you're looking for. Try one of the suggested questions, or rephrase to ask about: lowest total cost, split award, qualified vendors, incomplete quotes, or items needing review.`,
    calculation: [],
    data_used: [],
    assumptions: [],
    exceptions_noted: [],
    is_sufficient: false,
  };
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function runAnalyst(question: string): AnalystResponse {
  const intent = detectIntent(question);
  switch (intent) {
    case 'lowest_total':     return buildLowestTotal();
    case 'split_award':      return buildSplitAward(false);
    case 'qualified_split':  return buildSplitAward(true);
    case 'incomplete_quotes': return buildIncompleteQuotes();
    case 'review_required':  return buildReviewRequired();
    default:                 return buildUnknown(question);
  }
}

export const SUGGESTED_QUESTIONS = [
  'Which vendor has the lowest total cost?',
  'What if we split the award and buy each line from the cheapest vendor?',
  'What if we split only among quality-qualified vendors?',
  'Which vendors have incomplete quotes?',
  'Which prices should I review before awarding?',
];
