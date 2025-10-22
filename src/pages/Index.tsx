import { useEffect, useState, useCallback } from 'react';
import { AudioPlayer } from "@/components/audio-player";
import { CategoryCard } from "@/components/category-card";
import { FrequencyCard } from "@/components/frequency-card";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/lib/audio-context";
import { categories, FrequencyData, getFrequenciesByCategory } from "@/lib/data";
import { ArrowRight, BookOpen, Crown, Sparkles, Headphones, Waves, ShieldCheck, Gift, CheckCircle, Users, ThumbsUp, Heart, Award, Volume2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PricingSection } from "@/components/subscription/PricingSection";
import { FrequencyRanges } from "@/components/home/FrequencyRanges";
import { ScientificEvidence } from "@/components/home/ScientificEvidence";
import { ProfessionalFeatures } from "@/components/home/ProfessionalFeatures";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { SentipassoSection } from "@/components/sentipasso/SentipassoSection";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDebouncedEffect, useIsMobile } from "@/hooks";

const Index = () => {
  const [categoryFrequencies, setCategoryFrequencies] = useState<Record<string, FrequencyData[]>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
          <section className="w-full bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10 pt-32 pb-12 px-2 sm:px-4">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight px-2">
                  Bem-vindo ao Guia de Frequências
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 animate-fade-in px-2">
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
          <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-2 sm:px-4 relative overflow-hidden bg-gradient-to-b from-purple-100/80 to-background dark:from-purple-900/20 dark:to-background">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-200/30 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200/20 dark:bg-purple-700/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200/20 dark:bg-blue-700/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="container mx-auto relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center mb-3 sm:mb-5">
                  <Badge variant="success" className="px-2 py-1 text-xs sm:text-sm">
                    <Waves className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Frequências Terapêuticas
                  </Badge>
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 animate-fade-in leading-tight px-2">
                  <span className="text-primary dark:text-primary block sm:inline">Transforme sua </span> 
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400 block sm:inline">Jornada Interior</span>
                </h1>
                
                <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 animate-fade-in px-2">
                  Descubra o poder das frequências sonoras para relaxamento, foco, cura emocional e bem-estar através dos SentiPassos
                </p>
                
                {/* Destaque do SentiPassos */}
                <div className="mb-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30 shadow-lg dark:from-purple-600/30 dark:to-pink-700/30 dark:border-purple-600/40">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Headphones className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                    <h3 className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                      🎧 SentiPassos - Novidade!
                    </h3>
                  </div>
                  <p className="text-purple-700 dark:text-purple-300 mb-3">
                    Caminhadas terapêuticas com frequências para trabalhar emoções como paz, raiva e tristeza
                  </p>
                  <Button asChild size="lg" className="bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md">
                    <Link to="/sentipasso">
                      Experimente os SentiPassos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                {/* Teste Grátis */}
                <div className="mb-8 bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-4 rounded-lg border border-amber-500/30 shadow-lg dark:from-amber-600/30 dark:to-amber-700/30 dark:border-amber-600/40">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gift className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                    <h3 className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                      Teste por 30 dias Grátis
                    </h3>
                  </div>
                  <p className="text-amber-700 dark:text-amber-300 mb-3">
                    Acesso completo à biblioteca de frequências terapêuticas e SentiPassos
                  </p>
                  <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md">
                    <Link to="/auth">
                      Começar Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full animate-fade-in bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md shadow-purple-500/20">
                    <Link to="/auth" className="gap-2 text-base">
                      Começar Jornada
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
                    <Heart className="h-6 w-6 text-primary mb-2" />
                    <h3 className="font-medium">Bem-Estar Emocional</h3>
                    <p className="text-sm text-muted-foreground">Paz interior e equilíbrio</p>
                  </div>
                  <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-4 rounded-xl backdrop-blur-sm shadow-sm">
                    <Volume2 className="h-6 w-6 text-primary mb-2" />
                    <h3 className="font-medium">Biblioteca Completa</h3>
                    <p className="text-sm text-muted-foreground">Mais de 200 frequências</p>
                  </div>
                  <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-4 rounded-xl backdrop-blur-sm shadow-sm">
                    <Headphones className="h-6 w-6 text-primary mb-2" />
                    <h3 className="font-medium">SentiPassos</h3>
                    <p className="text-sm text-muted-foreground">Caminhadas terapêuticas</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Professional Features Section - Only show for non-logged in users */}
        {!user && <ProfessionalFeatures />}
        
        {/* How It Works Section - Only show for non-logged in users */}
        {!user && <HowItWorksSection />}
        
        {/* SentiPassos Destacado - Show for all users */}
        <section className="py-12 sm:py-16 px-2 sm:px-4 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 px-2">
                  🎧 <span className="text-primary">SentiPassos</span>
                </h2>
                <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
                  Uma revolução em terapia sonora: caminhadas guiadas que combinam movimento e frequências específicas para transformar estados emocionais
                </p>
              </div>

              <Card className="hover-scale overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-200/30 mb-8">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Waves className="h-10 w-10 text-purple-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <CardTitle className="text-2xl md:text-3xl">Caminhadas Terapêuticas</CardTitle>
                      <p className="text-muted-foreground">Movimento + Frequências = Transformação Emocional</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-white/50 dark:bg-white/5 rounded-lg">
                      <Heart className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h4 className="font-semibold text-lg mb-2">Cultive a Paz</h4>
                      <p className="text-sm text-muted-foreground">Frequências de 40Hz e 528Hz para acalmar a mente e encontrar tranquilidade interior durante a caminhada</p>
                    </div>
                    <div className="text-center p-6 bg-white/50 dark:bg-white/5 rounded-lg">
                      <Waves className="h-8 w-8 text-red-500 mx-auto mb-3" />
                      <h4 className="font-semibold text-lg mb-2">Transforme a Raiva</h4>
                      <p className="text-sm text-muted-foreground">Frequências de 396Hz para liberar tensões e transformar energia negativa em movimento positivo</p>
                    </div>
                    <div className="text-center p-6 bg-white/50 dark:bg-white/5 rounded-lg">
                      <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h4 className="font-semibold text-lg mb-2">Supere a Tristeza</h4>
                      <p className="text-sm text-muted-foreground">Frequências de 741Hz para elevação vibracional e renovação emocional através do movimento</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-lg mb-3">🚶‍♀️ Como Funciona:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Escolha sua emoção alvo (paz, raiva ou tristeza)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Inicie a caminhada com frequência específica</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Movimento + som trabalham juntos na transformação</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Sinta a mudança acontecer naturalmente</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Link to="/sentipasso">
                        <Headphones className="mr-2 h-5 w-5" />
                        Experimentar SentiPassos
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    {!user && (
                      <Button asChild variant="outline" size="lg">
                        <Link to="/auth">
                          <Gift className="mr-2 h-5 w-5" />
                          Começar Teste Grátis
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        
        {/* Frequency Ranges Section - Only show for non-logged in users */}
        {!user && <FrequencyRanges />}
        
        {/* Testimonial Section - Only show for non-logged in users */}
        {!user && <TestimonialSection />}
        
        {/* Scientific Evidence Section - Only show for non-logged in users */}
        {!user && <ScientificEvidence />}
        
        {/* Categories Section with Frequencies - More efficient rendering */}
        <section className="py-8 sm:py-12 px-2 sm:px-4">
          <div className="container mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 px-2">Categorias</h2>
            
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
          <section className="py-6 sm:py-8 px-2 sm:px-4">
            <div className="container mx-auto">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 px-2">Explore Frequências por Categoria</h2>
              
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
