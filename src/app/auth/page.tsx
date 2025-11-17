"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthTabs from "../components/AuthTabs";
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Spotlight } from '../components/ui/spotlight-new';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/[0.96]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Navbar />
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 100%, 85%, .08) 0, hsla(270, 100%, 55%, .02) 50%, hsla(270, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .06) 0, hsla(270, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .04) 0, hsla(270, 100%, 45%, .02) 80%, transparent 100%)"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-screen py-16">
          <div className="w-full max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <AuthTabs />
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 