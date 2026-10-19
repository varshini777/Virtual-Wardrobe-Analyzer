import React from 'react';
import { 
  Shirt, 
  Sparkles, 
  Bookmark, 
  ArrowRight, 
  Plus, 
  Sun, 
  Snowflake, 
  CloudRain, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import MissingItemsAlert from '../components/MissingItemsAlert.jsx';
import OutfitCard from '../components/OutfitCard.jsx';
import ItemCard from '../components/ItemCard.jsx';

export default function DashboardPage({ 
  items = [], 
  wardrobeStatus, 
  savedOutfits = [], 
  onNavigate, 
  onOpenAddItem, 
  onQuickGenerate,
  onEditItem,
  onDeleteItem
}) {
  const tops = items.filter(i => i.category === 'Top');
  const bottoms = items.filter(i => i.category === 'Bottom');
  const shoes = items.filter(i => i.category === 'Shoes');
  const accessories = items.filter(i => i.category === 'Accessories');

  const stats = [
    { label: 'Tops', count: tops.length, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', cat: 'Top' },
    { label: 'Bottoms', count: bottoms.length, color: 'text-sky-600 bg-sky-50 border-sky-100', cat: 'Bottom' },
    { label: 'Shoes', count: shoes.length, color: 'text-amber-600 bg-amber-50 border-amber-100', cat: 'Shoes' },
    { label: 'Accessories', count: accessories.length, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', cat: 'Accessories' },
    { label: 'Saved Outfits', count: savedOutfits.length, color: 'text-purple-600 bg-purple-50 border-purple-100', cat: null }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 text-white p-8 md:p-12 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-md mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rule-Based Style Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Dress with confidence, every single day.
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Curate intelligent outfit combinations tailored to your weather, daily occasion, and color theory using garments already in your closet.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('recommendations')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 text-xs md:text-sm font-bold hover:bg-slate-100 transition shadow-lg group"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Generate Outfits</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onOpenAddItem()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-semibold border border-white/20 backdrop-blur-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Clothing Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Incomplete Wardrobe Warning if any essential categories are missing */}
      {wardrobeStatus && !wardrobeStatus.canGenerate && (
        <MissingItemsAlert
          missingCategories={wardrobeStatus.missingCategories}
          onAddItem={onOpenAddItem}
        />
      )}

      {/* Wardrobe Overview Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Wardrobe Breakdown</h2>
          <button
            onClick={() => onNavigate('wardrobe')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <span>View All ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              onClick={() => {
                if (s.cat) onNavigate('wardrobe', { category: s.cat });
                else onNavigate('saved');
              }}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                <span className={`w-2 h-2 rounded-full ${s.cat ? 'bg-slate-400' : 'bg-purple-500'}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:scale-105 transition-transform origin-left">
                {s.count}
              </p>
              <span className="text-[11px] text-slate-400 block mt-1">
                {s.cat ? `Managed items` : `Curated pairings`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Recommendations Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Quick Outfit Generator</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your immediate weather and destination to generate instant combinations
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Explainable Color & Climate Matching</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onQuickGenerate('Hot', 'Casual')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition text-left group"
          >
            <div className="flex items-center gap-2 text-amber-600 mb-2 font-bold text-xs">
              <Sun className="w-4 h-4" />
              <span>Hot & Sunny • Casual</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Breathable & Relaxed</p>
            <p className="text-[11px] text-slate-500 mt-1">Lightweight linen, tees, shorts, breathable sneakers</p>
          </button>

          <button
            onClick={() => onQuickGenerate('Hot', 'Work')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 transition text-left group"
          >
            <div className="flex items-center gap-2 text-sky-600 mb-2 font-bold text-xs">
              <Sun className="w-4 h-4" />
              <span>Warm Day • Work</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Smart Casual Office</p>
            <p className="text-[11px] text-slate-500 mt-1">Crisp button-downs, chinos, loafers, minimal accessories</p>
          </button>

          <button
            onClick={() => onQuickGenerate('Cold', 'Casual')}
            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition text-left group"
          >
            <div className="flex items-center gap-2 text-blue-600 mb-2 font-bold text-xs">
              <Snowflake className="w-4 h-4" />
              <span>Cold Weather • Casual</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Cozy Layering</p>
            <p className="text-[11px] text-slate-500 mt-1">Sweaters, denim, rugged boots, warm scarves</p>
          </button>
        </div>
      </div>

      {/* Recent Wardrobe Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recently Added Garments</h2>
          <button
            onClick={() => onNavigate('wardrobe')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <span>Explore Digital Closet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
            <Shirt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Your Wardrobe is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Add your clothing items or load sample starter items to begin generating outfit recommendations.
            </p>
            <button
              onClick={() => onOpenAddItem()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Item</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.slice(0, 4).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Saved Outfits if available */}
      {savedOutfits.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Saved Outfits</h2>
            <button
              onClick={() => onNavigate('saved')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>View All Saved ({savedOutfits.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {savedOutfits.slice(0, 2).map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                isSaved={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
