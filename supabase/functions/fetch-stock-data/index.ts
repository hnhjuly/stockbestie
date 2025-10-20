import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache to store stock data with 60-second expiration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds in milliseconds

interface YahooQuoteSummary {
  price: {
    regularMarketPrice: { raw: number };
    regularMarketChangePercent: { raw: number };
    regularMarketVolume: { raw: number };
    regularMarketTime: number;
    shortName?: string;
    longName?: string;
  };
  summaryDetail: {
    fiftyTwoWeekLow?: { raw: number };
    fiftyTwoWeekHigh?: { raw: number };
  };
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
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price,summaryDetail`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.quoteSummary?.result?.[0];
    
    if (!result) {
      throw new Error(`No data found for ticker ${ticker}`);
    }

    const price = result.price;
    const summaryDetail = result.summaryDetail;
    
    const marketPrice = price.regularMarketPrice?.raw ?? price.regularMarketPrice;
    const previousClose = price.regularMarketPreviousClose?.raw ?? price.regularMarketPreviousClose;
    const changePercent = price.regularMarketChangePercent?.raw ?? price.regularMarketChangePercent;

    const stockData = {
      ticker,
      companyName: price.longName || price.shortName || ticker,
      currentPrice: marketPrice,
      priceChangePercent: changePercent,
      volumeRaw: price.regularMarketVolume?.raw ?? price.regularMarketVolume ?? 0,
      low52Week: summaryDetail?.fiftyTwoWeekLow?.raw ?? null,
      high52Week: summaryDetail?.fiftyTwoWeekHigh?.raw ?? null,
      asOfTime: new Date(price.regularMarketTime * 1000).toLocaleString('en-US', { 
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

function format52WeekPrice(value: number | null): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return `$${value.toFixed(2)}`;
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
        volumeDisplay: formatVolume(stock.volumeRaw),
        low52WeekDisplay: format52WeekPrice(stock.low52Week),
        high52WeekDisplay: format52WeekPrice(stock.high52Week),
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
