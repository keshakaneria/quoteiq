import AppShell from '@/components/layout/AppShell';
import { DEMO_VENDORS, DEMO_QUESTIONNAIRE_ANSWERS, DEMO_EVIDENCE, DEMO_RFX } from '@/lib/seed';
import { notFound } from 'next/navigation';
import { CheckCircle, XCircle, AlertTriangle, FileSpreadsheet, FileText, Image, Mail, File } from 'lucide-react';

interface Props { params: Promise<{ id: string }> }

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  excel: <FileSpreadsheet size={14} />,
  pdf: <FileText size={14} />,
  image: <Image size={14} />,
  email: <Mail size={14} />,
  docx: <File size={14} />,
};

const PIPELINE_STEPS = ['Received', 'Text Extract', 'AI Parse', 'Match Lines', 'Validate', 'Done'];

function PipelineViz({ status }: { status: string }) {
  const doneSteps = status === 'complete' ? 6 : status === 'needs_review' ? 5 : 3;
  return (
    <div className="pipeline">
      {PIPELINE_STEPS.map((step, i) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && (
            <div style={{ width: 16, height: 1, background: i < doneSteps ? 'var(--green)' : 'var(--border-light)', margin: '0 3px' }} />
          )}
          <div
            className={`pipeline-step ${i < doneSteps ? 'done' : i === doneSteps ? 'active' : ''}`}
            style={{ fontSize: 10, whiteSpace: 'nowrap' }}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function VendorsPage({ params }: Props) {
  const { id } = await params;
  if (id !== 'rfx-001') return notFound();

  const questions = DEMO_RFX.questionnaire;

  return (
    <AppShell>
      <div style={{ padding: '32px 36px', maxWidth: 1400 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>Vendor Responses</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
            5 responses received. Processing complete. Review exceptions before comparison.
          </p>
        </div>

        {/* Vendor overview cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
          {DEMO_VENDORS.map((v) => (
            <div
              key={v.vendor_id}
              className="card"
              style={{ padding: 16, borderTop: `3px solid ${v.color}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ color: v.color }}>{FORMAT_ICONS[v.format]}</div>
                <span className={`chip ${v.qualified ? 'chip-green' : 'chip-red'}`} style={{ fontSize: 10 }}>
                  {v.qualified ? 'Qualified' : 'Not qualified'}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{v.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>{v.format_label}</div>
              <div style={{ fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--muted)' }}>Coverage</span>
                  <span style={{ fontWeight: 600 }}>{v.lines_quoted}/{v.total_lines}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--muted)' }}>Exceptions</span>
                  <span style={{ color: v.exception_count > 3 ? '#ef4444' : v.exception_count > 0 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                    {v.exception_count}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(v.lines_quoted / v.total_lines) * 100}%`, background: v.color, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Processing status table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Processing Pipeline</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Format</th>
                <th>Lines</th>
                <th>Status</th>
                <th>Pipeline</th>
                <th>Questionnaire</th>
                <th>Exceptions</th>
                <th>Qualification</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_VENDORS.map((v) => (
                <tr key={v.vendor_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: v.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 500 }}>{v.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{v.vendor_id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
                      {FORMAT_ICONS[v.format]}
                      <span style={{ fontSize: 12 }}>{v.format_label}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span style={{ fontWeight: 600 }}>{v.lines_quoted}</span>
                      <span style={{ color: 'var(--muted)' }}>/{v.total_lines}</span>
                    </div>
                    {v.lines_quoted < v.total_lines && (
                      <div style={{ fontSize: 11, color: '#f59e0b' }}>{v.total_lines - v.lines_quoted} missing</div>
                    )}
                  </td>
                  <td>
                    <span className={`chip ${v.processing_status === 'complete' ? 'chip-green' : v.processing_status === 'needs_review' ? 'chip-yellow' : 'chip-gray'}`}>
                      {v.processing_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td><PipelineViz status={v.processing_status} /></td>
                  <td>
                    <span className={`chip ${v.questionnaire_status === 'complete' ? 'chip-green' : v.questionnaire_status === 'partial' ? 'chip-yellow' : 'chip-red'}`}>
                      {v.questionnaire_status}
                    </span>
                  </td>
                  <td>
                    {v.exception_count > 0 ? (
                      <span className="chip chip-yellow">
                        <AlertTriangle size={10} /> {v.exception_count}
                      </span>
                    ) : (
                      <span className="chip chip-green">None</span>
                    )}
                  </td>
                  <td>
                    {v.qualified ? (
                      <div>
                        <span className="chip chip-green"><CheckCircle size={10} /> Qualified</span>
                        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{v.qualification_notes}</div>
                      </div>
                    ) : (
                      <div>
                        <span className="chip chip-red"><XCircle size={10} /> Not qualified</span>
                        <div style={{ fontSize: 10, color: '#ef4444', marginTop: 4, lineHeight: 1.4 }}>{v.qualification_notes}</div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Questionnaire answers */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Questionnaire Answers</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ minWidth: 220 }}>Question</th>
                  {DEMO_VENDORS.map((v) => (
                    <th key={v.vendor_id} style={{ minWidth: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color }} />
                        {v.short_name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.question_id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 12 }}>{q.text}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                        {q.type.replace('_', '/')} {q.required ? '· Required' : ''}
                      </div>
                    </td>
                    {DEMO_VENDORS.map((v) => {
                      const ans = DEMO_QUESTIONNAIRE_ANSWERS.find(
                        (a) => a.vendor_id === v.vendor_id && a.question_id === q.question_id
                      );
                      if (!ans || ans.is_missing) {
                        return (
                          <td key={v.vendor_id}>
                            <span className="chip chip-red" style={{ fontSize: 10 }}>Missing</span>
                          </td>
                        );
                      }
                      return (
                        <td key={v.vendor_id}>
                          <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                            {ans.answer_boolean !== null ? (
                              <span className={`chip ${ans.answer_boolean ? 'chip-green' : 'chip-red'}`} style={{ fontSize: 10 }}>
                                {ans.answer_boolean ? 'Yes' : 'No'}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--foreground)' }}>{ans.answer_text}</span>
                            )}
                          </div>
                          <div style={{ fontSize: 10, color: `var(--${ans.confidence === 'high' ? 'green' : ans.confidence === 'medium' ? 'yellow' : 'red'})`, marginTop: 2 }}>
                            {ans.confidence} confidence
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
