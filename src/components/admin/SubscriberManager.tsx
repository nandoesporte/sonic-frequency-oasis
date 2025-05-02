import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Check, X, UserSearch, Calendar, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { addMonths } from 'date-fns';

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
  const [newUserEmail, setNewUserEmail] = useState('');
  const [tier, setTier] = useState('Premium');
  const [months, setMonths] = useState('1');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addingSubscription, setAddingSubscription] = useState(false);
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

  const addManualSubscription = async () => {
    if (!newUserEmail || !newUserEmail.includes('@')) {
      toast.error('Email inválido', {
        description: 'Por favor, forneça um email válido.'
      });
      return;
    }

    setAddingSubscription(true);
    try {
      // Check if user exists in auth
      const { data: userData, error: userError } = await supabase
        .from('users_view')
        .select('id, email')
        .eq('email', newUserEmail)
        .maybeSingle();

      // Calculate subscription end date
      const endDate = addMonths(new Date(), parseInt(months));
      
      // If user exists in auth, use their ID, otherwise just use email
      const subscriptionData = {
        email: newUserEmail,
        user_id: userData?.id || null,
        subscribed: true,
        subscription_tier: tier,
        subscription_end: endDate.toISOString(),
      };

      // Upsert to subscribers table (will update if email exists or insert if not)
      const { error } = await supabase
        .from('subscribers')
        .upsert(subscriptionData, { 
          onConflict: 'email' // Update if email already exists
        });
      
      if (error) {
        console.error('Error adding subscription:', error);
        throw error;
      }
      
      toast.success('Assinatura adicionada', {
        description: `Assinatura '${tier}' adicionada para ${newUserEmail} com sucesso.`
      });
      
      // Reset form and close dialog
      setNewUserEmail('');
      setTier('Premium');
      setMonths('1');
      setDialogOpen(false);
      
      // Refresh subscribers list
      fetchSubscribers();
    } catch (error) {
      console.error('Error adding subscription:', error);
      toast.error('Erro ao adicionar assinatura', {
        description: 'Não foi possível adicionar a assinatura. Verifique se o email é válido.'
      });
    } finally {
      setAddingSubscription(false);
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Assinatura
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Assinatura Manual</DialogTitle>
                <DialogDescription>
                  Adicione uma assinatura para um usuário manualmente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email do usuário</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="usuario@email.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se o usuário já existe, a assinatura será vinculada à sua conta
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tier">Plano de assinatura</Label>
                  <select 
                    id="tier"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Premium">Premium</option>
                    <option value="Basic">Básico</option>
                    <option value="Pro">Profissional</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="months">Duração (meses)</Label>
                  <select 
                    id="months"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="1">1 mês</option>
                    <option value="3">3 meses</option>
                    <option value="6">6 meses</option>
                    <option value="12">12 meses</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Expira em: {formatDate(addMonths(new Date(), parseInt(months)).toISOString())}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={addingSubscription}
                >
                  Cancelar
                </Button>
                <Button 
                  type="button"
                  onClick={addManualSubscription} 
                  disabled={addingSubscription || !newUserEmail}
                >
                  {addingSubscription ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Adicionar Assinatura'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
