import fs from 'node:fs';
import path from 'node:path';

/**
 * High-Fashion Architectural Vector Engine for Virtual Wardrobe Analyzer
 * 
 * Provides bespoke, anatomically accurate, and construction-specific
 * product illustrations with realistic fabric textures, folds, stitch lines,
 * collar shapes, soles, hardware, and studio drop shadows.
 */

// Color definition table with highlight, base, shadow, and line values
export const FASHION_PALETTE = {
  'White': { base: '#FAFAF8', shadow: '#E5E2DC', darkShadow: '#CBC6BD', line: '#B8B2A7', highlight: '#FFFFFF', hex: '#FFFFFF' },
  'Black': { base: '#1C1A18', shadow: '#100F0E', darkShadow: '#080706', line: '#2C2A27', highlight: '#3D3A36', hex: '#111827' },
  'Charcoal': { base: '#34383F', shadow: '#24272C', darkShadow: '#191B1F', line: '#4A5059', highlight: '#5E6571', hex: '#374151' },
  'Heather Grey': { base: '#B8BDC6', shadow: '#9AA0AB', darkShadow: '#818792', line: '#6C727D', highlight: '#D4D8E0', hex: '#9CA3AF' },
  'Navy': { base: '#1C2B3C', shadow: '#121C27', darkShadow: '#0B121A', line: '#2C415A', highlight: '#3F5A7C', hex: '#1E3A8A' },
  'Sky Blue': { base: '#A8C7DC', shadow: '#86ABC3', darkShadow: '#6B90A8', line: '#52778F', highlight: '#CBE0EE', hex: '#60A5FA' },
  'Olive': { base: '#4E5742', shadow: '#383F2F', darkShadow: '#262B20', line: '#657056', highlight: '#7E8B6C', hex: '#4D7C0F' },
  'Sage': { base: '#92A28E', shadow: '#778873', darkShadow: '#5F6E5B', line: '#4C5948', highlight: '#B0BEAD', hex: '#84CC16' },
  'Beige': { base: '#DDD2C3', shadow: '#C2B5A3', darkShadow: '#A69886', line: '#8F816F', highlight: '#EFE9DE', hex: '#D6D3D1' },
  'Khaki': { base: '#BDA88D', shadow: '#A18D72', darkShadow: '#847257', line: '#6A5A41', highlight: '#D7C6AE', hex: '#A8A29E' },
  'Camel': { base: '#C89B6A', shadow: '#A87C4B', darkShadow: '#875F31', line: '#6D4A21', highlight: '#E2BA8D', hex: '#D97706' },
  'Brown': { base: '#614436', shadow: '#463025', darkShadow: '#301F17', line: '#7A5746', highlight: '#956D59', hex: '#78350F' },
  'Burgundy': { base: '#5C1A27', shadow: '#411019', darkShadow: '#2A080F', line: '#7A2737', highlight: '#963447', hex: '#881337' },
  'Bordeaux': { base: '#4D1723', shadow: '#340C16', darkShadow: '#20060C', line: '#672432', highlight: '#813142', hex: '#4C0519' },
  'Champagne': { base: '#EDDEC9', shadow: '#D5C3AC', darkShadow: '#B9A68E', line: '#A18D74', highlight: '#FAF3E8', hex: '#FEF3C7' },
  'Ecru': { base: '#F5EFE5', shadow: '#DDD3C3', darkShadow: '#C1B6A3', line: '#A89C87', highlight: '#FFFFFF', hex: '#F5F5F4' },
  'Rust': { base: '#9E5035', shadow: '#7C3B24', darkShadow: '#5D2916', line: '#C06648', highlight: '#DE7C5E', hex: '#EA580C' },
  'Indigo': { base: '#1F314D', shadow: '#142135', darkShadow: '#0C1522', line: '#2E476F', highlight: '#41639A', hex: '#1E40AF' },
  'Clay': { base: '#A56A57', shadow: '#86513F', darkShadow: '#693B2B', line: '#BF7F6B', highlight: '#C58C7A', hex: '#C2410C' },
  'Teal': { base: '#2C5C5E', shadow: '#1C3E40', darkShadow: '#112728', line: '#417B7D', highlight: '#549799', hex: '#0F766E' }
};

export function getColor(colorName) {
  return FASHION_PALETTE[colorName] || FASHION_PALETTE['Charcoal'];
}

// Background & Lighting Frame
export function renderCanvasBackground(id) {
  return `
    <defs>
      <radialGradient id="studio-pedestal-${id}" cx="50%" cy="48%" r="62%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
        <stop offset="65%" stop-color="#EDE9DF" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#DDD6C7" stop-opacity="0.9"/>
      </radialGradient>
      
      <!-- Multi-tier soft realistic contact shadow -->
      <filter id="shadow-ambient-${id}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="16"/>
        <feOffset dx="0" dy="18" result="offsetblur"/>
        <feFlood flood-color="#14110E" flood-opacity="0.14"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- Fine Texture Patterns -->
      <pattern id="pat-denim-${id}" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#FFFFFF" stroke-width="0.8" opacity="0.18"/>
        <line x1="3" y1="0" x2="3" y2="6" stroke="#000000" stroke-width="0.6" opacity="0.12"/>
      </pattern>

      <pattern id="pat-waffle-${id}" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="none"/>
        <path d="M 0 0 L 8 0 L 8 8 L 0 8 Z" fill="none" stroke="#000000" stroke-width="0.75" opacity="0.15"/>
        <path d="M 2 2 L 6 2 L 6 6 L 2 6 Z" fill="#000000" opacity="0.08"/>
      </pattern>

      <pattern id="pat-knit-${id}" width="10" height="12" patternUnits="userSpaceOnUse">
        <path d="M 2 0 Q 5 6 2 12 M 8 0 Q 5 6 8 12" fill="none" stroke="#000000" stroke-width="0.8" opacity="0.16"/>
      </pattern>

      <pattern id="pat-corduroy-${id}" width="6" height="600" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="3" height="600" fill="#FFFFFF" opacity="0.1"/>
        <rect x="3" y="0" width="3" height="600" fill="#000000" opacity="0.15"/>
      </pattern>
    </defs>

    <!-- Seamless Studio Backdrop -->
    <rect width="600" height="600" fill="#F5F3ED"/>
    <rect width="600" height="600" fill="url(#studio-pedestal-${id})"/>

    <!-- Dual Ground Contact Shadows -->
    <ellipse cx="300" cy="525" rx="180" ry="22" fill="#14110E" opacity="0.08" filter="blur(10px)"/>
    <ellipse cx="300" cy="522" rx="140" ry="14" fill="#14110E" opacity="0.16" filter="blur(4px)"/>
  `;
}
