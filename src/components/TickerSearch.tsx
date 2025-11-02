import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getDeviceId } from '@/lib/deviceId';

interface SearchResult {
  symbol: string;
  shortname: string;
  exchange: string;
}

interface TickerSearchProps {
  existingTickers: string[];
  onTickerAdded: (ticker: string) => void;
}

export const TickerSearch = ({ existingTickers, onTickerAdded }: TickerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchTicker = async () => {
      if (searchQuery.trim().length < 1) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase.functions.invoke('search-ticker', {
          body: { query: searchQuery }
        });

        if (error) throw error;

        setSearchResults(data.results || []);
        setShowDropdown(data.results && data.results.length > 0);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchTicker, 150);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTicker = async (ticker?: string) => {
    const tickerToAdd = ticker || searchResults[selectedIndex]?.symbol || searchQuery.trim().toUpperCase();
    
    if (!tickerToAdd) {
      toast.error('Please enter a ticker symbol or company name');
      return;
    }

    if (existingTickers.includes(tickerToAdd)) {
      toast.error('Ticker already added');
      return;
    }

    // If user typed something but we have no results, show error
    if (!ticker && searchResults.length === 0 && searchQuery.trim().length > 0) {
      toast.error("Couldn't find a US stock or ETF for that name");
      return;
    }

    try {
      const deviceId = getDeviceId();
      const { error } = await supabase
        .from('tickers')
        .insert({ ticker: tickerToAdd, user_id: deviceId });
      
      if (error) throw error;
      
      onTickerAdded(tickerToAdd);
      setSearchQuery('');
      setSearchResults([]);
      setShowDropdown(false);
      toast.success(`${tickerToAdd} added`);
    } catch (error: any) {
      console.error('Failed to add ticker:', error);
      toast.error('Failed to add ticker to database');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'Enter') {
        addTicker();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % searchResults.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
        break;
      case 'Enter':
        e.preventDefault();
        addTicker(searchResults[selectedIndex]?.symbol);
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter ticker or company name (e.g., AAPL, VOO, SPY)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 h-11 touch-manipulation"
          />
        </div>
        <Button onClick={() => addTicker()} className="gap-2 h-11 touch-manipulation whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Add Ticker
        </Button>
      </div>

      {showDropdown && searchResults.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={result.symbol}
              onClick={() => addTicker(result.symbol)}
              className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors touch-manipulation ${
                index === selectedIndex ? 'bg-accent' : ''
              }`}
            >
              <div className="font-medium">{result.symbol}</div>
              <div className="text-sm text-muted-foreground">
                {result.shortname} ({result.exchange})
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
