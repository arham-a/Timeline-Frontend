"use client";
import { useState, useEffect } from "react";
import { UserCircleIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, HomeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: "Explore", href: "/explore", icon: GlobeAltIcon },
  { name: "My Timelines", href: "/", icon: HomeIcon },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    isLoggedIn: true,
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false });
    setSidebarOpen(false);
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/70 backdrop-blur-md shadow" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-[var(--color-primary)]">
            <GlobeAltIcon className="h-7 w-7" /> Timeline
          </a>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="flex items-center gap-1 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] font-medium transition-colors">
                <link.icon className="h-5 w-5" /> {link.name}
              </a>
            ))}
            {user.isLoggedIn ? (
              <div className="flex items-center gap-3 ml-4">
                <img src={user.avatar} alt="avatar" className="h-8 w-8 rounded-full border-2 border-[var(--color-primary)] object-cover" />
                <span className="font-medium text-[var(--color-text-primary)]">{user.name}</span>
                <button onClick={handleLogout} className="ml-2 flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Logout
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="ml-4 flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                <ArrowRightOnRectangleIcon className="h-5 w-5" /> Login
              </button>
            )}
          </div>
          {/* Hamburger for mobile */}
          <button className="md:hidden p-2 rounded hover:bg-[var(--color-bg-purple-50)]" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="h-7 w-7 text-[var(--color-primary)]" />
          </button>
        </div>
      </nav>

      {/* Sidebar Drawer for Mobile/Tablet */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        {/* Drawer */}
        <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col py-6 px-4">
          <div className="flex items-center justify-between mb-8">
            <a href="/" className="flex items-center gap-2 font-bold text-xl text-[var(--color-primary)]">
              <GlobeAltIcon className="h-7 w-7" /> Timeline
            </a>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded hover:bg-[var(--color-bg-purple-50)]">
              <XMarkIcon className="h-6 w-6 text-[var(--color-primary)]" />
            </button>
          </div>
          <nav className="flex flex-col gap-4 flex-1">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="flex items-center gap-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] font-medium text-lg transition-colors" onClick={() => setSidebarOpen(false)}>
                <link.icon className="h-5 w-5" /> {link.name}
              </a>
            ))}
          </nav>
          <div className="mt-auto pt-8 border-t border-[var(--color-border)]">
            {user.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt="avatar" className="h-8 w-8 rounded-full border-2 border-[var(--color-primary)] object-cover" />
                <span className="font-medium text-[var(--color-text-primary)]">{user.name}</span>
                <button onClick={handleLogout} className="ml-2 flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Logout
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                <ArrowRightOnRectangleIcon className="h-5 w-5" /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 