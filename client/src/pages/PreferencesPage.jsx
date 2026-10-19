import React, { useState, useEffect } from 'react';
import { Sliders, Check, Heart, Ban, Sparkles, Save } from 'lucide-react';
import { POPULAR_COLORS } from '../components/ColorSwatch.jsx';

const STYLE_OPTIONS = [
  { id: 'Casual', label: 'Casual', desc: 'Comfortable, relaxed, everyday pieces' },
  { id: 'Smart Casual', label: 'Smart Casual', desc: 'Polished balance of formal and casual' },
  { id: 'Formal', label: 'Formal', desc: 'Sharp tailoring, structured and elegant' },
  { id: 'Minimalist', label: 'Minimalist', desc: 'Neutral tones, clean cuts, versatile basics' },
  { id: 'Streetwear', label: 'Streetwear', desc: 'Urban staples, expressive and modern' }
];

export default function PreferencesPage({
  preferences,
  onSavePreferences,
  saving = false
}) {
  const [favoriteColors, setFavoriteColors] = useState([]);
  const [dislikedColors, setDislikedColors] = useState([]);
  const [preferredStyles, setPreferredStyles] = useState([]);
  const [defaultWeather, setDefaultWeather] = useState('Hot');
  const [defaultOccasion, setDefaultOccasion] = useState('Casual');
  const [customFavInput, setCustomFavInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFavoriteColors(preferences.favorite_colors || []);
      setDislikedColors(preferences.disliked_colors || []);
      setPreferredStyles(preferences.preferred_styles || []);
      setDefaultWeather(preferences.default_weather || 'Hot');
      setDefaultOccasion(preferences.default_occasion || 'Casual');
    }
  }, [preferences]);

  const toggleFavoriteColor = (colorName) => {
    if (favoriteColors.includes(colorName)) {
      setFavoriteColors(favoriteColors.filter(c => c !== colorName));
    } else {
      setFavoriteColors([...favoriteColors, colorName]);
      // Remove from disliked if present
      setDislikedColors(dislikedColors.filter(c => c !== colorName));
    }
  };

  const toggleDislikedColor = (colorName) => {
    if (dislikedColors.includes(colorName)) {
      setDislikedColors(dislikedColors.filter(c => c !== colorName));
    } else {
      setDislikedColors([...dislikedColors, colorName]);
      // Remove from favorites if present
      setFavoriteColors(favoriteColors.filter(c => c !== colorName));
    }
  };

  const toggleStyle = (styleId) => {
    if (preferredStyles.includes(styleId)) {
      setPreferredStyles(preferredStyles.filter(s => s !== styleId));
    } else {
      setPreferredStyles([...preferredStyles, styleId]);
    }
  };

  const handleAddCustomFavorite = (e) => {
    e.preventDefault();
    if (!customFavInput.trim()) return;
    const clean = customFavInput.trim();
    if (!favoriteColors.includes(clean)) {
      setFavoriteColors([...favoriteColors, clean]);
    }
    setCustomFavInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSavePreferences({
      favorite_colors: favoriteColors,
      disliked_colors: dislikedColors,
      preferred_styles: preferredStyles,
      default_weather: defaultWeather,
      default_occasion: defaultOccasion
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Style & Color Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your styling profile to prioritize favorite colors, avoid disliked hues, and bias recommendations toward your aesthetic.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Favorite Colors Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900">Favorite Colors</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Items featuring these colors receive an elevated compatibility score in recommendations (+15 pts).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_COLORS.map((c) => {
              const isSelected = favoriteColors.includes(c.name);
              return (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => toggleFavoriteColor(c.name)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    isSelected
                      ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${c.border ? 'border border-slate-300' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {/* Custom color adder */}
          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add other favorite color..."
              value={customFavInput}
              onChange={(e) => setCustomFavInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="button"
              onClick={handleAddCustomFavorite}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Disliked Colors Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <Ban className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Disliked Colors</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Combinations with these colors will be penalized or deprioritized in recommendations.
          </p>

          <div className="flex flex-wrap gap-2">
            {POPULAR_COLORS.map((c) => {
              const isDisliked = dislikedColors.includes(c.name);
              return (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => toggleDislikedColor(c.name)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    isDisliked
                      ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${c.border ? 'border border-slate-300' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  {isDisliked && <Check className="w-3 h-3 text-amber-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Aesthetics Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Preferred Style Aesthetics</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Select the style paradigms that match your daily aesthetic.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = preferredStyles.includes(style.id);
              return (
                <div
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{style.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  </div>
                  <p className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {style.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Default Context Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <Sliders className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">Default Context Filters</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Initial defaults selected when opening the Outfit Recommendation Engine.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Weather
              </label>
              <select
                value={defaultWeather}
                onChange={(e) => setDefaultWeather(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Hot">☀️ Hot</option>
                <option value="Cold">❄️ Cold</option>
                <option value="Rainy">🌧️ Rainy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Occasion
              </label>
              <select
                value={defaultOccasion}
                onChange={(e) => setDefaultOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Casual">Casual</option>
                <option value="Work">Work / Smart Casual</option>
                <option value="Formal">Formal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
