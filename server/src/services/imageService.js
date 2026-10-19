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
    match: (sub, col, name) => (sub.includes('t-shirt') || sub.includes('tee')) && (col.includes('white') || name.includes('white')),
    asset: '/clothing-assets/top_white_tshirt.jpg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => (sub.includes('t-shirt') || sub.includes('tee')) && (col.includes('black') || name.includes('black')),
    asset: '/clothing-assets/top_black_tshirt.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('shirt') && (name.includes('linen') || col.includes('white')),
    asset: '/clothing-assets/top_white_shirt.svg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('shirt') && (col.includes('navy') || col.includes('blue') || name.includes('oxford')),
    asset: '/clothing-assets/top_navy_shirt.jpg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('sweater') || sub.includes('hoodie') || sub.includes('cardigan') || sub.includes('crewneck'),
    asset: '/clothing-assets/top_grey_sweater.jpg'
  },
  {
    category: 'Top',
    match: (sub, col, name) => sub.includes('polo'),
    asset: '/clothing-assets/top_olive_polo.jpg'
  },
  {
    category: 'Top',
    match: () => true, // Fallback top
    asset: '/clothing-assets/top_white_tshirt.jpg'
  },

  // Bottoms
  {
    category: 'Bottom',
    match: (sub, col, name) => (sub.includes('chinos') || sub.includes('trouser')) && (col.includes('beige') || col.includes('khaki') || col.includes('tan')),
    asset: '/clothing-assets/bottom_beige_chinos.jpg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => sub.includes('jeans') || col.includes('blue') || name.includes('denim'),
    asset: '/clothing-assets/bottom_blue_jeans.jpg'
  },
  {
    category: 'Bottom',
    match: (sub, col, name) => (sub.includes('trouser') || sub.includes('suit') || sub.includes('pants')) && (col.includes('grey') || col.includes('charcoal') || col.includes('black')),
    asset: '/clothing-assets/bottom_grey_trousers.jpg'
  },
  {
    category: 'Bottom',
    match: (sub) => sub.includes('short'),
    asset: '/clothing-assets/bottom_beige_shorts.svg'
  },
  {
    category: 'Bottom',
    match: () => true, // Fallback bottom
    asset: '/clothing-assets/bottom_beige_chinos.jpg'
  },

  // Shoes
  {
    category: 'Shoes',
    match: (sub, col, name) => (sub.includes('sneaker') || sub.includes('trainer')) && (col.includes('white') || name.includes('white')),
    asset: '/clothing-assets/shoes_white_sneakers.jpg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('loafer') || (col.includes('brown') && !sub.includes('boot')),
    asset: '/clothing-assets/shoes_brown_loafers.jpg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('boot') || name.includes('boot') || name.includes('chelsea') || name.includes('waterproof'),
    asset: '/clothing-assets/shoes_black_boots.svg'
  },
  {
    category: 'Shoes',
    match: (sub, col, name) => sub.includes('formal') || sub.includes('oxford') || sub.includes('derby') || name.includes('oxford'),
    asset: '/clothing-assets/shoes_black_oxfords.svg'
  },
  {
    category: 'Shoes',
    match: () => true, // Fallback shoe
    asset: '/clothing-assets/shoes_white_sneakers.jpg'
  },

  // Accessories
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
