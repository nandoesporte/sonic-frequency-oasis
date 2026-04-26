import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface PremiumContextType {
  isPremium: boolean;
  /**
   * @deprecated Trial period was removed from the system.
   * Always returns false. Kept for backwards compatibility with existing consumers.
   */
  isInTrialPeriod: boolean;
  /**
   * @deprecated Trial period was removed from the system.
   * Always returns 0. Kept for backwards compatibility with existing consumers.
   */
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPremiumStatus = async () => {
    setError(null);

    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    try {
      const { data: subscriber, error: subscriberError } = await supabase
        .from("subscribers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subscriberError && subscriberError.code !== "PGRST116") {
        console.error("Error checking premium status:", subscriberError);
        setError("Erro ao verificar status da assinatura");
      }

      const isSubscribed = !!subscriber && subscriber.subscribed;
      setIsPremium(isSubscribed);
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

  // Trial period was removed: access is granted only via active subscription.
  const hasAccess = isPremium;

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        isInTrialPeriod: false,
        trialDaysLeft: 0,
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
