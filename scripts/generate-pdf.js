import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const WORKSPACE_DIR = 'D:\\Virtual wardrobe Analyzer';
const SCREENSHOTS_DIR = path.join(WORKSPACE_DIR, 'docs', 'screenshots');
const OUTPUT_PDF = path.join(WORKSPACE_DIR, 'Virtual_Wardrobe_Analyzer_Walkthrough.pdf');

// Helper to convert local image to Base64 data URI so it is 100% self-contained
function getImageBase64(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Screenshot not found: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

const pagesData = [
  {
    num: '01',
    title: 'Atelier Login Portal',
    route: '/login',
    filename: 'page_01_login.png',
    badge: 'Authentication',
    desc: 'Dark luxury atelier aesthetic with warm amber and gold accents, client social proof pill, remember-me persistence, and 1-click demo login credentials.',
    highlights: [
      'Warm amber/gold glow on interactive inputs with custom password show/hide toggles',
      'Instant access pre-fill for demo accounts (demo / demo123)',
      'Editorial fashion background with atelier mood imagery'
    ]
  },
  {
    num: '02',
    title: 'Haute Couture Registration',
    route: '/register',
    filename: 'page_02_register.png',
    badge: 'Onboarding',
    desc: 'Secure registration screen featuring client-side password strength validation, confirm password match check, and optional 144-garment starter capsule collection preloading.',
    highlights: [
      'Interactive password security checklist with real-time feedback',
      'Checkbox to automatically seed starter capsule wardrobe',
      'Seamless link to existing account login'
    ]
  },
  {
    num: '03',
    title: 'Executive Styling Dashboard',
    route: '/',
    filename: 'page_03_dashboard.png',
    badge: 'Analytics & Overview',
    desc: 'High-level closet analytics featuring item distribution across 4 core categories, closet balance score gauge, and ready-to-wear seasonal capsule collections.',
    highlights: [
      'Closet balance gauge computing over 1.5M potential outfit permutations',
      'Category counter tiles: Tops (40), Bottoms (32), Shoes (28), Accessories (44)',
      'Curated style capsules (Smart Casual, Business Formal, Summer Resort, Winter Warmth)'
    ]
  },
  {
    num: '04',
    title: 'Digital Wardrobe Grid',
    route: '/wardrobe',
    filename: 'page_04_wardrobe.png',
    badge: 'Garment Management',
    desc: 'Visual digital closet displaying all 144 garments with AI-assigned studio product photography, multi-attribute filter bar, color swatches, and subcategory chips.',
    highlights: [
      'Comprehensive multi-filtering: category, occasion, weather, and color palette',
      'Individual garment cards with color chips, subcategory, and weather tags',
      'Instant search and active filter reset'
    ]
  },
  {
    num: '05',
    title: 'Add Clothing Item Modal',
    route: '/wardrobe (Modal)',
    filename: 'page_05_wardrobe_modal.png',
    badge: 'Interactive Creator',
    desc: 'Comprehensive garment creation modal with dynamic subcategory chips, 14-shade visual color palette with hex swatches, occasion tags, and auto-image assignment.',
    highlights: [
      'Subcategory selector automatically adjusts based on selected Category',
      '14-color visual swatch grid with instant active selection border',
      'Occasion & Weather suitability tags with intelligent catalog image binding'
    ]
  },
  {
    num: '06',
    title: 'Styling Recommendation Controls',
    route: '/recommendations',
    filename: 'page_06_recommendations_form.png',
    badge: 'AI Stylist Controls',
    desc: 'Context filter interface allowing users to tune climate, occasion, season, and color preference weights before triggering the outfit recommendation algorithm.',
    highlights: [
      'Weather filter options: Hot, Mild, Cool, Cold, Rainy',
      'Occasion filter options: Casual, Smart Casual, Business Formal, Evening, Loungewear',
      'Quick action to pull in personal favorite and disliked color preferences'
    ]
  },
  {
    num: '07',
    title: 'Curated Outfit Recommendations',
    route: '/recommendations (Results)',
    filename: 'page_07_recommendations_results.png',
    badge: 'Recommendation Results',
    desc: 'Rule-based outfit generation results featuring coordinated 4-piece ensembles (Top + Bottom + Footwear + Accessory), compatibility scores (up to 99%), and stylist rationales.',
    highlights: [
      'Strict rule enforcement: Top + Bottom + Shoes + optional Accessory',
      'Color harmony scoring, fabric weight consistency, and style alignment',
      'Atelier compatibility match badge with 1-click "Save Outfit" bookmarking'
    ]
  },
  {
    num: '08',
    title: 'Saved Outfits & Styling History',
    route: '/saved-outfits',
    filename: 'page_08_saved_outfits.png',
    badge: 'Lookbook & Logs',
    desc: 'Personal lookbook storing saved outfits with complete component breakdowns, stylist notes, and an audit table of past styling session queries.',
    highlights: [
      'Permanent bookmarks of curated looks with weather and occasion badges',
      'Detailed item breakdown tiles with individual product images',
      'Styling session history log recording timestamps and generated match counts'
    ]
  },
  {
    num: '09',
    title: 'Personal Style & Color Preferences',
    route: '/preferences',
    filename: 'page_09_preferences.png',
    badge: 'Style Customization',
    desc: 'User styling profile configuration allowing custom selection of favorite colors (boosted scores), disliked colors (avoided hues), and core aesthetic archetypes.',
    highlights: [
      'Dual color selector: Favorite Colors vs. Disliked Colors',
      'Aesthetic archetype toggles: Minimalist, Classic, Streetwear, Old Money',
      'Default weather and occasion settings applied automatically during recommendation'
    ]
  }
];

function generateHTML() {
  const pagesHTML = pagesData.map(p => {
    const imgData = getImageBase64(p.filename);
    return `
      <div class="doc-page">
        <div class="page-header">
          <div class="header-left">
            <span class="page-badge">${p.badge}</span>
            <span class="route-tag">${p.route}</span>
            <h2 class="page-title">${p.num}. ${p.title}</h2>
          </div>
          <div class="header-right">
            <span class="app-brand">Virtual Wardrobe Analyzer</span>
          </div>
        </div>

        <div class="screenshot-container">
          <img src="${imgData}" alt="${p.title}" class="screenshot-img" />
        </div>

        <div class="page-footer-info">
          <p class="page-desc">${p.desc}</p>
          <div class="highlights-row">
            ${p.highlights.map(h => `<div class="highlight-item"><span class="highlight-bullet">&#9670;</span> ${h}</div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Virtual Wardrobe Analyzer — UI Walkthrough</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #0b0f17;
      color: #e5e7eb;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Cover Page */
    .cover-page {
      page-break-after: always;
      height: 190mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20mm 20mm;
      background: radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.12), transparent 45%),
                  radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08), transparent 45%),
                  #0b0f17;
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 12px;
    }

    .cover-top {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cover-logo-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #d4af37, #b8860b);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #0b0f17;
      font-weight: bold;
    }

    .cover-top-tag {
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #d4af37;
      font-weight: 600;
    }

    .cover-center {
      margin: auto 0;
    }

    .cover-title {
      font-size: 42px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      line-height: 1.15;
      margin-bottom: 12px;
    }

    .cover-title span {
      background: linear-gradient(135deg, #fce09a, #d4af37);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 18px;
      color: #9ca3af;
      max-width: 750px;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .cover-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .badge-chip {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      color: #d1d5db;
    }

    .badge-chip.gold {
      background: rgba(212, 175, 55, 0.15);
      border-color: rgba(212, 175, 55, 0.4);
      color: #fce09a;
      font-weight: 600;
    }

    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 16px;
    }

    .cover-meta {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.6;
    }

    .cover-meta strong {
      color: #d1d5db;
    }

    /* Standard Page */
    .doc-page {
      page-break-after: always;
      height: 190mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12mm 14mm 10mm 14mm;
      box-sizing: border-box;
    }

    .doc-page:last-child {
      page-break-after: avoid;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 8px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .page-badge {
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.35);
      color: #fce09a;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .route-tag {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      font-family: monospace;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .page-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin-left: 4px;
    }

    .app-brand {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* Screenshot Display */
    .screenshot-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #020617;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      overflow: hidden;
      padding: 6px;
      margin-bottom: 8px;
    }

    .screenshot-img {
      max-width: 100%;
      max-height: 128mm;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
      display: block;
    }

    /* Page Footer Info */
    .page-footer-info {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 8px 12px;
    }

    .page-desc {
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.4;
      margin-bottom: 6px;
    }

    .highlights-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .highlight-item {
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .highlight-bullet {
      color: #d4af37;
      font-size: 9px;
    }
  </style>
</head>
<body>

  <!-- Cover Slide -->
  <div class="cover-page">
    <div class="cover-top">
      <div class="cover-logo-icon">&#9670;</div>
      <div class="cover-top-tag">Architecture & UI Showcase</div>
    </div>

    <div class="cover-center">
      <h1 class="cover-title">Virtual Wardrobe<br><span>Analyzer Portfolio</span></h1>
      <p class="cover-subtitle">
        A complete, high-resolution visual catalog of all 9 pages, modals, styling filters, and rule-based recommendation interfaces in the platform.
      </p>

      <div class="cover-badges">
        <span class="badge-chip gold">Full Visual Audit</span>
        <span class="badge-chip">144 Curated Garments</span>
        <span class="badge-chip">Rule-Based Styling Engine</span>
        <span class="badge-chip">Color Theory Harmonies</span>
        <span class="badge-chip">React + Vite</span>
        <span class="badge-chip">Tailwind CSS</span>
        <span class="badge-chip">Node.js + Express</span>
        <span class="badge-chip">SQLite</span>
      </div>
    </div>

    <div class="cover-footer">
      <div class="cover-meta">
        <strong>Project Location:</strong> D:\\Virtual wardrobe Analyzer<br>
        <strong>Generated:</strong> October 2026 &bull; <strong>Format:</strong> High-Resolution Editorial Catalog
      </div>
      <div class="cover-meta" style="text-align: right;">
        <strong>Total Screens:</strong> 9 Distinct Views<br>
        <strong>Embedded Assets:</strong> 100% Self-Contained Lossless Data
      </div>
    </div>
  </div>

  <!-- Page Slides -->
  ${pagesHTML}

</body>
</html>
  `;
}

async function renderPDF() {
  console.log('📄 Preparing self-contained HTML with Base64 embedded screenshots...');
  const htmlContent = generateHTML();

  console.log('🚀 Launching headless Chrome via Puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  console.log('🌐 Loading document into browser viewport...');
  await page.setContent(htmlContent, {
    waitUntil: ['load', 'networkidle0'],
    timeout: 60000
  });

  // Verify that all 9 images are completely loaded in the DOM
  console.log('🔍 Verifying image completion...');
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    }));
  });

  console.log('🖨️ Rendering master PDF (A4 Landscape, print background, header/footer)...');
  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  await browser.close();

  const stats = fs.statSync(OUTPUT_PDF);
  console.log(`✅ Success! Generated PDF: ${OUTPUT_PDF}`);
  console.log(`📦 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

renderPDF().catch(err => {
  console.error('❌ PDF generation failed:', err);
  process.exit(1);
});
