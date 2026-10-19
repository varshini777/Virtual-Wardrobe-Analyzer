import React from 'react';
import { Bookmark, BookmarkCheck, Sparkles, Sun, Snowflake, CloudRain, Check } from 'lucide-react';
import ColorSwatch from './ColorSwatch.jsx';

export default function OutfitCard({ outfit, isSaved = false, onSave, onDeleteSaved }) {
  const { top, bottom, shoes, accessory, score, explanation, weather, occasion, highlights = [] } = outfit;

  const weatherIcons = {
    Hot: Sun,
    Cold: Snowflake,
    Rainy: CloudRain
  };
  const WeatherIcon = weatherIcons[weather] || Sun;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-200/90 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Match score and context */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {score}% Match
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              <WeatherIcon className="w-3 h-3 text-slate-500" />
              {weather}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {occasion}
            </span>
          </div>

          {onSave && (
            <button
              onClick={() => onSave(outfit)}
              disabled={isSaved}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved</span>
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
              className="text-xs font-medium text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition"
            >
              Remove
            </button>
          )}
        </div>

        {/* Outfit Combination Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-5">
          {/* Top */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                Top
              </span>
              <p className="text-xs font-semibold text-slate-800 line-clamp-2" title={top.name}>
                {top.name}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-200/60">
              <ColorSwatch color={top.color} hex={top.hex_color} size="sm" />
              <span className="text-[11px] text-slate-500 truncate">{top.color} {top.sub_category}</span>
            </div>
          </div>

          {/* Bottom */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                Bottom
              </span>
              <p className="text-xs font-semibold text-slate-800 line-clamp-2" title={bottom.name}>
                {bottom.name}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-200/60">
              <ColorSwatch color={bottom.color} hex={bottom.hex_color} size="sm" />
              <span className="text-[11px] text-slate-500 truncate">{bottom.color} {bottom.sub_category}</span>
            </div>
          </div>

          {/* Shoes */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Shoes
              </span>
              <p className="text-xs font-semibold text-slate-800 line-clamp-2" title={shoes.name}>
                {shoes.name}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-200/60">
              <ColorSwatch color={shoes.color} hex={shoes.hex_color} size="sm" />
              <span className="text-[11px] text-slate-500 truncate">{shoes.color} {shoes.sub_category}</span>
            </div>
          </div>

          {/* Optional Accessory */}
          {accessory ? (
            <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                  Accessory
                </span>
                <p className="text-xs font-semibold text-slate-800 line-clamp-2" title={accessory.name}>
                  {accessory.name}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-emerald-200/60">
                <ColorSwatch color={accessory.color} hex={accessory.hex_color} size="sm" />
                <span className="text-[11px] text-slate-500 truncate">{accessory.color} {accessory.sub_category}</span>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex p-3 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200 flex-col items-center justify-center text-center">
              <span className="text-[11px] text-slate-400 font-medium">No accessory needed</span>
              <span className="text-[10px] text-slate-300 mt-0.5">Clean minimalist look</span>
            </div>
          )}
        </div>

        {/* Explainability Callout */}
        <div className="bg-gradient-to-r from-slate-50 to-amber-50/30 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Why this combination works
              </h5>
              <p className="text-xs leading-relaxed text-slate-600">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
