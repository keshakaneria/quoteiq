import type { SourceEvidence } from '../schemas';

export const DEMO_EVIDENCE: SourceEvidence[] = [
  // ── Vendor A – PackPro Solutions (Excel, structured) ──────────────────────
  {
    evidence_id: 'EV-A-001',
    vendor_id: 'V-A',
    document_name: 'PackPro_Quote_2024.xlsx',
    document_format: 'excel',
    page_or_section: 'Sheet "Price List", Row 3',
    original_text: 'Corrugated Box 400x300x250 5ply | Qty: 50000 | ₹7.80/piece | INR',
    extraction_method: 'structured',
  },
  {
    evidence_id: 'EV-A-002',
    vendor_id: 'V-A',
    document_name: 'PackPro_Quote_2024.xlsx',
    document_format: 'excel',
    page_or_section: 'Sheet "Commercial Terms", Cell B2',
    original_text: 'Freight: Excluded. To be quoted separately on actuals. Min freight ₹4,500.',
    extraction_method: 'structured',
  },
  {
    evidence_id: 'EV-A-003',
    vendor_id: 'V-A',
    document_name: 'PackPro_Quote_2024.xlsx',
    document_format: 'excel',
    page_or_section: 'Sheet "Price List", Row 10',
    original_text: 'Edge Protector 50x50x5 | 150000 pcs | ₹0.95/piece | INR',
    extraction_method: 'structured',
  },
  // ── Vendor B – BoxCraft Industries (PDF, footnote discount) ───────────────
  {
    evidence_id: 'EV-B-001',
    vendor_id: 'V-B',
    document_name: 'BoxCraft_Quotation.pdf',
    document_format: 'pdf',
    page_or_section: 'Page 2, Table 1, Row 1',
    original_text: 'Item: Corr. Box 400x300x250 | Qty 50,000 | Rate: ₹7.50 per piece | INR',
    extraction_method: 'table',
  },
  {
    evidence_id: 'EV-B-002',
    vendor_id: 'V-B',
    document_name: 'BoxCraft_Quotation.pdf',
    document_format: 'pdf',
    page_or_section: 'Page 4, Footnote §3',
    original_text:
      '§3: A 5% volume discount applies to the total invoice value where cumulative order value exceeds ₹10,00,000 (Ten Lakh Rupees) in a single purchase order.',
    extraction_method: 'prose',
  },
  {
    evidence_id: 'EV-B-003',
    vendor_id: 'V-B',
    document_name: 'BoxCraft_Quotation.pdf',
    document_format: 'pdf',
    page_or_section: 'Page 4, Commercial Terms',
    original_text:
      'Freight: Charged separately at actual. Estimated freight Hyderabad: ₹6,200 per consignment.',
    extraction_method: 'prose',
  },
  // ── Vendor C – GlobalPack Ltd (PDF+DOCX, USD pricing) ─────────────────────
  {
    evidence_id: 'EV-C-001',
    vendor_id: 'V-C',
    document_name: 'GlobalPack_Quote_Jan2024.pdf',
    document_format: 'pdf',
    page_or_section: 'Page 1, Price Schedule',
    original_text:
      'Corrugated Box 400×300×250 (5-ply B-flute) | USD 0.094/unit | MOQ: 10,000 units',
    extraction_method: 'table',
  },
  {
    evidence_id: 'EV-C-002',
    vendor_id: 'V-C',
    document_name: 'GlobalPack_Terms.docx',
    document_format: 'docx',
    page_or_section: 'Section 3 – Logistics',
    original_text:
      'Freight charges: A flat delivery surcharge of ₹8,500 applies per delivery to Hyderabad warehouse. Applicable to all line items on the same PO.',
    extraction_method: 'prose',
  },
  {
    evidence_id: 'EV-C-003',
    vendor_id: 'V-C',
    document_name: 'GlobalPack_Quote_Jan2024.pdf',
    document_format: 'pdf',
    page_or_section: 'Page 2, Note on items not quoted',
    original_text:
      'Items L22 (Packing Chip) and L27 (Anti-Static Box) are outside our product scope and cannot be quoted at this time.',
    extraction_method: 'prose',
  },
  // ── Vendor D – SwiftPack Co (Image/OCR, unit ambiguity) ──────────────────
  {
    evidence_id: 'EV-D-001',
    vendor_id: 'V-D',
    document_name: 'SwiftPack_RateCard.jpg',
    document_format: 'image',
    page_or_section: 'Photographed rate card, Row 1',
    original_text:
      '5-ply carton 400×300×250 | ₹820/box | min 1000 boxes [OCR confidence: 94%]',
    extraction_method: 'ocr',
  },
  {
    evidence_id: 'EV-D-002',
    vendor_id: 'V-D',
    document_name: 'SwiftPack_RateCard.jpg',
    document_format: 'image',
    page_or_section: 'Photographed rate card, Row 2',
    original_text:
      '7-ply carton 600×400×400 | ₹1,200/box | min 500 boxes [OCR confidence: 91%]',
    extraction_method: 'ocr',
  },
  {
    evidence_id: 'EV-D-003',
    vendor_id: 'V-D',
    document_name: 'SwiftPack_RateCard.jpg',
    document_format: 'image',
    page_or_section: 'Rate card footer note',
    original_text:
      'All prices per box. Bundle pricing available for orders > 10,000 boxes. [OCR confidence: 78%]',
    extraction_method: 'ocr',
  },
  {
    evidence_id: 'EV-D-004',
    vendor_id: 'V-D',
    document_name: 'SwiftPack_RateCard.jpg',
    document_format: 'image',
    page_or_section: 'Rate card, Row 10 (Edge Protector)',
    original_text:
      'Edge protector 50x50 | ₹390/100pcs | min 10000pcs [OCR confidence: 89%]',
    extraction_method: 'ocr',
  },
  // ── Vendor E – QuickBox Express (Email, mixed units, reference) ────────────
  {
    evidence_id: 'EV-E-001',
    vendor_id: 'V-E',
    document_name: 'QuickBox_Email_14Jan2024.txt',
    document_format: 'email',
    page_or_section: 'Email body, paragraph 2',
    original_text:
      'For item 1 (5-ply box 400x300x250): ₹7.90 per piece. For items 3, 4, 21 and 26: same pricing structure as 2023 contract. Freight will be extra.',
    extraction_method: 'prose',
  },
  {
    evidence_id: 'EV-E-002',
    vendor_id: 'V-E',
    document_name: 'QuickBox_Email_14Jan2024.txt',
    document_format: 'email',
    page_or_section: 'Email body, paragraph 3',
    original_text:
      'Corrugated rolls (L09): ₹4,200/roll. Edge protectors (L10): ₹0.85/unit. Packing tape (L30): ₹38/roll. Rest same as last year.',
    extraction_method: 'prose',
  },
  {
    evidence_id: 'EV-E-003',
    vendor_id: 'V-E',
    document_name: 'QuickBox_Email_14Jan2024.txt',
    document_format: 'email',
    page_or_section: 'Email body, last paragraph',
    original_text:
      'Note: L22 (chips), L27 (anti-static) and L28 (tri-wall) not in our catalogue. Freight: extra charges as applicable. GST extra.',
    extraction_method: 'prose',
  },
];

export const EVIDENCE_MAP: Record<string, SourceEvidence> = Object.fromEntries(
  DEMO_EVIDENCE.map((e) => [e.evidence_id, e])
);
