"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserCircleIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    fname:"",
    lname:""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    try {
      await signUp(form.fname, form.lname, form.email, form.password, form.username);
      toast.success('Registration successful! Please check your email for verification.');
      onSwitchToLogin();
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle different error types
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full pl-10 pr-10 py-2.5 bg-black/50 border border-purple-500/20 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all";
  const iconStyle = "w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400";

  return (
    <div className="max-w-md mx-auto space-y-6 w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
        <p className="text-gray-400 text-sm">
          Enter your information to create an account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <UserCircleIcon className={iconStyle} />
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              className={inputStyle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <UserCircleIcon className={iconStyle} />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              className={inputStyle}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="relative">
          <EnvelopeIcon className={iconStyle} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={inputStyle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <UserCircleIcon className={iconStyle} />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={inputStyle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <LockClosedIcon className={iconStyle} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className={inputStyle}
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

        <div className="relative">
          <LockClosedIcon className={iconStyle} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            className={inputStyle}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Creating account...</span>
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="text-center text-sm text-gray-400 pt-2">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}