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
      <div className={`min-h-screen ${user ? 'pb-24' : 'pb-0'}`}>
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
          <section className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-2 sm:px-4 relative overflow-hidden bg-gradient-to-b from-purple-100/80 via-purple-50/40 to-background dark:from-purple-900/20 dark:via-purple-900/10 dark:to-background">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-200/30 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-96 h-96 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200/20 dark:bg-blue-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-200/15 dark:bg-pink-700/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="container mx-auto relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="flex justify-center mb-4 sm:mb-6 section-fade stagger-1">
                  <Badge variant="success" className="px-3 py-1.5 text-xs sm:text-sm shadow-lg">
                    <Waves className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 animate-pulse-soft" />
                    Protocolo de Ressonância Terapêutica 7D
                  </Badge>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2 section-fade stagger-2">
                  <span className="text-foreground block sm:inline">Você Está Pronta para uma </span> 
                  <span className="gradient-text-animated block sm:inline">Transformação Radical?</span>
                </h1>
                
                {/* Subheadline */}
                <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 px-2 section-fade stagger-3 leading-relaxed">
                  Elimine dores crônicas, dissolva ansiedade e restaure a harmonia em seus relacionamentos em apenas <strong className="text-primary font-bold">21 dias</strong> com a Tecnologia de Ondas Sonoras Direcionadas
                </p>

                {/* Reality Check Quote */}
                <div className="mb-10 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-rose-500/10 p-6 rounded-2xl border border-rose-500/20 text-left max-w-2xl mx-auto section-fade stagger-4 card-smooth backdrop-blur-sm">
                  <p className="text-muted-foreground italic mb-3 text-base leading-relaxed">
                    "Já tentei de tudo - médicos, terapeutas, remédios, tratamentos caros - e nada resolve de verdade. Continuo sofrendo com dores, ansiedade e relacionamentos que não funcionam."
                  </p>
                  <p className="text-foreground font-semibold">
                    Se você se identifica com isso, finalmente chegou uma solução que funciona de verdade.
                  </p>
                </div>
                
                {/* Main CTA - Free Trial */}
                <div className="mb-10 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 p-6 rounded-2xl border border-amber-500/30 shadow-xl dark:from-amber-600/30 dark:to-amber-700/30 dark:border-amber-600/40 section-fade stagger-5 card-smooth backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Gift className="h-7 w-7 text-amber-500 dark:text-amber-400 animate-pulse-soft" />
                    <h3 className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">
                      Teste por 30 dias Grátis
                    </h3>
                  </div>
                  <p className="text-amber-700 dark:text-amber-300 mb-4 text-base">
                    Experimente o poder das frequências terapêuticas sem risco. Garantia total de satisfação.
                  </p>
                  <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full shadow-lg glow-effect text-lg px-8 py-6">
                    <Link to="/auth">
                      Começar Minha Transformação
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                
                {/* Secondary CTAs */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-lg shadow-purple-500/25 text-base px-6 transition-all duration-300 hover:scale-105">
                    <Link to="/auth" className="gap-2">
                      Quero Transformar Minha Vida
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full border-purple-300 dark:border-purple-700 shadow-sm text-base px-6 transition-all duration-300 hover:scale-105">
                    <Link to="/scientific" className="gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Comprovação Científica
                    </Link>
                  </Button>
                </div>
                
                {/* Key Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                  <div className="flex flex-col items-center bg-white/60 dark:bg-white/5 p-5 rounded-2xl backdrop-blur-sm shadow-sm card-smooth border border-rose-100 dark:border-rose-900/20">
                    <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-3">
                      <Heart className="h-6 w-6 text-rose-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Ansiedade Zero</h3>
                    <p className="text-sm text-muted-foreground">Sem efeitos colaterais</p>
                  </div>
                  <div className="flex flex-col items-center bg-white/60 dark:bg-white/5 p-5 rounded-2xl backdrop-blur-sm shadow-sm card-smooth border border-amber-100 dark:border-amber-900/20">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
                      <Sparkles className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Dores Crônicas</h3>
                    <p className="text-sm text-muted-foreground">Alívio real e duradouro</p>
                  </div>
                  <div className="flex flex-col items-center bg-white/60 dark:bg-white/5 p-5 rounded-2xl backdrop-blur-sm shadow-sm card-smooth border border-purple-100 dark:border-purple-900/20">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Relacionamentos</h3>
                    <p className="text-sm text-muted-foreground">Harmonia restaurada</p>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full">
                    <Users className="h-4 w-4 text-primary" />
                    <span><strong className="text-foreground">+5.000</strong> mulheres transformadas</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full">
                    <ThumbsUp className="h-4 w-4 text-primary" />
                    <span><strong className="text-foreground">97%</strong> de satisfação</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full">
                    <Award className="h-4 w-4 text-primary" />
                    <span>Aprovado por especialistas</span>
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
        <section className="py-16 sm:py-24 px-2 sm:px-4 relative overflow-hidden sales-section">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-300/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}></div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 px-2">
                  🎧 <span className="gradient-text-animated">SentiPassos</span>
                </h2>
                <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2 leading-relaxed">
                  Uma revolução em terapia sonora: caminhadas guiadas que combinam movimento e frequências específicas para transformar estados emocionais
                </p>
              </div>

              <Card className="overflow-hidden bg-gradient-to-br from-purple-500/15 to-pink-500/15 border-purple-200/30 dark:border-purple-700/30 mb-8 card-smooth shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className="p-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl">
                      <Waves className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-center sm:text-left">
                      <CardTitle className="text-2xl md:text-3xl">Caminhadas Terapêuticas</CardTitle>
                      <p className="text-muted-foreground text-lg">Movimento + Frequências = Transformação Emocional</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-white/60 dark:bg-white/5 rounded-2xl card-smooth border border-green-100 dark:border-green-900/20">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-3">
                        <Heart className="h-8 w-8 text-green-500" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Cultive a Paz</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Frequências de 40Hz e 528Hz para acalmar a mente e encontrar tranquilidade interior</p>
                    </div>
                    <div className="text-center p-6 bg-white/60 dark:bg-white/5 rounded-2xl card-smooth border border-red-100 dark:border-red-900/20">
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-fit mx-auto mb-3">
                        <Waves className="h-8 w-8 text-red-500" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Transforme a Raiva</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Frequências de 396Hz para liberar tensões e transformar energia negativa</p>
                    </div>
                    <div className="text-center p-6 bg-white/60 dark:bg-white/5 rounded-2xl card-smooth border border-blue-100 dark:border-blue-900/20">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-3">
                        <Sparkles className="h-8 w-8 text-blue-500" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Supere a Tristeza</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Frequências de 741Hz para elevação vibracional e renovação emocional</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl mb-8">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <span className="text-2xl">🚶‍♀️</span> Como Funciona:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Escolha sua emoção alvo (paz, raiva ou tristeza)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Inicie a caminhada com frequência específica</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Movimento + som trabalham juntos na transformação</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Sinta a mudança acontecer naturalmente</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg glow-effect transition-all duration-300 hover:scale-105">
                      <Link to="/sentipasso">
                        <Headphones className="mr-2 h-5 w-5" />
                        Experimentar SentiPassos
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    {!user && (
                      <Button asChild variant="outline" size="lg" className="rounded-full transition-all duration-300 hover:scale-105">
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
        
        {/* Categories Section with Frequencies - Only show for logged in users */}
        {user && (
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
        )}
        
        {/* Display Frequencies by Category - Only show for logged in users */}
        {user && Object.entries(categoryFrequencies).length > 0 && (
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
        
        {/* Audio Player - Only show for logged in users */}
        {user && <AudioPlayer />}
      </div>
    </AudioProvider>
  );
};

export default Index;
