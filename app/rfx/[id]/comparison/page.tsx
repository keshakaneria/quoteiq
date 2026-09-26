'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { DEMO_VENDORS, DEMO_RFX, DEMO_QUOTES, DEMO_EVIDENCE } from '@/lib/seed';
import type { Quote } from '@/lib/schemas';
import { formatINR, computeVendorTotal } from '@/lib/calculations';
import { applyCorrection, getCorrectedPrice, isCorrected } from '@/lib/store/corrections';
import { X, AlertTriangle, CheckCircle, Info, Edit2, Download } from 'lucide-react';

// ─── Cell rendering ───────────────────────────────────────────────────────────

function CellContent({ quote, onClick }: { quote: Quote; onClick: () => void }) {
  const correctedPrice = getCorrectedPrice(quote);
  const corrected = isCorrected(quote.quote_id);

  if (quote.status === 'not_quoted') {
    return (
      <td className="cell-not-quoted" onClick={onClick} style={{ cursor: 'default', textAlign: 'center', color: 'var(--muted)' }}>
        <span style={{ fontSize: 12 }}>—</span>
      </td>
    );
  }
  if (quote.status === 'cannot_normalize') {
    return (
      <td className="cell-cannot-normalize" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 500 }}>Cannot normalize</div>
        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{quote.original_price ? `₹${quote.original_price}/${quote.original_uom}` : '—'}</div>
      </td>
    );
  }
  if (quote.status === 'needs_review') {
    return (
      <td className="cell-needs-review" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 500 }}>Needs review</div>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{quote.extraction_notes?.substring(0, 40)}…</div>
      </td>
    );
  }

  const price = correctedPrice ?? quote.normalized_price;

  return (
    <td
      className={`cell-comparable ${quote.confidence === 'low' ? 'cell-needs-review' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>
          {price !== null ? `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
        </span>
        {corrected && <Edit2 size={9} color="var(--accent)" />}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
        {quote.original_currency === 'USD' && (
          <span className="chip chip-purple" style={{ fontSize: 9, padding: '1px 4px' }}>USD</span>
        )}
        {quote.confidence !== 'high' && (
          <span className={`chip ${quote.confidence === 'medium' ? 'chip-yellow' : 'chip-red'}`} style={{ fontSize: 9, padding: '1px 4px' }}>
            {quote.confidence}
          </span>
        )}
        {quote.freight.state === 'unknown' && (
          <span className="chip chip-red" style={{ fontSize: 9, padding: '1px 4px' }}>no freight</span>
        )}
      </div>
    </td>
  );
}

// ─── Cell Drawer ──────────────────────────────────────────────────────────────

