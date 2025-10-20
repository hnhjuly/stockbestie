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

async function fetchYahooFinanceData(ticker: string): Promise<any> {
  // Check cache first
  const cached = cache.get(ticker);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Cache hit for ${ticker}`);
    return cached.data;
  }

  console.log(`Fetching fresh data for ${ticker}`);
  
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const quote = data.chart.result[0];
    
    if (!quote) {
      throw new Error(`No data found for ticker ${ticker}`);
    }

    const meta = quote.meta;
    const marketPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const changePercent = ((marketPrice - previousClose) / previousClose) * 100;

    const stockData = {
      ticker,
      companyName: meta.longName || meta.shortName || ticker,
      currentPrice: marketPrice,
      priceChangePercent: changePercent,
      marketCapRaw: meta.marketCap || 0,
      volumeRaw: meta.regularMarketVolume || 0,
      peRatio: meta.trailingPE || 0,
      low52Week: meta.fiftyTwoWeekLow || 0,
      high52Week: meta.fiftyTwoWeekHigh || 0,
      eps: meta.epsTrailingTwelveMonths || 0,
      asOfTime: new Date(meta.regularMarketTime * 1000).toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    // Store in cache
    cache.set(ticker, { data: stockData, timestamp: Date.now() });

    return stockData;
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    throw error;
  }
}

function formatMarketCap(value: number): string {
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

    // Fetch all tickers in parallel
    const promises = tickers.map(ticker => 
      fetchYahooFinanceData(ticker).catch(error => {
        console.error(`Failed to fetch ${ticker}:`, error);
        return null;
      })
    );

    const results = await Promise.all(promises);
    
    // Filter out failed requests and format the data
    const stocks = results
      .filter(result => result !== null)
      .map(stock => ({
        ...stock,
        marketCapDisplay: formatMarketCap(stock.marketCapRaw),
        volumeDisplay: formatVolume(stock.volumeRaw),
        analystPrediction: `Data from Yahoo Finance - ${stock.priceChangePercent > 0 ? 'Positive' : 'Negative'} movement today`,
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
