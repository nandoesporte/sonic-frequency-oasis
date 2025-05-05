
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isInTrialPeriod, setIsInTrialPeriod] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkPremiumStatus() {
      setError(null);
      
      // If user is not logged in, they're not premium
      if (!user) {
        setIsPremium(false);
        setIsInTrialPeriod(false);
        setTrialDaysLeft(0);
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
        const isSubscribed = !!subscriber && subscriber.subscribed;
        setIsPremium(isSubscribed);

        // Check if user is in trial period
        if (subscriber && subscriber.is_trial && subscriber.trial_ends_at) {
          const trialEnd = new Date(subscriber.trial_ends_at);
          const now = new Date();
          
          // Check if trial is still valid
          if (trialEnd > now) {
            setIsInTrialPeriod(true);
            
            // Calculate days left in trial
            const msPerDay = 1000 * 60 * 60 * 24;
            const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / msPerDay);
            setTrialDaysLeft(daysLeft);
          } else {
            setIsInTrialPeriod(false);
            setTrialDaysLeft(0);
          }
        } else {
          setIsInTrialPeriod(false);
          setTrialDaysLeft(0);
        }
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
      setIsInTrialPeriod(false);
      setTrialDaysLeft(0);
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
      
      // Check if user is in trial period
      if (subscriber && subscriber.is_trial && subscriber.trial_ends_at) {
        const trialEnd = new Date(subscriber.trial_ends_at);
        const now = new Date();
        
        // Check if trial is still valid
        if (trialEnd > now) {
          setIsInTrialPeriod(true);
          
          // Calculate days left in trial
          const msPerDay = 1000 * 60 * 60 * 24;
          const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / msPerDay);
          setTrialDaysLeft(daysLeft);
        } else {
          setIsInTrialPeriod(false);
          setTrialDaysLeft(0);
        }
      } else {
        setIsInTrialPeriod(false);
        setTrialDaysLeft(0);
      }
    } catch (err) {
      console.error("Exception refreshing premium status:", err);
      setError("Erro ao atualizar status da assinatura");
    } finally {
      setLoading(false);
    }
  };

  // Verificar se o usuário tem acesso a conteúdo premium
  // seja por assinatura ou por estar em período de teste
  const hasAccess = isPremium || isInTrialPeriod;

  return { 
    isPremium, 
    isInTrialPeriod, 
    trialDaysLeft, 
    hasAccess,
    loading, 
    error, 
    refreshStatus 
  };
}
