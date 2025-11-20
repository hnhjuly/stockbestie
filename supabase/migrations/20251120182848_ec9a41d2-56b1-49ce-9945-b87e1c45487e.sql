-- Revert authentication changes and restore device_id based system

-- Drop ALL existing RLS policies on tickers
DROP POLICY IF EXISTS "Users can view their own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can insert their own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can update their own tickers" ON public.tickers;
DROP POLICY IF EXISTS "Users can delete their own tickers" ON public.tickers;

-- Drop ALL existing RLS policies on chat_limits
DROP POLICY IF EXISTS "Users can view their own chat limits" ON public.chat_limits;
DROP POLICY IF EXISTS "Users can insert their own chat limits" ON public.chat_limits;
DROP POLICY IF EXISTS "Users can update their own chat limits" ON public.chat_limits;

-- Now we can safely alter the columns
-- Change tickers.user_id back to text for device IDs
ALTER TABLE public.tickers ALTER COLUMN user_id TYPE text;

-- Rename chat_limits.user_id back to device_id and change to text
ALTER TABLE public.chat_limits RENAME COLUMN user_id TO device_id;
ALTER TABLE public.chat_limits ALTER COLUMN device_id TYPE text;

-- Restore original open RLS policies on tickers
CREATE POLICY "Allow public to view all tickers"
ON public.tickers FOR SELECT
USING (true);

CREATE POLICY "Allow public to insert tickers"
ON public.tickers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public to update tickers"
ON public.tickers FOR UPDATE
USING (true);

CREATE POLICY "Allow public to delete tickers"
ON public.tickers FOR DELETE
USING (true);

-- Restore original RLS policies on chat_limits
CREATE POLICY "Allow public to view chat limits"
ON public.chat_limits FOR SELECT
USING (true);

CREATE POLICY "Allow public to insert chat limits"
ON public.chat_limits FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public to update chat limits"
ON public.chat_limits FOR UPDATE
USING (true);