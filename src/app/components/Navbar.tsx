"use client";
import { useState, useEffect } from "react";
import { Clock, Code, Compass } from "lucide-react";
import {
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  GlobeAltIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "./Logo";

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setSidebarOpen(false);
    signOut();
  };

  if (loading) return null;

  return (
    <>
      {/* Desktop Navbar */}
      <header className="fixed top-4 left-4 right-4 border border-black backdrop-blur-xl bg-transparent rounded-2xl z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                    <Clock className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="font-black text-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TIMELINE
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wider">LEARNING PATH</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#"
                className="group flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-all duration-300"
              >
                <Code className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Guide</span>
              </Link>
              <Link
                href="#"
                className="group flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-all duration-300"
              >
                <Compass className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Explore</span>
              </Link>
              <Link href="/auth">
                <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 font-bold px-6 py-2 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
                  Sign in
                </button>
              </Link>
            </nav>
            {/* Hamburger menu for mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-cyan-400 hover:bg-black/20 transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[60] ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar Panel */}
        <div
          className={`absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-none max-w-none mx-0 p-0 bg-black/40 backdrop-blur-xl border-0 z-50 md:top-4 md:left-4 md:right-4 md:max-w-sm md:rounded-2xl md:border md:p-6 md:bg-black/40 md:backdrop-blur-xl md:shadow-lg md:mx-auto md:h-[90vh] md:overflow-y-auto md:z-[60] transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}
        >
          <div className="flex items-center justify-between mb-8 p-6 md:p-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                    <Clock className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              </div>
              <h1 className="font-black text-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                TIMELINE
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded hover:bg-black/20"
            >
              <XMarkIcon className="h-6 w-6 text-cyan-400" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 p-6 md:p-0">
            <Link
              href="#"
              className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            >
              <Code className="w-5 h-5" />
              <span className="font-medium">Guide</span>
            </Link>
            <Link
              href="#"
              className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            >
              <Compass className="w-5 h-5" />
              <span className="font-medium">Explore</span>
            </Link>
            <Link href="/auth" onClick={() => setSidebarOpen(false)}>
              <button className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white border-0 font-bold px-6 py-3 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
                Sign in
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
