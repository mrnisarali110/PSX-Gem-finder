import React, { useState } from 'react';
import { WatchlistItem } from '../types';

interface WatchlistViewProps {
  items: WatchlistItem[];
  onRemove: (id: string) => void;
  onView: (item: WatchlistItem) => void;
  onBack: () => void;
}

const WatchlistView: React.FC<WatchlistViewProps> = ({ items, onRemove, onView, onBack }) => {
  const [email, setEmail] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  const getBadgeColors = (verdict: string) => {
    switch (verdict) {
      case 'GEM': return 'text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-500/30';
      case 'WATCH': return 'text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-500/30';
      case 'TRAP': return 'text-red-800 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-500/30';
      default: return 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-20">
      
      {/* Back Button */}
      <div className="mb-6">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-gem-600 dark:hover:text-white transition-colors group"
        >
            <div className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-gem-500 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </div>
            <span className="font-bold text-sm">Back to Home</span>
        </button>
      </div>

      {/* Dashboard Header & Alerts */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 border-b border-gray-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">My Portfolio Watchlist</h2>
          <p className="text-slate-600 dark:text-slate-400">Track your saved gems and monitor their performance.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm w-full lg:w-auto">
          <div className="flex items-center justify-between mb-3 gap-8">
             <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
               <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               Smart Alerts
             </span>
             <button 
               onClick={() => setAlertsEnabled(!alertsEnabled)}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${alertsEnabled ? 'bg-gem-600' : 'bg-slate-300 dark:bg-slate-600'}`}
             >
               <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alertsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
             </button>
          </div>
          {alertsEnabled && (
            <div className="flex flex-col sm:flex-row gap-2 animate-slide-up">
              <input 
                type="email" 
                placeholder="Enter email for alerts..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded px-3 py-1.5 text-slate-900 dark:text-white focus:border-gem-500 focus:outline-none w-full sm:w-64"
              />
              <button className="text-xs bg-slate-800 dark:bg-slate-700 hover:bg-gem-600 text-white px-3 py-2 rounded transition-colors whitespace-nowrap">
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
           <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700 shadow-sm">
             <span className="text-2xl grayscale">💎</span>
           </div>
           <h3 className="text-xl text-slate-900 dark:text-slate-300 font-bold mb-2">Your watchlist is empty</h3>
           <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto px-4 font-medium">Analyze stocks and click the "Save to Watchlist" button to track them here.</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-gem-500 dark:hover:border-gem-500 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
             {/* Card Header */}
             <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-start">
                <div className="overflow-hidden">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide truncate pr-2">{item.symbol}</h3>
                   <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved: {new Date(item.savedAt).toLocaleDateString()}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColors(item.verdict)}`}>
                   {item.verdict}
                </div>
             </div>

             {/* Card Body */}
             <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Price at Analysis</span>
                   <span className="font-mono font-bold text-slate-900 dark:text-white">Rs {item.priceWhenSaved}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">AI Confidence</span>
                   <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-gem-500" style={{ width: `${item.confidence}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gem-700 dark:text-gem-400">{item.confidence}%</span>
                   </div>
                </div>
             </div>

             {/* Card Actions */}
             <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex gap-2">
                <button 
                  onClick={() => onView(item)}
                  className="flex-1 py-2 text-sm bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gem-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg transition-colors font-bold shadow-sm"
                >
                  View Report
                </button>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove from Watchlist"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistView;