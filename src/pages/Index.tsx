
import { useEffect, useState, useCallback } from 'react';
import { AudioPlayer } from "@/components/audio-player";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/lib/audio-context";
import { getTrendingFrequencies, FrequencyData } from "@/lib/data";
import { 
  ArrowRight, 
  Headphones, 
  Clock, 
  ChartLine, 
  Check, 
  Users, 
  Play, 
  Package, 
  HelpCircle, 
  Mail,
  Gift,
  ShieldCheck, 
  Sparkles,
  Star,
  Award,
  BarChart,
  Heart,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

// Dados dos depoimentos
const testimonials = [
  {
    name: "Ana",
    role: "Terapeuta Holística",
    text: "Desde que comecei a usar as Frequências de Alta Performance nas minhas sessões de reiki, meus clientes relatam um relaxamento muito mais profundo. Minha agenda está lotada!"
  },
  {
    name: "João",
    role: "Facilitador de Meditação",
    text: "Os áudios me ajudaram a criar uma atmosfera única nas minhas meditações guiadas. Meus alunos adoram e sempre pedem mais!"
  },
  {
    name: "Mariana",
    role: "Life Coach",
    text: "Como coach, eu não imaginava o impacto que essas frequências teriam. Meus clientes estão mais focados e abertos durante as sessões."
  },
  {
    name: "Roberto",
    role: "Psicoterapeuta",
    text: "A diferença na qualidade das minhas sessões é notável. As frequências ajudam meus pacientes a acessarem estados emocionais com muito mais facilidade."
  }
];

// Dados de FAQs
const faqs = [
  {
    question: "O que são frequências quânticas?",
    answer: "São áudios com ondas sonoras calibradas para estimular estados cerebrais específicos, amplamente usados em terapias holísticas e práticas de bem-estar. Elas trabalham em diferentes faixas (alfa, beta, teta, delta) para promover relaxamento, foco, criatividade e outros estados."
  },
  {
    question: "Preciso de equipamentos especiais?",
    answer: "Não, você pode usar as frequências com qualquer dispositivo que reproduza áudio. Um celular, tablet ou sistema de som simples é suficiente. Para melhores resultados, recomendamos fones de ouvido de boa qualidade."
  },
  {
    question: "Posso usar em sessões online?",
    answer: "Sim, os áudios são perfeitamente compatíveis com Zoom, Google Meet e outras plataformas de videoconferência. Você pode compartilhar o áudio durante suas sessões remotas com facilidade."
  },
  {
    question: "E se não funcionar para mim?",
    answer: "Você tem 7 dias para testar. Se não ficar satisfeito com os resultados, devolvemos seu dinheiro integralmente, sem perguntas."
  },
  {
    question: "As frequências são seguras?",
    answer: "Sim. Todas as nossas frequências são desenvolvidas com base em pesquisas científicas e calibradas para serem seguras. No entanto, pessoas com epilepsia devem consultar um médico antes de usar."
  }
];

// Benefícios para terapeutas
const benefits = [
  {
    title: "Resultados Imediatos",
    description: "Seus clientes entram em estados de relaxamento profundo em minutos, potencializando os efeitos da terapia.",
    icon: Zap
  },
  {
    title: "Diferenciação no Mercado",
    description: "Ofereça uma experiência única que destaca seu trabalho da concorrência.",
    icon: Award
  },
  {
    title: "Versatilidade",
    description: "Use os áudios em sessões de reiki, meditação, yoga, coaching, constelação familiar e mais.",
    icon: BarChart
  },
  {
    title: "Fidelização de Clientes",
    description: "Clientes satisfeitos retornam e recomendam seus serviços, aumentando sua base de clientes.",
    icon: Heart
  },
  {
    title: "Fácil de Usar",
    description: "Áudios prontos para integração em sessões presenciais ou online, sem necessidade de equipamentos caros.",
    icon: Headphones
  }
];

const Index = () => {
  const [trendingFrequencies, setTrendingFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Load some featured frequencies
  useEffect(() => {
    const fetchFrequencies = async () => {
      try {
        setLoading(true);
        const frequencies = await getTrendingFrequencies();
        setTrendingFrequencies(frequencies.slice(0, 3));
      } catch (error) {
        console.error('Error fetching frequencies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFrequencies();
  }, []);

  return (
    <AudioProvider>
      <div className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 relative overflow-hidden bg-gradient-to-b from-purple-100/80 to-background dark:from-purple-900/30 dark:to-background">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-100/30 to-transparent dark:from-purple-900/10 dark:to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200/20 dark:bg-purple-700/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200/20 dark:bg-blue-700/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4 md:mb-5">
                <Badge variant="success" className="px-2 md:px-3 py-1 text-xs md:text-sm">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Eleve suas sessões terapêuticas
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-6 animate-fade-in leading-tight">
                <span className="text-primary dark:text-primary">Transforme </span> 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">Suas Sessões Terapêuticas</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 animate-fade-in">
                Descubra como áudios com frequências quânticas podem elevar a experiência dos seus clientes, aumentar a eficácia das suas terapias e diferenciar o seu trabalho.
              </p>
              
              {/* Trial Badge */}
              <div className="mb-6 md:mb-8 bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-3 md:p-4 rounded-lg border border-amber-500/30 shadow-lg dark:from-amber-600/30 dark:to-amber-700/30 dark:border-amber-600/40 animate-pulse">
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <Gift className="h-5 w-5 md:h-6 md:w-6 text-amber-500 dark:text-amber-400" />
                  <h3 className="text-lg md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                    Teste por 7 dias Grátis
                  </h3>
                </div>
                <p className="text-sm md:text-base text-amber-700 dark:text-amber-300 mb-2 md:mb-3">
                  Acesso completo a todas as frequências premium e recursos exclusivos para suas sessões
                </p>
                <Button asChild size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md">
                  <Link to="/auth">
                    Comece Agora
                    <ArrowRight className="ml-1 md:ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-8 md:mb-12">
                <Button asChild size={isMobile ? "default" : "lg"} className="w-full sm:w-auto rounded-full animate-fade-in bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md shadow-purple-500/20">
                  <Link to="/auth" className="gap-1 md:gap-2 text-sm md:text-base">
                    Transforme Suas Sessões
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto rounded-full animate-fade-in border-purple-300 dark:border-purple-700 shadow-sm">
                  <Link to="/scientific" className="gap-1 md:gap-2 text-sm md:text-base">
                    <ShieldCheck className="h-4 w-4" />
                    Base Científica
                  </Link>
                </Button>
              </div>
              
              {/* Features */}
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-2 mt-6' : 'sm:grid-cols-3 gap-4 max-w-3xl mx-auto'}`}>
                <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-3 md:p-4 rounded-xl backdrop-blur-sm shadow-sm">
                  <Headphones className="h-5 w-5 md:h-6 md:w-6 text-primary mb-1 md:mb-2" />
                  <h3 className="font-medium text-sm md:text-base">Áudio Imersivo</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Experiência sonora completa</p>
                </div>
                <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-3 md:p-4 rounded-xl backdrop-blur-sm shadow-sm">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-primary mb-1 md:mb-2" />
                  <h3 className="font-medium text-sm md:text-base">Resultado Imediato</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Relaxamento em minutos</p>
                </div>
                <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-3 md:p-4 rounded-xl backdrop-blur-sm shadow-sm">
                  <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-primary mb-1 md:mb-2" />
                  <h3 className="font-medium text-sm md:text-base">Base Científica</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Pesquisas comprovadas</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Problem Section */}
        <section className="py-12 md:py-16 bg-gradient-to-t from-purple-50/50 to-transparent dark:from-purple-900/5 dark:to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <h2 className="text-2xl md:text-4xl font-bold">Por que Suas Sessões Podem Estar Perdendo Impacto?</h2>
              </div>
              
              <p className="text-base md:text-lg mb-6 md:mb-8 text-muted-foreground">
                Como terapeuta, você sabe que criar uma experiência profunda e transformadora para seus clientes é essencial. Mas, muitas vezes, você enfrenta desafios como:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-sm">
                  <CardContent className="pt-5 md:pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 md:mb-4">
                        <Clock className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Tempo para Relaxar</h3>
                      <p className="text-sm md:text-base text-muted-foreground">Clientes que demoram para relaxar ou entrar em estados meditativos.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-sm">
                  <CardContent className="pt-5 md:pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 md:mb-4">
                        <ChartLine className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Diferenciação</h3>
                      <p className="text-sm md:text-base text-muted-foreground">Dificuldade em diferenciar suas sessões da concorrência.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-sm">
                  <CardContent className="pt-5 md:pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 md:mb-4">
                        <Package className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Ferramentas</h3>
                      <p className="text-sm md:text-base text-muted-foreground">Falta de ferramentas práticas para intensificar os resultados das terapias.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-white/80 dark:bg-white/5 p-4 md:p-6 rounded-xl backdrop-blur-sm border border-purple-200 dark:border-purple-800/30">
                <p className="text-base md:text-lg">
                  Nós entendemos. E é por isso que criamos as <strong className="text-primary">Frequências de Alta Performance para Terapeutas</strong>, uma solução comprovada para transformar suas sessões em experiências únicas e memoráveis.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Solution Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <ChartLine className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <h2 className="text-2xl md:text-4xl font-bold">O Poder das Frequências Quânticas nas Suas Mãos</h2>
              </div>
              
              <p className="text-base md:text-lg mb-6 md:mb-8 text-muted-foreground">
                As Frequências de Alta Performance são áudios cuidadosamente projetados com ondas sonoras específicas (como alfa, theta e delta) que induzem estados profundos de relaxamento, clareza e cura. Desenvolvidas com base em estudos de neurociência e musicoterapia.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                <div className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-white/5 dark:to-purple-900/10 p-4 md:p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-3 flex items-center">
                    <Play className="h-4 w-4 md:h-5 md:w-5 text-primary mr-2" />
                    Como Funciona
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                    Cada áudio é calibrado para estimular o cérebro a entrar em estados específicos, promovendo bem-estar, foco ou cura emocional. Você pode usá-los em:
                  </p>
                  <ul className="space-y-1 md:space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary mr-1 md:mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">Sessões presenciais com sistema de som</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary mr-1 md:mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">Atendimentos online via Zoom ou Meet</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary mr-1 md:mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">Material complementar para prática em casa</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-white/5 dark:to-purple-900/10 p-4 md:p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-3 flex items-center">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-primary mr-2" />
                    Perfeito Para
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                    Nossas frequências são ideais para profissionais que trabalham com:
                  </p>
                  <ul className="space-y-1 md:space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary mr-1 md:mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">Sessões de Reiki e terapias energéticas</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary mr-1 md:mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">Meditação guiada e mindfulness</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary mr-1 md:mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">Coaching e desenvolvimento pessoal</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-primary mr-1 md:mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">Hipnoterapia e constelação familiar</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild size={isMobile ? "default" : "lg"} className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md">
                  <Link to="/auth">
                    Quero Transformar Minhas Sessões
                    <ArrowRight className="ml-1 md:ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-900/5 dark:to-transparent">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 justify-center">
                <Check className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <h2 className="text-2xl md:text-4xl font-bold text-center">Por que Escolher as Frequências de Alta Performance?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex bg-white/70 dark:bg-white/5 p-3 md:p-5 rounded-xl shadow-sm">
                    <div className="mr-3 md:mr-4 mt-1">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <benefit.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base md:text-xl font-medium mb-1 md:mb-2">{benefit.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Before & After Comparison */}
              <div className="bg-white/80 dark:bg-white/5 rounded-xl p-4 md:p-6 mb-8 md:mb-12 shadow-sm">
                <h3 className="text-xl md:text-2xl font-medium mb-3 md:mb-4 text-center">Transforme Suas Sessões</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="border border-red-200 dark:border-red-900/30 rounded-lg p-3 md:p-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-1 md:mb-2 text-sm md:text-base">Sessões Tradicionais</h4>
                    <ul className="space-y-2 md:space-y-3">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✖</span>
                        <span className="text-xs md:text-sm text-muted-foreground">10-15 minutos para clientes relaxarem</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✖</span>
                        <span className="text-xs md:text-sm text-muted-foreground">Dificuldade para entrar em estado meditativo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✖</span>
                        <span className="text-xs md:text-sm text-muted-foreground">Mesmas ferramentas que a concorrência</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✖</span>
                        <span className="text-xs md:text-sm text-muted-foreground">Resultados variáveis entre sessões</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-green-200 dark:border-green-900/30 rounded-lg p-3 md:p-4">
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-1 md:mb-2 text-sm md:text-base">Com Frequências de Alta Performance</h4>
                    <ul className="space-y-2 md:space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-xs md:text-sm text-muted-foreground">3-5 minutos para relaxamento profundo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-xs md:text-sm text-muted-foreground">Acesso rápido a estados meditativos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-xs md:text-sm text-muted-foreground">Diferenciação clara no mercado</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-xs md:text-sm text-muted-foreground">Resultados consistentes em cada sessão</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild size={isMobile ? "default" : "lg"} className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md">
                  <Link to="/auth">
                    Quero Esses Resultados
                    <ArrowRight className="ml-1 md:ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 justify-center">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <h2 className="text-2xl md:text-4xl font-bold text-center">O que Terapeutas Estão Dizendo</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white/70 dark:bg-white/5 p-4 md:p-6 rounded-xl shadow-sm">
                    <div className="flex flex-col h-full">
                      <div className="mb-3 md:mb-4">
                        <div className="flex text-amber-500 mb-1 md:mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                          ))}
                        </div>
                        <p className="italic text-sm md:text-base text-muted-foreground">"{testimonial.text}"</p>
                      </div>
                      <div className="mt-auto pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-800">
                        <p className="font-medium text-sm md:text-base">{testimonial.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mb-8 md:mb-12">
                <div className="bg-amber-100/50 dark:bg-amber-900/20 py-1 md:py-2 px-3 md:px-4 rounded-full flex items-center">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mr-1 md:mr-2 fill-amber-500" />
                  <span className="font-medium text-amber-800 dark:text-amber-300 text-xs md:text-sm">Mais de 500 terapeutas satisfeitos</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How to Use Section */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-t from-purple-50/50 to-transparent dark:from-purple-900/5 dark:to-transparent">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 justify-center">
                <Play className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <h2 className="text-2xl md:text-4xl font-bold text-center">Integre as Frequências em Suas Práticas Hoje</h2>
              </div>
              
              <p className="text-base md:text-lg text-center mb-6 md:mb-10 text-muted-foreground max-w-3xl mx-auto">
                Nossos áudios são fáceis de usar e adaptáveis a qualquer tipo de terapia
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="bg-white/70 dark:bg-white/5 rounded-xl p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Headphones className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Sessões Presenciais</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Toque os áudios em um sistema de som ou ofereça fones de ouvido para uma experiência imersiva.
                  </p>
                </div>
                
                <div className="bg-white/70 dark:bg-white/5 rounded-xl p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Play className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Sessões Online</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Integre os áudios em plataformas como Zoom ou grave meditações guiadas com as frequências ao fundo.
                  </p>
                </div>
                
                <div className="bg-white/70 dark:bg-white/5 rounded-xl p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Package className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Material Complementar</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Disponibilize os áudios para seus clientes praticarem em casa, reforçando os resultados da terapia.
                  </p>
                </div>
              </div>
              
              {/* Bonus Section */}
              <div className="bg-gradient-to-r from-purple-100/70 to-purple-200/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center flex items-center justify-center">
                  <Gift className="h-5 w-5 md:h-6 md:w-6 text-primary mr-1 md:mr-2" />
                  Bônus Exclusivo para Terapeutas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                  <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 md:p-4">
                    <h4 className="font-medium text-primary mb-1 md:mb-2 text-sm md:text-base">Guia Prático</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Manual com dicas para usar as frequências em diferentes tipos de sessões.
                    </p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 md:p-4">
                    <h4 className="font-medium text-primary mb-1 md:mb-2 text-sm md:text-base">Playlists Personalizadas</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Áudios organizados por objetivo (relaxamento, cura, foco, energia).
                    </p>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 md:p-4">
                    <h4 className="font-medium text-primary mb-1 md:mb-2 text-sm md:text-base">Comunidade Exclusiva</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Grupo no WhatsApp para trocar experiências com outros terapeutas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 justify-center">
                <Package className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <h2 className="text-2xl md:text-4xl font-bold text-center">Eleve Suas Sessões por Apenas R$ 97,00</h2>
              </div>
              
              <div className="bg-white/80 dark:bg-white/5 rounded-xl p-5 md:p-8 shadow-md border border-purple-200/50 dark:border-purple-800/30 mb-8 md:mb-12">
                <div className="text-center mb-4 md:mb-6">
                  <p className="text-lg md:text-xl mb-1 md:mb-2">
                    Por apenas <span className="text-xl md:text-2xl font-bold text-primary">R$ 97,00</span>
                    <span className="text-muted-foreground ml-1 md:ml-2 text-xs md:text-sm">(ou 12x de R$ 9,70)</span>
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Você terá acesso imediato a:
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-2 md:gap-y-4 mb-5 md:mb-8">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Coleção completa de Frequências de Alta Performance</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Bônus exclusivos para terapeutas</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Atualizações gratuitas de novos áudios</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Garantia de 7 dias: devolução integral do valor</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button asChild size={isMobile ? "default" : "lg"} className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md px-6 md:px-10 text-base md:text-lg">
                    <Link to="/auth">
                      Quero as Frequências Agora
                      <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  </Button>
                  
                  <div className="mt-3 md:mt-4 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                    <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Compra 100% Segura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-900/5 dark:to-transparent">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 justify-center">
                <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <h2 className="text-2xl md:text-4xl font-bold text-center">Tire Suas Dúvidas</h2>
              </div>
              
              <div className="bg-white/80 dark:bg-white/5 rounded-xl p-4 md:p-6 shadow-sm">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-sm md:text-base py-3">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-xs md:text-sm text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-xl p-5 md:p-8 text-center">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Pronto para Transformar Suas Sessões?</h2>
                <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
                  Junte-se a mais de 500 terapeutas que já estão elevando suas sessões com as frequências de alta performance.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Button asChild size={isMobile ? "default" : "lg"} className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md">
                    <Link to="/auth">
                      Começar Agora com 7 Dias Grátis
                      <ArrowRight className="ml-1 md:ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="rounded-full border-purple-300 dark:border-purple-700">
                    <Link to="/scientific">
                      Ver Base Científica
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer with contact */}
        <section className="py-8 md:py-12 px-4 bg-gradient-to-t from-purple-100/30 to-transparent dark:from-purple-900/10 dark:to-transparent">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 flex items-center">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary mr-1 md:mr-2" />
                    Contato
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-1 md:mb-2">Ficou com alguma dúvida? Entre em contato:</p>
                  <a href="mailto:contato@kefersolucoes.com.br" className="text-primary hover:underline text-sm md:text-base">contato@kefersolucoes.com.br</a>
                  <p className="mt-2 md:mt-4 text-sm md:text-base text-muted-foreground">WhatsApp: (44) 99727-0698</p>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Informações Legais</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-1 md:mb-2">CNPJ: 14.164.334/0001-05</p>
                  <p className="text-sm md:text-base text-muted-foreground mb-2 md:mb-4">Avenida Doutor Luiz Teixeira Mendes, 3096 - Zona 05, Maringa - PR</p>
                  <Link to="/terms" className="text-primary hover:underline text-sm md:text-base">Termos de Uso e Política de Privacidade</Link>
                </div>
              </div>
              
              <Separator className="my-6 md:my-8" />
              
              <div className="text-center text-xs md:text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
              </div>
            </div>
          </div>
        </section>
        
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default Index;
