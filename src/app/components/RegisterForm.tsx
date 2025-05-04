import { useState } from "react";
import { registerUser, sendVerificationEmail } from "../lib/api";
import { RegisterRequest } from "../types/auth";
import { UserIcon } from "@heroicons/react/24/outline";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UsersIcon,
} from "@heroicons/react/16/solid";
import { UserCircleIcon } from "@heroicons/react/20/solid";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterRequest>({
    fname: "",
    lname: "",
    email: "",
    username: "",
    password: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setMessage("You must agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);
    setMessage(null);
    const res = await registerUser(form);
    if (res.success && res.data?.userId) {
      const emailRes = await sendVerificationEmail(res.data.userId);
      setMessage(
        emailRes.success ? "Verification email sent!" : emailRes.message
      );
    } else {
      setMessage(res.error?.message || res.message);
    }
    setLoading(false);
  };

  const inputStyle =
    "w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
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
            type="password"
            name="password"
            placeholder="Password"
            className={inputStyle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
            id="terms"
          />
          <label htmlFor="terms" className="text-sm text-[var(--color-text-secondary)]">
            I agree to the{" "}
            <a href="/terms" className="text-[var(--color-primary)] hover:underline">
              Terms and Conditions
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-2 rounded-lg transition-colors"
        >
          {loading ? "Registering..." : "Create Account"}
        </button>

        <p className="text-sm text-center mt-2 text-[var(--color-text-tertiary)]">
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