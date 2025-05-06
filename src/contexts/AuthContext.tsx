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
  credits: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fname: string, lname:string, email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
  updateCredits: (newCredits: number) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        const response = await api.get('/auth/me');
        if (response.data && response.data.data) {
          setUser(response.data.data);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      delete api.defaults.headers.Authorization;
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const updateCredits = (newCredits: number) => {
    setUser(prev => prev ? { ...prev, credits: newCredits } : null);
  };

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      localStorage.setItem('accessToken', response.data.accessToken);
      api.defaults.headers.Authorization = `Bearer ${response.data.accessToken}`;
      
      setUser({
        id: response.data.user.id,
        fname: response.data.user.fname,
        lname: response.data.user.lname,
        username: response.data.user.username,
        credits: response.data.user.credits,
      });
      
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signUp(fname: string, lname:string, email: string, password: string, username: string) {
    try {
      setLoading(true);
      await authService.register(fname, lname, email, password, username);
      router.push('/auth');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    setLoading(true);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.Authorization;
    setUser(null);
    setLoading(false);
    router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading, updateCredits }}>
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