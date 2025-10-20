import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Separate caches for price data (60s) and fundamentals (24h)
const priceCache = new Map<string, { data: any; timestamp: number }>();
const fundamentalsCache = new Map<string, { data: any; timestamp: number }>();
const PRICE_CACHE_DURATION = 60 * 1000; // 60 seconds
const FUNDAMENTALS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function formatMarketCapToSigFigs(value: number): string {
  if (!value || value <= 0) return '—';
  
  if (value >= 1e12) {
    // Trillions: 3 sig figs
    const num = value / 1e12;
    return `${num.toPrecision(3)} T`;
  } else if (value >= 1e9) {
    // Billions: 3 sig figs
    const num = value / 1e9;
    return `${num.toPrecision(3)} B`;
  } else if (value >= 1e6) {
    // Millions: 3 sig figs
    const num = value / 1e6;
    return `${num.toPrecision(3)} M`;
  }
  return `${value.toPrecision(3)}`;
}

async function fetchYahooFinanceData(ticker: string): Promise<any> {
  // Check price cache first (60s)
  const cachedPrice = priceCache.get(ticker);
  const cachedFundamentals = fundamentalsCache.get(ticker);
  
  const now = Date.now();
  const priceIsFresh = cachedPrice && (now - cachedPrice.timestamp < PRICE_CACHE_DURATION);
  const fundamentalsAreFresh = cachedFundamentals && (now - cachedFundamentals.timestamp < FUNDAMENTALS_CACHE_DURATION);

  if (priceIsFresh && fundamentalsAreFresh) {
    console.log(`Full cache hit for ${ticker}`);
    return { ...cachedPrice.data, ...cachedFundamentals.data };
  }

  console.log(`Fetching data for ${ticker} (price: ${!priceIsFresh}, fundamentals: ${!fundamentalsAreFresh})`);
  
  try {
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price,summaryDetail,defaultKeyStatistics,financialData`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (StockBestie)',
        'Accept': 'application/json',
        'Referer': 'https://finance.yahoo.com',
        'Cache-Control': 'no-store',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.quoteSummary?.result?.[0];
    
    if (!result) {
      throw new Error(`No data found for ticker ${ticker}`);
    }

    const priceData = result.price || {};
    const summaryDetail = result.summaryDetail || {};
    const defaultKeyStats = result.defaultKeyStatistics || {};
    const financialData = result.financialData || {};

    // Extract price with fallback
    const regularMarketPrice = priceData.regularMarketPrice?.raw ?? priceData.regularMarketPrice ?? null;
    const previousClose = priceData.regularMarketPreviousClose?.raw ?? priceData.regularMarketPreviousClose ?? null;
    const changePercent = priceData.regularMarketChangePercent?.raw ?? priceData.regularMarketChangePercent ?? 
      (regularMarketPrice && previousClose ? ((regularMarketPrice - previousClose) / previousClose) * 100 : null);

    // Extract volume
    const volume = priceData.regularMarketVolume?.raw ?? priceData.regularMarketVolume ?? null;

    // Extract 52-week range
    const low52Week = summaryDetail.fiftyTwoWeekLow?.raw ?? defaultKeyStats.fiftyTwoWeekLow?.raw ?? null;
    const high52Week = summaryDetail.fiftyTwoWeekHigh?.raw ?? defaultKeyStats.fiftyTwoWeekHigh?.raw ?? null;

    // Market Cap with fallbacks
    let marketCap = priceData.marketCap?.raw ?? summaryDetail.marketCap?.raw ?? null;
    
    if (!marketCap) {
      // Compute from shares outstanding
      const shares = defaultKeyStats.sharesOutstanding?.raw ?? priceData.sharesOutstanding?.raw ?? null;
      if (shares && regularMarketPrice) {
        marketCap = shares * regularMarketPrice;
        console.log(`Computed marketCap for ${ticker}: ${marketCap} (shares: ${shares}, price: ${regularMarketPrice})`);
      } else {
        console.warn(`Market cap unavailable for ${ticker}. Tried: price.marketCap, summaryDetail.marketCap, computed (shares: ${shares}, price: ${regularMarketPrice})`);
      }
    }

    // P/E Ratio (Trailing) with fallbacks
    let trailingPE = summaryDetail.trailingPE?.raw ?? defaultKeyStats.trailingPE?.raw ?? null;
    
    if (!trailingPE) {
      const eps = financialData.epsTrailingTwelveMonths?.raw ?? null;
      if (eps && eps > 0 && regularMarketPrice) {
        trailingPE = regularMarketPrice / eps;
      }
    }

    // Forward P/E (optional)
    const forwardPE = summaryDetail.forwardPE?.raw ?? defaultKeyStats.forwardPE?.raw ?? null;

    // Company name
    const companyName = priceData.longName ?? priceData.shortName ?? ticker;

    // Market time
    const marketTime = priceData.regularMarketTime 
      ? new Date(priceData.regularMarketTime * 1000).toLocaleString('en-US', { 
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
        });

    // Price data (60s cache)
    const priceResult = {
      ticker,
      companyName,
      currentPrice: regularMarketPrice,
      priceChangePercent: changePercent,
      volumeRaw: volume,
      low52Week,
      high52Week,
      asOfTime: marketTime,
    };

    // Fundamentals data (24h cache)
    const fundamentalsResult = {
      marketCapRaw: marketCap,
      peRatio: trailingPE,
      forwardPE,
      eps: financialData.epsTrailingTwelveMonths?.raw ?? null,
    };

    // Store in respective caches
    priceCache.set(ticker, { data: priceResult, timestamp: now });
    fundamentalsCache.set(ticker, { data: fundamentalsResult, timestamp: now });

    return { ...priceResult, ...fundamentalsResult };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    throw error;
  }
}


function formatVolume(value: number | null): string {
  if (!value || value <= 0) return '—';
  
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)} B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)} M`;
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
        marketCapDisplay: formatMarketCapToSigFigs(stock.marketCapRaw),
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
