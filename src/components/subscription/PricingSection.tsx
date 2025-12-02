import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Shield, Gift, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
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
    <section className="py-16 px-4 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10 dark:to-background rounded-3xl my-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Invista em <span className="text-primary">Você</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Quanto você já gastou com médicos, remédios e terapias que não funcionaram? 
            Por menos que uma consulta, transforme sua vida para sempre.
          </p>
        </div>

        {/* Garantia */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
          <div className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-full">
            <Gift className="h-4 w-4" />
            <span>30 dias grátis para testar</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4" />
            <span>Garantia total de satisfação</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/10 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full">
            <Clock className="h-4 w-4" />
            <span>Cancele quando quiser</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative overflow-hidden ${
              plan.popular ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' : ''
            }`}>
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Mais Escolhido
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {plan.name}
                  {plan.popular && <Crown className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
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
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      = R$16,58/mês
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature.title}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80'}`}
                  size="lg"
                  onClick={() => handleSubscribe(plan.id)}
                >
                  Começar Minha Transformação
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ rápido */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4">Perguntas Frequentes</h3>
          <div className="space-y-4 text-left">
            <div className="bg-white/50 dark:bg-white/5 p-4 rounded-lg">
              <p className="font-medium mb-1">E se não funcionar para mim?</p>
              <p className="text-sm text-muted-foreground">
                Você tem 30 dias para testar gratuitamente. Se não sentir resultados, cancele sem pagar nada.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-white/5 p-4 rounded-lg">
              <p className="font-medium mb-1">Preciso de fones especiais?</p>
              <p className="text-sm text-muted-foreground">
                Não! Funciona com qualquer fone de ouvido ou até mesmo nas caixas de som do celular.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-white/5 p-4 rounded-lg">
              <p className="font-medium mb-1">Quanto tempo preciso usar por dia?</p>
              <p className="text-sm text-muted-foreground">
                Apenas 15-30 minutos por dia são suficientes. Você pode ouvir enquanto trabalha, medita ou relaxa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
