
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, User, Shield, Webhook, Settings } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { setAdminStatus } = useAuth();
  const [adminUsers, setAdminUsers] = useState<{id: string, email: string}[]>([]);
  
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
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administração</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Voltar ao Início
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
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
                <Button onClick={() => navigate('/webhook-config')}>
                  <Webhook className="mr-2 h-4 w-4" />
                  Configurar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Administrador</CardTitle>
            <CardDescription>
              Adicione outro usuário como administrador do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
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
              <Button onClick={handleAddAdmin} disabled={loading}>
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
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Administradores Atuais</CardTitle>
              <CardDescription>
                Lista de usuários com privilégios de administrador.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
    </div>
  );
}
