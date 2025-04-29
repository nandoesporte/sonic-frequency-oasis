
-- First, disable Row Level Security on the admin_users table to remove any problematic policies
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Now re-enable RLS with simpler, non-recursive policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create a function that checks if a user is an admin without causing recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = user_id
  );
$$;

-- Create policy for admins to read admin_users table
CREATE POLICY "Admins can read admin_users" 
ON public.admin_users
FOR SELECT 
USING (
  public.is_admin(auth.uid())
);

-- Create policy for admins to modify admin_users table
CREATE POLICY "Admins can insert into admin_users" 
ON public.admin_users
FOR INSERT 
WITH CHECK (
  public.is_admin(auth.uid())
);

-- Create policy for admins to update admin_users table
CREATE POLICY "Admins can update admin_users" 
ON public.admin_users
FOR UPDATE 
USING (
  public.is_admin(auth.uid())
);

-- Create policy for admins to delete from admin_users table
CREATE POLICY "Admins can delete from admin_users" 
ON public.admin_users
FOR DELETE 
USING (
  public.is_admin(auth.uid())
);
