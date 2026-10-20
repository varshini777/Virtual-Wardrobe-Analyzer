import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Image Service for Virtual Wardrobe Analyzer
 * Handles:
 * 1. User uploads preservation
 * 2. Dynamic matching of garments to high-quality fashion studio catalog assets
 * 3. Optional external AI image-generation API integration (if configured via env)
 * 4. Deterministic, category-appropriate styled visual fallbacks
 */

export function isImageApiConfigured() {
  return Boolean(process.env.IMAGE_GEN_API_KEY || process.env.OPENAI_API_KEY);
}

/**
 * Primary catalog asset dictionary matching garments by sub-category, color, and keywords
 */
const CATALOG_ASSET_RULES = [
  // Tops
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('kurta') && (col.includes('white') || col.includes('cream') || name.includes('white') || name.includes('cotton')),
    asset: '/clothing-assets/top_white_kurta.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('kurta'),
    asset: '/clothing-assets/top_olive_kurta.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('nehru') || name.includes('nehru') || sub.includes('waistcoat') || name.includes('waistcoat'),
    asset: '/clothing-assets/top_nehru_jacket.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => (sub.includes('blazer') || sub.includes('suit') || name.includes('blazer')) && (col.includes('navy') || col.includes('blue')),
    asset: '/clothing-assets/top_navy_blazer.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => (sub.includes('blazer') || sub.includes('suit') || name.includes('blazer')) && (col.includes('black') || name.includes('tuxedo')),
    asset: '/clothing-assets/top_black_blazer.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => (sub.includes('blazer') || sub.includes('jacket')) && (col.includes('camel') || col.includes('beige') || col.includes('brown') || col.includes('tan')),
    asset: '/clothing-assets/top_camel_blazer.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('rain') || name.includes('rain') || name.includes('waterproof') || name.includes('windbreaker') || sub.includes('windbreaker'),
    asset: '/clothing-assets/top_rain_jacket.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('athletic') || name.includes('athletic') || name.includes('training') || name.includes('workout') || name.includes('performance'),
    asset: '/clothing-assets/top_athletic_tee.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('denim') || name.includes('denim') || name.includes('western'),
    asset: '/clothing-assets/top_denim_shirt.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => name.includes('stripe') || sub.includes('stripe') || name.includes('striped'),
    asset: '/clothing-assets/top_striped_shirt.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => name.includes('graphic') || sub.includes('graphic') || (name.includes('street') && sub.includes('tee')),
    asset: '/clothing-assets/top_graphic_tee.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('hoodie') || (sub.includes('sweatshirt') && (col.includes('burgundy') || col.includes('red'))),
    asset: '/clothing-assets/top_burgundy_hoodie.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('polo'),
    asset: '/clothing-assets/top_olive_polo.jpg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => (sub.includes('t-shirt') || sub.includes('tee')) && (col.includes('black') || name.includes('black')),
    asset: '/clothing-assets/top_black_tshirt.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => (sub.includes('t-shirt') || sub.includes('tee')) && (col.includes('white') || name.includes('white')),
    asset: '/clothing-assets/top_white_tshirt.jpg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('shirt') && (name.includes('linen') || col.includes('white') || col.includes('cream')),
    asset: '/clothing-assets/top_white_shirt.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('shirt') && (col.includes('navy') || col.includes('blue') || name.includes('oxford')),
    asset: '/clothing-assets/top_navy_shirt.jpg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('sweater') || sub.includes('cardigan') || sub.includes('crewneck') || sub.includes('knit'),
    asset: '/clothing-assets/top_grey_sweater.jpg'
  },
  {
    category: 'Top',
    match: () => true, // Fallback top
    asset: '/clothing-assets/top_white_tshirt.jpg'
  },

  // Bottoms
  {
    category: 'Bottom',
    match: (sub, col, name) => sub.includes('churidar') || name.includes('churidar') || name.includes('pyjama') || name.includes('pajama') || (sub.includes('traditional') && sub.includes('bottom')),
    asset: '/clothing-assets/bottom_traditional_churidar.svg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => sub.includes('cargo') || name.includes('cargo') || name.includes('utility'),
    asset: '/clothing-assets/bottom_cargo_pants.svg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => sub.includes('jogger') || sub.includes('sweatpants') || name.includes('jogger') || name.includes('track pants'),
    asset: '/clothing-assets/bottom_joggers.svg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => sub.includes('short') && (name.includes('athletic') || name.includes('gym') || name.includes('training') || name.includes('running')),
    asset: '/clothing-assets/bottom_athletic_shorts.svg'
  },
  {
    category: 'Bottom',
    match: (sub) => sub.includes('short'),
    asset: '/clothing-assets/bottom_beige_shorts.svg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => (sub.includes('trouser') || sub.includes('pants')) && (name.includes('linen') || col.includes('white') || col.includes('cream')),
    asset: '/clothing-assets/bottom_linen_pants.svg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => (sub.includes('trouser') || sub.includes('suit') || sub.includes('pants')) && (col.includes('navy') || col.includes('blue')),
    asset: '/clothing-assets/bottom_navy_trousers.svg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => (sub.includes('jeans') || name.includes('jeans') || name.includes('denim')) && (col.includes('black') || col.includes('grey') || col.includes('charcoal')),
    asset: '/clothing-assets/bottom_black_jeans.svg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => sub.includes('jeans') || name.includes('jeans') || name.includes('denim'),
    asset: '/clothing-assets/bottom_blue_jeans.jpg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => (sub.includes('trouser') || sub.includes('pants') || sub.includes('suit')) && (col.includes('grey') || col.includes('charcoal') || col.includes('black')),
    asset: '/clothing-assets/bottom_grey_trousers.jpg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => (sub.includes('chinos') || sub.includes('trouser')) && (col.includes('beige') || col.includes('khaki') || col.includes('tan')),
    asset: '/clothing-assets/bottom_beige_chinos.jpg'
  },
  {
    category: 'Bottom',
    match: () => true, // Fallback bottom
    asset: '/clothing-assets/bottom_beige_chinos.jpg'
  },

  // Shoes
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('jutti') || sub.includes('mojri') || name.includes('jutti') || name.includes('mojri') || (sub.includes('traditional') && sub.includes('shoe')),
    asset: '/clothing-assets/shoes_traditional_juttis.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('sandal') || name.includes('sandal') || sub.includes('slide'),
    asset: '/clothing-assets/shoes_leather_sandals.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => (sub.includes('boot') || name.includes('boot')) && (name.includes('hiking') || name.includes('trail') || name.includes('waterproof') || name.includes('weatherproof') || name.includes('rain')),
    asset: '/clothing-assets/shoes_hiking_boots.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('boot') || name.includes('chelsea'),
    asset: '/clothing-assets/shoes_black_boots.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('running') || name.includes('running') || name.includes('trainer') || name.includes('athletic'),
    asset: '/clothing-assets/shoes_running_trainers.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => name.includes('chunky') || (name.includes('street') && sub.includes('sneaker')),
    asset: '/clothing-assets/shoes_chunky_sneakers.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('derby') || name.includes('derby'),
    asset: '/clothing-assets/shoes_derby_brown.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('loafer') && (name.includes('suede') || col.includes('sand') || col.includes('tan')),
    asset: '/clothing-assets/shoes_suede_loafers.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('loafer') || (col.includes('brown') && !sub.includes('boot')),
    asset: '/clothing-assets/shoes_brown_loafers.jpg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('formal') || sub.includes('oxford'),
    asset: '/clothing-assets/shoes_black_oxfords.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => (sub.includes('sneaker') || sub.includes('trainer')) && (col.includes('white') || name.includes('white')),
    asset: '/clothing-assets/shoes_white_sneakers.jpg'
  },
  {
    category: 'Shoes',
    match: () => true, // Fallback shoe
    asset: '/clothing-assets/shoes_white_sneakers.jpg'
  },

  // Accessories
  {
    category: 'Accessories',
    match: (sub, col, name) => sub.includes('belt') || name.includes('belt'),
    asset: '/clothing-assets/accessory_leather_belt.svg'
  },
  {
    category: 'Accessories',
    match: (sub, col, name) => sub.includes('tie') || name.includes('tie') || name.includes('bowtie'),
    asset: '/clothing-assets/accessory_silk_tie.svg'
  },
  {
    category: 'Accessories',
    match: (sub, col, name) => sub.includes('beanie') || name.includes('beanie'),
    asset: '/clothing-assets/accessory_beanie.svg'
  },
  {
    category: 'Accessories',
    match: (sub, col, name) => sub.includes('cap') || name.includes('cap') || sub.includes('hat') || name.includes('hat'),
    asset: '/clothing-assets/accessory_baseball_cap.svg'
  },
  {
    category: 'Accessories',
    match: (sub, col, name) => sub.includes('bag') || name.includes('tote') || name.includes('backpack') || name.includes('briefcase'),
    asset: '/clothing-assets/accessory_tote_bag.svg'
  },
  {
    category: 'Accessories',
    match: (sub, col, name) => (sub.includes('watch') || name.includes('watch')) && (name.includes('steel') || col.includes('silver') || col.includes('grey') || col.includes('metal')),
    asset: '/clothing-assets/accessory_steel_watch.svg'
  },
  {
    category: 'Accessories',
    match: (sub, col, name) => sub.includes('watch') || name.includes('watch'),
    asset: '/clothing-assets/accessory_brown_watch.jpg'
  },
  {
    category: 'Accessories',
    match: (sub, col, name) => sub.includes('sunglass') || sub.includes('shades') || name.includes('sunglass'),
    asset: '/clothing-assets/accessory_sunglasses.jpg'
  },
  {
    category: 'Accessories',
    match: (sub, col, name) => sub.includes('scarf') || name.includes('scarf'),
    asset: '/clothing-assets/accessory_grey_scarf.jpg'
  },
  {
    category: 'Accessories',
    match: () => true,
    asset: '/clothing-assets/accessory_brown_watch.jpg'
  }
];

/**
 * Resolves the appropriate clothing image path.
 * If user provided their own image (upload or custom URL), honors it.
 * Otherwise, dynamically assigns the best matching catalog asset.
 */
export function resolveItemImage({ name = '', category = 'Top', sub_category = '', color = '', existingImageUrl = '' }) {
  // If user already specified or uploaded an image, keep it
  if (existingImageUrl && (existingImageUrl.startsWith('/uploads/') || existingImageUrl.startsWith('http://') || existingImageUrl.startsWith('https://') || existingImageUrl.startsWith('data:'))) {
    return existingImageUrl;
  }

  const normCat = category.trim();
  const normSub = (sub_category || '').toLowerCase();
  const normCol = (color || '').toLowerCase();
  const normName = (name || '').toLowerCase();

  for (const rule of CATALOG_ASSET_RULES) {
    if (rule.category.toLowerCase() === normCat.toLowerCase()) {
      if (rule.match(normSub, normCol, normName)) {
        return rule.asset;
      }
    }
  }

  // Generic fallback if unknown category
  return '/clothing-assets/top_white_tshirt.jpg';
}
