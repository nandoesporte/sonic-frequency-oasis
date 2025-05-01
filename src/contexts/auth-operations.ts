
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export async function checkAdminStatus(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
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
  }
}

export async function signInWithEmail(email: string, password: string): Promise<{
  user: User | null;
  session: Session | null;
  error?: string;
}> {
  try {
    console.log('Attempting login with email:', email);
    
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
    
    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error('Unexpected login error:', error);
    toast.error('Erro ao fazer login', {
      description: 'Ocorreu um erro inesperado. Tente novamente.'
    });
    return { user: null, session: null, error: error?.message };
  }
}

export async function signUpWithEmail(email: string, password: string, fullName: string): Promise<{
  user: User | null;
  session: Session | null;
  error?: string;
}> {
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
  }
}

export async function signOutUser(): Promise<void> {
  try {
    console.log('Signing out user');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Signout error:', error);
      toast.error('Erro ao sair', {
        description: 'Não foi possível fazer logout. Tente novamente.'
      });
      throw error;
    }
    
    console.log('User signed out successfully');
    
    toast.success('Logout realizado', {
      description: 'Você foi desconectado com sucesso.'
    });
  } catch (error) {
    console.error('Signout error:', error);
    toast.error('Erro ao sair', {
      description: 'Não foi possível fazer logout. Tente novamente.'
    });
  }
}
