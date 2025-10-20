-- Add missing columns for 52-week low and high
ALTER TABLE tickers ADD COLUMN IF NOT EXISTS low52 numeric;
ALTER TABLE tickers ADD COLUMN IF NOT EXISTS high52 numeric;

-- Add analyst_label column (separate from analyst_rating for display purposes)
ALTER TABLE tickers ADD COLUMN IF NOT EXISTS analyst_label text;