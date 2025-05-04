import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioProvider } from "@/lib/audio-context";
import { FrequencyData } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { usePremium } from "@/hooks/use-premium";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

const PremiumContent = () => {
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const plansRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchFrequencies = async () => {
      const { data, error } = await supabase
        .from('frequencies')
        .select('*')
        .eq('is_premium', true)  // Only fetch premium frequencies
        .order('hz');

      if (error) {
        console.error('Error fetching frequencies:', error);
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

    if (user) {
      fetchFrequencies();
    }
  }, [user]);

  // Scroll to plans section if hash is present or when location changes
  useEffect(() => {
    // Check if there's a hash in the URL or if the hash is specifically #planos
    if (location.hash === '#planos' && plansRef.current) {
      setTimeout(() => {
        plansRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {!isPremium && (
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando frequências...</p>
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
      
      <div id="planos" className="pt-8 mt-8 border-t" ref={plansRef}>
        <h2 className="text-2xl font-bold mb-8 text-center">Planos de Assinatura</h2>
        <SubscriptionPlans />
      </div>
    </div>
  );
};

const Premium = () => {
  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        <PremiumContent />
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default Premium;
