import { useState } from 'react';
import { Stock, SortField, SortDirection } from '@/types/stock';
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StockTableProps {
  stocks: Stock[];
  onStockClick: (stock: Stock) => void;
}

export const StockTable = ({ stocks, onStockClick }: StockTableProps) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStocks = sortField ? [...stocks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    // Handle string sorting for company names
    if (sortField === 'companyName') {
      return (aValue as string).localeCompare(bValue as string) * modifier;
    }
    
    // Handle numeric sorting
    return ((aValue as number) - (bValue as number)) * modifier;
  }) : stocks;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const getPriceChangeColor = (change: number) => {
    if (change >= 0) return 'text-success';
    return 'text-destructive';
  };

  return (
    <>
      {/* Mobile & Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {sortedStocks.map((stock) => (
          <div
            key={stock.ticker}
            className="rounded-lg border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors touch-manipulation"
            onClick={() => onStockClick(stock)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg">{stock.ticker}</div>
                <div className="text-sm text-muted-foreground truncate">{stock.companyName}</div>
              </div>
              <div className="text-right ml-3">
                <div className="font-mono font-semibold text-lg">${stock.currentPrice.toFixed(2)}</div>
                <div className={`flex items-center justify-end gap-1 text-sm ${getPriceChangeColor(stock.priceChangePercent)}`}>
                  {stock.priceChangePercent >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span className="font-semibold">
                    {stock.priceChangePercent >= 0 ? '+' : ''}
                    {stock.priceChangePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2">
              <div className="text-muted-foreground">
                {stock.type === 'etf' ? 'Net Assets:' : 'Market Cap:'}
                <span className="ml-1 font-mono text-foreground">
                  {stock.type === 'etf' && stock.netAssetsDisplay ? stock.netAssetsDisplay : stock.marketCapDisplay}
                </span>
              </div>
              <div className="text-muted-foreground">
                Volume:
                <span className="ml-1 font-mono text-foreground">{stock.volumeDisplay}</span>
              </div>
              <div className="text-muted-foreground">
                {stock.type === 'etf' ? 'Div Yield:' : 'P/E:'}
                <span className="ml-1 font-mono text-foreground">
                  {stock.type === 'etf' 
                    ? (stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : 'N/A')
                    : (stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A')
                  }
                </span>
              </div>
              <div className="text-muted-foreground">
                {stock.type === 'etf' ? 'Exp Ratio:' : 'EPS:'}
                <span className="ml-1 font-mono text-foreground">
                  {stock.type === 'etf'
                    ? (stock.expenseRatio ? `${(stock.expenseRatio * 100).toFixed(2)}%` : 'N/A')
                    : (stock.eps ? `$${stock.eps.toFixed(2)}` : 'N/A')
                  }
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
              <span>Tap for details</span>
              <span className={`font-semibold ${
                stock.analystPrediction.startsWith('Strong Buy') || stock.analystPrediction.startsWith('Buy') ? 'text-success' : 
                stock.analystPrediction.startsWith('Hold') ? 'text-warning' :
                stock.analystPrediction.startsWith('Sell') || stock.analystPrediction.startsWith('Strong Sell') ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {stock.analystPrediction.split(' - ')[0] || 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[80px]">Ticker</TableHead>
              <TableHead className="min-w-[150px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('companyName')}
                  className="hover:bg-accent"
                >
                  Company
                  <SortIcon field="companyName" />
                </Button>
              </TableHead>
              <TableHead className="min-w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('currentPrice')}
                  className="hover:bg-accent"
                >
                  Price
                  <SortIcon field="currentPrice" />
                </Button>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('priceChangePercent')}
                  className="hover:bg-accent"
                >
                  Change %
                  <SortIcon field="priceChangePercent" />
                </Button>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('marketCapRaw')}
                  className="hover:bg-accent"
                >
                  {sortedStocks.some(s => s.type === 'etf') ? 'Mkt Cap / Net Assets' : 'Market Cap'}
                  <SortIcon field="marketCapRaw" />
                </Button>
              </TableHead>
              <TableHead className="min-w-[100px]">Volume</TableHead>
              <TableHead className="text-right min-w-[100px]">P/E / Div Yield</TableHead>
              <TableHead className="text-right min-w-[100px]">EPS / Exp Ratio</TableHead>
              <TableHead className="min-w-[300px]">Analyst Prediction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStocks.map((stock) => (
              <TableRow
                key={stock.ticker}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onStockClick(stock)}
              >
                <TableCell className="font-semibold">{stock.ticker}</TableCell>
                <TableCell className="max-w-[200px] truncate">{stock.companyName}</TableCell>
                <TableCell className="font-mono">${stock.currentPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 ${getPriceChangeColor(stock.priceChangePercent)}`}>
                    {stock.priceChangePercent >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">
                      {stock.priceChangePercent >= 0 ? '+' : ''}
                      {stock.priceChangePercent.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {stock.type === 'etf' && stock.netAssetsDisplay ? stock.netAssetsDisplay : stock.marketCapDisplay}
                </TableCell>
                <TableCell className="text-muted-foreground">{stock.volumeDisplay}</TableCell>
                <TableCell className="text-right font-mono">
                  {stock.type === 'etf' 
                    ? (stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : 'N/A')
                    : (stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A')
                  }
                </TableCell>
                <TableCell className="text-right font-mono">
                  {stock.type === 'etf'
                    ? (stock.expenseRatio ? `${(stock.expenseRatio * 100).toFixed(2)}%` : 'N/A')
                    : (stock.eps ? `$${stock.eps.toFixed(2)}` : 'N/A')
                  }
                </TableCell>
                <TableCell className="text-sm">
                  <span className={`font-semibold ${
                    stock.analystPrediction.startsWith('Strong Buy') || stock.analystPrediction.startsWith('Buy') ? 'text-success' : 
                    stock.analystPrediction.startsWith('Hold') ? 'text-warning' :
                    stock.analystPrediction.startsWith('Sell') || stock.analystPrediction.startsWith('Strong Sell') ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`}>
                    {stock.analystPrediction.split(' - ')[0] || 'N/A'}
                  </span>
                  {stock.analystPrediction.includes(' - ') && (
                    <span className="text-muted-foreground block mt-1">
                      {stock.analystPrediction.split(' - ').slice(1).join(' - ')}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
