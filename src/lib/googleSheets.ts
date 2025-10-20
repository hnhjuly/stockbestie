import { Stock } from '@/types/stock';
import { supabase } from '@/integrations/supabase/client';

export const fetchStockData = async (tickers: string[]): Promise<Stock[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
      body: { tickers },
    });

    if (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }

    const stocks = data.stocks || [];
    
    // Sort stocks to match the order of tickers array (newest first)
    return stocks.sort((a: Stock, b: Stock) => {
      const indexA = tickers.indexOf(a.ticker);
      const indexB = tickers.indexOf(b.ticker);
      return indexA - indexB;
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
