import type { Quote } from '../schemas';

// FX rate: 1 USD = 84 INR (demo fixed rate)
const FX_RATE = 84;

// Helper to create a standard INR quote
function inr(
  id: string, vendor: string, line: string,
  price: number, uom: string, normalizedPrice: number, normalizedUom: string,
  confidence: Quote['confidence'],
  evidenceId: string,
  opts: Partial<Quote> = {}
): Quote {
  return {
    quote_id: id, rfx_id: 'rfx-001', line_id: line, vendor_id: vendor,
    status: 'comparable',
    ai_original_price: price, ai_original_currency: 'INR', ai_original_uom: uom,
    original_price: price, original_currency: 'INR', original_uom: uom,
    normalized_price: normalizedPrice, normalized_uom: normalizedUom,
    fx_rate: null, fx_note: null,
    discount: null,
    freight: { state: 'excluded', amount: null, note: 'Quoted separately' },
    lead_time_days: 5, payment_terms: 'Net 30', moq: null, quote_validity_days: 90,
    confidence, cannot_normalize_reason: null, extraction_notes: null,
    evidence_id: evidenceId, review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
    ...opts,
  };
}

// Helper for USD quotes (Vendor C)
function usd(
  id: string, vendor: string, line: string,
  usdPrice: number, uom: string, normalizedUom: string,
  confidence: Quote['confidence'],
  evidenceId: string,
  opts: Partial<Quote> = {}
): Quote {
  const inrPrice = parseFloat((usdPrice * FX_RATE).toFixed(2));
  return {
    quote_id: id, rfx_id: 'rfx-001', line_id: line, vendor_id: vendor,
    status: 'comparable',
    ai_original_price: usdPrice, ai_original_currency: 'USD', ai_original_uom: uom,
    original_price: usdPrice, original_currency: 'USD', original_uom: uom,
    normalized_price: inrPrice, normalized_uom: normalizedUom,
    fx_rate: FX_RATE, fx_note: `1 USD = ₹${FX_RATE} (Demo FX rate)`,
    discount: null,
    freight: { state: 'separate', amount: 8500, note: '₹8,500 flat per delivery to Hyderabad' },
    lead_time_days: 10, payment_terms: 'Net 45', moq: 10000, quote_validity_days: 60,
    confidence, cannot_normalize_reason: null, extraction_notes: null,
    evidence_id: evidenceId, review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
    ...opts,
  };
}

// Helper for not-quoted lines
function notQuoted(id: string, vendor: string, line: string): Quote {
  return {
    quote_id: id, rfx_id: 'rfx-001', line_id: line, vendor_id: vendor,
    status: 'not_quoted',
    ai_original_price: null, ai_original_currency: null, ai_original_uom: null,
    original_price: null, original_currency: null, original_uom: null,
    normalized_price: null, normalized_uom: null,
    fx_rate: null, fx_note: null,
    discount: null,
    freight: { state: 'unknown', amount: null, note: null },
    lead_time_days: null, payment_terms: null, moq: null, quote_validity_days: null,
    confidence: 'low', cannot_normalize_reason: null, extraction_notes: 'Not included in vendor response',
    evidence_id: null, review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
  };
}

// Helper for cannot-normalize
function cannotNormalize(id: string, vendor: string, line: string, price: number, uom: string, reason: string, evidenceId: string): Quote {
  return {
    quote_id: id, rfx_id: 'rfx-001', line_id: line, vendor_id: vendor,
    status: 'cannot_normalize',
    ai_original_price: price, ai_original_currency: 'INR', ai_original_uom: uom,
    original_price: price, original_currency: 'INR', original_uom: uom,
    normalized_price: null, normalized_uom: null,
    fx_rate: null, fx_note: null,
    discount: null,
    freight: { state: 'unknown', amount: null, note: 'Freight unclear' },
    lead_time_days: 4, payment_terms: 'Net 30', moq: null, quote_validity_days: 45,
    confidence: 'low', cannot_normalize_reason: reason, extraction_notes: reason,
    evidence_id: evidenceId, review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
  };
}

