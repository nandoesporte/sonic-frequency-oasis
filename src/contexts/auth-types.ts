
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}
