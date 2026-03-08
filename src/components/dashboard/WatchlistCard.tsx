import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WatchlistStock {
  ticker: string;
  company: string;
  price: string;
  change: string;
  up: boolean;
  color: string;
}

const watchlistData: WatchlistStock[] = [
  { ticker: 'AAPL', company: 'Apple Inc.', price: '$228.40', change: '+3.21%', up: true, color: 'hsl(210 80% 82%)' },
  { ticker: 'NVDA', company: 'NVIDIA Corp.', price: '$873.15', change: '−1.84%', up: false, color: 'hsl(100 50% 50%)' },
  { ticker: 'TSLA', company: 'Tesla, Inc.', price: '$241.77', change: '+0.98%', up: true, color: 'hsl(45 96% 50%)' },
  { ticker: 'GOOGL', company: 'Alphabet Inc.', price: '$182.06', change: '+1.47%', up: true, color: 'hsl(217 89% 61%)' },
  { ticker: 'AMZN', company: 'Amazon.com', price: '$198.44', change: '+0.62%', up: true, color: 'hsl(33 100% 50%)' },
  { ticker: 'MSFT', company: 'Microsoft Corp.', price: '$410.82', change: '+2.11%', up: true, color: 'hsl(207 89% 52%)' },
  { ticker: 'SPY', company: 'S&P 500 ETF', price: '$578.30', change: '+0.43%', up: true, color: 'hsl(130 60% 90%)' },
  { ticker: 'META', company: 'Meta Platforms', price: '$611.22', change: '−0.78%', up: false, color: 'hsl(217 85% 65%)' },
];

export const WatchlistCard = () => {
  const navigate = useNavigate();

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

      <div className="space-y-0 max-h-[420px] overflow-y-auto scrollbar-hide">
        {watchlistData.map((stock) => (
          <div
            key={stock.ticker}
            className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50 rounded transition-all px-1 -mx-1"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                style={{ background: stock.color, color: '#0a0b0f' }}
              >
                {stock.ticker.slice(0, 2)}
              </div>
              <div>
                <div className="text-[13px] font-medium">{stock.ticker}</div>
                <div className="text-[10px] font-mono text-muted-foreground">{stock.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-mono font-medium">{stock.price}</div>
              <div className={`text-[10px] font-mono px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                stock.up ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                {stock.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
