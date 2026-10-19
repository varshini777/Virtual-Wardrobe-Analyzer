import React from 'react';
import { Edit2, Trash2, Sun, CloudRain, Snowflake, Sparkles, Shirt } from 'lucide-react';
import ColorSwatch from './ColorSwatch.jsx';

export default function ItemCard({ item, onEdit, onDelete }) {
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

  return (
    <div className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-200/80 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top bar: Category & Weather badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[item.category] || 'bg-slate-100 text-slate-700'}`}>
            {item.category}
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${weatherConfig.color}`}>
            <WeatherIcon className="w-3 h-3" />
            {item.weather_suitability}
          </span>
        </div>

        {/* Optional Image or Stylized Placeholder */}
        {item.image_url ? (
          <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-full h-24 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/80 mb-3 flex items-center justify-center border border-slate-100 text-slate-300">
            <Shirt className="w-8 h-8 opacity-40 group-hover:scale-110 transition-transform" />
          </div>
        )}

        {/* Item Info */}
        <h3 className="font-semibold text-slate-800 text-base leading-snug line-clamp-1" title={item.name}>
          {item.name}
        </h3>

        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-600">{item.sub_category}</span>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ColorSwatch color={item.color} hex={item.hex_color} size="sm" />
            <span>{item.color}</span>
          </div>
        </div>

        {/* Occasion & notes */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            {item.occasion}
          </span>
          {item.notes && (
            <span className="text-[11px] text-slate-400 italic line-clamp-1" title={item.notes}>
              "{item.notes}"
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Edit item"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
