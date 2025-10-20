-- Drop user-scoped policies
DROP POLICY IF EXISTS "Users can view their own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can insert their own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can update their own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can delete their own tickers" ON public.tickers;

-- Restore public access policies
CREATE POLICY "Anyone can view tickers"
ON public.tickers
FOR SELECT
USING (true);

CREATE POLICY "Anyone can add tickers"
ON public.tickers
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update tickers"
ON public.tickers
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete tickers"
ON public.tickers
FOR DELETE
USING (true);

-- Make user_id nullable and remove the foreign key constraint
ALTER TABLE public.tickers ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.tickers DROP CONSTRAINT IF EXISTS tickers_user_id_fkey;