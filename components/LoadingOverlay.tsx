import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  stockSymbol: string;
  onMinimize: () => void;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ stockSymbol, onMinimize }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const progressTimer = setInterval(() => {
       setProgress((prev) => {
         if (prev >= 95) return prev;
         return prev + (100 / 150); // Rough increment for 15s
       })
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-8 relative">
        
        {/* Minimize Button */}
        <button 
          onClick={onMinimize}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Run in Background
        </button>

        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo Animation */}
          <div className="relative w-24 h-24 mb-8">
             <div className="absolute inset-0 border-2 border-gray-200 dark:border-slate-700 rounded-full"></div>
             <div 
               className="absolute inset-0 border-2 border-gem-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
               style={{ animationDuration: '1s' }}
             ></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl animate-pulse">💎</span>
             </div>
          </div>

          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">
             Analyzing {stockSymbol}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Retrieving live market data and financial statements.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
            <div 
              className="bg-gem-500 h-1.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between w-full text-[10px] font-mono text-gray-400 uppercase tracking-widest">
             <span>Processing...</span>
             <span>Est. {timeLeft}s</span>
          </div>

          {/* Steps */}
          <div className="mt-8 space-y-3 w-full text-left bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
              <div className={`flex items-center gap-3 text-xs font-medium ${progress > 10 ? 'text-gem-600 dark:text-gem-400' : 'text-gray-400'}`}>
                <span className="">{progress > 10 ? '✓' : '•'}</span> Retrieving Annual Reports (2020-2024)
              </div>
              <div className={`flex items-center gap-3 text-xs font-medium ${progress > 40 ? 'text-gem-600 dark:text-gem-400' : 'text-gray-400'}`}>
                <span className="">{progress > 40 ? '✓' : '•'}</span> Calculating Intrinsic Value & EPS
              </div>
              <div className={`flex items-center gap-3 text-xs font-medium ${progress > 70 ? 'text-gem-600 dark:text-gem-400' : 'text-gray-400'}`}>
                <span className="">{progress > 70 ? '✓' : '•'}</span> Assessing Sector Risk & Pulse
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;