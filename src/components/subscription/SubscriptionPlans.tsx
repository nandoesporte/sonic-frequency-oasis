
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Crown } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
}

export function SubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('price');

      if (error) {
        toast({
          title: "Erro ao carregar planos",
          description: "Não foi possível carregar os planos disponíveis.",
          variant: "destructive",
        });
        return;
      }

      setPlans(data);
      setLoading(false);
    };

    fetchPlans();
  }, [toast]);

  const handleSubscribe = async (planId: string) => {
    try {
      if (!user) {
        toast({
          title: "Faça login primeiro",
          description: "Você precisa estar logado para assinar um plano.",
          variant: "destructive",
        });
        return;
      }

      setProcessingPlanId(planId);
      
      const response = await supabase.functions.invoke('create-subscription', {
        body: { planId },
      });

      if (response.error) throw new Error(response.error.message);
      
      // Redirecionar para página de pagamento do Mercado Pago
      window.location.href = response.data.init_point;
    } catch (error) {
      setProcessingPlanId(null);
      toast({
        title: "Erro ao processar assinatura",
        description: "Ocorreu um erro ao processar sua assinatura. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro na assinatura:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
      {plans.map((plan) => {
        const isMonthly = plan.interval === 'month';
        const isPlanProcessing = processingPlanId === plan.id;
        
        return (
          <Card key={plan.id} className={`flex flex-col transition-all ${
            isMonthly ? '' : 'border-primary shadow-lg relative'
          }`}>
            {!isMonthly && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Melhor Valor
                </div>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center">
                {plan.name}
                {!isMonthly && <Crown className="ml-2 h-5 w-5 text-primary" />}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              <div className="text-3xl font-bold mb-4">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: plan.currency,
                }).format(plan.price)}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.interval === 'month' ? 'mês' : 'ano'}
                </span>
              </div>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Acesso a todas frequências premium</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Recomendações personalizadas</span>
                </li>
                {!isMonthly && (
                  <>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Economize {Math.round((1 - (plan.price / (19.90 * 12))) * 100)}% comparado ao plano mensal</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Frequências exclusivas mensais</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe(plan.id)} 
                className="w-full"
                disabled={isPlanProcessing}
                variant={isMonthly ? "outline" : "default"}
              >
                {isPlanProcessing ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-white inline-block"></span>
                    Processando...
                  </>
                ) : (
                  'Assinar agora'
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
