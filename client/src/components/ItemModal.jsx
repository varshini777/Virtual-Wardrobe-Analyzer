import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { POPULAR_COLORS } from './ColorSwatch.jsx';
import { api } from '../api/client.js';

const SUB_CATEGORY_PRESETS = {
  Top: ['T-shirt', 'Shirt', 'Polo', 'Sweater', 'Hoodie', 'Jacket', 'Coat', 'Tank Top', 'Blazer'],
  Bottom: ['Jeans', 'Chinos', 'Trousers', 'Shorts', 'Skirt', 'Sweatpants', 'Cargo Pants'],
  Shoes: ['Sneakers', 'Loafers', 'Formal Shoes', 'Boots', 'Sandals', 'Running Shoes', 'Oxfords'],
  Accessories: ['Watch', 'Sunglasses', 'Belt', 'Scarf', 'Hat', 'Bag', 'Tie']
};

export default function ItemModal({ isOpen, item, initialCategory, onClose, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    category: initialCategory || 'Top',
    sub_category: 'T-shirt',
    color: 'White',
    hex_color: '#FFFFFF',
    weather_suitability: 'All Weather',
    occasion: 'Casual',
    image_url: '',
    notes: ''
  });

  const [customColor, setCustomColor] = useState('');
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
        weather_suitability: item.weather_suitability || 'All Weather',
        occasion: item.occasion || 'Casual',
        image_url: item.image_url || '',
        notes: item.notes || ''
      });
      const isPresetColor = POPULAR_COLORS.some(c => c.name.toLowerCase() === (item.color || '').toLowerCase());
      if (!isPresetColor && item.color) {
        setCustomColor(item.color);
      }
    } else {
      const defaultCat = initialCategory || 'Top';
      setFormData({
        name: '',
        category: defaultCat,
        sub_category: SUB_CATEGORY_PRESETS[defaultCat]?.[0] || 'T-shirt',
        color: 'White',
        hex_color: '#FFFFFF',
        weather_suitability: 'All Weather',
        occasion: 'Casual',
        image_url: '',
        notes: ''
      });
      setCustomColor('');
    }
    setError('');
  }, [item, initialCategory, isOpen]);

  const handleCategoryChange = (cat) => {
    setFormData(prev => ({
      ...prev,
      category: cat,
      sub_category: SUB_CATEGORY_PRESETS[cat]?.[0] || ''
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              {item ? 'Edit Clothing Item' : 'Add Clothing Item'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {item ? 'Update item details, weather suitability, and image' : 'Add a garment to your digital closet with auto image assignment'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
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
                  className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                    formData.category === cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
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
                  className={`px-2.5 py-1 text-xs rounded-lg border transition ${
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

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Color <span className="text-rose-500">*</span> (Selected: <span className="text-slate-900 font-bold">{formData.color}</span>)
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {POPULAR_COLORS.map((c) => {
                const isSelected = formData.color.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => handleColorPreset(c)}
                    className={`relative w-7 h-7 rounded-full shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${
                      c.border ? 'border border-slate-300' : 'border border-black/10'
                    } ${isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && (
                      <span className={`w-2 h-2 rounded-full ${c.name === 'White' || c.name === 'Yellow' ? 'bg-black' : 'bg-white'}`} />
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="All Weather">🌤️ All Weather (Versatile)</option>
                <option value="Hot">☀️ Hot (Warm / Summer)</option>
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Casual">Casual (Relaxed everyday)</option>
                <option value="Work">Work (Smart casual / office)</option>
                <option value="Formal">Formal (Suits & events)</option>
                <option value="All Occasions">All Occasions (Universal)</option>
              </select>
            </div>
          </div>

          {/* Garment Image Management */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Garment Product Image
              </label>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Auto-assigned if left empty
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
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition shadow-sm">
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
                <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain p-1" />
                </div>
                <div className="text-[11px] text-slate-500">
                  <p className="font-semibold text-slate-700">Image attached</p>
                  <p className="truncate max-w-[280px]">{formData.image_url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  className="ml-auto text-xs text-rose-500 hover:underline"
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
              placeholder="e.g. Slim fit, 100% Egyptian cotton, waterproof rubber sole"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploadingImage}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : item ? 'Update Item' : 'Add to Closet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
