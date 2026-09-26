import { z } from 'zod';

// ─── RFx ────────────────────────────────────────────────────────────────────

export const LineItemSchema = z.object({
  line_id: z.string(),
  item_name: z.string(),
  description: z.string(),
  specification: z.string(),
  quantity: z.number(),
  uom: z.string(),
  required_delivery_date: z.string(),
  category: z.string().optional(),
});

export const QuestionSchema = z.object({
  question_id: z.string(),
  text: z.string(),
  type: z.enum(['yes_no', 'numeric', 'text', 'attachment']),
  required: z.boolean(),
  qualification_rule: z.string().optional(),
});

export const RFxSchema = z.object({
  rfx_id: z.string(),
  name: z.string(),
  category: z.string(),
  delivery_location: z.string(),
  currency: z.enum(['INR', 'USD']),
  status: z.enum(['draft', 'sent', 'responses_received', 'analysis', 'awarded']),
  created_at: z.string(),
  deadline: z.string(),
  line_items: z.array(LineItemSchema),
  questionnaire: z.array(QuestionSchema),
  commercial_requirements: z.string().optional(),
});

// ─── Vendor ──────────────────────────────────────────────────────────────────

export const VendorSchema = z.object({
  vendor_id: z.string(),
  name: z.string(),
  short_name: z.string(),
  format: z.enum(['excel', 'pdf', 'docx', 'image', 'email']),
  format_label: z.string(),
  lines_quoted: z.number(),
  total_lines: z.number(),
  processing_status: z.enum(['pending', 'processing', 'complete', 'needs_review']),
  questionnaire_status: z.enum(['complete', 'partial', 'missing']),
  exception_count: z.number(),
  qualified: z.boolean(),
  qualification_notes: z.string(),
  color: z.string(),
});

// ─── Evidence ────────────────────────────────────────────────────────────────

export const SourceEvidenceSchema = z.object({
  evidence_id: z.string(),
  vendor_id: z.string(),
  document_name: z.string(),
  document_format: z.string(),
  page_or_section: z.string(),
  original_text: z.string(),
  extraction_method: z.enum(['structured', 'ocr', 'prose', 'table']),
});

// ─── Discount ────────────────────────────────────────────────────────────────

export const DiscountSchema = z.object({
  type: z.enum(['flat', 'percentage', 'conditional']),
  value: z.number(),
  condition: z.string().nullable(),
  applied: z.boolean(),
  note: z.string().optional(),
});

// ─── Freight ─────────────────────────────────────────────────────────────────

export const FreightSchema = z.object({
  state: z.enum(['included', 'excluded', 'separate', 'unknown']),
  amount: z.number().nullable(),
  note: z.string().nullable(),
});

// ─── Quote ───────────────────────────────────────────────────────────────────

export const QuoteStatusSchema = z.enum([
  'comparable',
  'not_quoted',
  'cannot_normalize',
  'needs_review',
]);

export const ConfidenceSchema = z.enum(['high', 'medium', 'low']);

export const QuoteSchema = z.object({
  quote_id: z.string(),
  rfx_id: z.string(),
  line_id: z.string(),
  vendor_id: z.string(),
  status: QuoteStatusSchema,

  // Original AI-extracted values (immutable)
  ai_original_price: z.number().nullable(),
  ai_original_currency: z.enum(['INR', 'USD']).nullable(),
  ai_original_uom: z.string().nullable(),

  // Current values (may be buyer-corrected)
  original_price: z.number().nullable(),
  original_currency: z.enum(['INR', 'USD']).nullable(),
  original_uom: z.string().nullable(),

  // Normalized values
  normalized_price: z.number().nullable(),
  normalized_uom: z.string().nullable(),
  fx_rate: z.number().nullable(),
  fx_note: z.string().nullable(),

  discount: DiscountSchema.nullable(),
  freight: FreightSchema,
  lead_time_days: z.number().nullable(),
  payment_terms: z.string().nullable(),
  moq: z.number().nullable(),
  quote_validity_days: z.number().nullable(),

  confidence: ConfidenceSchema,
  cannot_normalize_reason: z.string().nullable(),
  extraction_notes: z.string().nullable(),

  evidence_id: z.string().nullable(),
  review_status: z.enum(['pending', 'approved', 'corrected']),

  // Buyer correction tracking
  buyer_corrected_price: z.number().nullable(),
  buyer_correction_note: z.string().nullable(),
});

// ─── Exception ───────────────────────────────────────────────────────────────

export const ExceptionTypeSchema = z.enum([
  'missing_line',
  'ambiguous_line_mapping',
  'unit_mismatch',
  'unsupported_conversion',
  'missing_freight',
  'ambiguous_discount',
  'low_confidence_extraction',
  'missing_questionnaire_answer',
  'incomplete_response',
  'currency_conversion_applied',
  'ambiguous_reference',
]);

export const ExceptionSeveritySchema = z.enum(['critical', 'high', 'medium', 'low']);
export const ExceptionStatusSchema = z.enum(['open', 'resolved', 'ignored']);

export const ExceptionSchema = z.object({
  exception_id: z.string(),
  rfx_id: z.string(),
  vendor_id: z.string(),
  line_id: z.string().nullable(),
  type: ExceptionTypeSchema,
  severity: ExceptionSeveritySchema,
  status: ExceptionStatusSchema,
  title: z.string(),
  description: z.string(),
  source_evidence: z.string().nullable(),
  resolution_note: z.string().nullable(),
  requires_buyer_action: z.boolean(),
});

// ─── Questionnaire Answer ─────────────────────────────────────────────────────

export const QuestionnaireAnswerSchema = z.object({
  answer_id: z.string(),
  rfx_id: z.string(),
  vendor_id: z.string(),
  question_id: z.string(),
  answer_text: z.string().nullable(),
  answer_numeric: z.number().nullable(),
  answer_boolean: z.boolean().nullable(),
  confidence: ConfidenceSchema,
  evidence_id: z.string().nullable(),
  is_missing: z.boolean(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type LineItem = z.infer<typeof LineItemSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type RFx = z.infer<typeof RFxSchema>;
export type Vendor = z.infer<typeof VendorSchema>;
export type SourceEvidence = z.infer<typeof SourceEvidenceSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type Exception = z.infer<typeof ExceptionSchema>;
export type QuestionnaireAnswer = z.infer<typeof QuestionnaireAnswerSchema>;
export type QuoteStatus = z.infer<typeof QuoteStatusSchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type ExceptionType = z.infer<typeof ExceptionTypeSchema>;
export type ExceptionSeverity = z.infer<typeof ExceptionSeveritySchema>;
export type ExceptionStatus = z.infer<typeof ExceptionStatusSchema>;
