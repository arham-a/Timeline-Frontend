import api from './axios';
import { parseCookies, destroyCookie } from 'nookies';

interface User {
  id: string;
  fname: string;
  lname: string;
  username: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      console.log("Setting access token in localStorage")
      // Store access token in localStorage
      localStorage.setItem('accessToken', response.data.data.accessToken);
    
      // Update Authorization header for future requests
      api.defaults.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async register(fname: string, lname: string, email: string, password: string, username: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', { fname, lname, email, password, username });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout(): void {
 
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      console.log("Removing access token from localStorage")
      localStorage.removeItem('accessToken');
    }
    
    // Remove cookies
    destroyCookie(undefined, 'timeline.user');
    
    // Remove auth header
    delete api.defaults.headers.Authorization;
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  },
  
  getAuthenticatedUser(): User | null {
    const { 'timeline.user': user } = parseCookies();
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }
}; 