import fs from 'node:fs';
import path from 'node:path';
import { FASHION_PALETTE, getColor, renderCanvasBackground } from './build-artisan-catalog.js';

const CLIENT_ASSETS_DIR = path.resolve('client/public/clothing-assets');
const SERVER_ASSETS_DIR = path.resolve('server/public/clothing-assets');
const DATA_FILE = path.resolve('server/src/data/curatedWardrobe.js');

// 12 Preserved High-Resolution Studio Photography Assets (Genuine AI photos)
const PRESERVED_JPGS = {
  'top-001': '/clothing-assets/top_white_tshirt.jpg',
  'top-016': '/clothing-assets/navy_oxford_shirt.jpg',
  'top-031': '/clothing-assets/olive_polo_shirt.jpg',
  'top-033': '/clothing-assets/grey_cashmere_sweater.jpg',
  'bot-001': '/clothing-assets/charcoal_trousers.jpg',
  'bot-002': '/clothing-assets/beige_chinos.jpg',
  'bot-017': '/clothing-assets/dark_indigo_jeans.jpg',
  'sho-001': '/clothing-assets/white_sneakers.jpg',
  'sho-009': '/clothing-assets/brown_loafers.jpg',
  'acc-001': '/clothing-assets/accessory_brown_watch.jpg',
  'acc-007': '/clothing-assets/tortoise_sunglasses.jpg',
  'acc-016': '/clothing-assets/charcoal_scarf.jpg'
};

