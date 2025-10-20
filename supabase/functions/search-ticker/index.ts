import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TickerResult {
  ticker: string;
  name: string;
  exchange: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching for ticker:', query);

    // Search Yahoo Finance for tickers
    const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter for US common stocks only (XNYS = NYSE, XNAS = NASDAQ)
    const validResults: TickerResult[] = (data.quotes || [])
      .filter((quote: any) => 
        quote.quoteType === 'EQUITY' && 
        (quote.exchange === 'XNYS' || quote.exchange === 'XNAS') &&
        !quote.symbol.includes('^') && // Exclude indices
        !quote.symbol.includes('=') && // Exclude currencies
        !quote.symbol.endsWith('-WT') && // Exclude warrants
        !quote.symbol.endsWith('.WS') && // Exclude warrants
        quote.symbol.length <= 5 // Most common stocks have 1-5 character tickers
      )
      .slice(0, 5) // Top 5 matches
      .map((quote: any) => ({
        ticker: quote.symbol,
        name: quote.shortname || quote.longname || quote.symbol,
        exchange: quote.exchange === 'XNYS' ? 'NYSE' : 'NASDAQ'
      }));

    console.log(`Found ${validResults.length} valid US stock results`);

    return new Response(
      JSON.stringify({ results: validResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching ticker:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', results: [] }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
