export interface Stock {
  ticker: string;
  companyName: string;
  type: 'stock' | 'etf';
  marketCapRaw: number;
  volumeRaw: number;
  currentPrice: number;
  priceChangePercent: number;
  peRatio: number;
  low52Week: number;
  high52Week: number;
  eps: number;
  asOfTime: string;
  marketCapDisplay: string;
  volumeDisplay: string;
  analystPrediction: string;
  // ETF-specific fields
  netAssets?: number;
  netAssetsDisplay?: string;
  dividendYield?: number;
  expenseRatio?: number;
}

export type SortField = 'currentPrice' | 'marketCapRaw' | 'priceChangePercent' | 'companyName';
export type SortDirection = 'asc' | 'desc';