export const DEMO_QUOTES: Quote[] = [
  // ════════════════════════════════════════════════════════════════════
  // VENDOR A – PackPro Solutions (Excel, 30/30, INR, structured)
  // ════════════════════════════════════════════════════════════════════
  inr('Q-A-L01','V-A','L01', 7.80,'pieces', 7.80,'pieces','high','EV-A-001'),
  inr('Q-A-L02','V-A','L02', 14.50,'pieces',14.50,'pieces','high','EV-A-001'),
  inr('Q-A-L03','V-A','L03', 4.20,'pieces', 4.20,'pieces','high','EV-A-001'),
  inr('Q-A-L04','V-A','L04', 10.60,'pieces',10.60,'pieces','high','EV-A-001'),
  inr('Q-A-L05','V-A','L05', 2.10,'pieces', 2.10,'pieces','high','EV-A-001'),
  inr('Q-A-L06','V-A','L06', 1.40,'pieces', 1.40,'pieces','high','EV-A-001'),
  inr('Q-A-L07','V-A','L07', 5.90,'pieces', 5.90,'pieces','high','EV-A-001'),
  inr('Q-A-L08','V-A','L08', 8.70,'pieces', 8.70,'pieces','high','EV-A-001'),
  inr('Q-A-L09','V-A','L09', 3800,'rolls', 3800,'rolls','high','EV-A-001'),
  inr('Q-A-L10','V-A','L10', 0.95,'pieces', 0.95,'pieces','high','EV-A-003'),
  inr('Q-A-L11','V-A','L11', 245,'pieces', 245,'pieces','high','EV-A-001'),
  inr('Q-A-L12','V-A','L12', 11.20,'pieces',11.20,'pieces','high','EV-A-001'),
  inr('Q-A-L13','V-A','L13', 6.80,'sets',  6.80,'sets','high','EV-A-001'),
  inr('Q-A-L14','V-A','L14', 9.40,'sets',  9.40,'sets','high','EV-A-001'),
  inr('Q-A-L15','V-A','L15', 320,'pieces', 320,'pieces','high','EV-A-001'),
  inr('Q-A-L16','V-A','L16', 28.50,'pieces',28.50,'pieces','high','EV-A-001'),
  inr('Q-A-L17','V-A','L17', 3.20,'pieces', 3.20,'pieces','high','EV-A-001'),
  inr('Q-A-L18','V-A','L18', 4.80,'pieces', 4.80,'pieces','high','EV-A-001'),
  inr('Q-A-L19','V-A','L19', 12.50,'pieces',12.50,'pieces','high','EV-A-001'),
  inr('Q-A-L20','V-A','L20', 2.80,'pieces', 2.80,'pieces','high','EV-A-001'),
  inr('Q-A-L21','V-A','L21', 3.50,'pieces', 3.50,'pieces','high','EV-A-001'),
  inr('Q-A-L22','V-A','L22', 1650,'bags',  1650,'bags','high','EV-A-001'),
  inr('Q-A-L23','V-A','L23', 2900,'rolls', 2900,'rolls','high','EV-A-001'),
  inr('Q-A-L24','V-A','L24', 18.40,'pieces',18.40,'pieces','high','EV-A-001'),
  inr('Q-A-L25','V-A','L25', 1.60,'pieces', 1.60,'pieces','high','EV-A-001'),
  inr('Q-A-L26','V-A','L26', 8.90,'pieces', 8.90,'pieces','high','EV-A-001'),
  inr('Q-A-L27','V-A','L27', 45.00,'pieces',45.00,'pieces','high','EV-A-001'),
  inr('Q-A-L28','V-A','L28', 380,'pieces', 380,'pieces','high','EV-A-001'),
  inr('Q-A-L29','V-A','L29', 62.00,'pieces',62.00,'pieces','high','EV-A-001'),
  inr('Q-A-L30','V-A','L30', 36.00,'rolls', 36.00,'rolls','high','EV-A-001'),

  // ════════════════════════════════════════════════════════════════════
  // VENDOR B – BoxCraft Industries (PDF, 30/30, INR, footnote 5% conditional discount)
  // ════════════════════════════════════════════════════════════════════
  inr('Q-B-L01','V-B','L01', 7.50,'pieces',7.50,'pieces','high','EV-B-001',{
    discount: { type: 'conditional', value: 5, condition: 'Total PO value > ₹10,00,000', applied: false, note: '5% discount from footnote §3' },
    freight: { state: 'separate', amount: 6200, note: '₹6,200 per consignment to Hyderabad' },
    lead_time_days: 6, payment_terms: 'Net 30', moq: null, quote_validity_days: 90,
  }),
  inr('Q-B-L02','V-B','L02',13.80,'pieces',13.80,'pieces','high','EV-B-001',{
    discount: { type: 'conditional', value: 5, condition: 'Total PO value > ₹10,00,000', applied: false, note: '5% discount from footnote §3' },
    freight: { state: 'separate', amount: 6200, note: '₹6,200 per consignment to Hyderabad' },
    lead_time_days: 6,
  }),
  inr('Q-B-L03','V-B','L03', 3.90,'pieces',3.90,'pieces','high','EV-B-001',{
    discount: { type: 'conditional', value: 5, condition: 'Total PO value > ₹10,00,000', applied: false, note: '5% discount from footnote §3' },
    freight: { state: 'separate', amount: 6200, note: '₹6,200 per consignment' },
    lead_time_days: 6,
  }),
  inr('Q-B-L04','V-B','L04',10.10,'pieces',10.10,'pieces','high','EV-B-001',{ discount: { type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3' }, freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L05','V-B','L05', 1.95,'pieces',1.95,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L06','V-B','L06', 1.30,'pieces',1.30,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L07','V-B','L07', 5.60,'pieces',5.60,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L08','V-B','L08', 8.20,'pieces',8.20,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L09','V-B','L09', 3650,'rolls',3650,'rolls','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L10','V-B','L10', 0.88,'pieces',0.88,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L11','V-B','L11', 230,'pieces',230,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L12','V-B','L12',10.80,'pieces',10.80,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L13','V-B','L13', 6.50,'sets',6.50,'sets','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L14','V-B','L14', 9.10,'sets',9.10,'sets','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L15','V-B','L15', 305,'pieces',305,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L16','V-B','L16', 27.00,'pieces',27.00,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L17','V-B','L17', 3.00,'pieces',3.00,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L18','V-B','L18', 4.50,'pieces',4.50,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L19','V-B','L19',11.80,'pieces',11.80,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L20','V-B','L20', 2.60,'pieces',2.60,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L21','V-B','L21', 3.30,'pieces',3.30,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L22','V-B','L22', 1580,'bags',1580,'bags','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L23','V-B','L23', 2750,'rolls',2750,'rolls','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L24','V-B','L24',17.50,'pieces',17.50,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L25','V-B','L25', 1.50,'pieces',1.50,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L26','V-B','L26', 8.40,'pieces',8.40,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L27','V-B','L27',43.00,'pieces',43.00,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L28','V-B','L28', 360,'pieces',360,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L29','V-B','L29', 58.00,'pieces',58.00,'pieces','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),
  inr('Q-B-L30','V-B','L30', 34.00,'rolls',34.00,'rolls','high','EV-B-001',{ discount:{type:'conditional',value:5,condition:'Total PO value > ₹10,00,000',applied:false,note:'Footnote §3'},freight:{state:'separate',amount:6200,note:'₹6,200 per consignment'},lead_time_days:6}),

  // ════════════════════════════════════════════════════════════════════
  // VENDOR C – GlobalPack Ltd (PDF+DOCX, 28/30, USD pricing, freight in prose)
  // ════════════════════════════════════════════════════════════════════
  usd('Q-C-L01','V-C','L01', 0.094,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L02','V-C','L02', 0.178,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L03','V-C','L03', 0.052,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L04','V-C','L04', 0.131,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L05','V-C','L05', 0.026,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L06','V-C','L06', 0.018,'pieces','pieces','medium','EV-C-001'),
  usd('Q-C-L07','V-C','L07', 0.072,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L08','V-C','L08', 0.108,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L09','V-C','L09', 47.60,'rolls','rolls','high','EV-C-001'),
  usd('Q-C-L10','V-C','L10', 0.012,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L11','V-C','L11', 3.10,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L12','V-C','L12', 0.140,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L13','V-C','L13', 0.088,'sets','sets','high','EV-C-001'),
  usd('Q-C-L14','V-C','L14', 0.122,'sets','sets','high','EV-C-001'),
  usd('Q-C-L15','V-C','L15', 4.00,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L16','V-C','L16', 0.360,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L17','V-C','L17', 0.042,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L18','V-C','L18', 0.062,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L19','V-C','L19', 0.158,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L20','V-C','L20', 0.036,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L21','V-C','L21', 0.044,'pieces','pieces','high','EV-C-001'),
  // L22 NOT QUOTED – out of scope
  ...(['L22'] as const).map(l => notQuoted(`Q-C-${l}`,'V-C',l)),
  usd('Q-C-L23','V-C','L23', 36.80,'rolls','rolls','high','EV-C-001'),
  usd('Q-C-L24','V-C','L24', 0.232,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L25','V-C','L25', 0.020,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L26','V-C','L26', 0.112,'pieces','pieces','high','EV-C-001'),
  // L27 NOT QUOTED – anti-static out of scope
  ...(['L27'] as const).map(l => notQuoted(`Q-C-${l}`,'V-C',l)),
  usd('Q-C-L28','V-C','L28', 4.80,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L29','V-C','L29', 0.790,'pieces','pieces','high','EV-C-001'),
  usd('Q-C-L30','V-C','L30', 0.450,'rolls','rolls','high','EV-C-001'),

  // ════════════════════════════════════════════════════════════════════
  // VENDOR D – SwiftPack Co (Image/OCR, 29/30, unit ambiguity)
  // ════════════════════════════════════════════════════════════════════
  // L01: quoted as ₹820/box — "box" is ambiguous (could be 1 piece or bundle). OCR medium confidence.
  cannotNormalize('Q-D-L01','V-D','L01', 820,'box',
    'Unit "box" is ambiguous — could refer to 1 piece or a bundle. Cannot normalize without clarification.',
    'EV-D-001'),
  // L02: same ambiguity
  cannotNormalize('Q-D-L02','V-D','L02', 1200,'box',
    'Unit "box" is ambiguous — quantity per box unknown. Cannot normalize to pieces.',
    'EV-D-002'),
  // L03: 3-ply, straightforward per box ambiguity
  cannotNormalize('Q-D-L03','V-D','L03', 580,'box',
    'Unit "box" is ambiguous. Cannot normalize without pieces-per-box.',
    'EV-D-001'),
  // L04 onward — assume OCR extracted per-piece prices after "box" clarified as 1 piece
  inr('Q-D-L04','V-D','L04',10.90,'pieces',10.90,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Freight not specified in rate card'}, lead_time_days:4, payment_terms:'Net 30',status:'needs_review',extraction_notes:'OCR extraction; freight state unknown' }),
  inr('Q-D-L05','V-D','L05', 2.20,'pieces', 2.20,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Freight not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L06','V-D','L06', 1.45,'pieces', 1.45,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Freight not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L07','V-D','L07', 6.10,'pieces', 6.10,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Freight not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L08','V-D','L08', 8.90,'pieces', 8.90,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Freight not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L09','V-D','L09', 3950,'rolls', 3950,'rolls','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Freight not specified'}, lead_time_days:4, status:'needs_review'}),
  // L10: ₹390/100pcs → deterministic ₹3.90/piece
  inr('Q-D-L10','V-D','L10', 390,'100 pieces', 3.90,'pieces','medium','EV-D-004',{
    status:'comparable', extraction_notes:'₹390/100pcs → ₹3.90/piece (deterministic unit conversion)',
    freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4 }),
  inr('Q-D-L11','V-D','L11', 260,'pieces',260,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L12','V-D','L12',11.50,'pieces',11.50,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L13','V-D','L13', 7.10,'sets',  7.10,'sets','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L14','V-D','L14', 9.80,'sets',  9.80,'sets','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L15','V-D','L15', 340,'pieces', 340,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L16','V-D','L16', 30.00,'pieces',30.00,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L17','V-D','L17', 3.40,'pieces', 3.40,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L18','V-D','L18', 5.00,'pieces', 5.00,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L19','V-D','L19',13.20,'pieces',13.20,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L20','V-D','L20', 2.90,'pieces', 2.90,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L21','V-D','L21', 3.65,'pieces', 3.65,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L22','V-D','L22', 1720,'bags', 1720,'bags','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L23','V-D','L23', 3050,'rolls', 3050,'rolls','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L24','V-D','L24',19.50,'pieces',19.50,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L25','V-D','L25', 1.65,'pieces', 1.65,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L26','V-D','L26', 9.20,'pieces', 9.20,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L27','V-D','L27',47.00,'pieces',47.00,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  inr('Q-D-L28','V-D','L28', 395,'pieces', 395,'pieces','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),
  // L29: Not quoted (OCR missed row)
  notQuoted('Q-D-L29','V-D','L29'),
  inr('Q-D-L30','V-D','L30', 37.50,'rolls', 37.50,'rolls','medium','EV-D-001',{ freight:{state:'unknown',amount:null,note:'Not specified'}, lead_time_days:4, status:'needs_review'}),

  // ════════════════════════════════════════════════════════════════════
  // VENDOR E – QuickBox Express (Email, 27/30, mixed units, "rest same as last year")
  // ════════════════════════════════════════════════════════════════════
  inr('Q-E-L01','V-E','L01', 7.90,'pieces',7.90,'pieces','high','EV-E-001',{
    freight:{state:'excluded',amount:null,note:'Freight extra as stated in email'},
    lead_time_days: null, payment_terms:'Net 45',
  }),
  // L02 – "same as last year" — ambiguous reference, cannot confirm
  {
    quote_id:'Q-E-L02', rfx_id:'rfx-001', line_id:'L02', vendor_id:'V-E',
    status: 'needs_review',
    ai_original_price: null, ai_original_currency: 'INR', ai_original_uom: 'pieces',
    original_price: null, original_currency: 'INR', original_uom: 'pieces',
    normalized_price: null, normalized_uom: 'pieces',
    fx_rate: null, fx_note: null,
    discount: null,
    freight: {state:'excluded',amount:null,note:'Freight extra'},
    lead_time_days: null, payment_terms:'Net 45', moq: null, quote_validity_days: null,
    confidence: 'low',
    cannot_normalize_reason: null,
    extraction_notes: '"Rest same as last year" — no previous contract data available to resolve this reference.',
    evidence_id: 'EV-E-001', review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
  },
  // L03 – "same pricing structure as 2023 contract"
  {
    quote_id:'Q-E-L03', rfx_id:'rfx-001', line_id:'L03', vendor_id:'V-E',
    status: 'needs_review',
    ai_original_price: null, ai_original_currency: 'INR', ai_original_uom: 'pieces',
    original_price: null, original_currency: 'INR', original_uom: 'pieces',
    normalized_price: null, normalized_uom: 'pieces',
    fx_rate: null, fx_note: null,
    discount: null,
    freight: {state:'excluded',amount:null,note:'Freight extra'},
    lead_time_days: null, payment_terms:'Net 45', moq: null, quote_validity_days: null,
    confidence: 'low',
    cannot_normalize_reason: null,
    extraction_notes: '"Same pricing structure as 2023 contract" — no 2023 contract data available to resolve.',
    evidence_id: 'EV-E-001', review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
  },
  // L04 – "same pricing structure as 2023 contract"
  {
    quote_id:'Q-E-L04', rfx_id:'rfx-001', line_id:'L04', vendor_id:'V-E',
    status: 'needs_review',
    ai_original_price: null, ai_original_currency: 'INR', ai_original_uom: 'pieces',
    original_price: null, original_currency: 'INR', original_uom: 'pieces',
    normalized_price: null, normalized_uom: 'pieces',
    fx_rate: null, fx_note: null,
    discount: null,
    freight: {state:'excluded',amount:null,note:'Freight extra'},
    lead_time_days: null, payment_terms:'Net 45', moq: null, quote_validity_days: null,
    confidence: 'low',
    cannot_normalize_reason: null,
    extraction_notes: '"Same pricing structure as 2023 contract" — unresolvable reference.',
    evidence_id: 'EV-E-001', review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
  },
  inr('Q-E-L05','V-E','L05', 2.15,'pieces',2.15,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L06','V-E','L06', 1.38,'pieces',1.38,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L07','V-E','L07', 5.80,'pieces',5.80,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L08','V-E','L08', 8.50,'pieces',8.50,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L09','V-E','L09', 4200,'rolls',4200,'rolls','high','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L10','V-E','L10', 0.85,'pieces',0.85,'pieces','high','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L11','V-E','L11', 255,'pieces',255,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L12','V-E','L12',11.00,'pieces',11.00,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L13','V-E','L13', 6.90,'sets',6.90,'sets','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L14','V-E','L14', 9.50,'sets',9.50,'sets','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L15','V-E','L15', 315,'pieces',315,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L16','V-E','L16', 29.00,'pieces',29.00,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L17','V-E','L17', 3.10,'pieces',3.10,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L18','V-E','L18', 4.70,'pieces',4.70,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L19','V-E','L19',12.80,'pieces',12.80,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L20','V-E','L20', 2.75,'pieces',2.75,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  // L21 – "same pricing structure as 2023 contract"
  {
    quote_id:'Q-E-L21', rfx_id:'rfx-001', line_id:'L21', vendor_id:'V-E',
    status: 'needs_review',
    ai_original_price: null, ai_original_currency: 'INR', ai_original_uom: 'pieces',
    original_price: null, original_currency: 'INR', original_uom: 'pieces',
    normalized_price: null, normalized_uom: 'pieces',
    fx_rate: null, fx_note: null, discount: null,
    freight: {state:'excluded',amount:null,note:'Freight extra'},
    lead_time_days: null, payment_terms:'Net 45', moq: null, quote_validity_days: null,
    confidence: 'low', cannot_normalize_reason: null,
    extraction_notes: '"Same pricing structure as 2023 contract" — unresolvable.',
    evidence_id: 'EV-E-001', review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
  },
  // L22 – Not in catalogue
  notQuoted('Q-E-L22','V-E','L22'),
  inr('Q-E-L23','V-E','L23', 3100,'rolls',3100,'rolls','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L24','V-E','L24',18.90,'pieces',18.90,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L25','V-E','L25', 1.55,'pieces',1.55,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  // L26 – "same pricing structure as 2023 contract"
  {
    quote_id:'Q-E-L26', rfx_id:'rfx-001', line_id:'L26', vendor_id:'V-E',
    status: 'needs_review',
    ai_original_price: null, ai_original_currency: 'INR', ai_original_uom: 'pieces',
    original_price: null, original_currency: 'INR', original_uom: 'pieces',
    normalized_price: null, normalized_uom: 'pieces',
    fx_rate: null, fx_note: null, discount: null,
    freight: {state:'excluded',amount:null,note:'Freight extra'},
    lead_time_days: null, payment_terms:'Net 45', moq: null, quote_validity_days: null,
    confidence: 'low', cannot_normalize_reason: null,
    extraction_notes: '"Rest same as last year" — unresolvable reference.',
    evidence_id: 'EV-E-002', review_status: 'pending',
    buyer_corrected_price: null, buyer_correction_note: null,
  },
  // L27 – Not in catalogue
  notQuoted('Q-E-L27','V-E','L27'),
  // L28 – Not in catalogue
  notQuoted('Q-E-L28','V-E','L28'),
  inr('Q-E-L29','V-E','L29',63.00,'pieces',63.00,'pieces','medium','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
  inr('Q-E-L30','V-E','L30',38.00,'rolls',38.00,'rolls','high','EV-E-002',{ freight:{state:'excluded',amount:null,note:'Freight extra'}, lead_time_days:null }),
];

// Index by vendor+line for O(1) lookup
export const QUOTE_MAP: Record<string, Quote> = Object.fromEntries(
  DEMO_QUOTES.map((q) => [`${q.vendor_id}-${q.line_id}`, q])
);

export const FX_RATE_DEMO = FX_RATE;
