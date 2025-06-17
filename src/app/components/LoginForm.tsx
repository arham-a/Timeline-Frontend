"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      await signIn(form.email, form.password);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error in form:', error);
      if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 sm:space-y-6 py-2 sm:py-4 rounded-2xl shadow-xl backdrop-blur-xl p-4 sm:p-8 w-[95%] sm:w-full">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Welcome back</h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium text-blue-200">Email</label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="m@example.com"
              className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-black/60 border border-blue-700 rounded-lg text-white text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-blue-200">Password</label>
            <a href="#" className="text-xs sm:text-sm text-cyan-400 hover:underline">Forgot password?</a>
          </div>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <LockClosedIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            </span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-2.5 bg-black/60 border border-blue-700 rounded-lg text-white text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input 
            id="remember" 
            type="checkbox" 
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 border-blue-700 rounded" 
          />
          <label htmlFor="remember" className="text-xs sm:text-sm text-blue-300">Remember me</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-500 text-white py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:from-cyan-400 hover:via-blue-500 hover:to-purple-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? <LoadingSpinner size="sm" /> : "Login"}
        </button>

        <p className="text-center text-xs sm:text-sm text-gray-400">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={onSwitchToSignup}
            className="text-cyan-400 hover:underline font-semibold"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}