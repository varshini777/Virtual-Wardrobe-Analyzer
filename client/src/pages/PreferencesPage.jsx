import React, { useState, useEffect } from 'react';
import { Check, Heart, Ban, Sparkles, Save } from 'lucide-react';
import { POPULAR_COLORS } from '../components/ColorSwatch.jsx';

const STYLE_OPTIONS = [
  { id: 'Minimalist', label: 'Minimalist', desc: 'Neutral tones, clean cuts, versatile basics' },
  { id: 'Smart Casual', label: 'Smart Casual', desc: 'Polished balance of formal refinement and ease' },
  { id: 'Classic', label: 'Classic', desc: 'Timeless, tailored, enduring menswear silhouettes' },
  { id: 'Streetwear', label: 'Streetwear', desc: 'Urban staples, expressive and modern' },
  { id: 'Old Money', label: 'Old Money', desc: 'Quiet luxury, linen, polo knits & loafers' }
];

export default function PreferencesPage({
  preferences,
  onSavePreferences,
  saving = false
}) {
  const [favoriteColors, setFavoriteColors] = useState([]);
  const [dislikedColors, setDislikedColors] = useState([]);
  const [preferredStyles, setPreferredStyles] = useState([]);
  const [customFavInput, setCustomFavInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFavoriteColors(preferences.favorite_colors || []);
      setDislikedColors(preferences.disliked_colors || []);
      setPreferredStyles(preferences.preferred_styles || []);
    }
  }, [preferences]);

  const toggleFavoriteColor = (colorName) => {
    if (favoriteColors.includes(colorName)) {
      setFavoriteColors(favoriteColors.filter(c => c !== colorName));
    } else {
      setFavoriteColors([...favoriteColors, colorName]);
      setDislikedColors(dislikedColors.filter(c => c !== colorName));
    }
  };

  const toggleDislikedColor = (colorName) => {
    if (dislikedColors.includes(colorName)) {
      setDislikedColors(dislikedColors.filter(c => c !== colorName));
    } else {
      setDislikedColors([...dislikedColors, colorName]);
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
      preferred_styles: preferredStyles
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
          Customize your personal styling profile. Outfits generated in the Recommendation Engine will prioritize your favorite tones and style aesthetics.
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
            Garments featuring these colors receive an elevated compatibility score in recommendations.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_COLORS.map((c) => {
              const isSelected = favoriteColors.includes(c.name);
              const isGradient = c.isGradient || (c.hex && c.hex.startsWith('linear-gradient'));
              return (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => toggleFavoriteColor(c.name)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${c.border ? 'border border-slate-300' : ''}`}
                    style={isGradient ? { backgroundImage: c.hex } : { backgroundColor: c.hex }}
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
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
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
            Outfits featuring these colors are deprioritized in recommendations.
          </p>

          <div className="flex flex-wrap gap-2">
            {POPULAR_COLORS.map((c) => {
              const isDisliked = dislikedColors.includes(c.name);
              const isGradient = c.isGradient || (c.hex && c.hex.startsWith('linear-gradient'));
              return (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => toggleDislikedColor(c.name)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                    isDisliked
                      ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${c.border ? 'border border-slate-300' : ''}`}
                    style={isGradient ? { backgroundImage: c.hex } : { backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  {isDisliked && <Check className="w-3 h-3 text-amber-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Style Aesthetics Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Preferred Style Aesthetics</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Select the style paradigms that best match your personal taste.
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
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
