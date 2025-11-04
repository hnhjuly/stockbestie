import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache to store stock data with 5-minute expiration (to reduce rate limiting)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache for AI summaries with 1-hour expiration
const summaryCache = new Map<string, { summary: string; timestamp: number }>();
const SUMMARY_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

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
  quoteType?: string;
  // ETF-specific fields
  totalAssets?: number;
  yield?: number;
  annualReportExpenseRatio?: number;
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
      
      // Handle rate limiting
      if (response.status === 429) {
        console.log('Rate limited by Yahoo Finance - will retry with backoff');
        throw new Error('Yahoo Finance rate limit reached. Please wait a moment and try again.');
      }
      
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
    
    console.log(`Yahoo Finance returned ${results.length} results`);
    if (results.length > 0) {
      console.log('Sample result:', JSON.stringify(results[0], null, 2));
    } else {
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
    
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

async function generateAnalystSummary(stock: any): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return 'Summary unavailable';
  }
  
  // Check cache first
  const cacheKey = `${stock.ticker}_${stock.analystRating}`;
  const cached = summaryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SUMMARY_CACHE_DURATION) {
    console.log(`Using cached summary for ${stock.ticker}`);
    return cached.summary;
  }
  
  console.log(`Generating summary for ${stock.ticker}...`);

  // Return N/A for ETFs if no analyst rating
  if (stock.type === 'etf' && stock.analystRating === 'N/A') {
    return 'N/A';
  }

  try {
    const isETF = stock.type === 'etf';
    
    const prompt = isETF 
      ? `You're a gossipy insider spilling tea on this ETF! Write a 2-3 sentence summary about ${stock.ticker} (${stock.companyName}) that sounds like you're texting a friend with the REAL scoop.

Current Stats:
- Price: $${stock.currentPrice?.toFixed(2) || 'N/A'} (${stock.priceChangePercent?.toFixed(2) || 'N/A'}% today)
- Net Assets: ${stock.netAssetsDisplay || 'N/A'}
- Dividend Yield: ${stock.dividendYield ? (stock.dividendYield * 100).toFixed(2) + '%' : 'N/A'}
- Expense Ratio: ${stock.expenseRatio ? (stock.expenseRatio * 100).toFixed(2) + '%' : 'N/A'}
- Analyst Rating: ${stock.analystRating}

Make it juicy and fun! Use phrases like "word on the street is...", "analysts are lowkey obsessed", "not gonna lie", "the vibes are...", etc. Explain WHY analysts gave this rating in a gossipy but accurate way. Keep it under 60 words!`
      : `You're a gossipy insider spilling tea on this stock! Write a 2-3 sentence summary about ${stock.ticker} (${stock.companyName}) that sounds like you're texting a friend with the REAL scoop.

Current Stats:
- Price: $${stock.currentPrice?.toFixed(2) || 'N/A'} (${stock.priceChangePercent?.toFixed(2) || 'N/A'}% today)
- P/E Ratio: ${stock.peRatio?.toFixed(2) || 'N/A'}
- Market Cap: ${stock.marketCapRaw ? formatMarketCap(stock.marketCapRaw) : 'N/A'}
- Analyst Rating: ${stock.analystRating}

Make it juicy and fun! Use phrases like "word on the street is...", "analysts are lowkey obsessed", "not gonna lie", "the vibes are...", etc. Explain WHY analysts gave this rating in a gossipy but accurate way. Keep it under 60 words!`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a gossipy finance insider who makes stock analysis fun and relatable. Write like you\'re texting a bestie with the real tea! 💅'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error for ${stock.ticker}: ${response.status} - ${errorText}`);
      return 'Summary unavailable';
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || 'Summary unavailable';
    console.log(`Generated summary for ${stock.ticker}: ${summary.substring(0, 50)}...`);
    
    // Cache the summary
    summaryCache.set(cacheKey, { summary, timestamp: Date.now() });
    
    return summary;
  } catch (error) {
    console.error(`Error generating summary for ${stock.ticker}:`, error);
    return 'Summary unavailable';
  }
}

function mapYahooResults(results: any[]): any[] {
  return results.map((quote: any) => {
      const isETF = quote.quoteType === 'ETF';
      const marketCap = quote.marketCap || 0;
      const netAssets = quote.totalAssets || 0;
      
      // Log ETF-specific fields for debugging
      if (isETF) {
        console.log(`ETF ${quote.symbol} fields:`, {
          totalAssets: quote.totalAssets,
          yield: quote.yield,
          ytdReturn: quote.ytdReturn,
          trailingAnnualDividendYield: quote.trailingAnnualDividendYield,
          annualReportExpenseRatio: quote.annualReportExpenseRatio,
          fundInceptionDate: quote.fundInceptionDate,
          all_keys: Object.keys(quote)
        });
      }
      
      const stockData = {
        ticker: quote.symbol,
        companyName: quote.shortName || quote.longName || quote.symbol,
        type: isETF ? 'etf' : 'stock',
        currentPrice: quote.regularMarketPrice || null,
        priceChangePercent: quote.regularMarketChangePercent || null,
        marketCapRaw: marketCap,
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
        // ETF-specific fields (Yahoo returns these as percentage values, not ratios)
        netAssets: isETF ? (netAssets || quote.netAssets) : undefined,
        netAssetsDisplay: isETF ? formatMarketCap(netAssets || quote.netAssets || 0) : undefined,
        dividendYield: isETF ? quote.dividendYield : undefined,
        expenseRatio: isETF ? quote.netExpenseRatio : undefined,
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
    
    // Input validation
    if (!tickers || !Array.isArray(tickers)) {
      return new Response(
        JSON.stringify({ error: 'Invalid tickers parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit number of tickers to prevent abuse
    if (tickers.length === 0 || tickers.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Number of tickers must be between 1 and 20' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate ticker format
    const validTickers = tickers.filter(t => 
      typeof t === 'string' && t.length > 0 && t.length <= 10 && /^[A-Z0-9\.\-]+$/.test(t)
    );

    if (validTickers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid tickers provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching data for tickers: ${validTickers.join(', ')}`);

    // Fetch all tickers in a single batch request
    const results = await fetchYahooFinanceData(validTickers);
    
    // Generate AI summaries for each stock in parallel
    const stocksWithSummaries = await Promise.all(
      results.map(async (stock) => {
        const summary = await generateAnalystSummary(stock);
        return {
          ...stock,
          marketCapDisplay: formatMarketCap(stock.marketCapRaw),
          volumeDisplay: formatVolume(stock.volumeRaw),
          analystPrediction: `${stock.analystRating} - ${summary}`,
        };
      })
    );

    return new Response(
      JSON.stringify({ stocks: stocksWithSummaries }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in fetch-stock-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a rate limit error
    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return new Response(
        JSON.stringify({ 
          error: 'Service temporarily unavailable. Please try again shortly.' 
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stock data' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
