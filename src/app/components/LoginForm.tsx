"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="max-w-md mx-auto space-y-6 w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <EnvelopeIcon className="h-5 w-5 text-purple-400" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="m@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-purple-500/20 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <LockClosedIcon className="h-5 w-5 text-purple-400" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-black/50 border border-purple-500/20 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input 
            id="remember" 
            type="checkbox" 
            className="h-4 w-4 text-purple-500 border-purple-500/20 rounded bg-black/50 focus:ring-purple-500" 
          />
          <label htmlFor="remember" className="text-sm text-gray-400">Remember me</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner size="sm" /> : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400 pt-2">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={onSwitchToSignup}
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}