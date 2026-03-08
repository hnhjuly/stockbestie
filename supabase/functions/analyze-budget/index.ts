import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency, assetType, categories, riskLevel } = await req.json();

    console.log('Budget analysis request:', { amount, currency, assetType, categories, riskLevel });

    const systemPrompt = `You are a financial allocation assistant. Given a budget and preferences, suggest a diversified portfolio allocation.

RULES:
- Return ONLY valid JSON, no markdown or extra text
- Allocations must sum to exactly 100%
- Use real, well-known stock tickers and ETF symbols
- Match allocations to the user's risk level:
  - "chill": Focus on stable ETFs, dividend stocks, bonds (VOO, VTI, SCHD)
  - "okay": Mix of growth and stability (QQQ, SPY, AAPL, MSFT)
  - "brave": More individual stocks, growth-focused (NVDA, TSLA, AMD)
- Include 4-6 allocations
- Reasoning should be 1-2 sentences max

Response format:
{
  "allocations": [
    {
      "ticker": "SYMBOL",
      "name": "Company/Fund Name",
      "percentage": 25,
      "amount": 2500,
      "type": "stock" or "etf",
      "reasoning": "Brief reason"
    }
  ],
  "summary": "One sentence overview",
  "riskNote": "Brief risk disclaimer"
}`;

    const userPrompt = `Budget: ${currency} ${amount.toLocaleString()}
Asset Types: ${assetType}
Categories: ${categories.join(', ')}
Risk Level: ${riskLevel}

Create a portfolio allocation for this investor.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('Raw AI response:', content);

    // Parse the JSON response
    let result;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Calculate amounts based on percentages
    result.allocations = result.allocations.map((alloc: any) => ({
      ...alloc,
      amount: Math.round((alloc.percentage / 100) * amount),
    }));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in analyze-budget:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
