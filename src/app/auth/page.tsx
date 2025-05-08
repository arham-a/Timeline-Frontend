"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthTabs from "../components/AuthTabs";
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-purple-light)] p-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-[6rem] min-h-screen flex items-center justify-center bg-[var(--color-bg-purple-light)] p-4">
        <AuthTabs />
      </div>
      <Footer />
    </>
  );
} 