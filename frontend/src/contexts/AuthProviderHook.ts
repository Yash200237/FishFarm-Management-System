import { createContext, useContext } from 'react';
import type { LoginUserForm, User,LoginResponse, UserRoles} from '../types/user';

interface AuthContextType {
  token: string | null;
  userRole: UserRoles | null;
  currentUser:User | null;
  authLoading: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  handleLogin: (user:LoginUserForm) => Promise<LoginResponse>;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};