import React, { useState } from 'react';
import { Bookmark, Clock, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import OutfitCard from '../components/OutfitCard.jsx';

export default function SavedOutfitsPage({
  savedOutfits = [],
  history = [],
  onDeleteSaved,
  onNavigate
}) {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'history'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Saved Outfits & History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Revisit your favorite curated combinations and past style sessions
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'saved'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Outfits ({savedOutfits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Generation History ({history.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'saved' ? (
        savedOutfits.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Outfits Saved Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              When you generate outfit recommendations, click <strong>"Save Outfit"</strong> to bookmark them here for fast inspiration.
            </p>
            <button
              onClick={() => onNavigate('recommendations')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Outfits</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {savedOutfits.map((outfit) => (
              <div key={outfit.id} className="relative">
                <OutfitCard
                  outfit={outfit}
                  isSaved={true}
                  onDeleteSaved={onDeleteSaved}
                />
              </div>
            ))}
          </div>
        )
      ) : (
        /* History Log View */
        history.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Generation History</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Your outfit recommendation sessions will be logged here automatically.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {history.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                    {item.outfit_count}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {item.weather} Weather • {item.occasion} Occasion
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.summary}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()} at{' '}
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
