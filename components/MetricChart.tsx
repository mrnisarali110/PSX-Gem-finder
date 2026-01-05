import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  defs,
  linearGradient,
  stop
} from 'recharts';
import { AnalysisResult } from '../types';

interface MetricChartProps {
  data: AnalysisResult;
  comparisonData?: AnalysisResult;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-600 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-gray-400 font-mono text-xs mb-2 border-b border-slate-700 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
             <div className="w-2 h-2 rounded-full" style={{backgroundColor: entry.color}}></div>
             <span className="text-sm font-bold text-white">{entry.name}:</span>
             <span className="text-sm font-mono text-gem-400">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MetricChart: React.FC<MetricChartProps> = ({ data, comparisonData }) => {
  // Merge data for comparison if needed
  const chartData = data.financialData.map((item, index) => {
    const compItem = comparisonData?.financialData.find(d => d.year === item.year) || {};
    return {
      year: item.year,
      [`${data.companyName} EPS`]: item.eps,
      [`${comparisonData?.companyName} EPS`]: (compItem as any).eps || null,
    };
  }).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return (
    <div className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
      <h3 className="text-gray-500 dark:text-gray-400 text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-2 font-bold">
        <span className="p-1 bg-gem-500/10 rounded text-gem-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
        </span>
        EPS Growth Vector (5 Years)
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorU" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              {comparisonData && (
                <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `Rs ${value}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5'}} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            
            <Area 
              type="monotone" 
              dataKey={`${data.companyName} EPS`} 
              stroke="#22c55e" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorU)" 
              activeDot={{ r: 6, fill: '#fff', stroke: '#22c55e', strokeWidth: 2 }}
            />
            
            {comparisonData && (
               <Area 
                type="monotone" 
                dataKey={`${comparisonData.companyName} EPS`} 
                stroke="#f59e0b" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorV)" 
                activeDot={{ r: 6, fill: '#fff', stroke: '#f59e0b', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricChart;