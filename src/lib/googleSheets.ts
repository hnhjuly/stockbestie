import { Stock } from '@/types/stock';

// This will need to be configured with your Google Sheets API credentials
// through Lovable Cloud secrets management
const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your Google Sheet ID
const API_KEY = 'YOUR_API_KEY'; // Will be stored in Lovable Cloud secrets

export const fetchStockData = async (tickers: string[]): Promise<Stock[]> => {
  try {
    // For now, return mock data based on provided tickers
    // Replace this with actual Google Sheets API call
    const mockDataMap: Record<string, Partial<Stock>> = {
      'NVDA': {
        companyName: 'NVIDIA Corporation',
        currentPrice: 875.32,
        priceChangePercent: 2.45,
        marketCapRaw: 2800000000000,
        peRatio: 65.3,
        low52Week: 389.52,
        high52Week: 974.21,
        eps: 13.42,
      },
      'NYSE:PLTR': {
        companyName: 'Palantir Technologies Inc.',
        currentPrice: 38.76,
        priceChangePercent: -1.23,
        marketCapRaw: 85000000000,
        peRatio: 189.5,
        low52Week: 15.66,
        high52Week: 45.14,
        eps: 0.20,
      },
      'AAPL': {
        companyName: 'Apple Inc.',
        currentPrice: 189.43,
        priceChangePercent: 0.87,
        marketCapRaw: 3200000000000,
        peRatio: 31.2,
        low52Week: 164.08,
        high52Week: 199.62,
        eps: 6.07,
      },
      'TSLA': {
        companyName: 'Tesla, Inc.',
        currentPrice: 268.92,
        priceChangePercent: 3.12,
        marketCapRaw: 850000000000,
        peRatio: 82.4,
        low52Week: 152.37,
        high52Week: 299.29,
        eps: 3.26,
      },
      'MSFT': {
        companyName: 'Microsoft Corporation',
        currentPrice: 415.67,
        priceChangePercent: -0.45,
        marketCapRaw: 3100000000000,
        peRatio: 38.9,
        low52Week: 309.45,
        high52Week: 468.35,
        eps: 10.68,
      },
      'GOOGL': {
        companyName: 'Alphabet Inc.',
        currentPrice: 142.87,
        priceChangePercent: -1.23,
        marketCapRaw: 1800000000000,
        peRatio: 25.43,
        low52Week: 101.88,
        high52Week: 153.78,
        eps: 5.61,
      },
    };

    const mockStocks: Stock[] = tickers.map(ticker => {
      const baseData = mockDataMap[ticker] || {
        companyName: `${ticker} Company`,
        currentPrice: Math.random() * 500 + 50,
        priceChangePercent: (Math.random() - 0.5) * 10,
        marketCapRaw: Math.random() * 1e12 + 1e11,
        peRatio: Math.random() * 40 + 10,
        low52Week: Math.random() * 200 + 50,
        high52Week: Math.random() * 300 + 200,
        eps: Math.random() * 15 + 1,
      };

      const volumeRaw = Math.random() * 100000000 + 1000000;
      
      return {
        ticker,
        companyName: baseData.companyName!,
        currentPrice: baseData.currentPrice!,
        priceChangePercent: baseData.priceChangePercent!,
        marketCapRaw: baseData.marketCapRaw!,
        marketCapDisplay: baseData.marketCapRaw! >= 1e12 
          ? `${(baseData.marketCapRaw! / 1e12).toFixed(2)} T` 
          : `${(baseData.marketCapRaw! / 1e9).toFixed(2)} B`,
        volumeRaw,
        volumeDisplay: volumeRaw >= 1e9
          ? `${(volumeRaw / 1e9).toFixed(2)} B`
          : volumeRaw >= 1e6
          ? `${(volumeRaw / 1e6).toFixed(2)} M`
          : `${(volumeRaw / 1e3).toFixed(1)} K`,
        peRatio: baseData.peRatio!,
        low52Week: baseData.low52Week!,
        high52Week: baseData.high52Week!,
        eps: baseData.eps!,
        asOfTime: new Date().toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
    });

    return mockStocks;

    /* 
    // Actual Google Sheets API implementation (uncomment when ready):
    const range = 'Sheet1!A2:N'; // Adjust sheet name if needed
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values) return [];
    
    return data.values.map((row: any[]) => ({
      ticker: row[0] || '',
      companyName: row[1] || '',
      marketCapRaw: parseFloat(row[2]) || 0,
      volumeRaw: parseFloat(row[3]) || 0,
      currentPrice: parseFloat(row[4]) || 0,
      priceChangePercent: parseFloat(row[5]) || 0,
      peRatio: parseFloat(row[6]) || 0,
      low52Week: parseFloat(row[7]) || 0,
      high52Week: parseFloat(row[8]) || 0,
      eps: parseFloat(row[9]) || 0,
      asOfTime: row[10] || '',
      marketCapDisplay: row[12] || '',
      volumeDisplay: row[13] || '',
    }));
    */
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
