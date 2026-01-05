import React, { useState, useMemo } from 'react';
import { MOCK_PSX_STOCKS } from '../constants';
import { Stock } from '../types';

interface StockSelectorProps {
  onSelect: (stock: Stock) => void;
  selectedStock: Stock | null;
  label?: string;
  isComparison?: boolean;
}

const SectorIcon: React.FC<{ sector: string }> = ({ sector }) => {
  // Simple mapping for visual flair
  if (sector.includes('Cement')) return <span className="text-2xl">🏗️</span>;
  if (sector.includes('Oil') || sector.includes('Power')) return <span className="text-2xl">⚡</span>;
  if (sector.includes('Bank') || sector.includes('Financial')) return <span className="text-2xl">🏦</span>;
  if (sector.includes('Tech') || sector.includes('Communication')) return <span className="text-2xl">💻</span>;
  if (sector.includes('Auto')) return <span className="text-2xl">🚗</span>;
  if (sector.includes('Fertilizer')) return <span className="text-2xl">🌱</span>;
  if (sector === 'General') return <span className="text-2xl">🌐</span>;
  return <span className="text-2xl">🏢</span>;
};

const StockSelector: React.FC<StockSelectorProps> = ({ onSelect, selectedStock, label, isComparison }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedStocks = useMemo(() => {
    const groups: { [key: string]: Stock[] } = {};
    MOCK_PSX_STOCKS.forEach(stock => {
      if (!groups[stock.sector]) groups[stock.sector] = [];
      groups[stock.sector].push(stock);
    });
    return groups;
  }, []);

  const filteredSectors = Object.keys(groupedStocks).filter(sector => {
    if (!searchTerm) return true;
    const sectorMatch = sector.toLowerCase().includes(searchTerm.toLowerCase());
    const stockMatch = groupedStocks[sector].some(s => 
      s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sectorMatch || stockMatch;
  });

  const handleCustomSearch = () => {
    if (!searchTerm) return;
    const cleanSymbol = searchTerm.toUpperCase().trim();
    // Create a dynamic stock object for analysis
    const customStock: Stock = {
        symbol: cleanSymbol,
        name: `${cleanSymbol} (Custom Search)`,
        sector: 'General',
        price: 0, // Signal to AI to find price
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    onSelect(customStock);
    setSearchTerm('');
  };

  // Compact View when selected
  if (selectedStock && !isComparison) { 
     const isCustom = selectedStock.price === 0;
     return (
        <div className="w-full">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div className="group relative flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-2 border-gem-500 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all" onClick={() => onSelect(null as any)}>
                
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="min-w-12 w-12 h-12 rounded-full bg-gradient-to-br from-gem-500 to-gem-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {isCustom ? '?' : selectedStock.symbol[0]}
                    </div>
                    <div className="truncate">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg leading-tight">{selectedStock.symbol}</h3>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 truncate">
                            {isCustom ? "System will verify this symbol..." : selectedStock.name}
                        </p>
                    </div>
                </div>

                <div className="text-right pl-4 shrink-0">
                    <p className="font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap text-lg">
                        {selectedStock.price > 0 ? `Rs ${selectedStock.price}` : 'Auto-Fetch'}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full inline-block mt-1">
                        {selectedStock.sector}
                    </span>
                </div>

                {/* Hover overlay for 'Change' indication */}
                <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                    <span className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-slate-700 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        Click to Change
                    </span>
                </div>
            </div>
        </div>
     )
  }

  // Check if search term matches exactly any existing symbol
  const exactMatch = MOCK_PSX_STOCKS.some(s => s.symbol.toUpperCase() === searchTerm.toUpperCase());

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{label}</label>
         <input 
            type="text" 
            placeholder="Search ANY stock (e.g. WAFI, PIA, PSO)..." 
            className="w-full sm:w-1/2 bg-transparent border-b-2 border-gray-200 dark:border-slate-600 text-sm py-1 px-2 focus:outline-none focus:border-gem-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.length > 0) {
                    handleCustomSearch();
                }
            }}
         />
      </div>

      <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Global Search Option */}
        {searchTerm.length > 1 && !exactMatch && (
            <div 
                onClick={handleCustomSearch}
                className="bg-gradient-to-r from-gem-600 to-gem-700 border border-transparent rounded-xl p-3 shadow-md cursor-pointer hover:scale-[1.01] transition-transform animate-fade-in flex items-center gap-3 text-white"
            >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div>
                    <h4 className="font-bold text-sm">Analyze "{searchTerm.toUpperCase()}"</h4>
                    <p className="text-[10px] text-white/80 font-medium">Auto-detect symbol & fetch live data</p>
                </div>
                <div className="ml-auto">
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full font-bold">Global Search</span>
                </div>
            </div>
        )}

        {filteredSectors.map(sector => (
          <div key={sector} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Sector Header */}
            <div className="p-3 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3">
                <SectorIcon sector={sector} />
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-wide uppercase">{sector}</span>
            </div>
            
            {/* Stock Chips */}
            <div className="p-3 flex flex-wrap gap-2">
                {groupedStocks[sector]
                  .filter(s => !searchTerm || s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(stock => (
                    <button
                        key={stock.symbol}
                        onClick={() => onSelect(stock)}
                        className={`
                            px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 flex-grow sm:flex-grow-0 justify-center
                            ${selectedStock?.symbol === stock.symbol 
                                ? 'bg-gem-600 text-white border-gem-700 shadow-md transform scale-105' 
                                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-600 hover:border-gem-400 hover:shadow-sm hover:text-gem-700 dark:hover:text-white'
                            }
                        `}
                    >
                        <span className="font-bold text-sm">{stock.symbol}</span>
                        <span className={`opacity-80 text-[10px] pl-2 ml-1 border-l ${selectedStock?.symbol === stock.symbol ? 'border-white/30' : 'border-gray-300 dark:border-gray-500'}`}>Rs {stock.price}</span>
                    </button>
                ))}
            </div>
          </div>
        ))}
        
        {filteredSectors.length === 0 && searchTerm.length < 2 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 font-medium">Type to search for any PSX company.</div>
        )}
      </div>
    </div>
  );
};

export default StockSelector;