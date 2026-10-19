import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 text-white border-emerald-700',
    error: 'bg-rose-900/90 text-white border-rose-700',
    info: 'bg-slate-900/90 text-white border-slate-700'
  }[type] || 'bg-slate-900/90 text-white';

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  }[type] || Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${bgStyles}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
