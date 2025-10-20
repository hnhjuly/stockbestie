import { useState, useEffect } from 'react';
import { Stock } from '@/types/stock';
import { StockTable } from '@/components/StockTable';
import { StockDetail } from '@/components/StockDetail';
import { fetchStockData } from '@/lib/googleSheets';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStocks = async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const data = await fetchStockData();
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

  useEffect(() => {
    loadStocks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Stock Sheet</h1>
                <p className="text-sm text-muted-foreground">Real-time stock market data</p>
              </div>
            </div>
            <Button
              onClick={() => loadStocks(true)}
              disabled={isRefreshing}
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading stock data...</p>
            </div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No stocks found. Add tickers to your Google Sheet.</p>
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
