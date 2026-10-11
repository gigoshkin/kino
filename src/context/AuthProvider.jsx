import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../api/auth';
import { clearToken, getToken, setToken, setUnauthorizedHandler } from '../api/client';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => Boolean(getToken()));
  const [modal, setModal] = useState(null);
  const pendingAction = useRef(null);
  const loggingOut = useRef(false);

  const {
    data: user = null,
    isError: isUserError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        return await getMe();
      } catch (error) {
        if (error.status === 401) setHasToken(false);
        throw error;
      }
    },
    enabled: hasToken,
  });

  const clearSession = useCallback(() => {
    clearToken();
    setHasToken(false);
    queryClient.removeQueries({ queryKey: ['me'] });
    queryClient.removeQueries({ queryKey: ['tickets'] });
    queryClient.invalidateQueries({ queryKey: ['coming-soon'] });
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (loggingOut.current) return;
      clearSession();
      setModal('login');
    });
  }, [clearSession]);

  const openLogin = useCallback(() => {
    setModal('login');
  }, []);

  function openRegister() {
    setModal('register');
  }

  function closeModal() {
    pendingAction.current = null;
    setModal(null);
  }

  function runAfterLogin(action) {
    pendingAction.current = action;
  }

  function requireAuth(action) {
    if (getToken()) {
      action();
      return;
    }

    pendingAction.current = action;
    setModal('login');
  }

  function finishSignIn(result) {
    setToken(result.token);
    setHasToken(true);
    queryClient.setQueryData(['me'], result.user);
    queryClient.invalidateQueries({ queryKey: ['seats'] });
    queryClient.invalidateQueries({ queryKey: ['coming-soon'] });
    setModal(null);

    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }

  async function login(credentials) {
    finishSignIn(await loginRequest(credentials));
  }

  async function register(formData) {
    finishSignIn(await registerRequest(formData));
  }

  async function logout() {
    loggingOut.current = true;

    await logoutRequest().catch(() => {});
    loggingOut.current = false;
    clearSession();
  }

  const value = {
    user,
    isLoggedIn: hasToken,
    isUserError,
    refetchUser,
    modal,
    openLogin,
    openRegister,
    closeModal,
    requireAuth,
    runAfterLogin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
