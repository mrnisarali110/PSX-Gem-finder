import React, { useState, useEffect } from 'react';
import StockSelector from './components/StockSelector';
import AnalysisView from './components/AnalysisView';
import WatchlistView from './components/WatchlistView';
import LoadingOverlay from './components/LoadingOverlay';
import RecentSearches from './components/RecentSearches';
import ProfileModal from './components/ProfileModal';
import LandingSection from './components/LandingSection';
import { Logo } from './components/Logo';
import { Stock, AnalysisResult, AnalysisStatus, WatchlistItem, RecentSearch, UserProfile } from './types';
import { analyzeStockWithGemini, getMarketPulse } from './services/geminiService';
import { MOCK_PSX_STOCKS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'search' | 'watchlist' | 'result'>('search');
  
  // Theme State
  const [darkMode, setDarkMode] = useState(true);
  
  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    experience: 'Beginner',
    riskTolerance: 'Medium',
    apiKey: ''
  });

  // Search State
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [comparisonStock, setComparisonStock] = useState<Stock | null>(null);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [isMinimized, setIsMinimized] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<AnalysisResult | null>(null);

  // Data Persistence
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Simple Beep Sound
  const playNotification = (isError = false) => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = isError ? 'sawtooth' : 'sine';
        oscillator.frequency.setValueAtTime(isError ? 150 : 880, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.error("Audio play failed", e);
    }
  };

  // --- Effects ---

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('gem_finder_watchlist');
    if (savedWatchlist) {
      try { setWatchlist(JSON.parse(savedWatchlist)); } catch (e) { console.error(e); }
    }
    const savedHistory = localStorage.getItem('gem_finder_history');
    if (savedHistory) {
      try { setRecentSearches(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    const savedProfile = localStorage.getItem('gem_finder_profile');
    if (savedProfile) {
        try { setUserProfile(JSON.parse(savedProfile)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gem_finder_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('gem_finder_history', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('gem_finder_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // --- Handlers ---

  const addToWatchlist = (result: AnalysisResult) => {
    if (!result.companyName) return;
    if (watchlist.some(item => item.id === result.companyName)) return;

    const currentPrice = selectedStock?.symbol === result.companyName ? selectedStock.price : 0;
    const newItem: WatchlistItem = {
      ...result,
      id: result.companyName,
      symbol: result.companyName,
      savedAt: new Date().toISOString(),
      priceWhenSaved: currentPrice
    };
    setWatchlist([newItem, ...watchlist]);
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
  };

  const addToHistory = (stock: Stock) => {
    const newItem: RecentSearch = {
      symbol: stock.symbol,
      name: stock.name,
      timestamp: new Date().toISOString()
    };
    const filtered = recentSearches.filter(s => s.symbol !== stock.symbol);
    setRecentSearches([newItem, ...filtered].slice(0, 8));
  };

  const handleAnalyze = async () => {
    if (!selectedStock) return;
    if (isComparisonMode && !comparisonStock) return;

    // --- CHECK FOR API KEY ---
    // Note: We check if key is in profile OR if there is an environment key. 
    // The service handles priority, here we just check if ANY key is available before starting loading UI.
    const hasEnvKey = process.env.API_KEY && process.env.API_KEY.length > 5;
    const hasUserKey = userProfile.apiKey && userProfile.apiKey.length > 5;

    if (!hasEnvKey && !hasUserKey) {
        alert("Please add your FREE Google Gemini API Key in the Profile to continue.");
        setIsProfileOpen(true);
        return;
    }

    try {
      setStatus(AnalysisStatus.ANALYZING);
      setIsMinimized(false);
      setResult(null);
      setComparisonResult(null);
      
      const promises = [
        analyzeStockWithGemini(selectedStock),
        getMarketPulse(selectedStock)
      ];

      if (isComparisonMode && comparisonStock) {
        promises.push(analyzeStockWithGemini(comparisonStock));
        promises.push(getMarketPulse(comparisonStock));
      }

      const responses = await Promise.all(promises);

      const mainResult = responses[0] as AnalysisResult;
      
      setResult({
          ...mainResult,
          searchInsights: responses[1] as string,
          companyName: selectedStock.symbol
      });
      
      // Only add to history if it's a valid stock
      if (mainResult.verdict !== 'UNKNOWN') {
          addToHistory(selectedStock);
          playNotification(false);
      } else {
          // Play a lower tone for not found
          playNotification(true); 
      }

      if (isComparisonMode && comparisonStock) {
        setComparisonResult({
          ...responses[2] as AnalysisResult,
          searchInsights: responses[3] as string,
          companyName: comparisonStock.symbol
        });
        addToHistory(comparisonStock);
      }

      setStatus(AnalysisStatus.COMPLETED);
      setView('result');

    } catch (error: any) {
      console.error(error);
      if (error.message === "MISSING_API_KEY") {
          setStatus(AnalysisStatus.IDLE);
          setIsProfileOpen(true);
          alert("API Key is missing or invalid. Please update it in your profile.");
      } else {
          setStatus(AnalysisStatus.ERROR);
      }
    }
  };

  const reset = () => {
      setSelectedStock(null);
      setComparisonStock(null);
      setResult(null);
      setComparisonResult(null);
      setStatus(AnalysisStatus.IDLE);
      setIsMinimized(false);
      setView('search');
  };

  const handleSelectRecent = (symbol: string) => {
    const stock = MOCK_PSX_STOCKS.find(s => s.symbol === symbol);
    if (stock) {
      setSelectedStock(stock);
    }
  };

  const handleViewFromWatchlist = (item: WatchlistItem) => {
    const stock = MOCK_PSX_STOCKS.find(s => s.symbol === item.symbol) || { 
      symbol: item.symbol, name: item.symbol, sector: 'Unknown', price: item.priceWhenSaved, lastUpdated: '' 
    };
    setSelectedStock(stock);
    setResult(item);
    setStatus(AnalysisStatus.COMPLETED);
    setView('result');
  };

  // --- Render Logic ---

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-gray-900'}`}>
      
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        userProfile={userProfile}
        onSave={setUserProfile}
      />

      {/* Background decoration */}
      <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed bg-no-repeat pointer-events-none z-0 ${darkMode ? 'opacity-5' : 'opacity-[0.03]'}`}></div>

      {/* Floating Widget */}
      {isMinimized && (
         <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-800 border border-gem-500 shadow-2xl p-4 rounded-xl animate-slide-up flex items-center gap-4 max-w-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              onClick={() => { setIsMinimized(false); if(status === AnalysisStatus.COMPLETED) setView('result'); }}
         >
             <div className="relative w-10 h-10 flex-shrink-0">
                 {status === AnalysisStatus.COMPLETED ? (
                     <div className="w-full h-full bg-gem-500 rounded-full flex items-center justify-center text-white animate-bounce">✓</div>
                 ) : (
                    <>
                        <div className="absolute inset-0 border-2 border-slate-200 dark:border-slate-600 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-gem-500 border-t-transparent border-l-transparent rounded-full animate-spin"></div>
                    </>
                 )}
             </div>
             <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {status === AnalysisStatus.COMPLETED ? "Analysis Ready!" : `Analysing ${selectedStock?.symbol}...`}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {status === AnalysisStatus.COMPLETED ? "Click to view full report" : "Estimating Intrinsic Value"}
                </p>
             </div>
         </div>
      )}

      {/* Full Screen Loading Overlay */}
      {status === AnalysisStatus.ANALYZING && !isMinimized && (
        <LoadingOverlay 
          stockSymbol={isComparisonMode ? `${selectedStock?.symbol} & ${comparisonStock?.symbol}` : selectedStock?.symbol || ''} 
          onMinimize={() => { setIsMinimized(true); setView('search'); }}
          isCustomSearch={selectedStock?.price === 0} 
        />
      )}

      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6 flex-grow flex flex-col">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 border-b border-gray-200 dark:border-slate-800 pb-4 gap-4 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
             <Logo className="w-10 h-10 drop-shadow-md" />
             <div>
                 <h1 className="text-2xl font-serif font-bold tracking-wide text-gray-900 dark:text-white">PSX <span className="text-gem-600 dark:text-gem-500">Gem Finder</span></h1>
                 <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Live Market Intelligence</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
            <nav className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
              <button 
                onClick={() => setView('search')}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${view === 'search' || view === 'result' ? 'bg-gem-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Research
              </button>
              <button 
                onClick={() => setView('watchlist')}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${view === 'watchlist' ? 'bg-gem-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Watchlist
                {watchlist.length > 0 && (
                  <span className={`text-[10px] px-1.5 rounded-full ${view === 'watchlist' ? 'bg-white/20 text-white' : 'bg-gem-100 dark:bg-gem-900 text-gem-600 dark:text-gem-400'}`}>{watchlist.length}</span>
                )}
              </button>
            </nav>

            <div className="flex items-center gap-2">
                <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 md:p-2.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                title="Toggle Theme"
                >
                {darkMode ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
                </button>
                <button
                    onClick={() => setIsProfileOpen(true)}
                    className="p-1 rounded-full bg-gradient-to-br from-gem-500 to-gem-700 border-2 border-white dark:border-slate-700 shadow-md hover:scale-105 transition-transform"
                    title="User Profile"
                >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    </div>
                </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-7xl mx-auto flex flex-col items-center">
            
          {view === 'watchlist' && (
            <WatchlistView 
              items={watchlist} 
              onRemove={removeFromWatchlist} 
              onView={handleViewFromWatchlist}
              onBack={() => setView('search')}
            />
          )}

          {view === 'result' && result && (
             <AnalysisView 
                result={result} 
                comparisonResult={comparisonResult} 
                onSaveToWatchlist={addToWatchlist}
                isSaved={watchlist.some(w => w.id === result.companyName)}
                onBack={reset}
             />
          )}

          {view === 'search' && (
             <div className="w-full max-w-5xl animate-fade-in flex flex-col items-center pb-20">
                
                {/* Brand New Landing/About Section */}
                <LandingSection />

                {/* Control Card (Search) */}
                <div className="w-full bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/30 relative overflow-hidden transition-all duration-300">
                    
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={() => { reset(); setIsComparisonMode(!isComparisonMode); }}
                            className={`text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-full border transition-all shadow-sm ${isComparisonMode ? 'bg-gem-100 dark:bg-gem-900/30 text-gem-700 dark:text-gem-400 border-gem-500' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-slate-500'}`}
                        >
                            {isComparisonMode ? 'VS Mode Active' : 'Enable Comparison'}
                        </button>
                    </div>

                    <div className={`grid gap-8 ${isComparisonMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        <StockSelector 
                            label={isComparisonMode ? "Security A (Baseline)" : "Select Security by Sector"}
                            onSelect={setSelectedStock} 
                            selectedStock={selectedStock} 
                            isComparison={isComparisonMode}
                        />
                        
                        {isComparisonMode && (
                        <div className="relative">
                            <div className="hidden md:flex absolute top-1/2 -left-4 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 items-center justify-center text-xs font-bold text-gem-500 shadow-sm">VS</div>
                            <StockSelector 
                                label="Security B (Challenger)"
                                onSelect={setComparisonStock} 
                                selectedStock={comparisonStock} 
                                isComparison={isComparisonMode}
                            />
                        </div>
                        )}
                    </div>
                    
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={handleAnalyze}
                            disabled={!selectedStock || (isComparisonMode && !comparisonStock) || status === AnalysisStatus.ANALYZING}
                            className={`
                                w-full md:w-auto px-12 py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 shadow-lg border border-transparent
                                ${(!selectedStock || (isComparisonMode && !comparisonStock) || status === AnalysisStatus.ANALYZING)
                                    ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none' 
                                    : 'bg-gradient-to-r from-gem-600 to-gem-500 text-white hover:shadow-xl hover:scale-[1.02] hover:shadow-gem-500/30'
                                }
                            `}
                        >
                            {status === AnalysisStatus.ANALYZING 
                            ? 'Processing Live Data...' 
                            : (isComparisonMode ? 'Compare Securities' : 'Analyze Security')
                            }
                        </button>
                    </div>
                </div>

                {/* Recent Searches */}
                {!isComparisonMode && (
                    <RecentSearches searches={recentSearches} onSelect={handleSelectRecent} />
                )}

                {status === AnalysisStatus.ERROR && (
                    <div className="mt-8 text-center animate-fade-in w-full max-w-2xl mx-auto">
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/50 p-6 shadow-lg">
                             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                             </div>
                             <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">Analysis Interrupted</h3>
                             <p className="text-red-700 dark:text-red-400 text-sm mb-6">
                                We couldn't complete the financial analysis. This is usually due to a network timeout or an issue with the data stream.
                             </p>
                             <button 
                                onClick={handleAnalyze}
                                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-colors flex items-center gap-2 mx-auto"
                             >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Retry Analysis
                             </button>
                        </div>
                    </div>
                )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 relative z-10 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
             <div className="flex items-center gap-2">
                 <Logo className="w-6 h-6 grayscale opacity-70" />
                 <span className="font-medium text-gray-600 dark:text-gray-400">© 2024 PSX Gem Finder. All rights reserved.</span>
             </div>
             <div className="flex flex-wrap justify-center gap-6">
                 <a href="#" className="hover:text-gem-600 dark:hover:text-gem-400 transition-colors font-medium">Privacy Policy</a>
                 <a href="#" className="hover:text-gem-600 dark:hover:text-gem-400 transition-colors font-medium">Terms of Service</a>
                 <a href="#" className="hover:text-gem-600 dark:hover:text-gem-400 transition-colors font-medium">Disclaimer</a>
             </div>
        </div>
        <div className="container mx-auto px-4 mt-6 text-[10px] text-gray-400 dark:text-gray-500 text-center max-w-3xl mx-auto leading-relaxed">
            <p><strong>Disclaimer:</strong> This application provides financial analysis based on AI-generated insights and public data. It does not constitute professional financial advice. Stock market investments are subject to market risks. Please consult a certified financial advisor before making investment decisions.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;