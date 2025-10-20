-- Change user_id column from uuid to text to support device IDs
ALTER TABLE public.tickers ALTER COLUMN user_id TYPE text USING user_id::text;