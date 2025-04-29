
import { supabase } from '@/integrations/supabase/client';
import { addAdminUser } from '@/contexts/admin-utils';
import { toast } from '@/components/ui/sonner';

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
      const result = await addAdminUser(adminEmail);
      
      if (result.success) {
        console.log(`Admin access granted to ${adminEmail}`);
      } else {
        console.error(`Failed to grant admin access to ${adminEmail}: ${result.error}`);
        // Don't show toast error on initial setup to avoid confusing users
      }
    }
  } catch (error: any) {
    console.error(`Failed to grant admin access to ${adminEmail}: ${error.message || error}`);
  }
};
