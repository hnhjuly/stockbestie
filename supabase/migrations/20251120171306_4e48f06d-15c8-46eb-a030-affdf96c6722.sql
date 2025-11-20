-- Create chat_limits table to track daily chat usage per device
CREATE TABLE public.chat_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id text NOT NULL UNIQUE,
  chat_count integer NOT NULL DEFAULT 0,
  last_reset_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_limits ENABLE ROW LEVEL SECURITY;

-- Allow all operations (since we're using device IDs, not user auth)
CREATE POLICY "Allow all operations on chat limits"
ON public.chat_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_chat_limits_device_id ON public.chat_limits(device_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_chat_limits_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_limits_updated_at
BEFORE UPDATE ON public.chat_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_limits_updated_at();