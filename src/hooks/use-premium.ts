
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
      
      // Since all frequencies are now premium, always show premium content if user is logged in
      if (user) {
        setIsPremium(true);
        setLoading(false);
        return;
      }

      setIsPremium(false);
      setLoading(false);
    }

    checkPremiumStatus();
  }, [user]);

  const refreshStatus = async () => {
    setLoading(true);
    
    if (user) {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }
    
    setLoading(false);
  };

  return { isPremium, loading, error, refreshStatus };
}
