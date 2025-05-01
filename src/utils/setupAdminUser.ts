
import { supabase } from '@/integrations/supabase/client';
import { addAdminUser } from '@/contexts/admin-utils';
import { toast } from '@/components/ui/sonner';

export const setupAdminUser = async () => {
  // Define the admin email
  const adminEmail = 'nandomartin21@msn.com';
  
  try {
    console.log(`Attempting to grant admin access to ${adminEmail}...`);
    
    // Get current session to check if user is logged in
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError.message);
      return false;
    }
    
    const currentUser = sessionData?.session?.user;
    
    if (!currentUser) {
      console.log('No user is currently logged in');
      return false;
    }
    
    console.log('Current user:', currentUser.email);
    
    // Always check if current user is the admin email
    if (currentUser.email === adminEmail) {
      console.log('Current user matches admin email, granting admin access directly');
      
      try {
        // Grant admin access to the current user
        const result = await addAdminUser(adminEmail);
        if (result.success) {
          console.log(`Admin access granted to current user (${adminEmail})`);
          toast.success('Acesso de administrador verificado', {
            description: 'Você tem acesso ao painel administrativo'
          });
          return true;
        } else {
          console.error(`Failed to grant admin access to current user: ${result.error}`);
          toast.error('Erro ao verificar acesso de administrador', {
            description: result.error || 'Tente fazer login novamente'
          });
          return false;
        }
      } catch (innerError: any) {
        console.error('Error during addAdminUser:', innerError);
        toast.error('Erro ao verificar acesso de administrador', {
          description: innerError?.message || 'Ocorreu um erro interno'
        });
        return false;
      }
    } else {
      console.log(`Current user (${currentUser.email}) does not match admin email (${adminEmail})`);
      return false;
    }
  } catch (error: any) {
    console.error(`Failed to grant admin access to ${adminEmail}:`, error);
    toast.error('Erro ao verificar acesso de administrador', {
      description: error?.message || 'Ocorreu um erro interno'
    });
    return false;
  }
};
