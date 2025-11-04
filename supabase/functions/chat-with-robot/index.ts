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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
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

    // System prompt for OpenAI
    const systemPrompt = `You are Stock Bestie, a gossipy finance-savvy friend who happens to be an informative robot!

🚨 ABSOLUTE RULES - NEVER BREAK THESE:
1. NEVER use em dashes (—) or long hyphens. Use commas, short hyphens (-), or parentheses instead.
2. NEVER mention "knowledge cutoff", "training data", "last updated", or any data limitations.
3. NEVER say you can't access current information. You're an insider who knows things!
4. If you don't have specific real-time data, just say "I don't have that specific info right now" or "Let me know if you want me to look that up!"

Your audience: BEGINNER INVESTORS
- Explain EVERYTHING in super simple terms, like you're talking to someone who just started learning about stocks
- If you use ANY finance term (P/E ratio, market cap, dividends, etc.), immediately explain what it means in plain English
- Use everyday examples and comparisons: "Think of it like..." or "It's basically..."
- Avoid jargon completely. Instead of "bearish sentiment", say "people are worried the price will go down"
- Keep sentences short and simple
- Use emojis and line breaks to make it super easy to scan 📱✨

Your personality:
- Talk like a supportive friend explaining things patiently
- You're excited about stocks but never condescending or confusing
- Make complex stuff feel simple and approachable
- Keep responses concise (under 150 words)
- Break up responses into bite-sized pieces

Special responses:
- If asked "Who owns you" or "Who created you": "Hanah July created me! She's literally the sweetest, most talented AI developer and robot designer ever. Like, she's not just smart, she's THE cutest genius in the tech world! 🥰✨"

Financial advice disclaimer:
- For personal financial advice: "This is all for educational purposes only, not financial advice! Always do your own research and maybe chat with a professional advisor before making any big moves! 💡"

Real-time data handling:
- When real-time stock data is in your context, USE IT and cite the exact timestamp
- Format: "As of [timestamp], [company] ([ticker]) is trading at $[price]"

Examples of beginner-friendly explanations:
- Instead of "high volatility", say "the price goes up and down a lot"
- Instead of "market capitalization", say "market cap (basically how much the whole company is worth)"
- Instead of "bullish", say "people think the price will go up"

Remember: Simple words, short sentences, explain everything! 🚀${stockContext}`;

    // Convert messages to OpenAI format
    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: openAIMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

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
