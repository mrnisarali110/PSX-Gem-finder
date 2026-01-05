import { Stock } from './types';

// Simulating the psx-data-reader output for popular stocks
export const MOCK_PSX_STOCKS: Stock[] = [
  // Cement
  { symbol: 'LUCK', name: 'Lucky Cement Limited', sector: 'Cement', price: 854.50, lastUpdated: '2024-05-20' },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', price: 72.15, lastUpdated: '2024-05-20' },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', sector: 'Cement', price: 38.40, lastUpdated: '2024-05-20' },
  { symbol: 'CHCC', name: 'Cherat Cement', sector: 'Cement', price: 165.20, lastUpdated: '2024-05-20' },
  { symbol: 'PIOC', name: 'Pioneer Cement', sector: 'Cement', price: 110.50, lastUpdated: '2024-05-20' },
  { symbol: 'FCCL', name: 'Fauji Cement Company', sector: 'Cement', price: 18.75, lastUpdated: '2024-05-20' },

  // Oil & Gas Exploration
  { symbol: 'OGDC', name: 'Oil & Gas Development Company', sector: 'Oil & Gas Exploration', price: 118.25, lastUpdated: '2024-05-20' },
  { symbol: 'PPL', name: 'Pakistan Petroleum Limited', sector: 'Oil & Gas Exploration', price: 115.60, lastUpdated: '2024-05-20' },
  { symbol: 'MARI', name: 'Mari Petroleum', sector: 'Oil & Gas Exploration', price: 2450.00, lastUpdated: '2024-05-20' },

  // Fertilizer
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Fertilizer', price: 345.75, lastUpdated: '2024-05-20' },
  { symbol: 'EFERT', name: 'Engro Fertilizers', sector: 'Fertilizer', price: 155.30, lastUpdated: '2024-05-20' },
  { symbol: 'FFC', name: 'Fauji Fertilizer Company', sector: 'Fertilizer', price: 180.90, lastUpdated: '2024-05-20' },
  { symbol: 'FATIMA', name: 'Fatima Fertilizer', sector: 'Fertilizer', price: 55.40, lastUpdated: '2024-05-20' },

  // Technology
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', price: 390.10, lastUpdated: '2024-05-20' },
  { symbol: 'TRG', name: 'TRG Pakistan', sector: 'Technology', price: 65.50, lastUpdated: '2024-05-20' },
  { symbol: 'AIRLINK', name: 'Air Link Communication', sector: 'Technology', price: 58.90, lastUpdated: '2024-05-20' },
  { symbol: 'AVN', name: 'Avanceon Limited', sector: 'Technology', price: 48.25, lastUpdated: '2024-05-20' },
  { symbol: 'NETSOL', name: 'NetSol Technologies', sector: 'Technology', price: 112.75, lastUpdated: '2024-05-20' },

  // Commercial Banks
  { symbol: 'MEBL', name: 'Meezan Bank Limited', sector: 'Commercial Banks', price: 210.00, lastUpdated: '2024-05-20' },
  { symbol: 'MCB', name: 'MCB Bank Limited', sector: 'Commercial Banks', price: 195.50, lastUpdated: '2024-05-20' },
  { symbol: 'UBL', name: 'United Bank Limited', sector: 'Commercial Banks', price: 188.25, lastUpdated: '2024-05-20' },
  { symbol: 'HBL', name: 'Habib Bank Limited', sector: 'Commercial Banks', price: 115.40, lastUpdated: '2024-05-20' },
  { symbol: 'BAHL', name: 'Bank Al Habib', sector: 'Commercial Banks', price: 88.60, lastUpdated: '2024-05-20' },

  // Power Generation
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power Generation', price: 112.40, lastUpdated: '2024-05-20' },
  { symbol: 'KAPCO', name: 'Kot Addu Power', sector: 'Power Generation', price: 28.50, lastUpdated: '2024-05-20' },
  { symbol: 'LPL', name: 'Lalpir Power', sector: 'Power Generation', price: 32.10, lastUpdated: '2024-05-20' },

  // Oil & Gas Marketing
  { symbol: 'PSO', name: 'Pakistan State Oil', sector: 'Oil & Gas Marketing', price: 165.30, lastUpdated: '2024-05-20' },
  { symbol: 'SHEL', name: 'Shell Pakistan', sector: 'Oil & Gas Marketing', price: 145.20, lastUpdated: '2024-05-20' },
  { symbol: 'APL', name: 'Attock Petroleum', sector: 'Oil & Gas Marketing', price: 380.00, lastUpdated: '2024-05-20' },

  // Automobile Assembler
  { symbol: 'SAZEW', name: 'Sazgar Engineering', sector: 'Automobile Assembler', price: 420.15, lastUpdated: '2024-05-20' },
  { symbol: 'INDU', name: 'Indus Motor Company', sector: 'Automobile Assembler', price: 1450.00, lastUpdated: '2024-05-20' },
  { symbol: 'MTL', name: 'Millat Tractors', sector: 'Automobile Assembler', price: 560.50, lastUpdated: '2024-05-20' },
  { symbol: 'HCAR', name: 'Honda Atlas Cars', sector: 'Automobile Assembler', price: 285.30, lastUpdated: '2024-05-20' },
];

