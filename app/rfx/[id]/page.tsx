import AppShell from '@/components/layout/AppShell';
import { DEMO_RFX } from '@/lib/seed';
import { notFound } from 'next/navigation';
import { FileText, Package, MapPin, Calendar, DollarSign, HelpCircle } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RFxPage({ params }: Props) {
  const { id } = await params;
  if (id !== 'rfx-001') return notFound();
  const rfx = DEMO_RFX;

  return (
    <AppShell>
      <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="chip chip-blue">RFx-001</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Active</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>{rfx.name}</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 20, width: 'fit-content' }}>
            {[
              { icon: <Package size={13} />, label: 'Category', value: rfx.category },
              { icon: <MapPin size={13} />, label: 'Delivery', value: rfx.delivery_location },
              { icon: <DollarSign size={13} />, label: 'Currency', value: rfx.currency },
              { icon: <Calendar size={13} />, label: 'Deadline', value: rfx.deadline },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                {m.icon} <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial requirements */}
        {rfx.commercial_requirements && (
          <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid var(--indigo)' }}>
            <div className="section-title" style={{ marginBottom: 8 }}>Commercial Requirements</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              {rfx.commercial_requirements}
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Line Items */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={15} color="var(--accent)" />
                <span style={{ fontWeight: 600, fontSize: 14 }}>Line Items</span>
              </div>
              <span className="chip chip-gray">{rfx.line_items.length} items</span>
            </div>
            <div style={{ maxHeight: 600, overflow: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th>Item</th>
                    <th>Specification</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th>UOM</th>
                    <th>Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {rfx.line_items.map((line, i) => (
                    <tr key={line.line_id}>
                      <td style={{ color: 'var(--muted)', fontSize: 11 }}>{line.line_id}</td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{line.item_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{line.description}</div>
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--muted)', maxWidth: 200 }}>{line.specification}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{line.quantity.toLocaleString('en-IN')}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{line.uom}</td>
                      <td style={{ fontSize: 11, color: 'var(--muted)' }}>{line.required_delivery_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Questionnaire */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', alignSelf: 'start' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle size={15} color="var(--accent)" />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Supplier Questionnaire</span>
              <span className="chip chip-gray">{rfx.questionnaire.length} questions</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {rfx.questionnaire.map((q, i) => (
                <div
                  key={q.question_id}
                  style={{
                    padding: '12px 20px',
                    borderBottom: i < rfx.questionnaire.length - 1 ? '1px solid var(--border)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{q.question_id.toUpperCase()}</span>
                    <span
                      className={`chip ${
                        q.type === 'yes_no' ? 'chip-green' : q.type === 'numeric' ? 'chip-blue' : 'chip-gray'
                      }`}
                    >
                      {q.type.replace('_', '/')}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: q.qualification_rule ? 4 : 0 }}>
                    {q.text}
                  </div>
                  {q.qualification_rule && (
                    <div style={{ fontSize: 11, color: 'var(--accent)' }}>⚡ {q.qualification_rule}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
