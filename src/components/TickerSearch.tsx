import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TickerMatch {
  symbol: string;
  name: string;
  exchange: string;
  exchangeDisplay: string;
  quoteType: string;
}

interface TickerSearchProps {
  tickers: string[];
  onTickerAdded: (ticker: string) => void;
}

export const TickerSearch = ({ tickers, onTickerAdded }: TickerSearchProps) => {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<TickerMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchTicker = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMatches([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-ticker', {
        body: { query: searchQuery }
      });

      if (error) throw error;

      const results = data?.results || [];
      setMatches(results);
      setShowDropdown(results.length > 0);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search error:', error);
      setMatches([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchTicker(value);
    }, 300);
  };

  const addTicker = async (ticker?: string) => {
    let tickerToAdd = ticker;
    
    if (!tickerToAdd) {
      // Use top match if available
      if (matches.length > 0) {
        tickerToAdd = matches[0].symbol;
      } else {
        // Try using the query as-is (uppercase)
        tickerToAdd = query.trim().toUpperCase();
      }
    }

    if (!tickerToAdd) {
      toast.error('Please enter a company name or ticker');
      return;
    }

    if (tickers.includes(tickerToAdd)) {
      toast.error('Ticker already added');
      setQuery('');
      setMatches([]);
      setShowDropdown(false);
      return;
    }

    // If we searched but found no matches, show error
    if (query.trim() && matches.length === 0 && !ticker) {
      toast.error("Couldn't find a US stock for that name");
      return;
    }

    try {
      const { error } = await supabase
        .from('tickers')
        .insert({ ticker: tickerToAdd });
      
      if (error) throw error;
      
      onTickerAdded(tickerToAdd);
      setQuery('');
      setMatches([]);
      setShowDropdown(false);
      toast.success(`${tickerToAdd} added`);
    } catch (error: any) {
      console.error('Failed to add ticker:', error);
      toast.error('Failed to add ticker to database');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || matches.length === 0) {
      if (e.key === 'Enter') {
        addTicker();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % matches.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + matches.length) % matches.length);
        break;
      case 'Enter':
        e.preventDefault();
        addTicker(matches[selectedIndex].symbol);
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
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => matches.length > 0 && setShowDropdown(true)}
            className="pr-10"
          />
          {isSearching && (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-pulse text-muted-foreground" />
          )}
        </div>
        <Button onClick={() => addTicker()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Ticker
        </Button>
      </div>

      {showDropdown && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 max-w-md bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {matches.map((match, index) => (
            <button
              key={match.symbol}
              onClick={() => addTicker(match.symbol)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
                index === selectedIndex ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">
                    {match.symbol} — {match.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {match.exchangeDisplay}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
