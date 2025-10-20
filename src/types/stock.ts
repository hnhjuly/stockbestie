export interface Stock {
  ticker: string;
  companyName: string;
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
}

export type SortField = 'currentPrice' | 'marketCapRaw' | 'priceChangePercent';
export type SortDirection = 'asc' | 'desc';
