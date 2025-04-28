import { useEffect, useState } from 'react';
import { AudioPlayer } from "@/components/audio-player";
import { CategoryCard } from "@/components/category-card";
import { FrequencyCard } from "@/components/frequency-card";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/lib/audio-context";
import { categories, getTrendingFrequencies, FrequencyData } from "@/lib/data";
import { ArrowRight, Book, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PricingSection } from "@/components/subscription/PricingSection";
import { FrequencyRanges } from "@/components/home/FrequencyRanges";
import { ScientificEvidence } from "@/components/home/ScientificEvidence";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [trendingFrequencies, setTrendingFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchTrendingFrequencies = async () => {
      if (!user) return;
      
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
  }, [user]);

  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        
        {/* Welcome Section - Only show for logged in users */}
        {user && (
          <section className="pt-32 pb-12 px-4">
            <div className="container mx-auto">
              <Card className="bg-gradient-to-br from-purple-50 to-background dark:from-purple-900/20 dark:to-background border-0 shadow-lg">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-3xl md:text-4xl font-bold">
                    Bem-vindo, {user.user_metadata.full_name || 'Usuário'}! 👋
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Comece sua jornada com frequências terapêuticas
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Card className="hover:bg-accent/5 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Book className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">Guia de Uso</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Aprenda como utilizar as frequências de forma eficaz para maximizar seus benefícios.
                      </p>
                      <Button asChild className="w-full group">
                        <Link to="/guide">
                          Acessar Guia
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:bg-accent/5 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Waves className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">Frequências em Alta</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Explore as frequências mais populares entre nossos usuários.
                      </p>
                      <Button asChild variant="outline" className="w-full group">
                        <Link to="/trending">
                          Ver Frequências
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
        
        {/* Original content - show pricing and info sections for non-logged in users */}
        {!user && (
          <>
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
            
            {/* Frequency Ranges Section - Only show for non-logged in users */}
            {!user && <FrequencyRanges />}
            
            {/* Scientific Evidence Section - Only show for non-logged in users */}
            {!user && <ScientificEvidence />}
            
            {/* Pricing Section - Only show for non-logged in users */}
            {!user && <PricingSection />}
          </>
        )}
        
        {/* Trending Section - Only show for logged in users */}
        {user && (
          <section className="py-12 px-4 mt-20">
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
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : trendingFrequencies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trendingFrequencies.map((frequency) => (
                    <FrequencyCard
                      key={frequency.id}
                      frequency={frequency}
                      variant="trending"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma frequência em alta encontrada.</p>
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Categories Section - Show for all users */}
        <section className={`py-12 px-4 ${user ? 'mt-8' : ''}`}>
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
