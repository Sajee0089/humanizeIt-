import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Zap, ArrowRight, CheckCircle2, BrainCircuit, Bot, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      setSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Waitlist error:', error);
    }
  };

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-accent" />,
      title: "AI Humanizer",
      description: "Convert AI text to human-like writing that bypasses all detectors.",
      path: "/humanize"
    },
    {
      icon: <FileSearch className="w-6 h-6 text-emerald-400" />,
      title: "Plagiarism Checker",
      description: "Check for original content and potential plagiarism risks.",
      path: "/plagiarism"
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      title: "AI/GPT Detector",
      description: "Analyze text for AI patterns with sentence-by-sentence highlights.",
      path: "/detect"
    },
    {
      icon: <Bot className="w-6 h-6 text-purple-400" />,
      title: "AI Image Detector",
      description: "Detect AI-generated images from Midjourney, DALL-E, and more.",
      path: "/image-detect"
    }
  ];

  return (
    <div className="pt-20">
      {/* Beta Banner */}
      <div className="bg-primary/10 border-y border-primary/20 py-2 text-center">
        <p className="text-sm font-medium text-primary">
          🚀 Free Beta: Enjoy 500 words daily for free. No credit card required!
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Complete AI <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              Writing Toolkit
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium"
          >
            Humanize • Detect • Check. The professional all-in-one platform to ensure your content is authentic, human, and original.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-12"
          >
            <Link 
              to={user ? "/pricing" : "/signup"}
              state={{ from: 'landing' }}
              className="group relative px-10 py-5 bg-primary text-white rounded-2xl font-black text-xl hover:scale-105 transition-all flex items-center gap-3 shadow-2xl shadow-primary/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Get Started Now <ArrowRight className="w-6 h-6" />
            </Link>

            <div className="grid grid-cols-3 gap-12 sm:gap-24">
              <div className="text-center">
                <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">4</p>
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Premium Tools</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-primary mb-1">100%</p>
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Free Access</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">PRO</p>
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Advanced Features</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Powerful AI Toolkit</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to manage AI content effectively.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                to={user ? feature.path : "/signup"}
                onClick={() => !user && localStorage.setItem('redirectAfterAuth', feature.path)}
                className="group p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:border-primary transition-all hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "What is an AI humanizer?", a: "An AI humanizer converts AI-generated text into natural human-sounding writing by varying sentence structure, adding contractions, and removing robotic patterns." },
              { q: "Is HumanizeIt free?", a: "Yes, HumanizeIt is completely free with 500 words per day. No signup or credit card required." },
              { q: "How does the AI detector work?", a: "Our AI detector analyzes text patterns, sentence structure, and vocabulary to determine if content was written by AI or a human, showing results sentence by sentence." },
              { q: "What AI detectors does it work against?", a: "HumanizeIt optimizes text to sound natural and human. It improves human score across various AI detection systems." },
              { q: "Can I use it for academic writing?", a: "Yes, we have a dedicated Academic mode that rewrites text in scholarly natural language suitable for research papers and essays." }
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-slate-200 dark:border-white/10">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Waitlist for Pro Features</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Get notified when we launch unlimited plans and API access.</p>
          
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-green-500 font-bold">
              <CheckCircle2 className="w-6 h-6" /> You're on the list!
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Join Now
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary w-5 h-5" />
            <span className="font-bold">HumanizeIt</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} HumanizeIt. Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/blog" className="hover:text-primary">Blog</Link>
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            <Link to="/terms" className="hover:text-primary">Terms</Link>
            <Link to="/refund" className="hover:text-primary">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
