
-- Create a view to safely access user information for admin purposes
CREATE OR REPLACE VIEW public.users_view AS
SELECT
  id,
  email,
  created_at,
  last_sign_in_at
FROM
  auth.users;

-- Grant the necessary permissions on the view
GRANT SELECT ON public.users_view TO authenticated;
