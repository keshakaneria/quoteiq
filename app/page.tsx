import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { DEMO_RFX, DEMO_VENDORS, DEMO_EXCEPTIONS } from '@/lib/seed';
import { ArrowRight, Package, Building2, AlertTriangle, CheckCircle, Clock, BarChart3, FileText, Zap } from 'lucide-react';

const RFX_ID = 'rfx-001';

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    responses_received: { label: 'Responses Received', cls: 'chip-blue' },
    complete: { label: 'Complete', cls: 'chip-green' },
    needs_review: { label: 'Needs Review', cls: 'chip-yellow' },
    pending: { label: 'Pending', cls: 'chip-gray' },
  };
  const s = map[status] || { label: status, cls: 'chip-gray' };
  return <span className={`chip ${s.cls}`}>{s.label}</span>;
}

function VendorFormatBadge({ format }: { format: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    excel: { label: 'Excel', cls: 'chip-green' },
    pdf: { label: 'PDF', cls: 'chip-red' },
    image: { label: 'Image/OCR', cls: 'chip-purple' },
    email: { label: 'Email', cls: 'chip-blue' },
    docx: { label: 'DOCX', cls: 'chip-blue' },
  };
  const b = map[format] || { label: format, cls: 'chip-gray' };
  return <span className={`chip ${b.cls}`}>{b.label}</span>;
}

export default function DashboardPage() {
  const openExceptions = DEMO_EXCEPTIONS.filter((e) => e.status === 'open').length;
  const criticalExceptions = DEMO_EXCEPTIONS.filter((e) => e.severity === 'critical' && e.status === 'open').length;
  const totalVendors = DEMO_VENDORS.length;
  const qualifiedVendors = DEMO_VENDORS.filter((v) => v.qualified).length;

  return (
    <AppShell>
      <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="chip chip-blue">Demo</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Corrugated Packaging · Annual Sourcing 2024</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', margin: 0, marginBottom: 6 }}>
            Procurement Dashboard
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            5 vendor responses received. Analysis ready.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Line Items', value: DEMO_RFX.line_items.length, icon: <Package size={16} />, color: '#6366f1' },
            { label: 'Vendors', value: totalVendors, sub: `${qualifiedVendors} qualified`, icon: <Building2 size={16} />, color: '#10b981' },
            { label: 'Open Exceptions', value: openExceptions, sub: `${criticalExceptions} critical`, icon: <AlertTriangle size={16} />, color: criticalExceptions > 0 ? '#ef4444' : '#f59e0b' },
            { label: 'RFx Status', value: 'In Analysis', icon: <BarChart3 size={16} />, color: '#3b82f6' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </div>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              {s.sub && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* RFx Card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{DEMO_RFX.name}</h2>
                <StatusChip status={DEMO_RFX.status} />
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--muted)' }}>
                <span>📦 {DEMO_RFX.category}</span>
                <span>📍 {DEMO_RFX.delivery_location}</span>
                <span>💱 {DEMO_RFX.currency}</span>
                <span>📅 Deadline: {DEMO_RFX.deadline}</span>
              </div>
            </div>
            <Link href={`/rfx/${RFX_ID}`} className="btn btn-primary">
              Open Demo <ArrowRight size={14} />
            </Link>
          </div>

          {/* Quick nav */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {[
              { icon: <FileText size={14} />, label: 'RFx Details', sub: '30 lines · 8 questions', href: `/rfx/${RFX_ID}` },
              { icon: <Building2 size={14} />, label: 'Vendor Responses', sub: '5 vendors received', href: `/rfx/${RFX_ID}/vendors` },
              { icon: <AlertTriangle size={14} />, label: 'Exceptions', sub: `${openExceptions} open`, href: `/rfx/${RFX_ID}/exceptions`, alert: criticalExceptions > 0 },
              { icon: <BarChart3 size={14} />, label: 'Comparison', sub: '30 × 5 matrix', href: `/rfx/${RFX_ID}/comparison` },
              { icon: <Zap size={14} />, label: 'AI Analyst', sub: 'Ask questions', href: `/rfx/${RFX_ID}/analyst` },
            ].map((nav, i) => (
              <Link
                key={i}
                href={nav.href}
                style={{
                  display: 'block',
                  padding: '14px',
                  background: 'var(--surface-2)',
                  border: `1px solid ${nav.alert ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
              >
                <div style={{ color: nav.alert ? '#ef4444' : 'var(--accent)', marginBottom: 6 }}>{nav.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 2 }}>{nav.label}</div>
                <div style={{ fontSize: 11, color: nav.alert ? '#ef4444' : 'var(--muted)' }}>{nav.sub}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Vendor Summary */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, margin: '0 0 16px' }}>Vendor Response Status</h3>
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Format</th>
                <th>Coverage</th>
                <th>Processing</th>
                <th>Questionnaire</th>
                <th>Qualification</th>
                <th>Exceptions</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_VENDORS.map((v) => (
                <tr key={v.vendor_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color }} />
                      <span style={{ fontWeight: 500 }}>{v.name}</span>
                    </div>
                  </td>
                  <td><VendorFormatBadge format={v.format} /></td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{v.lines_quoted}</span>
                    <span style={{ color: 'var(--muted)' }}>/{v.total_lines}</span>
                    {v.lines_quoted < v.total_lines && (
                      <span className="chip chip-yellow" style={{ marginLeft: 6 }}>
                        {v.total_lines - v.lines_quoted} missing
                      </span>
                    )}
                  </td>
                  <td><StatusChip status={v.processing_status} /></td>
                  <td>
                    <span className={`chip ${v.questionnaire_status === 'complete' ? 'chip-green' : v.questionnaire_status === 'partial' ? 'chip-yellow' : 'chip-red'}`}>
                      {v.questionnaire_status}
                    </span>
                  </td>
                  <td>
                    {v.qualified ? (
                      <span className="chip chip-green"><CheckCircle size={10} /> Qualified</span>
                    ) : (
                      <span className="chip chip-red">Not qualified</span>
                    )}
                  </td>
                  <td>
                    {v.exception_count > 0 ? (
                      <span className="chip chip-yellow">{v.exception_count}</span>
                    ) : (
                      <span className="chip chip-green">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
