import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  CloudSun,
  Snowflake, 
  CloudRain, 
  Briefcase, 
  Shirt, 
  PartyPopper,
  Dumbbell,
  Crown,
  RefreshCw,
  Palette,
  Sliders,
  Check
} from 'lucide-react';
import OutfitCard from '../components/OutfitCard.jsx';
import MissingItemsAlert from '../components/MissingItemsAlert.jsx';
import { POPULAR_COLORS } from '../components/ColorSwatch.jsx';

export default function RecommendationsPage({
  recommendations = [],
  loading = false,
  error = '',
  weather = 'Mild',
  occasion = 'Casual',
  wardrobeStatus,
  preferences,
  savedOutfitIds = new Set(),
  onGenerate,
  onGenerateAlternative,
  onSaveOutfit,
  onOpenAddItem
}) {
  const [selectedWeather, setSelectedWeather] = useState(weather || 'Mild');
  const [selectedOccasion, setSelectedOccasion] = useState(occasion || 'Casual');
  const [selectedColor, setSelectedColor] = useState('No Preference');
  const [selectedStyle, setSelectedStyle] = useState('No Preference');

  // 4 Standard Weather Options
  const weatherOptions = [
    { value: 'Hot', icon: Sun, label: 'Hot', desc: 'Breathable, lightweight fabrics' },
    { value: 'Mild', icon: CloudSun, label: 'Mild', desc: 'Balanced transitional layers' },
    { value: 'Cold', icon: Snowflake, label: 'Cold', desc: 'Warm knits & outerwear' },
    { value: 'Rainy', icon: CloudRain, label: 'Rainy', desc: 'Water-resistant footwear & wet gear' }
  ];

  // 6 Standard Occasion Options
  const occasionOptions = [
    { value: 'Casual', icon: Shirt, label: 'Casual', desc: 'Everyday relaxed outings & weekends' },
    { value: 'Smart Casual', icon: Sparkles, label: 'Smart Casual', desc: 'Polished dinners & social outings' },
    { value: 'Work / Formal', icon: Briefcase, label: 'Work / Formal', desc: 'Office tailoring, suits & formal events' },
    { value: 'Party', icon: PartyPopper, label: 'Party', desc: 'Chic nightlife & celebratory evenings' },
    { value: 'Sports / Active', icon: Dumbbell, label: 'Sports / Active', desc: 'Athletic mobility & functional activewear' },
    { value: 'Traditional', icon: Crown, label: 'Traditional', desc: 'Cultural kurtas & festive elegance' }
  ];

  // Curated Style Archetypes
  const styleOptions = [
    'No Preference',
    'Minimalist',
    'Classic',
    'Smart Casual',
    'Streetwear',
    'Old Money'
  ];

  const handleGenerateClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    onGenerate({
      weather: selectedWeather,
      occasion: selectedOccasion,
      preferredColor: selectedColor !== 'No Preference' ? selectedColor : null,
      preferredStyle: selectedStyle !== 'No Preference' ? selectedStyle : null,
      maxRecommendations: 5
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Personal Styling & Outfit Generator
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Select your weather, occasion, and optional style preferences to curate coordinated outfits from your digital closet.
        </p>
      </div>

      {/* Wardrobe Incomplete Warning */}
      {wardrobeStatus && !wardrobeStatus.canGenerate && (
        <MissingItemsAlert
          missingCategories={wardrobeStatus.missingCategories}
          onAddItem={onOpenAddItem}
        />
      )}

      {/* Interactive Selection Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleGenerateClick} className="space-y-6">
          {/* STEP 1: Weather Selection (4 Standard Options) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              1. Weather Climate
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {weatherOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedWeather === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setSelectedWeather(opt.value)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                        : 'bg-slate-50/60 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-300' : 'text-slate-600'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className={`text-[11px] block mt-0.5 leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Occasion Selection (6 Standard Options) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              2. Occasion
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {occasionOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedOccasion === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setSelectedOccasion(opt.value)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                        : 'bg-slate-50/60 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-600'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className={`text-[10px] block mt-0.5 leading-snug line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Optional Styling Preferences (Color & Style) */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Preferred Color */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Preferred Color (Optional)
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="No Preference">No Preference (Balanced Palette)</option>
                {POPULAR_COLORS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Style */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Preferred Style (Optional)
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                {styleOptions.map((st) => (
                  <option key={st} value={st}>
                    {st === 'No Preference' ? 'No Preference (Catalog Standard)' : st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading || (wardrobeStatus && !wardrobeStatus.canGenerate)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
              <span>{loading ? 'Curating Outfits...' : 'Generate Outfits'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
          {error}
        </div>
      )}

      {/* Recommendations Results Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Curated Outfit Combinations
            </h2>
            <p className="text-xs text-slate-500">
              Coordinated outfits tailored for {selectedWeather} weather and {selectedOccasion} occasion
            </p>
          </div>
          {recommendations.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
              {recommendations.length} Recommendations
            </span>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800 font-serif">Synthesizing Wardrobe Outfits...</p>
            <p className="text-xs text-slate-400 mt-1">Cross-referencing color harmony, weather layers, and occasion dress codes</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 font-serif">No Outfits Generated Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              Select your weather and occasion above and click <strong>"Generate Outfits"</strong> to see coordinated pairings from your closet.
            </p>
            <button
              onClick={handleGenerateClick}
              disabled={wardrobeStatus && !wardrobeStatus.canGenerate}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                isSaved={savedOutfitIds.has(outfit.id)}
                onSave={onSaveOutfit}
                onGenerateAlternative={onGenerateAlternative ? () => onGenerateAlternative(outfit.id, {
                  weather: selectedWeather,
                  occasion: selectedOccasion,
                  preferredColor: selectedColor !== 'No Preference' ? selectedColor : null,
                  preferredStyle: selectedStyle !== 'No Preference' ? selectedStyle : null
                }) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
