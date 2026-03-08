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

// Helper: build rooms string inline
function roomsSummary(data: TemplateData): string {
  if (data.rooms.length === 0) return '';
  return data.rooms.map(r => `${r.name} (${r.square_footage} sq.ft)`).join(', ');
}


// ============================================================
// MINIMAL TEMPLATE — Clean, white, Inter font, 1-page quotation
// ============================================================
export function minimalTemplate(data: TemplateData): string {
  const { subtotal, taxAmount, grandTotal } = getCommonData(data);
  const accent = data.accent_color || '#2563EB';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1f2937; font-size: 11px; line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 40px 48px;
    margin: 0 auto; position: relative;
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
  .company-name { font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
  .doc-title { font-size: 22px; font-weight: 800; color: ${accent}; text-align: right; letter-spacing: -0.3px; }
  .header-logo { max-height: 48px; max-width: 160px; object-fit: contain; }
  .header-line { height: 3px; background: ${accent}; margin-bottom: 20px; }

  /* Info Row */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .info-block {}
  .info-block-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: ${accent}; margin-bottom: 6px; }
  .info-line { font-size: 11px; color: #374151; line-height: 1.6; }
  .info-line strong { font-weight: 600; color: #111827; }

  /* Client section */
  .client-section { margin-bottom: 16px; }
  .client-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: ${accent}; margin-bottom: 4px; }
  .client-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 2px; }
  .client-detail { font-size: 11px; color: #6b7280; line-height: 1.6; }

  /* Table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
  thead th {
    background: ${accent}; color: #fff; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; padding: 10px 14px;
    text-align: left;
  }
  thead th.r { text-align: right; }
  tbody td { padding: 9px 14px; font-size: 11px; border-bottom: 1px solid #f3f4f6; color: #374151; }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 500; color: #1f2937; }
  tbody td.amt { font-weight: 700; color: #111827; }
  tbody tr:nth-child(even) td { background: #f9fafb; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin-bottom: 20px; }
  .totals { width: 260px; }
  .total-row { display: flex; justify-content: space-between; padding: 7px 14px; font-size: 11px; }
  .total-row.highlight {
    background: ${accent}; color: #fff; font-weight: 700;
    font-size: 13px; border-radius: 4px; margin-top: 4px;
  }
  .total-label { color: #6b7280; font-weight: 500; }
  .total-value { font-weight: 600; color: #1f2937; }
  .total-row.highlight .total-label,
  .total-row.highlight .total-value { color: #fff; }

  /* Terms */
  .terms-section { margin-bottom: 16px; }
  .terms-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: ${accent}; margin-bottom: 6px; }
  .terms-text { font-size: 10px; color: #6b7280; line-height: 1.7; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 60px; margin-top: 24px; padding-top: 8px; }
  .sig-block { flex: 1; }
  .sig-line { border-top: 1px solid #d1d5db; margin-bottom: 6px; padding-top: 8px; }
  .sig-label { font-size: 9px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .sig-name { font-size: 11px; color: #374151; font-weight: 600; margin-top: 2px; }
  .sig-role { font-size: 10px; color: #9ca3af; }

  /* Footer */
  .footer {
    position: absolute; bottom: 24px; left: 48px; right: 48px;
    text-align: center; font-size: 9px; color: #d1d5db;
    border-top: 1px solid #f3f4f6; padding-top: 8px;
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div style="display:flex;align-items:center;gap:14px">
      ${data.logo_url ? `<img src="${data.logo_url}" class="header-logo" />` : ''}
      <div class="company-name">${data.designer_name || 'Interior Design Studio'}</div>
    </div>
    <div class="doc-title">Quotation</div>
  </div>
  <div class="header-line"></div>

  <!-- Info Row -->
  <div class="info-row">
    <div class="info-block">
      <div class="info-block-title">Quotation Details</div>
      <div class="info-line"><strong>Date:</strong> ${formatDate(data.created_at)}</div>
      <div class="info-line"><strong>Project:</strong> ${data.project_type}</div>
      ${data.project_address ? `<div class="info-line"><strong>Location:</strong> ${data.project_address}</div>` : ''}
      ${roomsSummary(data) ? `<div class="info-line"><strong>Rooms:</strong> ${roomsSummary(data)}</div>` : ''}
    </div>
    <div class="info-block" style="text-align:right">
      <div class="info-block-title">Prepared By</div>
      <div class="info-line"><strong>${data.designer_name || 'Designer'}</strong></div>
      ${data.designer_email ? `<div class="info-line">${data.designer_email}</div>` : ''}
      ${data.designer_phone ? `<div class="info-line">${data.designer_phone}</div>` : ''}
    </div>
  </div>

  <!-- Client -->
  <div class="client-section">
    <div class="client-label">Quotation To</div>
    <div class="client-name">${data.client_name}</div>
    ${data.client_email ? `<div class="client-detail">${data.client_email}</div>` : ''}
    ${data.client_phone ? `<div class="client-detail">${data.client_phone}</div>` : ''}
  </div>

  <!-- Pricing Table -->
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="r" style="width:65px">Price</th>
        <th class="r" style="width:45px">Qty</th>
        <th class="r" style="width:90px">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${data.line_items.map(i => `<tr>
        <td class="name">${i.item_name}</td>
        <td class="r">${formatCurrency(i.unit_price)}</td>
        <td class="r">${i.quantity}</td>
        <td class="r amt">${formatCurrency(i.quantity * i.unit_price)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="totals">
      <div class="total-row"><span class="total-label">Subtotal</span><span class="total-value">${formatCurrency(subtotal)}</span></div>
      <div class="total-row"><span class="total-label">Tax (${data.tax_rate}%)</span><span class="total-value">${formatCurrency(taxAmount)}</span></div>
      <div class="total-row highlight"><span class="total-label">Total</span><span class="total-value">${formatCurrency(grandTotal)}</span></div>
    </div>
  </div>

  <!-- Terms / Notes -->
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
      <div class="sig-line"></div>
      <div class="sig-label">Signature</div>
      <div class="sig-name">${data.designer_name || 'Designer'}</div>
      <div class="sig-role">${data.designer_email || ''}</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Client Acceptance</div>
      <div class="sig-name">${data.client_name}</div>
      <div class="sig-role">${data.client_email || ''}</div>
    </div>
  </div>

  <div class="footer">${data.designer_name || 'Interior Design Studio'} · Generated with K A L V O R A</div>
</div>
</body>
</html>`;
}


// ============================================================
// LUXURY TEMPLATE — Gold/dark, serif, opulent feel, 1-page
// ============================================================
export function luxuryTemplate(data: TemplateData): string {
  const { subtotal, taxAmount, grandTotal } = getCommonData(data);
  const gold = '#C5A55A';
  const dark = '#1B1B1F';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Montserrat', sans-serif;
    color: ${dark}; font-size: 10.5px; line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 40px 48px;
    margin: 0 auto; position: relative;
    background: #fdf9f3;
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
  .company-name {
    font-family: 'Cormorant Garamond'; font-size: 26px; font-weight: 700;
    color: ${dark}; letter-spacing: 1px;
  }
  .doc-title {
    font-family: 'Cormorant Garamond'; font-size: 26px; font-weight: 600;
    color: ${gold}; text-align: right; letter-spacing: 1px;
  }
  .header-logo { max-height: 50px; max-width: 160px; object-fit: contain; }
  .header-line-wrap { display: flex; align-items: center; gap: 0; margin-bottom: 20px; }
  .header-line-gold { height: 2px; background: ${gold}; flex: 1; }
  .header-line-dark { height: 1px; background: ${dark}; flex: 1; margin-top: 4px; }
  .header-diamond { color: ${gold}; font-size: 8px; margin: 0 8px; }

  /* Info Row */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 18px; }
  .info-block {}
  .info-block-title {
    font-family: 'Montserrat'; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 3px; color: ${gold}; margin-bottom: 6px;
  }
  .info-line { font-size: 10.5px; color: #444; line-height: 1.7; }
  .info-line strong { font-weight: 600; color: ${dark}; }

  /* Client */
  .client-section { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid #e8dcc8; }
  .client-label {
    font-family: 'Montserrat'; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 3px; color: ${gold}; margin-bottom: 4px;
  }
  .client-name {
    font-family: 'Cormorant Garamond'; font-size: 18px; font-weight: 600;
    color: ${dark}; margin-bottom: 2px;
  }
  .client-detail { font-size: 10.5px; color: #666; }

  /* Table */
  table { width: 100%; border-collapse: collapse; }
  thead th {
    background: ${dark}; color: ${gold}; font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2px; padding: 10px 14px;
    text-align: left; font-family: 'Montserrat';
  }
  thead th.r { text-align: right; }
  tbody td {
    padding: 9px 14px; font-size: 10.5px; border-bottom: 1px solid #e8dcc8; color: #333;
  }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 500; color: ${dark}; }
  tbody td.amt { font-weight: 700; color: ${dark}; }
  tbody tr:nth-child(even) td { background: #f7f1e6; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin-bottom: 18px; }
  .totals { width: 260px; }
  .total-row { display: flex; justify-content: space-between; padding: 7px 14px; font-size: 10.5px; }
  .total-row.highlight {
    background: ${dark}; color: ${gold}; font-weight: 700;
    font-size: 13px; border-radius: 3px; margin-top: 4px;
  }
  .total-label { color: #888; font-weight: 500; }
  .total-value { font-weight: 600; color: ${dark}; }
  .total-row.highlight .total-label { color: #ccc; }
  .total-row.highlight .total-value { color: ${gold}; font-family: 'Montserrat'; }

  /* Terms */
  .terms-section { margin-bottom: 14px; }
  .terms-title {
    font-family: 'Cormorant Garamond'; font-size: 13px; font-weight: 600;
    color: ${dark}; margin-bottom: 4px;
  }
  .terms-text { font-size: 9.5px; color: #666; line-height: 1.7; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 60px; margin-top: 20px; padding-top: 6px; }
  .sig-block { flex: 1; }
  .sig-line { border-top: 1px solid ${gold}80; margin-bottom: 6px; padding-top: 8px; }
  .sig-label {
    font-size: 8px; color: ${gold}; text-transform: uppercase;
    letter-spacing: 2px; font-weight: 600;
  }
  .sig-name { font-size: 10.5px; color: #333; font-weight: 600; margin-top: 2px; }
  .sig-role { font-size: 9.5px; color: #999; }

  /* Footer */
  .footer {
    position: absolute; bottom: 20px; left: 48px; right: 48px;
    text-align: center; font-size: 8px; color: #ccc;
    border-top: 1px solid #e8dcc8; padding-top: 8px; letter-spacing: 1px;
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div style="display:flex;align-items:center;gap:14px">
      ${data.logo_url ? `<img src="${data.logo_url}" class="header-logo" />` : ''}
      <div class="company-name">${data.designer_name || 'Design Studio'}</div>
    </div>
    <div class="doc-title">Quotation</div>
  </div>
  <div class="header-line-wrap">
    <div class="header-line-gold"></div>
    <span class="header-diamond">◆</span>
    <div class="header-line-gold"></div>
  </div>

  <!-- Info Row -->
  <div class="info-row">
    <div class="info-block">
      <div class="info-block-title">Quotation Details</div>
      <div class="info-line"><strong>Date:</strong> ${formatDate(data.created_at)}</div>
      <div class="info-line"><strong>Project:</strong> ${data.project_type}</div>
      ${data.project_address ? `<div class="info-line"><strong>Location:</strong> ${data.project_address}</div>` : ''}
      ${roomsSummary(data) ? `<div class="info-line"><strong>Rooms:</strong> ${roomsSummary(data)}</div>` : ''}
    </div>
    <div class="info-block" style="text-align:right">
      <div class="info-block-title">Prepared By</div>
      <div class="info-line"><strong>${data.designer_name || 'Designer'}</strong></div>
      ${data.designer_email ? `<div class="info-line">${data.designer_email}</div>` : ''}
      ${data.designer_phone ? `<div class="info-line">${data.designer_phone}</div>` : ''}
    </div>
  </div>

  <!-- Client -->
  <div class="client-section">
    <div class="client-label">Quotation To</div>
    <div class="client-name">${data.client_name}</div>
    ${data.client_email ? `<div class="client-detail">${data.client_email}</div>` : ''}
    ${data.client_phone ? `<div class="client-detail">${data.client_phone}</div>` : ''}
  </div>

  <!-- Pricing Table -->
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="r" style="width:70px">Price</th>
        <th class="r" style="width:40px">Qty</th>
        <th class="r" style="width:90px">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${data.line_items.map(i => `<tr>
        <td class="name">${i.item_name}</td>
        <td class="r">${formatCurrency(i.unit_price)}</td>
        <td class="r">${i.quantity}</td>
        <td class="r amt">${formatCurrency(i.quantity * i.unit_price)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="totals">
      <div class="total-row"><span class="total-label">Subtotal</span><span class="total-value">${formatCurrency(subtotal)}</span></div>
      <div class="total-row"><span class="total-label">Tax (${data.tax_rate}%)</span><span class="total-value">${formatCurrency(taxAmount)}</span></div>
      <div class="total-row highlight"><span class="total-label">Total</span><span class="total-value">${formatCurrency(grandTotal)}</span></div>
    </div>
  </div>

  <!-- Terms / Notes -->
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
      <div class="sig-line"></div>
      <div class="sig-label">Signature</div>
      <div class="sig-name">${data.designer_name || 'Designer'}</div>
      <div class="sig-role">${data.designer_email || ''}</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Client Acceptance</div>
      <div class="sig-name">${data.client_name}</div>
      <div class="sig-role">${data.client_email || ''}</div>
    </div>
  </div>

  <div class="footer">${data.designer_name || 'Design Studio'} · Generated with K A L V O R A</div>
</div>
</body>
</html>`;
}


// ============================================================
// MODERN / PROFESSIONAL — Bold accent, DM Sans, corporate, 1-page
// ============================================================
export function modernTemplate(data: TemplateData): string {
  const { subtotal, taxAmount, grandTotal } = getCommonData(data);
  const accent = data.accent_color || '#4c6ef5';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'DM Sans', -apple-system, sans-serif;
    color: #1a1a2e; font-size: 11px; line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm; min-height: 297mm; padding: 40px 48px;
    margin: 0 auto; position: relative;
  }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; }
  .company-name { font-size: 22px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.3px; }
  .doc-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: ${accent}; color: #fff; font-size: 12px;
    font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    padding: 8px 20px; border-radius: 6px;
  }
  .header-logo { max-height: 48px; max-width: 160px; object-fit: contain; }
  .header-bar { height: 4px; background: linear-gradient(90deg, ${accent}, ${accent}60, transparent); margin: 10px 0 20px; border-radius: 2px; }

  /* Info Row */
  .info-row { display: flex; justify-content: space-between; margin-bottom: 18px; }
  .info-block {}
  .info-block-title {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: ${accent}; margin-bottom: 6px;
  }
  .info-line { font-size: 11px; color: #4b5563; line-height: 1.7; }
  .info-line strong { font-weight: 600; color: #1a1a2e; }

  /* Client */
  .client-section {
    margin-bottom: 16px; padding: 14px 18px;
    background: #f3f4f8; border-radius: 8px; border-left: 4px solid ${accent};
  }
  .client-label {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: ${accent}; margin-bottom: 4px;
  }
  .client-name { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 2px; }
  .client-detail { font-size: 11px; color: #6b7280; }

  /* Table */
  table { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden; }
  thead th {
    background: ${accent}; color: #fff; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; padding: 10px 14px;
    text-align: left;
  }
  thead th.r { text-align: right; }
  tbody td { padding: 9px 14px; font-size: 11px; border-bottom: 1px solid #eef0f4; color: #374151; }
  tbody td.r { text-align: right; }
  tbody td.name { font-weight: 600; color: #1a1a2e; }
  tbody td.amt { font-weight: 700; color: #1a1a2e; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin-bottom: 18px; }
  .totals { width: 260px; }
  .total-row { display: flex; justify-content: space-between; padding: 7px 14px; font-size: 11px; }
  .total-row.highlight {
    background: linear-gradient(135deg, ${accent}, ${accent}dd);
    color: #fff; font-weight: 700; font-size: 14px;
    border-radius: 6px; margin-top: 4px;
  }
  .total-label { color: #6b7280; font-weight: 500; }
  .total-value { font-weight: 600; color: #1a1a2e; }
  .total-row.highlight .total-label,
  .total-row.highlight .total-value { color: #fff; }

  /* Terms */
  .terms-section { margin-bottom: 14px; }
  .terms-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: ${accent}; margin-bottom: 4px; }
  .terms-text { font-size: 10px; color: #6b7280; line-height: 1.7; white-space: pre-wrap; }

  /* Signature */
  .sig-row { display: flex; gap: 60px; margin-top: 20px; }
  .sig-block { flex: 1; }
  .sig-line { border-top: 2px solid #e5e7eb; margin-bottom: 6px; padding-top: 8px; }
  .sig-label { font-size: 9px; color: ${accent}; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
  .sig-name { font-size: 11px; color: #374151; font-weight: 600; margin-top: 2px; }
  .sig-role { font-size: 10px; color: #9ca3af; }

  /* Footer */
  .footer {
    position: absolute; bottom: 20px; left: 48px; right: 48px;
    text-align: center; font-size: 9px; color: #d1d5db;
    border-top: 1px solid #f3f4f6; padding-top: 8px;
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div style="display:flex;align-items:center;gap:14px">
      ${data.logo_url ? `<img src="${data.logo_url}" class="header-logo" />` : ''}
      <div class="company-name">${data.designer_name || 'Interior Design Studio'}</div>
    </div>
    <div class="doc-badge">◆ Quotation</div>
  </div>
  <div class="header-bar"></div>

  <!-- Info Row -->
  <div class="info-row">
    <div class="info-block">
      <div class="info-block-title">Quotation Details</div>
      <div class="info-line"><strong>Date:</strong> ${formatDate(data.created_at)}</div>
      <div class="info-line"><strong>Project:</strong> ${data.project_type}</div>
      ${data.project_address ? `<div class="info-line"><strong>Location:</strong> ${data.project_address}</div>` : ''}
      ${roomsSummary(data) ? `<div class="info-line"><strong>Rooms:</strong> ${roomsSummary(data)}</div>` : ''}
    </div>
    <div class="info-block" style="text-align:right">
      <div class="info-block-title">Prepared By</div>
      <div class="info-line"><strong>${data.designer_name || 'Designer'}</strong></div>
      ${data.designer_email ? `<div class="info-line">${data.designer_email}</div>` : ''}
      ${data.designer_phone ? `<div class="info-line">${data.designer_phone}</div>` : ''}
    </div>
  </div>

  <!-- Client -->
  <div class="client-section">
    <div class="client-label">Quotation To</div>
    <div class="client-name">${data.client_name}</div>
    ${data.client_email ? `<div class="client-detail">${data.client_email}</div>` : ''}
    ${data.client_phone ? `<div class="client-detail">${data.client_phone}</div>` : ''}
  </div>

  <!-- Pricing Table -->
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="r" style="width:70px">Price</th>
        <th class="r" style="width:45px">Qty</th>
        <th class="r" style="width:90px">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${data.line_items.map(i => `<tr>
        <td class="name">${i.item_name}</td>
        <td class="r">${formatCurrency(i.unit_price)}</td>
        <td class="r">${i.quantity}</td>
        <td class="r amt">${formatCurrency(i.quantity * i.unit_price)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-wrap">
    <div class="totals">
      <div class="total-row"><span class="total-label">Subtotal</span><span class="total-value">${formatCurrency(subtotal)}</span></div>
      <div class="total-row"><span class="total-label">Tax (${data.tax_rate}%)</span><span class="total-value">${formatCurrency(taxAmount)}</span></div>
      <div class="total-row highlight"><span class="total-label">Total</span><span class="total-value">${formatCurrency(grandTotal)}</span></div>
    </div>
  </div>

  <!-- Terms / Notes -->
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
      <div class="sig-line"></div>
      <div class="sig-label">Signature</div>
      <div class="sig-name">${data.designer_name || 'Designer'}</div>
      <div class="sig-role">${data.designer_email || ''}</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Client Acceptance</div>
      <div class="sig-name">${data.client_name}</div>
      <div class="sig-role">${data.client_email || ''}</div>
    </div>
  </div>

  <div class="footer">${data.designer_name || 'Interior Design Studio'} · Generated with K A L V O R A</div>
</div>
</body>
</html>`;
}
