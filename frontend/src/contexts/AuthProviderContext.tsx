import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LoginUserForm, User,LoginResponse, UserRoles} from '../types/user';
import {  useMutation, useQuery, useQueryClient } from 'react-query';
import { GetCurrentUser, loginUser, logoutUser, refreshToken } from '../apis/authApis';
import {AuthContext} from './AuthProviderHook';
import { tokenStore } from '../utils/tokenStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRoles | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const {mutateAsync:loginMutateAsync, isLoading,isError,error} = useMutation<LoginResponse, Error, LoginUserForm>(loginUser, {
      onSuccess: (data:LoginResponse) => {
        console.log("Login successful, received data:", data);
        setToken(data.token);
        tokenStore.set(data.token);
        setCurrentUser({userId: data.userId, name: data.name, email: data.email, userName: data.userName, orgId: data.orgId, userRole: data.userRole});
        setUserRole(data.userRole);
    },
  })

  const {mutateAsync:logoutMutateAsync, isLoading:isLogoutLoading,isError:isLogoutError,error:logoutError} = useMutation<boolean, Error>(logoutUser, {
      onSuccess: (data:boolean) => {
        console.log("Logout successful, received data:", data);
        setToken(null);
        tokenStore.set(null);
        setCurrentUser(null);
        setUserRole(null);
    },
  })

   useEffect(() => {
    (async () => {
      try {
      setIsRefreshing(true);
      const res = await refreshToken();
      setToken(res.token);
      tokenStore.set(res.token);
    } catch {
      setToken(null);
      tokenStore.set(null);
      setCurrentUser(null);
      setUserRole(null);
      }
      finally {setIsRefreshing(false);}
    })();
  }, []);

  const meQuery = useQuery<User, Error>(["me"], () => GetCurrentUser(),{
    enabled: !!token,
    refetchOnMount: "always",
    retry: false,
    onSuccess: (user:User) => {
      setCurrentUser(user);
      setUserRole(user.userRole as UserRoles);
    },
    onError: () => {
        handleLogout()
    },
  }
  );

  const authLoading = !!token && meQuery.isLoading

  const handleLogin =useCallback( (user:LoginUserForm) => {
      return loginMutateAsync(user)  
  }, [loginMutateAsync]);
  
  const handleLogout = useCallback(async () => {
    const isLoggedOut = await logoutMutateAsync();
    tokenStore.set(null);
    setCurrentUser(null);
    setUserRole(null);
    queryClient.removeQueries(["me"])
    return isLoggedOut;
  }, [queryClient, logoutMutateAsync]);

  const value = useMemo(() => ({ token, 
                                  userRole, 
                                  currentUser,
                                  authLoading,
                                  isLogoutLoading,
                                  isLoading,
                                  isLogoutError,
                                  isError,
                                  logoutError,
                                  error, 
                                  isRefreshing,
                                  handleLogin,
                                  handleLogout 
                                  })
  , [token, userRole, currentUser,authLoading,isLogoutLoading,isLoading,isLogoutError,isError,error,logoutError, isRefreshing, handleLogin,handleLogout]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
