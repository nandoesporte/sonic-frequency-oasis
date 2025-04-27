
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkPremiumStatus() {
      setError(null);
      
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('subscribed, subscription_end')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
          console.error('Error checking premium status:', error);
          setError(error.message);
          setIsPremium(false);
        } else if (data) {
          const isActive = data.subscribed && 
            (!data.subscription_end || new Date(data.subscription_end) > new Date());
          setIsPremium(isActive);
        } else {
          // Não tem registro de assinatura
          setIsPremium(false);
        }
      } catch (err) {
        console.error('Exception checking premium status:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    }

    checkPremiumStatus();
  }, [user]);

  const refreshStatus = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
    
    // This will trigger the useEffect above
    if (user) {
      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('subscribed, subscription_end')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error refreshing premium status:', error);
          setError(error.message);
          setIsPremium(false);
        } else if (data) {
          const isActive = data.subscribed && 
            (!data.subscription_end || new Date(data.subscription_end) > new Date());
          setIsPremium(isActive);
        } else {
          setIsPremium(false);
        }
      } catch (err) {
        console.error('Exception refreshing premium status:', err);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    } else {
      setIsPremium(false);
      setLoading(false);
    }
  };

  return { isPremium, loading, error, refreshStatus };
}
