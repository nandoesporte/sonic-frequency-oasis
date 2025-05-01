
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
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('nandomartin21@msn.com'); // Pre-filled with the requested email
  const [loading, setLoading] = useState(false);
  const { setAdminStatus } = useAuth();
  
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
          description: `${userData.email} foi adicionado como administrador.`
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
  
  // Automatically trigger the add admin function on component mount
  useEffect(() => {
    if (email) {
      handleAddAdmin();
    }
  }, []); // Run only once on component mount
  
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