function renderArtisanSVG(item) {
  const c = getColor(item.color);
  const sec = item.secondary_color ? getColor(item.secondary_color) : c;
  const id = item.id;
  const bg = renderCanvasBackground(id);

  let art = '';

  // -------------------------------------------------------------------------
  // TOPS RENDERING
  // -------------------------------------------------------------------------
  if (item.category === 'Top') {
    const isPolo = item.sub_category === 'Polo';
    const isShirt = item.sub_category === 'Shirt';
    const isKnit = item.sub_category === 'Sweater' || item.sub_category === 'Cardigan';
    const isBlazer = item.sub_category === 'Blazer';
    const isJacket = item.sub_category === 'Jacket';

    if (isJacket) {
      if (item.name.includes('Bomber')) {
        art = `
          <!-- MA-1 Bomber Jacket -->
          <g filter="url(#shadow-ambient-${id})">
            <!-- Ribbed Hem Band -->
            <rect x="180" y="445" width="240" height="32" rx="4" fill="${c.darkShadow}" stroke="${c.line}" stroke-width="2"/>
            <!-- Main Bomber Body -->
            <path d="M 195 160 L 110 225 L 140 280 L 180 255 L 180 445 L 420 445 L 420 255 L 460 280 L 490 225 L 405 160 Z" 
                  fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Center Heavy Metal Zipper -->
            <line x1="300" y1="185" x2="300" y2="475" stroke="#94A3B8" stroke-width="4"/>
            <rect x="296" y="240" width="8" height="16" rx="2" fill="#E2E8F0" stroke="#475569" stroke-width="1.5"/>
            <!-- Ribbed Collar -->
            <path d="M 235 160 Q 300 200 365 160 Q 300 178 235 160 Z" fill="${c.darkShadow}" stroke="${c.line}" stroke-width="2.5"/>
            <!-- Diagonal Welt Pockets with Snaps -->
            <line x1="225" y1="380" x2="265" y2="415" stroke="${c.line}" stroke-width="3"/>
            <circle cx="245" cy="397" r="3.5" fill="#CBD5E1"/>
            <line x1="375" y1="380" x2="335" y2="415" stroke="${c.line}" stroke-width="3"/>
            <circle cx="355" cy="397" r="3.5" fill="#CBD5E1"/>
            <!-- Sleeve Zipper Utility Pocket (Left Sleeve) -->
            <rect x="125" y="245" width="22" height="28" rx="2" fill="${c.shadow}" stroke="${c.line}" stroke-width="1.8"/>
            <line x1="136" y1="245" x2="136" y2="273" stroke="#94A3B8" stroke-width="2"/>
            <!-- Red Flight Ribbon Tag -->
            <rect x="133" y="270" width="6" height="24" rx="1" fill="#DC2626"/>
            <!-- Ribbed Cuffs -->
            <polygon points="110,225 140,280 152,272 122,217" fill="${c.darkShadow}" stroke="${c.line}" stroke-width="1.8"/>
            <polygon points="490,225 460,280 448,272 478,217" fill="${c.darkShadow}" stroke="${c.line}" stroke-width="1.8"/>
          </g>
        `;
      } else if (item.name.includes('Trench')) {
        art = `
          <!-- Double-Breasted Heritage Trench Coat -->
          <g filter="url(#shadow-ambient-${id})">
            <!-- Full Length Body -->
            <path d="M 210 140 L 125 195 L 155 250 L 195 230 L 195 505 Q 300 520 405 505 L 405 230 L 445 250 L 475 195 L 390 140 Z" 
                  fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Wide Revere Trench Collar -->
            <polygon points="210,140 255,230 225,235 270,300 210,200" fill="${c.base}" stroke="${c.line}" stroke-width="2.5"/>
            <polygon points="390,140 345,230 375,235 330,300 390,200" fill="${c.base}" stroke="${c.line}" stroke-width="2.5"/>
            <!-- Storm Flap (Gun Flap) Right Shoulder -->
            <polygon points="220,165 285,190 280,260 215,225" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
            <circle cx="280" cy="252" r="3" fill="#1C1815"/>
            <!-- Double Breasted 10-Button Grid -->
            ${[230, 280, 330, 380].map(y => `
              <circle cx="270" cy="${y}" r="4.5" fill="#1C1815" stroke="${c.line}" stroke-width="1"/>
              <circle cx="330" cy="${y}" r="4.5" fill="#1C1815" stroke="${c.line}" stroke-width="1"/>
            `).join('')}
            <!-- Wide Waist Belt with D-Rings -->
            <rect x="190" y="340" width="220" height="22" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
            <rect x="285" y="336" width="30" height="30" rx="3" fill="none" stroke="#D4AF37" stroke-width="3"/>
            <!-- Sleeve Tightening Straps -->
            <rect x="135" y="240" width="16" height="8" rx="1" fill="#D4AF37"/>
            <rect x="445" y="240" width="16" height="8" rx="1" fill="#D4AF37"/>
          </g>
        `;
      } else if (item.name.includes('Trucker') || item.name.includes('Denim')) {
        art = `
          <!-- Type III Denim Trucker Jacket -->
          <g filter="url(#shadow-ambient-${id})">
            <path d="M 215 150 L 130 205 L 160 260 L 200 235 L 200 455 L 400 455 L 400 235 L 440 260 L 470 205 L 385 150 Z" 
                  fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
            <rect x="200" y="180" width="200" height="275" fill="url(#pat-denim-${id})"/>
            <!-- Pointed Western Collar -->
            <path d="M 235 150 L 300 180 L 365 150 L 340 135 L 300 145 L 260 135 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
            <!-- Type III Pointed Flap Pockets -->
            <path d="M 225 240 L 275 240 L 275 285 L 250 298 L 225 285 Z" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
            <circle cx="250" cy="255" r="3.5" fill="#B87333"/>
            <path d="M 325 240 L 375 240 L 375 285 L 350 298 L 325 285 Z" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
            <circle cx="350" cy="255" r="3.5" fill="#B87333"/>
            <!-- Vertical V-Seams to Hem -->
            <line x1="250" y1="298" x2="270" y2="455" stroke="#D4AF37" stroke-width="1.8" stroke-dasharray="3,3"/>
            <line x1="350" y1="298" x2="330" y2="455" stroke="#D4AF37" stroke-width="1.8" stroke-dasharray="3,3"/>
            <!-- Metal Shank Buttons down Placket -->
            ${[200, 250, 300, 350, 400, 440].map(y => `
              <circle cx="300" cy="${y}" r="4" fill="#B87333" stroke="#5C3818" stroke-width="1.2"/>
            `).join('')}
          </g>
        `;
      } else {
        // Technical Gore Shell / Field Parka / Quilted Jacket
        art = `
          <!-- Technical Outerwear Shell -->
          <g filter="url(#shadow-ambient-${id})">
            <path d="M 210 145 L 125 200 L 155 255 L 195 235 L 195 480 Q 300 495 405 480 L 405 235 L 445 255 L 475 200 L 390 145 Z" 
                  fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
            <!-- Ergonomic Storm Hood / Tall Collar -->
            <path d="M 240 145 L 300 115 L 360 145 L 360 185 L 240 185 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
            <!-- Aquaguard Waterproof Center Zipper -->
            <line x1="300" y1="185" x2="300" y2="488" stroke="#0F172A" stroke-width="4"/>
            <!-- Angled Chest Pockets -->
            <line x1="235" y1="260" x2="280" y2="295" stroke="#0F172A" stroke-width="3.5"/>
            <line x1="365" y1="260" x2="320" y2="295" stroke="#0F172A" stroke-width="3.5"/>
            <!-- Articulated Sleeve Elbow Darts -->
            <path d="M 140 220 Q 155 235 145 250" fill="none" stroke="${c.line}" stroke-width="1.8"/>
            <path d="M 460 220 Q 445 235 455 250" fill="none" stroke="${c.line}" stroke-width="1.8"/>
          </g>
        `;
      }
    } else if (isBlazer) {
      const isDoubleBreasted = item.name.includes('Double-Breasted');
      art = `
        <!-- High Sartorial Tailored Blazer -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 215 140 L 135 190 L 165 245 L 205 225 L 205 485 L 395 485 L 395 225 L 435 245 L 465 190 L 385 140 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
          <!-- Wide Peak or Notch Lapels -->
          <polygon points="215,140 260,210 240,215 270,275 215,175" fill="${c.base}" stroke="${c.line}" stroke-width="2.2"/>
          <polygon points="385,140 340,210 360,215 330,275 385,175" fill="${c.base}" stroke="${c.line}" stroke-width="2.2"/>
          <!-- Curved Barchetta Chest Pocket with Pocket Square -->
          <path d="M 230 235 Q 250 238 270 232" fill="none" stroke="${c.line}" stroke-width="2.5"/>
          <polygon points="245,235 255,220 262,234" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
          <!-- Twin Flap Pockets -->
          <rect x="215" y="375" width="65" height="24" rx="2" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          <rect x="320" y="375" width="65" height="24" rx="2" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          ${isDoubleBreasted ? `
            <!-- 6x2 Stance Horn Buttons -->
            ${[335, 380, 425].map(y => `
              <circle cx="280" cy="${y}" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
              <circle cx="320" cy="${y}" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
            `).join('')}
          ` : `
            <!-- 2-Button Stance -->
            <circle cx="300" cy="355" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
            <circle cx="300" cy="395" r="4.5" fill="#1C1815" stroke="${c.accent}" stroke-width="1"/>
          `}
        </g>
      `;
    } else if (isKnit) {
      const isCable = item.name.includes('Cable') || item.name.includes('Fisherman');
      const isTurtleneck = item.name.includes('Turtleneck');
      const isCardigan = item.sub_category === 'Cardigan';

      art = `
        <!-- High Luxury Knitwear -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 205 145 L 130 200 L 165 255 L 205 230 L 205 470 L 395 470 L 395 230 L 435 255 L 470 200 L 395 145 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.8" stroke-linejoin="round"/>
          <rect x="205" y="170" width="190" height="300" fill="url(#pat-knit-${id})"/>
          ${isTurtleneck ? `
            <!-- High Roll Turtleneck -->
            <rect x="250" y="105" width="100" height="55" rx="6" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
            ${[0, 15, 30, 45, 60, 75, 90].map(x => `<line x1="${255 + x}" y1="105" x2="${255 + x}" y2="160" stroke="${c.line}" stroke-width="1.2" opacity="0.6"/>`).join('')}
          ` : isCardigan ? `
            <!-- Shawl Collar Cardigan -->
            <path d="M 205 145 Q 260 220 300 320 Q 340 220 395 145" fill="none" stroke="${c.line}" stroke-width="8"/>
            ${[220, 270, 320, 370, 420].map(y => `
              <circle cx="300" cy="${y}" r="5.5" fill="#5C4033" stroke="#2B1810" stroke-width="1.5"/>
            `).join('')}
          ` : `
            <!-- Heavy Crewneck -->
            <path d="M 245 145 Q 300 185 355 145 Q 300 168 245 145 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
          `}
          ${isCable ? `
            <!-- 3D Aran Cables -->
            <path d="M 270 180 Q 280 220 270 260 Q 260 300 270 340 Q 280 380 270 420" fill="none" stroke="${c.line}" stroke-width="3" opacity="0.6"/>
            <path d="M 330 180 Q 320 220 330 260 Q 340 300 330 340 Q 320 380 330 420" fill="none" stroke="${c.line}" stroke-width="3" opacity="0.6"/>
          ` : ''}
          <rect x="205" y="445" width="190" height="25" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
        </g>
      `;
    } else if (isShirt) {
      const isCuban = item.name.includes('Resort') || item.name.includes('Camp') || item.name.includes('Cuban');
      const isMandarin = item.name.includes('Mandarin') || item.name.includes('Kurta') || item.name.includes('Grandad');
      const isTuxedo = item.name.includes('Tuxedo');
      const isSafari = item.name.includes('Safari') || item.name.includes('Utility');

      art = `
        <!-- High Fashion Dress / Casual Shirt -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 220 140 L 150 195 L 180 250 L 215 225 L 215 480 Q 300 495 385 480 L 385 225 L 420 250 L 450 195 L 380 140 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>
          ${isCuban ? `
            <!-- Open Notched Camp Collar -->
            <polygon points="230,140 280,195 240,210 215,160" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
            <polygon points="370,140 320,195 360,210 385,160" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          ` : isMandarin ? `
            <!-- Clean 1" Band Collar -->
            <path d="M 255 140 Q 300 160 345 140 L 345 155 Q 300 172 255 155 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
          ` : isTuxedo ? `
            <!-- Wingtip Collar & Pleated Bib -->
            <polygon points="260,140 285,165 300,150 270,135" fill="${c.base}" stroke="${c.line}" stroke-width="1.8"/>
            <polygon points="340,140 315,165 300,150 330,135" fill="${c.base}" stroke="${c.line}" stroke-width="1.8"/>
            <rect x="260" y="165" width="80" height="180" fill="#FFFFFF" stroke="${c.line}" stroke-width="1.8"/>
            ${[0, 10, 20, 30, 40, 50, 60, 70].map(x => `<line x1="${265 + x}" y1="165" x2="${265 + x}" y2="345" stroke="#CBD5E1" stroke-width="1.2"/>`).join('')}
          ` : `
            <!-- Crisp Rolled Collar -->
            <path d="M 240 140 L 300 170 L 360 140 L 335 125 L 300 135 L 265 125 Z" fill="${c.base}" stroke="${c.line}" stroke-width="2.2"/>
          `}

          ${isSafari ? `
            <!-- Dual Bellows Cargo Chest Pockets -->
            <rect x="230" y="230" width="55" height="60" rx="3" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
            <polygon points="228,230 287,230 258,245" fill="${c.shadow}" stroke="${c.line}" stroke-width="1.8"/>
            <rect x="315" y="230" width="55" height="60" rx="3" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
            <polygon points="313,230 372,230 343,245" fill="${c.shadow}" stroke="${c.line}" stroke-width="1.8"/>
          ` : ''}

          <!-- Center Placket & Pearl Buttons -->
          <line x1="300" y1="165" x2="300" y2="488" stroke="${c.line}" stroke-width="2.5"/>
          ${[205, 250, 295, 340, 385, 430].map(y => `
            <circle cx="300" cy="${y}" r="3.5" fill="#FAF8F5" stroke="${c.line}" stroke-width="1"/>
          `).join('')}
        </g>
      `;
    } else {
      // T-Shirts & Polos
      const isBoxy = item.silhouette.includes('Boxy') || item.silhouette.includes('Oversized');
      const isAsymmetric = item.silhouette.includes('Asymmetric');
      const isStriped = item.pattern === 'Striped';
      const isCropped = item.silhouette.includes('Cropped');

      const hemY = isCropped ? 425 : 475;
      const leftHem = isAsymmetric ? 450 : hemY;
      const rightHem = isAsymmetric ? 495 : hemY;

      art = `
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 215 150 L 135 210 L 170 260 L 210 235 L 200 ${leftHem} L 400 ${rightHem} L 390 235 L 430 260 L 465 210 L 385 150 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.6" stroke-linejoin="round"/>
          ${isPolo ? `
            <path d="M 245 150 L 300 190 L 355 150 L 330 135 L 300 145 L 270 135 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
            <rect x="288" y="185" width="24" height="105" rx="3" fill="${c.base}" stroke="${c.line}" stroke-width="1.8"/>
            <circle cx="300" cy="205" r="3.5" fill="${c.accent}"/>
            <circle cx="300" cy="235" r="3.5" fill="${c.accent}"/>
          ` : `
            <path d="M 250 150 Q 300 195 350 150 Q 300 178 250 150 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
          `}

          ${isStriped ? `
            ${[265, 295, 325, 355, 385, 415].map(y => `
              <line x1="205" y1="${y}" x2="395" y2="${y}" stroke="${sec.base}" stroke-width="7"/>
            `).join('')}
          ` : ''}
        </g>
      `;
    }
  }

  // -------------------------------------------------------------------------
  // BOTTOMS RENDERING
  // -------------------------------------------------------------------------
  else if (item.category === 'Bottom') {
    const isShorts = item.sub_category === 'Shorts';
    const isJeans = item.sub_category === 'Jeans';
    const isCargo = item.sub_category.includes('Cargo') || item.name.includes('Cargo');
    const isPalazzo = item.name.includes('Palazzo') || item.name.includes('Wide-Leg');
    const isGurkha = item.name.includes('Gurkha');

    if (isShorts) {
      const isTrail = item.name.includes('Trail') || item.name.includes('Nylon');
      art = `
        <!-- High Fashion Tailored / Trail Shorts -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 210 180 L 390 180 L 375 390 L 308 390 L 300 270 L 292 390 L 225 390 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.8" stroke-linejoin="round"/>
          <rect x="210" y="180" width="180" height="28" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
          ${isTrail ? `
            <!-- Integrated Webbing Belt with Buckle -->
            <rect x="275" y="186" width="50" height="16" rx="2" fill="#0F172A"/>
            <rect x="290" y="184" width="20" height="20" rx="3" fill="#64748B" stroke="#0F172A" stroke-width="1.5"/>
            <!-- Zippered Cargo Pockets -->
            <rect x="220" y="270" width="45" height="50" rx="3" fill="${c.base}" stroke="${c.line}" stroke-width="1.8"/>
            <line x1="220" y1="280" x2="265" y2="280" stroke="#0F172A" stroke-width="2.5"/>
          ` : `
            <!-- Forward Pleats -->
            <line x1="260" y1="208" x2="260" y2="375" stroke="${c.shadow}" stroke-width="1.8"/>
            <line x1="340" y1="208" x2="340" y2="375" stroke="${c.shadow}" stroke-width="1.8"/>
          `}
        </g>
      `;
    } else {
      // Trousers & Jeans
      art = `
        <g filter="url(#shadow-ambient-${id})">
          <!-- Pant Silhouette (Wide or Tapered) -->
          <path d="M 220 160 L 380 160 L ${isPalazzo ? '395' : '365'} 490 L ${isPalazzo ? '325' : '312'} 490 L 300 270 L ${isPalazzo ? '275' : '288'} 490 L ${isPalazzo ? '205' : '235'} 490 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
          ${isJeans ? `<rect x="220" y="190" width="160" height="300" fill="url(#pat-denim-${id})"/>` : ''}

          <!-- Waistband Area -->
          <rect x="220" y="160" width="160" height="28" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>

          ${isGurkha ? `
            <!-- Signature Gurkha Crossover Waistband with Dual Buckles -->
            <path d="M 220 160 L 320 174 L 320 188 L 220 188 Z" fill="${c.base}" stroke="${c.line}" stroke-width="1.5"/>
            <rect x="315" y="168" width="14" height="16" rx="2" fill="none" stroke="#D4AF37" stroke-width="2.5"/>
            <rect x="235" y="168" width="14" height="16" rx="2" fill="none" stroke="#D4AF37" stroke-width="2.5"/>
          ` : ''}

          ${isJeans ? `
            <!-- Authentic 5-Pocket Scoop and Copper Rivets -->
            <path d="M 235 188 Q 260 215 275 188" fill="none" stroke="#B87333" stroke-width="2"/>
            <path d="M 365 188 Q 340 215 325 188" fill="none" stroke="#B87333" stroke-width="2"/>
            <circle cx="236" cy="190" r="2.5" fill="#B87333"/>
            <circle cx="364" cy="190" r="2.5" fill="#B87333"/>
            <line x1="222" y1="188" x2="378" y2="188" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="3,3"/>
          ` : `
            <!-- Sharp Pressed Center Creases -->
            <line x1="265" y1="188" x2="${isPalazzo ? '245' : '265'}" y2="480" stroke="${c.shadow}" stroke-width="2"/>
            <line x1="335" y1="188" x2="${isPalazzo ? '355' : '335'}" y2="480" stroke="${c.shadow}" stroke-width="2"/>
          `}

          ${isCargo ? `
            <!-- 3D Accordion Cargo Pockets on Thighs -->
            <rect x="205" y="270" width="35" height="55" rx="3" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
            <polygon points="203,270 242,270 222,282" fill="${c.shadow}" stroke="${c.line}" stroke-width="1.5"/>
            <rect x="360" y="270" width="35" height="55" rx="3" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
            <polygon points="358,270 397,270 377,282" fill="${c.shadow}" stroke="${c.line}" stroke-width="1.5"/>
          ` : ''}
        </g>
      `;
    }
  }

  // -------------------------------------------------------------------------
  // FOOTWEAR RENDERING
  // -------------------------------------------------------------------------
  else if (item.category === 'Shoes') {
    const isBoot = item.sub_category === 'Boots';
    const isSneaker = item.sub_category === 'Sneakers';
    const isLoafer = item.sub_category === 'Loafers';
    const isSandal = item.sub_category === 'Sandals';
    const isJutti = item.sub_category === 'Traditional Footwear';

    if (isBoot) {
      const isChelsea = item.name.includes('Chelsea');
      art = `
        <!-- High Ankle Boot Silhouette -->
        <g filter="url(#shadow-ambient-${id})">
          <!-- Ankle Shaft Extending Up -->
          <path d="M 210 270 L 290 270 L 330 350 Q 420 365 445 420 L 160 420 L 160 300 Q 185 280 210 270 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
          <!-- Commando Lugged Rubber Sole -->
          <rect x="150" y="420" width="300" height="24" rx="3" fill="#14110E" stroke="${c.line}" stroke-width="2"/>
          ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270].map(x => `
            <rect x="${160 + x}" y="438" width="16" height="6" fill="#000000"/>
          `).join('')}
          <rect x="160" y="444" width="70" height="16" rx="2" fill="#14110E"/>

          ${isChelsea ? `
            <!-- Elastic Chelsea Side Gore -->
            <polygon points="230,275 270,275 260,360 240,360" fill="#0F172A" stroke="${c.line}" stroke-width="2"/>
            <!-- Pull Tabs Front and Back -->
            <rect x="205" y="255" width="12" height="18" rx="2" fill="#334155"/>
            <rect x="285" y="255" width="12" height="18" rx="2" fill="#334155"/>
          ` : `
            <!-- Combat / Work Boot Eyelets & Laces -->
            ${[290, 315, 340, 365].map(y => `
              <circle cx="270" cy="${y}" r="3" fill="#D4AF37"/>
              <line x1="270" y1="${y}" x2="310" y2="${y + 12}" stroke="#D4AF37" stroke-width="1.8"/>
            `).join('')}
          `}
        </g>
      `;
    } else if (isSneaker) {
      const isRunner = item.name.includes('Runner');
      art = `
        <!-- Luxury Fashion Sneaker -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 150 390 Q 210 325 310 340 Q 410 350 440 395 Q 420 425 320 425 L 150 425 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
          <!-- Outsole -->
          <path d="M 145 425 L 445 425 Q 440 445 410 445 L 155 445 Q 145 435 145 425 Z" 
                fill="${isRunner ? '#D97706' : '#FAF8F5'}" stroke="${c.line}" stroke-width="2.5"/>
          <!-- Sneaker Tongue & Lacing Throat -->
          <polygon points="260,335 300,342 285,385 250,378" fill="${c.shadow}" stroke="${c.line}" stroke-width="1.8"/>
          ${[345, 357, 369].map(y => `<line x1="260" y1="${y}" x2="290" y2="${y + 4}" stroke="#FFFFFF" stroke-width="3"/>`).join('')}
          <!-- T-Toe Suede Overlay -->
          <path d="M 370 375 Q 420 375 435 398 L 385 415 Z" fill="${c.shadow}" opacity="0.4"/>
        </g>
      `;
    } else if (isLoafer) {
      const isTassel = item.name.includes('Tassel');
      art = `
        <!-- Sartorial Loafer Silhouette -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 150 395 Q 210 330 300 345 Q 410 355 440 395 Q 420 425 320 425 L 150 425 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
          <!-- Stacked Wooden Heel & Leather Sole -->
          <path d="M 145 425 L 445 425 Q 440 438 410 438 L 155 438 Q 145 430 145 425 Z" fill="#451A03" stroke="${c.line}" stroke-width="2"/>
          <rect x="155" y="438" width="60" height="15" rx="2" fill="#1C1815"/>
          <!-- Hand-Stitched Apron Toe -->
          <path d="M 270 352 Q 360 360 415 390" fill="none" stroke="${c.accent}" stroke-width="2.5"/>
          ${isTassel ? `
            <!-- Braided Leather Tassels -->
            <rect x="285" y="355" width="14" height="20" rx="3" fill="#D4AF37"/>
            <line x1="292" y1="375" x2="288" y2="395" stroke="${c.line}" stroke-width="2.5"/>
            <line x1="292" y1="375" x2="296" y2="395" stroke="${c.line}" stroke-width="2.5"/>
          ` : `
            <!-- Slotted Penny Bridge Strap -->
            <rect x="270" y="350" width="45" height="14" rx="2" fill="${c.shadow}" stroke="${c.line}" stroke-width="2"/>
            <ellipse cx="292" cy="357" rx="8" ry="2.5" fill="#1C1815"/>
          `}
        </g>
      `;
    } else if (isSandal) {
      art = `
        <!-- Woven Fisherman Sandal -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 150 415 L 440 415 Q 435 435 400 435 L 155 435 Z" fill="#D97706" stroke="${c.line}" stroke-width="2.5"/>
          <!-- Interlocking Cage Straps -->
          ${[240, 275, 310, 345, 380].map(x => `
            <rect x="${x}" y="360" width="16" height="55" rx="3" fill="${c.base}" stroke="${c.line}" stroke-width="1.8"/>
          `).join('')}
          <path d="M 220 375 L 420 375" stroke="${c.line}" stroke-width="5"/>
          <!-- Ankle Strap with Brass Buckle -->
          <rect x="175" y="345" width="20" height="70" rx="4" fill="${c.base}" stroke="${c.line}" stroke-width="2"/>
          <rect x="172" y="360" width="10" height="16" rx="2" fill="none" stroke="#D4AF37" stroke-width="2.5"/>
        </g>
      `;
    } else {
      // Traditional Jutti / Oxford
      art = `
        <!-- Handcrafted Zari Jutti / Balmoral Oxford -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 150 395 Q 210 330 300 345 Q 410 355 455 385 Q 420 425 320 425 L 150 425 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M 455 385 Q 465 375 460 365" fill="none" stroke="${c.line}" stroke-width="3"/>
          <ellipse cx="280" cy="375" rx="50" ry="18" fill="none" stroke="#D4AF37" stroke-width="2" stroke-dasharray="3,3"/>
          <circle cx="280" cy="375" r="5" fill="#D4AF37"/>
        </g>
      `;
    }
  }

  // -------------------------------------------------------------------------
  // ACCESSORIES RENDERING
  // -------------------------------------------------------------------------
  else if (item.category === 'Accessories') {
    const isWatch = item.sub_category === 'Watch';
    const isShades = item.sub_category === 'Sunglasses';
    const isTie = item.sub_category === 'Tie';
    const isScarf = item.sub_category === 'Scarf';
    const isBelt = item.sub_category === 'Belt';
    const isBag = item.sub_category === 'Bag';
    const isHat = item.sub_category === 'Cap' || item.sub_category === 'Beanie';

    if (isWatch) {
      const isTank = item.name.includes('Tank');
      const isDiver = item.name.includes('Diver');

      art = `
        <!-- High Horology Luxury Watch -->
        <g filter="url(#shadow-ambient-${id})">
          <rect x="272" y="130" width="56" height="340" rx="8" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
          <line x1="278" y1="140" x2="278" y2="460" stroke="#CBD5E1" stroke-width="1.2" stroke-dasharray="3,3"/>
          <line x1="322" y1="140" x2="322" y2="460" stroke="#CBD5E1" stroke-width="1.2" stroke-dasharray="3,3"/>

          ${isTank ? `
            <!-- Rectangular Art-Deco Tank Case -->
            <rect x="255" y="240" width="90" height="120" rx="6" fill="#D4AF37" stroke="#854D0E" stroke-width="4"/>
            <rect x="265" y="250" width="70" height="100" rx="3" fill="#FAF8F5" stroke="#1C1815" stroke-width="1.5"/>
            <!-- Roman Indices -->
            <text x="295" y="270" font-family="Georgia, serif" font-size="12" font-weight="bold" fill="#1C1815">XII</text>
            <text x="296" y="342" font-family="Georgia, serif" font-size="12" font-weight="bold" fill="#1C1815">VI</text>
            <circle cx="347" cy="300" r="4.5" fill="#1E40AF"/>
          ` : `
            <!-- Round Chronometer / Diver Case -->
            <circle cx="300" cy="300" r="75" fill="${isDiver ? '#0F172A' : '#E2DCD5'}" stroke="${isDiver ? '#0F172A' : '#D4AF37'}" stroke-width="${isDiver ? '10' : '6'}"/>
            <circle cx="300" cy="300" r="64" fill="#181512" stroke="${c.line}" stroke-width="2"/>
            <!-- Dial Markers & Hands -->
            <line x1="300" y1="242" x2="300" y2="256" stroke="#D4AF37" stroke-width="3"/>
            <line x1="300" y1="344" x2="300" y2="358" stroke="#D4AF37" stroke-width="3"/>
            <line x1="242" y1="300" x2="256" y2="300" stroke="#D4AF37" stroke-width="3"/>
            <line x1="344" y1="300" x2="358" y2="300" stroke="#D4AF37" stroke-width="3"/>
            <!-- Hands Pointing 10:10 Classic Watchmaker Pose -->
            <line x1="300" y1="300" x2="275" y2="270" stroke="#FFFFFF" stroke-width="3"/>
            <line x1="300" y1="300" x2="335" y2="280" stroke="#FFFFFF" stroke-width="2.5"/>
            <circle cx="300" cy="300" r="4" fill="#D4AF37"/>
          `}
        </g>
      `;
    } else if (isShades) {
      const isAviator = item.name.includes('Aviator');
      art = `
        <!-- High Fashion Eyewear -->
        <g filter="url(#shadow-ambient-${id})">
          ${isAviator ? `
            <!-- Aviator Teardrop Double-Bridge Wireframe -->
            <line x1="230" y1="265" x2="370" y2="265" stroke="#D4AF37" stroke-width="2.5"/>
            <line x1="270" y1="280" x2="330" y2="280" stroke="#D4AF37" stroke-width="2"/>
            <path d="M 190 280 Q 240 270 280 285 Q 285 365 240 365 Q 185 360 190 280 Z" fill="#451A03" opacity="0.8" stroke="#D4AF37" stroke-width="3"/>
            <path d="M 320 285 Q 360 270 410 280 Q 415 360 360 365 Q 315 365 320 285 Z" fill="#451A03" opacity="0.8" stroke="#D4AF37" stroke-width="3"/>
          ` : `
            <!-- Thick Hand-Polished Acetate Wayfarer -->
            <path d="M 175 275 Q 240 255 300 275 Q 360 255 425 275 Q 435 340 375 355 Q 315 365 310 300 Q 290 300 285 365 Q 225 355 165 340 Z" 
                  fill="${c.base}" stroke="${c.line}" stroke-width="3"/>
            <path d="M 190 285 Q 240 275 280 290 Q 275 345 235 340 Q 190 330 190 285 Z" fill="#064E3B" stroke="${c.line}" stroke-width="1.8"/>
            <path d="M 320 290 Q 360 275 410 285 Q 410 330 365 340 Q 325 345 320 290 Z" fill="#064E3B" stroke="${c.line}" stroke-width="1.8"/>
            <circle cx="185" cy="285" r="2" fill="#E2E8F0"/>
            <circle cx="415" cy="285" r="2" fill="#E2E8F0"/>
          `}
        </g>
      `;
    } else if (isTie) {
      art = `
        <!-- Sartorial Silk Necktie -->
        <g filter="url(#shadow-ambient-${id})">
          <polygon points="280,160 320,160 310,195 290,195" fill="${c.base}" stroke="${c.line}" stroke-width="2.2"/>
          <polygon points="290,195 310,195 330,440 300,480 270,440" fill="${c.base}" stroke="${c.line}" stroke-width="2.5"/>
          <polygon points="290,195 300,195 300,480 270,440" fill="${c.shadow}" opacity="0.35"/>
          <!-- Dimple at the knot -->
          <ellipse cx="300" cy="198" rx="4" ry="2" fill="#000000" opacity="0.4"/>
        </g>
      `;
    } else if (isBelt) {
      art = `
        <!-- English Bridle Leather Belt with Solid Brass Buckle -->
        <g filter="url(#shadow-ambient-${id})">
          <rect x="180" y="270" width="240" height="42" rx="4" fill="${c.base}" stroke="${c.line}" stroke-width="3"/>
          <!-- Solid Brass Harness Buckle Frame -->
          <rect x="160" y="258" width="55" height="66" rx="6" fill="none" stroke="#D4AF37" stroke-width="6"/>
          <line x1="160" y1="291" x2="200" y2="291" stroke="#D4AF37" stroke-width="4"/>
          <!-- Teardrop Holes -->
          ${[260, 290, 320, 350, 380].map(x => `
            <ellipse cx="${x}" cy="291" rx="4" ry="2.5" fill="#1C1815"/>
          `).join('')}
        </g>
      `;
    } else if (isBag) {
      art = `
        <!-- Structured Architecture Tote Bag -->
        <g filter="url(#shadow-ambient-${id})">
          <!-- Main Body -->
          <polygon points="210,240 390,240 415,460 185,460" fill="${c.base}" stroke="${c.line}" stroke-width="3"/>
          <polygon points="210,240 300,240 300,460 185,460" fill="${c.shadow}" opacity="0.25"/>
          <!-- Dual Rolled Tubular Handles -->
          <path d="M 255 240 Q 255 140 300 140 Q 345 140 345 240" fill="none" stroke="${c.shadow}" stroke-width="8"/>
          <!-- Metallic Base Studs -->
          <circle cx="210" cy="460" r="4" fill="#D4AF37"/>
          <circle cx="390" cy="460" r="4" fill="#D4AF37"/>
        </g>
      `;
    } else if (isHat) {
      const isBeanie = item.sub_category === 'Beanie';
      art = `
        <!-- Headwear: Beanie or Baseball Cap -->
        <g filter="url(#shadow-ambient-${id})">
          ${isBeanie ? `
            <path d="M 220 340 Q 300 200 380 340 Z" fill="${c.base}" stroke="${c.line}" stroke-width="3"/>
            <rect x="205" y="330" width="190" height="45" rx="6" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
            ${[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map(x => `<line x1="${215 + x}" y1="330" x2="${215 + x}" y2="375" stroke="${c.line}" stroke-width="1.2" opacity="0.5"/>`).join('')}
          ` : `
            <path d="M 220 330 Q 300 220 380 330 Z" fill="${c.base}" stroke="${c.line}" stroke-width="3"/>
            <circle cx="300" cy="225" r="4" fill="${c.accent}"/>
            <!-- Pre-Curved Visor -->
            <path d="M 215 330 Q 300 345 385 330 Q 420 345 420 365 Q 300 385 200 350 Z" fill="${c.shadow}" stroke="${c.line}" stroke-width="2.5"/>
          `}
        </g>
      `;
    } else {
      // Scarf
      art = `
        <!-- Ribbed Winter Wrap Scarf -->
        <g filter="url(#shadow-ambient-${id})">
          <path d="M 240 180 Q 300 205 360 180 L 360 430 L 325 450 L 325 230 L 275 230 L 275 460 L 240 440 Z" 
                fill="${c.base}" stroke="${c.line}" stroke-width="2.8"/>
          <!-- Fringes -->
          ${[0, 5, 10, 15, 20, 25, 30].map(x => `
            <line x1="${242 + x}" y1="440" x2="${242 + x}" y2="465" stroke="${c.accent}" stroke-width="1.8"/>
            <line x1="${327 + x}" y1="450" x2="${327 + x}" y2="475" stroke="${c.accent}" stroke-width="1.8"/>
          `).join('')}
        </g>
      `;
    }
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  ${bg}
  ${art}
</svg>
  `.trim();
}

export async function regenerateAllArtisanAssets() {
  const { CURATED_WARDROBE } = await import('../server/src/data/curatedWardrobe.js');
  console.log(`Processing artisan vector redesign for ${CURATED_WARDROBE.length} items...`);

  let replacedCount = 0;
  CURATED_WARDROBE.forEach(item => {
    // Skip the 12 preserved real AI studio photography items
    if (PRESERVED_JPGS[item.id]) {
      return;
    }

    const svgContent = renderArtisanSVG(item);
    const filename = path.basename(item.image_url);
    fs.writeFileSync(path.join(CLIENT_ASSETS_DIR, filename), svgContent);
    fs.writeFileSync(path.join(SERVER_ASSETS_DIR, filename), svgContent);
    replacedCount++;
  });

  console.log(`✅ Successfully regenerated ${replacedCount} bespoke high-fashion vector catalog assets!`);
}

regenerateAllArtisanAssets();
