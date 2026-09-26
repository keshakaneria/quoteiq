import type { QuestionnaireAnswer } from '../schemas';

export const DEMO_QUESTIONNAIRE_ANSWERS: QuestionnaireAnswer[] = [
  // ── Vendor A – PackPro Solutions ────────────────────────────────────────────
  { answer_id: 'QA-A-1', rfx_id: 'rfx-001', vendor_id: 'V-A', question_id: 'q1', answer_text: 'Yes', answer_numeric: null, answer_boolean: true, confidence: 'high', evidence_id: 'EV-A-001', is_missing: false },
  { answer_id: 'QA-A-2', rfx_id: 'rfx-001', vendor_id: 'V-A', question_id: 'q2', answer_text: '5,00,000 units/month', answer_numeric: 500000, answer_boolean: null, confidence: 'high', evidence_id: 'EV-A-001', is_missing: false },
  { answer_id: 'QA-A-3', rfx_id: 'rfx-001', vendor_id: 'V-A', question_id: 'q3', answer_text: '5 working days', answer_numeric: 5, answer_boolean: null, confidence: 'high', evidence_id: 'EV-A-001', is_missing: false },
  { answer_id: 'QA-A-4', rfx_id: 'rfx-001', vendor_id: 'V-A', question_id: 'q4', answer_text: 'Yes, with 50% premium', answer_numeric: null, answer_boolean: true, confidence: 'high', evidence_id: 'EV-A-001', is_missing: false },
  { answer_id: 'QA-A-5', rfx_id: 'rfx-001', vendor_id: 'V-A', question_id: 'q5', answer_text: 'In-line QC checks at each production stage. Final AQL 1.5 inspection before dispatch. CAPA process for any deviations.', answer_numeric: null, answer_boolean: null, confidence: 'high', evidence_id: 'EV-A-001', is_missing: false },
  { answer_id: 'QA-A-6', rfx_id: 'rfx-001', vendor_id: 'V-A', question_id: 'q6', answer_text: 'Yes', answer_numeric: null, answer_boolean: true, confidence: 'high', evidence_id: 'EV-A-001', is_missing: false },
  { answer_id: 'QA-A-7', rfx_id: 'rfx-001', vendor_id: 'V-A', question_id: 'q7', answer_text: 'Full replacement within 7 days for any batch where defects exceed 1%. Customer to return defective goods. No restocking fee.', answer_numeric: null, answer_boolean: null, confidence: 'high', evidence_id: 'EV-A-001', is_missing: false },
  { answer_id: 'QA-A-8', rfx_id: 'rfx-001', vendor_id: 'V-A', question_id: 'q8', answer_text: '8,00,000 units/month', answer_numeric: 800000, answer_boolean: null, confidence: 'high', evidence_id: 'EV-A-001', is_missing: false },

  // ── Vendor B – BoxCraft Industries ─────────────────────────────────────────
  { answer_id: 'QA-B-1', rfx_id: 'rfx-001', vendor_id: 'V-B', question_id: 'q1', answer_text: 'Yes – ISO 9001:2015, cert no. BC-QM-2022-089', answer_numeric: null, answer_boolean: true, confidence: 'high', evidence_id: 'EV-B-001', is_missing: false },
  { answer_id: 'QA-B-2', rfx_id: 'rfx-001', vendor_id: 'V-B', question_id: 'q2', answer_text: '3,00,000 units/month', answer_numeric: 300000, answer_boolean: null, confidence: 'high', evidence_id: 'EV-B-001', is_missing: false },
  { answer_id: 'QA-B-3', rfx_id: 'rfx-001', vendor_id: 'V-B', question_id: 'q3', answer_text: '6 days standard', answer_numeric: 6, answer_boolean: null, confidence: 'high', evidence_id: 'EV-B-001', is_missing: false },
  { answer_id: 'QA-B-4', rfx_id: 'rfx-001', vendor_id: 'V-B', question_id: 'q4', answer_text: 'No – minimum 72h required', answer_numeric: null, answer_boolean: false, confidence: 'high', evidence_id: 'EV-B-001', is_missing: false },
  { answer_id: 'QA-B-5', rfx_id: 'rfx-001', vendor_id: 'V-B', question_id: 'q5', answer_text: 'AQL 2.5 inspection. Board burst strength tested per batch. Moisture content verification. ISO-compliant test reports provided per PO.', answer_numeric: null, answer_boolean: null, confidence: 'high', evidence_id: 'EV-B-001', is_missing: false },
  { answer_id: 'QA-B-6', rfx_id: 'rfx-001', vendor_id: 'V-B', question_id: 'q6', answer_text: 'Yes – QR code on each carton links to batch record', answer_numeric: null, answer_boolean: true, confidence: 'high', evidence_id: 'EV-B-001', is_missing: false },
  { answer_id: 'QA-B-7', rfx_id: 'rfx-001', vendor_id: 'V-B', question_id: 'q7', answer_text: 'Replacement or credit note within 14 days. Defect threshold: >2% of batch. Visual defects reported within 48h of receipt.', answer_numeric: null, answer_boolean: null, confidence: 'high', evidence_id: 'EV-B-001', is_missing: false },
  { answer_id: 'QA-B-8', rfx_id: 'rfx-001', vendor_id: 'V-B', question_id: 'q8', answer_text: '4,50,000 units/month', answer_numeric: 450000, answer_boolean: null, confidence: 'high', evidence_id: 'EV-B-001', is_missing: false },

  // ── Vendor C – GlobalPack Ltd ───────────────────────────────────────────────
  { answer_id: 'QA-C-1', rfx_id: 'rfx-001', vendor_id: 'V-C', question_id: 'q1', answer_text: 'Yes – ISO 9001:2015', answer_numeric: null, answer_boolean: true, confidence: 'high', evidence_id: 'EV-C-001', is_missing: false },
  { answer_id: 'QA-C-2', rfx_id: 'rfx-001', vendor_id: 'V-C', question_id: 'q2', answer_text: '2,00,000 units/month', answer_numeric: 200000, answer_boolean: null, confidence: 'medium', evidence_id: 'EV-C-001', is_missing: false },
  { answer_id: 'QA-C-3', rfx_id: 'rfx-001', vendor_id: 'V-C', question_id: 'q3', answer_text: '10 working days from PO confirmation', answer_numeric: 10, answer_boolean: null, confidence: 'high', evidence_id: 'EV-C-001', is_missing: false },
  { answer_id: 'QA-C-4', rfx_id: 'rfx-001', vendor_id: 'V-C', question_id: 'q4', answer_text: 'Not answered', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-C-5', rfx_id: 'rfx-001', vendor_id: 'V-C', question_id: 'q5', answer_text: 'ISO-compliant QC. Board burst test per batch.', answer_numeric: null, answer_boolean: null, confidence: 'medium', evidence_id: 'EV-C-001', is_missing: false },
  { answer_id: 'QA-C-6', rfx_id: 'rfx-001', vendor_id: 'V-C', question_id: 'q6', answer_text: 'Yes – batch codes provided', answer_numeric: null, answer_boolean: true, confidence: 'medium', evidence_id: 'EV-C-001', is_missing: false },
  { answer_id: 'QA-C-7', rfx_id: 'rfx-001', vendor_id: 'V-C', question_id: 'q7', answer_text: 'Not answered', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-C-8', rfx_id: 'rfx-001', vendor_id: 'V-C', question_id: 'q8', answer_text: '3,50,000 units', answer_numeric: 350000, answer_boolean: null, confidence: 'medium', evidence_id: 'EV-C-001', is_missing: false },

  // ── Vendor D – SwiftPack Co ─────────────────────────────────────────────────
  { answer_id: 'QA-D-1', rfx_id: 'rfx-001', vendor_id: 'V-D', question_id: 'q1', answer_text: 'In process – certification expected Q2 2024', answer_numeric: null, answer_boolean: false, confidence: 'medium', evidence_id: 'EV-D-003', is_missing: false },
  { answer_id: 'QA-D-2', rfx_id: 'rfx-001', vendor_id: 'V-D', question_id: 'q2', answer_text: 'Not specified', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-D-3', rfx_id: 'rfx-001', vendor_id: 'V-D', question_id: 'q3', answer_text: '4 days', answer_numeric: 4, answer_boolean: null, confidence: 'medium', evidence_id: 'EV-D-003', is_missing: false },
  { answer_id: 'QA-D-4', rfx_id: 'rfx-001', vendor_id: 'V-D', question_id: 'q4', answer_text: 'Yes', answer_numeric: null, answer_boolean: true, confidence: 'low', evidence_id: 'EV-D-003', is_missing: false },
  { answer_id: 'QA-D-5', rfx_id: 'rfx-001', vendor_id: 'V-D', question_id: 'q5', answer_text: 'Not answered', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-D-6', rfx_id: 'rfx-001', vendor_id: 'V-D', question_id: 'q6', answer_text: 'Not mentioned', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-D-7', rfx_id: 'rfx-001', vendor_id: 'V-D', question_id: 'q7', answer_text: 'Replacement within 30 days', answer_numeric: null, answer_boolean: null, confidence: 'medium', evidence_id: 'EV-D-003', is_missing: false },
  { answer_id: 'QA-D-8', rfx_id: 'rfx-001', vendor_id: 'V-D', question_id: 'q8', answer_text: 'Not specified', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },

  // ── Vendor E – QuickBox Express ─────────────────────────────────────────────
  { answer_id: 'QA-E-1', rfx_id: 'rfx-001', vendor_id: 'V-E', question_id: 'q1', answer_text: 'Not mentioned in email', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-E-2', rfx_id: 'rfx-001', vendor_id: 'V-E', question_id: 'q2', answer_text: 'Not mentioned', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-E-3', rfx_id: 'rfx-001', vendor_id: 'V-E', question_id: 'q3', answer_text: 'Not mentioned', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-E-4', rfx_id: 'rfx-001', vendor_id: 'V-E', question_id: 'q4', answer_text: 'Not mentioned', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-E-5', rfx_id: 'rfx-001', vendor_id: 'V-E', question_id: 'q5', answer_text: 'Standard quality checks', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: 'EV-E-003', is_missing: false },
  { answer_id: 'QA-E-6', rfx_id: 'rfx-001', vendor_id: 'V-E', question_id: 'q6', answer_text: 'Not mentioned', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-E-7', rfx_id: 'rfx-001', vendor_id: 'V-E', question_id: 'q7', answer_text: 'Not mentioned', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
  { answer_id: 'QA-E-8', rfx_id: 'rfx-001', vendor_id: 'V-E', question_id: 'q8', answer_text: 'Not mentioned', answer_numeric: null, answer_boolean: null, confidence: 'low', evidence_id: null, is_missing: true },
];
