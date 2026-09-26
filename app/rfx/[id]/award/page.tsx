'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { computeSplitAward, computeVendorTotal, formatINR } from '@/lib/calculations';
import { DEMO_VENDORS, DEMO_RFX } from '@/lib/seed';
import { Trophy, CheckCircle, AlertTriangle, Building2, Layers } from 'lucide-react';

type Tab = 'single' | 'split_all' | 'split_qualified';

export default function AwardScenariosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('split_all');

  // Compute all scenarios
  const singleVendors = DEMO_VENDORS.map(v => ({
    vendor: v,
    total: computeVendorTotal(v.vendor_id)
  })).sort((a, b) => {
    if (a.total.total_value === null) return 1;
    if (b.total.total_value === null) return -1;
    return a.total.total_value - b.total.total_value;
  });

  const splitAll = computeSplitAward(false);
  const splitQualified = computeSplitAward(true);

  const renderSingleVendor = () => {
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        {singleVendors.map((sv, i) => (
          <div key={sv.vendor.vendor_id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            {i === 0 && sv.total.total_value !== null && (
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent)', color: '#000', padding: '4px 12px', fontSize: 11, fontWeight: 700, borderBottomLeftRadius: 8 }}>
                Lowest Total
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${sv.vendor.color}20`, color: sv.vendor.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{sv.vendor.name}</h3>
                    {sv.vendor.qualified && <span className="chip chip-green" style={{ fontSize: 9 }}><CheckCircle size={10} /> Qualified</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {sv.total.comparable_lines} of {sv.total.total_lines} lines comparable
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: sv.total.total_value !== null ? 'var(--foreground)' : 'var(--muted)' }}>
                  {sv.total.total_value !== null ? formatINR(sv.total.total_value) : 'Cannot Calculate'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  {sv.total.missing_lines.length > 0 && `${sv.total.missing_lines.length} missing `}
                  {sv.total.not_normalizable_lines.length > 0 && `${sv.total.not_normalizable_lines.length} cannot normalize`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSplit = (scenario: typeof splitAll) => {
    return (
      <div>
        {/* Summary metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-label">Total Award Value</div>
            <div className="stat-value" style={{ color: 'var(--accent)', marginTop: 8 }}>{formatINR(scenario.total_value)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Coverage</div>
            <div className="stat-value" style={{ marginTop: 8 }}>{scenario.lines.filter(l => l.is_covered).length} <span style={{ fontSize: 14, color: 'var(--muted)' }}>/ 30 lines</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Vendors Awarded</div>
            <div className="stat-value" style={{ marginTop: 8 }}>{scenario.vendor_allocation.length}</div>
          </div>
        </div>

        {/* Vendor Allocation */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Vendor Allocation</h3>
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Lines Awarded</th>
                <th style={{ textAlign: 'right' }}>Award Value</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {scenario.vendor_allocation.map((alloc) => {
                const v = DEMO_VENDORS.find(v => v.vendor_id === alloc.vendor_id)!;
                const pct = (alloc.award_value / scenario.total_value) * 100;
                return (
                  <tr key={alloc.vendor_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color }} />
                        <span style={{ fontWeight: 500 }}>{v.name}</span>
                      </div>
                    </td>
                    <td>{alloc.lines_awarded}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatINR(alloc.award_value)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'var(--surface-2)', borderRadius: 2 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: v.color, borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--muted)', width: 36 }}>{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Warnings */}
        {(scenario.uncovered_lines.length > 0 || scenario.incomparable_lines.length > 0) && (
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '16px', marginBottom: 24 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={14} /> Exceptions Affecting Award
            </h4>
            
            {scenario.uncovered_lines.length > 0 && (
              <div style={{ fontSize: 12, marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Uncovered Lines ({scenario.uncovered_lines.length}):</span> Not quoted by any eligible vendor.
                <div style={{ color: 'var(--muted)', marginTop: 4 }}>{scenario.uncovered_lines.join(', ')}</div>
              </div>
            )}
            
            {scenario.incomparable_lines.length > 0 && (
              <div style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>Incomparable Lines ({scenario.incomparable_lines.length}):</span> Quoted, but cannot be normalized or need review.
                <div style={{ color: 'var(--muted)', marginTop: 4 }}>{scenario.incomparable_lines.join(', ')}</div>
              </div>
            )}
          </div>
        )}

        {/* Assumptions */}
        <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--foreground)' }}>Assumptions:</strong><br />
          <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
            {scenario.assumptions.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <AppShell>
      <div style={{ padding: '32px 36px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>Award Scenarios</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
            Cost-optimized allocations based on current normalized prices. Not a final award recommendation.
          </p>
        </div>

        {/* Custom Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', padding: 4, borderRadius: 10, width: 'fit-content', marginBottom: 32 }}>
          {[
            { id: 'split_all', label: 'Split Award (All)', icon: <Layers size={14} /> },
            { id: 'split_qualified', label: 'Split (Qualified Only)', icon: <CheckCircle size={14} /> },
            { id: 'single', label: 'Single Vendor', icon: <Trophy size={14} /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: activeTab === t.id ? 600 : 500,
                color: activeTab === t.id ? 'var(--foreground)' : 'var(--muted)',
                background: activeTab === t.id ? 'var(--surface)' : 'transparent',
                border: 'none',
                boxShadow: activeTab === t.id ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ color: activeTab === t.id ? 'var(--accent)' : 'inherit' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'single' && renderSingleVendor()}
        {activeTab === 'split_all' && renderSplit(splitAll)}
        {activeTab === 'split_qualified' && renderSplit(splitQualified)}

      </div>
    </AppShell>
  );
}
