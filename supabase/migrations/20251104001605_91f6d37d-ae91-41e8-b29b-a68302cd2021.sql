-- Fix RLS policies on tickers table to enforce device-based isolation
DROP POLICY IF EXISTS "Anyone can view tickers" ON public.tickers;
DROP POLICY IF EXISTS "Anyone can add tickers" ON public.tickers;
DROP POLICY IF EXISTS "Anyone can update tickers" ON public.tickers;
DROP POLICY IF EXISTS "Anyone can delete tickers" ON public.tickers;

-- Create device-based isolation policies
CREATE POLICY "Users can view own tickers"
  ON public.tickers FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = current_setting('request.headers', true)::json->>'x-device-id');

CREATE POLICY "Users can insert own tickers"
  ON public.tickers FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = current_setting('request.headers', true)::json->>'x-device-id');

CREATE POLICY "Users can update own tickers"
  ON public.tickers FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = current_setting('request.headers', true)::json->>'x-device-id');

CREATE POLICY "Users can delete own tickers"
  ON public.tickers FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = current_setting('request.headers', true)::json->>'x-device-id');

-- Restrict sync_status table to service role only
DROP POLICY IF EXISTS "Anyone can view sync status" ON public.sync_status;

CREATE POLICY "Service role can view sync status"
  ON public.sync_status FOR SELECT
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Add rate limiting table for edge functions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(key)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage rate limits"
  ON public.rate_limits FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);