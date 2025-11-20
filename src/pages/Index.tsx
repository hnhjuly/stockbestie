import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Stock } from '@/types/stock';
import { StockTable } from '@/components/StockTable';
import { StockDetail } from '@/components/StockDetail';
import { fetchStockData } from '@/lib/googleSheets';
import { Button } from '@/components/ui/button';
import { RefreshCw, X, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';
import { TickerSearch } from '@/components/TickerSearch';
import { useAuth } from "@/hooks/useAuth";
import { RobotChatbot } from '@/components/RobotChatbot';
import { PWAInstallButton } from '@/components/PWAInstallButton';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickers, setTickers] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const loadTickersFromDB = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('tickers')
        .select('ticker')
        .eq('user_id', user.id)
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
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('tickers')
        .delete()
        .eq('ticker', ticker)
        .eq('user_id', user.id);
      
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
    if (!user) return;
    
    const initializeApp = async () => {
      console.log('Initializing app...');
      const tickerList = await loadTickersFromDB();
      console.log('Loaded tickers from DB:', tickerList);
      
      if (tickerList.length === 0) {
        console.log('No tickers found, inserting defaults');
        // Insert default tickers if database is empty for this user
        const defaultTickers = ['NVDA', 'TSLA', 'AAPL'];
        try {
          const { error } = await supabase
            .from('tickers')
            .insert(defaultTickers.map(ticker => ({ ticker, user_id: user.id })));
          
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
  }, [user]);

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
    if (tickers.length === 0 || !user) return;

    const interval = setInterval(() => {
      loadStocks(false, false); // Don't show toast, don't include AI predictions
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [tickers, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleRefresh = async () => {
    await loadStocks(true, true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={stockBestieLogo} 
              alt="Stock Bestie" 
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
            />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Stock Bestie
              </h1>
              {lastUpdated && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              onClick={handleLogout}
              size="sm"
              variant="outline"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <PWAInstallButton />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Track a New Stock</h2>
            <TickerSearch existingTickers={tickers} onTickerAdded={handleTickerAdded} />
          </div>

          {tickers.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Your Tracked Stocks</h2>
              <div className="flex flex-wrap gap-2">
                {tickers.map((ticker) => (
                  <div 
                    key={ticker} 
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {ticker}
                    <button
                      onClick={() => removeTicker(ticker)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${ticker}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading stock data...</p>
            </div>
          ) : stocks.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-12 border border-gray-100 text-center">
              <p className="text-muted-foreground text-lg">
                {tickers.length === 0 
                  ? "Add some tickers to get started!" 
                  : "No stock data available. Please try refreshing."}
              </p>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <StockTable stocks={stocks} onStockClick={setSelectedStock} />
            </div>
          )}
        </div>

        <StockDetail 
          stock={selectedStock} 
          open={!!selectedStock} 
          onClose={() => setSelectedStock(null)}
        />

        <RobotChatbot />

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p className="italic">
            Disclaimer: The information provided is for educational purposes only and should not be considered financial advice.
          </p>
        </div>

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Stock Bestie. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
