import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { AudioPlayer } from "@/components/audio-player";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioProvider } from "@/lib/audio-context";
import { FrequencyData } from "@/lib/audio-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { usePremium } from "@/hooks/use-premium";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

const PremiumContent = () => {
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPremium } = usePremium();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPremiumFrequencies = async () => {
      const { data, error } = await supabase
        .from('frequencies')
        .select('*')
        .eq('is_premium', true)
        .order('hz');

      if (error) {
        console.error('Error fetching premium frequencies:', error);
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

    fetchPremiumFrequencies();
  }, []);

  if (!user) {
    return (
      <div className="container pt-32 pb-12 px-4 text-center">
        <Crown className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequências Premium</h1>
        <p className="text-muted-foreground mb-8">Faça login para acessar conteúdo premium</p>
        <Button asChild>
          <Link to="/auth">Entrar</Link>
        </Button>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="container pt-32 pb-12 px-4">
        <div className="text-center mb-12">
          <Crown className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequências Premium</h1>
          <p className="text-muted-foreground mb-8">
            Escolha um plano e tenha acesso a todas as frequências premium
          </p>
        </div>
        <SubscriptionPlans />
      </div>
    );
  }

  return (
    <div className="container pt-32 pb-12 px-4">
      <div className="flex items-center mb-8">
        <Crown className="w-8 h-8 text-primary mr-4" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Frequências Premium</h1>
          <p className="text-muted-foreground">Frequências exclusivas para assinantes premium</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando frequências...</p>
        </div>
      ) : frequencies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {frequencies.map((frequency) => (
            <FrequencyCard key={frequency.id} frequency={frequency} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma frequência premium encontrada.</p>
        </div>
      )}
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
