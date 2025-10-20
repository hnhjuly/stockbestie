export interface Stock {
  ticker: string;
  companyName: string;
  volumeRaw: number | null;
  currentPrice: number | null;
  priceChangePercent: number | null;
  low52Week: number | null;
  high52Week: number | null;
  asOfTime: string;
  volumeDisplay: string;
  low52WeekDisplay: string;
  high52WeekDisplay: string;
  analystPrediction: string;
}

export type SortField = 'currentPrice' | 'priceChangePercent' | 'volumeRaw' | 'low52Week' | 'high52Week';
export type SortDirection = 'asc' | 'desc';
