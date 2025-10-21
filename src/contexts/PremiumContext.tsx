import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface PremiumContextType {
  isPremium: boolean;
  isInTrialPeriod: boolean;
  trialDaysLeft: number;
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
  refreshStatus: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isInTrialPeriod, setIsInTrialPeriod] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPremiumStatus = async () => {
    setError(null);
    
    if (!user) {
      setIsPremium(false);
      setIsInTrialPeriod(false);
      setTrialDaysLeft(0);
      setLoading(false);
      return;
    }

    try {
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriberError && subscriberError.code !== 'PGRST116') {
        console.error("Error checking premium status:", subscriberError);
        setError("Erro ao verificar status da assinatura");
      }

      const isSubscribed = !!subscriber && subscriber.subscribed;
      setIsPremium(isSubscribed);

      if (subscriber && subscriber.is_trial && subscriber.trial_ends_at) {
        const trialEnd = new Date(subscriber.trial_ends_at);
        const now = new Date();
        
        if (trialEnd > now) {
          setIsInTrialPeriod(true);
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
  };

  useEffect(() => {
    checkPremiumStatus();
  }, [user]);

  const refreshStatus = async () => {
    setLoading(true);
    await checkPremiumStatus();
  };

  const hasAccess = isPremium || isInTrialPeriod;

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        isInTrialPeriod,
        trialDaysLeft,
        hasAccess,
        loading,
        error,
        refreshStatus,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
}
