import { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Auth disabled — will be replaced with Clerk
  return (
    <AuthContext.Provider value={{ user: null, session: null, isLoading: false, signOut: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};
