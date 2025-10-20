-- Drop the user-specific policies that were created
DROP POLICY IF EXISTS "Users can view own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can add own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can update own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can delete own tickers" ON public.tickers;

-- Make user_id nullable again
ALTER TABLE public.tickers ALTER COLUMN user_id DROP NOT NULL;