import React, { useState } from 'react';
import { Edit2, Trash2, Sun, CloudRain, Snowflake, Sparkles, Shirt, ImageOff } from 'lucide-react';
import ColorSwatch from './ColorSwatch.jsx';

export default function ItemCard({ item, onEdit, onDelete }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categoryColors = {
    Top: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Bottom: 'bg-sky-50 text-sky-700 border-sky-200',
    Shoes: 'bg-amber-50 text-amber-700 border-amber-200',
    Accessories: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const weatherIcons = {
    Hot: { icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    Cold: { icon: Snowflake, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    Rainy: { icon: CloudRain, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    'All Weather': { icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' }
  };

  const weatherConfig = weatherIcons[item.weather_suitability] || weatherIcons['All Weather'];
  const WeatherIcon = weatherConfig.icon;

  const displayImage = item.image_url || '/clothing-assets/top_white_tshirt.jpg';

  return (
    <div className="group relative bg-white rounded-3xl p-4 shadow-sm hover:shadow-lg border border-slate-200/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Prominent Fashion Catalog Product Image */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-3.5 border border-slate-100 flex items-center justify-center">
          {/* Skeleton placeholder while loading */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
              <Shirt className="w-8 h-8 text-slate-300 animate-bounce" />
            </div>
          )}

          {!imageError ? (
            <img
              src={displayImage}
              alt={item.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              className={`w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <Shirt className="w-8 h-8 text-slate-300 mb-1" />
              <span className="text-[10px] font-medium text-slate-400">{item.sub_category}</span>
            </div>
          )}

          {/* Weather Tag pill floating over top-right */}
          <div className="absolute top-2.5 right-2.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${weatherConfig.color}`}>
              <WeatherIcon className="w-3 h-3" />
              {item.weather_suitability}
            </span>
          </div>

          {/* Category Pill floating over top-left */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${categoryColors[item.category] || 'bg-slate-100 text-slate-700'}`}>
              {item.category}
            </span>
          </div>
        </div>

        {/* Concept ID badge if present */}
        {item.concept_id && (
          <div className="mb-1">
            <span className="text-[9px] font-mono font-semibold tracking-wider uppercase text-amber-800 bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/60 inline-block">
              {item.concept_id}
            </span>
          </div>
        )}

        {/* Item Information */}
        <h3 className="font-serif font-bold text-slate-900 text-[15px] leading-snug line-clamp-1 tracking-tight" title={item.name}>
          {item.name}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{item.sub_category}</span>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ColorSwatch color={item.color} hex={item.hex_color} size="sm" />
            <span className="capitalize">{item.color}</span>
          </div>
        </div>

        {/* Silhouette & Cut Highlight */}
        {item.silhouette && (
          <p className="text-[11px] text-slate-600 font-normal mt-1.5 line-clamp-1">
            <span className="text-slate-400 font-medium">Cut:</span> {item.silhouette}
          </p>
        )}

        {/* Occasion, Fabric, Season, & Notes */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            {item.occasion}
          </span>
          {item.fabric && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200/60">
              {item.fabric}
            </span>
          )}
          {item.season && item.season !== 'All Seasons' && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
              {item.season}
            </span>
          )}
          {item.notes && !item.silhouette && (
            <span className="text-[11px] text-slate-400 italic line-clamp-1 w-full mt-1" title={item.notes}>
              "{item.notes}"
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          title="Edit item"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
          title="Delete item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
