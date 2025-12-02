import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Shield, Gift, Clock, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface PlanFeature {
  id: string;
  title: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  interval: 'month' | 'year';
  features: PlanFeature[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Mensal",
    description: "Comece sua transformação hoje",
    price: 39.90,
    interval: "month",
    features: [
      { id: "f1", title: "Acesso a todas frequências premium" },
      { id: "f2", title: "Protocolo de 21 dias incluído" },
      { id: "f3", title: "SentiPassos - Caminhadas Terapêuticas" },
      { id: "f4", title: "Sem efeitos colaterais" },
      { id: "f5", title: "Suporte por WhatsApp" }
    ]
  },
  {
    id: "pro",
    name: "Anual",
    description: "Melhor custo-benefício",
    price: 199.00,
    originalPrice: 478.80,
    interval: "year",
    popular: true,
    features: [
      { id: "f1", title: "Tudo do plano mensal" },
      { id: "f2", title: "Economize R$279,80 por ano" },
      { id: "f3", title: "Frequências exclusivas mensais" },
      { id: "f4", title: "Programa completo de transformação" },
      { id: "f5", title: "Suporte prioritário" },
      { id: "f6", title: "Acesso antecipado a novidades" }
    ]
  }
];

export function PricingSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = (planId: string) => {
    if (!user) {
      toast({
        title: "Faça login primeiro",
        description: "Você precisa estar logado para assinar um plano.",
        variant: "destructive",
      });
      navigate('/auth', { state: { returnTo: '/premium#planos' } });
      return;
    }

    navigate('/premium#planos', { replace: true });
    window.location.href = '/premium#planos';
  };

  return (
    <section className="py-16 sm:py-24 px-2 sm:px-4 relative overflow-hidden sales-section">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-background to-background dark:from-purple-900/10 dark:via-background dark:to-background pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-amber-300/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Invista em <span className="gradient-text-animated">Você</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Quanto você já gastou com médicos, remédios e terapias que não funcionaram? 
            Por menos que uma consulta, transforme sua vida para sempre.
          </p>
        </div>

        {/* Garantias */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
          <div className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2.5 rounded-full font-medium">
            <Gift className="h-5 w-5" />
            <span>30 dias grátis para testar</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 px-4 py-2.5 rounded-full font-medium">
            <Shield className="h-5 w-5" />
            <span>Garantia total de satisfação</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/10 text-purple-700 dark:text-purple-400 px-4 py-2.5 rounded-full font-medium">
            <Clock className="h-5 w-5" />
            <span>Cancele quando quiser</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden card-smooth bg-white/70 dark:bg-white/5 backdrop-blur-sm ${
                plan.popular ? 'border-primary shadow-xl shadow-primary/20 scale-[1.02]' : 'border-border/50'
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5" />
                    Mais Escolhido
                  </div>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  {plan.name}
                  {plan.popular && <Crown className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4 pt-4 border-t border-border/50">
                  {plan.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through mr-2">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(plan.originalPrice)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(plan.price)}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    /{plan.interval === 'month' ? 'mês' : 'ano'}
                  </span>
                  {plan.interval === 'year' && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                      = R$16,58/mês (economize 58%)
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-center">
                      <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      </div>
                      <span>{feature.title}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full rounded-full text-base py-6 transition-all duration-300 hover:scale-105 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 glow-effect' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  size="lg"
                  onClick={() => handleSubscribe(plan.id)}
                >
                  Começar Minha Transformação
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ rápido */}
        <div className="mt-14 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-6">Perguntas Frequentes</h3>
          <div className="space-y-4">
            <div className="bg-white/60 dark:bg-white/5 p-5 rounded-2xl card-smooth backdrop-blur-sm">
              <p className="font-semibold mb-2">E se não funcionar para mim?</p>
              <p className="text-muted-foreground leading-relaxed">
                Você tem 30 dias para testar gratuitamente. Se não sentir resultados, cancele sem pagar nada. Zero risco.
              </p>
            </div>
            <div className="bg-white/60 dark:bg-white/5 p-5 rounded-2xl card-smooth backdrop-blur-sm">
              <p className="font-semibold mb-2">Preciso de fones especiais?</p>
              <p className="text-muted-foreground leading-relaxed">
                Não! Funciona com qualquer fone de ouvido ou até mesmo nas caixas de som do celular.
              </p>
            </div>
            <div className="bg-white/60 dark:bg-white/5 p-5 rounded-2xl card-smooth backdrop-blur-sm">
              <p className="font-semibold mb-2">Quanto tempo preciso usar por dia?</p>
              <p className="text-muted-foreground leading-relaxed">
                Apenas 15-30 minutos por dia são suficientes. Você pode ouvir enquanto trabalha, medita ou relaxa.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-14">
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl glow-effect text-lg px-10 py-7 transition-all duration-300 hover:scale-105">
            <Link to="/auth">
              <Gift className="mr-2 h-5 w-5" />
              Começar Teste Grátis de 30 Dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Sem compromisso • Cancele quando quiser • Garantia de satisfação
          </p>
        </div>
      </div>
    </section>
  );
}
