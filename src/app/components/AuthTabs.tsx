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
      <div className="flex w-full mb-8 rounded-xl overflow-hidden shadow-lg bg-black/60 backdrop-blur-xl border border-blue-600">
        <button
          className={`w-1/2 py-3 text-lg font-bold transition-all duration-300 focus:outline-none ${
            activeTab === "login"
              ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-500 text-white shadow-lg scale-105"
              : "bg-transparent text-blue-200 hover:bg-blue-900/30"
          }`}
          onClick={switchToLogin}
        >
          Login
        </button>
        <button
          className={`w-1/2 py-3 text-lg font-bold transition-all duration-300 focus:outline-none ${
            activeTab === "signup"
              ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg scale-105"
              : "bg-transparent text-purple-200 hover:bg-purple-900/30"
          }`}
          onClick={switchToSignup}
        >
          Sign Up
        </button>
      </div>
      <div className="w-full max-w-xl mx-auto p-6 rounded-2xl bg-black/70 border border-blue-600 shadow-xl backdrop-blur-xl">
        {activeTab === "login" ? <LoginForm onSwitchToSignup={switchToSignup} /> : <RegisterForm onSwitchToLogin={switchToLogin} />}
      </div>
    </div>
  );
}










