import { useEffect, useState, useCallback } from 'react';
import { AudioPlayer } from "@/components/audio-player";
import { CategoryCard } from "@/components/category-card";
import { FrequencyCard } from "@/components/frequency-card";
import { DashboardCategoryCard, DashboardFrequencyCard, DashboardQuickAction } from "@/components/home/DashboardCards";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/lib/audio-context";
import { categories, FrequencyData, getFrequenciesByCategory } from "@/lib/data";
import { ArrowRight, BookOpen, Crown, Sparkles, Headphones, Waves, ShieldCheck, Gift, CheckCircle, Users, ThumbsUp, Heart, Award, Volume2, AudioWaveform, ChevronRight, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PricingSection } from "@/components/subscription/PricingSection";
import { FrequencyRanges } from "@/components/home/FrequencyRanges";
import { ScientificEvidence } from "@/components/home/ScientificEvidence";
import { ProfessionalFeatures } from "@/components/home/ProfessionalFeatures";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { SentiPassosLanding } from "@/components/home/SentiPassosLanding";
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

  // Visitors (non-logged in) see the new SentiPassos landing page
  if (!user) {
    return <SentiPassosLanding />;
  }

  // Welcome name for the dashboard hero
  const welcomeName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Bem-vinda';

  return (
    <AudioProvider>
      <div className={`min-h-screen ${user ? 'pb-24 bg-[#0A0B10] text-white sp-font-display' : 'pb-0'}`}>
        <Header />

        {/* Dashboard Hero — Logged in users (landing-aligned dark theme) */}
        {user && (
          <section className="relative overflow-hidden pt-32 pb-20 px-4">
            {/* Ambient orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="sp-orb sp-animate-float-slow absolute -top-20 -left-20 w-[420px] h-[420px]" style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', opacity: 0.35 }} />
              <div className="sp-orb sp-animate-float-rev absolute top-10 -right-20 w-[380px] h-[380px]" style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', opacity: 0.28 }} />
              <div className="absolute inset-0 sp-grid-pattern opacity-40" />
              <div className="sp-noise absolute inset-0" />
            </div>

            <div className="container mx-auto relative z-10">
              <div className="max-w-5xl mx-auto">
                {/* Top badge */}
                <div className="flex justify-center mb-8">
                  <div className="sp-glass inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
                    Painel Frequency · Sessão Ativa
                  </div>
                </div>

                {/* Equalizer */}
                <div className="flex items-end justify-center gap-1.5 h-12 mb-8">
                  {[0.4, 0.8, 0.6, 1, 0.7, 0.5, 0.9, 0.6, 0.4].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 rounded-full sp-animate-wave-bar"
                      style={{
                        height: `${h * 100}%`,
                        background: 'linear-gradient(180deg, #3B82F6, #A78BFA)',
                        animationDelay: `${i * 0.12}s`,
                        boxShadow: '0 0 12px rgba(96,165,250,0.45)',
                      }}
                    />
                  ))}
                </div>

                {/* Headline */}
                <h1 className="text-center text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter sp-glow-text leading-[0.95] mb-6">
                  Bem-vinda,<br />
                  <span className="sp-text-gradient-blue">{welcomeName}</span>
                </h1>

                <p className="text-center text-white/60 text-base sm:text-lg max-w-2xl mx-auto font-light mb-12 leading-relaxed">
                  Continue sua jornada de transformação. Selecione uma frequência, abra uma caminhada SentiPasso ou explore o guia para potencializar seus resultados.
                </p>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <DashboardQuickAction
                    to="/guide"
                    icon={<BookOpen className="h-5 w-5" />}
                    title="Guia de Uso"
                    description="Aprenda a maximizar cada frequência"
                    gradient="linear-gradient(135deg, #8B5CF6, #A78BFA)"
                  />
                  <DashboardQuickAction
                    to="/sentipasso"
                    icon={<Headphones className="h-5 w-5" />}
                    title="SentiPassos"
                    description="Caminhadas terapêuticas guiadas"
                    gradient="linear-gradient(135deg, #3B82F6, #818CF8)"
                  />
                  <DashboardQuickAction
                    to="/favorites"
                    icon={<Heart className="h-5 w-5" />}
                    title="Favoritos"
                    description="Suas frequências mais usadas"
                    gradient="linear-gradient(135deg, #A78BFA, #60A5FA)"
                  />
                </div>

                {/* Subtle divider */}
                <div className="sp-divider-line mt-16 max-w-2xl mx-auto" />
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
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-7 leading-tight px-2 section-fade stagger-2">
                  <span className="text-foreground block sm:inline">Você Está Pronta para uma </span> 
                  <span className="gradient-text-animated block sm:inline">Transformação Radical?</span>
                </h1>
                
                {/* Subheadline */}
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 px-2 section-fade stagger-3 leading-relaxed">
                  Elimine dores crônicas, dissolva ansiedade e restaure a harmonia em seus relacionamentos em apenas <strong className="text-primary font-bold">21 dias</strong> com a Tecnologia de Ondas Sonoras Direcionadas
                </p>

                {/* Reality Check Quote */}
                <div className="mb-10 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-rose-500/10 p-6 rounded-2xl border border-rose-500/20 text-left max-w-2xl mx-auto section-fade stagger-4 card-smooth backdrop-blur-sm">
                  <p className="text-muted-foreground italic mb-3 text-lg leading-relaxed">
                    "Já tentei de tudo - médicos, terapeutas, remédios, tratamentos caros - e nada resolve de verdade. Continuo sofrendo com dores, ansiedade e relacionamentos que não funcionam."
                  </p>
                  <p className="text-foreground font-semibold text-lg">
                    Se você se identifica com isso, finalmente chegou uma solução que funciona de verdade.
                  </p>
                </div>
                
                {/* Main CTA - Free Trial */}
                <div className="mb-10 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 p-6 sm:p-8 rounded-2xl border border-amber-500/30 shadow-xl dark:from-amber-600/30 dark:to-amber-700/30 dark:border-amber-600/40 section-fade stagger-5 card-smooth backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Gift className="h-8 w-8 text-amber-500 dark:text-amber-400 animate-pulse-soft" />
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
                      Teste por 7 dias Grátis
                    </h3>
                  </div>
                  <p className="text-amber-700 dark:text-amber-300 mb-5 text-lg">
                    Experimente o poder das frequências terapêuticas sem risco. Garantia total de satisfação.
                  </p>
                  <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full shadow-lg glow-effect text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto">
                    <Link to="/auth">
                      Começar Transformação
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                </div>
                
                {/* Secondary CTAs */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-12 px-2">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-lg shadow-purple-500/25 text-sm sm:text-base px-5 sm:px-6 py-5 transition-all duration-300 hover:scale-105">
                    <Link to="/auth" className="gap-2">
                      Transformar Minha Vida
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full border-purple-300 dark:border-purple-700 shadow-sm text-sm sm:text-base px-5 sm:px-6 py-5 transition-all duration-300 hover:scale-105">
                    <Link to="/scientific" className="gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Comprovação Científica
                    </Link>
                  </Button>
                </div>
                
                {/* Key Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 max-w-4xl mx-auto mb-10 px-1">
                  <div className="flex flex-col items-center bg-white/60 dark:bg-white/5 p-4 sm:p-6 rounded-2xl backdrop-blur-sm shadow-sm card-smooth border border-rose-100 dark:border-rose-900/20">
                    <div className="p-3 sm:p-4 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-2 sm:mb-3">
                      <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-rose-500" />
                    </div>
                    <h3 className="font-semibold text-lg sm:text-xl">Ansiedade Zero</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Sem efeitos colaterais</p>
                  </div>
                  <div className="flex flex-col items-center bg-white/60 dark:bg-white/5 p-4 sm:p-6 rounded-2xl backdrop-blur-sm shadow-sm card-smooth border border-amber-100 dark:border-amber-900/20">
                    <div className="p-3 sm:p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-2 sm:mb-3">
                      <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-amber-500" />
                    </div>
                    <h3 className="font-semibold text-lg sm:text-xl">Dores Crônicas</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Alívio real e duradouro</p>
                  </div>
                  <div className="flex flex-col items-center bg-white/60 dark:bg-white/5 p-4 sm:p-6 rounded-2xl backdrop-blur-sm shadow-sm card-smooth border border-purple-100 dark:border-purple-900/20">
                    <div className="p-3 sm:p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-2 sm:mb-3">
                      <Users className="h-6 w-6 sm:h-7 sm:w-7 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-lg sm:text-xl">Relacionamentos</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Harmonia restaurada</p>
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
        
        {/* SentiPassos Featured — dark, landing-aligned */}
        <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="sp-orb sp-animate-float-slow absolute top-1/3 -left-32 w-[420px] h-[420px]" style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', opacity: 0.22 }} />
            <div className="sp-orb sp-animate-float-rev absolute bottom-0 -right-32 w-[420px] h-[420px]" style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', opacity: 0.2 }} />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.25em] text-white/60 border border-white/10 mb-6">
                  <AudioWaveform size={12} className="text-[#A78BFA]" />
                  Movimento + Frequência
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter sp-glow-text leading-[0.95] mb-5">
                  <span className="sp-text-gradient">SentiPassos</span>
                </h2>
                <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                  Caminhadas terapêuticas guiadas que combinam frequências específicas e movimento para transformar estados emocionais.
                </p>
              </div>

              {/* Emotion cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: Heart, title: 'Cultive a Paz', freq: '40Hz · 528Hz', desc: 'Acalma a mente e restaura o equilíbrio interior', grad: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
                  { icon: Waves, title: 'Transforme a Raiva', freq: '396Hz', desc: 'Libera tensões e dissolve energia densa', grad: 'linear-gradient(135deg, #3B82F6, #818CF8)' },
                  { icon: Sparkles, title: 'Supere a Tristeza', freq: '741Hz', desc: 'Eleva a vibração e renova a perspectiva', grad: 'linear-gradient(135deg, #A78BFA, #60A5FA)' },
                ].map((item, i) => (
                  <div key={i} className="sp-glass p-6 hover:bg-white/[0.07] transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: item.grad }}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">{item.freq}</div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* How it works */}
              <div className="sp-glass p-6 sm:p-8 mb-10">
                <h4 className="text-sm uppercase tracking-[0.2em] text-white/50 mb-5 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#A78BFA]" /> Como Funciona
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Escolha sua emoção alvo (paz, raiva ou tristeza)',
                    'Inicie a caminhada com a frequência específica',
                    'Movimento + som trabalham juntos na transformação',
                    'Sinta a mudança acontecer naturalmente',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#A78BFA] mt-0.5 flex-shrink-0" />
                      <span className="text-white/75 text-sm leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-center">
                <Link
                  to="/sentipasso"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 transition-transform shadow-2xl"
                >
                  <Headphones size={18} />
                  Iniciar Caminhada SentiPasso
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Frequency Ranges Section - Only show for non-logged in users */}
        {!user && <FrequencyRanges />}

        {/* Testimonial Section - Only show for non-logged in users */}
        {!user && <TestimonialSection />}

        {/* Scientific Evidence Section - Only show for non-logged in users */}
        {!user && <ScientificEvidence />}

        {/* Categories — dark dashboard style */}
        {user && (
          <section className="relative py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">Explore</div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white">
                    Categorias de <span className="sp-text-gradient">Frequência</span>
                  </h2>
                </div>
                <div className="h-px flex-1 min-w-[60px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {categories.map((category, idx) => {
                  const CategoryIcon = category.icon;
                  return (
                    <DashboardCategoryCard
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      description={category.description}
                      icon={<CategoryIcon className="h-6 w-6" />}
                      index={idx}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Frequencies by Category — dark dashboard style */}
        {user && Object.entries(categoryFrequencies).length > 0 && (
          <section className="relative py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">Biblioteca</div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white">
                    Frequências em <span className="sp-text-gradient-blue">Destaque</span>
                  </h2>
                </div>
                <div className="h-px flex-1 min-w-[60px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>

              {Object.entries(categoryFrequencies).map(([categoryId, frequencies]) => {
                const category = categories.find(cat => cat.id === categoryId);
                if (!category || frequencies.length === 0) return null;
                const CategoryIcon = category.icon;

                return (
                  <div key={categoryId} className="sp-glass mb-6 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.25))', border: '1px solid rgba(167,139,250,0.3)' }}>
                          <CategoryIcon className="h-5 w-5 text-[#A78BFA]" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                      </div>
                      <Link
                        to={`/categories/${categoryId}`}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                      >
                        Ver tudo <ChevronRight size={14} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {frequencies.map(frequency => (
                        <DashboardFrequencyCard
                          key={frequency.id}
                          frequency={frequency}
                          onBeforePlay={handleFrequencyClick}
                        />
                      ))}
                    </div>
                  </div>
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
