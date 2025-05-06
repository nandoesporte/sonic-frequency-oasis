import { useEffect, useState } from 'react';
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
                <Badge variant="success" className="px-3 py-1.5 text-sm md:text-base">
                  <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
                  Eleve suas sessões terapêuticas
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 animate-fade-in leading-tight">
                <span className="text-primary dark:text-primary">Transforme </span> 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">Suas Sessões Terapêuticas</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 animate-fade-in">
                Descubra como áudios com frequências quânticas podem elevar a experiência dos seus clientes, aumentar a eficácia das suas terapias e diferenciar o seu trabalho.
              </p>
              
              {/* Trial Badge */}
              <div className="mb-6 md:mb-8 bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-4 md:p-5 rounded-lg border border-amber-500/30 shadow-lg dark:from-amber-600/30 dark:to-amber-700/30 dark:border-amber-600/40 animate-pulse">
                <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <Gift className="h-6 w-6 md:h-7 md:w-7 text-amber-500 dark:text-amber-400" />
                  <h3 className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                    Teste por 7 dias Grátis
                  </h3>
                </div>
                <p className="text-base md:text-lg text-amber-700 dark:text-amber-300 mb-3 md:mb-4">
                  Acesso completo a todas as frequências premium e recursos exclusivos para suas sessões
                </p>
                <Button asChild size={isMobile ? "lg" : "lg"} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md text-base md:text-lg py-6">
                  <Link to="/auth">
                    Comece Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-5 mb-8 md:mb-12">
                <Button asChild size={isMobile ? "lg" : "lg"} className="w-full sm:w-auto rounded-full animate-fade-in bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md shadow-purple-500/20 text-base py-6">
                  <Link to="/auth" className="gap-2 text-base md:text-lg">
                    Transforme Suas Sessões
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size={isMobile ? "lg" : "lg"} className="w-full sm:w-auto rounded-full animate-fade-in border-purple-300 dark:border-purple-700 shadow-sm text-base py-6">
                  <Link to="/scientific" className="gap-2 text-base md:text-lg">
                    <ShieldCheck className="h-5 w-5" />
                    Base Científica
                  </Link>
                </Button>
              </div>
              
              {/* Features */}
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-4 mt-6' : 'sm:grid-cols-3 gap-5 max-w-3xl mx-auto'}`}>
                <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-4 md:p-5 rounded-xl backdrop-blur-sm shadow-sm">
                  <Headphones className="h-6 w-6 md:h-7 md:w-7 text-primary mb-2 md:mb-3" />
                  <h3 className="font-medium text-base md:text-lg mb-1">Áudio Imersivo</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Experiência sonora completa</p>
                </div>
                <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-4 md:p-5 rounded-xl backdrop-blur-sm shadow-sm">
                  <Star className="h-6 w-6 md:h-7 md:w-7 text-primary mb-2 md:mb-3" />
                  <h3 className="font-medium text-base md:text-lg mb-1">Resultado Imediato</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Relaxamento em minutos</p>
                </div>
                <div className="flex flex-col items-center bg-white/50 dark:bg-white/5 p-4 md:p-5 rounded-xl backdrop-blur-sm shadow-sm">
                  <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-primary mb-2 md:mb-3" />
                  <h3 className="font-medium text-base md:text-lg mb-1">Base Científica</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Pesquisas comprovadas</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Problem Section */}
        <section className="py-12 md:py-16 bg-gradient-to-t from-purple-50/50 to-transparent dark:from-purple-900/5 dark:to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-7">
                <Clock className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Por que Suas Sessões Podem Estar Perdendo Impacto?</h2>
              </div>
              
              <p className="text-lg md:text-xl mb-6 md:mb-8 text-muted-foreground">
                Como terapeuta, você sabe que criar uma experiência profunda e transformadora para seus clientes é essencial. Mas, muitas vezes, você enfrenta desafios como:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-7 md:mb-9">
                <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-sm">
                  <CardContent className="pt-6 md:pt-7">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 md:mb-5">
                        <Clock className="h-8 w-8 md:h-9 md:w-9 text-primary" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-medium mb-2 md:mb-3">Tempo para Relaxar</h3>
                      <p className="text-base md:text-lg text-muted-foreground">Clientes que demoram para relaxar ou entrar em estados meditativos.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-sm">
                  <CardContent className="pt-6 md:pt-7">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 md:mb-5">
                        <ChartLine className="h-8 w-8 md:h-9 md:w-9 text-primary" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-medium mb-2 md:mb-3">Diferenciação</h3>
                      <p className="text-base md:text-lg text-muted-foreground">Dificuldade em diferenciar suas sessões da concorrência.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-sm">
                  <CardContent className="pt-6 md:pt-7">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 md:mb-5">
                        <Package className="h-8 w-8 md:h-9 md:w-9 text-primary" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-medium mb-2 md:mb-3">Ferramentas</h3>
                      <p className="text-base md:text-lg text-muted-foreground">Falta de ferramentas práticas para intensificar os resultados das terapias.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-white/80 dark:bg-white/5 p-5 md:p-7 rounded-xl backdrop-blur-sm border border-purple-200 dark:border-purple-800/30">
                <p className="text-lg md:text-xl">
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
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-7">
                <ChartLine className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">O Poder das Frequências Quânticas nas Suas Mãos</h2>
              </div>
              
              <p className="text-lg md:text-xl mb-6 md:mb-8 text-muted-foreground">
                As Frequências de Alta Performance são áudios cuidadosamente projetados com ondas sonoras específicas (como alfa, theta e delta) que induzem estados profundos de relaxamento, clareza e cura. Desenvolvidas com base em estudos de neurociência e musicoterapia.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                <div className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-white/5 dark:to-purple-900/10 p-5 md:p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl md:text-2xl font-medium mb-3 md:mb-4 flex items-center">
                    <Play className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3" />
                    Como Funciona
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-5">
                    Cada áudio é calibrado para estimular o cérebro a entrar em estados específicos, promovendo bem-estar, foco ou cura emocional. Você pode usá-los em:
                  </p>
                  <ul className="space-y-2 md:space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">Sessões presenciais com sistema de som</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">Atendimentos online via Zoom ou Meet</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">Material complementar para prática em casa</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-white/5 dark:to-purple-900/10 p-5 md:p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl md:text-2xl font-medium mb-3 md:mb-4 flex items-center">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3" />
                    Perfeito Para
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-5">
                    Nossas frequências são ideais para profissionais que trabalham com:
                  </p>
                  <ul className="space-y-2 md:space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">Sessões de Reiki e terapias energéticas</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">Meditação guiada e mindfulness</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">Coaching e desenvolvimento pessoal</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 md:h-6 md:w-6 text-primary mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-base md:text-lg">Hipnoterapia e constelação familiar</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md text-base md:text-lg py-6">
                  <Link to="/auth">
                    Quero Transformar Minhas Sessões
                    <ArrowRight className="ml-2 h-5 w-5" />
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
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 justify-center">
                <Check className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold text-center">Por que Escolher as Frequências de Alta Performance?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex bg-white/70 dark:bg-white/5 p-4 md:p-6 rounded-xl shadow-sm">
                    <div className="mr-4 md:mr-5 mt-1">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <benefit.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-3">{benefit.title}</h3>
                      <p className="text-base md:text-lg text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Before & After Comparison */}
              <div className="bg-white/80 dark:bg-white/5 rounded-xl p-5 md:p-7 mb-8 md:mb-12 shadow-sm">
                <h3 className="text-2xl md:text-3xl font-medium mb-4 md:mb-5 text-center">Transforme Suas Sessões</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div className="border border-red-200 dark:border-red-900/30 rounded-lg p-4 md:p-5">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 md:mb-3 text-base md:text-lg">Sessões Tradicionais</h4>
                    <ul className="space-y-3 md:space-y-4">
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2 text-base md:text-lg">✖</span>
                        <span className="text-sm md:text-base text-muted-foreground">10-15 minutos para clientes relaxarem</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2 text-base md:text-lg">✖</span>
                        <span className="text-sm md:text-base text-muted-foreground">Dificuldade para entrar em estado meditativo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2 text-base md:text-lg">✖</span>
                        <span className="text-sm md:text-base text-muted-foreground">Mesmas ferramentas que a concorrência</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2 text-base md:text-lg">✖</span>
                        <span className="text-sm md:text-base text-muted-foreground">Resultados variáveis entre sessões</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-green-200 dark:border-green-900/30 rounded-lg p-4 md:p-5">
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 md:mb-3 text-base md:text-lg">Com Frequências de Alta Performance</h4>
                    <ul className="space-y-3 md:space-y-4">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 text-base md:text-lg">✓</span>
                        <span className="text-sm md:text-base text-muted-foreground">3-5 minutos para relaxamento profundo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 text-base md:text-lg">✓</span>
                        <span className="text-sm md:text-base text-muted-foreground">Acesso rápido a estados meditativos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 text-base md:text-lg">✓</span>
                        <span className="text-sm md:text-base text-muted-foreground">Diferenciação clara no mercado</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 text-base md:text-lg">✓</span>
                        <span className="text-sm md:text-base text-muted-foreground">Resultados consistentes em cada sessão</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md text-base md:text-lg py-6">
                  <Link to="/auth">
                    Quero Esses Resultados
                    <ArrowRight className="ml-2 h-5 w-5" />
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
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 justify-center">
                <Users className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold text-center">O que Terapeutas Estão Dizendo</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6 md:mb-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white/70 dark:bg-white/5 p-5 md:p-6 rounded-xl shadow-sm">
                    <div className="flex flex-col h-full">
                      <div className="mb-4 md:mb-5">
                        <div className="flex text-amber-500 mb-2 md:mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                          ))}
                        </div>
                        <p className="italic text-base md:text-lg text-muted-foreground">"{testimonial.text}"</p>
                      </div>
                      <div className="mt-auto pt-4 md:pt-5 border-t border-gray-200 dark:border-gray-800">
                        <p className="font-medium text-base md:text-lg">{testimonial.name}</p>
                        <p className="text-sm md:text-base text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mb-8 md:mb-12">
                <div className="bg-amber-100/50 dark:bg-amber-900/20 py-2 md:py-3 px-4 md:px-5 rounded-full flex items-center">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-amber-500 mr-2 md:mr-3 fill-amber-500" />
                  <span className="font-medium text-amber-800 dark:text-amber-300 text-sm md:text-base">Mais de 500 terapeutas satisfeitos</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How to Use Section */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-t from-purple-50/50 to-transparent dark:from-purple-900/5 dark:to-transparent">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 justify-center">
                <Play className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold text-center">Integre as Frequências em Suas Práticas Hoje</h2>
              </div>
              
              <p className="text-lg md:text-xl text-center mb-6 md:mb-10 text-muted-foreground max-w-3xl mx-auto">
                Nossos áudios são fáceis de usar e adaptáveis a qualquer tipo de terapia
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8
