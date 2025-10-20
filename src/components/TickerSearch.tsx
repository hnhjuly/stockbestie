import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TickerResult {
  ticker: string;
  name: string;
  exchange: string;
}

interface TickerSearchProps {
  existingTickers: string[];
  onTickerAdded: (ticker: string) => void;
}

export const TickerSearch = ({ existingTickers, onTickerAdded }: TickerSearchProps) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<TickerResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTickers = async () => {
      if (!input.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase.functions.invoke('search-ticker', {
          body: { query: input.trim() }
        });

        if (error) throw error;

        setResults(data.results || []);
        setShowDropdown(data.results && data.results.length > 0);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchTickers, 300);
    return () => clearTimeout(debounce);
  }, [input]);

  const addTicker = async (ticker?: string) => {
    const tickerToAdd = ticker || (results.length > 0 ? results[0].ticker : input.trim().toUpperCase());
    
    if (!tickerToAdd) {
      toast.error('Please enter a ticker symbol or company name');
      return;
    }

    if (existingTickers.includes(tickerToAdd)) {
      toast.error('Ticker already added');
      return;
    }

    // If no results found and user is trying to add
    if (!ticker && results.length === 0 && input.trim()) {
      toast.error("Couldn't find a US stock for that name");
      return;
    }

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('tickers')
        .insert({ ticker: tickerToAdd });
      
      if (error) throw error;
      
      onTickerAdded(tickerToAdd);
      setInput('');
      setResults([]);
      setShowDropdown(false);
      toast.success(`${tickerToAdd} added`);
    } catch (error: any) {
      console.error('Failed to add ticker:', error);
      toast.error('Failed to add ticker to database');
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === 'Enter') {
        addTicker();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        addTicker(results[selectedIndex].ticker);
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter company name or ticker (e.g., Nvidia, AAPL)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            disabled={isAdding}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button 
          onClick={() => addTicker()} 
          disabled={isAdding || isSearching}
          className="gap-2"
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Ticker
        </Button>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full max-w-md mt-1 bg-card border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.ticker}
              onClick={() => addTicker(result.ticker)}
              className={`w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                index === selectedIndex ? 'bg-accent/50' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{result.ticker}</div>
                  <div className="text-sm text-muted-foreground truncate">{result.name}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{result.exchange}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
