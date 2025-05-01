
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { AuthContextType } from './auth-types';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  console.log('AuthProvider initialized');
  
  // Check if user is an admin
  const checkAdminStatus = async () => {
    try {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      const adminStatus = !!data;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Set admin status for a user
  const setAdminStatus = async (userId: string, makeAdmin: boolean) => {
    try {
      if (!user) return false;
      
      // Check if current user is admin
      const currentUserIsAdmin = await checkAdminStatus();
      if (!currentUserIsAdmin) {
        toast.error('Permissão negada', {
          description: 'Você não tem permissão para gerenciar administradores.'
        });
        return false;
      }
      
      if (makeAdmin) {
        // Add user to admin_users table
        const { error } = await supabase
          .from('admin_users')
          .insert([{ user_id: userId }]);
        
        if (error) {
          console.error('Error setting admin status:', error);
          toast.error('Erro', {
            description: 'Não foi possível adicionar o administrador.'
          });
          return false;
        }
        
        toast.success('Sucesso', {
          description: 'Usuário adicionado como administrador.'
        });
        return true;
      } else {
        // Remove user from admin_users table
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error removing admin status:', error);
          toast.error('Erro', {
            description: 'Não foi possível remover o administrador.'
          });
          return false;
        }
        
        toast.success('Sucesso', {
          description: 'Usuário removido da lista de administradores.'
        });
        return true;
      }
    } catch (error) {
      console.error('Error setting admin status:', error);
      return false;
    }
  };
  
  useEffect(() => {
    let mounted = true;
    console.log('Setting up auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change event:', event);
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        } else if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user ?? null);
          
          // Check admin status after setting user
          if (currentSession.user) {
            setTimeout(() => {
              checkAdminStatus();
            }, 0);
          }
        }
        
        // Set loading to false after handling the auth state change
        if (mounted) setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', currentSession ? 'Session found' : 'No session');
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Check admin status after setting user
        setTimeout(() => {
          checkAdminStatus();
        }, 0);
      }
      
      // Set loading to false after initial check
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      setLoading(true); // Set loading to true while signing in
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error('Erro ao fazer login', {
          description: error.message === 'Invalid login credentials'
            ? 'Email ou senha incorretos.'
            : 'Erro ao tentar fazer login. Tente novamente.'
        });
        return { user: null, session: null, error: error.message };
      }

      console.log('Login successful:', data.user?.email);
      
      toast.success('Login realizado com sucesso', {
        description: 'Bem-vindo de volta!'
      });
      
      // Check admin status after successful login
      if (data.user) {
        setTimeout(() => {
          checkAdminStatus();
        }, 0);
      }
      
      return { user: data.user, session: data.session };
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast.error('Erro ao fazer login', {
        description: 'Ocorreu um erro inesperado. Tente novamente.'
      });
      return { user: null, session: null, error: error?.message };
    } finally {
      setLoading(false); // Set loading back to false when login attempt is complete
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting signup for:', email);
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast.error('Erro ao criar conta', {
          description: 'Não foi possível criar sua conta. Tente novamente.'
        });
        return { user: null, session: null, error: error.message };
      }

      console.log('Signup successful:', data.user?.email);
      toast.success('Conta criada com sucesso', {
        description: 'Verifique seu email para confirmar sua conta.'
      });

      return { user: data.user, session: data.session };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast.error('Erro ao criar conta', {
        description: 'Ocorreu um erro inesperado. Tente novamente.'
      });
      return { user: null, session: null, error: error?.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Signout error:', error);
        toast.error('Erro ao sair', {
          description: 'Não foi possível fazer logout. Tente novamente.'
        });
        throw error;
      }
      
      // Clear local state AFTER successful signout
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      console.log('User signed out successfully');
      
      toast.success('Logout realizado', {
        description: 'Você foi desconectado com sucesso.'
      });
      
      // Navigate after signout is complete
      navigate('/auth');
    } catch (error) {
      console.error('Signout error:', error);
      toast.error('Erro ao sair', {
        description: 'Não foi possível fazer logout. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signIn, 
      signUp, 
      signOut, 
      loading, 
      isAdmin,
      checkAdminStatus,
      setAdminStatus 
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
