"use client";
import { useState, useEffect } from "react";
import { UserCircleIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, HomeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from './Logo';

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

  const handleLogin = () => {
    router.push("/auth");
  };

  if (loading) {
    return null;
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[var(--color-border)] backdrop-blur-sm bg-white/80 ${scrolled ? "bg-white/70 backdrop-blur-md shadow" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/explore" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <GlobeAltIcon className="h-5 w-5 mr-1.5" />
                Explore
              </Link>
              {user ? (
                <>
                  <Link href="/user" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <HomeIcon className="h-5 w-5 mr-1.5" />
                    My Timelines
                  </Link>
                  <div className="h-4 w-px bg-[var(--color-border)] mx-2" />
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                      <UserCircleIcon className="h-5 w-5 text-[var(--color-primary)]" />
                      <span className="text-sm font-medium">{user.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1.5" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1.5" />
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    <UserCircleIcon className="h-5 w-5 mr-1.5" />
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-purple-50)] transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col py-6 px-4">
          <div className="flex items-center justify-between mb-8">
            <Logo />
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded hover:bg-[var(--color-bg-purple-50)]">
              <XMarkIcon className="h-6 w-6 text-[var(--color-primary)]" />
            </button>
          </div>
          {user && (
            <div className="mb-6 px-3 py-2 bg-[var(--color-bg-purple-50)] rounded-lg">
              <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                <UserCircleIcon className="h-5 w-5 text-[var(--color-primary)]" />
                <span className="text-sm font-medium">{user.username}</span>
              </div>
            </div>
          )}
          <nav className="flex flex-col space-y-4">
            <Link href="/explore" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <GlobeAltIcon className="h-5 w-5 mr-1.5" />
              Explore
            </Link>
            {user ? (
              <>
                <Link href="/user" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <HomeIcon className="h-5 w-5 mr-1.5" />
                  My Timelines
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center text-left px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] rounded-md text-sm font-medium transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1.5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1.5" />
                  Sign In
                </Link>
                <Link href="/auth" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <UserCircleIcon className="h-5 w-5 mr-1.5" />
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
} 