import React from 'react';

export const POPULAR_COLORS = [
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Black', hex: '#111827' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Beige', hex: '#D4C4A8' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Brown', hex: '#78350F' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Burgundy', hex: '#831843' },
  { name: 'Green', hex: '#15803D' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Khaki', hex: '#A39171' }
];

export function getColorHex(colorName, fallbackHex) {
  if (fallbackHex) return fallbackHex;
  if (!colorName) return '#94A3B8';
  const match = POPULAR_COLORS.find(c => c.name.toLowerCase() === colorName.trim().toLowerCase());
  return match ? match.hex : '#94A3B8';
}

export default function ColorSwatch({ color, hex, size = 'md', className = '' }) {
  const displayHex = getColorHex(color, hex);
  const isLight = displayHex.toLowerCase() === '#ffffff' || displayHex.toLowerCase() === '#f8fafc';

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }[size] || 'w-4 h-4';

  return (
    <span
      className={`inline-block rounded-full shadow-sm flex-shrink-0 transition-transform ${sizeClasses} ${
        isLight ? 'border border-slate-300' : 'border border-black/10'
      } ${className}`}
      style={{ backgroundColor: displayHex }}
      title={color || 'Color'}
    />
  );
}
