
import { useEffect, useState, useRef, useCallback } from "react";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { FrequencyData } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Crown } from "lucide-react";
import { usePremium } from "@/hooks/use-premium";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { useIsMobile } from "@/hooks/use-mobile";

const PremiumContent = () => {
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isPremium, isInTrialPeriod, trialDaysLeft, hasAccess } = usePremium();
  const plansRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Improved scroll function with better behavior on mobile
  const scrollToPlans = useCallback(() => {
    if (plansRef.current) {
      const yOffset = isMobile ? -100 : -120; // Adjust offset based on device
      const y = plansRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchFrequencies = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('frequencies')
        .select('*')
        .eq('is_premium', true)  // Only fetch premium frequencies
        .order('hz')
        .limit(6); // Limit to improve loading time

      if (error) {
        console.error('Error fetching frequencies:', error);
        setLoading(false);
        return;
      }
      
      setFrequencies(data.map(freq => ({
        id: freq.id,
        name: freq.name,
        hz: freq.hz,
        purpose: freq.purpose,
        description: freq.description,
        category: freq.category,
        premium: true
      })));
      setLoading(false);
    };

    fetchFrequencies();
  }, [user]);

  // Reset scroll position on component mount and when location hash changes
  useEffect(() => {
    // First, always scroll to the top of the page
    window.scrollTo(0, 0);
    
    // Then, if there's a #planos hash, scroll to the plans section after a short delay
    if (location.hash === '#planos') {
      // Small delay to ensure DOM is fully loaded
      setTimeout(scrollToPlans, 300);
    }
  }, [location.hash, scrollToPlans]);

  if (!user) {
    return (
      <div className="container pt-32 pb-12 px-4 text-center">
        <Crown className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequências Exclusivas</h1>
        <p className="text-muted-foreground mb-8">Faça login para acessar todo o conteúdo</p>
        <Button asChild>
          <Link to="/auth">Entrar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container pt-32 pb-12 px-4">
      <div className="flex items-center mb-6">
        <Crown className="w-8 h-8 text-primary mr-4" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Frequências Exclusivas</h1>
          <p className="text-muted-foreground">Acesso completo a todas as frequências</p>
        </div>
      </div>

      {!isPremium && isInTrialPeriod && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Período de Teste Ativo
          </h2>
          <p className="text-muted-foreground mb-4">
            Você está no período de teste gratuito com acesso a todas as frequências premium.
            Restam <span className="font-semibold">{trialDaysLeft} {trialDaysLeft === 1 ? 'dia' : 'dias'}</span> para o término.
          </p>
          <Button 
            variant="default" 
            className="bg-amber-500 hover:bg-amber-600"
            onClick={scrollToPlans}
          >
            Ver Planos
          </Button>
        </div>
      )}

      {!hasAccess && !isInTrialPeriod && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Assine o plano Premium</h2>
          <p className="text-muted-foreground mb-4">
            Por apenas R$ 19,90/mês, você tem acesso ilimitado a todas as frequências premium
            e recursos exclusivos.
          </p>
          <Button 
            variant="default" 
            className="bg-amber-500 hover:bg-amber-600"
            onClick={scrollToPlans}
          >
            Ver Planos
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
              <div className="flex justify-between mt-6">
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-full w-9"></div>
              </div>
            </div>
          ))}
        </div>
      ) : frequencies.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Frequências Premium</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {frequencies.map((frequency) => (
              <FrequencyCard key={frequency.id} frequency={frequency} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 mb-8">
          <p className="text-muted-foreground">Nenhuma frequência premium encontrada.</p>
        </div>
      )}
      
      <div id="planos" className="pt-8 mt-8 border-t border-border/40" ref={plansRef}>
        <h2 className="text-2xl font-bold mb-8 text-center">Planos de Assinatura</h2>
        <SubscriptionPlans />
      </div>
    </div>
  );
};

const Premium = () => {
  return (
    <div className="min-h-screen pb-24">
      <Header />
      <PremiumContent />
      <AudioPlayer />
    </div>
  );
};

export default Premium;
