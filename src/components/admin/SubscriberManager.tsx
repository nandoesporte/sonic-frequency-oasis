
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Check, X, UserSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  created_at: string;
}

export function SubscriberManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    fetchSubscribers();
  }, []);
  
  useEffect(() => {
    if (searchEmail.trim() === '') {
      setFilteredSubscribers(subscribers);
    } else {
      const filtered = subscribers.filter(subscriber => 
        subscriber.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    }
  }, [searchEmail, subscribers]);
  
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setSubscribers(data || []);
      setFilteredSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Erro ao carregar assinantes', {
        description: 'Não foi possível carregar os dados dos assinantes.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const toggleSubscriptionStatus = async (subscriber: Subscriber) => {
    try {
      const newStatus = !subscriber.subscribed;
      
      const { error } = await supabase
        .from('subscribers')
        .update({ 
          subscribed: newStatus,
          // If we're setting to unsubscribed, clear the end date
          subscription_end: newStatus ? subscriber.subscription_end : null 
        })
        .eq('id', subscriber.id);
      
      if (error) {
        throw error;
      }
      
      toast.success(
        newStatus ? 'Assinatura ativada' : 'Assinatura desativada', 
        { description: `A assinatura de ${subscriber.email} foi ${newStatus ? 'ativada' : 'desativada'} com sucesso.` }
      );
      
      // Update local state to reflect the change
      setSubscribers(prevSubscribers => 
        prevSubscribers.map(sub => 
          sub.id === subscriber.id 
            ? { ...sub, subscribed: newStatus, subscription_end: newStatus ? sub.subscription_end : null } 
            : sub
        )
      );
    } catch (error) {
      console.error('Error toggling subscription status:', error);
      toast.error('Erro ao alterar status da assinatura', {
        description: 'Não foi possível atualizar o status da assinatura.'
      });
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Assinantes</CardTitle>
        <CardDescription>
          Visualize e gerencie os usuários com assinaturas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
          <div className="relative flex-1 w-full">
            <UserSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={fetchSubscribers} disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Atualizar
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredSubscribers.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isMobile ? "hidden md:table-cell" : ""}>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Plano</TableHead>
                  <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Expira em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className={`font-medium ${isMobile ? "hidden md:table-cell" : ""}`}>{subscriber.email}</TableCell>
                    <TableCell>
                      {subscriber.subscribed ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
                          Inativo
                        </Badge>
                      )}
                      {isMobile && <div className="mt-1 text-xs truncate max-w-[150px]">{subscriber.email}</div>}
                    </TableCell>
                    <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>
                      {subscriber.subscription_tier || 'N/A'}
                    </TableCell>
                    <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>
                      {formatDate(subscriber.subscription_end)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        className={subscriber.subscribed ? 
                          "text-red-500 hover:text-red-700 hover:bg-red-50" : 
                          "text-green-500 hover:text-green-700 hover:bg-green-50"
                        }
                        onClick={() => toggleSubscriptionStatus(subscriber)}
                      >
                        {subscriber.subscribed ? (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            <span className={isMobile ? "hidden sm:inline" : ""}>Desativar</span>
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            <span className={isMobile ? "hidden sm:inline" : ""}>Ativar</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {searchEmail ? 'Nenhum assinante encontrado com este email.' : 'Nenhum assinante cadastrado.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