function CellDrawer({ quote, lineItem, onClose }: {
  quote: Quote;
  lineItem: typeof DEMO_RFX.line_items[0];
  onClose: () => void;
}) {
  const [correctionMode, setCorrectionMode] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [correctionNote, setCorrectionNote] = useState('');
  const vendor = DEMO_VENDORS.find(v => v.vendor_id === quote.vendor_id);
  const evidence = quote.evidence_id ? DEMO_EVIDENCE.find(e => e.evidence_id === quote.evidence_id) : null;
  const correctedPrice = getCorrectedPrice(quote);
  const corrected = isCorrected(quote.quote_id);

  const handleCorrect = () => {
    const val = parseFloat(newPrice);
    if (isNaN(val) || val <= 0) return;
    applyCorrection(quote.quote_id, 'normalized_price', quote.normalized_price, val, correctionNote);
    setCorrectionMode(false);
    window.location.reload();
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Evidence Inspection</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{lineItem.item_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: vendor?.color || '#888' }} />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{vendor?.name}</span>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: '6px 8px' }} onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {/* Status */}
        <div style={{ marginBottom: 16 }}>
          <span className={`chip ${
            quote.status === 'comparable' ? 'chip-green' :
            quote.status === 'needs_review' ? 'chip-yellow' :
            quote.status === 'cannot_normalize' ? 'chip-red' : 'chip-gray'
          }`}>
            {quote.status.replace('_', ' ')}
          </span>
          {' '}
          <span className={`chip ${
            quote.confidence === 'high' ? 'chip-green' :
            quote.confidence === 'medium' ? 'chip-yellow' : 'chip-red'
          }`}>
            {quote.confidence} confidence
          </span>
        </div>

        {/* Price section */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="section-title">Price</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Original (AI)</div>
              <div style={{ fontWeight: 600 }}>
                {quote.original_currency === 'USD' ? '$' : '₹'}
                {quote.original_price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '—'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{quote.original_uom} · {quote.original_currency}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Normalized (INR)</div>
              <div style={{ fontWeight: 600, color: corrected ? 'var(--accent)' : 'var(--foreground)' }}>
                {correctedPrice !== null ? `₹${correctedPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                {corrected && <span style={{ fontSize: 10, marginLeft: 4 }}>(corrected)</span>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{quote.normalized_uom}</div>
            </div>
          </div>
          {quote.fx_rate && (
            <div className="evidence-ref" style={{ marginTop: 10 }}>
              <strong>FX applied:</strong> {quote.fx_note}
            </div>
          )}
        </div>

        {/* Freight */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="section-title">Freight</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={`chip ${
              quote.freight.state === 'included' ? 'chip-green' :
              quote.freight.state === 'excluded' ? 'chip-gray' :
              quote.freight.state === 'separate' ? 'chip-blue' : 'chip-red'
            }`}>
              {quote.freight.state}
            </span>
            {quote.freight.amount && <span style={{ fontSize: 12 }}>{formatINR(quote.freight.amount)}</span>}
          </div>
          {quote.freight.note && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{quote.freight.note}</div>}
          {quote.freight.state === 'unknown' && (
            <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
              ⚠ Landed cost not calculable — freight amount unknown
            </div>
          )}
        </div>

        {/* Discount */}
        {quote.discount && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">Discount</div>
            <div style={{ fontSize: 13 }}>
              {quote.discount.value}% {quote.discount.type} discount
            </div>
            {quote.discount.condition && (
              <div className="evidence-ref" style={{ marginTop: 8 }}>
                <strong>Condition:</strong> {quote.discount.condition}
              </div>
            )}
            <div style={{ fontSize: 11, color: quote.discount.applied ? '#10b981' : '#f59e0b', marginTop: 6 }}>
              {quote.discount.applied ? '✓ Applied to normalized price' : '⚠ Not applied — condition not met/verified'}
            </div>
          </div>
        )}

        {/* Commercial */}
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="section-title">Commercial Terms</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
            {[
              { label: 'Lead time', value: quote.lead_time_days ? `${quote.lead_time_days} days` : '—' },
              { label: 'Payment', value: quote.payment_terms || '—' },
              { label: 'MOQ', value: quote.moq?.toLocaleString('en-IN') || '—' },
              { label: 'Quote valid', value: quote.quote_validity_days ? `${quote.quote_validity_days} days` : '—' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ color: 'var(--muted)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cannot normalize reason */}
        {quote.cannot_normalize_reason && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginBottom: 4 }}>
              <AlertTriangle size={12} style={{ display: 'inline', marginRight: 4 }} />
              Cannot normalize
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{quote.cannot_normalize_reason}</div>
          </div>
        )}

        {/* Extraction notes */}
        {quote.extraction_notes && (
          <div className="evidence-ref" style={{ marginBottom: 12 }}>
            <strong>Extraction note:</strong> {quote.extraction_notes}
          </div>
        )}

        {/* Source evidence */}
        {evidence && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-title">Source Evidence</div>
            <div style={{ fontSize: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{evidence.document_name}</div>
              <div style={{ color: 'var(--muted)', marginBottom: 8 }}>{evidence.page_or_section}</div>
              <div style={{ fontStyle: 'italic', color: 'var(--foreground)', lineHeight: 1.5, padding: '8px', background: 'var(--surface-2)', borderRadius: 6 }}>
                "{evidence.original_text}"
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>
                Method: {evidence.extraction_method}
              </div>
            </div>
          </div>
        )}

        {/* Buyer correction */}
        {quote.status === 'comparable' && (
          <div>
            {!correctionMode ? (
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setCorrectionMode(true)}>
                <Edit2 size={13} /> Correct this value
              </button>
            ) : (
              <div className="card">
                <div className="section-title">Buyer Correction</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
                  Original AI value: ₹{quote.normalized_price} / {quote.normalized_uom}
                </div>
                <input
                  type="number"
                  placeholder="Corrected normalized price (INR)"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  style={{ width: '100%', marginBottom: 8 }}
                />
                <input
                  type="text"
                  placeholder="Reason for correction (optional)"
                  value={correctionNote}
                  onChange={e => setCorrectionNote(e.target.value)}
                  style={{ width: '100%', marginBottom: 10 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCorrect}>
                    Apply correction
                  </button>
                  <button className="btn btn-ghost" onClick={() => setCorrectionMode(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ComparisonPage() {
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [activeLineIdx, setActiveLineIdx] = useState<number>(0);

  const lineItems = DEMO_RFX.line_items;
  const vendors = DEMO_VENDORS;
  const quoteMap = Object.fromEntries(DEMO_QUOTES.map(q => [`${q.vendor_id}-${q.line_id}`, q]));

  const vendorTotals = vendors.map(v => computeVendorTotal(v.vendor_id));

  const exportCSV = () => {
    const headers = ['Line ID', 'Item Name', 'Qty', 'UOM', ...vendors.map(v => v.short_name)];
    const rows = lineItems.map(line => {
      const cells = vendors.map(v => {
        const q = quoteMap[`${v.vendor_id}-${line.line_id}`];
        if (!q || q.status === 'not_quoted') return 'Not quoted';
        if (q.status === 'cannot_normalize') return `Cannot normalize (${q.original_price}/${q.original_uom})`;
        if (q.status === 'needs_review') return 'Needs review';
        const p = getCorrectedPrice(q) ?? q.normalized_price;
        return p !== null ? p.toFixed(2) : '—';
      });
      return [line.line_id, line.item_name, line.quantity, line.uom, ...cells];
    });

    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quoteiq-comparison.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeLine = lineItems[activeLineIdx];

  return (
    <AppShell>
      <div style={{ padding: '24px 36px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Comparison Matrix</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>30 lines × 5 vendors · Click any cell to inspect source evidence</p>
        </div>
        <button className="btn btn-secondary" onClick={exportCSV}>
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Legend */}
      <div style={{ padding: '12px 36px', display: 'flex', gap: 16 }}>
        {[
          { cls: 'cell-comparable', label: 'Comparable' },
          { cls: 'cell-needs-review', label: 'Needs review' },
          { cls: 'cell-cannot-normalize', label: 'Cannot normalize' },
          { cls: 'cell-not-quoted', label: 'Not quoted' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: `var(--${l.cls === 'cell-comparable' ? 'green' : l.cls === 'cell-needs-review' ? 'yellow' : l.cls === 'cell-cannot-normalize' ? 'red' : 'muted'})`, opacity: 0.3 }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', paddingBottom: 24 }}>
        <table style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th className="sticky-col" style={{ minWidth: 220, zIndex: 15 }}>Line Item</th>
              <th style={{ width: 60, textAlign: 'right' }}>Qty</th>
              <th style={{ width: 60 }}>UOM</th>
              {vendors.map(v => (
                <th key={v.vendor_id} style={{ minWidth: 140 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color }} />
                    {v.short_name}
                    {v.qualified && <CheckCircle size={10} color="var(--green)" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lineItems.map((line, idx) => (
              <tr key={line.line_id}>
                <td className="sticky-col">
                  <div style={{ fontWeight: 500, fontSize: 12 }}>{line.item_name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{line.line_id}</div>
                </td>
                <td style={{ textAlign: 'right', fontSize: 12, fontWeight: 600 }}>
                  {line.quantity.toLocaleString('en-IN')}
                </td>
                <td style={{ fontSize: 11, color: 'var(--muted)' }}>{line.uom}</td>
                {vendors.map(v => {
                  const quote = quoteMap[`${v.vendor_id}-${line.line_id}`];
                  if (!quote) {
                    return <td key={v.vendor_id} style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>—</td>;
                  }
                  return (
                    <CellContent
                      key={v.vendor_id}
                      quote={quote}
                      onClick={() => { setActiveQuote(quote); setActiveLineIdx(idx); }}
                    />
                  );
                })}
              </tr>
            ))}

            {/* Vendor totals row */}
            <tr style={{ background: 'var(--surface)', fontWeight: 700 }}>
              <td className="sticky-col" style={{ fontWeight: 700, color: 'var(--accent)', background: 'var(--surface)' }}>
                Comparable Total
              </td>
              <td colSpan={2} style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>Sum of normalized × qty</td>
              {vendorTotals.map((vt) => (
                <td key={vt.vendor_id}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: vt.total_value !== null ? 'var(--foreground)' : 'var(--muted)' }}>
                    {vt.total_value !== null
                      ? `₹${(vt.total_value / 100000).toFixed(2)}L`
                      : '—'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                    {vt.comparable_lines}/{vt.total_lines} lines
                  </div>
                </td>
              ))}
            </tr>

            {/* Coverage row */}
            <tr>
              <td className="sticky-col" style={{ background: 'var(--background)', fontWeight: 600, fontSize: 12 }}>Coverage</td>
              <td colSpan={2} />
              {vendorTotals.map((vt) => (
                <td key={vt.vendor_id} style={{ fontSize: 11 }}>
                  {vt.missing_lines.length > 0 && (
                    <div style={{ color: '#ef4444' }}>{vt.missing_lines.length} not quoted</div>
                  )}
                  {vt.not_normalizable_lines.length > 0 && (
                    <div style={{ color: '#f59e0b' }}>{vt.not_normalizable_lines.length} cannot normalize</div>
                  )}
                  {vt.needs_review_lines.length > 0 && (
                    <div style={{ color: '#60a5fa' }}>{vt.needs_review_lines.length} needs review</div>
                  )}
                  {vt.is_fully_comparable && (
                    <div style={{ color: '#10b981' }}>✓ Fully comparable</div>
                  )}
                </td>
              ))}
            </tr>

            {/* Lead time row */}
            <tr>
              <td className="sticky-col" style={{ background: 'var(--background)', fontWeight: 600, fontSize: 12 }}>Lead Time</td>
              <td colSpan={2} />
              {DEMO_VENDORS.map(v => {
                const sample = DEMO_QUOTES.find(q => q.vendor_id === v.vendor_id && q.lead_time_days);
                return (
                  <td key={v.vendor_id} style={{ fontSize: 12 }}>
                    {sample?.lead_time_days ? `${sample.lead_time_days} days` : '—'}
                  </td>
                );
              })}
            </tr>

            {/* Payment terms row */}
            <tr>
              <td className="sticky-col" style={{ background: 'var(--background)', fontWeight: 600, fontSize: 12 }}>Payment Terms</td>
              <td colSpan={2} />
              {DEMO_VENDORS.map(v => {
                const sample = DEMO_QUOTES.find(q => q.vendor_id === v.vendor_id && q.payment_terms);
                return (
                  <td key={v.vendor_id} style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {sample?.payment_terms || '—'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cell drawer */}
      {activeQuote && (
        <CellDrawer
          quote={activeQuote}
          lineItem={lineItems[activeLineIdx]}
          onClose={() => setActiveQuote(null)}
        />
      )}
    </AppShell>
  );
}
