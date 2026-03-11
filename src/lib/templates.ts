export interface TemplateData {
  client_name: string;
  client_email: string;
  client_phone: string;
  project_address: string;
  project_type: string;
  designer_name: string;
  designer_email: string;
  designer_phone: string;
  logo_url: string;
  accent_color: string;
  notes: string;
  payment_terms: string;
  tax_rate: number;
  created_at: string;
  rooms: { name: string; square_footage: number }[];
  line_items: { item_name: string; quantity: number; unit_price: number }[];
  // New fields
  studio_name?: string;
  project_size?: string;
  services_included?: string[];
  quotation_validity?: number;
  estimated_start_date?: string;
  estimated_timeline?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCommonData(data: TemplateData) {
  const subtotal = data.line_items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const taxAmount = subtotal * (data.tax_rate / 100);
  const grandTotal = subtotal + taxAmount;
  const totalSqFt = data.rooms.reduce((s, r) => s + r.square_footage, 0);
  return { subtotal, taxAmount, grandTotal, totalSqFt };
}

function roomsSummary(data: TemplateData): string {
  if (data.rooms.length === 0) return '';
  return data.rooms.map(r => `${r.name} (${r.square_footage} sq.ft)`).join(', ');
}

// Shared body HTML builder (used by all templates)
function buildBody(data: TemplateData, cfg: {
  accent: string;
  labelClass: string;
  nameClass: string;
  detailClass: string;
  sectionTitleTag: string;
  tableHeaderBg: string;
  tableHeaderColor: string;
  evenRowBg: string;
  totalHighlightBg: string;
  totalHighlightColor: string;
  totalHighlightLabelColor: string;
  sigLineBorder: string;
  sigLabelColor: string;
  footerText: string;
}) {
  const { subtotal, taxAmount, grandTotal } = getCommonData(data);

  const designerInfo = [
    data.designer_name ? `<div class="info-line"><strong>${data.designer_name}</strong></div>` : '',
    data.designer_email ? `<div class="info-line">${data.designer_email}</div>` : '',
    data.designer_phone ? `<div class="info-line">${data.designer_phone}</div>` : '',
  ].filter(Boolean).join('\n');

  const quotationDetails = [
    `<div class="info-line"><strong>Date:</strong> ${formatDate(data.created_at)}</div>`,
    `<div class="info-line"><strong>Project:</strong> ${data.project_type}</div>`,
    data.project_size ? `<div class="info-line"><strong>Area:</strong> ${data.project_size} sq.ft</div>` : '',
    data.project_address ? `<div class="info-line"><strong>Location:</strong> ${data.project_address}</div>` : '',
    roomsSummary(data) ? `<div class="info-line"><strong>Rooms:</strong> ${roomsSummary(data)}</div>` : '',
  ].filter(Boolean).join('\n');

  const clientDetails = [
    data.client_email ? `<div class="client-detail">${data.client_email}</div>` : '',
    data.client_phone ? `<div class="client-detail">${data.client_phone}</div>` : '',
  ].filter(Boolean).join('\n');

  const tableRows = data.line_items.map((i, idx) => `
    <tr${idx % 2 === 1 ? ' class="even"' : ''}>
      <td class="name">${i.item_name}</td>
      <td class="r">${formatCurrency(i.unit_price)}</td>
      <td class="r">${i.quantity}</td>
      <td class="r amt">${formatCurrency(i.quantity * i.unit_price)}</td>
    </tr>`).join('');

  return `
  <!-- Header -->
  <div class="header">
    <div class="header-left">
      ${data.logo_url ? `<img src="${data.logo_url}" class="header-logo" />` : ''}
      <div class="company-name">${data.designer_name || 'Interior Design Studio'}</div>
    </div>
    <div class="doc-title">QUOTATION</div>
  </div>
  <div class="header-line"></div>

  <!-- Info Columns -->
  <div class="info-row">
    <div class="info-block">
      <div class="section-label">Quotation Details</div>
      ${quotationDetails}
    </div>
    <div class="info-block right">
      <div class="section-label">Prepared By</div>
      ${designerInfo}
    </div>
  </div>

  <!-- Client -->
  <div class="client-section">
    <div class="section-label">Quotation To</div>
    <div class="client-name">${data.client_name}</div>
    ${clientDetails}
  </div>

  <!-- Pricing Table -->
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="r" style="width:80px">Price</th>
        <th class="r" style="width:40px">Qty</th>
        <th class="r" style="width:95px">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="totals">
      <div class="total-row"><span class="total-label">Subtotal</span><span class="total-value">${formatCurrency(subtotal)}</span></div>
      <div class="total-row"><span class="total-label">Tax (${data.tax_rate}%)</span><span class="total-value">${formatCurrency(taxAmount)}</span></div>
      <div class="total-row highlight"><span class="total-label">Total Amount</span><span class="total-value">${formatCurrency(grandTotal)}</span></div>
    </div>
  </div>

  <!-- Services Included -->
  ${data.services_included && data.services_included.length > 0 ? `
  <div class="terms-section">
    <div class="terms-title">Services Included</div>
    <div class="terms-text">${data.services_included.map(s => `• ${s}`).join('<br/>')}</div>
  </div>` : ''}

  <!-- Timeline -->
  ${data.estimated_start_date || data.estimated_timeline ? `
  <div class="terms-section">
    <div class="terms-title">Project Timeline</div>
    <div class="terms-text">
      ${data.estimated_start_date ? `<strong>Estimated Start:</strong> ${formatDate(data.estimated_start_date)}<br/>` : ''}
      ${data.estimated_timeline ? data.estimated_timeline.split('\n').join('<br/>') : ''}
    </div>
  </div>` : ''}

  <!-- Terms & Notes -->
  ${data.payment_terms ? `
  <div class="terms-section">
    <div class="terms-title">Terms & Conditions</div>
    <div class="terms-text">${data.payment_terms}</div>
  </div>` : ''}
  ${data.quotation_validity ? `
  <div class="terms-section">
    <div class="terms-title">Quotation Validity</div>
    <div class="terms-text">This quotation is valid for <strong>${data.quotation_validity} days</strong> from the date of issue.</div>
  </div>` : ''}
  ${data.notes ? `
  <div class="terms-section">
    <div class="terms-title">Notes</div>
    <div class="terms-text">${data.notes}</div>
  </div>` : ''}

  <!-- Client Acceptance -->
  <div class="terms-section">
    <div class="terms-title">Client Acceptance</div>
    <div class="terms-text" style="font-style:italic;opacity:0.8">By signing below, the client acknowledges and agrees to the scope, pricing, and terms outlined in this proposal.</div>
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-block">
      <div class="sig-space"></div>
      <div class="sig-line"></div>
      <div class="sig-label">Designer Signature</div>
      <div class="sig-name">${data.designer_name || 'Designer'}</div>
    </div>
    <div class="sig-block">
      <div class="sig-space"></div>
      <div class="sig-line"></div>
      <div class="sig-label">Client Acceptance</div>
      <div class="sig-name">${data.client_name}</div>
    </div>
  </div>

  <div class="footer">${cfg.footerText}</div>`;
}


// ============================================================
// TEMPLATE 1 — MODERN MINIMAL
// Clean, white, Inter font. Inspired by Stripe/Notion/Apple.
// ============================================================
export function minimalTemplate(data: TemplateData): string {
  const accent = data.accent_color || '#2563EB';

  const body = buildBody(data, {
    accent,
    labelClass: 'section-label',
    nameClass: 'client-name',
    detailClass: 'client-detail',
    sectionTitleTag: 'div',
    tableHeaderBg: accent,
    tableHeaderColor: '#fff',
    evenRowBg: '#f8fafc',
    totalHighlightBg: accent,
    totalHighlightColor: '#fff',
    totalHighlightLabelColor: 'rgba(255,255,255,0.85)',
    sigLineBorder: '#e2e8f0',
    sigLabelColor: '#94a3b8',
    footerText: `${data.designer_name || 'Interior Design Studio'} · Generated with Kalvora`,
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 20mm 0mm 15mm 0mm; }
  @page :first { margin-top: 0; }
  .terms-section, .sig-row, .client-section { page-break-inside: avoid; }
  thead { display: table-header-group; }
  tbody tr { page-break-inside: avoid; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1e293b; font-size: 10.5px; line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 36px 44px 28px;
    margin: 0 auto; position: relative; background: #ffffff;
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
  .header-left { display: flex; align-items: center; gap: 12px; }
  .header-logo { max-height: 40px; max-width: 140px; object-fit: contain; }
  .company-name { font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
  .doc-title {
    font-size: 11px; font-weight: 700; letter-spacing: 3px; color: ${accent};
    text-transform: uppercase; padding: 6px 16px; border: 2px solid ${accent};
    border-radius: 6px;
  }
  .header-line { height: 2px; background: linear-gradient(90deg, ${accent}, ${accent}40, transparent); margin: 12px 0 18px; border-radius: 1px; }

  /* Sections */
  .section-label {
    font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2.5px; color: ${accent}; margin-bottom: 6px;
  }

  /* Info */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
  .info-block { }
  .info-block.right { text-align: right; }
  .info-line { font-size: 10.5px; color: #475569; line-height: 1.7; }
  .info-line strong { font-weight: 600; color: #0f172a; }

  /* Client */
  .client-section {
    margin-bottom: 16px; padding: 12px 16px;
    background: #f8fafc; border-radius: 8px; border-left: 3px solid ${accent};
  }
  .client-name { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
  .client-detail { font-size: 10.5px; color: #64748b; line-height: 1.6; }

  /* Table */
  table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; border-radius: 8px; overflow: hidden; }
  thead th {
    background: ${accent}; color: #fff; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; padding: 10px 14px;
    text-align: left; border: none;
  }
  thead th.r { text-align: right; }
  tbody td {
    padding: 9px 14px; font-size: 10.5px; color: #475569;
    border-bottom: 1px solid #f1f5f9;
  }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 600; color: #1e293b; }
  tbody td.amt { font-weight: 700; color: #0f172a; }
  tbody tr.even td { background: #f8fafc; }
  tbody tr:last-child td { border-bottom: none; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin: 2px 0 16px; }
  .totals { width: 250px; }
  .total-row {
    display: flex; justify-content: space-between; padding: 6px 14px; font-size: 10.5px;
  }
  .total-label { color: #94a3b8; font-weight: 500; }
  .total-value { font-weight: 600; color: #1e293b; }
  .total-row.highlight {
    background: ${accent}; color: #fff; font-weight: 700;
    font-size: 13px; border-radius: 6px; margin-top: 4px; padding: 8px 14px;
  }
  .total-row.highlight .total-label { color: rgba(255,255,255,0.85); }
  .total-row.highlight .total-value { color: #fff; }

  /* Terms */
  .terms-section { margin-bottom: 12px; }
  .terms-title {
    font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: ${accent}; margin-bottom: 4px;
  }
  .terms-text { font-size: 9.5px; color: #64748b; line-height: 1.7; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 48px; margin-top: 20px; }
  .sig-block { flex: 1; }
  .sig-space { height: 28px; }
  .sig-line { border-top: 1px solid #e2e8f0; padding-top: 6px; }
  .sig-label { font-size: 8px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
  .sig-name { font-size: 10.5px; color: #475569; font-weight: 600; margin-top: 2px; }

  /* Footer */
  .footer {
    position: absolute; bottom: 20px; left: 44px; right: 44px;
    text-align: center; font-size: 8px; color: #cbd5e1;
    border-top: 1px solid #f1f5f9; padding-top: 8px; letter-spacing: 0.5px;
  }
</style>
</head>
<body>
<div class="page">
${body}
</div>
</body>
</html>`;
}


// ============================================================
// TEMPLATE 2 — LUXURY DESIGN STUDIO
// Warm ivory, Playfair Display serif, gold accents, premium feel.
// ============================================================
export function luxuryTemplate(data: TemplateData): string {
  const gold = '#B8963E';
  const dark = '#1C1917';
  const cream = '#FAF8F4';

  const body = buildBody(data, {
    accent: gold,
    labelClass: 'section-label',
    nameClass: 'client-name',
    detailClass: 'client-detail',
    sectionTitleTag: 'div',
    tableHeaderBg: dark,
    tableHeaderColor: gold,
    evenRowBg: '#F5F0E8',
    totalHighlightBg: dark,
    totalHighlightColor: gold,
    totalHighlightLabelColor: '#a8a29e',
    sigLineBorder: `${gold}50`,
    sigLabelColor: gold,
    footerText: `${data.designer_name || 'Design Studio'} · Generated with Kalvora`,
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 20mm 0mm 15mm 0mm; }
  @page :first { margin-top: 0; }
  .terms-section, .sig-row, .client-section { page-break-inside: avoid; }
  thead { display: table-header-group; }
  tbody tr { page-break-inside: avoid; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: ${dark}; font-size: 10.5px; line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 36px 44px 28px;
    margin: 0 auto; position: relative; background: ${cream};
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
  .header-left { display: flex; align-items: center; gap: 14px; }
  .header-logo { max-height: 44px; max-width: 150px; object-fit: contain; }
  .company-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px; font-weight: 700; color: ${dark}; letter-spacing: 0.5px;
  }
  .doc-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 20px; font-weight: 600; color: ${gold}; letter-spacing: 2px;
  }
  .header-line {
    height: 1px; background: ${gold}; margin: 10px 0 18px;
    position: relative;
  }
  .header-line::after {
    content: '◆'; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); background: ${cream};
    padding: 0 10px; color: ${gold}; font-size: 7px;
  }

  /* Sections */
  .section-label {
    font-size: 7.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 3px; color: ${gold}; margin-bottom: 6px;
  }

  /* Info */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
  .info-block { }
  .info-block.right { text-align: right; }
  .info-line { font-size: 10.5px; color: #57534e; line-height: 1.7; }
  .info-line strong { font-weight: 600; color: ${dark}; }

  /* Client */
  .client-section {
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1px solid #E8DCC8;
  }
  .client-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 16px; font-weight: 600; color: ${dark}; margin-bottom: 2px;
  }
  .client-detail { font-size: 10.5px; color: #78716c; line-height: 1.6; }

  /* Table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
  thead th {
    background: ${dark}; color: ${gold}; font-size: 7.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2.5px; padding: 10px 14px;
    text-align: left;
  }
  thead th.r { text-align: right; }
  tbody td {
    padding: 9px 14px; font-size: 10.5px; color: #44403c;
    border-bottom: 1px solid #E8DCC8;
  }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 500; color: ${dark}; }
  tbody td.amt { font-weight: 700; color: ${dark}; }
  tbody tr.even td { background: #F5F0E8; }
  tbody tr:last-child td { border-bottom: none; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin: 2px 0 16px; }
  .totals { width: 250px; }
  .total-row { display: flex; justify-content: space-between; padding: 6px 14px; font-size: 10.5px; }
  .total-label { color: #a8a29e; font-weight: 500; }
  .total-value { font-weight: 600; color: ${dark}; }
  .total-row.highlight {
    background: ${dark}; color: ${gold}; font-weight: 700;
    font-size: 13px; margin-top: 4px; padding: 9px 14px;
  }
  .total-row.highlight .total-label { color: #a8a29e; }
  .total-row.highlight .total-value {
    color: ${gold}; font-family: 'Playfair Display', Georgia, serif;
    font-size: 14px;
  }

  /* Terms */
  .terms-section { margin-bottom: 12px; }
  .terms-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 12px; font-weight: 600; color: ${dark}; margin-bottom: 4px;
  }
  .terms-text { font-size: 9.5px; color: #78716c; line-height: 1.7; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 48px; margin-top: 20px; }
  .sig-block { flex: 1; }
  .sig-space { height: 28px; }
  .sig-line { border-top: 1px solid ${gold}50; padding-top: 6px; }
  .sig-label {
    font-size: 7.5px; color: ${gold}; text-transform: uppercase;
    letter-spacing: 2.5px; font-weight: 700;
  }
  .sig-name { font-size: 10.5px; color: #44403c; font-weight: 600; margin-top: 2px; }

  /* Footer */
  .footer {
    position: absolute; bottom: 20px; left: 44px; right: 44px;
    text-align: center; font-size: 8px; color: #d6d3d1;
    border-top: 1px solid #E8DCC8; padding-top: 8px; letter-spacing: 1px;
  }
</style>
</head>
<body>
<div class="page">
${body}
</div>
</body>
</html>`;
}


// ============================================================
// TEMPLATE 3 — CORPORATE PROFESSIONAL
// Structured, confident, business-grade. Bold header bar.
// ============================================================
export function modernTemplate(data: TemplateData): string {
  const accent = data.accent_color || '#4c6ef5';

  const body = buildBody(data, {
    accent,
    labelClass: 'section-label',
    nameClass: 'client-name',
    detailClass: 'client-detail',
    sectionTitleTag: 'div',
    tableHeaderBg: accent,
    tableHeaderColor: '#fff',
    evenRowBg: '#f5f6fa',
    totalHighlightBg: accent,
    totalHighlightColor: '#fff',
    totalHighlightLabelColor: 'rgba(255,255,255,0.8)',
    sigLineBorder: '#e5e7eb',
    sigLabelColor: accent,
    footerText: `${data.designer_name || 'Interior Design Studio'} · Generated with Kalvora`,
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 20mm 0mm 15mm 0mm; }
  @page :first { margin-top: 0; }
  .terms-section, .sig-row, .client-section { page-break-inside: avoid; }
  thead { display: table-header-group; }
  tbody tr { page-break-inside: avoid; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1f2937; font-size: 10.5px; line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 0 0 28px;
    margin: 0 auto; position: relative; background: #ffffff;
  }

  /* Bold Header Bar */
  .top-bar {
    background: ${accent}; padding: 20px 44px; display: flex;
    justify-content: space-between; align-items: center;
    margin-bottom: 20px;
  }
  .top-bar .header-left { display: flex; align-items: center; gap: 12px; }
  .top-bar .header-logo { max-height: 36px; max-width: 120px; object-fit: contain; }
  .top-bar .company-name { font-size: 17px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .top-bar .doc-title {
    font-size: 11px; font-weight: 700; letter-spacing: 3px; color: rgba(255,255,255,0.9);
    text-transform: uppercase;
  }

  /* Override header for corporate — use top-bar instead */
  .header { display: none; }
  .header-line { display: none; }

  .content { padding: 0 44px; }

  /* Sections */
  .section-label {
    font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: ${accent}; margin-bottom: 6px;
    padding-bottom: 4px; border-bottom: 2px solid ${accent}20;
    display: inline-block;
  }

  /* Info */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
  .info-block { }
  .info-block.right { text-align: right; }
  .info-line { font-size: 10.5px; color: #4b5563; line-height: 1.7; }
  .info-line strong { font-weight: 600; color: #111827; }

  /* Client */
  .client-section {
    margin-bottom: 16px; padding: 12px 16px;
    background: #f9fafb; border-radius: 6px;
    border: 1px solid #e5e7eb;
  }
  .client-name { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 2px; }
  .client-detail { font-size: 10.5px; color: #6b7280; line-height: 1.6; }

  /* Table */
  table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
  thead th {
    background: ${accent}; color: #fff; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; padding: 10px 14px;
    text-align: left;
  }
  thead th.r { text-align: right; }
  tbody td {
    padding: 9px 14px; font-size: 10.5px; color: #4b5563;
    border-bottom: 1px solid #f3f4f6;
  }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 600; color: #1f2937; }
  tbody td.amt { font-weight: 700; color: #111827; }
  tbody tr.even td { background: #f9fafb; }
  tbody tr:last-child td { border-bottom: none; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin: 2px 0 16px; }
  .totals { width: 250px; }
  .total-row { display: flex; justify-content: space-between; padding: 6px 14px; font-size: 10.5px; }
  .total-label { color: #9ca3af; font-weight: 500; }
  .total-value { font-weight: 600; color: #1f2937; }
  .total-row.highlight {
    background: ${accent}; color: #fff; font-weight: 700;
    font-size: 13px; border-radius: 6px; margin-top: 4px; padding: 8px 14px;
  }
  .total-row.highlight .total-label { color: rgba(255,255,255,0.8); }
  .total-row.highlight .total-value { color: #fff; font-weight: 800; }

  /* Terms */
  .terms-section { margin-bottom: 12px; }
  .terms-title {
    font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: ${accent}; margin-bottom: 4px;
  }
  .terms-text { font-size: 9.5px; color: #6b7280; line-height: 1.7; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 48px; margin-top: 20px; }
  .sig-block { flex: 1; }
  .sig-space { height: 28px; }
  .sig-line { border-top: 2px solid #e5e7eb; padding-top: 6px; }
  .sig-label { font-size: 8px; color: ${accent}; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
  .sig-name { font-size: 10.5px; color: #4b5563; font-weight: 600; margin-top: 2px; }

  /* Footer */
  .footer {
    position: absolute; bottom: 16px; left: 44px; right: 44px;
    text-align: center; font-size: 8px; color: #d1d5db;
    border-top: 1px solid #f3f4f6; padding-top: 8px; letter-spacing: 0.5px;
  }
</style>
</head>
<body>
<div class="page">
  <!-- Corporate Top Bar -->
  <div class="top-bar">
    <div class="header-left">
      ${data.logo_url ? `<img src="${data.logo_url}" class="header-logo" />` : ''}
      <div class="company-name">${data.designer_name || 'Interior Design Studio'}</div>
    </div>
    <div class="doc-title">QUOTATION</div>
  </div>
  <div class="content">
${body.replace('<!-- Header -->', '').replace(/<div class="header">[\s\S]*?<div class="header-line"><\/div>/, '')}
  </div>
</div>
</body>
</html>`;
}


// ============================================================
// TEMPLATE 4 — ARCHITECTURAL BLUEPRINT
// Navy blueprint palette, grid background, section numbers,
// Space Grotesk headings, Inter body. Technical/engineering feel.
// ============================================================
export function blueprintTemplate(data: TemplateData): string {
  const navy = '#1a365d';
  const navyLight = '#2c5282';
  const gridColor = 'rgba(26,54,93,0.06)';
  const lineColor = '#bee3f8';
  const bgColor = '#f7fafc';

  const { subtotal, taxAmount, grandTotal } = getCommonData(data);

  const designerInfo = [
    data.designer_name ? `<div class="info-line"><strong>${data.designer_name}</strong></div>` : '',
    data.designer_email ? `<div class="info-line">${data.designer_email}</div>` : '',
    data.designer_phone ? `<div class="info-line">${data.designer_phone}</div>` : '',
  ].filter(Boolean).join('\n');

  const quotationDetails = [
    `<div class="info-line"><strong>Date:</strong> ${formatDate(data.created_at)}</div>`,
    `<div class="info-line"><strong>Project:</strong> ${data.project_type}</div>`,
    data.project_address ? `<div class="info-line"><strong>Location:</strong> ${data.project_address}</div>` : '',
    roomsSummary(data) ? `<div class="info-line"><strong>Rooms:</strong> ${roomsSummary(data)}</div>` : '',
  ].filter(Boolean).join('\n');

  const clientDetails = [
    data.client_email ? `<div class="client-detail">${data.client_email}</div>` : '',
    data.client_phone ? `<div class="client-detail">${data.client_phone}</div>` : '',
  ].filter(Boolean).join('\n');

  const tableRows = data.line_items.map((i, idx) => `
    <tr${idx % 2 === 1 ? ' class="even"' : ''}>
      <td class="name">${i.item_name}</td>
      <td class="r">${formatCurrency(i.unit_price)}</td>
      <td class="r">${i.quantity}</td>
      <td class="r amt">${formatCurrency(i.quantity * i.unit_price)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 20mm 0mm 15mm 0mm; }
  @page :first { margin-top: 0; }
  .terms-section, .sig-row, .client-section { page-break-inside: avoid; }
  thead { display: table-header-group; }
  tbody tr { page-break-inside: avoid; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1a202c; font-size: 10.5px; line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 36px 44px 28px;
    margin: 0 auto; position: relative; background: ${bgColor};
    background-image:
      repeating-linear-gradient(0deg, ${gridColor} 0px, ${gridColor} 1px, transparent 1px, transparent 40px),
      repeating-linear-gradient(90deg, ${gridColor} 0px, ${gridColor} 1px, transparent 1px, transparent 40px);
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
  .header-left { display: flex; align-items: center; gap: 12px; }
  .header-logo { max-height: 40px; max-width: 140px; object-fit: contain; }
  .company-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 20px; font-weight: 700; color: ${navy}; letter-spacing: -0.3px;
  }
  .doc-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 4px; color: #fff;
    text-transform: uppercase; padding: 6px 16px; background: ${navy};
    border-radius: 2px;
  }
  .header-line { height: 2px; background: ${navy}; margin: 10px 0 18px; }

  /* Section Numbers */
  .sec-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 9px; font-weight: 700; color: ${navyLight};
    letter-spacing: 1px; margin-bottom: 2px;
  }
  .section-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2.5px; color: ${navy}; margin-bottom: 6px;
  }

  /* Info */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
  .info-block { }
  .info-block.right { text-align: right; }
  .info-line { font-size: 10.5px; color: #4a5568; line-height: 1.7; }
  .info-line strong { font-weight: 600; color: #1a202c; }

  /* Client */
  .client-section {
    margin-bottom: 16px; padding: 10px 14px;
    border: 1px solid ${lineColor}; border-left: 3px solid ${navy};
    background: rgba(255,255,255,0.7);
  }
  .client-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px; font-weight: 700; color: ${navy}; margin-bottom: 2px;
  }
  .client-detail { font-size: 10.5px; color: #718096; line-height: 1.6; }

  /* Table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 0; border: 1px solid ${lineColor}; }
  thead th {
    background: ${navy}; color: #e2e8f0; font-size: 8px; font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase; letter-spacing: 2px; padding: 9px 14px;
    text-align: left; border: none;
  }
  thead th.r { text-align: right; }
  tbody td {
    padding: 8px 14px; font-size: 10.5px; color: #4a5568;
    border-bottom: 1px solid ${lineColor};
  }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 600; color: #1a202c; }
  tbody td.amt { font-weight: 700; color: ${navy}; }
  tbody tr.even td { background: rgba(255,255,255,0.5); }
  tbody tr:last-child td { border-bottom: none; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin: 2px 0 16px; }
  .totals { width: 260px; border: 1px solid ${lineColor}; background: rgba(255,255,255,0.7); }
  .total-row { display: flex; justify-content: space-between; padding: 6px 14px; font-size: 10.5px; }
  .total-label { color: #a0aec0; font-weight: 500; }
  .total-value { font-weight: 600; color: #1a202c; }
  .total-row.highlight {
    background: ${navy}; color: #fff; font-weight: 700;
    font-size: 13px; padding: 9px 14px;
  }
  .total-row.highlight .total-label { color: #bee3f8; }
  .total-row.highlight .total-value {
    color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 14px;
  }

  /* Terms */
  .terms-section { margin-bottom: 12px; }
  .terms-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: ${navy}; margin-bottom: 4px;
  }
  .terms-text { font-size: 9.5px; color: #718096; line-height: 1.7; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 48px; margin-top: 20px; }
  .sig-block { flex: 1; }
  .sig-space { height: 28px; }
  .sig-line { border-top: 1px solid ${lineColor}; padding-top: 6px; }
  .sig-label { font-size: 8px; color: ${navyLight}; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
  .sig-name { font-size: 10.5px; color: #4a5568; font-weight: 600; margin-top: 2px; }

  /* Footer */
  .footer {
    position: absolute; bottom: 20px; left: 44px; right: 44px;
    text-align: center; font-size: 8px; color: #cbd5e0;
    border-top: 1px solid ${lineColor}; padding-top: 8px; letter-spacing: 0.5px;
  }

  .divider { height: 1px; background: ${lineColor}; margin: 4px 0 12px; }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="header-left">
      ${data.logo_url ? `<img src="${data.logo_url}" class="header-logo" />` : ''}
      <div class="company-name">${data.designer_name || 'Interior Design Studio'}</div>
    </div>
    <div class="doc-title">QUOTATION</div>
  </div>
  <div class="header-line"></div>

  <!-- 01 Quotation Details + Prepared By -->
  <div class="sec-num">01</div>
  <div class="info-row">
    <div class="info-block">
      <div class="section-label">Quotation Details</div>
      ${quotationDetails}
    </div>
    <div class="info-block right">
      <div class="section-label">Prepared By</div>
      ${designerInfo}
    </div>
  </div>

  <div class="divider"></div>

  <!-- 02 Client -->
  <div class="sec-num">02</div>
  <div class="client-section">
    <div class="section-label">Quotation To</div>
    <div class="client-name">${data.client_name}</div>
    ${clientDetails}
  </div>

  <div class="divider"></div>

  <!-- 03 Schedule of Rates -->
  <div class="sec-num">03</div>
  <div class="section-label">Schedule of Rates</div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="r" style="width:80px">Price</th>
        <th class="r" style="width:40px">Qty</th>
        <th class="r" style="width:95px">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="totals">
      <div class="total-row"><span class="total-label">Subtotal</span><span class="total-value">${formatCurrency(subtotal)}</span></div>
      <div class="total-row"><span class="total-label">Tax (${data.tax_rate}%)</span><span class="total-value">${formatCurrency(taxAmount)}</span></div>
      <div class="total-row highlight"><span class="total-label">Total Amount</span><span class="total-value">${formatCurrency(grandTotal)}</span></div>
    </div>
  </div>

  <!-- Terms & Notes -->
  ${data.payment_terms ? `
  <div class="terms-section">
    <div class="terms-title">Terms & Conditions</div>
    <div class="terms-text">${data.payment_terms}</div>
  </div>` : ''}
  ${data.notes ? `
  <div class="terms-section">
    <div class="terms-title">Notes</div>
    <div class="terms-text">${data.notes}</div>
  </div>` : ''}

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-block">
      <div class="sig-space"></div>
      <div class="sig-line"></div>
      <div class="sig-label">Designer Signature</div>
      <div class="sig-name">${data.designer_name || 'Designer'}</div>
    </div>
    <div class="sig-block">
      <div class="sig-space"></div>
      <div class="sig-line"></div>
      <div class="sig-label">Client Acceptance</div>
      <div class="sig-name">${data.client_name}</div>
    </div>
  </div>

  <div class="footer">${data.designer_name || 'Interior Design Studio'} · Generated with Kalvora</div>
</div>
</body>
</html>`;
}


// ============================================================
// TEMPLATE 5 — EDITORIAL MAGAZINE
// Warm off-white, Playfair Display headings, Inter body,
// generous whitespace, refined dividers. Magazine aesthetic.
// ============================================================
export function editorialTemplate(data: TemplateData): string {
  const warm = '#3d2b1f';
  const muted = '#8b7355';
  const bg = '#FFFBF5';
  const divider = '#e8dcc8';

  const body = buildBody(data, {
    accent: muted,
    labelClass: 'section-label',
    nameClass: 'client-name',
    detailClass: 'client-detail',
    sectionTitleTag: 'div',
    tableHeaderBg: warm,
    tableHeaderColor: '#f5f0e8',
    evenRowBg: '#faf6ed',
    totalHighlightBg: warm,
    totalHighlightColor: '#f5f0e8',
    totalHighlightLabelColor: '#c4a882',
    sigLineBorder: divider,
    sigLabelColor: muted,
    footerText: `${data.designer_name || 'Design Studio'} · Generated with Kalvora`,
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 20mm 0mm 15mm 0mm; }
  @page :first { margin-top: 0; }
  .terms-section, .sig-row, .client-section { page-break-inside: avoid; }
  thead { display: table-header-group; }
  tbody tr { page-break-inside: avoid; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: ${warm}; font-size: 10.5px; line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 40px 48px 28px;
    margin: 0 auto; position: relative; background: ${bg};
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0; }
  .header-left { display: flex; align-items: center; gap: 14px; }
  .header-logo { max-height: 44px; max-width: 150px; object-fit: contain; }
  .company-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 24px; font-weight: 700; color: ${warm}; letter-spacing: 0.3px;
  }
  .doc-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 14px; font-weight: 400; font-style: italic; color: ${muted};
    letter-spacing: 1px;
  }
  .header-line { height: 1px; background: ${divider}; margin: 14px 0 20px; }

  /* Sections */
  .section-label {
    font-size: 8px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 3px; color: ${muted}; margin-bottom: 8px;
  }

  /* Info */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 18px; }
  .info-block { }
  .info-block.right { text-align: right; }
  .info-line { font-size: 10.5px; color: #6b5b4a; line-height: 1.8; }
  .info-line strong { font-weight: 600; color: ${warm}; }

  /* Client */
  .client-section {
    margin-bottom: 18px; padding-bottom: 14px;
    border-bottom: 1px solid ${divider};
  }
  .client-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 16px; font-weight: 600; color: ${warm}; margin-bottom: 3px;
  }
  .client-detail { font-size: 10.5px; color: #8b7355; line-height: 1.6; }

  /* Table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
  thead th {
    background: ${warm}; color: #f5f0e8; font-size: 7.5px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 2.5px; padding: 10px 16px;
    text-align: left;
  }
  thead th.r { text-align: right; }
  tbody td {
    padding: 10px 16px; font-size: 10.5px; color: #5a4a3a;
    border-bottom: 1px solid ${divider};
  }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 500; color: ${warm}; }
  tbody td.amt { font-weight: 700; color: ${warm}; }
  tbody tr.even td { background: #faf6ed; }
  tbody tr:last-child td { border-bottom: none; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin: 2px 0 18px; }
  .totals { width: 250px; }
  .total-row { display: flex; justify-content: space-between; padding: 7px 16px; font-size: 10.5px; }
  .total-label { color: #b8a48a; font-weight: 500; }
  .total-value { font-weight: 600; color: ${warm}; }
  .total-row.highlight {
    background: ${warm}; color: #f5f0e8; font-weight: 700;
    font-size: 13px; margin-top: 4px; padding: 10px 16px;
  }
  .total-row.highlight .total-label { color: #c4a882; }
  .total-row.highlight .total-value {
    color: #f5f0e8; font-family: 'Playfair Display', Georgia, serif;
    font-size: 14px;
  }

  /* Terms */
  .terms-section { margin-bottom: 14px; }
  .terms-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 12px; font-weight: 600; color: ${warm}; margin-bottom: 4px;
  }
  .terms-text { font-size: 9.5px; color: #8b7355; line-height: 1.8; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 48px; margin-top: 22px; }
  .sig-block { flex: 1; }
  .sig-space { height: 28px; }
  .sig-line { border-top: 1px solid ${divider}; padding-top: 6px; }
  .sig-label { font-size: 7.5px; color: ${muted}; text-transform: uppercase; letter-spacing: 2.5px; font-weight: 600; }
  .sig-name { font-size: 10.5px; color: #5a4a3a; font-weight: 600; margin-top: 2px; }

  /* Footer */
  .footer {
    position: absolute; bottom: 20px; left: 48px; right: 48px;
    text-align: center; font-size: 8px; color: #d6cbb8;
    border-top: 1px solid ${divider}; padding-top: 8px; letter-spacing: 1px;
    font-style: italic;
  }
</style>
</head>
<body>
<div class="page">
${body}
</div>
</body>
</html>`;
}


// ============================================================
// TEMPLATE 6 — HIGH CONTRAST MODERN
// White + strong contrast blocks, black section headers,
// indigo accent, card-style sections. SaaS/Stripe inspired.
// ============================================================
export function highContrastTemplate(data: TemplateData): string {
  const accent = '#6366f1';
  const dark = '#0f172a';
  const cardBg = '#f8fafc';
  const cardBorder = '#e2e8f0';

  const body = buildBody(data, {
    accent,
    labelClass: 'section-label',
    nameClass: 'client-name',
    detailClass: 'client-detail',
    sectionTitleTag: 'div',
    tableHeaderBg: dark,
    tableHeaderColor: '#fff',
    evenRowBg: cardBg,
    totalHighlightBg: accent,
    totalHighlightColor: '#fff',
    totalHighlightLabelColor: 'rgba(255,255,255,0.85)',
    sigLineBorder: cardBorder,
    sigLabelColor: '#94a3b8',
    footerText: `${data.designer_name || 'Interior Design Studio'} · Generated with Kalvora`,
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 20mm 0mm 15mm 0mm; }
  @page :first { margin-top: 0; }
  .terms-section, .sig-row, .client-section { page-break-inside: avoid; }
  thead { display: table-header-group; }
  tbody tr { page-break-inside: avoid; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: ${dark}; font-size: 10.5px; line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 0 0 28px;
    margin: 0 auto; position: relative; background: #ffffff;
  }

  /* Dark Header Bar */
  .top-bar {
    background: ${dark}; padding: 18px 44px; display: flex;
    justify-content: space-between; align-items: center;
    margin-bottom: 20px;
  }
  .top-bar .header-left { display: flex; align-items: center; gap: 12px; }
  .top-bar .header-logo { max-height: 36px; max-width: 120px; object-fit: contain; }
  .top-bar .company-name { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .top-bar .doc-title {
    font-size: 11px; font-weight: 700; letter-spacing: 3px; color: ${accent};
    text-transform: uppercase;
  }

  /* Override common header — use top-bar instead */
  .header { display: none; }
  .header-line { display: none; }

  .content { padding: 0 44px; }

  /* Sections */
  .section-label {
    font-size: 8px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 2px; color: ${dark}; margin-bottom: 6px;
    padding: 4px 8px; background: #f1f5f9; border-radius: 4px;
    display: inline-block;
  }

  /* Info */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
  .info-block { }
  .info-block.right { text-align: right; }
  .info-line { font-size: 10.5px; color: #475569; line-height: 1.7; }
  .info-line strong { font-weight: 600; color: ${dark}; }

  /* Client */
  .client-section {
    margin-bottom: 16px; padding: 12px 16px;
    background: ${cardBg}; border-radius: 8px;
    border: 1px solid ${cardBorder};
  }
  .client-name { font-size: 15px; font-weight: 800; color: ${dark}; margin-bottom: 2px; }
  .client-detail { font-size: 10.5px; color: #64748b; line-height: 1.6; }

  /* Table */
  table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; border: 1px solid ${cardBorder}; border-radius: 8px; overflow: hidden; }
  thead th {
    background: ${dark}; color: #fff; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; padding: 10px 14px;
    text-align: left;
  }
  thead th.r { text-align: right; }
  tbody td {
    padding: 9px 14px; font-size: 10.5px; color: #475569;
    border-bottom: 1px solid #f1f5f9;
  }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 600; color: ${dark}; }
  tbody td.amt { font-weight: 800; color: ${dark}; font-variant-numeric: tabular-nums; }
  tbody tr.even td { background: ${cardBg}; }
  tbody tr:last-child td { border-bottom: none; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin: 2px 0 16px; }
  .totals { width: 260px; border: 1px solid ${cardBorder}; border-radius: 8px; overflow: hidden; }
  .total-row { display: flex; justify-content: space-between; padding: 7px 14px; font-size: 10.5px; }
  .total-label { color: #94a3b8; font-weight: 500; }
  .total-value { font-weight: 700; color: ${dark}; font-variant-numeric: tabular-nums; }
  .total-row.highlight {
    background: ${accent}; color: #fff; font-weight: 800;
    font-size: 13px; padding: 9px 14px;
  }
  .total-row.highlight .total-label { color: rgba(255,255,255,0.85); }
  .total-row.highlight .total-value { color: #fff; font-size: 14px; }

  /* Terms */
  .terms-section { margin-bottom: 12px; }
  .terms-title {
    font-size: 8px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 2px; color: ${dark}; margin-bottom: 4px;
  }
  .terms-text { font-size: 9.5px; color: #64748b; line-height: 1.7; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 48px; margin-top: 20px; }
  .sig-block { flex: 1; }
  .sig-space { height: 28px; }
  .sig-line { border-top: 2px solid ${cardBorder}; padding-top: 6px; }
  .sig-label { font-size: 8px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
  .sig-name { font-size: 10.5px; color: #475569; font-weight: 600; margin-top: 2px; }

  /* Footer */
  .footer {
    position: absolute; bottom: 16px; left: 44px; right: 44px;
    text-align: center; font-size: 8px; color: #cbd5e1;
    border-top: 1px solid #f1f5f9; padding-top: 8px; letter-spacing: 0.5px;
  }
</style>
</head>
<body>
<div class="page">
  <!-- Dark Top Bar -->
  <div class="top-bar">
    <div class="header-left">
      ${data.logo_url ? `<img src="${data.logo_url}" class="header-logo" />` : ''}
      <div class="company-name">${data.designer_name || 'Interior Design Studio'}</div>
    </div>
    <div class="doc-title">QUOTATION</div>
  </div>
  <div class="content">
${body.replace('<!-- Header -->', '').replace(/<div class="header">[\s\S]*?<div class="header-line"><\/div>/, '')}
  </div>
</div>
</body>
</html>`;
}
