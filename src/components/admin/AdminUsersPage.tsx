
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, ShieldX } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

interface AdminUser {
  user_id: string;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users from the users_view
      const { data: viewUsers, error: viewError } = await supabase
        .from('users_view')
        .select('*');

      if (viewError) throw viewError;

      // Fetch admin users to determine who is an admin
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id');

      if (adminError) throw adminError;

      // Create a set of admin user IDs for quick lookup
      const adminUserIds = new Set((adminUsers as AdminUser[]).map(admin => admin.user_id));

      // Combine the data
      const usersWithAdminStatus = viewUsers.map(user => ({
        ...user,
        is_admin: adminUserIds.has(user.id)
      })) as UserData[];

      setUsers(usersWithAdminStatus);
      console.log('Users fetched:', usersWithAdminStatus.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        // Prevent removing admin privileges from yourself
        if (userId === currentUser?.id) {
          toast.error('Você não pode remover seus próprios privilégios de administrador');
          return;
        }
        
        // Remove admin privileges
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
        toast.success('Privilégios de administrador removidos');
      } else {
        // Grant admin privileges
        const { error } = await supabase
          .from('admin_users')
          .insert({ user_id: userId });

        if (error) throw error;
        toast.success('Privilégios de administrador concedidos');
      }

      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast.error('Erro ao alterar privilégios de administrador');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Usuários</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchUsers}
              disabled={loading}
            >
              Atualizar lista
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Último login</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                      <TableCell>
                        {user.is_admin ? (
                          <ShieldCheck className="h-5 w-5 text-green-500" />
                        ) : (
                          <ShieldX className="h-5 w-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                          disabled={user.id === currentUser?.id}
                          title={user.id === currentUser?.id ? "Você não pode alterar seu próprio status" : ""}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          {user.is_admin ? 'Remover Admin' : 'Tornar Admin'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
