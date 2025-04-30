
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Define simple interfaces to avoid deep type inference
interface BasicUser {
  id: string;
  email?: string;
}

interface BasicSession {
  user: BasicUser;
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
    
    // Find the user directly by email in user_profiles
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', adminEmail)
      .maybeSingle();
    
    // If not found by email, try with username (which might be derived from email)
    if (!userData && !userError) {
      const username = adminEmail.split('@')[0];
      console.log(`User not found by email, trying username: ${username}`);
      
      // Get user by username
      const { data: userByUsername, error: usernameError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();
        
      if (usernameError) {
        console.error('Error finding user by username:', usernameError);
        return;
      }
      
      if (userByUsername) {
        console.log(`Found user by username: ${username} with ID: ${userByUsername.id}`);
        await ensureAdminAccess(userByUsername.id, adminEmail);
      } else {
        console.error(`User not found with email ${adminEmail} or username ${username}`);
        
        // As a final fallback, try to get the user ID from auth.session
        // Use any to bypass TypeScript's deep type inference
        const { data } = await supabase.auth.getSession();
        
        // Use explicit type casting to avoid deep type inference
        const sessionUser = data.session ? (data.session.user as any) : null;
        
        if (sessionUser && sessionUser.id && sessionUser.email === adminEmail) {
          console.log(`Found user from current session with ID: ${sessionUser.id}`);
          await ensureAdminAccess(sessionUser.id, adminEmail);
        } else {
          toast.error('Admin setup failed', {
            description: `Não foi possível encontrar o usuário ${adminEmail}`
          });
        }
      }
    } else if (userData) {
      console.log(`Found user by email with ID: ${userData.id}`);
      await ensureAdminAccess(userData.id, adminEmail);
    } else if (userError) {
      console.error('Error finding user by email:', userError);
    }
    
  } catch (error: any) {
    console.error(`Failed to grant admin access to ${adminEmail}:`, error.message || error);
  }
};

// Helper function to ensure a user has admin access
async function ensureAdminAccess(userId: string, email: string) {
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
    console.log(`Adding ${email} as admin with ID ${userId}...`);
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert([{ user_id: userId }]);
      
    if (insertError) {
      console.error('Error adding admin user:', insertError);
      return;
    }
    
    console.log(`Successfully added ${email} as admin`);
    toast.success('Admin access granted', {
      description: `Admin access granted to ${email}`
    });
  } else {
    console.log(`${email} is already an admin`);
  }
}
