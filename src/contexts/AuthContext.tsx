
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthState } from './auth-types';
import { 
  checkAdminStatus, 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser 
} from './auth-operations';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false
  });
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const navigate = useNavigate();

  console.log('AuthProvider initialized');
  
  useEffect(() => {
    let mounted = true;
    console.log('Setting up auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change event:', event);
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            isAdmin: false
          }));
        } else if (currentSession) {
          setAuthState(prev => ({
            ...prev,
            session: currentSession,
            user: currentSession.user ?? null,
          }));
          
          // Check admin status if user is authenticated
          if (currentSession.user) {
            setIsCheckingAdmin(true);
            const adminStatus = await checkAdminStatus(currentSession.user.id);
            if (mounted) {
              setAuthState(prev => ({
                ...prev,
                isAdmin: adminStatus
              }));
              console.log('Admin status set to:', adminStatus);
              setIsCheckingAdmin(false);
            }
          }
        }
        
        // Set loading to false after handling the auth state change
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', currentSession ? 'Session found' : 'No session');
      
      if (currentSession) {
        setAuthState(prev => ({
          ...prev,
          session: currentSession,
          user: currentSession.user
        }));
        
        // Check admin status if user is authenticated
        if (currentSession.user) {
          setIsCheckingAdmin(true);
          const adminStatus = await checkAdminStatus(currentSession.user.id);
          if (mounted) {
            setAuthState(prev => ({
              ...prev,
              isAdmin: adminStatus
            }));
            console.log('Initial admin status set to:', adminStatus);
            setIsCheckingAdmin(false);
          }
        }
      }
      
      // Set loading to false after initial check
      if (mounted) {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Refetch admin status when user changes
  useEffect(() => {
    if (authState.user && !isCheckingAdmin) {
      setIsCheckingAdmin(true);
      checkAdminStatus(authState.user.id).then(status => {
        setAuthState(prev => ({
          ...prev,
          isAdmin: status
        }));
        console.log('Admin status refreshed to:', status);
        setIsCheckingAdmin(false);
      });
    }
  }, [authState.user]);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await signInWithEmail(email, password);
    setAuthState(prev => ({ ...prev, loading: false }));
    return result;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await signUpWithEmail(email, password, fullName);
    setAuthState(prev => ({ ...prev, loading: false }));
    return result;
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    await signOutUser();
    // Clear local state AFTER successful signout
    setAuthState({
      user: null,
      session: null,
      loading: false,
      isAdmin: false
    });
    // Navigate after signout is complete
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ 
      user: authState.user, 
      session: authState.session, 
      signIn, 
      signUp, 
      signOut, 
      loading: authState.loading, 
      isAdmin: authState.isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
