-- Drop old permissive policies on tickers
DROP POLICY IF EXISTS "Allow public to view all tickers" ON public.tickers;
DROP POLICY IF EXISTS "Allow public to insert tickers" ON public.tickers;
DROP POLICY IF EXISTS "Allow public to update tickers" ON public.tickers;
DROP POLICY IF EXISTS "Allow public to delete tickers" ON public.tickers;

-- New RLS policies using auth_user_id
CREATE POLICY "Users can view own tickers"
  ON public.tickers FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own tickers"
  ON public.tickers FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update own tickers"
  ON public.tickers FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can delete own tickers"
  ON public.tickers FOR DELETE
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Drop old permissive policies on chat_limits
DROP POLICY IF EXISTS "Allow public to view chat limits" ON public.chat_limits;
DROP POLICY IF EXISTS "Allow public to insert chat limits" ON public.chat_limits;
DROP POLICY IF EXISTS "Allow public to update chat limits" ON public.chat_limits;

-- Add user_id column to chat_limits
ALTER TABLE public.chat_limits ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- New RLS policies for chat_limits
CREATE POLICY "Users can view own chat limits"
  ON public.chat_limits FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own chat limits"
  ON public.chat_limits FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update own chat limits"
  ON public.chat_limits FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid());