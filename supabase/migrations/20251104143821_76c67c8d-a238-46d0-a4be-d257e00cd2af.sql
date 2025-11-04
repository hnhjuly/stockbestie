-- Create table to cache analyst summaries persistently
CREATE TABLE IF NOT EXISTS public.analyst_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT NOT NULL,
  analyst_rating TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(ticker, analyst_rating)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_analyst_summaries_ticker ON public.analyst_summaries(ticker);

-- Enable RLS (but allow all operations since this is system data)
ALTER TABLE public.analyst_summaries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (this is cached public data)
CREATE POLICY "Allow all operations on analyst summaries"
  ON public.analyst_summaries
  FOR ALL
  USING (true)
  WITH CHECK (true);