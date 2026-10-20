import React from 'react';

export const FASHION_PALETTE = [
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Black', hex: '#111827' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Charcoal', hex: '#374151' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Light Blue', hex: '#93C5FD' },
  { name: 'Beige', hex: '#D4C4A8' },
  { name: 'Cream', hex: '#FDFBF7', border: true },
  { name: 'Brown', hex: '#78350F' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Khaki', hex: '#A39171' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Green', hex: '#15803D' },
  { name: 'Burgundy', hex: '#831843' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Orange', hex: '#EA580C' },
  { name: 'Multicolor', hex: 'linear-gradient(135deg, #ef4444 0%, #eab308 33%, #3b82f6 66%, #10b981 100%)', isGradient: true },
  { name: 'Custom', hex: '#94A3B8' }
];

export const POPULAR_COLORS = FASHION_PALETTE;

export function getColorHex(colorName, fallbackHex) {
  if (fallbackHex) return fallbackHex;
  if (!colorName) return '#94A3B8';
  const match = FASHION_PALETTE.find(c => c.name.toLowerCase() === colorName.trim().toLowerCase());
  return match ? match.hex : '#94A3B8';
}

export default function ColorSwatch({ color, hex, size = 'md', className = '', showLabel = false }) {
  const displayHex = getColorHex(color, hex);
  const isLight = displayHex.toLowerCase() === '#ffffff' || displayHex.toLowerCase() === '#fdfbf7';
  const isGradient = displayHex.startsWith('linear-gradient');

  const sizeClasses = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }[size] || 'w-4 h-4';

  const swatch = (
    <span
      className={`inline-block rounded-full shadow-xs shrink-0 transition-transform ${sizeClasses} ${
        isLight ? 'border border-slate-300' : 'border border-black/10'
      } ${className}`}
      style={isGradient ? { backgroundImage: displayHex } : { backgroundColor: displayHex }}
      title={color || 'Color'}
      aria-label={color || 'Color swatch'}
    />
  );

  if (!showLabel) return swatch;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
      {swatch}
      <span>{color}</span>
    </span>
  );
}
