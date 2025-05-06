
-- Add is_trial and trial_* columns to subscribers table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'subscribers' 
                   AND column_name = 'is_trial') THEN
        ALTER TABLE public.subscribers ADD COLUMN is_trial BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'subscribers' 
                   AND column_name = 'trial_started_at') THEN
        ALTER TABLE public.subscribers ADD COLUMN trial_started_at TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'subscribers' 
                   AND column_name = 'trial_ends_at') THEN
        ALTER TABLE public.subscribers ADD COLUMN trial_ends_at TIMESTAMPTZ;
    END IF;
END
$$;

-- Create a function to start trial for new users
CREATE OR REPLACE FUNCTION public.start_trial_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
    NOW() + INTERVAL '7 days'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;

-- Create a trigger to automatically start a trial for new users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'start_trial_on_user_signup'
  ) THEN
    CREATE TRIGGER start_trial_on_user_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.start_trial_for_new_user();
  END IF;
END
$$;

-- Update any existing users that don't have a trial yet
INSERT INTO public.subscribers (
  user_id,
  email,
  subscribed,
  is_trial,
  trial_started_at,
  trial_ends_at
)
SELECT 
  id,
  email,
  FALSE,
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP + INTERVAL '7 days'
FROM 
  auth.users
WHERE 
  id NOT IN (SELECT user_id FROM public.subscribers)
ON CONFLICT (user_id) DO NOTHING;
