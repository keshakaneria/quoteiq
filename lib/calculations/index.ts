import type { Quote } from '../schemas';
import { DEMO_QUOTES, DEMO_VENDORS, DEMO_RFX } from '../seed';

export const FX_RATE = 84; // 1 USD = ₹84 (demo fixed)

// ─── Price resolution ────────────────────────────────────────────────────────

/** Get the effective price for a quote (buyer correction takes precedence) */
export function getEffectivePrice(quote: Quote): number | null {
  if (quote.buyer_corrected_price !== null) return quote.buyer_corrected_price;
  return quote.normalized_price;
}

/** Get the effective normalized price for comparable quotes only */
export function getComparablePrice(quote: Quote): number | null {
  if (quote.status !== 'comparable') return null;
  return getEffectivePrice(quote);
}

// ─── Vendor totals ───────────────────────────────────────────────────────────

export interface VendorTotal {
  vendor_id: string;
  comparable_lines: number;
  total_lines: number;
  total_value: number | null;
  missing_lines: string[];
  not_normalizable_lines: string[];
  needs_review_lines: string[];
  is_fully_comparable: boolean;
}

export function computeVendorTotal(vendorId: string, applyCorrections = true): VendorTotal {
  const lineIds = DEMO_RFX.line_items.map((l) => l.line_id);
  const vendorQuotes = DEMO_QUOTES.filter((q) => q.vendor_id === vendorId);
  const quoteMap = Object.fromEntries(vendorQuotes.map((q) => [q.line_id, q]));

  const missing: string[] = [];
  const cantNormalize: string[] = [];
  const needsReview: string[] = [];
  let total = 0;
  let comparableCount = 0;

  for (const lineId of lineIds) {
    const line = DEMO_RFX.line_items.find((l) => l.line_id === lineId)!;
    const quote = quoteMap[lineId];

    if (!quote || quote.status === 'not_quoted') {
      missing.push(lineId);
      continue;
    }
    if (quote.status === 'cannot_normalize') {
      cantNormalize.push(lineId);
      continue;
    }
    if (quote.status === 'needs_review') {
      needsReview.push(lineId);
      continue;
    }

    const price = applyCorrections ? getEffectivePrice(quote) : quote.normalized_price;
    if (price === null) {
      cantNormalize.push(lineId);
      continue;
    }

    total += price * line.quantity;
    comparableCount++;
  }

  const hasAllComparable =
    missing.length === 0 && cantNormalize.length === 0 && needsReview.length === 0;

  return {
    vendor_id: vendorId,
    comparable_lines: comparableCount,
    total_lines: lineIds.length,
    total_value: comparableCount > 0 ? total : null,
    missing_lines: missing,
    not_normalizable_lines: cantNormalize,
    needs_review_lines: needsReview,
    is_fully_comparable: hasAllComparable,
  };
}

// ─── Split award ─────────────────────────────────────────────────────────────

export interface SplitAwardLine {
  line_id: string;
  item_name: string;
  quantity: number;
  uom: string;
  winner_vendor_id: string | null;
  winner_price: number | null;
  winner_total: number | null;
  all_valid_prices: { vendor_id: string; price: number }[];
  is_covered: boolean;
  coverage_reason: string;
}

export interface SplitAwardResult {
  lines: SplitAwardLine[];
  total_value: number;
  vendor_allocation: { vendor_id: string; lines_awarded: number; award_value: number }[];
  uncovered_lines: string[];
  incomparable_lines: string[];
  excluded_vendors: string[];
  assumptions: string[];
}

export function computeSplitAward(
  qualifiedOnly = false,
  applyCorrections = true
): SplitAwardResult {
  const qualifiedVendorIds = qualifiedOnly
    ? DEMO_VENDORS.filter((v) => v.qualified).map((v) => v.vendor_id)
    : DEMO_VENDORS.map((v) => v.vendor_id);

  const excludedVendors = qualifiedOnly
    ? DEMO_VENDORS.filter((v) => !v.qualified).map((v) => v.vendor_id)
    : [];

  const lines: SplitAwardLine[] = [];
  let totalValue = 0;
  const vendorAlloc: Record<string, { lines: number; value: number }> = {};
  const uncovered: string[] = [];
  const incomparable: string[] = [];

  for (const lineItem of DEMO_RFX.line_items) {
    const validPrices: { vendor_id: string; price: number }[] = [];

    for (const vendorId of qualifiedVendorIds) {
      const quote = DEMO_QUOTES.find(
        (q) => q.vendor_id === vendorId && q.line_id === lineItem.line_id
      );
      if (!quote || quote.status !== 'comparable') continue;
      const price = applyCorrections ? getEffectivePrice(quote) : quote.normalized_price;
      if (price === null) continue;
      validPrices.push({ vendor_id: vendorId, price });
    }

    if (validPrices.length === 0) {
      const anyQuote = DEMO_QUOTES.find(
        (q) => q.line_id === lineItem.line_id && q.status !== 'not_quoted'
      );
      const awardLine: SplitAwardLine = {
        line_id: lineItem.line_id,
        item_name: lineItem.item_name,
        quantity: lineItem.quantity,
        uom: lineItem.uom,
        winner_vendor_id: null,
        winner_price: null,
        winner_total: null,
        all_valid_prices: [],
        is_covered: false,
        coverage_reason: anyQuote
          ? 'No comparable price available (cannot normalize or needs review)'
          : 'Not quoted by any vendor',
      };
      lines.push(awardLine);
      if (anyQuote) incomparable.push(lineItem.line_id);
      else uncovered.push(lineItem.line_id);
      continue;
    }

    // Sort by price ascending
    validPrices.sort((a, b) => a.price - b.price);
    const winner = validPrices[0];
    const lineTotal = winner.price * lineItem.quantity;
    totalValue += lineTotal;

    if (!vendorAlloc[winner.vendor_id]) {
      vendorAlloc[winner.vendor_id] = { lines: 0, value: 0 };
    }
    vendorAlloc[winner.vendor_id].lines++;
    vendorAlloc[winner.vendor_id].value += lineTotal;

    lines.push({
      line_id: lineItem.line_id,
      item_name: lineItem.item_name,
      quantity: lineItem.quantity,
      uom: lineItem.uom,
      winner_vendor_id: winner.vendor_id,
      winner_price: winner.price,
      winner_total: lineTotal,
      all_valid_prices: validPrices,
      is_covered: true,
      coverage_reason: '',
    });
  }

  const vendorAllocation = Object.entries(vendorAlloc).map(([vid, data]) => ({
    vendor_id: vid,
    lines_awarded: data.lines,
    award_value: data.value,
  }));

  const assumptions: string[] = [
    'Normalized prices used for comparison (USD converted at ₹84/USD).',
    'Conditional discounts (BoxCraft 5%) NOT applied — threshold verification required.',
    'Freight is excluded from all unit prices — landed cost comparison not possible without freight rates.',
    qualifiedOnly
      ? `Only quality-qualified vendors included: ${qualifiedVendorIds.join(', ')}.`
      : 'All vendors included regardless of qualification status.',
    'Lines with "needs_review" status or "cannot_normalize" status are excluded from award calculations.',
    '"Rest same as last year" references (Vendor E) excluded — price unresolvable.',
    'This is a cost-optimized scenario, not a final award recommendation.',
  ];

  return {
    lines,
    total_value: totalValue,
    vendor_allocation: vendorAllocation,
    uncovered_lines: uncovered,
    incomparable_lines: incomparable,
    excluded_vendors: excludedVendors,
    assumptions,
  };
}

// ─── Format helpers ──────────────────────────────────────────────────────────

export function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatINRShort(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return formatINR(value);
}
