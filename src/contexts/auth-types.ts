
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
    error?: string;
  }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    user: User | null;
    session: Session | null;
    error?: string;
  }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
  setAdminStatus: (userId: string, isAdmin: boolean) => Promise<boolean>;
}
