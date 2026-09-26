import type { Vendor } from '../schemas';

export const DEMO_VENDORS: Vendor[] = [
  {
    vendor_id: 'V-A',
    name: 'PackPro Solutions',
    short_name: 'PackPro',
    format: 'excel',
    format_label: 'Excel',
    lines_quoted: 30,
    total_lines: 30,
    processing_status: 'complete',
    questionnaire_status: 'complete',
    exception_count: 1,
    qualified: true,
    qualification_notes:
      'ISO 9001 certified ✓ | Lead time 5 days ✓ | Batch traceability ✓',
    color: '#10b981',
  },
  {
    vendor_id: 'V-B',
    name: 'BoxCraft Industries',
    short_name: 'BoxCraft',
    format: 'pdf',
    format_label: 'PDF',
    lines_quoted: 30,
    total_lines: 30,
    processing_status: 'needs_review',
    questionnaire_status: 'complete',
    exception_count: 3,
    qualified: true,
    qualification_notes:
      'ISO 9001 certified ✓ | Lead time 6 days ✓ | Batch traceability ✓',
    color: '#3b82f6',
  },
  {
    vendor_id: 'V-C',
    name: 'GlobalPack Ltd',
    short_name: 'GlobalPack',
    format: 'pdf',
    format_label: 'PDF + DOCX',
    lines_quoted: 28,
    total_lines: 30,
    processing_status: 'needs_review',
    questionnaire_status: 'partial',
    exception_count: 5,
    qualified: false,
    qualification_notes:
      'ISO 9001 certified ✓ | Lead time 10 days ✗ (exceeds 7-day threshold) | Batch traceability ✓',
    color: '#f59e0b',
  },
  {
    vendor_id: 'V-D',
    name: 'SwiftPack Co',
    short_name: 'SwiftPack',
    format: 'image',
    format_label: 'Image (OCR)',
    lines_quoted: 29,
    total_lines: 30,
    processing_status: 'needs_review',
    questionnaire_status: 'partial',
    exception_count: 6,
    qualified: false,
    qualification_notes:
      'ISO 9001 not confirmed ✗ | Lead time 4 days ✓ | Batch traceability not confirmed ✗',
    color: '#8b5cf6',
  },
  {
    vendor_id: 'V-E',
    name: 'QuickBox Express',
    short_name: 'QuickBox',
    format: 'email',
    format_label: 'Email text',
    lines_quoted: 27,
    total_lines: 30,
    processing_status: 'needs_review',
    questionnaire_status: 'partial',
    exception_count: 7,
    qualified: false,
    qualification_notes:
      'ISO 9001 not confirmed ✗ | Lead time unknown ✗ | Batch traceability not mentioned ✗',
    color: '#ef4444',
  },
];

export const VENDOR_MAP: Record<string, Vendor> = Object.fromEntries(
  DEMO_VENDORS.map((v) => [v.vendor_id, v])
);
