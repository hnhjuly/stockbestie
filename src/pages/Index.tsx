import { useState, useEffect } from 'react';
import { Stock } from '@/types/stock';
import { StockTable } from '@/components/StockTable';
import { StockDetail } from '@/components/StockDetail';
import { fetchStockData } from '@/lib/googleSheets';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { TickerSearch } from '@/components/TickerSearch';
import { getDeviceId } from '@/lib/deviceId';
import { RobotChatbot } from '@/components/RobotChatbot';
import { PWAInstallButton } from '@/components/PWAInstallButton';

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickers, setTickers] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadTickersFromDB = async () => {
    try {
      const deviceId = getDeviceId();
      const { data, error } = await supabase
        .from('tickers')
        .select('ticker')
        .eq('user_id', deviceId)
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
    console.log('loadStocks called with tickers:', tickers, 'includeAnalystPrediction:', includeAnalystPrediction);
    
    if (tickers.length === 0) {
      console.log('No tickers to load');
      setStocks([]);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      setIsRefreshing(true);
      console.log('Fetching stock data for:', tickers);
      const data = await fetchStockData(tickers, includeAnalystPrediction);
      console.log('Stock data received:', data);
      setStocks(data);
      setLastUpdated(new Date());
      if (showToast) {
        toast.success('Stock data refreshed successfully');
      }
    } catch (error: any) {
      console.error('Error loading stocks:', error);
      // Check for rate limiting error
      if (error?.message?.includes('rate limit') || error?.context?.rateLimited) {
        toast.error('Rate limit reached. Please wait 30 seconds before refreshing.');
      } else {
        toast.error('Failed to fetch stock data. Please try refreshing.');
      }
      // Set empty stocks on error to show empty state instead of infinite loading
      setStocks([]);
    } finally {
      console.log('loadStocks completed, setting loading to false');
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleTickerAdded = async (ticker: string) => {
    // Optimistically update UI - add ticker immediately
    setTickers(prev => [ticker, ...prev]);
  };

  const removeTicker = async (ticker: string) => {
    try {
      const deviceId = getDeviceId();
      const { error } = await supabase
        .from('tickers')
        .delete()
        .eq('ticker', ticker)
        .eq('user_id', deviceId);
      
      if (error) throw error;
      
      // Reload tickers from database to ensure accurate state
      await loadTickersFromDB();
      toast.success(`${ticker} removed`);
    } catch (error) {
      console.error('Failed to remove ticker:', error);
      toast.error('Failed to remove ticker from database');
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      const tickerList = await loadTickersFromDB();
      console.log('Loaded tickers from DB:', tickerList);
      
      if (tickerList.length === 0) {
        console.log('No tickers found, inserting defaults');
        // Insert default tickers if database is empty for this device
        const defaultTickers = ['NVDA', 'TSLA', 'AAPL'];
        const deviceId = getDeviceId();
        try {
          const { error } = await supabase
            .from('tickers')
            .insert(defaultTickers.map(ticker => ({ ticker, user_id: deviceId })));
          
          if (error) {
            console.error('Error inserting default tickers:', error);
            throw error;
          }
          
          console.log('Default tickers inserted successfully');
          setTickers(defaultTickers);
        } catch (error) {
          console.error('Failed to insert default tickers:', error);
          toast.error('Failed to initialize default stocks');
          setIsLoading(false);
        }
      } else {
        // If tickers loaded from DB, we still need to turn off loading
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    console.log('Tickers changed:', tickers);
    if (tickers.length > 0) {
      console.log('Loading stocks for tickers:', tickers);
      loadStocks();
    } else {
      console.log('No tickers yet, skipping load');
    }
  }, [tickers]);

  // Auto-refresh every 30 seconds - only fetch Yahoo Finance data, no AI
  useEffect(() => {
    if (tickers.length === 0) return;

    const interval = setInterval(() => {
      loadStocks(false, false); // Don't show toast, don't include AI predictions
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [tickers]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="p-1 md:p-2 flex-shrink-0">
                <img 
                  src={stockBestieLogo} 
                  alt="Stock Bestie Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-contain logo-float" 
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold truncate">Stock Bestie</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Real-time stock market buddy by Hanah July</p>
              </div>
            </div>
            <Button
              onClick={() => loadStocks(true, false)}
              disabled={isRefreshing}
              variant="outline"
              className="gap-2 flex-shrink-0 hover-glow"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Ticker Management */}
        <div className="mb-4 md:mb-6 space-y-4">
          <PWAInstallButton />
          <TickerSearch
            existingTickers={tickers}
            onTickerAdded={handleTickerAdded}
          />
          
          {tickers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker, index) => (
                <div
                  key={ticker}
                  className={`flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium touch-manipulation ticker-badge opacity-0 animate-scale-in stagger-${Math.min(index + 1, 10)}`}
                >
                  {ticker}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTicker(ticker); }}
                    className="hover:bg-primary/20 rounded-full p-1 transition-colors"
                    aria-label={`Remove ${ticker}`}
                  >
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
              <p className="text-muted-foreground">Loading companies... You may add more to your Stock Bestie</p>
            </div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading companies... You may add more to your Stock Bestie</p>
            </div>
          </div>
        ) : (
            <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Stock Portfolio</h2>
                <p className="text-sm text-muted-foreground">
                  Tracking {stocks.length} stocks • Click any row for details
                  {lastUpdated && (
                    <span className="ml-2">
                      • Updated {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <StockTable stocks={stocks} onStockClick={setSelectedStock} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 pb-6 border-t">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Disclaimer:</strong> Information displayed on Stock Bestie is for educational and informational purposes only and should not be considered financial or investment advice.
              Market data and analyst ratings are sourced from Yahoo Finance and other public APIs and may be delayed or inaccurate.
              Always do your own research or consult a licensed financial advisor before making investment decisions.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 Stock Bestie. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      {/* Detail Dialog */}
      <StockDetail
        stock={selectedStock}
        open={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      />

      {/* Robot Chatbot */}
      <RobotChatbot />
    </div>
  );
};

export default Index;
