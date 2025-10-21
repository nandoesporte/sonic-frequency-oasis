-- Update the trigger function to use 30 days trial period
CREATE OR REPLACE FUNCTION public.start_trial_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.subscribers (
    user_id, 
    email, 
    subscribed, 
    is_trial, 
    trial_started_at, 
    trial_ends_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    FALSE, 
    TRUE, 
    NOW(), 
    NOW() + INTERVAL '30 days'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Reset all existing users to start 30-day trial from today
UPDATE public.subscribers
SET 
  is_trial = TRUE,
  trial_started_at = NOW(),
  trial_ends_at = NOW() + INTERVAL '30 days',
  subscribed = COALESCE(subscribed, FALSE)
WHERE user_id IS NOT NULL;