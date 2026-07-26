'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Compass, Sun, Moon, Check } from "lucide-react";
import { Button } from '../ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/lib/ThemeProvider';
import { ACCENT_THEMES, AccentTheme } from "@/store/slices/themeSlice";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const themeMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signOut } = useClerk();
  const { isAuthenticated, logout } = useAppStore();
  // Theme toggle available on the marketing navbar as well
  const { theme, setTheme, accentTheme, setAccentTheme } = useTheme();

  useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (
      themeMenuRef.current &&
      !themeMenuRef.current.contains(
        e.target as Node
      )
    ) {
      setThemeMenuOpen(false);
    }
  }

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  const handleSignOut = async () => {
    logout();
    setIsOpen(false);
    try {
  await signOut();
} catch {
  // ignore Clerk sign-out errors
}
    router.push('/');
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'AI Workflow', href: '#workflow' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full glass-panel border-b backdrop-blur-md"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--background) 70%, transparent)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group relative">
            <div
  className="p-2 rounded-xl group-hover:scale-110 transition-all duration-300"
  style={{
    backgroundColor: "rgba(var(--color-primary-rgb),0.12)",
    color: "var(--color-primary)",
    boxShadow: "0 0 15px rgba(var(--color-primary-rgb),0.25)",
  }}
>
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <span
              className="text-xl font-bold tracking-wider select-none"
              style={{ color: 'var(--text-primary)' }}
            >
              ProjectPilot{" "}
<span
  style={{
    color: "var(--color-primary)",
  }}
>
  AI
</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
  key={link.name}
  href={link.href}
  className="text-sm duration-200 relative group font-medium"
  style={{
    color: "var(--text-secondary)",
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.color = "var(--color-primary)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.color = "var(--text-secondary)")
  }
>
                {link.name}
                <span
  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
  style={{
    backgroundColor: "var(--color-primary)",
  }}
/>
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme toggle — available on the marketing page too */}
            <div className="relative" ref={themeMenuRef}>
  <button
    onClick={() => setThemeMenuOpen((v) => !v)}
    aria-label="Theme Customizer"
    className="p-2 rounded-xl border transition-colors cursor-pointer"
    style={{
      borderColor: "var(--border-subtle)",
      color: "var(--text-secondary)",
    }}
  >
    {theme === "dark" ? (
      <Sun className="w-4 h-4 text-amber-400" />
    ) : (
      <Moon className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
    )}
  </button>

  <AnimatePresence>
    {themeMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="absolute right-0 mt-3 w-72 rounded-2xl border backdrop-blur-xl p-4 z-50"
        style={{
  backgroundColor: "var(--surface-elevated)",
  borderColor: "var(--border-medium)",
}}
      >
        <div className="space-y-4">

  <div>
    <h3
      className="text-sm font-semibold"
      style={{ color: "var(--text-primary)" }}
    >
      Theme
    </h3>

    <div className="mt-3 space-y-2">

      <button
        onClick={() => setTheme("light")}
        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 transition ${
          theme === "light" ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Light Mode</span>
        </div>

        {theme === "light" && (
          <Check className="w-4 h-4 text-green-400" />
        )}
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 transition ${
          theme === "dark" ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 accent-text" />
          <span>Dark Mode</span>
        </div>

        {theme === "dark" && (
          <Check className="w-4 h-4 text-green-400" />
        )}
      </button>

    </div>
  </div>

  <div
    className="border-t pt-4"
    style={{ borderColor: "var(--border-subtle)" }}
  >
    <h3
      className="text-sm font-semibold mb-3"
      style={{ color: "var(--text-primary)" }}
    >
      Accent Colours
    </h3>

    <div className="flex items-center justify-between">

      {(Object.entries(ACCENT_THEMES) as [
        AccentTheme,
        string
      ][]).map(([name, colour]) => (

        <button
          key={name}
          aria-label={name}
          onClick={() => setAccentTheme(name)}
          className={`relative h-9 w-9 rounded-full transition-transform hover:scale-110 ${
            accentTheme === name
              ? "ring-2 ring-white ring-offset-2 ring-offset-black"
              : ""
          }`}
          style={{
            backgroundColor: colour,
          }}
        >
          {accentTheme === name && (
            <Check className="absolute inset-0 m-auto w-4 h-4 text-white" />
          )}
        </button>

      ))}

    </div>
  </div>

</div>
      </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="glow" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="premium" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile theme toggle */}
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="p-2 cursor-pointer"
              style={{
  color: "var(--text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.color = "var(--color-primary)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = "var(--text-secondary)";
}}
            >
              {theme === 'dark'
                ? <Sun className="w-5 h-5 text-amber-400" />
                : <Moon className="w-5 h-5 accent-text" />
              }
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 focus:outline-none cursor-pointer"
              style={{
  color: "var(--text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.color = "var(--color-primary)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = "var(--text-secondary)";
}}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t glass-panel overflow-hidden"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-semibold px-3 py-2 rounded-xl transition-colors"
                  style={{
  color: "var(--text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.color = "var(--color-primary)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = "var(--text-secondary)";
}}
                >
                  {link.name}
                </a>
              ))}
              <div
                className="border-t pt-4 flex flex-col space-y-3"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="glow" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button variant="premium" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
