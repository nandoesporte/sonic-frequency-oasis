import { useEffect, useState, useCallback } from 'react';
import { AudioPlayer } from "@/components/audio-player";
import { CategoryCard } from "@/components/category-card";
import { FrequencyCard } from "@/components/frequency-card";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/lib/audio-context";
import { categories, getTrendingFrequencies, FrequencyData, getFrequenciesByCategory } from "@/lib/data";
import { ArrowRight, BookOpen, Crown, Sparkles, Headphones, Waves, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PricingSection } from "@/components/subscription/PricingSection";
import { FrequencyRanges } from "@/components/home/FrequencyRanges";
import { ScientificEvidence } from "@/components/home/ScientificEvidence";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebouncedEffect } from "@/hooks";

const Index = () => {
  const [trendingFrequencies, setTrendingFrequencies] = useState<FrequencyData[]>([]);
  const [categoryFrequencies, setCategoryFrequencies] = useState<Record<string, FrequencyData[]>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Load trending frequencies
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
  
  // Load category frequencies with staggered loading and limiting fetch operations
  useEffect(() => {
    let isMounted = true;
    
    const fetchCategoriesInBatches = async () => {
      // Only process 2 categories at a time to prevent too many concurrent requests
      const batchSize = 2;
      const categoriesCopy = [...categories];
      
      while (categoriesCopy.length > 0 && isMounted) {
        const batch = categoriesCopy.splice(0, batchSize);
        
        await Promise.all(batch.map(async (category) => {
          try {
            console.log(`Fetching frequencies for category: ${category.id}`);
            const categoryFreqs = await getFrequenciesByCategory(category.id);
            
            if (isMounted && categoryFreqs.length > 0) {
              setCategoryFrequencies(prev => ({
                ...prev,
                [category.id]: categoryFreqs.slice(0, 3) // Only show max 3 per category
              }));
            }
          } catch (error) {
            console.error(`Error fetching frequencies for ${category.id}:`, error);
          }
        }));
        
        // Wait a bit before processing the next batch
        if (categoriesCopy.length > 0 && isMounted) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    };
    
    fetchCategoriesInBatches();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Function to redirect to login if user is not logged in
  const handleFrequencyClick = useCallback(() => {
    if (!user) {
      console.log("User not logged in, redirecting to auth page from home page");
      toast.info("Faça login para continuar", {
        description: "É necessário estar logado para acessar as frequências"
      });
      navigate("/auth");
      return true;
    }
    return false;
  }, [user, navigate]);

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
        
        {/* Enhanced Hero Section - Only show for non-logged in users */}
        {!user && (
          <section className="pt-28 md:pt-32 pb-16 px-4 relative overflow-hidden bg-gradient-to-b from-purple-50/80 to-background dark:from-purple-900/20 dark:to-background">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-100/30 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200/20 dark:bg-purple-700/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200/20 dark:bg-blue-700/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="container mx-auto relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center mb-5">
                  <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-100/70 to-blue-100/70 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full shadow-sm">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium">Experimente o Som Terapêutico</span>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 animate-fade-in leading-tight">
                  <span className="text-primary dark:text-primary">O Som </span> 
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">Terapêutico</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
                  Explore frequências curativas cientificamente comprovadas para relaxamento, foco e bem-estar
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full animate-fade-in bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md shadow-purple-500/20">
                    <Link to="/auth" className="gap-2 text-base">
                      Entre para Começar
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full animate-fade-in border-purple-300 dark:border-purple-700 shadow-sm">
                    <Link to="/scientific" className="gap-2 text-base">
                      <ShieldCheck className="h-4 w-4" />
                      Base Científica
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-4 rounded-xl backdrop-blur-sm shadow-sm">
                    <Headphones className="h-6 w-6 text-primary mb-2" />
                    <h3 className="font-medium">Áudio Imersivo</h3>
                    <p className="text-sm text-muted-foreground">Experiência sonora completa</p>
                  </div>
                  <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-4 rounded-xl backdrop-blur-sm shadow-sm">
                    <Waves className="h-6 w-6 text-primary mb-2" />
                    <h3 className="font-medium">Frequências Precisas</h3>
                    <p className="text-sm text-muted-foreground">Calibradas cientificamente</p>
                  </div>
                  <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-4 rounded-xl backdrop-blur-sm shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-primary mb-2" />
                    <h3 className="font-medium">Base Científica</h3>
                    <p className="text-sm text-muted-foreground">Pesquisas comprovadas</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Trending Section - Keep existing implementation logic, but improve styling */}
        {trendingFrequencies.length > 0 && (
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary hidden sm:block" />
                  <h2 className="text-2xl md:text-3xl font-bold">Em Alta</h2>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link to="/trending" className="flex items-center">
                    Ver Mais <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {trendingFrequencies.slice(0, 4).map((frequency) => (
                  <FrequencyCard 
                    key={frequency.id} 
                    frequency={frequency} 
                    variant="trending"
                    onBeforePlay={handleFrequencyClick}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Frequency Ranges Section - Only show for non-logged in users */}
        {!user && <FrequencyRanges />}
        
        {/* Scientific Evidence Section - Only show for non-logged in users */}
        {!user && <ScientificEvidence />}
        
        {/* Categories Section with Frequencies - More efficient rendering */}
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
                  />
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Display Frequencies by Category - With optimized rendering */}
        {Object.entries(categoryFrequencies).length > 0 && (
          <section className="py-8 px-4">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Explore Frequências por Categoria</h2>
              
              {Object.entries(categoryFrequencies).map(([categoryId, frequencies]) => {
                const category = categories.find(cat => cat.id === categoryId);
                if (!category || frequencies.length === 0) return null;
                
                const CategoryIcon = category.icon;
                
                return (
                  <Card key={categoryId} className="mb-8">
                    <CardHeader className="pb-0">
                      <div className="flex items-center">
                        <CategoryIcon className="h-6 w-6 mr-2" />
                        <CardTitle>{category.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {frequencies.map(frequency => (
                          <FrequencyCard 
                            key={frequency.id} 
                            frequency={frequency}
                            variant="compact"
                            onBeforePlay={handleFrequencyClick}
                          />
                        ))}
                      </div>
                      
                      <Button asChild variant="outline" className="mt-4">
                        <Link to={`/categories/${categoryId}`}>
                          Ver mais desta categoria
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
        
        {/* Pricing Section - Only show for non-logged in users */}
        {!user && <PricingSection />}
        
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default Index;
