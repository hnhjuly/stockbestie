import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
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

    console.log(`Searching for ticker: ${query}`);

    // Search Yahoo Finance
    const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance search failed: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`Raw search results count: ${data.quotes?.length || 0}`);
    console.log('Sample quotes:', JSON.stringify(data.quotes?.slice(0, 3), null, 2));
    
    // Filter for US stocks and ETFs (NASDAQ, NYSE, or NYSEArca)
    const validResults = (data.quotes || [])
      .filter((quote: any) => {
        const isEquityOrETF = quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF';
        const isUSExchange = quote.exchange === 'NMS' || quote.exchange === 'NYQ' || quote.exchange === 'PCX' ||
                            quote.exchDisp === 'NASDAQ' || quote.exchDisp === 'NYSE' || quote.exchDisp === 'NYSEArca';
        const hasSymbol = quote.symbol && !quote.symbol.includes('.');
        
        console.log(`Checking ${quote.symbol}: quoteType=${quote.quoteType}, isUSExchange=${isUSExchange}, exchange=${quote.exchange}, exchDisp=${quote.exchDisp}`);
        
        return isEquityOrETF && isUSExchange && hasSymbol;
      })
      .slice(0, 5)
      .map((quote: any) => ({
        symbol: quote.symbol,
        shortname: quote.shortname || quote.longname || '',
        exchange: quote.exchDisp || (quote.exchange === 'NMS' ? 'NASDAQ' : 'NYSE')
      }));

    console.log(`Found ${validResults.length} valid US stocks/ETFs`);

    return new Response(
      JSON.stringify({ results: validResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, results: [] }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
