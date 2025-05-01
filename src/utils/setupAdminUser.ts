
import { supabase } from '@/integrations/supabase/client';
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
    
    // Get the user ID for the admin email
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', adminEmail.split('@')[0])
      .maybeSingle();
      
    if (userError || !userData) {
      console.error('Error finding user:', userError || 'User not found');
      return;
    }
    
    const userId = userData.id;
    console.log(`Found user ID for ${adminEmail}:`, userId);
    
    // Check if this user is already an admin
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (adminCheckError) {
      console.error('Error checking if user is already admin:', adminCheckError);
      return;
    }
    
    // If user is not an admin, add them
    if (!existingAdmin) {
      console.log(`Adding ${adminEmail} as admin...`);
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([{ user_id: userId }]);
        
      if (insertError) {
        console.error('Error adding admin user:', insertError);
        return;
      }
      
      console.log(`Successfully added ${adminEmail} as admin`);
      toast.success('Admin access granted', {
        description: `Admin access granted to ${adminEmail}`
      });
    } else {
      console.log(`${adminEmail} is already an admin`);
    }
    
  } catch (error: any) {
    console.error(`Failed to grant admin access to ${adminEmail}:`, error.message || error);
  }
};
