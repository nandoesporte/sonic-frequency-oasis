
import { useEffect, useState } from 'react';
import { AudioPlayer } from "@/components/audio-player";
import { CategoryCard } from "@/components/category-card";
import { FrequencyCard } from "@/components/frequency-card";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/lib/audio-context";
import { categories, getTrendingFrequencies, FrequencyData } from "@/lib/data";
import { ArrowRight, BookOpen, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PricingSection } from "@/components/subscription/PricingSection";
import { FrequencyRanges } from "@/components/home/FrequencyRanges";
import { ScientificEvidence } from "@/components/home/ScientificEvidence";
import { toast } from "@/components/ui/sonner";
import { PremiumContentDialog } from "@/components/subscription/PremiumContentDialog";

const Index = () => {
  const [trendingFrequencies, setTrendingFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyData | null>(null);
  
  useEffect(() => {
    const fetchTrendingFrequencies = async () => {
      try {
        setLoading(true);
        console.log("Fetching trending frequencies for homepage...");
        const frequencies = await getTrendingFrequencies();
        console.log("Received trending frequencies:", frequencies);
        setTrendingFrequencies(frequencies);
        
        if (frequencies.length === 0) {
          toast.info('Sem frequências', {
            description: 'Não foram encontradas frequências em alta.'
          });
        }
      } catch (error) {
        console.error('Error fetching trending frequencies:', error);
        toast.error('Erro ao carregar frequências', {
          description: 'Não foi possível carregar as frequências em alta.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingFrequencies();
  }, []);

  const handlePremiumContent = (frequency: FrequencyData) => {
    setSelectedFrequency(frequency);
    setPremiumDialogOpen(true);
  };

  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        
        {/* Welcome Section - Only show for logged in users */}
        {user && (
          <section className="w-full bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10 pt-32 pb-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                  Bem-vindo ao Guia de Frequências
                </h1>
                <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
                  Aprenda a maximizar os benefícios das frequências sonoras terapêuticas com nosso guia completo.
                </p>
                <Button asChild size="lg" className="rounded-full animate-fade-in hover-scale">
                  <Link to="/guide" className="gap-2">
                    <BookOpen className="h-5 w-5" />
                    Acessar o Guia de Uso
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Hero Section - Only show for non-logged in users */}
        {!user && (
          <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                <span className="text-purple-dark dark:text-purple-light">Experimente</span> o Som Terapêutico
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
                Explore frequências curativas cientificamente comprovadas para relaxamento, foco e bem-estar
              </p>
              <Button asChild size="lg" className="rounded-full animate-fade-in">
                <Link to="/auth">
                  Entre para Começar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        )}
        
        {/* Frequency Ranges Section - Show for all users now */}
        <FrequencyRanges />
        
        {/* Scientific Evidence Section - Show for all users now */}
        <ScientificEvidence />
        
        {/* Trending Frequencies Section - Show for all users now */}
        {trendingFrequencies.length > 0 && (
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequências em Alta</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingFrequencies.map((frequency) => (
                  <FrequencyCard 
                    key={frequency.id} 
                    frequency={frequency} 
                    variant="trending"
                    onPremiumContent={handlePremiumContent}
                  />
                ))}
              </div>
              
              {!user && (
                <div className="text-center mt-8">
                  <Button asChild variant="outline">
                    <Link to="/auth">
                      Entrar para acessar mais frequências
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Pricing Section - Only show for non-logged in users */}
        {!user && <PricingSection />}
        
        {/* Categories Section - Show for all users */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Categorias</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description={category.description}
                    icon={<CategoryIcon className="h-6 w-6" />}
                    requiresAuth={false} // Now allow all users to access categories
                  />
                );
              })}
            </div>
          </div>
        </section>
        
        <AudioPlayer />
        <PremiumContentDialog 
          open={premiumDialogOpen}
          onOpenChange={setPremiumDialogOpen}
          frequencyName={selectedFrequency?.name}
        />
      </div>
    </AudioProvider>
  );
};

export default Index;
