
-- Temporarily disable Row Level Security on the admin_users table to reset policies
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Update the is_admin function to use a direct database connection without RLS checks
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Using SECURITY DEFINER ensures this bypasses RLS checks
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = user_id
  );
END;
$$;

-- Re-enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Delete all existing policies on admin_users to start clean
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert into admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can delete from admin_users" ON public.admin_users;

-- Create a special bootstrap policy to allow the first admin user to access the table
-- This policy uses auth.uid() directly without calling the is_admin function
CREATE POLICY "Bootstrap admin access" ON public.admin_users
FOR ALL
USING (auth.uid() = user_id);

-- Create policies for admin users that use the is_admin function
-- These will only be relevant after the first admin has been created
CREATE POLICY "Admins can read admin_users" ON public.admin_users
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert into admin_users" ON public.admin_users
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update admin_users" ON public.admin_users
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete from admin_users" ON public.admin_users
FOR DELETE 
USING (is_admin(auth.uid()));
