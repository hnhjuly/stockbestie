import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Stock } from '@/types/stock';
import { StockTable } from '@/components/StockTable';
import { StockDetail } from '@/components/StockDetail';
import { fetchStockData } from '@/lib/googleSheets';
import { Button } from '@/components/ui/button';
import { RefreshCw, X, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { TickerSearch } from '@/components/TickerSearch';
import { useAuth } from '@/contexts/AuthContext';
import { RobotChatbot } from '@/components/RobotChatbot';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { BottomNav } from '@/components/BottomNav';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from '@/components/PullToRefreshIndicator';

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickers, setTickers] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user, signOut } = useAuth();

  const loadTickersFromDB = async () => {
    if (!user) return [];
    try {
      const { data, error } = await supabase
        .from('tickers')
        .select('ticker')
        .eq('auth_user_id', user.id)
        .order('added_at', { ascending: false });
      if (error) throw error;
      const tickerList = data?.map(t => t.ticker) || [];
      setTickers(tickerList);
      return tickerList;
    } catch (error) {
      console.error('Failed to load tickers:', error);
      toast.error('Failed to load tickers from database');
      return [];
    }
  };

  const loadStocks = async (showToast = false, includeAnalystPrediction = true) => {
    if (tickers.length === 0) {
      setStocks([]);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }
    try {
      setIsRefreshing(true);
      const data = await fetchStockData(tickers, includeAnalystPrediction);
      setStocks(data);
      setLastUpdated(new Date());
      if (showToast) toast.success('Stock data refreshed successfully');
    } catch (error: any) {
      if (error?.message?.includes('rate limit') || error?.context?.rateLimited) {
        toast.error('Rate limit reached. Please wait 30 seconds before refreshing.');
      } else {
        toast.error('Failed to fetch stock data. Please try refreshing.');
      }
      setStocks([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleTickerAdded = async (ticker: string) => {
    setTickers(prev => [ticker, ...prev]);
  };

  const removeTicker = async (ticker: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('tickers')
        .delete()
        .eq('ticker', ticker)
        .eq('auth_user_id', user.id);
      if (error) throw error;
      await loadTickersFromDB();
      toast.success(`${ticker} removed`);
    } catch (error) {
      console.error('Failed to remove ticker:', error);
      toast.error('Failed to remove ticker from database');
    }
  };

  useEffect(() => {
    if (!user) return;
    const initializeApp = async () => {
      const tickerList = await loadTickersFromDB();
      if (tickerList.length === 0) {
        const defaultTickers = ['NVDA', 'TSLA', 'AAPL'];
        try {
          const { error } = await supabase
            .from('tickers')
            .insert(defaultTickers.map(ticker => ({
              ticker,
              auth_user_id: user.id,
            })));
          if (error) throw error;
          setTickers(defaultTickers);
        } catch (error) {
          console.error('Failed to insert default tickers:', error);
          toast.error('Failed to initialize default stocks');
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, [user]);

  useEffect(() => {
    if (tickers.length > 0) {
      loadStocks();
    }
  }, [tickers]);

  useEffect(() => {
    if (tickers.length === 0) return;
    const interval = setInterval(() => {
      loadStocks(false, false);
    }, 30000);
    return () => clearInterval(interval);
  }, [tickers]);

  const handlePullRefresh = useCallback(async () => {
    await loadStocks(true, false);
  }, [tickers]);

  const { isPWA, pullDistance, isRefreshing: isPullRefreshing, threshold } = usePullToRefresh(handlePullRefresh);

  return (
    <div className="min-h-screen bg-background pb-20">
      {isPWA && <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isPullRefreshing} threshold={threshold} />}
      
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="p-1 md:p-2 flex-shrink-0">
                <img src={stockBestieLogo} alt="Stock Bestie Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain logo-float" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold truncate">Stock Bestie</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate flex items-center gap-1">
                  Hey {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]} <Icon icon="fxemoji:wavinghand" className="w-4 h-4 inline-block" />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => loadStocks(true, false)} disabled={isRefreshing} variant="outline" className="gap-2 flex-shrink-0 hover-glow" size="sm">
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button onClick={signOut} variant="ghost" size="sm" className="flex-shrink-0">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6 space-y-4">
          <PWAInstallButton />
          <TickerSearch existingTickers={tickers} onTickerAdded={handleTickerAdded} />
          
          {tickers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker, index) => (
                <div key={ticker} className={`flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium touch-manipulation ticker-badge animate-scale-in stagger-${Math.min(index + 1, 10)}`}>
                  {ticker}
                  <button onClick={e => { e.stopPropagation(); removeTicker(ticker); }} className="hover:bg-primary/20 rounded-full p-1 transition-colors" aria-label={`Remove ${ticker}`}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 animate-fade-in">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading companies...</p>
            </div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="flex items-center justify-center py-20 animate-fade-in">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading companies...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Stock Portfolio</h2>
                <p className="text-sm text-muted-foreground">
                  Tracking {stocks.length} stocks • Click any row for details
                  {lastUpdated && <span className="ml-2">• Updated {lastUpdated.toLocaleTimeString()}</span>}
                </p>
              </div>
            </div>
            <StockTable stocks={stocks} onStockClick={setSelectedStock} />
          </div>
        )}

        <footer className="mt-12 pt-8 pb-6 border-t">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Disclaimer:</strong> Stock Bestie is for educational purposes only and does not provide financial or investment advice.
            </p>
            <p className="text-xs text-muted-foreground">© 2025 Stock Bestie. All rights reserved.</p>
          </div>
        </footer>
      </main>

      <StockDetail stock={selectedStock} open={!!selectedStock} onClose={() => setSelectedStock(null)} />
      <RobotChatbot />
      <BottomNav />
    </div>
  );
};

export default Index;
