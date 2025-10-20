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

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickers, setTickers] = useState<string[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

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

  const loadStocks = async (showToast = false) => {
    if (tickers.length === 0) {
      setStocks([]);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      setIsRefreshing(true);
      const data = await fetchStockData(tickers);
      setStocks(data);
      if (showToast) {
        toast.success('Stock data refreshed successfully');
      }
    } catch (error) {
      toast.error('Failed to fetch stock data');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleTickerAdded = async (ticker: string) => {
    // Reload tickers from database to ensure proper order
    await loadTickersFromDB();
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
      const tickerList = await loadTickersFromDB();
      
      if (tickerList.length === 0) {
        // Insert default tickers if database is empty for this device
        const defaultTickers = ['NVDA', 'TSLA', 'AAPL'];
        const deviceId = getDeviceId();
        try {
          const { error } = await supabase
            .from('tickers')
            .insert(defaultTickers.map(ticker => ({ ticker, user_id: deviceId })));
          
          if (error) throw error;
          
          setTickers(defaultTickers);
        } catch (error) {
          console.error('Failed to insert default tickers:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (tickers.length > 0) {
      loadStocks();
    }
  }, [tickers]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('App installed successfully!');
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="p-1 md:p-2 flex-shrink-0">
                <img src={stockBestieLogo} alt="Stock Bestie Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold truncate">Stock Bestie</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Real-time stock market buddy by Hanah July</p>
              </div>
            </div>
            <Button
              onClick={() => loadStocks(true)}
              disabled={isRefreshing}
              variant="outline"
              className="gap-2 flex-shrink-0"
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
          {showInstallButton && (
            <div className="flex justify-center mb-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleInstallClick}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                Get Stock Bestie App now!
              </Button>
            </div>
          )}
          
          <TickerSearch 
            existingTickers={tickers}
            onTickerAdded={handleTickerAdded}
          />
          
          {tickers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker) => (
                <div
                  key={ticker}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium touch-manipulation"
                >
                  {ticker}
                  <button
                    onClick={() => removeTicker(ticker)}
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
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading stock data...</p>
            </div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No stocks found. Add companies to your Stock Bestie.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Stock Portfolio</h2>
                <p className="text-sm text-muted-foreground">
                  Tracking {stocks.length} stocks • Click any row for details
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
    </div>
  );
};

export default Index;
