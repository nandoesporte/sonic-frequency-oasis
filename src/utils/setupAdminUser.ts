
import { supabase } from '@/integrations/supabase/client';
import { addAdminUser } from '@/contexts/admin-utils';
import { toast } from '@/components/ui/sonner';

interface BasicAuthUser {
  id: string;
  email?: string;
}

export const setupAdminUser = async () => {
  // Define the admin email
  const adminEmail = 'nandomartin21@msn.com';
  
  try {
    console.log(`Attempting to grant admin access to ${adminEmail}...`);
    
    // First check if there are any existing admins
    const { count, error: countError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error checking admin users:', countError);
      return;
    }
    
    // Only try to add the default admin if there are no admins yet
    if (count === 0) {
      // Get current session to check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;
      
      if (currentUser && currentUser.email === adminEmail) {
        console.log('Current user matches admin email, granting admin access directly');
        
        // Grant admin access to the current user
        const result = await addAdminUser(adminEmail);
        if (result.success) {
          console.log(`Admin access granted to current user (${adminEmail})`);
          toast.success('Acesso de administrador concedido', {
            description: 'Você agora tem acesso ao painel administrativo'
          });
        } else {
          console.error(`Failed to grant admin access to current user: ${result.error}`);
        }
      } else {
        const result = await addAdminUser(adminEmail);
        
        if (result.success) {
          console.log(`Admin access granted to ${adminEmail}`);
        } else {
          console.error(`Failed to grant admin access to ${adminEmail}: ${result.error}`);
        }
      }
    } else {
      console.log(`Admin users already exist (count: ${count}), skipping setup`);
    }
  } catch (error: any) {
    console.error(`Failed to grant admin access to ${adminEmail}: ${error.message || error}`);
  }
};
