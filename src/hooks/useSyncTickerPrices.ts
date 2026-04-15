import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * On mount, checks if the user's tickers have null prices.
 * If so, fetches live data via the edge function and updates the tickers table.
 */
export const useSyncTickerPrices = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const sync = async () => {
      const { data: tickers, error } = await supabase
        .from('tickers')
        .select('ticker, price')
        .eq('auth_user_id', user.id);

      if (error || !tickers || tickers.length === 0) return;

      // Check if any ticker is missing a price
      const needsSync = tickers.some(t => t.price == null);
      if (!needsSync) return;

      const tickerSymbols = tickers.map(t => t.ticker);

      try {
        const { data, error: fetchError } = await supabase.functions.invoke('fetch-stock-data', {
          body: { tickers: tickerSymbols, includeAnalystPrediction: false },
        });

        if (fetchError || !data?.stocks) return;

        for (const stock of data.stocks) {
          await supabase
            .from('tickers')
            .update({
              price: stock.currentPrice ?? stock.price,
              change_percent: stock.priceChangePercent ?? stock.changePercent,
              company: stock.companyName ?? stock.company,
              market_cap: stock.marketCapRaw ?? stock.marketCap,
              volume: stock.volumeRaw ?? stock.volume,
              pe_ratio: stock.peRatio,
              low52: stock.low52Week ?? stock.low52,
              high52: stock.high52Week ?? stock.high52,
              updated_at: new Date().toISOString(),
            })
            .eq('ticker', stock.ticker ?? stock.symbol)
            .eq('auth_user_id', user.id);
        }
      } catch (e) {
        console.error('Failed to sync ticker prices:', e);
      }
    };

    sync();
  }, [user]);
};
