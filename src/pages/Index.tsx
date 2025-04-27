
import { useEffect, useState } from 'react';
import { AudioPlayer } from "@/components/audio-player";
import { CategoryCard } from "@/components/category-card";
import { FrequencyCard } from "@/components/frequency-card";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/lib/audio-context";
import { categories, getTrendingFrequencies } from "@/lib/data";
import { ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FrequencyData } from "@/lib/audio-context";
import { PricingSection } from "@/components/subscription/PricingSection";
import { FrequencyRanges } from "@/components/home/FrequencyRanges";
import { ScientificEvidence } from "@/components/home/ScientificEvidence";

const Index = () => {
  const [trendingFrequencies, setTrendingFrequencies] = useState<FrequencyData[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchTrendingFrequencies = async () => {
      const frequencies = await getTrendingFrequencies();
      setTrendingFrequencies(frequencies);
    };
    
    if (user) {
      fetchTrendingFrequencies();
    }
  }, [user]);

  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
              <span className="text-purple-dark dark:text-purple-light">Experimente</span> o Som Terapêutico
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
              Explore frequências curativas cientificamente comprovadas para relaxamento, foco e bem-estar
            </p>
            <Button asChild size="lg" className="rounded-full animate-fade-in">
              {user ? (
                <Link to="/category/healing">
                  Comece Sua Jornada de Cura
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <Link to="/auth">
                  Entre para Começar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </Button>
          </div>
        </section>

        {/* Frequency Ranges Section */}
        <FrequencyRanges />
        
        {/* Scientific Evidence Section */}
        <ScientificEvidence />
        
        {/* Pricing Section */}
        <PricingSection />
        
        {/* Trending Section */}
        {user && trendingFrequencies.length > 0 && (
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Em Alta</h2>
                <Button variant="ghost" asChild>
                  <Link to="/trending">
                    Ver Todos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingFrequencies.map((frequency) => (
                  <FrequencyCard
                    key={frequency.id}
                    frequency={frequency}
                    variant="trending"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Categories Section */}
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
                    requiresAuth={!user}
                  />
                );
              })}
            </div>
          </div>
        </section>
        
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default Index;
