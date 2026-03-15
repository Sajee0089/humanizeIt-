import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileSearch, Loader2, Trash2, AlertCircle, Info, ShieldCheck, ShieldAlert, BarChart3, Clock, Type, Hash, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkPlagiarism } from '../lib/gemini';

export const PlagiarismChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const limit = 500;

  const handleCheck = async () => {
    if (!input.trim() || wordCount > limit) return;
    setLoading(true);
    try {
      const data = await checkPlagiarism(input);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 20) return 'text-green-500 bg-green-500';
    if (score <= 50) return 'text-yellow-500 bg-yellow-500';
    return 'text-red-500 bg-red-500';
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-primary" /> Plagiarism Checker
              </h1>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${wordCount > limit ? 'text-red-500' : 'text-slate-500'}`}>
                  {wordCount} / {limit} words
                </span>
                <button 
                  onClick={() => setInput('')}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste text to check for plagiarism..."
              className="w-full h-80 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />

            <button
              onClick={handleCheck}
              disabled={loading || !input.trim() || wordCount > limit}
              className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSearch className="w-5 h-5" />}
              Check Plagiarism
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-bold mb-6">Originality Report</h2>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Scanning global databases...</p>
              </div>
            ) : result ? (
              <div className="space-y-8">
                {/* Score Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Originality</p>
                    <p className="text-2xl font-black text-green-500">{result.originalityScore}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Plagiarism</p>
                    <p className="text-2xl font-black text-red-500">
                      {result.plagiarismScore}%
                    </p>
                  </div>
                </div>

                {/* Score Bar */}
                <div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.plagiarismScore}%` }}
                      className={`h-full ${getScoreColor(result.plagiarismScore).split(' ')[1]}`}
                    />
                  </div>
                </div>

                {/* Suspicious Phrases */}
                {result.suspiciousPhrases.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1 text-yellow-500">
                      <ShieldAlert className="w-3 h-3" /> Suspicious Phrases
                    </h3>
                    <div className="space-y-2">
                      {result.suspiciousPhrases.map((phrase: string, i: number) => (
                        <div key={i} className="p-3 bg-yellow-500/5 border-l-2 border-yellow-500 text-xs leading-relaxed italic">
                          "{phrase}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1 text-primary">
                    <ShieldCheck className="w-3 h-3" /> Suggestions
                  </h3>
                  <div className="space-y-2">
                    {result.suggestions.map((s: string, i: number) => (
                      <div key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Content Statistics */}
                <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" /> Input Content Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Type className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Words</span>
                      </div>
                      <p className="text-lg font-black">{input.trim() ? input.trim().split(/\s+/).length : 0}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Hash className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Chars</span>
                      </div>
                      <p className="text-lg font-black">{input.length}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <BarChart3 className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Sentences</span>
                      </div>
                      <p className="text-lg font-black">{input.split(/[.!?]+/).filter(s => s.trim().length > 0).length}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Read Time</span>
                      </div>
                      <p className="text-lg font-black">{Math.ceil((input.trim() ? input.trim().split(/\s+/).length : 0) / 200)}m</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm">Originality report will appear here</p>
              </div>
            )}
          </div>
          {/* Internal Linking SEO */}
          <div className="mt-12 pt-12 border-t border-slate-100 dark:border-white/10 flex justify-center">
            <Link 
              to="/humanize"
              className="px-8 py-4 bg-primary/10 text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-primary/5"
            >
              Humanize AI Text <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
