
import { supabase } from '@/integrations/supabase/client';

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data ? true : false;
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
