import { Stock } from '@/types/stock';

// This will need to be configured with your Google Sheets API credentials
// through Lovable Cloud secrets management
const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your Google Sheet ID
const API_KEY = 'YOUR_API_KEY'; // Will be stored in Lovable Cloud secrets

export const fetchStockData = async (): Promise<Stock[]> => {
  try {
    // For now, return mock data. Once Lovable Cloud is set up,
    // replace this with actual Google Sheets API call
    const mockStocks: Stock[] = [
      {
        ticker: 'NVDA',
        companyName: 'NVIDIA Corporation',
        marketCapRaw: 2800000000000,
        volumeRaw: 45230000,
        currentPrice: 875.32,
        priceChangePercent: 2.45,
        peRatio: 65.3,
        low52Week: 389.52,
        high52Week: 974.21,
        eps: 13.42,
        asOfTime: '2025-10-20 14:35',
        marketCapDisplay: '2.80 T',
        volumeDisplay: '45.23 M',
      },
      {
        ticker: 'NYSE:PLTR',
        companyName: 'Palantir Technologies Inc.',
        marketCapRaw: 85000000000,
        volumeRaw: 38540000,
        currentPrice: 38.76,
        priceChangePercent: -1.23,
        peRatio: 189.5,
        low52Week: 15.66,
        high52Week: 45.14,
        eps: 0.20,
        asOfTime: '2025-10-20 14:35',
        marketCapDisplay: '85.00 B',
        volumeDisplay: '38.54 M',
      },
      {
        ticker: 'AAPL',
        companyName: 'Apple Inc.',
        marketCapRaw: 3200000000000,
        volumeRaw: 52340000,
        currentPrice: 189.43,
        priceChangePercent: 0.87,
        peRatio: 31.2,
        low52Week: 164.08,
        high52Week: 199.62,
        eps: 6.07,
        asOfTime: '2025-10-20 14:35',
        marketCapDisplay: '3.20 T',
        volumeDisplay: '52.34 M',
      },
      {
        ticker: 'TSLA',
        companyName: 'Tesla, Inc.',
        marketCapRaw: 850000000000,
        volumeRaw: 115680000,
        currentPrice: 268.92,
        priceChangePercent: 3.12,
        peRatio: 82.4,
        low52Week: 152.37,
        high52Week: 299.29,
        eps: 3.26,
        asOfTime: '2025-10-20 14:35',
        marketCapDisplay: '850.00 B',
        volumeDisplay: '115.68 M',
      },
      {
        ticker: 'MSFT',
        companyName: 'Microsoft Corporation',
        marketCapRaw: 3100000000000,
        volumeRaw: 28450000,
        currentPrice: 415.67,
        priceChangePercent: -0.45,
        peRatio: 38.9,
        low52Week: 309.45,
        high52Week: 468.35,
        eps: 10.68,
        asOfTime: '2025-10-20 14:35',
        marketCapDisplay: '3.10 T',
        volumeDisplay: '28.45 M',
      },
    ];

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
