-- Create table for stock tickers (portfolio)
CREATE TABLE public.portfolio_tickers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT NOT NULL UNIQUE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_tickers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read tickers (public portfolio)
CREATE POLICY "Anyone can view portfolio tickers" 
ON public.portfolio_tickers 
FOR SELECT 
USING (true);

-- Create policy for service role to insert/update/delete (for sync function)
CREATE POLICY "Service role can manage tickers" 
ON public.portfolio_tickers 
FOR ALL 
USING (auth.jwt()->>'role' = 'service_role');

-- Create index on ticker for faster lookups
CREATE INDEX idx_portfolio_tickers_ticker ON public.portfolio_tickers(ticker);

-- Create a table to track sync status
CREATE TABLE public.sync_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  last_sync_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL,
  error_message TEXT
);

ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sync status" 
ON public.sync_status 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage sync status" 
ON public.sync_status 
FOR ALL 
USING (auth.jwt()->>'role' = 'service_role');