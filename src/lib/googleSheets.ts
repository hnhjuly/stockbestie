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

    return data.stocks || [];
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
