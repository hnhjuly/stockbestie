export interface Stock {
  ticker: string;
  companyName: string;
  marketCapRaw: number | null;
  volumeRaw: number;
  currentPrice: number;
  priceChangePercent: number;
  peRatio: number | null;
  forwardPE?: number | null;
  low52Week: number;
  high52Week: number;
  eps: number | null;
  asOfTime: string;
  marketCapDisplay: string;
  volumeDisplay: string;
  peRatioDisplay: string;
  analystPrediction: string;
}

export type SortField = 'currentPrice' | 'marketCapRaw' | 'priceChangePercent';
export type SortDirection = 'asc' | 'desc';
