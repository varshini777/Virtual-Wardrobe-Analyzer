import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Sun, 
  Snowflake, 
  CloudRain, 
  Check, 
  Shirt, 
  Footprints, 
  ShieldCheck, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  BarChart3,
  Sliders
} from 'lucide-react';
import ColorSwatch from './ColorSwatch.jsx';

function GarmentImageSlot({ label, item, colorAccent }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const fallbackAsset = {
    Top: '/clothing-assets/top_white_tshirt.jpg',
    Bottom: '/clothing-assets/bottom_beige_chinos.jpg',
    Shoes: '/clothing-assets/shoes_white_sneakers.jpg',
    Accessories: '/clothing-assets/accessory_brown_watch.jpg'
  }[label] || '/clothing-assets/top_white_tshirt.jpg';

  const safeItem = item || {
    name: `Archived ${label} Piece`,
    color: 'Neutral',
    sub_category: label,
    image_url: fallbackAsset
  };

  const imageUrl = safeItem.image_url || fallbackAsset;

  return (
    <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-100 flex flex-col justify-between group hover:border-slate-300 transition">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${colorAccent}`}>
            {label}
          </span>
          <div className="flex items-center gap-1">
            <ColorSwatch color={safeItem.color || 'Neutral'} hex={safeItem.hex_color} size="sm" />
          </div>
        </div>

        {/* Product Image */}
        <div className="relative w-full aspect-square rounded-xl bg-white overflow-hidden border border-slate-100 mb-2 flex items-center justify-center p-2">
          {!loaded && !error && (
            <div className="absolute inset-0 bg-slate-50 animate-pulse flex items-center justify-center">
              <Shirt className="w-5 h-5 text-slate-300" />
            </div>
          )}
          {!error ? (
            <img
              src={imageUrl}
              alt={safeItem.name || label}
              onLoad={() => setLoaded(true)}
              onError={() => {
                setError(true);
                setLoaded(true);
              }}
              className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300">
              <Shirt className="w-6 h-6" />
            </div>
          )}
        </div>

        <p className="text-xs font-semibold text-slate-800 line-clamp-1" title={safeItem.name}>
          {safeItem.name || `${label} Piece`}
        </p>
      </div>

      <div className="mt-1 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate">{safeItem.sub_category || label}</span>
        <span className="capitalize text-[10px] text-slate-400">{safeItem.color || 'Classic'}</span>
      </div>
    </div>
  );
}

function MetricItem({ label, val }) {
  const safeVal = typeof val === 'number' ? Math.round(val) : 85;
  const colorClass = safeVal >= 90 ? 'bg-emerald-500' : safeVal >= 80 ? 'bg-amber-500' : 'bg-slate-400';
  return (
    <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-slate-600 font-medium truncate">{label}</span>
        <span className="font-bold text-slate-800 ml-1">{safeVal}%</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${safeVal}%` }} />
      </div>
    </div>
  );
}

export default function OutfitCard({ outfit, isSaved = false, onSave, onDeleteSaved, onGenerateAlternative }) {
  if (!outfit) return null;
  const { top, bottom, shoes, accessory, explanation, weather, occasion, harmony_badge } = outfit;
  const [showBreakdown, setShowBreakdown] = useState(false);
  const breakdown = outfit.score_breakdown || outfit.breakdown || null;

  const weatherIcons = {
    Hot: Sun,
    Cold: Snowflake,
    Rainy: CloudRain,
    Mild: Sun,
    Cool: Snowflake,
    'All Weather': Sparkles
  };
  const WeatherIcon = weatherIcons[weather] || Sun;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-200/90 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Qualitative Style Tag & Context Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {harmony_badge || 'Stylistically Harmonious'}
            </span>
            {outfit.score && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {outfit.score}% Match
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              <WeatherIcon className="w-3 h-3 text-slate-500" />
              {weather}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {occasion}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {breakdown && (
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  showBreakdown
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Toggle detailed compatibility metrics breakdown"
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Score Analysis</span>
                {showBreakdown ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
              </button>
            )}

            {onGenerateAlternative && (
              <button
                type="button"
                onClick={() => onGenerateAlternative(outfit.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition shadow-2xs cursor-pointer"
                title="Curate an alternative outfit combination"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                <span>Find Alternative</span>
              </button>
            )}

            {onSave && (
              <button
                onClick={() => onSave(outfit)}
                disabled={isSaved}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved to Collection</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Outfit</span>
                  </>
                )}
              </button>
            )}

            {onDeleteSaved && (
              <button
                onClick={() => onDeleteSaved(outfit.id)}
                className="text-xs font-medium text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Outfit Garment Products Grid with Actual Visual Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-5">
          {/* Top */}
          <GarmentImageSlot
            label="Top"
            item={top}
            colorAccent="text-indigo-600"
          />

          {/* Bottom */}
          <GarmentImageSlot
            label="Bottom"
            item={bottom}
            colorAccent="text-sky-600"
          />

          {/* Shoes */}
          <GarmentImageSlot
            label="Shoes"
            item={shoes}
            colorAccent="text-amber-600"
          />

          {/* Optional Accessory */}
          {accessory ? (
            <GarmentImageSlot
              label="Accessory"
              item={accessory}
              colorAccent="text-emerald-600"
            />
          ) : (
            <div className="hidden md:flex p-4 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200 flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-400 font-medium">Clean Silhouette</span>
              <span className="text-[11px] text-slate-300 mt-1">No accessory required for this look</span>
            </div>
          )}
        </div>

        {/* Explainability Rationale */}
        <div className="bg-gradient-to-r from-slate-50 to-amber-50/30 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="w-full">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Stylist Rationale
              </h5>
              <p className="text-xs leading-relaxed text-slate-600">
                {explanation}
              </p>
              {outfit.highlights && outfit.highlights.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {outfit.highlights.map((hl, idx) => (
                    <span key={idx} className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-amber-200/70 text-slate-700 shadow-2xs">
                      {hl}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Score Breakdown Drawer */}
        {showBreakdown && breakdown && (
          <div className="mt-4 p-4 bg-slate-50/90 rounded-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h6 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Multi-Factor Compatibility Breakdown
                </h6>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Overall Match: <strong className="text-amber-800">{outfit.score || 88}%</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <MetricItem label="Color Harmony" val={breakdown.colorHarmony} />
              <MetricItem label="Weather Suitability" val={breakdown.weatherSuitability} />
              <MetricItem label="Occasion Formality" val={breakdown.occasionSuitability} />
              <MetricItem label="Silhouette & Fit" val={breakdown.fitSilhouette} />
              <MetricItem label="Style Aesthetic" val={breakdown.personalStyle} />
              <MetricItem label="Seasonal Weight" val={breakdown.seasonSuitability} />
              <MetricItem label="Fabric & Materials" val={breakdown.fabricMaterial} />
              <MetricItem label="Color Preferences" val={breakdown.colorPreferences} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
