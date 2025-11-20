import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache duration for AI summaries - 24 hours to save tokens
const SUMMARY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Initialize Supabase client for persistent caching
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

async function generateAnalystSummary(stock: any, forceGenerate: boolean = false): Promise<string> {
  // Check database cache first (persistent across function restarts)
  try {
    const { data: cached, error } = await supabase
      .from('analyst_summaries')
      .select('summary, created_at')
      .eq('ticker', stock.ticker)
      .eq('analyst_rating', stock.analystRating)
      .single();
    
    if (!error && cached) {
      const cacheAge = Date.now() - new Date(cached.created_at).getTime();
      const isExpired = cacheAge >= SUMMARY_CACHE_DURATION;
      
      // If not forcing generation, always return cached summary (even if expired)
      if (!forceGenerate) {
        console.log(`Using cached summary for ${stock.ticker} (age: ${(cacheAge / 3600000).toFixed(1)}h, expired: ${isExpired})`);
        return cached.summary;
      }
      
      // If forcing generation but cache is still fresh, don't regenerate
      if (!isExpired) {
        console.log(`Using fresh cached summary for ${stock.ticker} (age: ${(cacheAge / 3600000).toFixed(1)}h)`);
        return cached.summary;
      }
      
      console.log(`Cache expired for ${stock.ticker} (age: ${(cacheAge / 3600000).toFixed(1)}h), regenerating...`);
    }
  } catch (error) {
    console.error(`Error checking cache for ${stock.ticker}:`, error);
  }
  
  // Only generate if we have API key and are forcing generation
  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return 'Summary unavailable';
  }
  
  if (!forceGenerate) {
    console.log(`No cached summary for ${stock.ticker}, but not forcing generation`);
    return 'Summary unavailable';
  }
  
  console.log(`Generating NEW summary for ${stock.ticker}...`);

  try {
    const isETF = stock.type === 'etf';
    
    const prompt = isETF 
      ? `Write a brief, informative summary about the ${stock.ticker} (${stock.companyName}) ETF. 

Focus on:
1. What types of companies or sectors this ETF invests in
2. The main holdings or focus of the fund
3. Who this ETF is suitable for

Maximum 3 sentences. Keep it casual and easy to understand for everyday investors.`
      : `Write a casual, informative analysis about ${stock.ticker} (${stock.companyName}) and what the analyst rating means.

Analyst Rating: ${stock.analystRating}

Focus on WHY analysts gave this rating and what it means for investors. Maximum 3 sentences. Do NOT include any numbers, prices, percentages, or specific metrics. Keep it conversational and easy to understand.`;

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
            content: 'You are a knowledgeable finance friend explaining stock analysis in a casual, easy-to-understand way. Be informative and conversational.'
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
    
    // Save to database cache (upsert to replace old cache)
    try {
      await supabase
        .from('analyst_summaries')
        .upsert(
          { 
            ticker: stock.ticker, 
            analyst_rating: stock.analystRating,
            summary,
            created_at: new Date().toISOString()
          },
          { 
            onConflict: 'ticker,analyst_rating'
          }
        );
      console.log(`Cached summary for ${stock.ticker} in database`);
    } catch (cacheError) {
      console.error(`Failed to cache summary for ${stock.ticker}:`, cacheError);
    }
    
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
    const { tickers, includeAnalystPrediction = true } = await req.json();
    
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
    
    // Always try to get summaries from cache, only generate new ones if includeAnalystPrediction is true
    const stocksWithSummaries = await Promise.all(
      results.map(async (stock) => {
        const summary = await generateAnalystSummary(stock, includeAnalystPrediction);
        const isETF = stock.type === 'etf';
        
        return {
          ...stock,
          marketCapDisplay: formatMarketCap(stock.marketCapRaw),
          volumeDisplay: formatVolume(stock.volumeRaw),
          analystPrediction: summary && summary !== 'Summary unavailable' 
            ? (isETF ? summary : `${stock.analystRating} - ${summary}`)
            : stock.analystRating,
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
