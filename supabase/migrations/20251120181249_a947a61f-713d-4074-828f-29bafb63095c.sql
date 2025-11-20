-- Update tickers table to use UUID for user_id and reference auth
ALTER TABLE tickers ALTER COLUMN user_id TYPE uuid USING 
  CASE 
    WHEN user_id IS NULL THEN NULL
    ELSE gen_random_uuid() 
  END;

-- Update chat_limits table to use UUID for device_id  
ALTER TABLE chat_limits RENAME COLUMN device_id TO user_id;
ALTER TABLE chat_limits ALTER COLUMN user_id TYPE uuid USING gen_random_uuid();

-- Drop existing permissive policies on tickers
DROP POLICY IF EXISTS "Enable delete for all users" ON tickers;
DROP POLICY IF EXISTS "Enable insert for all users" ON tickers;
DROP POLICY IF EXISTS "Enable read access for all users" ON tickers;
DROP POLICY IF EXISTS "Enable update for all users" ON tickers;

-- Create user-scoped RLS policies for tickers
CREATE POLICY "Users can view their own tickers"
ON tickers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own tickers"
ON tickers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tickers"
ON tickers FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own tickers"
ON tickers FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Update chat_limits RLS policies
DROP POLICY IF EXISTS "Allow all operations on chat limits" ON chat_limits;

CREATE POLICY "Users can view their own chat limits"
ON chat_limits FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chat limits"
ON chat_limits FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own chat limits"
ON chat_limits FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());