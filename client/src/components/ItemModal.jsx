import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, AlertCircle, Image as ImageIcon, Loader2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { POPULAR_COLORS } from './ColorSwatch.jsx';
import { api } from '../api/client.js';

const SUB_CATEGORY_PRESETS = {
  Top: ['T-Shirt', 'Shirt', 'Polo', 'Sweater', 'Hoodie', 'Jacket', 'Blazer', 'Other'],
  Bottom: ['Jeans', 'Trousers', 'Chinos', 'Shorts', 'Cargo Pants', 'Joggers', 'Other'],
  Shoes: ['Sneakers', 'Formal Shoes', 'Loafers', 'Boots', 'Sandals', 'Other'],
  Accessories: ['Watch', 'Belt', 'Bag', 'Sunglasses', 'Cap', 'Scarf', 'Tie', 'Other']
};

const FABRIC_OPTIONS = ['Cotton', 'Linen', 'Wool', 'Cashmere', 'Denim', 'Silk', 'Leather', 'Suede', 'Knit', 'Polyester', 'Blend', 'Other'];
const PATTERN_OPTIONS = ['Solid', 'Striped', 'Checked / Plaid', 'Textured', 'Floral', 'Graphic', 'Houndstooth', 'Polka Dot', 'Other'];
const SEASON_OPTIONS = ['All Seasons', 'Summer', 'Winter', 'Spring', 'Autumn'];
const OCCASION_OPTIONS = [
  'Casual',
  'Smart Casual',
  'Work / Formal',
  'Party',
  'Sports / Active',
  'Traditional',
  'All Occasions'
];

export default function ItemModal({ isOpen, item, initialCategory, onClose, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    category: initialCategory || 'Top',
    sub_category: 'T-Shirt',
    color: 'White',
    hex_color: '#FFFFFF',
    secondary_color: '',
    pattern: 'Solid',
    fabric: 'Cotton',
    style: 'Casual',
    season: 'All Seasons',
    weather_suitability: 'All Weather',
    occasion: 'Casual',
    silhouette: '',
    waterproof_status: 'Non-waterproof',
    image_url: '',
    notes: ''
  });

  const [customColor, setCustomColor] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'Top',
        sub_category: item.sub_category || '',
        color: item.color || 'White',
        hex_color: item.hex_color || '#FFFFFF',
        secondary_color: item.secondary_color || '',
        pattern: item.pattern || 'Solid',
        fabric: item.fabric || 'Cotton',
        style: item.style || 'Casual',
        season: item.season || 'All Seasons',
        weather_suitability: item.weather_suitability || 'All Weather',
        occasion: item.occasion || 'Casual',
        silhouette: item.silhouette || '',
        waterproof_status: item.waterproof_status || 'Non-waterproof',
        image_url: item.image_url || '',
        notes: item.notes || ''
      });
      const isPresetColor = POPULAR_COLORS.some(c => c.name.toLowerCase() === (item.color || '').toLowerCase());
      if (!isPresetColor && item.color) {
        setCustomColor(item.color);
      }
      if (item.secondary_color || item.pattern || item.fabric || item.season !== 'All Seasons' || item.silhouette) {
        setShowAdvanced(true);
      }
    } else {
      const defaultCat = initialCategory || 'Top';
      setFormData({
        name: '',
        category: defaultCat,
        sub_category: SUB_CATEGORY_PRESETS[defaultCat]?.[0] || 'T-Shirt',
        color: 'White',
        hex_color: '#FFFFFF',
        secondary_color: '',
        pattern: 'Solid',
        fabric: defaultCat === 'Shoes' ? 'Leather' : 'Cotton',
        style: 'Casual',
        season: 'All Seasons',
        weather_suitability: 'All Weather',
        occasion: 'Casual',
        silhouette: '',
        waterproof_status: 'Non-waterproof',
        image_url: '',
        notes: ''
      });
      setCustomColor('');
      setShowAdvanced(false);
    }
    setError('');
  }, [item, initialCategory, isOpen]);

  const handleCategoryChange = (cat) => {
    setFormData(prev => ({
      ...prev,
      category: cat,
      sub_category: SUB_CATEGORY_PRESETS[cat]?.[0] || '',
      fabric: cat === 'Shoes' ? 'Leather' : prev.fabric
    }));
  };

  const handleColorPreset = (colorObj) => {
    setFormData(prev => ({
      ...prev,
      color: colorObj.name,
      hex_color: colorObj.hex
    }));
    setCustomColor('');
  };

  const handleCustomColorChange = (e) => {
    const val = e.target.value;
    setCustomColor(val);
    setFormData(prev => ({
      ...prev,
      color: val
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid JPEG, PNG, or WebP image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB.');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        setFormData(prev => ({ ...prev, image_url: res.url }));
      }
    } catch (err) {
      setError(err.message || 'Failed to upload image file.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide a name for this clothing item.');
      return;
    }
    if (!formData.sub_category.trim()) {
      setError('Please select or specify a sub-category.');
      return;
    }
    if (!formData.color.trim()) {
      setError('Please choose or enter a color.');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData, item?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save clothing item');
    } finally {
      setLoading(false);
    }
  };

  const isShoes = formData.category === 'Shoes';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              {item ? 'Edit Clothing Item' : 'Add Clothing Item'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {item ? 'Update garment details, weather suitability, and image' : 'Add a garment to your digital closet with auto studio image assignment'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Classic White Linen Shirt"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              required
            />
          </div>

          {/* Category Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Top', 'Bottom', 'Shoes', 'Accessories'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                    formData.category === cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'Top' ? 'Tops' : cat === 'Bottom' ? 'Bottoms' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Sub-Category <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(SUB_CATEGORY_PRESETS[formData.category] || []).map((sub) => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => setFormData(prev => ({ ...prev, sub_category: sub }))}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                    formData.sub_category === sub
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom sub-category (e.g. Henley, Cargo Shorts)"
              value={formData.sub_category}
              onChange={(e) => setFormData(prev => ({ ...prev, sub_category: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Primary Color Palette */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Primary Color <span className="text-rose-500">*</span> (Selected: <span className="text-slate-900 font-bold">{formData.color}</span>)
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {POPULAR_COLORS.map((c) => {
                const isSelected = formData.color.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => handleColorPreset(c)}
                    className={`relative w-7 h-7 rounded-full shadow-xs flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      c.border ? 'border border-slate-300' : 'border border-black/10'
                    } ${isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''}`}
                    style={c.isGradient ? { backgroundImage: c.hex } : { backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && (
                      <span className={`w-2 h-2 rounded-full ${c.name === 'White' || c.name === 'Cream' || c.name === 'Yellow' ? 'bg-black' : 'bg-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="Or enter custom color (e.g. Lavender, Rust, Emerald)"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Weather Suitability & Occasion */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Weather Suitability
              </label>
              <select
                value={formData.weather_suitability}
                onChange={(e) => setFormData(prev => ({ ...prev, weather_suitability: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="All Weather">🌤️ All Weather (Versatile)</option>
                <option value="Hot">☀️ Hot (Warm / Summer)</option>
                <option value="Mild">⛅ Mild (Transitional / Moderate)</option>
                <option value="Cold">❄️ Cold (Chilly / Winter)</option>
                <option value="Rainy">🌧️ Rainy (Water-Resistant)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Occasion Style
              </label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                {OCCASION_OPTIONS.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footwear-Specific Waterproof Quick-Toggle */}
          {isShoes && (
            <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Waterproof / Rain Protection</p>
                  <p className="text-[11px] text-slate-500">Prioritizes this pair in rainy weather styling</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={
                  formData.weather_suitability === 'Rainy' ||
                  (formData.notes && formData.notes.toLowerCase().includes('waterproof'))
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      notes: prev.notes ? `${prev.notes}, waterproof` : 'waterproof construction'
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      notes: prev.notes.replace(/,?\s*waterproof\s*(construction)?/gi, '').trim()
                    }));
                  }
                }}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {/* Toggle Advanced Fashion Details */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{showAdvanced ? 'Hide Additional Fashion Details' : 'Add Advanced Details (Season, Fabric, Pattern, Secondary Color)'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showAdvanced && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                {/* Season */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Season
                  </label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    {SEASON_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Fabric */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Fabric / Material
                  </label>
                  <select
                    value={formData.fabric}
                    onChange={(e) => setFormData(prev => ({ ...prev, fabric: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    {FABRIC_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Pattern */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Pattern
                  </label>
                  <select
                    value={formData.pattern}
                    onChange={(e) => setFormData(prev => ({ ...prev, pattern: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    {PATTERN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Secondary Accent Color
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gold, Navy, Beige (Optional)"
                    value={formData.secondary_color || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Silhouette / Fit */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Silhouette / Fit
                  </label>
                  <select
                    value={formData.silhouette || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, silhouette: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    <option value="">Default Fit</option>
                    <option value="Slim">Slim</option>
                    <option value="Regular">Regular</option>
                    <option value="Relaxed">Relaxed</option>
                    <option value="Oversized">Oversized</option>
                    <option value="Tailored">Tailored</option>
                    <option value="Straight-leg">Straight-leg</option>
                    <option value="Wide-leg">Wide-leg</option>
                  </select>
                </div>

                {/* Waterproof Status */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Waterproofing
                  </label>
                  <select
                    value={formData.waterproof_status || 'Non-waterproof'}
                    onChange={(e) => setFormData(prev => ({ ...prev, waterproof_status: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    <option value="Non-waterproof">Non-waterproof (Standard)</option>
                    <option value="Water-resistant">Water-resistant</option>
                    <option value="Waterproof">Waterproof</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Garment Image Management */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Garment Product Image
              </label>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Auto-assigned if empty
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Auto-assigned catalog image or paste URL"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition shadow-xs">
                {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {formData.image_url && (
              <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain p-1" />
                </div>
                <div className="text-[11px] text-slate-500">
                  <p className="font-semibold text-slate-700">Image attached</p>
                  <p className="truncate max-w-[280px]">{formData.image_url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  className="ml-auto text-xs text-rose-500 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Garment Notes <span className="text-slate-400 font-normal lowercase">(fabric, fit, waterproof details)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Slim fit, 100% Egyptian cotton, waterproof rubber lug sole"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploadingImage}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : item ? 'Update Item' : 'Add to Closet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
