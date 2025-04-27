
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell
} from '@/components/ui/table';
import { 
  Card, CardHeader, CardContent, CardTitle, 
  CardDescription
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

// Simplify types to avoid circular references
interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
}

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
}

interface Subscriber {
  id: string;
  email: string;
  subscription_end: string;
  created_at: string;
  last_payment_date: string | null;
  subscribed: boolean;
  updated_at: string;
  user_id: string | null;
  plan_id: string | null;
  userProfile: UserProfile | null;
  plan: Plan | null;
}

// Raw data from database
interface DbSubscriber {
  id: string;
  email: string;
  subscription_end: string;
  created_at: string;
  last_payment_date: string | null;
  subscribed: boolean;
  updated_at: string;
  user_id: string | null;
  plan_id: string | null;
}

export const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filterPlan, setFilterPlan] = useState('all');
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load subscription plans
        const { data: plansData, error: plansError } = await supabase
          .from('subscription_plans')
          .select('id, name, price, interval')
          .order('price', { ascending: true });
        
        if (plansError) throw plansError;
        setPlans(plansData || []);
        
        // Fetch subscribers data with basic fields only
        const query = supabase
          .from('subscribers')
          .select('id, email, subscription_end, created_at, last_payment_date, subscribed, updated_at, user_id, plan_id')
          .eq('subscribed', true);
        
        if (filterPlan !== 'all') {
          query.eq('plan_id', filterPlan);
        }
        
        const { data: subscribersData, error: subscribersError } = await query.order('subscription_end', { ascending: true });
        
        if (subscribersError) throw subscribersError;
        if (!subscribersData) {
          setSubscriptions([]);
          return;
        }
        
        // Process subscribers data with additional fetches for related data
        const processedSubscribers: Subscriber[] = [];
        
        for (const subscriber of subscribersData as DbSubscriber[]) {
          let userProfile: UserProfile | null = null;
          let plan: Plan | null = null;
          
          // Fetch related user profile if user_id exists
          if (subscriber.user_id) {
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('id, full_name')
              .eq('id', subscriber.user_id)
              .single();
              
            if (profileData) {
              userProfile = {
                id: profileData.id,
                email: subscriber.email, // Use subscriber email as fallback
                full_name: profileData.full_name
              };
            }
          }
          
          // Fetch plan details if plan_id exists
          if (subscriber.plan_id) {
            const { data: planData } = await supabase
              .from('subscription_plans')
              .select('id, name, price, interval')
              .eq('id', subscriber.plan_id)
              .single();
              
            if (planData) {
              plan = {
                id: planData.id,
                name: planData.name,
                price: planData.price,
                interval: planData.interval
              };
            }
          }
          
          // Add processed subscriber
          processedSubscribers.push({
            ...subscriber,
            userProfile,
            plan
          });
        }
        
        setSubscriptions(processedSubscribers);
      } catch (error) {
        console.error('Error loading subscriptions data:', error);
        toast({
          title: "Erro ao carregar assinaturas",
          description: "Ocorreu um problema ao buscar os dados de assinaturas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [filterPlan]);
  
  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Assinaturas</h1>
        <p className="text-muted-foreground">Visualize e gerencie as assinaturas de usuários</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Assinaturas Ativas</CardTitle>
              <CardDescription>Todos os usuários com assinaturas ativas</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filtrar por plano:</span>
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os planos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Término</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.length > 0 ? (
                    subscriptions.map((subscription) => {
                      const remainingDays = getRemainingDays(subscription.subscription_end);
                      
                      return (
                        <TableRow key={subscription.id}>
                          <TableCell className="font-medium">
                            {subscription.userProfile?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {subscription.userProfile?.email || subscription.email || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {subscription.plan?.name || 'Plano Desconhecido'}
                          </TableCell>
                          <TableCell>
                            {subscription.plan ? (
                              <div>
                                {new Intl.NumberFormat('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL'
                                }).format(subscription.plan.price)}
                                <span className="text-xs text-muted-foreground ml-1">
                                  /{subscription.plan.interval === 'month' ? 'mês' : 'ano'}
                                </span>
                              </div>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(subscription.subscription_end).toLocaleDateString('pt-BR')}
                            <span className="block text-xs text-muted-foreground">
                              {remainingDays > 0 ? `${remainingDays} dias restantes` : 'Expirada'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              remainingDays <= 0 
                                ? 'bg-red-100 text-red-800' 
                                : remainingDays <= 7
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {remainingDays <= 0 
                                ? 'Expirada' 
                                : remainingDays <= 7
                                ? 'Expirando em breve'
                                : 'Ativa'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma assinatura encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
