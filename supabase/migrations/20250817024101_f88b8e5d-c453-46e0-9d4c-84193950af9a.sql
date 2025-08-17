UPDATE subscription_plans 
SET price = 39.90, updated_at = now()
WHERE name = 'Premium Mensal' AND interval = 'month';