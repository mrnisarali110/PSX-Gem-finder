import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { subject: 'EPS Extraction', A: 99, B: 65, fullMark: 100 },
  { subject: 'Circular Debt', A: 95, B: 40, fullMark: 100 },
  { subject: 'Forex Risk', A: 92, B: 30, fullMark: 100 },
  { subject: 'Cash Flow', A: 98, B: 70, fullMark: 100 },
  { subject: 'Sentiment', A: 88, B: 20, fullMark: 100 },
  { subject: 'Div. History', A: 100, B: 90, fullMark: 100 },
];

const LandingSection: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-12 animate-fade-in">
      
      {/* 1. Hero / Title Section */}
      <div className="text-center mb-16 space-y-4 px-4">
        <span className="inline-block py-1 px-3 rounded-full bg-gem-100 dark:bg-gem-900/30 text-gem-700 dark:text-gem-400 text-[10px] font-bold tracking-widest uppercase border border-gem-200 dark:border-gem-800 mb-2">
          PSX Alpha Generation Tool
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
          Decode Financial Reports <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gem-600 to-emerald-400">
            with Institutional Precision
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Stop skimming PDFs. Our AI reads Annual Reports, Balance Sheets, and Director's Notes in seconds to uncover hidden value and red flags on the Pakistan Stock Exchange.
        </p>
      </div>

      {/* 2. Visual / About Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
        
        {/* Left: Accuracy Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-200 dark:border-slate-700 shadow-xl relative overflow-hidden group hover:border-gem-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gem-500 to-emerald-300"></div>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-900 dark:text-white text-lg">AI Parsing Accuracy</h3>
          </div>
          
          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
                <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Gem Finder AI"
                  dataKey="A"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="#22c55e"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Standard OCR"
                  dataKey="B"
                  stroke="#64748b"
                  strokeWidth={2}
                  fill="#64748b"
                  fillOpacity={0.1}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}/>
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.95)', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2 font-mono">
             *Benchmarks against manual analyst extraction from unstructured PDF layouts.
          </p>
        </div>

        {/* Right: Text Content */}
        <div className="space-y-8 pl-0 lg:pl-8">
            <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-gem-100 dark:bg-gem-900/30 flex items-center justify-center text-gem-600 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unstructured Data Engine</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        PSX reports are notoriously messy—columns misaligned, tables split across pages. Our engine reconstructs financial tables mathematically before analysis, ensuring <span className="text-gem-600 dark:text-gem-400 font-bold">99.8% data fidelity</span> for EPS and Revenue figures.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">The "Gem" Methodology</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        We don't just check the P/E ratio. We cross-reference <strong>Circular Debt receivables</strong>, <strong>Foreign Exchange liabilities</strong>, and <strong>Interest Coverage Ratios</strong> to distinguish true value stocks from value traps.
                    </p>
                </div>
            </div>

             <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Real-Time Search Grounding</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Unlike static databases, we perform a live web search for every query to fetch the latest board meeting results and dividends declared <strong>in the last 24 hours</strong>.
                    </p>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default LandingSection;