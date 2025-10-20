import { useState, useEffect } from 'react';
import { Stock } from '@/types/stock';
import { StockTable } from '@/components/StockTable';
import { StockDetail } from '@/components/StockDetail';
import { fetchStockData } from '@/lib/googleSheets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickers, setTickers] = useState<string[]>([]);
  const [newTicker, setNewTicker] = useState('');

  const loadStocksFromDB = async () => {
    try {
      const { data, error } = await supabase
        .from('tickers')
        .select('*')
        .order('added_at', { ascending: true });
      
      if (error) throw error;
      
      const stockList: Stock[] = (data || []).map(row => ({
        ticker: row.ticker,
        companyName: row.company || row.ticker,
        currentPrice: row.price,
        priceChangePercent: row.change_percent,
        volumeRaw: row.volume,
        low52Week: row.low52,
        high52Week: row.high52,
        asOfTime: new Date(row.updated_at).toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        volumeDisplay: formatVolume(row.volume),
        low52WeekDisplay: formatPrice(row.low52),
        high52WeekDisplay: formatPrice(row.high52),
        analystPrediction: row.analyst_label || 'No data',
      }));
      
      setStocks(stockList);
      const tickerList = data?.map(t => t.ticker) || [];
      setTickers(tickerList);
    } catch (error) {
      console.error('Failed to load stocks:', error);
      toast.error('Failed to load stocks from database');
    }
  };

  const formatVolume = (value: number | null): string => {
    if (value === null || value === undefined) {
      return '—';
    }
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)} B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)} M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)} K`;
    }
    return `${value.toFixed(0)}`;
  };

  const formatPrice = (value: number | null): string => {
    if (value === null || value === undefined) {
      return '—';
    }
    return `$${value.toFixed(2)}`;
  };

  const refreshStocks = async () => {
    if (tickers.length === 0) {
      toast.error('No tickers to refresh');
      return;
    }

    try {
      setIsRefreshing(true);
      
      // Fetch fresh data from Yahoo
      const yahooData = await fetchStockData(tickers);
      
      // Update the in-memory state with fresh data
      setStocks(yahooData);
      
      // Update database with fresh data
      for (const stock of yahooData) {
        await supabase
          .from('tickers')
          .update({
            price: stock.currentPrice,
            change_percent: stock.priceChangePercent,
            volume: stock.volumeRaw,
            low52: stock.low52Week,
            high52: stock.high52Week,
            analyst_label: stock.analystPrediction,
            company: stock.companyName,
            updated_at: new Date().toISOString(),
          })
          .eq('ticker', stock.ticker);
      }
      
      toast.success('Stock data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh stock data');
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const addTicker = async () => {
    const ticker = newTicker.trim().toUpperCase();
    if (!ticker) {
      toast.error('Please enter a ticker symbol');
      return;
    }
    if (tickers.includes(ticker)) {
      toast.error('Ticker already added');
      return;
    }

    try {
      const { error } = await supabase
        .from('tickers')
        .insert({ ticker, company: ticker });
      
      if (error) throw error;
      
      setNewTicker('');
      toast.success(`${ticker} added`);
      
      // Reload stocks from database
      await loadStocksFromDB();
    } catch (error: any) {
      console.error('Failed to add ticker:', error);
      toast.error('Failed to add ticker to database');
    }
  };

  const removeTicker = async (ticker: string) => {
    try {
      const { error } = await supabase
        .from('tickers')
        .delete()
        .eq('ticker', ticker);
      
      if (error) throw error;
      
      toast.success(`${ticker} removed`);
      
      // Reload stocks from database
      await loadStocksFromDB();
    } catch (error) {
      console.error('Failed to remove ticker:', error);
      toast.error('Failed to remove ticker from database');
    }
  };

  useEffect(() => {
    loadStocksFromDB().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2">
                <img src={stockBestieLogo} alt="Stock Bestie Logo" className="h-12 w-12 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Stock Bestie</h1>
                <p className="text-sm text-muted-foreground">Real-time stock market buddy by Hanah July</p>
              </div>
            </div>
            <Button
              onClick={refreshStocks}
              disabled={isRefreshing || tickers.length === 0}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Ticker Management */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter ticker (e.g., AAPL, NVDA, NYSE:PLTR)"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTicker()}
              className="max-w-md"
            />
            <Button onClick={addTicker} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Ticker
            </Button>
          </div>
          
          {tickers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker) => (
                <div
                  key={ticker}
                  className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {ticker}
                  <button
                    onClick={() => removeTicker(ticker)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
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
            <p className="text-muted-foreground">No stocks yet — add one above.</p>
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
