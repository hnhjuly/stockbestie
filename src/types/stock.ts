export interface Stock {
  ticker: string;
  companyName: string;
  marketCapRaw: number | null;
  volumeRaw: number | null;
  currentPrice: number;
  priceChangePercent: number;
  peRatio: number | null;
  low52Week: number | null;
  high52Week: number | null;
  eps: number | null;
  asOfTime: string;
  marketCapDisplay: string;
  volumeDisplay: string;
  analystPrediction: string;
}

export type SortField = 'currentPrice' | 'marketCapRaw' | 'priceChangePercent';
export type SortDirection = 'asc' | 'desc';
