import { supabase } from '@/integrations/supabase/client';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Use RPC to call the is_admin function to avoid recursion issues
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data === true;
  } catch (err) {
    console.error('Unexpected error checking admin status:', err);
    return false;
  }
};

export const getSystemStats = async (): Promise<{
  totalUsers: number;
  subscribedUsers: number;
  totalFrequencies: number;
  recentPayments: number;
} | null> => {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
    // Get subscribed users count
    const { count: subscribedUsers, error: subsError } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('subscribed', true);
      
    // Get total frequencies
    const { count: totalFrequencies, error: freqError } = await supabase
      .from('frequencies')
      .select('*', { count: 'exact', head: true });
      
    // Get recent payments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: recentPayments, error: paymentsError } = await supabase
      .from('payment_history')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());
      
    if (usersError || subsError || freqError || paymentsError) {
      console.error('Error fetching system stats');
      return null;
    }
    
    return {
      totalUsers: totalUsers || 0,
      subscribedUsers: subscribedUsers || 0,
      totalFrequencies: totalFrequencies || 0,
      recentPayments: recentPayments || 0
    };
  } catch (error) {
    console.error('Unexpected error getting system stats:', error);
    return null;
  }
};

export const addAdminUser = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // First try to find the user by email in auth.users using the auth API
    const { data: authUserData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100 // Get more users to increase chance of finding the right one
    });
    
    // Define a proper interface for the user object
    interface AuthUser {
      id: string;
      email?: string;
    }
    
    // Only proceed with authUserData if it exists and has a users property that's an array
    if (authError || !authUserData || !Array.isArray(authUserData.users)) {
      console.error('Error finding user by email:', authError || 'Invalid response format');
      
      // Alternative approach: try to find user by email in subscribers table
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select('user_id')
        .eq('email', email)
        .maybeSingle();
      
      if (subscriberError || !subscriberData?.user_id) {
        // As a last resort, check user_profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .ilike('username', `%${email.split('@')[0]}%`)
          .maybeSingle();
          
        if (profileError || !profileData?.id) {
          return { success: false, error: 'User not found' };
        }
        
        // Insert into admin_users using the profile id
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([{ user_id: profileData.id }]);
          
        if (insertError) {
          return { success: false, error: insertError.message };
        }
        
        return { success: true };
      }
      
      // Insert into admin_users using the subscriber user_id
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([{ user_id: subscriberData.user_id }]);
        
      if (insertError) {
        return { success: false, error: insertError.message };
      }
      
      return { success: true };
    }
    
    // Cast users to a properly typed array
    const users = authUserData.users as Array<{id: string; email?: string}>;
    
    // Use a properly typed function to find the matching user
    const matchingUser = users.find(user => {
      return user && 
             typeof user === 'object' && 
             user.email !== undefined && 
             user.email === email;
    });
    
    if (!matchingUser) {
      return { success: false, error: 'User not found in auth database' };
    }
    
    // Found user in auth.users, add to admin_users
    const userId = matchingUser.id;
    
    // Check if user is already an admin to avoid duplicates
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId);
      
    if (existingAdmin && existingAdmin.length > 0) {
      return { success: true, error: 'User is already an admin' };
    }
    
    // Insert into admin_users
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert([{ user_id: userId }]);
      
    if (insertError) {
      return { success: false, error: insertError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding admin user:', error);
    return { success: false, error: 'Unexpected error adding admin user' };
  }
};

export const getRecentPayments = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .select(`
        *,
        user_id (
          email:user_profiles(email)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching recent payments:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error getting recent payments:', error);
    return [];
  }
};

export const getSubscribedUsers = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select(`
        *,
        user_id (id, email),
        plan_id (name, price, interval)
      `)
      .eq('subscribed', true)
      .order('last_payment_date', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching subscribed users:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error getting subscribed users:', error);
    return [];
  }
};
