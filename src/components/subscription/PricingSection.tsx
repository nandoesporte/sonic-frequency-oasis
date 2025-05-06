
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";
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
  interval: 'month' | 'year';
  features: PlanFeature[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Mensal",
    description: "Ideal para uso pessoal",
    price: 49.90,
    interval: "month",
    features: [
      { id: "f1", title: "Acesso a todas frequências premium" },
      { id: "f2", title: "Recomendações personalizadas" },
      { id: "f3", title: "Sem anúncios" }
    ]
  },
  {
    id: "pro",
    name: "Anual",
    description: "Economize com plano anual",
    price: 199.00,
    interval: "year",
    popular: true,
    features: [
      { id: "f1", title: "Acesso a todas frequências premium" },
      { id: "f2", title: "Recomendações personalizadas" },
      { id: "f3", title: "Sem anúncios" },
      { id: "f4", title: "Frequências exclusivas mensais" },
      { id: "f5", title: "Suporte prioritário" }
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

    // Navigate directly to premium page with a hash that will scroll to the plans section
    // Use replace to replace the current history entry to ensure proper behavior
    navigate('/premium#planos', { replace: true });
    
    // Force a page reload to ensure we start from the top
    window.location.href = '/premium#planos';
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10 dark:to-background rounded-3xl my-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planos <span className="text-primary">Premium</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Escolha o plano ideal e desbloqueie centenas de frequências premium para melhorar seu bem-estar diário
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative overflow-hidden ${
              plan.popular ? 'border-primary shadow-lg shadow-primary/20' : ''
            }`}>
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                    Mais Popular
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
                  <span className="text-4xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(plan.price)}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    /{plan.interval === 'month' ? 'mês' : 'ano'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span>{feature.title}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? '' : 'bg-secondary hover:bg-secondary/80'}`}
                  size="lg"
                  onClick={() => handleSubscribe(plan.id)}
                >
                  Comece Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
