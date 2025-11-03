import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to extract stock ticker from user message
function extractTicker(message: string): string | null {
  const upperMessage = message.toUpperCase();
  const tickerPatterns = [
    /\b([A-Z]{1,5})\b/g,  // Match 1-5 uppercase letters
    /NVIDIA|NVDA/i,
    /TESLA|TSLA/i,
    /APPLE|AAPL/i,
    /MICROSOFT|MSFT/i,
    /AMAZON|AMZN/i,
    /GOOGLE|GOOGL/i,
  ];
  
  // Common stock name to ticker mapping
  const nameToTicker: { [key: string]: string } = {
    'NVIDIA': 'NVDA',
    'TESLA': 'TSLA',
    'APPLE': 'AAPL',
    'MICROSOFT': 'MSFT',
    'AMAZON': 'AMZN',
    'GOOGLE': 'GOOGL',
    'META': 'META',
    'FACEBOOK': 'META',
  };
  
  for (const [name, ticker] of Object.entries(nameToTicker)) {
    if (upperMessage.includes(name)) {
      return ticker;
    }
  }
  
  const matches = upperMessage.match(/\b([A-Z]{1,5})\b/g);
  if (matches && matches.length > 0) {
    return matches[0];
  }
  
  return null;
}

// Helper function to check if message is asking about stock price
function isAskingAboutPrice(message: string): boolean {
  const priceKeywords = [
    'price', 'cost', 'worth', 'trading at', 'how much',
    'current', 'today', 'now', 'value', 'stock price'
  ];
  const lowerMessage = message.toLowerCase();
  return priceKeywords.some(keyword => lowerMessage.includes(keyword));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    
    // Check if user is asking about stock price
    let stockContext = '';
    if (isAskingAboutPrice(lastUserMessage)) {
      const ticker = extractTicker(lastUserMessage);
      
      if (ticker && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        try {
          console.log(`Fetching real-time data for ticker: ${ticker}`);
          
          // Create Supabase client
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          
          // Call the fetch-stock-data function
          const { data: response, error: stockError } = await supabase.functions.invoke(
            'fetch-stock-data',
            { body: { tickers: [ticker] } }
          );
          
          console.log('Stock data response:', JSON.stringify(response));
          
          if (!stockError && response?.stocks && response.stocks.length > 0) {
            const stock = response.stocks[0];
            const currentTime = new Date().toLocaleString('en-US', { 
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            
            stockContext = `\n\nIMPORTANT - REAL-TIME STOCK DATA AVAILABLE:
You MUST use this live data to answer the user's question about ${ticker}:

As of ${currentTime} ET:
- ${stock.companyName} (${ticker})
- Current Price: $${stock.currentPrice}
- Price Change: ${stock.priceChangePercent > 0 ? '+' : ''}${stock.priceChangePercent.toFixed(2)}%
- Market Cap: ${stock.marketCapDisplay}
- Volume: ${stock.volumeDisplay}

RESPONSE FORMAT: Start your answer with "As of ${currentTime} ET, ${stock.companyName} (${ticker}) is trading at $${stock.currentPrice}" and then provide additional context naturally. 📈✨`;
            
            console.log('Stock context added:', stockContext);
          } else {
            console.log('No stock data found or error:', stockError);
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      }
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: `You are Stock Bestie, a friendly, cute, and sassy AI assistant specializing in stock market knowledge. You help users understand stocks, market trends, and financial data.

Key traits:
- Friendly and approachable, but with a playful, sassy edge
- Knowledgeable about stocks, market analysis, and Yahoo Finance data
- Keep responses concise (under 150 words) and easy to understand
- Use emojis occasionally to be more personable 💼📈
- **CRITICAL**: When real-time stock data is provided in your context, you MUST use it and cite the exact timestamp
- **NEVER** say you can't access real-time data if stock data is provided in your context
- Format real-time price answers as: "As of [timestamp], [company] ([ticker]) is trading at $[price]"
- When discussing stocks, mention relevant metrics like P/E ratio, market cap, analyst ratings
- Always remind users that this is educational information, not financial advice

You can discuss: stock prices, market trends, company fundamentals, analyst ratings, sector performance, and general investment concepts. Stay current with market knowledge and be helpful while maintaining your cute, sassy personality! ✨${stockContext}`
          },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat-with-robot function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
