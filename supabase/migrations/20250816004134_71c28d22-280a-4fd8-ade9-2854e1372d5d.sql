-- Atualizar a função de trial para novos usuários para ser chamada automaticamente
CREATE OR REPLACE FUNCTION public.start_trial_for_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para iniciar trial automaticamente quando um usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created_start_trial ON auth.users;
CREATE TRIGGER on_auth_user_created_start_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.start_trial_for_new_user();