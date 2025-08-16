-- Verificar se a trigger existe e recriar se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recriar a função start_trial_for_new_user
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

-- Criar a trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.start_trial_for_new_user();

-- Criar registros de trial para usuários existentes que não têm
INSERT INTO public.subscribers (user_id, email, subscribed, is_trial, trial_started_at, trial_ends_at)
SELECT 
  u.id, 
  u.email, 
  FALSE, 
  TRUE, 
  u.created_at, 
  u.created_at + INTERVAL '7 days'
FROM auth.users u
LEFT JOIN public.subscribers s ON u.id = s.user_id
WHERE s.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;