'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../lib/authService';
import api from '../lib/axios';

interface User {
  id: string;
  fname: string;
  lname: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fame: string, lname:string, email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          // The axios interceptor will handle setting the Authorization header
          const response = await api.get('/auth/me');
          if (response.data) {
            setUser(response.data);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await authService.login(email, password);
      setUser({
        id: response.data.user.id,
        fname: response.data.user.fname,
        lname: response.data.user.lname,
        username: response.data.user.username,
      });
      router.push('/');
    } catch (error) {
      throw error;
    }
  }

  async function signUp(fname: string, lname:string, email: string, password: string, username: string) {
    try {
      await authService.register(fname, lname, email, password, username);
      router.push('/auth');
    } catch (error) {
      throw error;
    }
  }

  function signOut() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 