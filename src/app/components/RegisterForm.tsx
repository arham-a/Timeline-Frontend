"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserCircleIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/16/solid";
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
    username: "",
    fname:"",
    lname:""
  });

  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(form.fname, form.lname, form.email, form.password, form.username);
      toast.success('Registration successful! Please check your email for verification.');
      onSwitchToLogin();
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full pl-10 pr-4 py-2 bg-black/60 border border-blue-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md";
  const iconStyle = "w-5 h-5 absolute left-3 top-2.5 text-blue-400";

  return (
    <div className="max-w-md mx-auto space-y-6 py-2 rounded-2xl shadow-xl backdrop-blur-xl p-8">
      <h2 className="text-2xl font-bold text-center mb-1 text-white">Create an account</h2>
      <p className="text-center text-gray-400 text-sm mb-4">
        Enter your information to create an account
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <EnvelopeIcon className={iconStyle} />
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
            type="password"
            name="password"
            placeholder="Password"
            className={inputStyle}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white py-2 rounded-xl font-semibold shadow-lg hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
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

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-purple-400 hover:underline font-semibold"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}