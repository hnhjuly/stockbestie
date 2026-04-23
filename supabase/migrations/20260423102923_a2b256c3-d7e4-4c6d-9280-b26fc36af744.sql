CREATE TABLE public.budget_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL UNIQUE,
  budget_count INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.budget_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget limits"
ON public.budget_limits FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own budget limits"
ON public.budget_limits FOR INSERT
TO authenticated
WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update own budget limits"
ON public.budget_limits FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_budget_limits_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_budget_limits_updated_at
BEFORE UPDATE ON public.budget_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_budget_limits_updated_at();