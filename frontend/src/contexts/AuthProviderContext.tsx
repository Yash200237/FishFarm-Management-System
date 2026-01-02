import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LoginUserForm, User,LoginResponse, UserRoles} from '../types/user';
import { useMutation } from 'react-query';
import { loginUser } from '../apis/userApis';

interface AuthContextType {
  token: string | null;
  userRole: UserRoles | null;
  currentUser:User | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  handleLogin: (user:LoginUserForm) => Promise<LoginResponse>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRoles | null>(
    (localStorage.getItem('role') as UserRoles) || null
  );

  const {mutateAsync, isLoading,isError,error} = useMutation<LoginResponse, Error, LoginUserForm>(loginUser, {
      onSuccess: (data:LoginResponse) => {
        setToken(data.token)
        setCurrentUser({userId: data.userId, name: data.name, email: data.email, userName: data.userName, orgId: data.orgId, userRole: data.userRole});
        setUserRole(data.userRole);
    },
  })

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    if (userRole) localStorage.setItem("role", userRole);
    else localStorage.removeItem("role");
}, [token, userRole]);

  const handleLogin =useCallback( (user:LoginUserForm) => {
      return mutateAsync(user)  
  }, [mutateAsync]);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setCurrentUser(null);
    setUserRole(null);
  }, []);

  const value = useMemo(() => ({ token, userRole, currentUser,isLoading,isError,error, handleLogin,handleLogout }), [token, userRole, currentUser,isLoading,isError,error, handleLogin,handleLogout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
