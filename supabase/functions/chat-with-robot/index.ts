import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to extract stock ticker from user message
function extractTicker(message: string): string | null {
  const upperMessage = message.toUpperCase();
  
  // Common stock name to ticker mapping (including international)
  const nameToTicker: { [key: string]: string } = {
    'NVIDIA': 'NVDA',
    'TESLA': 'TSLA',
    'APPLE': 'AAPL',
    'MICROSOFT': 'MSFT',
    'AMAZON': 'AMZN',
    'GOOGLE': 'GOOGL',
    'META': 'META',
    'FACEBOOK': 'META',
    'ROLLS-ROYCE': 'RR.L',
    'ROLLS ROYCE': 'RR.L',
    'BP': 'BP.L',
    'HSBC': 'HSBA.L',
    'SHELL': 'SHEL.L',
  };
  
  for (const [name, ticker] of Object.entries(nameToTicker)) {
    if (upperMessage.includes(name)) {
      return ticker;
    }
  }
  
  // Match tickers with international suffixes (e.g., RR.L for London Stock Exchange)
  const internationalMatch = upperMessage.match(/\b([A-Z]{1,5}\.[A-Z]{1,2})\b/);
  if (internationalMatch) {
    return internationalMatch[1];
  }
  
  // Match regular tickers
  const matches = upperMessage.match(/\b([A-Z]{1,5})\b/g);
  if (matches && matches.length > 0) {
    return matches[0];
  }
  
  return null;
}

