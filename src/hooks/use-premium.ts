
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPremiumStatus() {
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_end')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } else {
        const isActive = data?.subscribed && 
          (!data.subscription_end || new Date(data.subscription_end) > new Date());
        setIsPremium(isActive);
      }
      setLoading(false);
    }

    checkPremiumStatus();
  }, [user]);

  return { isPremium, loading };
}
