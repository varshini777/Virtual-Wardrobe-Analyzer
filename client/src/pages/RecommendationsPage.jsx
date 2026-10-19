import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Snowflake, 
  CloudRain, 
  Briefcase, 
  Coffee, 
  Award, 
  ArrowRight, 
  Sliders, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import OutfitCard from '../components/OutfitCard.jsx';
import MissingItemsAlert from '../components/MissingItemsAlert.jsx';

export default function RecommendationsPage({
  recommendations = [],
  loading = false,
  error = '',
  weather = 'Hot',
  occasion = 'Casual',
  wardrobeStatus,
  preferences,
  savedOutfitIds = new Set(),
  onGenerate,
  onSaveOutfit,
  onOpenAddItem,
  onNavigatePreferences
}) {
  const [selectedWeather, setSelectedWeather] = useState(weather);
  const [selectedOccasion, setSelectedOccasion] = useState(occasion);

  const weatherOptions = [
    { value: 'Hot', label: '☀️ Hot & Sunny', desc: 'Summer, high temperatures, breathable' },
    { value: 'Cold', label: '❄️ Cold & Chilly', desc: 'Winter, layers, warm knitwear' },
    { value: 'Rainy', label: '🌧️ Wet & Rainy', desc: 'Precipitation, water-resistant footwear' }
  ];

  const occasionOptions = [
    { value: 'Casual', label: '👕 Casual Everyday', desc: 'Weekend, relaxed outing, coffee runs' },
    { value: 'Work', label: '💼 Smart Casual / Work', desc: 'Office, business casual, meetings' },
    { value: 'Formal', label: '👔 Formal Event', desc: 'Suited, elegant dinner, celebration' }
  ];

  const handleGenerateClick = (e) => {
    e.preventDefault();
    onGenerate(selectedWeather, selectedOccasion);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Outfit Recommendation Engine
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Rule-based combination generator matching weather suitability, occasion formality, and color coordination.
        </p>
      </div>

      {/* Wardrobe Incomplete Warning */}
      {wardrobeStatus && !wardrobeStatus.canGenerate && (
        <MissingItemsAlert
          missingCategories={wardrobeStatus.missingCategories}
          onAddItem={onOpenAddItem}
        />
      )}

      {/* Interactive Context Filter Controls */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <form onSubmit={handleGenerateClick} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span>Select Weather Context</span>
                <span className="text-slate-400 font-normal lowercase">Section 2 & 3</span>
              </label>
              <div className="relative">
                <select
                  value={selectedWeather}
                  onChange={(e) => setSelectedWeather(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                >
                  {weatherOptions.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label} — {w.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Occasion Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span>Select Occasion / Style</span>
                <span className="text-slate-400 font-normal lowercase">Formality Rule</span>
              </label>
              <div className="relative">
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                >
                  {occasionOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label} — {o.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active User Preferences Snippet */}
          {preferences && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-700">Active Preference Scoring:</span>
                {preferences.favorite_colors?.length > 0 && (
                  <span className="text-slate-600">
                    Favorites: <strong>{preferences.favorite_colors.join(', ')}</strong>
                  </span>
                )}
                {preferences.preferred_styles?.length > 0 && (
                  <span className="text-slate-600">
                    • Style: <strong>{preferences.preferred_styles.join(', ')}</strong>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onNavigatePreferences}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Preferences</span>
              </button>
            </div>
          )}

          {/* Generate Button */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading || (wardrobeStatus && !wardrobeStatus.canGenerate)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
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
            <h2 className="text-lg font-bold text-slate-900">
              Curated Outfit Combinations
            </h2>
            <p className="text-xs text-slate-500">
              Sorted by stylistic harmony, occasion elegance, and climatic suitability
            </p>
          </div>
          {recommendations.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
              {recommendations.length} Suggestions
            </span>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">Analyzing Wardrobe Combinations...</p>
            <p className="text-xs text-slate-400 mt-1">Cross-referencing color palettes, weather tags, and occasion rules</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Outfits Generated Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              Select your desired weather and occasion above and click <strong>"Generate Outfits"</strong> to see AI-free, rule-based fashion pairings from your closet.
            </p>
            <button
              onClick={handleGenerateClick}
              disabled={wardrobeStatus && !wardrobeStatus.canGenerate}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
