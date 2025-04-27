
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks';

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

      const response = await supabase.functions.invoke('create-subscription', {
        body: { planId },
      });

      if (response.error) throw new Error(response.error.message);
      
      // Redirecionar para página de pagamento do Mercado Pago
      window.location.href = response.data.init_point;
    } catch (error) {
      toast({
        title: "Erro ao processar assinatura",
        description: "Ocorreu um erro ao processar sua assinatura. Tente novamente.",
        variant: "destructive",
      });
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
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
            <Button 
              onClick={() => handleSubscribe(plan.id)} 
              className="w-full"
            >
              Assinar agora
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
