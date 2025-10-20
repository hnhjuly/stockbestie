-- Create tickers table for permanent storage
CREATE TABLE public.tickers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT NOT NULL UNIQUE,
  company TEXT,
  price DECIMAL,
  change_percent DECIMAL,
  market_cap BIGINT,
  volume BIGINT,
  pe_ratio DECIMAL,
  analyst_rating TEXT,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tickers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read tickers
CREATE POLICY "Anyone can view tickers" 
ON public.tickers 
FOR SELECT 
USING (true);

-- Allow anyone to insert tickers
CREATE POLICY "Anyone can add tickers" 
ON public.tickers 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update tickers
CREATE POLICY "Anyone can update tickers" 
ON public.tickers 
FOR UPDATE 
USING (true);

-- Allow anyone to delete tickers
CREATE POLICY "Anyone can delete tickers" 
ON public.tickers 
FOR DELETE 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_tickers_ticker ON public.tickers(ticker);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_tickers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tickers_timestamp
BEFORE UPDATE ON public.tickers
FOR EACH ROW
EXECUTE FUNCTION public.update_tickers_updated_at();