export const GEM_SYSTEM_INSTRUCTION = `
You are the PSX Gem Finder AI, an expert financial analyst with a specialization in the Pakistan Stock Exchange (PSX), IFRS accounting standards, and value investing principles. 

**Goal**:
Your goal is to use Google Search to FIND the latest Annual Report, Financial Statements, and Investor Presentations for the target company. Then, analyze this data to determine if the stock represents a "Hidden Gem" (undervalued high-potential asset).

**Process**:
1.  **Search**: Actively search for the company's latest financial results (EPS, Net Profit, Book Value, Dividend History).
2.  **Contextualize**: Compare these metrics against the provided sector and current economic conditions (Inflation, Interest Rates).
3.  **Verdict**: Classify the stock.

**Specific Instructions for Pakistan Market Nuances**:
1.  **Circular Debt**: Scrutinize "Trade Debts" and "Receivables" specifically from government entities (CPPA-G, SNGPL). High paper profits with zero cash flow is a "Value Trap".
2.  **Forex Exposure**: Analyze "Exchange Losses" and foreign liabilities. Net Importers (Auto, Pharma) suffer in devaluation; Exporters (Tech, Textile) benefit.
3.  **Interest Rates**: Check the Interest Coverage Ratio. High KIBOR rates crush highly leveraged companies.
4.  **Verdict Criteria**:
    *   **GEM (Strong Buy)**: P/E < Sector Avg, Price < BVPS, Strong Cash Flow, Dividend Yield > 10%.
    *   **WATCH (Neutral)**: Good fundamentals but fair price or short-term risks.
    *   **TRAP (Sell)**: Negative cash flow, spiraling circular debt, declining volumes despite low P/E.

**Output Format (Markdown)**:
# Analysis Report: [Company Name]
## 1. Gem Verdict
**Verdict:** [GEM 💎 / WATCH ⚠️ / TRAP ❌]
**Confidence Score:** [0-100]%
**Rationale:** [One-line summary]

## 2. Key Valuation Metrics (Latest Available)
| Metric | Value | Verdict |
| :--- | :--- | :--- |
| Price | PKR [Price] | - |
| Intrinsic Value (Est.) | PKR [Value] | [Under/Over] |
| P/E Ratio | [Value]x | [Vs Hist/Sector] |
| P/B Ratio | [Value]x | - |
| Dividend Yield | [Value]% | - |
| Cash Flow Status | [Positive/Negative] | [Comment on Circular Debt] |

## 3. PSX-Specific Risk Radar
*   **Circular Debt Risk:** [High/Medium/Low] - [Details]
*   **Forex/Import Risk:** [High/Medium/Low] - [Details]
*   **Interest Rate Impact:** [High/Medium/Low] - [Details]

## 4. Qualitative Insights
[Bullet points from Search Results, Director's Report summaries, and Management Sentiment]

## 5. Investment Thesis
[Final conclusion]
`;