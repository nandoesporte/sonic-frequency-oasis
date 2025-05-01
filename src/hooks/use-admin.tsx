
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export function useAdmin() {
  const [isChecking, setIsChecking] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { user } = useAuth();
  
  const checkAdminStatus = useCallback(async (userId: string | undefined): Promise<boolean> => {
    if (!userId) {
      setIsAdmin(false);
      return false;
    }
    
    try {
      setIsChecking(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }
      
      setIsAdmin(!!data);
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);
  
  // Check admin status whenever user changes
  useEffect(() => {
    if (user) {
      checkAdminStatus(user.id);
    } else {
      setIsAdmin(false);
    }
  }, [user, checkAdminStatus]);
  
  return {
    checkAdminStatus,
    isAdmin,
    isChecking
  };
}
