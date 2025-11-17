"use client";

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const switchToSignup = () => setActiveTab("signup");
  const switchToLogin = () => setActiveTab("login");

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex w-full mb-6 rounded-xl overflow-hidden bg-black/50 backdrop-blur-xl border border-purple-500/20">
        <button
          className={`w-1/2 py-3.5 text-base font-semibold transition-all duration-300 focus:outline-none ${
            activeTab === "login"
              ? "bg-purple-600 text-white"
              : "bg-transparent text-gray-400 hover:text-gray-200"
          }`}
          onClick={switchToLogin}
        >
          Login
        </button>
        <button
          className={`w-1/2 py-3.5 text-base font-semibold transition-all duration-300 focus:outline-none ${
            activeTab === "signup"
              ? "bg-purple-600 text-white"
              : "bg-transparent text-gray-400 hover:text-gray-200"
          }`}
          onClick={switchToSignup}
        >
          Sign Up
        </button>
      </div>
      <div className="w-full max-w-xl mx-auto p-8 rounded-2xl bg-black/50 border border-purple-500/20 backdrop-blur-xl">
        {activeTab === "login" ? <LoginForm onSwitchToSignup={switchToSignup} /> : <RegisterForm onSwitchToLogin={switchToLogin} />}
      </div>
    </div>
  );
}










