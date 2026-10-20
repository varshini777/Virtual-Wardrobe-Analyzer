import fs from 'node:fs';
import path from 'node:path';

const CLIENT_ASSETS_DIR = path.resolve('client/public/clothing-assets');
const SERVER_ASSETS_DIR = path.resolve('server/public/clothing-assets');
const DATA_FILE = path.resolve('server/src/data/curatedWardrobe.js');

if (!fs.existsSync(CLIENT_ASSETS_DIR)) fs.mkdirSync(CLIENT_ASSETS_DIR, { recursive: true });
if (!fs.existsSync(SERVER_ASSETS_DIR)) fs.mkdirSync(SERVER_ASSETS_DIR, { recursive: true });

// Preserved high-res AI generated studio photography
const PRESERVED_JPGS = {
  'top-tee-01': '/clothing-assets/top_white_tshirt.jpg',
  'top-sh-01': '/clothing-assets/navy_oxford_shirt.jpg',
  'top-pol-01': '/clothing-assets/olive_polo_shirt.jpg',
  'top-knt-01': '/clothing-assets/grey_cashmere_sweater.jpg',
  'bot-tr-01': '/clothing-assets/charcoal_trousers.jpg',
  'bot-tr-02': '/clothing-assets/beige_chinos.jpg',
  'bot-jn-01': '/clothing-assets/dark_indigo_jeans.jpg',
  'sho-snk-01': '/clothing-assets/white_sneakers.jpg',
  'sho-loa-01': '/clothing-assets/brown_loafers.jpg',
  'acc-wt-01': '/clothing-assets/accessory_brown_watch.jpg',
  'acc-sg-01': '/clothing-assets/tortoise_sunglasses.jpg',
  'acc-sc-01': '/clothing-assets/charcoal_scarf.jpg'
};

const COLOR_PALETTES = {
  'White': { base: '#FDFBF7', shadow: '#E2DCD5', line: '#C8BEB5', accent: '#A89E95', hex: '#FFFFFF' },
  'Black': { base: '#1A1817', shadow: '#0F0E0D', line: '#2C2927', accent: '#44403C', hex: '#111827' },
  'Charcoal': { base: '#30343A', shadow: '#22252A', line: '#454B54', accent: '#5C636F', hex: '#374151' },
  'Heather Grey': { base: '#B5BAC3', shadow: '#989EA8', line: '#808691', accent: '#5D636E', hex: '#9CA3AF' },
  'Navy': { base: '#1B293A', shadow: '#111C29', line: '#2D4058', accent: '#445D7E', hex: '#1E3A8A' },
  'Sky Blue': { base: '#A9C6DB', shadow: '#88A9C2', line: '#6A8EA9', accent: '#4D7390', hex: '#60A5FA' },
  'Olive': { base: '#4C5540', shadow: '#363D2C', line: '#647055', accent: '#7D8C6B', hex: '#4D7C0F' },
  'Sage': { base: '#909F8C', shadow: '#768571', line: '#5D6C59', accent: '#A7B5A3', hex: '#84CC16' },
  'Beige': { base: '#DAD0C1', shadow: '#C0B3A2', line: '#A79986', accent: '#8D7E6B', hex: '#D6D3D1' },
  'Khaki': { base: '#BAA78C', shadow: '#9D8B70', line: '#817055', accent: '#65563C', hex: '#A8A29E' },
  'Camel': { base: '#C69968', shadow: '#A87B4A', line: '#8C6030', accent: '#70471A', hex: '#D97706' },
  'Brown': { base: '#5E4234', shadow: '#432E22', line: '#775545', accent: '#916855', hex: '#78350F' },
  'Burgundy': { base: '#5A1926', shadow: '#3F0E18', line: '#772737', accent: '#933447', hex: '#881337' },
  'Bordeaux': { base: '#4B1622', shadow: '#320C15', line: '#652331', accent: '#7F3040', hex: '#4C0519' },
  'Champagne': { base: '#EBDCC9', shadow: '#D3C2AC', line: '#BAA791', accent: '#A08E76', hex: '#FEF3C7' },
  'Ecru': { base: '#F4EEE4', shadow: '#DBD2C4', line: '#C0B6A5', accent: '#A69B87', hex: '#F5F5F4' },
  'Rust': { base: '#9C4F34', shadow: '#7A3924', line: '#BD6447', accent: '#DC7B5D', hex: '#EA580C' },
  'Indigo': { base: '#1D2F4B', shadow: '#132034', line: '#2C456D', accent: '#3C6097', hex: '#1E40AF' },
  'Clay': { base: '#A36855', shadow: '#854F3E', line: '#6E3E2F', accent: '#B87D6B', hex: '#C2410C' },
  'Teal': { base: '#2B5A5C', shadow: '#1B3D3E', line: '#3F787A', accent: '#539496', hex: '#0F766E' }
};

