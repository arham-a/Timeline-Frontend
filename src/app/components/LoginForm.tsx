"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import LoadingSpinner from './LoadingSpinner';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      await signIn(form.email, form.password);
      setMessage("Login successful!");
       // redirect to dashboard
       router.push('/');
    } catch (error: any) {
      setMessage(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-2">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-[var(--color-text-tertiary)] text-sm">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <div className="text-sm text-center text-[var(--color-error)]">{message}</div>}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <EnvelopeIcon className="h-5 w-5 text-[var(--color-primary)]" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="m@example.com"
              className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
            <a href="#" className="text-sm text-[var(--color-primary)] hover:underline">Forgot password?</a>
          </div>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <LockClosedIcon className="h-5 w-5 text-[var(--color-primary)]" />
            </span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input id="remember" type="checkbox" className="h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded" />
          <label htmlFor="remember" className="text-sm text-[var(--color-primary)]">Remember me</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-md font-semibold hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm text-[var(--color-text-tertiary)]">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={onSwitchToSignup}
            className="text-[var(--color-primary)] hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}