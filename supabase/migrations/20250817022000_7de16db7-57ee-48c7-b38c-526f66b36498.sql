-- Restaurar trials para usuários antigos que não possuem assinatura ativa
UPDATE subscribers 
SET 
    is_trial = true,
    trial_started_at = NOW(),
    trial_ends_at = NOW() + INTERVAL '7 days',
    updated_at = NOW()
WHERE 
    subscribed = false 
    AND (is_trial = false OR trial_ends_at < NOW())
    AND user_id IS NOT NULL;