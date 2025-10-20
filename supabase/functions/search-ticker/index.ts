import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache for Yahoo Finance cookie and crumb
let yahooCookie: string | null = null;
let yahooCrumb: string | null = null;
let authTimestamp = 0;
const AUTH_CACHE_DURATION = 3600 * 1000; // 1 hour

async function getYahooAuth(): Promise<{ cookie: string; crumb: string }> {
  if (yahooCookie && yahooCrumb && Date.now() - authTimestamp < AUTH_CACHE_DURATION) {
    return { cookie: yahooCookie, crumb: yahooCrumb };
  }

  console.log('Fetching new Yahoo Finance cookie and crumb...');
  
  try {
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

interface TickerMatch {
  symbol: string;
  name: string;
  exchange: string;
  exchangeDisplay: string;
  quoteType: string;
}

async function searchTicker(query: string): Promise<TickerMatch[]> {
  try {
    const { cookie, crumb } = await getYahooAuth();
    
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&crumb=${encodeURIComponent(crumb)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Cookie': cookie,
        'Referer': 'https://finance.yahoo.com',
      }
    });
    
    if (!response.ok) {
      console.error(`Yahoo Finance search error: ${response.status}`);
      if (response.status === 401) {
        yahooCookie = null;
        yahooCrumb = null;
        authTimestamp = 0;
        // Retry once
        return await searchTicker(query);
      }
      throw new Error(`Yahoo Finance search error: ${response.status}`);
    }

    const data = await response.json();
    const quotes = data.quotes || [];
    
    // Filter for US common stocks only (XNYS = NYSE, XNAS = NASDAQ)
    const usStocks = quotes
      .filter((quote: any) => {
        const isUSExchange = quote.exchange === 'XNYS' || quote.exchange === 'XNAS';
        const isEquity = quote.quoteType === 'EQUITY';
        return isUSExchange && isEquity;
      })
      .slice(0, 5)
      .map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || quote.symbol,
        exchange: quote.exchange,
        exchangeDisplay: quote.exchange === 'XNYS' ? 'NYSE' : 'NASDAQ',
        quoteType: quote.quoteType,
      }));

    return usStocks;
  } catch (error) {
    console.error('Error searching ticker:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== 'string') {
      throw new Error('Invalid query parameter');
    }

    console.log(`Searching for: ${query}`);
    const results = await searchTicker(query);

    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in search-ticker function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage, results: [] }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
