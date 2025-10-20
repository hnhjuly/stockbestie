-- Delete old tickers with null user_id
DELETE FROM public.tickers WHERE user_id IS NULL;

-- Drop any existing unique constraint on ticker alone
ALTER TABLE public.tickers DROP CONSTRAINT IF EXISTS tickers_ticker_key;

-- Add a unique constraint for ticker + user_id combination
-- This allows different devices to have the same ticker
ALTER TABLE public.tickers ADD CONSTRAINT tickers_ticker_user_id_key UNIQUE (ticker, user_id);