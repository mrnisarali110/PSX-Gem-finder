import { Stock } from './types';

// Simulating the psx-data-reader output for popular KSE-100 stocks
export const MOCK_PSX_STOCKS: Stock[] = [
  // --- Commercial Banks ---
  { symbol: 'MEBL', name: 'Meezan Bank Limited', sector: 'Commercial Banks', price: 265.50, lastUpdated: '2025-02-27' },
  { symbol: 'MCB', name: 'MCB Bank Limited', sector: 'Commercial Banks', price: 235.25, lastUpdated: '2025-02-27' },
  { symbol: 'UBL', name: 'United Bank Limited', sector: 'Commercial Banks', price: 240.80, lastUpdated: '2025-02-27' },
  { symbol: 'HBL', name: 'Habib Bank Limited', sector: 'Commercial Banks', price: 122.40, lastUpdated: '2025-02-27' },
  { symbol: 'BAHL', name: 'Bank Al Habib', sector: 'Commercial Banks', price: 98.60, lastUpdated: '2025-02-27' },
  { symbol: 'FABL', name: 'Faysal Bank Limited', sector: 'Commercial Banks', price: 45.30, lastUpdated: '2025-02-27' },
  { symbol: 'BAFL', name: 'Bank Alfalah', sector: 'Commercial Banks', price: 62.15, lastUpdated: '2025-02-27' },
  { symbol: 'AKBL', name: 'Askari Bank', sector: 'Commercial Banks', price: 24.50, lastUpdated: '2025-02-27' },
  { symbol: 'NBP', name: 'National Bank of Pakistan', sector: 'Commercial Banks', price: 42.10, lastUpdated: '2025-02-27' },

  // --- Oil & Gas Exploration ---
  { symbol: 'OGDC', name: 'Oil & Gas Development Company', sector: 'Oil & Gas Exploration', price: 145.25, lastUpdated: '2025-02-27' },
  { symbol: 'PPL', name: 'Pakistan Petroleum Limited', sector: 'Oil & Gas Exploration', price: 132.60, lastUpdated: '2025-02-27' },
  { symbol: 'MARI', name: 'Mari Petroleum', sector: 'Oil & Gas Exploration', price: 3150.00, lastUpdated: '2025-02-27' },
  { symbol: 'POL', name: 'Pakistan Oilfields', sector: 'Oil & Gas Exploration', price: 425.40, lastUpdated: '2025-02-27' },

  // --- Fertilizer ---
  { symbol: 'ENGRO', name: 'Engro Corporation', sector: 'Fertilizer', price: 365.75, lastUpdated: '2025-02-27' },
  { symbol: 'EFERT', name: 'Engro Fertilizers', sector: 'Fertilizer', price: 175.30, lastUpdated: '2025-02-27' },
  { symbol: 'FFC', name: 'Fauji Fertilizer Company', sector: 'Fertilizer', price: 210.90, lastUpdated: '2025-02-27' },
  { symbol: 'FATIMA', name: 'Fatima Fertilizer', sector: 'Fertilizer', price: 62.40, lastUpdated: '2025-02-27' },
  { symbol: 'FFBL', name: 'Fauji Fertilizer Bin Qasim', sector: 'Fertilizer', price: 34.20, lastUpdated: '2025-02-27' },

  // --- Cement ---
  { symbol: 'LUCK', name: 'Lucky Cement Limited', sector: 'Cement', price: 920.50, lastUpdated: '2025-02-27' },
  { symbol: 'DGKC', name: 'D.G. Khan Cement', sector: 'Cement', price: 78.15, lastUpdated: '2025-02-27' },
  { symbol: 'MLCF', name: 'Maple Leaf Cement', sector: 'Cement', price: 42.40, lastUpdated: '2025-02-27' },
  { symbol: 'CHCC', name: 'Cherat Cement', sector: 'Cement', price: 175.20, lastUpdated: '2025-02-27' },
  { symbol: 'PIOC', name: 'Pioneer Cement', sector: 'Cement', price: 135.50, lastUpdated: '2025-02-27' },
  { symbol: 'FCCL', name: 'Fauji Cement Company', sector: 'Cement', price: 22.75, lastUpdated: '2025-02-27' },
  { symbol: 'KOHC', name: 'Kohat Cement', sector: 'Cement', price: 215.00, lastUpdated: '2025-02-27' },

  // --- Technology & Communication ---
  { symbol: 'SYS', name: 'Systems Limited', sector: 'Technology', price: 410.10, lastUpdated: '2025-02-27' },
  { symbol: 'TRG', name: 'TRG Pakistan', sector: 'Technology', price: 55.50, lastUpdated: '2025-02-27' },
  { symbol: 'AIRLINK', name: 'Air Link Communication', sector: 'Technology', price: 72.90, lastUpdated: '2025-02-27' },
  { symbol: 'AVN', name: 'Avanceon Limited', sector: 'Technology', price: 52.25, lastUpdated: '2025-02-27' },
  { symbol: 'NETSOL', name: 'NetSol Technologies', sector: 'Technology', price: 125.75, lastUpdated: '2025-02-27' },
  { symbol: 'PTC', name: 'Pakistan Telecommunication', sector: 'Technology', price: 12.40, lastUpdated: '2025-02-27' },
  { symbol: 'OCTOPUS', name: 'Octopus Digital', sector: 'Technology', price: 45.60, lastUpdated: '2025-02-27' },

  // --- Power Generation & Distribution ---
  { symbol: 'HUBC', name: 'Hub Power Company', sector: 'Power Generation', price: 135.40, lastUpdated: '2025-02-27' },
  { symbol: 'KAPCO', name: 'Kot Addu Power', sector: 'Power Generation', price: 32.50, lastUpdated: '2025-02-27' },
  { symbol: 'LPL', name: 'Lalpir Power', sector: 'Power Generation', price: 34.10, lastUpdated: '2025-02-27' },
  { symbol: 'NCPL', name: 'Nishat Chunian Power', sector: 'Power Generation', price: 28.30, lastUpdated: '2025-02-27' },
  { symbol: 'KEL', name: 'K-Electric', sector: 'Power Generation', price: 4.85, lastUpdated: '2025-02-27' },

  // --- Oil & Gas Marketing ---
  { symbol: 'PSO', name: 'Pakistan State Oil', sector: 'Oil & Gas Marketing', price: 185.30, lastUpdated: '2025-02-27' },
  { symbol: 'SHEL', name: 'Shell Pakistan', sector: 'Oil & Gas Marketing', price: 165.20, lastUpdated: '2025-02-27' },
  { symbol: 'APL', name: 'Attock Petroleum', sector: 'Oil & Gas Marketing', price: 410.00, lastUpdated: '2025-02-27' },
  { symbol: 'HASCOL', name: 'Hascol Petroleum', sector: 'Oil & Gas Marketing', price: 8.50, lastUpdated: '2025-02-27' },

  // --- Refinery ---
  { symbol: 'ATRL', name: 'Attock Refinery', sector: 'Refinery', price: 340.50, lastUpdated: '2025-02-27' },
  { symbol: 'NRL', name: 'National Refinery', sector: 'Refinery', price: 260.00, lastUpdated: '2025-02-27' },
  { symbol: 'PRL', name: 'Pakistan Refinery', sector: 'Refinery', price: 28.40, lastUpdated: '2025-02-27' },
  { symbol: 'CNERGY', name: 'Cnergyico PK', sector: 'Refinery', price: 4.25, lastUpdated: '2025-02-27' },

  // --- Textile Composite ---
  { symbol: 'ILP', name: 'Interloop Limited', sector: 'Textile Composite', price: 68.50, lastUpdated: '2025-02-27' },
  { symbol: 'NML', name: 'Nishat Mills', sector: 'Textile Composite', price: 82.30, lastUpdated: '2025-02-27' },
  { symbol: 'GATM', name: 'Gul Ahmed Textile', sector: 'Textile Composite', price: 24.60, lastUpdated: '2025-02-27' },
  { symbol: 'KTML', name: 'Kohinoor Textile', sector: 'Textile Composite', price: 75.10, lastUpdated: '2025-02-27' },
  { symbol: 'FASM', name: 'Faisal Spinning', sector: 'Textile Composite', price: 420.00, lastUpdated: '2025-02-27' },

  // --- Pharmaceuticals ---
  { symbol: 'SEARL', name: 'The Searle Company', sector: 'Pharmaceuticals', price: 58.40, lastUpdated: '2025-02-27' },
  { symbol: 'ABOT', name: 'Abbott Laboratories', sector: 'Pharmaceuticals', price: 480.00, lastUpdated: '2025-02-27' },
  { symbol: 'AGP', name: 'AGP Limited', sector: 'Pharmaceuticals', price: 115.20, lastUpdated: '2025-02-27' },
  { symbol: 'HINOON', name: 'Highnoon Laboratories', sector: 'Pharmaceuticals', price: 650.50, lastUpdated: '2025-02-27' },
  { symbol: 'GLAXO', name: 'GlaxoSmithKline', sector: 'Pharmaceuticals', price: 145.00, lastUpdated: '2025-02-27' },

  // --- Automobile Assembler ---
  { symbol: 'SAZEW', name: 'Sazgar Engineering', sector: 'Automobile Assembler', price: 920.15, lastUpdated: '2025-02-27' },
  { symbol: 'INDU', name: 'Indus Motor Company', sector: 'Automobile Assembler', price: 1650.00, lastUpdated: '2025-02-27' },
  { symbol: 'MTL', name: 'Millat Tractors', sector: 'Automobile Assembler', price: 610.50, lastUpdated: '2025-02-27' },
  { symbol: 'HCAR', name: 'Honda Atlas Cars', sector: 'Automobile Assembler', price: 310.30, lastUpdated: '2025-02-27' },
  { symbol: 'PSMC', name: 'Pak Suzuki Motor', sector: 'Automobile Assembler', price: 650.00, lastUpdated: '2025-02-27' },

  // --- Food & Personal Care ---
  { symbol: 'UNITY', name: 'Unity Foods', sector: 'Food & Personal Care', price: 24.50, lastUpdated: '2025-02-27' },
  { symbol: 'FCEPL', name: 'FrieslandCampina Engro', sector: 'Food & Personal Care', price: 110.00, lastUpdated: '2025-02-27' },
  { symbol: 'NESTLE', name: 'Nestle Pakistan', sector: 'Food & Personal Care', price: 7200.00, lastUpdated: '2025-02-27' },
  { symbol: 'PREMA', name: 'At-Tahur Limited', sector: 'Food & Personal Care', price: 32.10, lastUpdated: '2025-02-27' },
  { symbol: 'NATF', name: 'National Foods', sector: 'Food & Personal Care', price: 145.50, lastUpdated: '2025-02-27' },

  // --- Chemicals ---
  { symbol: 'EPCL', name: 'Engro Polymer', sector: 'Chemicals', price: 45.60, lastUpdated: '2025-02-27' },
  { symbol: 'LOTCHEM', name: 'Lotte Chemical', sector: 'Chemicals', price: 28.90, lastUpdated: '2025-02-27' },
  { symbol: 'COLG', name: 'Colgate-Palmolive', sector: 'Chemicals', price: 1450.00, lastUpdated: '2025-02-27' },
  { symbol: 'ICI', name: 'Lucky Core Industries', sector: 'Chemicals', price: 850.00, lastUpdated: '2025-02-27' },

  // --- Engineering & Steel ---
  { symbol: 'ISL', name: 'International Steels', sector: 'Engineering', price: 78.40, lastUpdated: '2025-02-27' },
  { symbol: 'MUGHAL', name: 'Mughal Iron & Steel', sector: 'Engineering', price: 85.20, lastUpdated: '2025-02-27' },
  { symbol: 'ASTL', name: 'Amreli Steels', sector: 'Engineering', price: 25.60, lastUpdated: '2025-02-27' },
  { symbol: 'INIL', name: 'International Industries', sector: 'Engineering', price: 135.00, lastUpdated: '2025-02-27' },
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