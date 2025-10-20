-- Add user_id column to tickers table
ALTER TABLE public.tickers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can add tickers" ON public.tickers;
DROP POLICY IF EXISTS "Anyone can delete tickers" ON public.tickers;
DROP POLICY IF EXISTS "Anyone can update tickers" ON public.tickers;
DROP POLICY IF EXISTS "Anyone can view tickers" ON public.tickers;

-- Create secure policies that require authentication
CREATE POLICY "Users can view their own tickers"
ON public.tickers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tickers"
ON public.tickers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickers"
ON public.tickers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tickers"
ON public.tickers
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);