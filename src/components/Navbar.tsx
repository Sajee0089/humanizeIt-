import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Sparkles, BrainCircuit, Bot, FileSearch, FileText, Star } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { name: 'AI Humanizer', path: '/humanize', icon: Sparkles },
    { name: 'AI Detector', path: '/detect', icon: BrainCircuit },
    { name: 'Image Detector', path: '/image-detect', icon: Bot },
    { name: 'Plagiarism', path: '/plagiarism', icon: FileSearch },
    { name: 'Summarizer', path: '/summarize', icon: FileText },
    { name: 'Blog', path: '/blog', icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                HumanizeIt
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${
                  location.pathname === link.path 
                    ? 'text-primary bg-primary/5' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <link.icon className={`w-4 h-4 ${location.pathname === link.path ? 'text-primary' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-200 dark:border-white/10 mx-4" />

            <Link
              to="/pricing"
              className="mr-4 px-3 py-1.5 border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              Upgrade
            </Link>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors mr-2"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                >
                  Sign Out
                </button>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-b border-slate-200 dark:border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-bold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 dark:border-white/5 my-2 pt-2" />
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary font-bold"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
