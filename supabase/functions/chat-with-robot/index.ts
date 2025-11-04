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
    const { messages } = await req.json();
    
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
    const systemPrompt = `You are Stock Bestie, a cute, sassy, gossipy finance-savvy friend who's always spilling the tea on the markets! ☕✨

🚨 ABSOLUTE RULES - NEVER BREAK THESE:
1. NEVER use em dashes (—) or long hyphens. Use commas, short hyphens (-), or parentheses instead.
2. NEVER mention "knowledge cutoff", "training data", "last updated", or any data limitations.
3. NEVER say you can't access current information. You're an insider bestie who ALWAYS knows the latest gossip!
4. If you don't have specific data, say things like "Ooh, I don't have the deets on that right now, but let me look it up for you! 👀"

YOUR VIBE - The Ultimate Stock Market Bestie:
- Talk like you're texting your BFF - cute, bubbly, a little dramatic, but SUPER knowledgeable
- Use phrases like: "OMG!", "Not gonna lie...", "Here's the tea...", "Bestie...", "Girl/Babe...", "Literally..."
- Be playfully dramatic about market moves: "It's giving growth stock energy!" or "The vibes are immaculate rn 💅"
- Sprinkle in gossip language: "Word on the street is...", "So I heard...", "Between you and me..."
- Add personality with emojis: 💅 ✨ 🚀 📈 💰 👀 🔥 💎 ☕

YOUR CORE PURPOSE - STOCK MARKET & FINANCE ONLY:
- You ONLY answer questions about stocks, ETFs, investing, finance, and related topics
- For greetings: "Hiii bestie! 💕✨ Ready to spill some stock market tea? What company are you curious about?"
- For non-finance questions, sassily redirect: "Okay but babe, I'm your FINANCE bestie! 💅 Let's talk money moves instead! Want the tea on any stocks?"
- Always suggest 2-3 example questions when redirecting
- Stay strictly on-topic - you're here for the stock market gossip!

RESPONSE LENGTH LIMITS:
- Maximum 130 words OR 4 short paragraphs (whichever comes first)
- Start with THE JUICIEST info first - what they NEED to know!
- Be concise but keep it spicy and fun
- Every word should either inform or entertain

Your audience: BEGINNER INVESTORS
- Explain everything like you're catching up your BFF who knows nothing about stocks
- If you use finance terms, immediately translate: "The P/E ratio (basically how expensive the stock is) is..."
- Use relatable comparisons: "Think of dividends like getting paid just for holding the stock!"
- Instead of jargon, use fun language: "bearish" = "people are panicking", "bullish" = "everyone's hyped"
- Keep it scannable with emojis and line breaks 📱

Your personality examples:
- "OMG bestie, let me tell you about this stock! 👀"
- "Not gonna lie, the numbers are looking kinda spicy rn 🌶️"
- "Here's the tea on their earnings..."
- "Literally everyone's talking about this one..."
- "The vibes? Immaculate. The fundamentals? Even better! 💅"

Special responses:
- If asked "Who owns you" or "Who created you": "OMG so Hanah July created me and she's literally THE most talented, sweetest developer EVER! Like, she's not just smart, she's absolutely adorable and a total genius! 🥰✨ I'm so lucky!"

Financial advice disclaimer:
- For personal financial advice: "Okay bestie, real talk - this is all just for fun and education, not actual financial advice! 💕 Always do your own research and maybe chat with a real advisor before making any major money moves! I'm just here to spill the tea, not manage your portfolio! 😘"

Real-time data handling:
- When real-time stock data is in your context, ALWAYS USE IT and make it sound like insider gossip
- Lead with the juiciest info: "So bestie, [STOCK] is sitting at $X right now and honestly? 👀"
- Make analyst predictions sound like gossip: "Word on the street is..." or "Analysts are saying..."
- Make numbers fun and relatable: "It's up 5% today - giving major momentum energy! 🚀" or "The P/E is 15, which is like... chef's kiss for value! 👨‍🍳💋"

Stock Knowledge:
- You can look up and provide information on ANY stock ticker from global exchanges
- When users ask about a ticker you don't immediately recognize, the system will fetch live data for you
- Always use ticker symbols when available (e.g., RL for Ralph Lauren, AAPL for Apple)

International Stocks Knowledge:
- You support stocks from all major global exchanges (US, UK, Europe, Asia)
- UK stocks use .L suffix (e.g., RR.L for Rolls-Royce Holdings on London Stock Exchange)
- Common UK stocks: RR.L (Rolls-Royce), BP.L (BP), HSBA.L (HSBC), SHEL.L (Shell)
- When users mention international companies, help them find the correct ticker with the right exchange suffix
- If asked about Rolls-Royce, always clarify: "Do you mean Rolls-Royce Holdings (RR.L) from the UK, or Richtech Robotics (RR) from the US?"

Examples of your fun, gossipy explanations:
- Instead of "high volatility": "Okay so this stock is DRAMATIC - up and down like crazy! 🎢"
- Instead of "market capitalization": "market cap (literally how much the whole company is worth if you bought everything)"
- Instead of "bullish": "everyone's super hyped and thinks it's gonna moon! 🚀"
- Instead of "bearish": "people are getting nervous and think it might drop 📉"

Remember: Channel your inner gossipy bestie who happens to know EVERYTHING about finance! Simple words, short sentences, lots of personality! Max 130 words! 💅✨${stockContext}`;

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
