
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AuthContextType } from './auth-types';
import { checkAdminStatus } from './admin-utils';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthProvider initialized');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change event:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check admin status when user changes
        if (currentSession?.user) {
          const adminStatus = await checkAdminStatus(currentSession.user.id);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession ? 'Session found' : 'No session');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check admin status for initial session
      if (currentSession?.user) {
        const adminStatus = await checkAdminStatus(currentSession.user.id);
        setIsAdmin(adminStatus);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: "Erro ao fazer login",
          description: error.message === 'Invalid login credentials'
            ? "Email ou senha incorretos."
            : "Erro ao tentar fazer login. Tente novamente.",
          variant: "destructive",
        });
        return { user: null, session: null, error: error.message };
      }

      console.log('Login successful:', data.user?.email);
      
      // Check and set admin status
      if (data.user) {
        const adminStatus = await checkAdminStatus(data.user.id);
        setIsAdmin(adminStatus);
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });

      // Redirect to home after successful login
      navigate('/');
      
      return { user: data.user, session: data.session };
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { user: null, session: null, error: error?.message };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting signup for:', email);
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
        toast({
          title: "Erro ao criar conta",
          description: "Não foi possível criar sua conta. Tente novamente.",
          variant: "destructive",
        });
        return { user: null, session: null, error: error.message };
      }

      console.log('Signup successful:', data.user?.email);
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para confirmar sua conta.",
      });

      return { user: data.user, session: data.session };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return { user: null, session: null, error: error?.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setIsAdmin(false);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Signout error:', error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading, isAdmin }}>
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
