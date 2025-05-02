
-- First, enable RLS on subscribers table if not already enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to do everything
CREATE POLICY "Admins can do everything" 
ON public.subscribers
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create policy for users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscribers 
FOR SELECT 
USING (auth.uid() = user_id);

-- Make sure the is_admin function exists
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- This bypasses RLS checks due to SECURITY DEFINER
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = user_id
  );
END;
$function$;
