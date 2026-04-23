import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY');

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // ===== AUTH GATING (login required) =====
    const authHeader = req.headers.get('Authorization') || '';
    let authUserId: string | null = null;
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      if (SUPABASE_ANON_KEY && token !== SUPABASE_ANON_KEY) {
        try {
          const { data: userData } = await supabase.auth.getUser(token);
          if (userData?.user?.id) authUserId = userData.user.id;
        } catch (_e) { /* ignore */ }
      }
    }

    if (!authUserId) {
      return new Response(
        JSON.stringify({ loginRequired: true, error: 'Please sign in to use the Budget Planner 💛' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ===== DAILY LIMIT (3 budget allocations per day) =====
    const today = new Date().toISOString().split('T')[0];
    const { data: limitRecord } = await supabase
      .from('budget_limits')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    let currentCount = 0;
    if (limitRecord) {
      currentCount = limitRecord.last_reset_date === today ? limitRecord.budget_count : 0;
    }

    if (currentCount >= 3) {
      return new Response(
        JSON.stringify({
          limitReached: true,
          error: "You've used your 3 budget allocations for today bestie! 💛 Come back tomorrow."
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI is busy, please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
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

    // Increment usage counter (only on success)
    if (limitRecord) {
      await supabase
        .from('budget_limits')
        .update({ budget_count: currentCount + 1, last_reset_date: today })
        .eq('auth_user_id', authUserId);
    } else {
      await supabase
        .from('budget_limits')
        .insert({ auth_user_id: authUserId, budget_count: 1, last_reset_date: today });
    }

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
