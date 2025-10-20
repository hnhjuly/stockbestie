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
        regularMarketPrice?: { raw?: number } | number;
        regularMarketChangePercent?: { raw?: number } | number;
        regularMarketVolume?: { raw?: number } | number;
        regularMarketTime?: number;
        marketCap?: { raw?: number };
        sharesOutstanding?: { raw?: number };
      };
      summaryDetail?: {
        marketCap?: { raw?: number };
        trailingPE?: { raw?: number };
        forwardPE?: { raw?: number };
      };
      defaultKeyStatistics?: {
        marketCap?: { raw?: number };
        trailingPE?: { raw?: number };
        forwardPE?: { raw?: number };
        sharesOutstanding?: { raw?: number };
        enterpriseValue?: { raw?: number };
      };
      financialData?: {
        epsTrailingTwelveMonths?: { raw?: number };
      };
    }>;
  };
}

function extractRawValue(field: any): number | undefined {
  if (typeof field === 'number') return field;
  if (field?.raw !== undefined) return field.raw;
  return undefined;
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

    const { price, summaryDetail, defaultKeyStatistics, financialData } = result;

    // Extract price and volume
    const marketPrice = extractRawValue(price?.regularMarketPrice) ?? 0;
    const changePercent = extractRawValue(price?.regularMarketChangePercent) ?? 0;
    const volume = extractRawValue(price?.regularMarketVolume) ?? 0;
    const marketTime = price?.regularMarketTime ?? Date.now() / 1000;

    // Market Cap with fallbacks
    let marketCap: number | null = null;
    marketCap = extractRawValue(price?.marketCap) ?? null;
    if (!marketCap) {
      marketCap = extractRawValue(summaryDetail?.marketCap) ?? null;
    }
    if (!marketCap) {
      // Try to compute from shares * price
      const shares = extractRawValue(defaultKeyStatistics?.sharesOutstanding) 
                     ?? extractRawValue(price?.sharesOutstanding);
      if (shares && marketPrice > 0) {
        marketCap = shares * marketPrice;
      }
    }

    // Debug logging for Market Cap
    if (!marketCap || marketCap === 0) {
      console.warn(`[${ticker}] Market Cap resolving to 0 or null. Tried:`, {
        'price.marketCap': price?.marketCap,
        'summaryDetail.marketCap': summaryDetail?.marketCap,
        'defaultKeyStatistics.sharesOutstanding': defaultKeyStatistics?.sharesOutstanding,
        'price.sharesOutstanding': price?.sharesOutstanding,
        'computed': marketCap
      });
    }

    // P/E Ratio with fallbacks
    let trailingPE: number | null = null;
    trailingPE = extractRawValue(summaryDetail?.trailingPE) ?? null;
    if (!trailingPE) {
      trailingPE = extractRawValue(defaultKeyStatistics?.trailingPE) ?? null;
    }
    if (!trailingPE) {
      // Try to compute from price / eps
      const eps = extractRawValue(financialData?.epsTrailingTwelveMonths);
      if (eps && eps > 0 && marketPrice > 0) {
        trailingPE = marketPrice / eps;
      }
    }

    const forwardPE = extractRawValue(summaryDetail?.forwardPE) 
                      ?? extractRawValue(defaultKeyStatistics?.forwardPE) 
                      ?? null;

    // Debug logging for P/E
    if (!trailingPE || trailingPE === 0) {
      console.warn(`[${ticker}] P/E resolving to 0 or null. Tried:`, {
        'summaryDetail.trailingPE': summaryDetail?.trailingPE,
        'defaultKeyStatistics.trailingPE': defaultKeyStatistics?.trailingPE,
        'financialData.epsTrailingTwelveMonths': financialData?.epsTrailingTwelveMonths,
        'computed': trailingPE,
        'forwardPE': forwardPE
      });
    }

    const stockData = {
      ticker,
      companyName: ticker, // Yahoo quoteSummary doesn't provide name directly
      currentPrice: marketPrice,
      priceChangePercent: changePercent,
      marketCapRaw: marketCap,
      volumeRaw: volume,
      peRatio: trailingPE,
      forwardPE: forwardPE,
      low52Week: 0, // Not available in this endpoint
      high52Week: 0, // Not available in this endpoint
      eps: extractRawValue(financialData?.epsTrailingTwelveMonths) ?? null,
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
  if (!value || value === 0) return '—';
  
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
      .map(stock => {
        // Format P/E ratio
        let peRatioDisplay = 'N/A';
        if (stock.peRatio && stock.peRatio > 0) {
          peRatioDisplay = stock.peRatio.toFixed(2);
        } else if (stock.forwardPE && stock.forwardPE > 0) {
          peRatioDisplay = `${stock.forwardPE.toFixed(2)} (fwd)`;
        }

        return {
          ...stock,
          marketCapDisplay: formatMarketCap(stock.marketCapRaw),
          volumeDisplay: formatVolume(stock.volumeRaw),
          peRatioDisplay,
          analystPrediction: `Data from Yahoo Finance - ${stock.priceChangePercent > 0 ? 'Positive' : 'Negative'} movement today`,
        };
      });

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
