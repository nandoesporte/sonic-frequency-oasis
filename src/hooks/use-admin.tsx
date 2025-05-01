
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdmin() {
  const [isChecking, setIsChecking] = useState(false);
  
  const checkAdminStatus = async (userId: string | undefined): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      setIsChecking(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };
  
  return {
    checkAdminStatus,
    isChecking
  };
}
