import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

// Create a function that returns the API instance
// This helps with SSR where window/localStorage isn't available initially
const getAPIClient = (ctx = undefined): AxiosInstance => {
  const api = axios.create({
    baseURL: 'https://timeline-app-backend.vercel.app/api/',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage for client-side requests
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Add response interceptor for handling errors
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      // Handle unauthorized errors
      if (error.response && error.response.status === 401) {
        // Handle differently on server vs client
        if (typeof window !== 'undefined') {
          // Clear invalid token
          localStorage.removeItem('accessToken');
          delete api.defaults.headers.Authorization;
        }
      }
      return Promise.reject(error);
    }
  );
  
  return api;
};

// Create a singleton instance for client-side use
let apiInstance: AxiosInstance | null = null;

// Function to get or create the API instance
export const getApiInstance = (ctx = undefined): AxiosInstance => {
  if (typeof window === 'undefined') {
    // Server-side: create a new instance
    return getAPIClient(ctx);
  }
  
  // Client-side: use singleton instance
  if (!apiInstance) {
    apiInstance = getAPIClient(ctx);
  }
  
  return apiInstance;
};

// Export the singleton instance for client-side use
const api = getApiInstance();
export default api;

// Export the factory function for server-side API calls
export { getAPIClient }; 