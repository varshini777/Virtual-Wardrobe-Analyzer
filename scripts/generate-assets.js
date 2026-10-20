import fs from 'node:fs';
import path from 'node:path';

const clientDir = path.resolve('client/public/clothing-assets');
const serverDir = path.resolve('server/public/clothing-assets');

function makeSvg(content, bg1 = '#f8f9fa', bg2 = '#e9ecef') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#0f172a" flood-opacity="0.14"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <ellipse cx="300" cy="515" rx="175" ry="20" fill="#000000" opacity="0.08"/>
  <g filter="url(#shadow)">
    ${content}
  </g>
</svg>`;
}

const assets = {
  // 1. Streetwear Graphic Tee
  'top_graphic_tee.svg': makeSvg(`
    <path d="M 215 145 L 140 200 L 175 250 L 215 225 L 215 480 L 385 480 L 385 225 L 425 250 L 460 200 L 385 145 Z" fill="#18181b" stroke="#27272a" stroke-width="2"/>
    <path d="M 260 145 Q 300 175 340 145 Q 320 135 300 135 Q 280 135 260 145 Z" fill="#27272a"/>
    <!-- Graphic Art Print -->
    <rect x="250" y="240" width="100" height="120" rx="8" fill="#e2e8f0" opacity="0.95"/>
    <circle cx="300" cy="285" r="28" fill="#f59e0b"/>
    <path d="M 265 330 L 300 290 L 335 330 Z" fill="#0f172a"/>
    <text x="300" y="380" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#a1a1aa" text-anchor="middle" letter-spacing="4">MINIMALIST STUDIO</text>
  `, '#f1f5f9', '#e2e8f0'),

  // 2. Western Denim Shirt
  'top_denim_shirt.svg': makeSvg(`
    <defs>
      <linearGradient id="denimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2563eb"/>
        <stop offset="50%" stop-color="#1d4ed8"/>
        <stop offset="100%" stop-color="#1e3a8a"/>
      </linearGradient>
    </defs>
    <path d="M 225 140 L 155 195 L 190 245 L 225 225 L 225 470 L 375 470 L 375 225 L 410 245 L 445 195 L 375 140 Z" fill="url(#denimGrad)" stroke="#1e40af" stroke-width="2"/>
    <line x1="300" y1="160" x2="300" y2="470" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4,2"/>
    <!-- Flap Pockets -->
    <path d="M 240 235 L 275 235 L 275 270 L 257 280 L 240 270 Z" fill="#1e40af" stroke="#f59e0b" stroke-width="1.2"/>
    <path d="M 325 235 L 360 235 L 360 270 L 342 280 L 325 270 Z" fill="#1e40af" stroke="#f59e0b" stroke-width="1.2"/>
    <!-- Western Yoke -->
    <path d="M 225 185 Q 260 205 300 190 Q 340 205 375 185" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,2"/>
    <!-- Collar & Pearl Snap Buttons -->
    <path d="M 225 140 L 275 195 L 300 170 L 325 195 L 375 140 L 320 135 L 300 145 L 280 135 Z" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="2"/>
    <circle cx="300" cy="210" r="3" fill="#f8fafc"/>
    <circle cx="300" cy="255" r="3" fill="#f8fafc"/>
    <circle cx="300" cy="305" r="3" fill="#f8fafc"/>
    <circle cx="300" cy="355" r="3" fill="#f8fafc"/>
  `),

  // 3. Burgundy Heavyweight Hoodie
  'top_burgundy_hoodie.svg': makeSvg(`
    <defs>
      <linearGradient id="burgundyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#9f1239"/>
        <stop offset="100%" stop-color="#881337"/>
      </linearGradient>
    </defs>
    <!-- Sleeves & Body -->
    <path d="M 210 160 L 135 225 L 165 275 L 210 245 L 210 475 L 390 475 L 390 245 L 435 275 L 465 225 L 390 160 Z" fill="url(#burgundyGrad)"/>
    <!-- Kangaroo Pocket -->
    <path d="M 240 370 L 360 370 L 380 440 L 220 440 Z" fill="#701a31" stroke="#4c0519" stroke-width="1.5"/>
    <!-- Ribbed Hem & Cuffs -->
    <rect x="210" y="465" width="180" height="18" fill="#4c0519" rx="3"/>
    <!-- Hood Volume -->
    <path d="M 220 170 Q 200 100 300 95 Q 400 100 380 170 Q 340 185 300 175 Q 260 185 220 170 Z" fill="#881337" stroke="#4c0519" stroke-width="2"/>
    <!-- Drawstrings -->
    <path d="M 285 180 L 280 260" stroke="#fecdd3" stroke-width="3" stroke-linecap="round"/>
    <path d="M 315 180 L 320 260" stroke="#fecdd3" stroke-width="3" stroke-linecap="round"/>
  `),

  // 4. Camel Wool Tailored Blazer
  'top_camel_blazer.svg': makeSvg(`
    <defs>
      <linearGradient id="camelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4a373"/>
        <stop offset="100%" stop-color="#bc6c25"/>
      </linearGradient>
    </defs>
    <!-- Blazer Torso -->
    <path d="M 220 140 L 150 200 L 180 250 L 215 225 L 210 480 L 390 480 L 385 225 L 420 250 L 450 200 L 380 140 Z" fill="url(#camelGrad)" stroke="#99582a" stroke-width="1.5"/>
    <!-- Inner Shirt & Tie -->
    <polygon points="275,140 325,140 300,240" fill="#ffffff"/>
    <polygon points="295,155 305,155 308,220 300,230 292,220" fill="#1e3a8a"/>
    <!-- Notched Lapels -->
    <path d="M 220 140 L 265 245 L 300 330 L 335 245 L 380 140 L 335 190 L 325 185 L 345 140 Z" fill="#c68a4c" stroke="#8c4e20" stroke-width="1.5"/>
    <path d="M 220 140 L 255 190 L 265 185 L 245 140 Z" fill="#c68a4c" stroke="#8c4e20" stroke-width="1.5"/>
    <!-- Buttons & Flap Pockets -->
    <circle cx="300" cy="350" r="4.5" fill="#432818"/>
    <circle cx="300" cy="390" r="4.5" fill="#432818"/>
    <rect x="230" y="380" width="55" height="12" rx="2" fill="#bc6c25" stroke="#7f4f24"/>
    <rect x="315" y="380" width="55" height="12" rx="2" fill="#bc6c25" stroke="#7f4f24"/>
    <!-- Chest Welt Pocket -->
    <rect x="240" y="235" width="35" height="8" rx="1.5" fill="#bc6c25" stroke="#7f4f24"/>
  `),

  // 5. Structured Navy Blazer
  'top_navy_blazer.svg': makeSvg(`
    <defs>
      <linearGradient id="navyBlazer" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e3a8a"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <path d="M 220 140 L 150 200 L 180 250 L 215 225 L 210 480 L 390 480 L 385 225 L 420 250 L 450 200 L 380 140 Z" fill="url(#navyBlazer)" stroke="#020617" stroke-width="1.5"/>
    <polygon points="275,140 325,140 300,245" fill="#ffffff"/>
    <polygon points="295,150 305,150 308,225 300,235 292,225" fill="#b91c1c"/>
    <path d="M 220 140 L 265 245 L 300 335 L 335 245 L 380 140 L 335 190 L 325 185 L 345 140 Z" fill="#172554" stroke="#0f172a" stroke-width="1.5"/>
    <circle cx="300" cy="355" r="5" fill="#d4af37" stroke="#996515" stroke-width="1"/>
    <circle cx="300" cy="395" r="5" fill="#d4af37" stroke="#996515" stroke-width="1"/>
    <rect x="230" y="385" width="55" height="12" rx="2" fill="#172554" stroke="#0f172a"/>
    <rect x="315" y="385" width="55" height="12" rx="2" fill="#172554" stroke="#0f172a"/>
    <rect x="240" y="240" width="35" height="8" rx="1.5" fill="#172554" stroke="#0f172a"/>
    <!-- Pocket Square -->
    <polygon points="250,240 258,230 266,240" fill="#ffffff"/>
  `),

  // 6. Black Peak Lapel Tuxedo Blazer
  'top_black_blazer.svg': makeSvg(`
    <path d="M 220 140 L 150 200 L 180 250 L 215 225 L 210 480 L 390 480 L 385 225 L 420 250 L 450 200 L 380 140 Z" fill="#09090b" stroke="#18181b" stroke-width="2"/>
    <polygon points="275,140 325,140 300,250" fill="#f8fafc"/>
    <!-- Black Bowtie -->
    <polygon points="290,165 310,165 300,172" fill="#000000"/>
    <polygon points="286,168 300,172 286,176" fill="#18181b"/>
    <polygon points="314,168 300,172 314,176" fill="#18181b"/>
    <!-- Silk Satin Peak Lapels -->
    <path d="M 220 140 L 255 220 L 270 205 L 260 260 L 300 340 L 340 260 L 330 205 L 345 220 L 380 140 Z" fill="#27272a" stroke="#3f3f46" stroke-width="1.5"/>
    <circle cx="300" cy="360" r="4.5" fill="#18181b" stroke="#3f3f46"/>
  `),

  // 7. Waterproof Technical Rain Jacket
  'top_rain_jacket.svg': makeSvg(`
    <defs>
      <linearGradient id="rainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
    </defs>
    <path d="M 215 150 L 140 215 L 170 265 L 215 235 L 210 480 L 390 480 L 385 235 L 430 265 L 460 215 L 385 150 Z" fill="url(#rainGrad)" stroke="#075985" stroke-width="2"/>
    <!-- Waterproof Heat-Sealed Center Zip -->
    <line x1="300" y1="140" x2="300" y2="480" stroke="#0f172a" stroke-width="5"/>
    <line x1="300" y1="140" x2="300" y2="480" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4"/>
    <!-- Rain Hood -->
    <path d="M 230 150 Q 210 90 300 85 Q 390 90 370 150 Z" fill="#0369a1" stroke="#0c4a6e" stroke-width="2"/>
    <!-- Aquaguard Chest Zip -->
    <line x1="245" y1="240" x2="280" y2="240" stroke="#0f172a" stroke-width="4"/>
    <!-- Weatherproof Badge -->
    <circle cx="260" cy="300" r="8" fill="#38bdf8" opacity="0.4"/>
    <path d="M 258 295 L 260 305 L 264 300" stroke="#ffffff" stroke-width="1.5" fill="none"/>
  `),

  // 8. Performance Athletic Training Top
  'top_athletic_tee.svg': makeSvg(`
    <defs>
      <linearGradient id="sportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#15803d"/>
        <stop offset="100%" stop-color="#166534"/>
      </linearGradient>
    </defs>
    <path d="M 225 145 L 150 195 L 180 245 L 225 220 L 225 470 L 375 470 L 375 220 L 420 245 L 450 195 L 375 145 Z" fill="url(#sportGrad)" stroke="#14532d" stroke-width="2"/>
    <!-- Raglan Athletic Seams -->
    <line x1="260" y1="145" x2="225" y2="220" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
    <line x1="340" y1="145" x2="375" y2="220" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
    <!-- Breathable Mesh Side Panels -->
    <path d="M 225 240 L 240 250 L 240 460 L 225 470 Z" fill="#14532d" opacity="0.7"/>
    <path d="M 375 240 L 360 250 L 360 460 L 375 470 Z" fill="#14532d" opacity="0.7"/>
    <!-- Reflective Chest Icon -->
    <polygon points="295,240 305,240 308,255 292,255" fill="#bbf7d0"/>
  `),

  // 9. Traditional White Linen Kurta
  'top_white_kurta.svg': makeSvg(`
    <!-- Longline Silhouette -->
    <path d="M 230 135 L 155 190 L 185 240 L 220 220 L 210 500 L 390 500 L 380 220 L 415 240 L 445 190 L 370 135 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <!-- Mandarin Band Collar -->
    <path d="M 270 135 C 270 120 330 120 330 135" fill="none" stroke="#d4af37" stroke-width="3"/>
    <!-- Slit Center Placket & Gold Buttons -->
    <line x1="300" y1="135" x2="300" y2="290" stroke="#e2e8f0" stroke-width="2"/>
    <line x1="300" y1="135" x2="300" y2="290" stroke="#d4af37" stroke-width="1.2" stroke-dasharray="4,3"/>
    <circle cx="300" cy="165" r="3" fill="#d4af37"/>
    <circle cx="300" cy="205" r="3" fill="#d4af37"/>
    <circle cx="300" cy="245" r="3" fill="#d4af37"/>
    <!-- Side Slits -->
    <line x1="210" y1="410" x2="210" y2="500" stroke="#94a3b8" stroke-width="2.5"/>
    <line x1="390" y1="410" x2="390" y2="500" stroke="#94a3b8" stroke-width="2.5"/>
  `, '#fdfbf7', '#f4ede4'),

  // 10. Traditional Olive Silk Festive Kurta
  'top_olive_kurta.svg': makeSvg(`
    <defs>
      <linearGradient id="silkOlive" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#556b2f"/>
        <stop offset="50%" stop-color="#6b8e23"/>
        <stop offset="100%" stop-color="#3d501c"/>
      </linearGradient>
    </defs>
    <path d="M 230 135 L 155 190 L 185 240 L 220 220 L 210 500 L 390 500 L 380 220 L 415 240 L 445 190 L 370 135 Z" fill="url(#silkOlive)" stroke="#283618" stroke-width="2"/>
    <path d="M 270 135 C 270 120 330 120 330 135" fill="none" stroke="#dda15e" stroke-width="3"/>
    <line x1="300" y1="135" x2="300" y2="290" stroke="#dda15e" stroke-width="2"/>
    <circle cx="300" cy="165" r="3.5" fill="#bc6c25"/>
    <circle cx="300" cy="205" r="3.5" fill="#bc6c25"/>
    <circle cx="300" cy="245" r="3.5" fill="#bc6c25"/>
    <line x1="210" y1="410" x2="210" y2="500" stroke="#283618" stroke-width="2.5"/>
    <line x1="390" y1="410" x2="390" y2="500" stroke="#283618" stroke-width="2.5"/>
  `, '#fdfbf7', '#f4ede4'),

  // 11. Traditional Silk Nehru Jacket (Waistcoat)
  'top_nehru_jacket.svg': makeSvg(`
    <defs>
      <linearGradient id="nehruGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7c2d12"/>
        <stop offset="100%" stop-color="#431407"/>
      </linearGradient>
    </defs>
    <!-- Sleeveless Vest Body -->
    <path d="M 230 145 L 210 240 L 215 470 L 385 470 L 390 240 L 370 145 Z" fill="url(#nehruGrad)" stroke="#431407" stroke-width="2"/>
    <!-- Mandarin Collar -->
    <path d="M 265 140 C 265 125 335 125 335 140" fill="none" stroke="#fed7aa" stroke-width="3.5"/>
    <!-- Buttons -->
    <line x1="300" y1="140" x2="300" y2="470" stroke="#431407" stroke-width="2.5"/>
    <circle cx="300" cy="180" r="4" fill="#d4af37"/>
    <circle cx="300" cy="225" r="4" fill="#d4af37"/>
    <circle cx="300" cy="270" r="4" fill="#d4af37"/>
    <circle cx="300" cy="315" r="4" fill="#d4af37"/>
    <circle cx="300" cy="360" r="4" fill="#d4af37"/>
    <!-- Chest Pocket with Silk Square -->
    <rect x="235" y="225" width="35" height="7" fill="#431407" stroke="#fed7aa" stroke-width="1"/>
    <polygon points="245,225 252,215 260,225" fill="#facc15"/>
  `, '#fdfbf7', '#f4ede4'),

  // 12. Striped Blue/White Summer Shirt
  'top_striped_shirt.svg': makeSvg(`
    <defs>
      <pattern id="stripes" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="8" height="16" fill="#ffffff"/>
        <rect x="8" width="8" height="16" fill="#93c5fd"/>
      </pattern>
    </defs>
    <path d="M 230 140 L 160 190 L 195 240 L 225 220 L 225 470 L 375 470 L 375 220 L 405 240 L 440 190 L 370 140 Z" fill="url(#stripes)" stroke="#60a5fa" stroke-width="2"/>
    <line x1="300" y1="160" x2="300" y2="470" stroke="#3b82f6" stroke-width="2"/>
    <path d="M 230 140 L 275 195 L 300 170 L 325 195 L 370 140 L 320 135 L 300 145 L 280 135 Z" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
    <circle cx="300" cy="205" r="3.5" fill="#1e3a8a"/>
    <circle cx="300" cy="265" r="3.5" fill="#1e3a8a"/>
    <circle cx="300" cy="325" r="3.5" fill="#1e3a8a"/>
  `),

  // 13. Black Denim Jeans
  'bottom_black_jeans.svg': makeSvg(`
    <path d="M 220 160 L 380 160 L 365 480 L 315 480 L 300 280 L 285 480 L 235 480 Z" fill="#18181b" stroke="#27272a" stroke-width="2"/>
    <!-- Waistband & Coin Pocket -->
    <rect x="220" y="160" width="160" height="25" fill="#27272a" stroke="#3f3f46" stroke-width="1.5"/>
    <circle cx="300" cy="172" r="4.5" fill="#94a3b8"/>
    <path d="M 235 185 Q 260 215 285 185" fill="none" stroke="#52525b" stroke-width="1.5"/>
    <path d="M 315 185 Q 340 215 365 185" fill="none" stroke="#52525b" stroke-width="1.5"/>
  `),

  // 14. Olive Cargo Pants
  'bottom_cargo_pants.svg': makeSvg(`
    <path d="M 215 160 L 385 160 L 370 480 L 315 480 L 300 280 L 285 480 L 230 480 Z" fill="#556b2f" stroke="#3d501c" stroke-width="2"/>
    <rect x="215" y="160" width="170" height="25" fill="#3d501c"/>
    <!-- Flap Utility Pockets on Outer Thighs -->
    <rect x="205" y="270" width="30" height="45" rx="3" fill="#3d501c" stroke="#283618" stroke-width="1.5"/>
    <rect x="365" y="270" width="30" height="45" rx="3" fill="#3d501c" stroke="#283618" stroke-width="1.5"/>
  `),

  // 15. Heather Grey Athletic Joggers
  'bottom_joggers.svg': makeSvg(`
    <path d="M 225 160 L 375 160 L 350 470 L 325 470 L 300 280 L 275 470 L 250 470 Z" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
    <!-- Elastic Waistband & Cuffs -->
    <rect x="220" y="160" width="160" height="25" rx="4" fill="#64748b"/>
    <!-- Drawstring -->
    <path d="M 295 185 L 290 230" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
    <path d="M 305 185 L 310 230" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/>
    <rect x="245" y="465" width="35" height="15" rx="2" fill="#64748b"/>
    <rect x="320" y="465" width="35" height="15" rx="2" fill="#64748b"/>
  `),

  // 16. Athletic Quick-Dry Shorts
  'bottom_athletic_shorts.svg': makeSvg(`
    <path d="M 220 180 L 380 180 L 370 360 L 315 360 L 300 260 L 285 360 L 230 360 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <rect x="220" y="180" width="160" height="20" fill="#1e293b"/>
    <!-- Side Slits & Accent Stripe -->
    <line x1="230" y1="200" x2="230" y2="350" stroke="#38bdf8" stroke-width="3"/>
    <line x1="370" y1="200" x2="370" y2="350" stroke="#38bdf8" stroke-width="3"/>
  `),

  // 17. Navy Formal Wool Trousers
  'bottom_navy_trousers.svg': makeSvg(`
    <path d="M 225 155 L 375 155 L 360 485 L 315 485 L 300 280 L 285 485 L 240 485 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.8"/>
    <!-- Crisp Center Press Creases -->
    <line x1="262" y1="200" x2="262" y2="485" stroke="#334155" stroke-width="1.5"/>
    <line x1="338" y1="200" x2="338" y2="485" stroke="#334155" stroke-width="1.5"/>
    <!-- Slanted Side Pockets -->
    <line x1="235" y1="180" x2="255" y2="230" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="365" y1="180" x2="345" y2="230" stroke="#0f172a" stroke-width="1.5"/>
  `),

  // 18. Cream Relaxed Summer Linen Trousers
  'bottom_linen_pants.svg': makeSvg(`
    <path d="M 220 160 L 380 160 L 365 480 L 315 480 L 300 280 L 285 480 L 235 480 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.8"/>
    <line x1="260" y1="200" x2="260" y2="480" stroke="#e2e8f0" stroke-width="1.5"/>
    <line x1="340" y1="200" x2="340" y2="480" stroke="#e2e8f0" stroke-width="1.5"/>
  `, '#fdfbf7', '#ede8df'),

  // 19. Traditional Cotton Churidar / Pajama Trousers
  'bottom_traditional_churidar.svg': makeSvg(`
    <!-- Tapered traditional gather -->
    <path d="M 225 160 L 375 160 L 340 430 L 330 490 L 315 490 L 300 280 L 285 490 L 270 490 L 260 430 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.8"/>
    <!-- Traditional Ruched Gathers at Ankle -->
    <path d="M 265 440 Q 280 445 295 440" stroke="#94a3b8" stroke-width="1" fill="none"/>
    <path d="M 267 460 Q 282 465 297 460" stroke="#94a3b8" stroke-width="1" fill="none"/>
    <path d="M 305 440 Q 320 445 335 440" stroke="#94a3b8" stroke-width="1" fill="none"/>
    <path d="M 303 460 Q 318 465 333 460" stroke="#94a3b8" stroke-width="1" fill="none"/>
  `, '#fdfbf7', '#ede8df'),

  // 20. Performance Running Trainers
  'shoes_running_trainers.svg': makeSvg(`
    <g transform="translate(10, 0)">
      <!-- Left Shoe -->
      <path d="M 120 340 Q 180 320 220 300 L 245 340 Q 220 360 170 370 L 110 365 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
      <path d="M 105 365 Q 170 375 250 345 L 255 365 Q 170 395 100 380 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Right Shoe -->
      <path d="M 320 340 Q 380 320 420 300 L 445 340 Q 420 360 370 370 L 310 365 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
      <path d="M 305 365 Q 370 375 450 345 L 455 365 Q 370 395 300 380 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    </g>
  `),

  // 21. Chunky Streetwear Sneakers
  'shoes_chunky_sneakers.svg': makeSvg(`
    <g transform="translate(10, 0)">
      <path d="M 115 320 Q 170 300 230 280 L 255 330 Q 220 360 160 370 L 105 355 Z" fill="#18181b" stroke="#27272a" stroke-width="2"/>
      <path d="M 100 355 Q 170 380 265 335 L 275 365 Q 170 410 90 385 Z" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <path d="M 315 320 Q 370 300 430 280 L 455 330 Q 420 360 360 370 L 305 355 Z" fill="#18181b" stroke="#27272a" stroke-width="2"/>
      <path d="M 300 355 Q 370 380 465 335 L 475 365 Q 370 410 290 385 Z" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
    </g>
  `),

  // 22. Sand Suede Penny Loafers
  'shoes_suede_loafers.svg': makeSvg(`
    <g transform="translate(20, 20)">
      <path d="M 120 330 Q 170 305 210 315 Q 240 330 235 360 Q 170 380 110 360 Z" fill="#d4a373" stroke="#bc6c25" stroke-width="1.8"/>
      <path d="M 160 315 L 195 315 L 195 335 L 160 335 Z" fill="#bc6c25"/>
      <path d="M 280 330 Q 330 305 370 315 Q 400 330 395 360 Q 330 380 270 360 Z" fill="#d4a373" stroke="#bc6c25" stroke-width="1.8"/>
      <path d="M 320 315 L 355 315 L 355 335 L 320 335 Z" fill="#bc6c25"/>
    </g>
  `),

  // 23. Cognac Classic Leather Derby Shoes
  'shoes_derby_brown.svg': makeSvg(`
    <g transform="translate(15, 20)">
      <path d="M 115 325 Q 170 295 220 305 Q 250 325 240 360 Q 170 380 105 355 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
      <path d="M 165 305 L 195 305 L 190 335 L 160 335 Z" fill="#451a03"/>
      <path d="M 285 325 Q 340 295 390 305 Q 420 325 410 360 Q 340 380 275 355 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/>
      <path d="M 335 305 L 365 305 L 360 335 L 330 335 Z" fill="#451a03"/>
    </g>
  `),

  // 24. Full-Grain Brown Leather Summer Sandals
  'shoes_leather_sandals.svg': makeSvg(`
    <g transform="translate(20, 20)">
      <!-- Footbed Sole -->
      <ellipse cx="170" cy="350" rx="65" ry="24" fill="#a3704c" stroke="#58311a" stroke-width="2"/>
      <!-- Cross Straps -->
      <path d="M 125 345 Q 170 315 215 355" stroke="#58311a" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 135 360 Q 170 325 205 340" stroke="#58311a" stroke-width="8" stroke-linecap="round" fill="none"/>
      
      <ellipse cx="330" cy="350" rx="65" ry="24" fill="#a3704c" stroke="#58311a" stroke-width="2"/>
      <path d="M 285 345 Q 330 315 375 355" stroke="#58311a" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 295 360 Q 330 325 365 340" stroke="#58311a" stroke-width="8" stroke-linecap="round" fill="none"/>
    </g>
  `),

  // 25. Traditional Indian Embroidered Leather Juttis / Mojris
  'shoes_traditional_juttis.svg': makeSvg(`
    <g transform="translate(15, 20)">
      <!-- Curved traditional toe -->
      <path d="M 110 340 Q 160 310 220 310 Q 240 320 250 340 Q 240 365 190 365 Q 140 365 105 350 Q 95 340 110 340 Z" fill="#99582a" stroke="#6f3910" stroke-width="1.8"/>
      <!-- Gold Zari Embroidery -->
      <path d="M 150 330 Q 180 320 210 330" stroke="#d4af37" stroke-width="2" fill="none"/>
      <circle cx="180" cy="335" r="3" fill="#d4af37"/>
      
      <path d="M 280 340 Q 330 310 390 310 Q 410 320 420 340 Q 410 365 360 365 Q 310 365 275 350 Q 265 340 280 340 Z" fill="#99582a" stroke="#6f3910" stroke-width="1.8"/>
      <path d="M 320 330 Q 350 320 380 330" stroke="#d4af37" stroke-width="2" fill="none"/>
      <circle cx="350" cy="335" r="3" fill="#d4af37"/>
    </g>
  `, '#fdfbf7', '#ede8df'),

  // 26. All-Weather Waterproof Lug-Sole Boots
  'shoes_hiking_boots.svg': makeSvg(`
    <g transform="translate(15, 10)">
      <path d="M 120 340 L 130 260 L 190 260 L 220 320 L 250 350 L 110 350 Z" fill="#3f2e21" stroke="#251911" stroke-width="2"/>
      <!-- Lug Sole -->
      <rect x="105" y="348" width="150" height="22" rx="3" fill="#18181b" stroke="#000000" stroke-width="1.5"/>
      <line x1="120" y1="365" x2="120" y2="370" stroke="#f59e0b" stroke-width="4"/>
      <line x1="150" y1="365" x2="150" y2="370" stroke="#f59e0b" stroke-width="4"/>
      <line x1="180" y1="365" x2="180" y2="370" stroke="#f59e0b" stroke-width="4"/>
      <line x1="210" y1="365" x2="210" y2="370" stroke="#f59e0b" stroke-width="4"/>
      
      <path d="M 290 340 L 300 260 L 360 260 L 390 320 L 420 350 L 280 350 Z" fill="#3f2e21" stroke="#251911" stroke-width="2"/>
      <rect x="275" y="348" width="150" height="22" rx="3" fill="#18181b" stroke="#000000" stroke-width="1.5"/>
      <line x1="290" y1="365" x2="290" y2="370" stroke="#f59e0b" stroke-width="4"/>
      <line x1="320" y1="365" x2="320" y2="370" stroke="#f59e0b" stroke-width="4"/>
      <line x1="350" y1="365" x2="350" y2="370" stroke="#f59e0b" stroke-width="4"/>
      <line x1="380" y1="365" x2="380" y2="370" stroke="#f59e0b" stroke-width="4"/>
    </g>
  `),

  // 27. Classic Full-Grain Leather Belt
  'accessory_leather_belt.svg': makeSvg(`
    <!-- Coiled Belt Body -->
    <path d="M 180 300 C 180 200 420 200 420 300 C 420 400 180 400 180 300" fill="none" stroke="#58311a" stroke-width="32" stroke-linecap="round"/>
    <path d="M 220 300 C 220 240 380 240 380 300 C 380 360 220 360 220 300" fill="none" stroke="#43220f" stroke-width="26" stroke-linecap="round"/>
    <!-- Polished Brass Buckle -->
    <rect x="390" y="270" width="55" height="60" rx="8" fill="none" stroke="#d4af37" stroke-width="9"/>
    <line x1="390" y1="300" x2="435" y2="300" stroke="#d4af37" stroke-width="6"/>
  `),

  // 28. Textured Silk Tie
  'accessory_silk_tie.svg': makeSvg(`
    <defs>
      <linearGradient id="tieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e3a8a"/>
        <stop offset="100%" stop-color="#172554"/>
      </linearGradient>
    </defs>
    <!-- Tie Knot -->
    <polygon points="280,150 320,150 312,190 288,190" fill="#1e3a8a" stroke="#0f172a" stroke-width="2"/>
    <!-- Blade -->
    <polygon points="288,190 312,190 328,420 300,460 272,420" fill="url(#tieGrad)" stroke="#0f172a" stroke-width="2"/>
    <!-- Diagonal Subtle Jacquard Stripes -->
    <line x1="285" y1="240" x2="315" y2="225" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
    <line x1="282" y1="290" x2="318" y2="275" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
    <line x1="278" y1="340" x2="322" y2="325" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
    <line x1="275" y1="390" x2="325" y2="375" stroke="#3b82f6" stroke-width="2" opacity="0.6"/>
  `),

  // 29. Classic Cotton Baseball Cap
  'accessory_baseball_cap.svg': makeSvg(`
    <!-- Crown -->
    <path d="M 180 340 C 180 200 420 200 420 340 Z" fill="#0f172a" stroke="#020617" stroke-width="2"/>
    <!-- Visor / Bill -->
    <path d="M 180 340 C 180 380 400 400 450 350 C 440 330 380 330 360 335 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <!-- Eyelets & Button -->
    <circle cx="300" cy="205" r="5" fill="#334155"/>
    <circle cx="260" cy="260" r="3" fill="#334155"/>
    <circle cx="340" cy="260" r="3" fill="#334155"/>
  `),

  // 30. Ribbed Knit Winter Beanie
  'accessory_beanie.svg': makeSvg(`
    <path d="M 190 340 C 190 180 410 180 410 340 Z" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <!-- Ribbed Folded Brim -->
    <rect x="180" y="325" width="240" height="45" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <line x1="220" y1="325" x2="220" y2="370" stroke="#475569" stroke-width="1.5"/>
    <line x1="260" y1="325" x2="260" y2="370" stroke="#475569" stroke-width="1.5"/>
    <line x1="300" y1="325" x2="300" y2="370" stroke="#475569" stroke-width="1.5"/>
    <line x1="340" y1="325" x2="340" y2="370" stroke="#475569" stroke-width="1.5"/>
    <line x1="380" y1="325" x2="380" y2="370" stroke="#475569" stroke-width="1.5"/>
  `),

  // 31. Canvas & Leather Minimalist Tote Bag
  'accessory_tote_bag.svg': makeSvg(`
    <!-- Tote Body -->
    <rect x="200" y="240" width="200" height="240" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="200" y="420" width="200" height="60" rx="6" fill="#78350f"/>
    <!-- Leather Shoulder Straps -->
    <path d="M 250 240 L 250 140 Q 300 120 350 140 L 350 240" fill="none" stroke="#78350f" stroke-width="10" stroke-linecap="round"/>
  `),

  // 32. Luxury Stainless Steel Chronograph Watch
  'accessory_steel_watch.svg': makeSvg(`
    <!-- Steel Link Bracelet -->
    <rect x="260" y="100" width="80" height="400" rx="6" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
    <line x1="260" y1="160" x2="340" y2="160" stroke="#cbd5e1" stroke-width="3"/>
    <line x1="260" y1="210" x2="340" y2="210" stroke="#cbd5e1" stroke-width="3"/>
    <line x1="260" y1="390" x2="340" y2="390" stroke="#cbd5e1" stroke-width="3"/>
    <line x1="260" y1="440" x2="340" y2="440" stroke="#cbd5e1" stroke-width="3"/>
    <!-- Watch Case & Bezel -->
    <circle cx="300" cy="300" r="75" fill="#f8fafc" stroke="#475569" stroke-width="6"/>
    <circle cx="300" cy="300" r="64" fill="#0f172a"/>
    <!-- Dial Markers & Hands -->
    <circle cx="300" cy="300" r="3.5" fill="#38bdf8"/>
    <line x1="300" y1="300" x2="300" y2="255" stroke="#f8fafc" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="300" y1="300" x2="335" y2="300" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="300" y1="300" x2="280" y2="325" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Chrono Sub-Dials -->
    <circle cx="300" cy="275" r="10" fill="none" stroke="#475569" stroke-width="1.5"/>
    <circle cx="280" cy="305" r="10" fill="none" stroke="#475569" stroke-width="1.5"/>
    <circle cx="320" cy="305" r="10" fill="none" stroke="#475569" stroke-width="1.5"/>
  `)
};

let count = 0;
for (const [filename, content] of Object.entries(assets)) {
  fs.writeFileSync(path.join(clientDir, filename), content.trim());
  fs.writeFileSync(path.join(serverDir, filename), content.trim());
  count++;
}

console.log(`Successfully generated and synchronized ${count} fashion visual catalog assets in client and server directories.`);
