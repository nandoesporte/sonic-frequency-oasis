
import React, { useEffect, useState } from 'react';
import { getSystemStats, getRecentPayments } from '@/contexts/admin-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Users, CreditCard, FileText, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    totalUsers: number;
    subscribedUsers: number;
    totalFrequencies: number;
    recentPayments: number;
  } | null>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getSystemStats();
        const paymentsData = await getRecentPayments(5);
        
        setStats(statsData);
        setRecentPayments(paymentsData);
      } catch (err) {
        console.error('Error loading admin dashboard data:', err);
        setError('Falha ao carregar dados do painel. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        {error}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                <h3 className="text-2xl font-bold">{stats?.totalUsers || 0}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Users size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuários Assinantes</p>
                <h3 className="text-2xl font-bold">{stats?.subscribedUsers || 0}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <CreditCard size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Frequências</p>
                <h3 className="text-2xl font-bold">{stats?.totalFrequencies || 0}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <FileText size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pagamentos Recentes</p>
                <h3 className="text-2xl font-bold">{stats?.recentPayments || 0}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <TrendingUp size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Recentes</CardTitle>
          <CardDescription>Os últimos 5 pagamentos processados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.user_id?.email?.[0]?.email || 'Usuário desconhecido'}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: payment.currency || 'BRL' 
                      }).format(payment.amount || 0)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'failed' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status === 'completed' ? 'Concluído' : 
                         payment.status === 'failed' ? 'Falhou' : payment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhum pagamento encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
