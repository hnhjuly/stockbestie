import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    // Input validation
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid query parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit query length to prevent abuse
    if (query.trim() === '' || query.length > 100) {
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
    
    // Filter for stocks and ETFs from all major exchanges (US and international)
    const validResults = (data.quotes || [])
      .filter((quote: any) => {
        const isEquityOrETF = quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF';
        const hasSymbol = quote.symbol && quote.symbol.length > 0;
        
        // Accept major exchanges including international ones
        const validExchanges = ['NMS', 'NYQ', 'PCX', 'LSE', 'LON', 'TOR', 'FRA', 'EPA', 'JPX', 'HKG'];
        const validExchangeDisp = ['NASDAQ', 'NYSE', 'NYSEArca', 'LSE', 'London', 'Toronto', 'Frankfurt', 'Paris', 'Tokyo', 'Hong Kong'];
        
        const isValidExchange = validExchanges.includes(quote.exchange) || 
                               validExchangeDisp.some(ex => quote.exchDisp?.includes(ex));
        
        console.log(`Checking ${quote.symbol}: quoteType=${quote.quoteType}, exchange=${quote.exchange}, exchDisp=${quote.exchDisp}, isValid=${isEquityOrETF && hasSymbol && isValidExchange}`);
        
        return isEquityOrETF && hasSymbol && isValidExchange;
      })
      .slice(0, 10) // Get more results to show both US and international options
      .map((quote: any) => ({
        symbol: quote.symbol,
        shortname: quote.shortname || quote.longname || '',
        exchange: quote.exchDisp || quote.exchange || 'Unknown'
      }));

    console.log(`Found ${validResults.length} valid US stocks/ETFs`);

    return new Response(
      JSON.stringify({ results: validResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to search tickers', results: [] }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
