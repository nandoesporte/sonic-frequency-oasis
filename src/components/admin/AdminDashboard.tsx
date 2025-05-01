
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, UserPlus, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalPlans: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalPlans: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Get total subscribers
      const { count: totalSubscribers, error: subscribersError } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });
      
      if (subscribersError) throw subscribersError;
      
      // Get active subscribers
      const { count: activeSubscribers, error: activeError } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('subscribed', true);
      
      if (activeError) throw activeError;
      
      // Get active plans
      const { count: totalPlans, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*', { count: 'exact', head: true });
      
      if (plansError) throw plansError;
      
      setStats({
        totalSubscribers: totalSubscribers || 0,
        activeSubscribers: activeSubscribers || 0,
        totalPlans: totalPlans || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assinantes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">Todos os usuários registrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">Usuários com assinaturas ativas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Disponíveis</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalPlans}</div>
            <p className="text-xs text-muted-foreground">Planos de assinatura configurados</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Acesse as ferramentas de administração</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Webhooks</h3>
                <p className="text-sm text-muted-foreground">
                  Configurar integração com webhooks de pagamento
                </p>
              </div>
              <Button onClick={() => navigate('/webhook-config')}>
                <Settings className="mr-2 h-4 w-4" />
                Configurar
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Planos de Assinatura</h3>
                <p className="text-sm text-muted-foreground">
                  Gerenciar os planos disponíveis
                </p>
              </div>
              <Button variant="outline" onClick={() => document.getElementById('subscription-plans-tab')?.click()}>
                <CreditCard className="mr-2 h-4 w-4" />
                Gerenciar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
