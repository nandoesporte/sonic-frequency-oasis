
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, User, Shield, Webhook, Settings, CreditCard, Lock, Menu } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionPlanManager } from '@/components/admin/SubscriptionPlanManager';
import { SubscriberManager } from '@/components/admin/SubscriberManager';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useForm } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { setAdminStatus } = useAuth();
  const [adminUsers, setAdminUsers] = useState<{id: string, email: string}[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const isMobile = useIsMobile();
  
  const passwordForm = useForm({
    defaultValues: {
      password: '',
    }
  });
  
  // Effect to fetch admin users on mount
  useEffect(() => {
    fetchAdminUsers();
    setInitializing(false);
  }, [user]);
  
  // Fetch all admin users
  const fetchAdminUsers = async () => {
    try {
      // First get all admin user IDs
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id');
        
      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        return;
      }
      
      if (!adminData || adminData.length === 0) {
        setAdminUsers([]);
        return;
      }
      
      // Then get user emails from users_view
      const adminIds = adminData.map(admin => admin.user_id);
      const { data: usersData, error: usersError } = await supabase
        .from('users_view')
        .select('id, email')
        .in('id', adminIds);
        
      if (usersError) {
        console.error('Error fetching user emails:', usersError);
        return;
      }
      
      setAdminUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };
  
  // If still initializing, show loading indicator
  if (initializing) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando dados...</p>
      </div>
    );
  }

  const handlePasswordSubmit = (data: { password: string }) => {
    // Check against the specified password
    if (data.password === 'Nando045+-') {
      setIsAuthenticated(true);
      setPasswordError('');
      toast.success('Acesso permitido', {
        description: 'Bem-vindo ao painel administrativo'
      });
    } else {
      setPasswordError('Senha incorreta. Tente novamente.');
      toast.error('Acesso negado', {
        description: 'A senha fornecida está incorreta'
      });
    }
  };
  
  const handleAddAdmin = async () => {
    if (!user) {
      toast.error('Você precisa estar logado', {
        description: 'Faça login para adicionar administradores.'
      });
      return;
    }
    
    if (!email) {
      toast.error('Email obrigatório', {
        description: 'Por favor, informe o email do usuário.'
      });
      return;
    }
    
    setLoading(true);
    try {
      // First check if user exists
      const { data: userData, error: userError } = await supabase
        .from('users_view')
        .select('id, email')
        .eq('email', email)
        .single();
      
      if (userError) {
        toast.error('Usuário não encontrado', {
          description: 'Não foi possível encontrar um usuário com este email.'
        });
        return;
      }
      
      if (!userData || !userData.id) {
        toast.error('Usuário não encontrado', {
          description: 'O usuário precisa criar uma conta primeiro.'
        });
        return;
      }
      
      // Check if user is already an admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userData.id)
        .maybeSingle();
      
      if (existingAdmin) {
        toast.info('Já é administrador', {
          description: `${userData.email} já é um administrador.`
        });
        setEmail('');
        return;
      }
      
      // Add user as admin directly to admin_users table
      const { error } = await supabase
        .from('admin_users')
        .insert([{ user_id: userData.id }]);
      
      if (error) {
        console.error('Error adding admin:', error);
        toast.error('Erro', {
          description: 'Não foi possível adicionar o administrador. Tente novamente.'
        });
        return;
      }
      
      setEmail('');
      toast.success('Administrador adicionado', {
        description: `${userData.email} agora é um administrador.`
      });
      
      // Refresh the admin users list
      fetchAdminUsers();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Erro', {
        description: 'Não foi possível adicionar o administrador. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4 md:px-6 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">Área Restrita</CardTitle>
            <CardDescription className="text-center">
              Digite a senha para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password"
                  {...passwordForm.register('password')}
                  className={passwordError ? 'border-destructive' : ''}
                />
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Acessar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Voltar ao Início
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Main admin content (shown only after authentication)
  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Administração</h1>
        <Button variant="outline" onClick={() => navigate('/')} size={isMobile ? "sm" : "default"}>
          Voltar ao Início
        </Button>
      </div>
      
      <Tabs defaultValue="dashboard" className="mb-6 md:mb-8">
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard" className="flex items-center">
              <User className="w-4 h-4 mr-1 md:mr-2" />
              <span className={isMobile ? "hidden sm:inline" : ""}>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="flex items-center">
              <UserPlus className="w-4 h-4 mr-1 md:mr-2" />
              <span className={isMobile ? "hidden sm:inline" : ""}>Assinantes</span>
            </TabsTrigger>
            <TabsTrigger value="subscription-plans" id="subscription-plans-tab" className="flex items-center">
              <CreditCard className="w-4 h-4 mr-1 md:mr-2" />
              <span className={isMobile ? "hidden sm:inline" : ""}>Planos</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-1 md:mr-2" />
              <span className={isMobile ? "hidden sm:inline" : ""}>Config</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center">
              <Shield className="w-4 h-4 mr-1 md:mr-2" />
              <span className={isMobile ? "hidden sm:inline" : ""}>Admins</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="subscribers">
          <SubscriberManager />
        </TabsContent>
        
        <TabsContent value="subscription-plans">
          <SubscriptionPlanManager />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Ferramentas de administração disponíveis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Webhooks</h3>
                      <p className="text-sm text-muted-foreground">
                        Configurar integração com webhooks de pagamento
                      </p>
                    </div>
                    <Button onClick={() => navigate('/webhook-config')} size={isMobile ? "sm" : "default"}>
                      <Webhook className="mr-2 h-4 w-4" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="admins">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Administrador</CardTitle>
                <CardDescription>
                  Adicione outro usuário como administrador do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email do usuário</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="usuario@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddAdmin} 
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Adicionar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  O usuário deve ter uma conta criada previamente para ser adicionado como administrador.
                </p>
              </CardFooter>
            </Card>
            
            {adminUsers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Administradores Atuais</CardTitle>
                  <CardDescription>
                    Lista de usuários com privilégios de administrador.
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="flex items-center">
                            <Shield className="mr-2 h-4 w-4 text-blue-500" />
                            {admin.email}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
