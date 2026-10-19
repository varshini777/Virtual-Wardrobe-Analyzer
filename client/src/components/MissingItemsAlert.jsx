import React from 'react';
import { AlertTriangle, PlusCircle } from 'lucide-react';

export default function MissingItemsAlert({ missingCategories = [], onAddItem }) {
  if (!missingCategories || missingCategories.length === 0) return null;

  return (
    <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-amber-900">
              Wardrobe Incomplete for Outfit Generation
            </h4>
            <p className="text-sm text-amber-800 mt-1">
              To curate valid outfit combinations, your wardrobe needs at least 1 <strong>Top</strong>, 1 <strong>Bottom</strong>, and 1 pair of <strong>Shoes</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">Missing:</span>
              {missingCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-200 text-amber-900 border border-amber-300"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {onAddItem && (
          <button
            onClick={() => onAddItem(missingCategories[0] || 'Top')}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-amber-900 text-white rounded-xl hover:bg-amber-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add {missingCategories[0] || 'Item'}
          </button>
        )}
      </div>
    </div>
  );
}
