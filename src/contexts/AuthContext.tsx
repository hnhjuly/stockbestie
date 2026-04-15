import { createContext, useContext, ReactNode } from 'react';

type AuthContextType = {
  user: null;
  session: null;
  isLoading: false;
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
  return (
    <AuthContext.Provider value={{ user: null, session: null, isLoading: false, signOut: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};
