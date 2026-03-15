import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Sparkles, BrainCircuit, Bot, FileSearch, FileText, Star, User as UserIcon, ChevronDown, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [wordsUsed, setWordsUsed] = useState(0);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchUsage = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('usage')
        .select('words_used')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      setWordsUsed(data?.words_used || 0);
    };
    fetchUsage();
  }, [user]);

  const navLinks = [
    { name: 'AI Humanizer', path: '/humanize', icon: Sparkles },
    { name: 'AI Detector', path: '/detect', icon: BrainCircuit },
    { name: 'Image Detector', path: '/image-detect', icon: Bot },
    { name: 'Plagiarism', path: '/plagiarism', icon: FileSearch },
    { name: 'Summarizer', path: '/summarize', icon: FileText },
    { name: 'Blog', path: '/blog', icon: FileText },
  ];

  const wordLimit = profile?.words_limit || 500;
  const remainingWords = Math.max(0, wordLimit - wordsUsed);

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

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors mr-2"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                    {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-bold">{profile?.full_name || 'User'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-4 z-50">
                    <div className="mb-4">
                      <div className="text-sm font-bold">{profile?.full_name || 'User'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Plan:</span>
                        <span className="font-bold uppercase">{profile?.plan || 'Free'}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Words Used:</span>
                          <span className="font-bold">{wordsUsed.toLocaleString()} / {wordLimit.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${Math.min(100, (wordsUsed / wordLimit) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors mb-2"
                    >
                      <BarChart3 className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
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
