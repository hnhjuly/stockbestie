import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache to store stock data with 60-second expiration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds in milliseconds

// Cache for Yahoo Finance cookie and crumb
let yahooCookie: string | null = null;
let yahooCrumb: string | null = null;
let authTimestamp = 0;
const AUTH_CACHE_DURATION = 3600 * 1000; // 1 hour

async function getYahooAuth(): Promise<{ cookie: string; crumb: string }> {
  // Return cached auth if still valid
  if (yahooCookie && yahooCrumb && Date.now() - authTimestamp < AUTH_CACHE_DURATION) {
    return { cookie: yahooCookie, crumb: yahooCrumb };
  }

  console.log('Fetching new Yahoo Finance cookie and crumb...');
  
  try {
    // Step 1: Get cookie from Yahoo
    const cookieResponse = await fetch('https://fc.yahoo.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      }
    });
    
    const cookieHeader = cookieResponse.headers.get('set-cookie');
    if (!cookieHeader) {
      throw new Error('Failed to get cookie from Yahoo Finance');
    }
    
    yahooCookie = cookieHeader.split(';')[0];
    console.log('Cookie obtained successfully');

    // Step 2: Get crumb using the cookie
    const crumbResponse = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Cookie': yahooCookie,
      }
    });

    yahooCrumb = await crumbResponse.text();
    console.log('Crumb obtained successfully');
    
    authTimestamp = Date.now();
    
    return { cookie: yahooCookie, crumb: yahooCrumb };
  } catch (error) {
    console.error('Error getting Yahoo auth:', error);
    throw error;
  }
}

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
  averageAnalystRating?: string;
}

async function fetchYahooFinanceData(tickers: string[]): Promise<any[]> {
  const tickerString = tickers.join(',');
  
  console.log(`Fetching fresh data for ${tickerString}`);
  
  try {
    // Get Yahoo auth (cookie and crumb)
    const { cookie, crumb } = await getYahooAuth();
    
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickerString}&crumb=${encodeURIComponent(crumb)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Cookie': cookie,
        'Referer': 'https://finance.yahoo.com',
      }
    });
    
    if (!response.ok) {
      console.error(`Yahoo Finance API error: ${response.status}`);
      // If 401, clear cached auth and retry once
      if (response.status === 401) {
        console.log('Got 401, clearing auth cache and retrying...');
        yahooCookie = null;
        yahooCrumb = null;
        authTimestamp = 0;
        
        // Retry with fresh auth
        const retryAuth = await getYahooAuth();
        const retryUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickerString}&crumb=${encodeURIComponent(retryAuth.crumb)}`;
        const retryResponse = await fetch(retryUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Cookie': retryAuth.cookie,
            'Referer': 'https://finance.yahoo.com',
          }
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Yahoo Finance API error after retry: ${retryResponse.status}`);
        }
        
        const retryData = await retryResponse.json();
        const retryResults = retryData.quoteResponse?.result || [];
        return mapYahooResults(retryResults);
      }
      
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.quoteResponse?.result || [];
    
    if (results.length === 0) {
      throw new Error(`No data found for tickers ${tickerString}`);
    }

    return mapYahooResults(results);
  } catch (error) {
    console.error(`Error fetching ${tickerString}:`, error);
    throw error;
  }
}

function convertAnalystRating(rating: string | undefined | null): string {
  if (!rating) return 'N/A';
  
  const numericRating = parseFloat(rating);
  if (isNaN(numericRating)) return 'N/A';
  
  if (numericRating >= 1.0 && numericRating <= 1.5) return 'Strong Buy';
  if (numericRating >= 1.6 && numericRating <= 2.4) return 'Buy';
  if (numericRating >= 2.5 && numericRating <= 3.4) return 'Hold';
  if (numericRating >= 3.5 && numericRating <= 4.4) return 'Sell';
  if (numericRating >= 4.5 && numericRating <= 5.0) return 'Strong Sell';
  
  return 'N/A';
}

function mapYahooResults(results: any[]): any[] {
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
        analystRating: convertAnalystRating(quote.averageAnalystRating),
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
      analystPrediction: stock.analystRating,
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
