
import { supabase } from '@/integrations/supabase/client';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Direct query without relying on RLS policies to avoid recursion
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data && data.length > 0;
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
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: {
        email: `eq.${email}`
      }
    });
    
    if (authError || !authUser || authUser.users.length === 0) {
      console.error('Error finding user by email:', authError || 'User not found');
      
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
    
    // Found user in auth.users, add to admin_users
    const userId = authUser.users[0].id;
    
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
