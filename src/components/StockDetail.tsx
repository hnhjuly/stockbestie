import { Stock } from '@/types/stock';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockDetailProps {
  stock: Stock | null;
  open: boolean;
  onClose: () => void;
}

export const StockDetail = ({ stock, open, onClose }: StockDetailProps) => {
  if (!stock) return null;

  const getPriceChangeColor = (change: number) => {
    if (change >= 0) return 'text-success';
    return 'text-destructive';
  };

  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <div className="flex items-center gap-3">
              <span className="text-primary">{stock.ticker}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-lg font-normal">{stock.companyName}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4 pb-4">
          {/* Price Section */}
          <div className="bg-accent/50 rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Current Price</div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold font-mono">${stock.currentPrice.toFixed(2)}</span>
              <div className={`flex items-center gap-2 text-xl ${getPriceChangeColor(stock.priceChangePercent)}`}>
                {stock.priceChangePercent >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="font-semibold">
                  {stock.priceChangePercent >= 0 ? '+' : ''}
                  {stock.priceChangePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{stock.type === 'etf' ? 'ETF Data' : 'Market Data'}</h3>
            <div className="bg-card rounded-lg border">
              {stock.type === 'etf' ? (
                <>
                  <DetailRow label="Net Assets" value={stock.netAssetsDisplay || 'N/A'} />
                  <DetailRow label="Volume" value={stock.volumeDisplay} />
                  <DetailRow label="Dividend Yield" value={stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'} />
                  <DetailRow label="Expense Ratio" value={stock.expenseRatio ? `${stock.expenseRatio.toFixed(2)}%` : 'N/A'} />
                </>
              ) : (
                <>
                  <DetailRow label="Market Cap" value={stock.marketCapDisplay} />
                  <DetailRow label="Volume" value={stock.volumeDisplay} />
                  <DetailRow label="P/E Ratio" value={stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'} />
                  <DetailRow label="EPS (TTM)" value={stock.eps ? `$${stock.eps.toFixed(2)}` : 'N/A'} />
                </>
              )}
            </div>
          </div>

          {/* 52 Week Range */}
          <div>
            <h3 className="text-lg font-semibold mb-3">52 Week Range</h3>
            <div className="bg-card rounded-lg border">
              <DetailRow label="52W Low" value={`$${stock.low52Week.toFixed(2)}`} />
              <DetailRow label="52W High" value={`$${stock.high52Week.toFixed(2)}`} />
            </div>
          </div>

          {/* Analyst Prediction */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Analyst Prediction</h3>
            <div className="bg-accent/50 rounded-lg p-4">
              {stock.analystPrediction && stock.analystPrediction !== 'N/A' ? (
                <div className="flex items-start gap-3">
                  <span className={`font-bold text-lg ${
                    stock.analystPrediction.startsWith('Buy') ? 'text-success' : 
                    stock.analystPrediction.startsWith('Sell') ? 'text-destructive' : 
                    'text-warning'
                  }`}>
                    {stock.analystPrediction.split(' - ')[0]}
                  </span>
                  <p className="text-sm text-muted-foreground flex-1">
                    {stock.analystPrediction.split(' - ').slice(1).join(' - ')}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">N/A</p>
              )}
            </div>
          </div>

          {/* Data Freshness */}
          <div className="text-sm text-muted-foreground text-center pt-2">
            Data as of: {stock.asOfTime} (Delayed ~15-20 minutes)
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
