import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RotateCcw, 
  Trash2, 
  Shirt, 
  ArrowUpDown,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import ItemCard from '../components/ItemCard.jsx';
import MissingItemsAlert from '../components/MissingItemsAlert.jsx';
import ColorSwatch, { FASHION_PALETTE } from '../components/ColorSwatch.jsx';

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
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedWeather, setSelectedWeather] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recently_added');

  const categories = ['All', 'Top', 'Bottom', 'Shoes', 'Accessories'];
  const weatherFilters = [
    { id: 'All', label: 'All Weather' },
    { id: 'Hot', label: '☀️ Hot' },
    { id: 'Mild', label: '⛅ Mild' },
    { id: 'Cold', label: '❄️ Cold' },
    { id: 'Rainy', label: '🌧️ Rainy' }
  ];

  const seasonFilters = ['All', 'Summer', 'Winter', 'Spring', 'Autumn', 'All Seasons'];
  const occasionFilters = ['All', 'Casual', 'Smart Casual', 'Work / Formal', 'Party', 'Sports / Active', 'Traditional'];

  // Available sub-categories derived from current items or selected category
  const availableSubCategories = useMemo(() => {
    const pool = selectedCategory === 'All' 
      ? items 
      : items.filter(i => i.category === selectedCategory);
    const set = new Set(pool.map(i => i.sub_category).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [items, selectedCategory]);

  // Client-side filtering and sorting for instant responsiveness
  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Sub-category filter
      if (selectedSubCategory !== 'All' && item.sub_category !== selectedSubCategory) {
        return false;
      }
      // Color filter (primary or secondary)
      if (selectedColor !== 'All') {
        const itemCol = (item.color || '').toLowerCase();
        const itemSecCol = (item.secondary_color || '').toLowerCase();
        const target = selectedColor.toLowerCase();
        if (itemCol !== target && itemSecCol !== target) {
          return false;
        }
      }
      // Weather filter
      if (selectedWeather !== 'All') {
        const itemW = (item.weather_suitability || '').toLowerCase();
        const selW = selectedWeather.toLowerCase();
        if (itemW !== 'all weather' && itemW !== 'all' && itemW !== '') {
          if (selW === 'hot') {
            if (!itemW.includes('hot') && !itemW.includes('warm') && !itemW.includes('summer')) return false;
          } else if (selW === 'cold') {
            if (!itemW.includes('cold') && !itemW.includes('winter') && !itemW.includes('chilly')) return false;
          } else if (selW === 'rainy') {
            if (!itemW.includes('rain') && !itemW.includes('waterproof') && !itemW.includes('water-resistant')) return false;
          } else if (selW === 'mild') {
            if (itemW.includes('extreme') || (itemW.includes('cold') && !itemW.includes('mild'))) return false;
          } else if (!itemW.includes(selW)) {
            return false;
          }
        }
      }
      // Season filter
      if (selectedSeason !== 'All' && item.season !== selectedSeason && item.season !== 'All Seasons') {
        return false;
      }
      // Occasion filter
      if (selectedOccasion !== 'All') {
        const itemOcc = (item.occasion || '').toLowerCase();
        const selOcc = selectedOccasion.toLowerCase();
        if (itemOcc !== 'all occasions' && itemOcc !== 'all') {
          if (selOcc === 'work / formal') {
            if (!itemOcc.includes('work') && !itemOcc.includes('formal') && !itemOcc.includes('business')) return false;
          } else if (selOcc === 'sports / active') {
            if (!itemOcc.includes('sport') && !itemOcc.includes('active')) return false;
          } else if (selOcc === 'traditional') {
            if (!itemOcc.includes('traditional') && !itemOcc.includes('ethnic')) return false;
          } else if (selOcc === 'smart casual') {
            if (!itemOcc.includes('smart') && !itemOcc.includes('casual')) return false;
          } else if (!itemOcc.includes(selOcc)) {
            return false;
          }
        }
      }
      // Search query across name, sub_category, color, fabric, and notes
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchColor = (item.color || '').toLowerCase().includes(query);
        const matchSecColor = (item.secondary_color || '').toLowerCase().includes(query);
        const matchSub = (item.sub_category || '').toLowerCase().includes(query);
        const matchFabric = (item.fabric || '').toLowerCase().includes(query);
        const matchNotes = (item.notes || '').toLowerCase().includes(query);
        if (!matchName && !matchColor && !matchSecColor && !matchSub && !matchFabric && !matchNotes) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    } else if (sortBy === 'name_desc') {
      result.sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' }));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else {
      // Default: recently added
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }, [items, selectedCategory, selectedSubCategory, selectedColor, selectedWeather, selectedSeason, selectedOccasion, searchQuery, sortBy]);

  const hasActiveFilters = selectedCategory !== 'All' || 
    selectedSubCategory !== 'All' || 
    selectedColor !== 'All' || 
    selectedWeather !== 'All' || 
    selectedSeason !== 'All' || 
    selectedOccasion !== 'All' || 
    searchQuery.trim().length > 0;

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedColor('All');
    setSelectedWeather('All');
    setSelectedSeason('All');
    setSelectedOccasion('All');
    setSearchQuery('');
    setSortBy('recently_added');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Digital Wardrobe
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize your personal clothing collection, colors, fabrics, and climate suitability
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onResetSample()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition shadow-xs cursor-pointer"
            title="Restore curated sample items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sample Closet</span>
          </button>

          {items.length > 0 && (
            <button
              onClick={() => onClearAll()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition shadow-xs cursor-pointer"
              title="Remove all clothing items"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={() => onOpenAddItem(selectedCategory !== 'All' ? selectedCategory : 'Top')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-md cursor-pointer"
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

      {/* Search, Filter Bar & Sort Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Row 1: Search Input & Category Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, color, fabric, sub-category (e.g. linen, navy, chinos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubCategory('All');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
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

        {/* Row 2: Secondary Dropdown Filters & Sorting */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-100">
          
          {/* Sub-Category Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sub-Category
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {availableSubCategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Color
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="All">All Colors</option>
              {FASHION_PALETTE.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Weather Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Weather
            </label>
            <select
              value={selectedWeather}
              onChange={(e) => setSelectedWeather(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {weatherFilters.map(w => (
                <option key={w.id} value={w.id}>{w.label}</option>
              ))}
            </select>
          </div>

          {/* Season Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Season
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {seasonFilters.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Occasion Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Occasion
            </label>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {occasionFilters.map(occ => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="recently_added">Recently Added</option>
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </div>

        {/* Active Filters Clear Button Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredItems.length}</span> of {items.length} garments
            </span>
            <button
              onClick={resetAllFilters}
              className="text-xs text-amber-700 hover:text-amber-900 font-semibold underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Shirt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 font-serif">No Clothing Items Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            {hasActiveFilters
              ? 'No items match your active search and filter combination. Try clearing your filters.'
              : 'Your digital closet is currently empty. Add your clothes to start generating outfits!'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => onOpenAddItem(selectedCategory !== 'All' ? selectedCategory : 'Top')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
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
