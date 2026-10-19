import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RotateCcw, 
  Trash2, 
  Shirt, 
  Sun, 
  Snowflake, 
  CloudRain, 
  Sparkles,
  Layers
} from 'lucide-react';
import ItemCard from '../components/ItemCard.jsx';
import MissingItemsAlert from '../components/MissingItemsAlert.jsx';

export default function WardrobePage({
  items = [],
  wardrobeStatus,
  onOpenAddItem,
  onEditItem,
  onDeleteItem,
  onResetSample,
  onClearAll,
  initialCategory = 'All'
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedWeather, setSelectedWeather] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Top', 'Bottom', 'Shoes', 'Accessories'];
  const weatherFilters = [
    { id: 'All', label: 'All Weather' },
    { id: 'Hot', label: '☀️ Hot' },
    { id: 'Cold', label: '❄️ Cold' },
    { id: 'Rainy', label: '🌧️ Rainy' },
    { id: 'All Weather', label: '🌤️ Universal' }
  ];

  // Client-side filtering for fast responsive UI
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Weather filter
      if (selectedWeather !== 'All' && item.weather_suitability !== selectedWeather && item.weather_suitability !== 'All Weather') {
        return false;
      }
      // Occasion filter
      if (selectedOccasion !== 'All' && item.occasion !== selectedOccasion && item.occasion !== 'All Occasions') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchColor = item.color.toLowerCase().includes(query);
        const matchSub = (item.sub_category || '').toLowerCase().includes(query);
        const matchNotes = (item.notes || '').toLowerCase().includes(query);
        if (!matchName && !matchColor && !matchSub && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedCategory, selectedWeather, selectedOccasion, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Digital Wardrobe
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal clothing collection, colors, and climate suitability
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onResetSample()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition shadow-sm"
            title="Restore curated sample items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sample Closet</span>
          </button>

          {items.length > 0 && (
            <button
              onClick={() => onClearAll()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition shadow-sm"
              title="Remove all clothing items"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={() => onOpenAddItem(selectedCategory !== 'All' ? selectedCategory : 'Top')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Clothing Item</span>
          </button>
        </div>
      </div>

      {/* Wardrobe Incomplete Warning */}
      {wardrobeStatus && !wardrobeStatus.canGenerate && (
        <MissingItemsAlert
          missingCategories={wardrobeStatus.missingCategories}
          onAddItem={onOpenAddItem}
        />
      )}

      {/* Search and Category Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
        {/* Search bar & quick category tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, color, sub-category (e.g. linen, navy, chinos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Climate & Occasion Secondary Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Weather:</span>
          {weatherFilters.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWeather(w.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedWeather === w.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {w.label}
            </button>
          ))}

          <span className="ml-3 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Occasion:</span>
          {['All', 'Casual', 'Work', 'Formal'].map((occ) => (
            <button
              key={occ}
              onClick={() => setSelectedOccasion(occ)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedOccasion === occ
                  ? 'bg-sky-100 text-sky-900 border border-sky-300 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {occ}
            </button>
          ))}

          {(selectedCategory !== 'All' || selectedWeather !== 'All' || selectedOccasion !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedWeather('All');
                setSelectedOccasion('All');
                setSearchQuery('');
              }}
              className="ml-auto text-xs text-slate-500 hover:text-slate-900 underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <Shirt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Clothing Items Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || selectedCategory !== 'All' || selectedWeather !== 'All' || selectedOccasion !== 'All'
              ? 'No items match your active filters. Try clearing your search or switching category.'
              : 'Your closet is currently empty. Add your clothes to start generating outfits!'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {(selectedCategory !== 'All' || selectedWeather !== 'All' || selectedOccasion !== 'All' || searchQuery) ? (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedWeather('All');
                  setSelectedOccasion('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
              >
                Clear Filters
              </button>
            ) : null}
            <button
              onClick={() => onOpenAddItem(selectedCategory !== 'All' ? selectedCategory : 'Top')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Clothing Item</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
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
  );
}
