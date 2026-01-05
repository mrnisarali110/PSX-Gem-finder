export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  lastUpdated: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface FinancialMetric {
  year: string;
  eps: number;
  peRatio: number;
  revenue: number;
}

export interface AnalysisResult {
  markdown: string;
  verdict: 'GEM' | 'WATCH' | 'TRAP' | 'UNKNOWN';
  confidence: number;
  searchInsights?: string;
  financialData: FinancialMetric[];
  companyName?: string; // For identification in comparison
}

export interface WatchlistItem extends AnalysisResult {
  id: string; // usually symbol
  symbol: string;
  savedAt: string;
  priceWhenSaved: number;
}

export interface RecentSearch {
  symbol: string;
  name: string;
  timestamp: string;
  verdict?: string; // Optional, if we cache the result briefly
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  experience: 'Beginner' | 'Intermediate' | 'Pro';
  riskTolerance: 'Low' | 'Medium' | 'High';
}