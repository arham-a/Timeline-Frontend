"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserCircleIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/16/solid";

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
  const [message, setMessage] = useState<string | null>(null);
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      await signUp(form.fname, form.lname,  form.email, form.password, form.username);
      setMessage("Registration successful! Please check your email for verification.");
    } catch (error: any) {
      setMessage(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
  const iconStyle = "w-5 h-5 absolute left-3 top-2.5 text-[var(--color-primary)]";

  return (
    <div className="max-w-md mx-auto space-y-6 py-2">
      <h2 className="text-2xl font-bold text-center mb-1">Create an account</h2>
      <p className="text-center text-[var(--color-text-tertiary)] text-sm mb-4">
        Enter your information to create an account
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className="text-sm text-center text-[var(--color-error)]">{message}</div>
        )}

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
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-md font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-[var(--color-text-tertiary)]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[var(--color-primary)] hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}