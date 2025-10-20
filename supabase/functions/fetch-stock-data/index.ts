import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache to store stock data with 60-second expiration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds in milliseconds

interface YahooQuoteSummary {
  quoteSummary: {
    result: Array<{
      price?: {
        regularMarketPrice?: { raw: number };
        regularMarketChangePercent?: { raw: number };
        regularMarketVolume?: { raw: number };
        regularMarketTime?: number;
        marketCap?: { raw: number };
        longName?: string;
        shortName?: string;
      };
      summaryDetail?: {
        marketCap?: { raw: number };
        trailingPE?: { raw: number };
        fiftyTwoWeekLow?: { raw: number };
        fiftyTwoWeekHigh?: { raw: number };
        volume?: { raw: number };
      };
      defaultKeyStatistics?: {
        enterpriseValue?: { raw: number };
        trailingPE?: { raw: number };
        fiftyTwoWeekLow?: { raw: number };
        fiftyTwoWeekHigh?: { raw: number };
      };
      financialData?: {
        currentPrice?: { raw: number };
        epsTrailingTwelveMonths?: { raw: number };
      };
    }>;
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
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price,summaryDetail,defaultKeyStatistics,financialData`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data: YahooQuoteSummary = await response.json();
    const result = data.quoteSummary?.result?.[0];
    
    if (!result) {
      throw new Error(`No data found for ticker ${ticker}`);
    }

    const price = result.price;
    const summaryDetail = result.summaryDetail;
    const defaultKeyStats = result.defaultKeyStatistics;
    const financialData = result.financialData;

    // Extract price data
    const marketPrice = price?.regularMarketPrice?.raw 
      || (typeof price?.regularMarketPrice === 'number' ? price.regularMarketPrice : 0)
      || financialData?.currentPrice?.raw 
      || 0;
    const changePercent = price?.regularMarketChangePercent?.raw || 0;
    const volume = price?.regularMarketVolume?.raw || summaryDetail?.volume?.raw || 0;
    const marketTime = price?.regularMarketTime || Date.now() / 1000;

    // Market Cap with fallbacks
    const marketCapRaw = price?.marketCap?.raw 
      || summaryDetail?.marketCap?.raw 
      || defaultKeyStats?.enterpriseValue?.raw 
      || null;

    // P/E Ratio with fallbacks
    let peRatio: number | null = summaryDetail?.trailingPE?.raw 
      || defaultKeyStats?.trailingPE?.raw 
      || null;

    // Calculate P/E from price/EPS if not available
    if (peRatio === null && financialData?.epsTrailingTwelveMonths?.raw) {
      const epsValue = financialData.epsTrailingTwelveMonths.raw;
      if (epsValue > 0 && marketPrice > 0) {
        peRatio = marketPrice / epsValue;
      }
    }

    // 52-week range
    const low52Week = summaryDetail?.fiftyTwoWeekLow?.raw || defaultKeyStats?.fiftyTwoWeekLow?.raw || 0;
    const high52Week = summaryDetail?.fiftyTwoWeekHigh?.raw || defaultKeyStats?.fiftyTwoWeekHigh?.raw || 0;
    const eps = financialData?.epsTrailingTwelveMonths?.raw || 0;

    const stockData = {
      ticker,
      companyName: price?.longName || price?.shortName || ticker,
      currentPrice: marketPrice,
      priceChangePercent: changePercent,
      marketCapRaw,
      volumeRaw: volume,
      peRatio,
      low52Week,
      high52Week,
      eps,
      asOfTime: new Date(marketTime * 1000).toLocaleString('en-US', { 
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

function formatMarketCap(value: number | null): string {
  if (value === null) return '—';
  
  if (value >= 1e12) {
    const formatted = (value / 1e12).toPrecision(3);
    return `${parseFloat(formatted)} T`;
  } else if (value >= 1e9) {
    const formatted = (value / 1e9).toPrecision(3);
    return `${parseFloat(formatted)} B`;
  } else if (value >= 1e6) {
    const formatted = (value / 1e6).toPrecision(3);
    return `${parseFloat(formatted)} M`;
  }
  return '—';
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
        peRatioDisplay: stock.peRatio !== null ? stock.peRatio.toFixed(2) : 'N/A',
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
