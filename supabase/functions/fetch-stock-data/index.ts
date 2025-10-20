import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache to store stock data with 60-second expiration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds in milliseconds

interface YahooQuoteResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  regularMarketTime?: number;
}

async function fetchYahooFinanceData(tickers: string[]): Promise<any[]> {
  // Check cache for all tickers
  const cacheKey = tickers.sort().join(',');
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Cache hit for tickers: ${tickers.join(', ')}`);
    return cached.data;
  }

  console.log(`Fetching fresh data for tickers: ${tickers.join(', ')}`);
  
  try {
    const symbols = tickers.join(',');
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (StockBestie)',
        'Accept': 'application/json',
        'Referer': 'https://finance.yahoo.com',
        'Cache-Control': 'no-store',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.quoteResponse?.result;
    
    if (!results || !Array.isArray(results)) {
      throw new Error('No data found in response');
    }

    const stocksData = results.map((quote: YahooQuoteResult) => {
      const marketTime = quote.regularMarketTime 
        ? new Date(quote.regularMarketTime * 1000).toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        : new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          });

      return {
        ticker: quote.symbol,
        companyName: quote.shortName || quote.longName || quote.symbol,
        currentPrice: quote.regularMarketPrice ?? null,
        priceChangePercent: quote.regularMarketChangePercent ?? null,
        volumeRaw: quote.regularMarketVolume ?? null,
        low52Week: quote.fiftyTwoWeekLow ?? null,
        high52Week: quote.fiftyTwoWeekHigh ?? null,
        asOfTime: marketTime,
      };
    });

    // Store in cache
    cache.set(cacheKey, { data: stocksData, timestamp: Date.now() });

    return stocksData;
  } catch (error) {
    console.error(`Error fetching quotes:`, error);
    throw error;
  }
}

function formatVolume(value: number | null): string {
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
}

function formatPrice(value: number | null): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return `$${value.toFixed(2)}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tickers } = await req.json();
    
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      throw new Error('Invalid tickers array');
    }

    console.log(`Fetching data for tickers: ${tickers.join(', ')}`);

    // Fetch all tickers in a single request
    const stocksData = await fetchYahooFinanceData(tickers);
    
    // Format the data
    const stocks = stocksData.map(stock => ({
      ...stock,
      volumeDisplay: formatVolume(stock.volumeRaw),
      low52WeekDisplay: formatPrice(stock.low52Week),
      high52WeekDisplay: formatPrice(stock.high52Week),
      analystPrediction: stock.priceChangePercent !== null
        ? `Data from Yahoo Finance - ${stock.priceChangePercent > 0 ? 'Positive' : 'Negative'} movement today`
        : 'Data from Yahoo Finance',
    }));

    return new Response(
      JSON.stringify({ stocks }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in fetch-stock-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
