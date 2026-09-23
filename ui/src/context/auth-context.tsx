import React, { createContext } from 'react';
import { useAuthenticationStore } from '@/stores/auth';
import { AuthenticationType } from '@/types';
export const AuthContext = createContext<Partial<AuthenticationType>>({});
interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authStore = useAuthenticationStore();
  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
};
