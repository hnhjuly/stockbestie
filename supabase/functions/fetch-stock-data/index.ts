import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache to store stock data with 60-second expiration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds in milliseconds

interface YahooFinanceQuote {
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  marketCap: number;
  regularMarketVolume: number;
  trailingPE?: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  epsTrailingTwelveMonths?: number;
  shortName: string;
  longName?: string;
}

async function fetchYahooFinanceData(tickers: string[]): Promise<any[]> {
  const tickerString = tickers.join(',');
  
  console.log(`Fetching fresh data for ${tickerString}`);
  
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickerString}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (StockBestie)',
        'Accept': 'application/json',
        'Referer': 'https://finance.yahoo.com',
        'Cache-Control': 'no-store'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.quoteResponse?.result || [];
    
    if (results.length === 0) {
      throw new Error(`No data found for tickers ${tickerString}`);
    }

    return results.map((quote: any) => {
      const stockData = {
        ticker: quote.symbol,
        companyName: quote.shortName || quote.longName || quote.symbol,
        currentPrice: quote.regularMarketPrice || null,
        priceChangePercent: quote.regularMarketChangePercent || null,
        marketCapRaw: quote.marketCap || null,
        volumeRaw: quote.regularMarketVolume || null,
        peRatio: quote.trailingPE || null,
        low52Week: quote.fiftyTwoWeekLow || null,
        high52Week: quote.fiftyTwoWeekHigh || null,
        eps: quote.epsTrailingTwelveMonths || null,
        asOfTime: quote.regularMarketTime 
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
            }),
      };

      return stockData;
    });
  } catch (error) {
    console.error(`Error fetching ${tickerString}:`, error);
    throw error;
  }
}

function formatMarketCap(value: number | null): string {
  if (value === null || value === 0) return '—';
  
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)} T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)} B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)} M`;
  }
  return `${value.toFixed(0)}`;
}

function formatVolume(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)} B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)} M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)} K`;
  }
  return `${value.toFixed(0)}`;
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

    // Fetch all tickers in a single batch request
    const results = await fetchYahooFinanceData(tickers);
    
    // Format the data
    const stocks = results.map(stock => ({
      ...stock,
      marketCapDisplay: formatMarketCap(stock.marketCapRaw),
      volumeDisplay: formatVolume(stock.volumeRaw),
      analystPrediction: `Data from Yahoo Finance - ${stock.priceChangePercent && stock.priceChangePercent > 0 ? 'Positive' : 'Negative'} movement today`,
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
