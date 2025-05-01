
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    console.log(`Checking admin status for user ${userId}`);
    
    // Use RPC to call the is_admin function to avoid recursion issues
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    console.log(`Admin status result for ${userId}:`, data);
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
    console.log(`Attempting to add admin user for email: ${email}`);
    
    // First try to get the current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;
    
    // If the current user matches the admin email, use their ID directly
    if (currentUser && currentUser.email === email) {
      console.log(`Current user (${currentUser.email}) matches admin email, using ID directly`);
      
      // Check if user is already an admin to avoid duplicates
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', currentUser.id);
        
      if (existingAdmin && existingAdmin.length > 0) {
        console.log('User is already an admin');
        return { success: true };
      }
      
      // Insert into admin_users using the current user's ID
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([{ user_id: currentUser.id }]);
        
      if (insertError) {
        console.error('Error adding admin user:', insertError);
        return { success: false, error: insertError.message };
      }
      
      console.log(`Admin access granted to ${email} with ID ${currentUser.id}`);
      return { success: true };
    }
    
    // If we're not using the current user's ID, try to find the user by email
    console.log('Trying to find user by email in auth database');
    
    // First try to find the user by email in subscribers table
    const { data: subscriberData, error: subscriberError } = await supabase
      .from('subscribers')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();
    
    if (!subscriberError && subscriberData?.user_id) {
      console.log(`Found user in subscribers table with ID: ${subscriberData.user_id}`);
      
      // Check if user is already an admin
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', subscriberData.user_id);
        
      if (existingAdmin && existingAdmin.length > 0) {
        console.log('User is already an admin');
        return { success: true };
      }
      
      // Insert into admin_users
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([{ user_id: subscriberData.user_id }]);
        
      if (insertError) {
        console.error('Error adding admin user:', insertError);
        return { success: false, error: insertError.message };
      }
      
      console.log(`Admin access granted to ${email}`);
      return { success: true };
    }
    
    // Try to find user by email in user_profiles table
    console.log('Trying to find user in user_profiles table');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .ilike('username', `%${email.split('@')[0]}%`)
      .maybeSingle();
      
    if (!profileError && profileData?.id) {
      console.log(`Found user in user_profiles with ID: ${profileData.id}`);
      
      // Check if user is already an admin
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', profileData.id);
        
      if (existingAdmin && existingAdmin.length > 0) {
        console.log('User is already an admin');
        return { success: true };
      }
      
      // Insert into admin_users
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([{ user_id: profileData.id }]);
        
      if (insertError) {
        console.error('Error adding admin user:', insertError);
        return { success: false, error: insertError.message };
      }
      
      console.log(`Admin access granted to ${email}`);
      return { success: true };
    }

    // As a last resort, try to find user through auth API
    console.log('No user found in application tables, trying auth API');
    try {
      // Use admin.listUsers and filter manually
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError || !authData?.users) {
        console.error('Error finding user with auth API:', authError);
        return { success: false, error: 'User not found in auth database' };
      }
      
      // Find the user with matching email - Fix the typing issue here
      const foundUser = authData.users.find((user: User) => user.email === email);
      
      if (!foundUser) {
        console.error('User not found with email:', email);
        return { success: false, error: 'User not found with this email' };
      }
      
      const userId = foundUser.id;
      console.log(`Found user with auth API, ID: ${userId}`);
      
      // Check if user is already an admin
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId);
        
      if (existingAdmin && existingAdmin.length > 0) {
        console.log('User is already an admin');
        return { success: true };
      }
      
      // Insert into admin_users
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([{ user_id: userId }]);
        
      if (insertError) {
        console.error('Error adding admin user:', insertError);
        return { success: false, error: insertError.message };
      }
      
      console.log(`Admin access granted to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error with auth API:', error);
    }
    
    // If we get here, we couldn't find or add the admin user
    console.error('Failed to find or add admin user');
    return { success: false, error: 'Could not find or add user as admin' };
  } catch (error: any) {
    console.error('Error adding admin user:', error);
    return { success: false, error: 'Unexpected error adding admin user: ' + error.message };
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
