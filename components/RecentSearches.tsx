import React from 'react';
import { RecentSearch } from '../types';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (symbol: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelect }) => {
  if (searches.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mt-12 animate-slide-up">
      <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4 pl-1">Past Researched Data</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {searches.map((item, index) => (
          <div 
            key={`${item.symbol}-${index}`}
            onClick={() => onSelect(item.symbol)}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-xl cursor-pointer hover:border-gem-500 dark:hover:border-gem-500 hover:shadow-lg transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-900 dark:text-white group-hover:text-gem-600 dark:group-hover:text-gem-400 transition-colors">{item.symbol}</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 truncate font-medium">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;