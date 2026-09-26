'use client';

import type { Quote } from '../schemas';

const STORAGE_KEY = 'quoteiq-corrections';

export interface Correction {
  quote_id: string;
  field: 'normalized_price' | 'original_price' | 'status';
  ai_value: number | string | null;
  buyer_value: number | string | null;
  note: string;
  timestamp: string;
}

function loadCorrections(): Record<string, Correction> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCorrections(corrections: Record<string, Correction>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(corrections));
}

export function applyCorrection(
  quoteId: string,
  field: Correction['field'],
  aiValue: number | string | null,
  buyerValue: number | string | null,
  note: string
): void {
  const corrections = loadCorrections();
  corrections[`${quoteId}-${field}`] = {
    quote_id: quoteId,
    field,
    ai_value: aiValue,
    buyer_value: buyerValue,
    note,
    timestamp: new Date().toISOString(),
  };
  saveCorrections(corrections);
}

export function getCorrection(quoteId: string, field: Correction['field']): Correction | null {
  const corrections = loadCorrections();
  return corrections[`${quoteId}-${field}`] || null;
}

export function getAllCorrections(): Correction[] {
  return Object.values(loadCorrections());
}

export function getCorrectedPrice(quote: Quote): number | null {
  const correction = getCorrection(quote.quote_id, 'normalized_price');
  if (correction && typeof correction.buyer_value === 'number') {
    return correction.buyer_value;
  }
  return quote.normalized_price;
}

export function isCorrected(quoteId: string): boolean {
  const corrections = loadCorrections();
  return Object.keys(corrections).some((k) => k.startsWith(quoteId));
}

export function clearAllCorrections(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
