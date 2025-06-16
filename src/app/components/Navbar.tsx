"use client";
import { useState, useEffect } from "react";
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
      <nav
        className={`fixed top-4 left-3 right-3 z-50 mx-auto max-w-7xl transition-all duration-300 rounded-2xl border backdrop-blur-sm shadow-md  
        ${
          scrolled
            ? "bg-[var(--color-bg-purple-light)]/80 border-[var(--color-border)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo variant={scrolled ? 'default' : 'light'} />

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/guide"
                className={`inline-flex items-center ${
                  scrolled 
                    ? "text-black hover:text-[var(--color-primary)]"
                    : "text-black hover:text-black/80"
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                <BookOpenIcon className="h-5 w-5 mr-1.5" />
                Guide
              </Link>
              <Link
                href="/explore"
                className={`inline-flex items-center ${
                  scrolled 
                    ? "text-black hover:text-[var(--color-primary)]"
                    : "text-black hover:text-black/80"
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                <GlobeAltIcon className="h-5 w-5 mr-1.5" />
                Explore
              </Link>
              {user ? (
                <>
                  <Link
                    href="/user"
                    className={`inline-flex items-center ${
                      scrolled 
                        ? "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                        : "text-white hover:text-white/80"
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    <HomeIcon className="h-5 w-5 mr-1.5" />
                    My Timelines
                  </Link>
                  <div className="h-4 w-px bg-[var(--color-border)] mx-2" />
                  <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 ${
                      scrolled 
                        ? "text-[var(--color-text-primary)]"
                        : "text-white"
                    }`}>
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
                <Link
                  href="/auth"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5 mr-1.5" />
                  Sign In
                </Link>
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

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[60] ${sidebarOpen ? "" : "pointer-events-none"}`}>

        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={`absolute top-0 left-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-[var(--color-bg-purple-50)]`}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded hover:bg-[var(--color-bg-purple-50)]"
            >
              <XMarkIcon className="h-6 w-6 text-[var(--color-primary)]" />
            </button>
          </div>

          {user && (
            <div className="mb-6 px-2 py-2 bg-[var(--color-bg-purple-light)] rounded-lg mx-4">
              <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                <UserCircleIcon className="h-5 w-5 text-[var(--color-primary)]" />
                <span className="text-sm font-medium">{user.username}</span>
              </div>
            </div>
          )}

          <nav className="flex flex-col space-y-2 px-4">
            <Link
              href="/guide"
              className={`flex items-center gap-2 px-2 py-3 text-sm font-medium ${
                scrolled 
                  ? "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                  : "text-white hover:text-white/80"
              }`}
            >
              <BookOpenIcon className="h-5 w-5 mr-1.5" />
              Guide
            </Link>
            <Link
              href="/explore"
              className={`flex items-center gap-2 px-2 py-3 text-sm font-medium ${
                scrolled 
                  ? "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                  : "text-white hover:text-white/80"
              }`}
            >
              <GlobeAltIcon className="h-5 w-5 mr-1.5" />
              Explore
            </Link>

            {user ? (
              <>
                <Link
                  href="/user"
                  className={`flex items-center gap-2 px-2 py-3 text-sm font-medium ${
                    scrolled 
                      ? "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                      : "text-white hover:text-white/80"
                  }`}
                >
                  <HomeIcon className="h-5 w-5 mr-1.5" />
                  My Timelines
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                   Sign Out
                </button>

              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5" />
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
