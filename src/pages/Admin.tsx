
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
import { Loader2, UserPlus } from 'lucide-react';

export default function Admin() {
  const { user, isAdmin, checkAdminStatus } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { setAdminStatus } = useAuth();
  
  // Effect to check admin status on mount
  useEffect(() => {
    const verifyAdminStatus = async () => {
      // Force a recheck of admin status
      if (user) {
        const adminStatus = await checkAdminStatus();
        console.log('Admin status check result:', adminStatus);
        
        // If not an admin, try to make the current user an admin if it matches our target email
        if (!adminStatus && user.email === 'nandomartin21@msn.com') {
          console.log('Attempting to grant admin access to:', user.email);
          try {
            // Add current user as admin
            const { error } = await supabase
              .from('admin_users')
              .insert([{ user_id: user.id }]);
            
            if (error) {
              console.error('Error adding admin:', error);
            } else {
              console.log('Successfully added admin, rechecking status');
              // Recheck admin status after adding
              await checkAdminStatus();
              toast.success('Permissão concedida', {
                description: 'Você agora tem acesso de administrador.'
              });
            }
          } catch (error) {
            console.error('Error in admin setup:', error);
          }
        }
      }
      setInitializing(false);
    };

    verifyAdminStatus();
  }, [user, checkAdminStatus]);
  
  // If still initializing, show loading indicator
  if (initializing) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Verificando permissões...</p>
      </div>
    );
  }
  
  // Redirect if not admin
  if (!isAdmin) {
    toast.error('Acesso negado', {
      description: 'Você não tem permissão para acessar esta página.'
    });
    navigate('/');
    return null;
  }
  
  const handleAddAdmin = async () => {
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
      
      // Add user as admin
      const success = await setAdminStatus(userData.id, true);
      
      if (success) {
        setEmail('');
        toast.success('Administrador adicionado', {
          description: `${userData.email} agora é um administrador.`
        });
      }
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
      <h1 className="text-3xl font-bold mb-8">Administração</h1>
      
      <div className="grid gap-6">
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
      </div>
    </div>
  );
}