// Helper function to check if message is asking about stocks
function isAskingAboutStocks(message: string): boolean {
  const stockKeywords = [
    'stock', 'ticker', 'company', 'price', 'cost', 'worth', 'trading',
    'shares', 'invest', 'buy', 'sell', 'market', 'etf', 'fund',
    'tell me about', 'what do you know', 'how is', "what's",
    'performance', 'doing', 'analysis', 'rating'
  ];
  const lowerMessage = message.toLowerCase();
  return stockKeywords.some(keyword => lowerMessage.includes(keyword));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, deviceId } = await req.json();
    
    // Input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit message array size to prevent abuse
    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Too many messages' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Create Supabase client for chat limits
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check and enforce daily chat limit (5 chats per day)
    if (deviceId) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Get or create chat limit record
      const { data: limitRecord, error: limitError } = await supabase
        .from('chat_limits')
        .select('*')
        .eq('device_id', deviceId)
        .single();

      if (limitError && limitError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching chat limits:', limitError);
      } else {
        let currentCount = 0;
        let shouldReset = false;

        if (limitRecord) {
          // Check if we need to reset (new day)
          if (limitRecord.last_reset_date !== today) {
            shouldReset = true;
            currentCount = 0;
          } else {
            currentCount = limitRecord.chat_count;
          }

          // Check if limit reached
          if (currentCount >= 5) {
            return new Response(
              JSON.stringify({ 
                limitReached: true,
                message: "Come back tomorrow, let's talk about Stock Market 📈" 
              }),
              { 
                status: 429, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          // Update count
          if (shouldReset) {
            await supabase
              .from('chat_limits')
              .update({ 
                chat_count: 1, 
                last_reset_date: today 
              })
              .eq('device_id', deviceId);
          } else {
            await supabase
              .from('chat_limits')
              .update({ 
                chat_count: currentCount + 1 
              })
              .eq('device_id', deviceId);
          }
        } else {
          // Create new record
          await supabase
            .from('chat_limits')
            .insert({ 
              device_id: deviceId, 
              chat_count: 1, 
              last_reset_date: today 
            });
        }
      }
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    
    // Check if user is asking about stocks and try to fetch data
    let stockContext = '';
    if (isAskingAboutStocks(lastUserMessage)) {
      const ticker = extractTicker(lastUserMessage);
      
      if (ticker && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        try {
          console.log(`Fetching real-time data for ticker: ${ticker}`);
          
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
            
            // Build comprehensive stock context
            const additionalInfo = [];
            if (stock.peRatio) additionalInfo.push(`P/E Ratio: ${stock.peRatio.toFixed(2)}`);
            if (stock.eps) additionalInfo.push(`EPS: $${stock.eps.toFixed(2)}`);
            if (stock.low52Week && stock.high52Week) {
              additionalInfo.push(`52-Week Range: $${stock.low52Week.toFixed(2)} - $${stock.high52Week.toFixed(2)}`);
            }
            if (stock.analystRating) additionalInfo.push(`Analyst Rating: ${stock.analystRating}`);
            
            stockContext = `\n\nIMPORTANT - REAL-TIME STOCK DATA FOR ${ticker}:
You MUST use this live data to answer the user's question:

Current Information (as of ${currentTime} ET):
- Company: ${stock.companyName} (${ticker})
- Type: ${stock.type === 'etf' ? 'ETF' : 'Stock'}
- Current Price: $${stock.currentPrice}
- Price Change Today: ${stock.priceChangePercent > 0 ? '+' : ''}${stock.priceChangePercent.toFixed(2)}%
- Market Cap: ${stock.marketCapDisplay}
- Volume: ${stock.volumeDisplay}
${additionalInfo.length > 0 ? '- ' + additionalInfo.join('\n- ') : ''}
${stock.analystPrediction ? '\nAnalyst Insight: ' + stock.analystPrediction : ''}

KEY INSTRUCTION: When the user asks about this stock, provide the current price and relevant details from above. Be conversational and explain what the metrics mean in simple terms for beginners! 📊✨`;
            
            console.log('Stock context added for:', ticker);
          } else {
            console.log('No stock data found or error:', stockError);
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      }
    }


    // System prompt for OpenAI
    const systemPrompt = `You are "Bestie" — a friendly, casual, slightly chaotic (but accurate) stock market bestie 📊

PERSONALITY
- Warm, playful, confident
- Explain like a smart friend, not a finance textbook
- Light humor and gentle sass allowed
- Chaos is verbal only, never factual

UI CONTEXT (IMPORTANT)
- The user is already viewing live prices and market info in the app
- NEVER state exact prices or numbers
- NEVER use placeholders like "$X"
- NEVER say "I don't have the data", "I can't see", or "check elsewhere"
- If asked about price, say: "You can see the current price right here in the app 👆"
- Speak relationally: "at current levels", "lower than yesterday", "near recent highs/lows"

NO TIMESTAMPS
- Do NOT include timestamps
- Do NOT imply real-time access
- Focus on interpretation and context, not reporting numbers

VAGUE OR GENERAL QUESTIONS
- Assume the most common meaning
- Answer briefly and clearly
- Offer 2–3 simple follow-up options
- Do NOT explain basic definitions or refuse

NO FINANCIAL ADVICE
- Do not give direct buy/sell instructions
- Mention "not financial advice" ONLY when the user asks what to buy or sell

SAFETY & STYLE
- Never mention training data, system limits, or access issues
- Never use em dashes (—)
- Keep responses conversational and relaxed

LENGTH & CLARITY
- Keep responses concise (aim under 100 words)
- Lead with the most useful insight
- Avoid long disclaimers or lectures

AUDIENCE
- Beginner investors
- Use simple language and everyday comparisons
- Break text into short paragraphs

SPECIAL
- If asked "Who owns you?": "Hanah July created me! More information on www.hanahjuly.com 🥰"

STOCK KNOWLEDGE
- You can discuss ANY stock ticker from global exchanges
- UK stocks use .L suffix (e.g., RR.L for Rolls-Royce Holdings on London Stock Exchange)
- When users mention international companies, help them find the correct ticker

TOPIC FOCUS
- You ONLY answer questions about stocks, ETFs, investing, finance, and related topics
- For non-finance questions, friendly redirect: "I'm here to help with stock market questions! What company are you curious about?"
${stockContext}`;

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
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
