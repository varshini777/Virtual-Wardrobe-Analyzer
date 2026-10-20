import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const WORKSPACE_DIR = 'D:\\Virtual wardrobe Analyzer';
const DATA_FILE = path.join(WORKSPACE_DIR, 'server', 'src', 'data', 'curatedWardrobe.js');
const OUTPUT_HTML = path.join(WORKSPACE_DIR, 'docs', 'catalog_contact_sheet.html');
const OUTPUT_PDF = path.join(WORKSPACE_DIR, 'docs', 'catalog_contact_sheet.pdf');

async function buildContactSheet() {
  const { CURATED_WARDROBE } = await import(`file://${DATA_FILE}`);
  console.log(`Loaded ${CURATED_WARDROBE.length} items for visual contact sheet.`);

  // Group by Category
  const categories = ['Top', 'Bottom', 'Shoes', 'Accessories'];
  const grouped = {};
  categories.forEach(c => grouped[c] = []);
  CURATED_WARDROBE.forEach(item => {
    if (grouped[item.category]) grouped[item.category].push(item);
  });

  const generateCard = (item) => {
    const isJpg = item.image_url.endsWith('.jpg');
    const isPng = item.image_url.endsWith('.png');
    const imgSrc = `http://localhost:5000${item.image_url}`;

    const pillLabel = isJpg ? 'Studio Photo' : (isPng ? 'Photorealistic' : 'Bespoke Vector');
    const pillClass = (isJpg || isPng) ? 'pill-photo' : 'pill-vector';
    const cardClass = (isJpg || isPng) ? 'is-photo' : 'is-vector';

    return `
      <div class="contact-card ${cardClass}">
        <div class="card-thumb-wrap">
          <img src="${imgSrc}" alt="${item.name}" class="card-thumb" />
          <span class="type-pill ${pillClass}">
            ${pillLabel}
          </span>
          <span class="id-pill">${item.id}</span>
        </div>
        <div class="card-info">
          <span class="concept-id">${item.concept_id || 'N/A'}</span>
          <h4 class="item-name" title="${item.name}">${item.name}</h4>
          <div class="item-meta">
            <span class="subcat">${item.sub_category}</span> &bull; 
            <span class="color-dot" style="background-color: ${item.hex_color || '#888'};"></span>
            <span class="color-text">${item.color}</span>
          </div>
          <div class="item-details">
            <p class="sil-text"><strong>Cut:</strong> ${item.silhouette || 'Classic'}</p>
            <p class="fab-text"><strong>Cloth:</strong> ${item.fabric || 'Cotton'}</p>
          </div>
        </div>
      </div>
    `;
  };

  const sectionsHTML = categories.map(cat => {
    const items = grouped[cat] || [];
    return `
      <section class="category-section">
        <div class="section-header">
          <h2 class="category-title">${cat} Collection</h2>
          <span class="category-count">${items.length} Distinct Garment Designs</span>
        </div>
        <div class="contact-grid">
          ${items.map(generateCard).join('')}
        </div>
      </section>
    `;
  }).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Virtual Wardrobe Analyzer — Catalog Contact Sheet (160 Designs)</title>
  <style>
    @page {
      size: A3 landscape;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f1218;
      color: #e2e8f0;
      padding: 24px;
    }
    .sheet-header {
      border-bottom: 2px solid rgba(197, 168, 128, 0.3);
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .title-group h1 {
      font-family: Georgia, serif;
      font-size: 32px;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .title-group p {
      font-size: 14px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .meta-badges {
      display: flex;
      gap: 12px;
    }
    .meta-badge {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: #cbd5e1;
    }
    .meta-badge.gold {
      background: rgba(197, 168, 128, 0.15);
      border-color: #c5a880;
      color: #e2d1b8;
      font-weight: 600;
    }

    .category-section {
      margin-bottom: 36px;
      page-break-before: always;
    }
    .category-section:first-of-type {
      page-break-before: avoid;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 8px;
    }
    .category-title {
      font-family: Georgia, serif;
      font-size: 22px;
      color: #ffffff;
    }
    .category-count {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #c5a880;
      background: rgba(197, 168, 128, 0.1);
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid rgba(197, 168, 128, 0.2);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 14px;
    }
    .contact-card {
      background: #171c26;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease;
    }
    .contact-card.is-photo {
      border-color: rgba(197, 168, 128, 0.35);
    }
    .card-thumb-wrap {
      position: relative;
      width: 100%;
      height: 180px;
      background: #f4f1ea;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .card-thumb {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
    }
    .type-pill {
      position: absolute;
      top: 6px;
      right: 6px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .pill-photo {
      background: #10b981;
      color: #ffffff;
    }
    .pill-vector {
      background: #64748b;
      color: #ffffff;
    }
    .id-pill {
      position: absolute;
      top: 6px;
      left: 6px;
      font-size: 9px;
      font-family: monospace;
      font-weight: 600;
      background: rgba(15, 23, 42, 0.85);
      color: #94a3b8;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .card-info {
      padding: 10px 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .concept-id {
      font-size: 10px;
      font-family: monospace;
      color: #c5a880;
      margin-bottom: 2px;
      display: block;
    }
    .item-name {
      font-size: 12px;
      font-weight: 600;
      color: #f1f5f9;
      line-height: 1.3;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-meta {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .color-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    .item-details {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 6px;
      font-size: 10px;
      color: #64748b;
      line-height: 1.35;
    }
    .sil-text, .fab-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>
</head>
<body>

  <header class="sheet-header">
    <div class="title-group">
      <h1>Catalog Contact Sheet — Visual Audit</h1>
      <p>Inspection matrix of all 160 curated garment designs across Tops, Bottoms, Shoes, and Accessories</p>
    </div>
    <div class="meta-badges">
      <span class="meta-badge gold">Total Designs: 160</span>
      <span class="meta-badge">Studio Photos: 12</span>
      <span class="meta-badge">Bespoke Vectors: 148</span>
    </div>
  </header>

  <main>
    ${sectionsHTML}
  </main>

</body>
</html>
  `;

  fs.writeFileSync(OUTPUT_HTML, html);
  console.log(`Saved HTML contact sheet to: ${OUTPUT_HTML}`);

  console.log('Rendering PDF contact sheet via Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1.5 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--allow-file-access-from-files',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///' + OUTPUT_HTML.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 90000 });

  console.log('Printing master PDF...');
  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A3',
    landscape: true,
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    timeout: 180000
  });

  console.log('Capturing preview screenshots...');
  await page.screenshot({
    path: path.join(WORKSPACE_DIR, 'docs', 'contact_sheet_preview.png'),
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });

  const sections = await page.$$('.category-section');
  if (sections.length >= 4) {
    await sections[1].screenshot({ path: path.join(WORKSPACE_DIR, 'docs', 'contact_sheet_bottoms_preview.png') });
    await sections[2].screenshot({ path: path.join(WORKSPACE_DIR, 'docs', 'contact_sheet_shoes_preview.png') });
    await sections[3].screenshot({ path: path.join(WORKSPACE_DIR, 'docs', 'contact_sheet_accessories_preview.png') });
  }

  await browser.close();
  console.log(`✅ Success! Rendered PDF contact sheet: ${OUTPUT_PDF}`);
}

buildContactSheet().catch(err => {
  console.error('Error generating contact sheet:', err);
  process.exit(1);
});
