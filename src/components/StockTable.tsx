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
  const [sortField, setSortField] = useState<SortField>('currentPrice');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle null values - push them to the end
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    const modifier = sortDirection === 'asc' ? 1 : -1;
    return (aValue - bValue) * modifier;
  });

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
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('currentPrice')}
                className="hover:bg-accent"
              >
                Price
                <SortIcon field="currentPrice" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('priceChangePercent')}
                className="hover:bg-accent"
              >
                Change %
                <SortIcon field="priceChangePercent" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('volumeRaw')}
                className="hover:bg-accent"
              >
                Volume
                <SortIcon field="volumeRaw" />
              </Button>
            </TableHead>
            <TableHead className="w-[110px]">
              <Button
                variant="ghost"
                onClick={() => handleSort('low52Week')}
                className="hover:bg-accent"
              >
                52W Low
                <SortIcon field="low52Week" />
              </Button>
            </TableHead>
            <TableHead className="w-[110px]">
              <Button
                variant="ghost"
                onClick={() => handleSort('high52Week')}
                className="hover:bg-accent"
              >
                52W High
                <SortIcon field="high52Week" />
              </Button>
            </TableHead>
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
              <TableCell className="text-muted-foreground">{stock.volumeDisplay}</TableCell>
              <TableCell className="font-mono w-[110px]">{stock.low52WeekDisplay}</TableCell>
              <TableCell className="font-mono w-[110px]">{stock.high52WeekDisplay}</TableCell>
              <TableCell className="text-sm">
                <span className={`font-semibold ${
                  stock.analystPrediction.startsWith('Buy') ? 'text-success' : 
                  stock.analystPrediction.startsWith('Sell') ? 'text-destructive' : 
                  'text-warning'
                }`}>
                  {stock.analystPrediction.split(' - ')[0]}
                </span>
                <span className="text-muted-foreground">
                  {' - ' + stock.analystPrediction.split(' - ').slice(1).join(' - ')}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
