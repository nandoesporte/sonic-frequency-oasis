
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Crown, AlertCircle, Clock } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  kiwify_url: string;  // New field for Kiwify URLs
}

interface SubscriberInfo {
  subscribed: boolean;
  subscription_end?: string;
  plan_id?: string;
}

export function SubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberInfo, setSubscriberInfo] = useState<SubscriberInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlansAndSubscriptionStatus = async () => {
      try {
        // Fetch available plans
        const { data: plansData, error: plansError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('active', true)
          .order('price');

        if (plansError) {
          console.error("Erro ao carregar planos:", plansError);
          toast({
            title: "Erro ao carregar planos",
            description: "Não foi possível carregar os planos disponíveis.",
            variant: "destructive",
          });
          return;
        }

        setPlans(plansData || []);
        
        // If user is logged in, fetch their subscription status
        if (user) {
          const { data: subData, error: subError } = await supabase
            .from('subscribers')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (subError && subError.code !== 'PGRST116') { // Not found error is ok
            console.error("Erro ao carregar dados da assinatura:", subError);
          }
          
          if (subData) {
            setSubscriberInfo(subData);
          }
        }
      } catch (err) {
        console.error("Exceção ao carregar planos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlansAndSubscriptionStatus();
  }, [toast, user]);

  const handleSubscribe = async (plan: Plan) => {
    try {
      setError(null);
      
      if (!user) {
        toast({
          title: "Faça login primeiro",
          description: "Você precisa estar logado para assinar um plano.",
          variant: "destructive",
        });
        return;
      }
      
      // If user is already subscribed to this plan, show a message
      if (subscriberInfo?.subscribed && subscriberInfo.plan_id === plan.id) {
        toast({
          title: "Você já possui este plano",
          description: "Você já está inscrito neste plano de assinatura.",
          variant: "default",
        });
        return;
      }
      
      // Redirect to Kiwify checkout page
      if (plan.kiwify_url) {
        window.location.href = plan.kiwify_url;
      } else {
        toast({
          title: "Link de pagamento não disponível",
          description: "No momento não é possível realizar a assinatura. Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";
      
      setError(errorMessage);
      toast({
        title: "Erro ao processar assinatura",
        description: "Ocorreu um erro ao processar sua assinatura. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro na assinatura:", error);
    }
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Nenhum plano disponível</h3>
        <p className="text-muted-foreground">No momento não há planos disponíveis para assinatura.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Show subscriber info if user is subscribed */}
      {subscriberInfo?.subscribed && (
        <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-medium">Assinatura Ativa</h3>
              <p className="text-sm text-muted-foreground">
                Sua assinatura é válida até {formatExpiryDate(subscriberInfo.subscription_end)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isMonthly = plan.interval === 'month';
          const isCurrentPlan = subscriberInfo?.plan_id === plan.id && subscriberInfo.subscribed;
          
          return (
            <Card key={plan.id} className={`flex flex-col transition-all ${
              isMonthly ? '' : 'border-primary shadow-lg relative'
            } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
              {!isMonthly && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                    Melhor Valor
                  </div>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute top-0 left-0">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-br-lg">
                    Plano Atual
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
                  onClick={() => handleSubscribe(plan)} 
                  className="w-full"
                  disabled={isCurrentPlan}
                  variant={isMonthly ? "outline" : "default"}
                >
                  {isCurrentPlan ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Plano Atual
                    </>
                  ) : (
                    'Assinar agora'
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        
        {error && (
          <div className="col-span-full mt-4 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
            <AlertCircle className="h-5 w-5 text-red-500 inline-block mr-2 mb-1" />
            <span>Erro: {error}. Por favor, tente novamente ou contate o suporte.</span>
          </div>
        )}
      </div>
    </div>
  );
}
