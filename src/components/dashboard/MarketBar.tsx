import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MarketIndex {
  name: string;
  value: string;
  change: string;
  up: boolean;
}

const MARKET_TICKERS = [
  { ticker: 'SPY', name: 'S&P 500' },
  { ticker: 'QQQ', name: 'NASDAQ' },
  { ticker: 'DIA', name: 'DOW' },
];

export const MarketBar = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
          body: { tickers: MARKET_TICKERS.map(t => t.ticker), includeAnalystPrediction: false },
        });

        if (error) throw error;

        const stocks = data?.stocks || data || [];
        const results: MarketIndex[] = stocks.map((stock: any, i: number) => ({
          name: MARKET_TICKERS[i]?.name || stock.ticker,
          value: stock.price != null ? `$${Number(stock.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—',
          change: stock.changePercent != null ? `${stock.changePercent >= 0 ? '+' : ''}${Number(stock.changePercent).toFixed(2)}%` : '—',
          up: (stock.changePercent ?? 0) >= 0,
        }));

        setIndices(results);
      } catch (err) {
        console.error('MarketBar fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-3 px-4 bg-card border border-border rounded-xl">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground mr-2" />
        <span className="text-[11px] font-mono text-muted-foreground">Loading market data…</span>
      </div>
    );
  }

  if (indices.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex gap-5 overflow-x-auto py-2.5 px-4 bg-card border border-border rounded-xl items-center scrollbar-hide"
    >
      {indices.map((idx, i) => (
        <div key={idx.name} className="flex items-center gap-2 whitespace-nowrap">
          {i > 0 && <div className="w-px h-4 bg-border flex-shrink-0 -ml-3 mr-0" />}
          <span className="text-[11px] font-mono text-muted-foreground">{idx.name}</span>
          <span className="text-xs font-mono font-medium text-foreground">{idx.value}</span>
          <span className={`text-[10px] font-mono ${idx.up ? 'text-success' : 'text-destructive'}`}>
            {idx.up ? '▲' : '▼'} {idx.change}
          </span>
        </div>
      ))}
    </motion.div>
  );
};
