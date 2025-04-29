
import { addAdminUser } from '@/contexts/admin-utils';
import { toast } from '@/components/ui/sonner';

export const setupAdminUser = async () => {
  try {
    // Add the specified user as admin
    const email = 'nandomartin21@msn.com';
    console.log(`Attempting to grant admin access to ${email}...`);
    
    const result = await addAdminUser(email);
    
    if (result.success) {
      console.log(`User ${email} has been granted admin access.`);
      toast.success('Admin configurado', {
        description: `${email} possui acesso administrativo`
      });
    } else {
      console.error(`Failed to grant admin access to ${email}:`, result.error);
      toast.error('Erro ao configurar admin', {
        description: result.error || 'Não foi possível conceder acesso de administrador'
      });
    }
  } catch (error) {
    console.error("Error setting up admin user:", error);
    toast.error('Erro ao configurar admin', {
      description: 'Ocorreu um erro inesperado ao configurar o usuário administrador'
    });
  }
};
