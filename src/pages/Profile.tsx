
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePremium } from "@/contexts/PremiumContext";
import { UserProfile } from "@/components/profile/UserProfile";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

interface SubscriptionData {
  subscribed: boolean;
  subscription_end?: string;
  plan_id?: string;
  plan_name?: string;
  plan_description?: string;
  subscription_tier?: string;
  last_payment_date?: string;
  is_trial?: boolean;
  trial_ends_at?: string;
  trial_started_at?: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { isPremium, isInTrialPeriod, trialDaysLeft, loading: premiumLoading } = usePremium();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', profileError);
          toast({
            title: "Erro",
            description: "Não foi possível carregar as informações do perfil.",
            variant: "destructive",
          });
        }

        // Fetch subscription data
        const { data: subData, error: subError } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (subError && subError.code !== 'PGRST116') {
          console.error('Error fetching subscription data:', subError);
        }
        
        setUserData(profileData || { full_name: user.user_metadata?.full_name });
        
        // Get subscription plan info separately if needed
        let planName = "";
        let planDescription = "";
        
        if (subData && subData.plan_id) {
          const { data: planData } = await supabase
            .from('subscription_plans')
            .select('name, description')
            .eq('id', subData.plan_id)
            .single();
            
          if (planData) {
            planName = planData.name;
            planDescription = planData.description;
          }
        }
        
        if (subData) {
          setSubscriptionData({
            subscribed: subData.subscribed,
            subscription_end: subData.subscription_end,
            plan_id: subData.plan_id,
            plan_name: planName,
            plan_description: planDescription,
            subscription_tier: subData.subscription_tier,
            last_payment_date: subData.last_payment_date,
            is_trial: subData.is_trial,
            trial_ends_at: subData.trial_ends_at,
            trial_started_at: subData.trial_started_at
          });
        }
      } catch (error) {
        console.error('Error in data fetching:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os dados do perfil.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  // Redirect if not logged in
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen pb-24">
      <Header />
      <div className="container pt-32 pb-12 px-4">
        <UserProfile 
          user={user}
          userData={userData}
          subscriptionData={subscriptionData}
          isPremium={isPremium}
          isInTrialPeriod={isInTrialPeriod}
          trialDaysLeft={trialDaysLeft}
          loading={loading || premiumLoading}
        />
      </div>
      <AudioPlayer />
    </div>
  );
};

export default Profile;
