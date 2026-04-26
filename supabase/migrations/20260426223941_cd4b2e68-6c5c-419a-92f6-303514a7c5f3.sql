-- 1. Drop any trigger on auth.users that calls start_trial_for_new_user
DO $$
DECLARE
    trig RECORD;
BEGIN
    FOR trig IN
        SELECT tgname
        FROM pg_trigger t
        JOIN pg_class c ON c.oid = t.tgrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'auth'
          AND c.relname = 'users'
          AND NOT t.tgisinternal
          AND pg_get_triggerdef(t.oid) ILIKE '%start_trial_for_new_user%'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users', trig.tgname);
    END LOOP;
END
$$;

-- 2. Drop the trial-creation function itself
DROP FUNCTION IF EXISTS public.start_trial_for_new_user() CASCADE;

-- 3. Expire any currently-active trial so nobody keeps free access
UPDATE public.subscribers
SET is_trial = false,
    trial_ends_at = NULL,
    updated_at = now()
WHERE is_trial = true;