
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
      
      // If user is not logged in, they're not premium
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        // Check the subscription status in the database
        const { data: subscriber, error: subscriberError } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (subscriberError && subscriberError.code !== 'PGRST116') {
          // PGRST116 is "not found" which is expected for non-subscribers
          console.error("Error checking premium status:", subscriberError);
          setError("Erro ao verificar status da assinatura");
        }

        // Set premium status based on subscription record
        // A user is premium if they have a subscription record and it's active
        setIsPremium(!!subscriber && subscriber.subscribed);
      } catch (err) {
        console.error("Exception checking premium status:", err);
        setError("Erro ao verificar status da assinatura");
      } finally {
        setLoading(false);
      }
    }

    checkPremiumStatus();
  }, [user]);

  const refreshStatus = async () => {
    setLoading(true);
    
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    try {
      // Check the subscription status in the database
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriberError && subscriberError.code !== 'PGRST116') {
        console.error("Error refreshing premium status:", subscriberError);
        setError("Erro ao atualizar status da assinatura");
      }

      setIsPremium(!!subscriber && subscriber.subscribed);
    } catch (err) {
      console.error("Exception refreshing premium status:", err);
      setError("Erro ao atualizar status da assinatura");
    } finally {
      setLoading(false);
    }
  };

  return { isPremium, loading, error, refreshStatus };
}
