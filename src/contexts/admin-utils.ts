import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    console.log(`Checking admin status for user ${userId}`);
    
    // Use direct query to avoid recursion issues with RLS policies
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    const isAdmin = !!data;
    console.log(`Admin status for ${userId}:`, isAdmin);
    return isAdmin;
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
    console.log('Finding user by email in auth database');
    
    // Try lookup methods in sequence until we find the user
    // This is a simplified version that primarily focuses on the current user flow
    const { data: users, error: lookupError } = await supabase.auth.admin.listUsers();
    
    if (lookupError) {
      console.error('Error looking up users:', lookupError);
      return { success: false, error: 'Erro ao procurar usuários' };
    }

    const foundUser = users?.users?.find(user => user.email === email);
    
    if (!foundUser) {
      return { success: false, error: 'Usuário não encontrado com este email' };
    }
    
    // Insert into admin_users
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert([{ user_id: foundUser.id }]);
      
    if (insertError) {
      console.error('Error adding admin user:', insertError);
      return { success: false, error: insertError.message };
    }
    
    console.log(`Admin access granted to ${email}`);
    return { success: true };
    
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