function getPalette(name) {
  return COLOR_PALETTES[name] || { base: '#6B7280', shadow: '#4B5563', line: '#374151', accent: '#1F2937', hex: '#6B7280' };
}

function renderGarmentSVG(item) {
  const c = getPalette(item.color);
  const sec = item.secondary_color ? getPalette(item.secondary_color) : c;

  const bg = `
    <rect width="600" height="600" fill="#F6F4F0"/>
    <radialGradient id="pedestal-${item.id}" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="70%" stop-color="#EAE5DC" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#DDD6C9" stop-opacity="0.9"/>
    </radialGradient>
    <rect width="600" height="600" fill="url(#pedestal-${item.id})"/>
    <ellipse cx="300" cy="520" rx="170" ry="22" fill="#14110E" opacity="0.12" filter="blur(8px)"/>
    <ellipse cx="300" cy="516" rx="125" ry="14" fill="#14110E" opacity="0.16" filter="blur(3px)"/>
  `;

  let art = '';

  if (item.category === 'Top') {
    if (item.sub_category === 'T-shirt' || item.sub_category === 'Polo') {
      const isPolo = item.sub_category === 'Polo';
      const isBoxy = (item.silhouette || '').includes('Boxy') || (item.silhouette || '').includes('Oversized');
      const isCropped = (item.silhouette || '').includes('Cropped');
      const isStriped = item.pattern === 'Striped';
      const isTextured = item.pattern === 'Textured';

      const hemY = isCropped ? 425 : 475;
      const bodyWidth = isBoxy ? 200 : 180;
      const leftX = 300 - bodyWidth / 2;
      const rightX = 300 + bodyWidth / 2;

      art = `
        <g id="tshirt">
          <path d="M 215 150 L 135 210 L 170 260 L 210 235 L ${leftX} ${hemY} L ${rightX} ${hemY} L 390 235 L 430 260 L 465 210 L 385 150 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M ${leftX} 235 L ${leftX} ${hemY} L ${leftX + 35} ${hemY} L ${leftX + 25} 235 Z" fill="${c.shadow}" opacity="0.25"/>
          <path d="M ${rightX} 235 L ${rightX} ${hemY} L ${rightX - 35} ${hemY} L ${rightX - 25} 235 Z" fill="${c.shadow}" opacity="0.25"/>

          ${isPolo ? `
            <path d="M 245 150 L 300 190 L 355 150 L 330 135 L 300 145 L 270 135 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
            <rect x="288" y="185" width="24" height="105" rx="3" fill="${c.base}" stroke="${c.line}" stroke-width="1.8"/>
            <circle cx="300" cy="205" r="3.5" fill="${c.accent}"/>
            <circle cx="300" cy="235" r="3.5" fill="${c.accent}"/>
            <circle cx="300" cy="265" r="3.5" fill="${c.accent}"/>
          ` : `
            <path d="M 250 150 Q 300 195 350 150 Q 300 178 250 150 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
            <path d="M 252 153 Q 300 192 348 153" fill="none" stroke="${c.accent}" stroke-width="1.5" stroke-dasharray="3,3"/>
          `}

          <line x1="${leftX}" y1="${hemY - 10}" x2="${rightX}" y2="${hemY - 10}" stroke="${c.accent}" stroke-width="1.5" stroke-dasharray="4,3"/>

          ${isStriped ? `
            <line x1="${leftX}" y1="265" x2="${rightX}" y2="265" stroke="${sec.base}" stroke-width="7"/>
            <line x1="${leftX}" y1="295" x2="${rightX}" y2="295" stroke="${sec.base}" stroke-width="7"/>
            <line x1="${leftX}" y1="325" x2="${rightX}" y2="325" stroke="${sec.base}" stroke-width="7"/>
            <line x1="${leftX}" y1="355" x2="${rightX}" y2="355" stroke="${sec.base}" stroke-width="7"/>
            <line x1="${leftX}" y1="385" x2="${rightX}" y2="385" stroke="${sec.base}" stroke-width="7"/>
            <line x1="${leftX}" y1="415" x2="${rightX}" y2="415" stroke="${sec.base}" stroke-width="7"/>
          ` : ''}

          ${isTextured ? `
            <pattern id="waffle-${item.id}" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="none"/>
              <path d="M 0 0 L 8 0 L 8 8 L 0 8 Z" fill="none" stroke="${c.line}" stroke-width="0.5" opacity="0.3"/>
            </pattern>
            <rect x="${leftX}" y="200" width="${bodyWidth}" height="${hemY - 200}" fill="url(#waffle-${item.id})"/>
          ` : ''}
        </g>
      `;
    } else if (item.sub_category === 'Shirt') {
      const isKurta = item.name.includes('Kurta') || item.sub_category === 'Kurta';
      const hemY = isKurta ? 505 : 480;
      art = `
        <g id="shirt">
          <path d="M 220 140 L 150 195 L 180 250 L 215 225 L 215 ${hemY} Q 300 ${hemY + 15} 385 ${hemY} L 385 225 L 420 250 L 450 195 L 380 140 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M 215 225 L 215 ${hemY} Q 250 ${hemY + 8} 260 ${hemY} L 245 225 Z" fill="${c.shadow}" opacity="0.25"/>
          <path d="M 385 225 L 385 ${hemY} Q 350 ${hemY + 8} 340 ${hemY} L 355 225 Z" fill="${c.shadow}" opacity="0.25"/>
          <path d="M 240 140 L 300 170 L 360 140 L 335 125 L 300 135 L 265 125 Z" fill="${c.base}" stroke="${c.line}" stroke-width="2.2"/>
          <path d="M 240 140 L 255 175 L 285 165 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="1.8"/>
          <path d="M 360 140 L 345 175 L 315 165 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="1.8"/>
          <line x1="300" y1="165" x2="300" y2="${hemY + 8}" stroke="${c.line}" stroke-width="2.5"/>
          <circle cx="300" cy="205" r="3.5" fill="#FAF8F5" stroke="${c.line}" stroke-width="1"/>
          <circle cx="300" cy="250" r="3.5" fill="#FAF8F5" stroke="${c.line}" stroke-width="1"/>
          <circle cx="300" cy="295" r="3.5" fill="#FAF8F5" stroke="${c.line}" stroke-width="1"/>
          <circle cx="300" cy="340" r="3.5" fill="#FAF8F5" stroke="${c.line}" stroke-width="1"/>
          <circle cx="300" cy="385" r="3.5" fill="#FAF8F5" stroke="${c.line}" stroke-width="1"/>
          <path d="M 240 235 L 275 235 L 275 285 L 257 295 L 240 285 Z" fill="${c.base}" stroke="${c.line}" stroke-width="1.8"/>
        </g>
      `;
    } else if (item.sub_category === 'Sweater' || item.sub_category === 'Cardigan') {
      art = `
        <g id="knitwear">
          <path d="M 205 145 L 130 200 L 165 255 L 205 230 L 205 470 L 395 470 L 395 230 L 435 255 L 470 200 L 395 145 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.8" stroke-linejoin="round"/>
          <path d="M 245 145 Q 300 185 355 145 Q 300 170 245 145 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
          <rect x="205" y="445" width="190" height="25" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
          <line x1="205" y1="445" x2="395" y2="445" stroke="${c.line}" stroke-width="2"/>
          <path d="M 285 190 Q 295 220 285 250 Q 275 280 285 310 Q 295 340 285 370 Q 275 400 285 440" fill="none" stroke="${c.line}" stroke-width="2.5" opacity="0.4"/>
          <path d="M 315 190 Q 305 220 315 250 Q 325 280 315 310 Q 305 340 315 370 Q 325 400 315 440" fill="none" stroke="${c.line}" stroke-width="2.5" opacity="0.4"/>
        </g>
      `;
    } else {
      // Blazer / Jacket / Outerwear
      const isDoubleBreasted = item.name.includes('Double-Breasted');
      art = `
        <g id="outerwear">
          <path d="M 215 140 L 135 190 L 165 245 L 205 225 L 205 485 L 395 485 L 395 225 L 435 245 L 465 190 L 385 140 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
          <polygon points="215,140 260,210 240,215 270,270 215,175" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          <polygon points="385,140 340,210 360,215 330,270 385,175" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          <rect x="220" y="380" width="60" height="24" rx="2" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          <rect x="320" y="380" width="60" height="24" rx="2" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          ${isDoubleBreasted ? `
            <circle cx="280" cy="345" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
            <circle cx="320" cy="345" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
            <circle cx="280" cy="385" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
            <circle cx="320" cy="385" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
          ` : `
            <circle cx="300" cy="355" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
            <circle cx="300" cy="395" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
          `}
        </g>
      `;
    }
  } else if (item.category === 'Bottom') {
    if (item.sub_category === 'Shorts') {
      art = `
        <g id="shorts">
          <path d="M 210 180 L 390 180 L 375 390 L 308 390 L 300 270 L 292 390 L 225 390 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.8" stroke-linejoin="round"/>
          <rect x="210" y="180" width="180" height="28" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
          <line x1="300" y1="180" x2="300" y2="270" stroke="${c.line}" stroke-width="2"/>
          <path d="M 225 208 L 255 240" stroke="${c.line}" stroke-width="2"/>
          <path d="M 375 208 L 345 240" stroke="${c.line}" stroke-width="2"/>
          <line x1="260" y1="240" x2="260" y2="380" stroke="${c.shadow}" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="340" y1="240" x2="340" y2="380" stroke="${c.shadow}" stroke-width="1.5" stroke-dasharray="3,3"/>
        </g>
      `;
    } else {
      const isJeans = item.sub_category === 'Jeans';
      art = `
        <g id="trousers">
          <path d="M 220 160 L 380 160 L 365 490 L 312 490 L 300 270 L 288 490 L 235 490 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M 300 270 L 288 490 L 296 490 Z" fill="${c.shadow}" opacity="0.3"/>
          <path d="M 300 270 L 312 490 L 304 490 Z" fill="${c.shadow}" opacity="0.3"/>
          <rect x="220" y="160" width="160" height="28" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
          <path d="M 300 188 L 300 265 Q 295 270 288 270" fill="none" stroke="${c.line}" stroke-width="2"/>
          ${isJeans ? `
            <path d="M 235 188 Q 260 215 275 188" fill="none" stroke="#B87333" stroke-width="2"/>
            <path d="M 365 188 Q 340 215 325 188" fill="none" stroke="#B87333" stroke-width="2"/>
            <line x1="222" y1="188" x2="378" y2="188" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="3,3"/>
          ` : `
            <line x1="265" y1="188" x2="265" y2="480" stroke="${c.line}" stroke-width="1.8" opacity="0.7"/>
            <line x1="335" y1="188" x2="335" y2="480" stroke="${c.line}" stroke-width="1.8" opacity="0.7"/>
          `}
          <line x1="235" y1="480" x2="288" y2="480" stroke="${c.line}" stroke-width="2"/>
          <line x1="312" y1="480" x2="365" y2="480" stroke="${c.line}" stroke-width="2"/>
        </g>
      `;
    }
  } else if (item.category === 'Shoes') {
    art = `
      <g id="footwear">
        <g opacity="0.65" transform="translate(45, -30) scale(0.92)">
          <path d="M 170 380 Q 230 330 330 340 Q 410 350 435 390 Q 420 420 330 420 L 170 420 Z" 
                fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
        </g>
        <path d="M 150 410 Q 210 340 310 355 Q 410 365 440 410 Q 420 445 320 445 L 150 445 Z" 
              fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M 145 445 L 445 445 Q 440 460 410 460 L 155 460 Q 145 455 145 445 Z" 
              fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
        <rect x="155" y="460" width="60" height="15" rx="3" fill="#14110E" stroke="${c.line}" stroke-width="2"/>
        <path d="M 260 365 Q 310 380 340 370" fill="none" stroke="${c.accent}" stroke-width="2"/>
      </g>
    `;
  } else if (item.category === 'Accessories') {
    if (item.sub_category === 'Watch') {
      art = `
        <g id="watch">
          <rect x="270" y="140" width="60" height="320" rx="8" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
          <circle cx="300" cy="300" r="70" fill="#E5E0D8" stroke="#D4AF37" stroke-width="6"/>
          <circle cx="300" cy="300" r="62" fill="#181512" stroke="${c.line}" stroke-width="2"/>
          <line x1="300" y1="245" x2="300" y2="255" stroke="#D4AF37" stroke-width="3"/>
          <line x1="300" y1="345" x2="300" y2="355" stroke="#D4AF37" stroke-width="3"/>
          <line x1="245" y1="300" x2="255" y2="300" stroke="#D4AF37" stroke-width="3"/>
          <line x1="345" y1="300" x2="355" y2="300" stroke="#D4AF37" stroke-width="3"/>
          <line x1="300" y1="300" x2="325" y2="270" stroke="#FAF8F5" stroke-width="2.5"/>
          <line x1="300" y1="300" x2="275" y2="315" stroke="#FAF8F5" stroke-width="3"/>
          <circle cx="300" cy="300" r="4" fill="#D4AF37"/>
        </g>
      `;
    } else if (item.sub_category === 'Sunglasses') {
      art = `
        <g id="sunglasses">
          <path d="M 180 280 Q 240 260 300 280 Q 360 260 420 280 Q 430 330 375 350 Q 315 360 310 300 Q 290 300 285 360 Q 225 350 170 330 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3"/>
          <path d="M 195 290 Q 240 280 280 295 Q 275 345 235 340 Q 195 330 195 290 Z" fill="#1C2E24" stroke="${c.line}" stroke-width="1.5"/>
          <path d="M 320 295 Q 360 280 405 290 Q 405 330 365 340 Q 325 345 320 295 Z" fill="#1C2E24" stroke="${c.line}" stroke-width="1.5"/>
        </g>
      `;
    } else if (item.sub_category === 'Tie') {
      art = `
        <g id="tie">
          <polygon points="280,180 320,180 310,210 290,210" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          <polygon points="290,210 310,210 330,420 300,455 270,420" fill="${c.base}" stroke="${c.line}" stroke-width="2.5"/>
          <polygon points="290,210 300,210 300,455 270,420" fill="${c.shadow}" opacity="0.3"/>
        </g>
      `;
    } else if (item.sub_category === 'Scarf') {
      art = `
        <g id="scarf">
          <path d="M 250 180 Q 300 200 350 180 L 350 420 L 320 440 L 320 220 L 280 220 L 280 450 L 250 430 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.5"/>
          ${[0, 5, 10, 15, 20, 25].map(x => `<line x1="${252 + x}" y1="430" x2="${252 + x}" y2="445" stroke="${c.accent}" stroke-width="1.5"/>`).join('')}
          ${[0, 5, 10, 15, 20, 25].map(x => `<line x1="${322 + x}" y1="440" x2="${322 + x}" y2="455" stroke="${c.accent}" stroke-width="1.5"/>`).join('')}
        </g>
      `;
    } else {
      art = `
        <g id="accessory">
          <rect x="230" y="210" width="140" height="200" rx="14" fill="${c.base}" stroke="${c.line}" stroke-width="3"/>
          <circle cx="300" cy="310" r="14" fill="#D4AF37" stroke="${c.line}" stroke-width="2"/>
          <line x1="230" y1="260" x2="370" y2="260" stroke="${c.line}" stroke-width="2"/>
        </g>
      `;
    }
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#14110E" flood-opacity="0.18"/>
    </filter>
  </defs>
  ${bg}
  <g filter="url(#softShadow)">
    ${art}
  </g>
</svg>
  `.trim();
}

console.log('Building complete 160 garment catalog specifications...');
