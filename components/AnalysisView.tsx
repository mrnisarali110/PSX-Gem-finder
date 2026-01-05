import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import MetricChart from './MetricChart';

interface AnalysisViewProps {
  result: AnalysisResult;
  comparisonResult?: AnalysisResult | null;
  onSaveToWatchlist?: (result: AnalysisResult) => void;
  onBack: () => void;
  isSaved?: boolean;
}

const VerdictCard: React.FC<{ 
  result: AnalysisResult; 
  onSave?: () => void;
  isSaved?: boolean;
}> = ({ result, onSave, isSaved }) => {
  const getBadgeStyles = (verdict: string) => {
    switch (verdict) {
      case 'GEM': return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-800 dark:text-emerald-400',
          icon: '💎'
      };
      case 'WATCH': return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-800 dark:text-amber-400',
          icon: '⚠️'
      };
      case 'TRAP': return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-400',
          icon: '❌'
      };
      case 'UNKNOWN': return {
          bg: 'bg-gray-50 dark:bg-slate-700/50',
          border: 'border-gray-200 dark:border-slate-600',
          text: 'text-gray-500 dark:text-gray-400',
          icon: '❓'
      };
      default: return {
          bg: 'bg-slate-50 dark:bg-slate-800',
          border: 'border-slate-200 dark:border-slate-700',
          text: 'text-slate-800 dark:text-slate-400',
          icon: '?'
      };
    }
  };

  const styles = getBadgeStyles(result.verdict);

  return (
    <div className={`rounded-xl border ${styles.border} ${styles.bg} p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm`}>
        <div className="flex items-center gap-4">
            <div className="text-4xl filter drop-shadow-sm">{styles.icon}</div>
            <div>
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-1">AI Verdict</h3>
                <div className={`text-3xl font-serif font-bold ${styles.text}`}>{result.verdict}</div>
                <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mt-1">
                   Confidence: <span className="font-bold">{result.confidence}%</span>
                </div>
            </div>
        </div>

        {onSave && result.verdict !== 'UNKNOWN' && (
            <button 
            onClick={onSave}
            disabled={isSaved}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all
                ${isSaved 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-default' 
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 hover:border-gem-500 shadow-sm hover:shadow-md'
                }
            `}
            >
            {isSaved ? 'Saved to Watchlist' : 'Add to Watchlist'}
            </button>
        )}
    </div>
  );
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, comparisonResult, onSaveToWatchlist, onBack, isSaved }) => {
  
  // Handle case where stock is not found
  if (result.verdict === 'UNKNOWN') {
    return (
      <div className="w-full pb-20 animate-slide-up flex flex-col items-center">
         <div className="mb-6 sticky top-24 z-10 w-full max-w-4xl px-4 md:static">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-gem-600 dark:hover:text-white transition-colors group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-full md:bg-transparent md:p-0 shadow-sm md:shadow-none border border-slate-200 md:border-none dark:border-slate-700"
            >
                <div className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-gem-500 transition-colors shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </div>
                <span className="font-bold text-sm">Back to Search</span>
            </button>
         </div>

         <div className="max-w-xl w-full text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🤔</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stock Not Identified</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't confidently identify <span className="font-mono font-bold text-gem-600 dark:text-gem-400">{result.companyName}</span> on the PSX.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left text-sm text-blue-800 dark:text-blue-300 mb-8 border border-blue-100 dark:border-blue-900/30">
                <strong>Tip:</strong> Try searching for the official symbol or full company name (e.g., "OGDC" instead of "Oil Gas").
            </div>
            <button 
                onClick={onBack}
                className="bg-gem-600 hover:bg-gem-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-gem-500/30"
            >
                Try Another Search
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 animate-slide-up">
      
      {/* Back Button (Mobile Optimized) */}
      <div className="mb-6 sticky top-24 z-10 md:static">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-gem-600 dark:hover:text-white transition-colors group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-full md:bg-transparent md:p-0 shadow-sm md:shadow-none border border-slate-200 md:border-none dark:border-slate-700"
        >
            <div className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-gem-500 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </div>
            <span className="font-bold text-sm">Back to Search</span>
        </button>
      </div>

      {/* 1. Summary Section (Verdict + Pulse) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Result Verdict */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
                    {result.companyName || "Analysis Report"}
                </h1>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800">
                    Live Data Analysis
                </span>
             </div>
             
             <VerdictCard 
                result={result} 
                onSave={() => onSaveToWatchlist && onSaveToWatchlist(result)}
                isSaved={isSaved}
             />

             {/* Comparison Verdict if exists */}
             {comparisonResult && (
                <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <h3 className="text-sm font-bold text-slate-500 mb-2">Comparison: {comparisonResult.companyName}</h3>
                    <VerdictCard result={comparisonResult} />
                </div>
             )}
          </div>

          {/* Market Pulse (Side Panel) */}
          <div className="lg:col-span-1">
             <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 h-full shadow-sm hover:shadow-md transition-shadow">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                     </span>
                     Market Pulse (Last 90 Days)
                 </h3>
                 <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                     <ReactMarkdown>{result.searchInsights || "No recent news found."}</ReactMarkdown>
                 </div>
             </div>
          </div>
      </div>

      {/* 2. Visuals (Charts) */}
      {result.financialData.length > 0 && (
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm overflow-hidden">
             <MetricChart data={result} comparisonData={comparisonResult || undefined} />
          </div>
      )}

      {/* 3. Detailed Report */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-700">
            Comprehensive Analysis
        </h2>
        <article className="prose prose-slate dark:prose-invert max-w-none 
          prose-headings:font-serif prose-headings:font-bold 
          prose-h3:text-gem-700 dark:prose-h3:text-gem-400 prose-h3:text-lg
          prose-strong:text-slate-900 dark:prose-strong:text-white
          prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-700 prose-table:rounded-lg
          prose-th:bg-slate-50 dark:prose-th:bg-slate-900 prose-th:p-3 prose-th:text-slate-700 dark:prose-th:text-slate-300
          prose-td:p-3 prose-td:border-t dark:prose-td:border-slate-700
          text-slate-700 dark:text-slate-300
        ">
          <ReactMarkdown>{result.markdown}</ReactMarkdown>
        </article>

        {comparisonResult && (
            <div className="mt-12 pt-12 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                    Comparison Report: {comparisonResult.companyName}
                </h2>
                <article className="prose prose-slate dark:prose-invert max-w-none">
                     <ReactMarkdown>{comparisonResult.markdown}</ReactMarkdown>
                </article>
            </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisView;