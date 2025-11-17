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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setSidebarOpen(false);
    setProfileDropdownOpen(false);
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
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  TIMELINE
                </h1>
                <p className="text-xs text-gray-400 font-medium tracking-wider">LEARNING PATH</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/guide"
                className="group flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-all duration-300"
              >
                <Code className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Guide</span>
              </Link>
              <Link
                href="/explore"
                className="group flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-all duration-300"
              >
                <Compass className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Explore</span>
              </Link>
              {user && (
                <Link
                  href="/user"
                  className="group flex items-center space-x-2 text-gray-400 hover:text-pink-400 transition-all duration-300"
                >
                  <Clock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="font-medium">My Timeline</span>
                </Link>
              )}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{user.username}</span>
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-black/90 backdrop-blur-xl border border-purple-500/20 shadow-lg py-2">
                      <div className="px-4 py-2 border-b border-purple-500/20">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-white font-medium">{user.username}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors flex items-center space-x-2"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white border-0 font-semibold px-6 py-2 rounded-lg transition-all duration-300">
                    Sign in
                  </button>
                </Link>
              )}
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
      <div className={`fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar Panel */}
        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-none max-w-none mx-0 p-0 bg-black/40 backdrop-blur-xl border-0 z-50 md:top-4 md:left-4 md:right-4 md:max-w-sm md:rounded-2xl md:border md:p-6 md:bg-black/40 md:backdrop-blur-xl md:shadow-lg md:mx-auto md:h-[90vh] md:overflow-y-auto md:z-[60]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8 p-6 md:p-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-black text-xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  TIMELINE
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded hover:bg-purple-500/10"
              >
                <XMarkIcon className="h-6 w-6 text-purple-400" />
              </button>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex flex-col items-center space-y-6 px-6">
                <Link
                  href="/guide"
                  className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-all duration-300"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Code className="w-5 h-5" />
                  <span className="font-medium">Guide</span>
                </Link>
                <Link
                  href="/explore"
                  className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-all duration-300"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Compass className="w-5 h-5" />
                  <span className="font-medium">Explore</span>
                </Link>
                {user && (
                  <Link
                    href="/user"
                    className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition-all duration-300"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">My Timeline</span>
                  </Link>
                )}
              </nav>

              {user ? (
                <div className="mt-auto px-6 py-8">
                  <div className="flex items-center justify-center space-x-2 text-gray-300 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="mt-auto px-6 py-8">
                  <Link href="/auth" onClick={() => setSidebarOpen(false)} className="w-full">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                      Sign in
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
