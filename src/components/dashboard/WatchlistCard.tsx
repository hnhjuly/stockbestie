import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WatchlistStock {
  ticker: string;
  company: string | null;
  price: number | null;
  change_percent: number | null;
}

const tickerColors: Record<string, string> = {
  AAPL: 'hsl(210 80% 82%)',
  NVDA: 'hsl(100 50% 50%)',
  TSLA: 'hsl(45 96% 50%)',
  GOOGL: 'hsl(217 89% 61%)',
  AMZN: 'hsl(33 100% 50%)',
  MSFT: 'hsl(207 89% 52%)',
  META: 'hsl(217 85% 65%)',
  SPY: 'hsl(130 60% 80%)',
};

function getTickerColor(ticker: string): string {
  if (tickerColors[ticker]) return tickerColors[ticker];
  // Generate a consistent color from ticker string
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h} 70% 65%)`;
}

export const WatchlistCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadWatchlist = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tickers')
        .select('ticker, company, price, change_percent')
        .eq('auth_user_id', user.id)
        .order('added_at', { ascending: false });

      if (!error && data) {
        setStocks(data);
      }
      setIsLoading(false);
    };
    loadWatchlist();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-success/10 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-[13px] font-medium text-foreground">My Watchlist</span>
        <button
          onClick={() => navigate('/app')}
          className="w-6 h-6 rounded-md bg-success/10 border border-success/25 text-success flex items-center justify-center hover:bg-success hover:text-background transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : stocks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-muted-foreground mb-2">No tickers yet</p>
          <button onClick={() => navigate('/app')} className="text-xs text-success hover:underline">
            Add your first ticker →
          </button>
        </div>
      ) : (
        <div className="space-y-0 max-h-[420px] overflow-y-auto scrollbar-hide">
          {stocks.map((stock) => {
            const up = (stock.change_percent ?? 0) >= 0;
            return (
              <div
                key={stock.ticker}
                className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50 rounded transition-all px-1 -mx-1"
                onClick={() => navigate('/app')}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                    style={{ background: getTickerColor(stock.ticker), color: '#0a0b0f' }}
                  >
                    {stock.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium">{stock.ticker}</div>
                    <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">
                      {stock.company || stock.ticker}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-mono font-medium">
                    {stock.price != null ? `$${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                  </div>
                  {stock.change_percent != null && (
                    <div className={`text-[10px] font-mono px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                      up ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {up ? '+' : ''}{stock.change_percent.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
