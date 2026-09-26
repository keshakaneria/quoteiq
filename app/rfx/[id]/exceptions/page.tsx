'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { DEMO_EXCEPTIONS, DEMO_VENDORS, DEMO_EVIDENCE } from '@/lib/seed';
import type { Exception, ExceptionSeverity, ExceptionStatus } from '@/lib/schemas';
import { AlertTriangle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react';

const SEV_ORDER: Record<ExceptionSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const SEV_LABELS: Record<ExceptionSeverity, { cls: string; label: string }> = {
  critical: { cls: 'chip-red', label: 'Critical' },
  high: { cls: 'chip-yellow', label: 'High' },
  medium: { cls: 'chip-blue', label: 'Medium' },
  low: { cls: 'chip-gray', label: 'Low' },
};

const TYPE_LABELS: Record<string, string> = {
  missing_line: 'Missing line',
  ambiguous_line_mapping: 'Ambiguous mapping',
  unit_mismatch: 'Unit mismatch',
  unsupported_conversion: 'Unsupported conversion',
  missing_freight: 'Missing freight',
  ambiguous_discount: 'Ambiguous discount',
  low_confidence_extraction: 'Low confidence',
  missing_questionnaire_answer: 'Missing answer',
  incomplete_response: 'Incomplete response',
  currency_conversion_applied: 'Currency conversion',
  ambiguous_reference: 'Ambiguous reference',
};

export default function ExceptionsPage() {
  const [filter, setFilter] = useState<ExceptionStatus | 'all'>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [sevFilter, setSevFilter] = useState<ExceptionSeverity | 'all'>('all');
  const [exceptions, setExceptions] = useState(DEMO_EXCEPTIONS);

  const filtered = [...exceptions]
    .filter((e) => (filter === 'all' ? true : e.status === filter))
    .filter((e) => (vendorFilter === 'all' ? true : e.vendor_id === vendorFilter))
    .filter((e) => (sevFilter === 'all' ? true : e.severity === sevFilter))
    .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);

  const updateStatus = (id: string, status: ExceptionStatus) => {
    setExceptions((prev) => prev.map((e) => (e.exception_id === id ? { ...e, status } : e)));
  };

  const openCount = exceptions.filter((e) => e.status === 'open').length;
  const criticalCount = exceptions.filter((e) => e.severity === 'critical' && e.status === 'open').length;

  return (
    <AppShell>
      <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>Exceptions</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
            {openCount} open exceptions · {criticalCount} critical · Requires buyer action before award
          </p>
        </div>

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {[
            { label: `${exceptions.filter(e=>e.status==='open').length} Open`, status: 'open' as ExceptionStatus },
            { label: `${exceptions.filter(e=>e.status==='resolved').length} Resolved`, status: 'resolved' as ExceptionStatus },
            { label: `${exceptions.filter(e=>e.status==='ignored').length} Ignored`, status: 'ignored' as ExceptionStatus },
          ].map(s => (
            <div key={s.status} style={{ fontSize: 13, color: 'var(--muted)' }}>
              <span className={`chip ${s.status === 'open' ? 'chip-yellow' : s.status === 'resolved' ? 'chip-green' : 'chip-gray'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <select value={filter} onChange={e => setFilter(e.target.value as ExceptionStatus | 'all')} style={{ width: 140 }}>
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
          </select>
          <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} style={{ width: 160 }}>
            <option value="all">All vendors</option>
            {DEMO_VENDORS.map(v => <option key={v.vendor_id} value={v.vendor_id}>{v.name}</option>)}
          </select>
          <select value={sevFilter} onChange={e => setSevFilter(e.target.value as ExceptionSeverity | 'all')} style={{ width: 140 }}>
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>
            {filtered.length} exceptions shown
          </span>
        </div>

        {/* Exception list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((exc) => {
            const vendor = DEMO_VENDORS.find(v => v.vendor_id === exc.vendor_id);
            const evidence = exc.source_evidence ? DEMO_EVIDENCE.find(e => e.evidence_id === exc.source_evidence) : null;
            const sev = SEV_LABELS[exc.severity];

            return (
              <div
                key={exc.exception_id}
                className="card"
                style={{
                  padding: 16,
                  borderLeft: `3px solid ${exc.severity === 'critical' ? '#ef4444' : exc.severity === 'high' ? '#f59e0b' : exc.severity === 'medium' ? '#3b82f6' : '#8b92b8'}`,
                  opacity: exc.status === 'ignored' ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1, paddingRight: 16 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span className={`chip ${sev.cls}`}>{sev.label}</span>
                      <span className="chip chip-gray">{TYPE_LABELS[exc.type] || exc.type}</span>
                      {vendor && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: vendor.color }} />
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{vendor.name}</span>
                        </div>
                      )}
                      {exc.line_id && <span className="chip chip-indigo">{exc.line_id}</span>}
                      <span className={`chip ${exc.status === 'open' ? 'chip-yellow' : exc.status === 'resolved' ? 'chip-green' : 'chip-gray'}`}>
                        {exc.status}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{exc.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{exc.description}</div>

                    {/* Evidence */}
                    {evidence && (
                      <div className="evidence-ref" style={{ marginTop: 10 }}>
                        <div style={{ marginBottom: 4 }}>
                          <strong>{evidence.document_name}</strong> · {evidence.page_or_section}
                        </div>
                        <div style={{ fontStyle: 'italic' }}>"{evidence.original_text}"</div>
                      </div>
                    )}

                    {exc.requires_buyer_action && exc.status === 'open' && (
                      <div style={{ marginTop: 8, fontSize: 11, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={10} />
                        Requires buyer action before award
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {exc.status === 'open' && (
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: 11, padding: '5px 10px' }}
                        onClick={() => updateStatus(exc.exception_id, 'resolved')}
                      >
                        <CheckCircle size={11} /> Resolve
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: '5px 10px' }}
                        onClick={() => updateStatus(exc.exception_id, 'ignored')}
                      >
                        Ignore
                      </button>
                    </div>
                  )}
                  {exc.status === 'resolved' && (
                    <span className="chip chip-green" style={{ flexShrink: 0 }}><CheckCircle size={10} /> Resolved</span>
                  )}
                  {exc.status === 'ignored' && (
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 11, padding: '5px 10px', flexShrink: 0 }}
                      onClick={() => updateStatus(exc.exception_id, 'open')}
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
              <CheckCircle size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
              <div>No exceptions match the current filters.</div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
