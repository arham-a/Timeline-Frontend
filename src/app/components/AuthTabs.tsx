"use client";

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const switchToSignup = () => setActiveTab("signup");
  const switchToLogin = () => setActiveTab("login");


  return (
    <div className="w-full max-w-xl mx-auto p-4 ">
      <div className="grid w-full grid-cols-2 mb-8">
        <button
          className={`w-full p-2 rounded-l-lg text-lg font-medium transition-colors ${
            activeTab === "login" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-purple-50)] text-[var(--color-text-secondary)]"
          }`}
          onClick={switchToLogin}
        >
          Login
        </button>
        <button
          className={`w-full p-2 rounded-r-lg text-lg transition-colors font-medium ${
            activeTab === "signup" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-purple-50)] text-[var(--color-text-secondary)]"
          }`}
          onClick={switchToSignup}
        >
          Sign Up
        </button>
      </div>

      <div className="w-full max-w-xl mx-auto p-4 shadow-[var(--color-shadow)] rounded-xl bg-[var(--color-bg-white)]">
      {activeTab === "login" ? <LoginForm onSwitchToSignup={switchToSignup} /> : <RegisterForm onSwitchToLogin={switchToLogin} />}
      </div>
    </div>
  );
}










