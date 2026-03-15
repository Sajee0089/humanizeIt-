import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  List, 
  Settings2, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle2,
  Loader2,
  ArrowRight,
  Newspaper,
  BookOpen,
  Mail,
  Clock,
  Type,
  Hash,
  BarChart3
} from 'lucide-react';
import { summarizeText } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const Summarizer: React.FC = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'paragraph' | 'bullets'>('paragraph');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const originalScrollRef = useRef<HTMLDivElement>(null);
  const summaryScrollRef = useRef<HTMLDivElement>(null);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 1000;

  const handleSummarize = async (isRegen = false) => {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      const summary = await summarizeText(
        input.slice(0, 5000), // Safety slice
        mode,
        length,
        keywords,
        isRegen
      );
      setResult(summary);

      // Save to Supabase if logged in
      if (user) {
        const { error } = await supabase
          .from('summaries')
          .insert({
            user_id: user.id,
            original_text: input,
            summary_text: summary,
            mode,
            length_setting: length,
            original_word_count: wordCount,
            summary_word_count: summary.trim().split(/\s+/).length,
            keywords: keywords || null,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleHumanize = () => {
    if (result) {
      // Navigate to humanizer and pass the text via state or local storage
      localStorage.setItem('humanizer_input', result);
      navigate('/humanize');
    }
  };

  const handleSyncScroll = (e: React.UIEvent<HTMLDivElement>, target: React.RefObject<HTMLDivElement>) => {
    if (target.current) {
      const source = e.currentTarget;
      const percentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
      target.current.scrollTop = percentage * (target.current.scrollHeight - target.current.clientHeight);
    }
  };

  const resultWordCount = result ? result.trim().split(/\s+/).length : 0;
  const percentSaved = wordCount > 0 ? Math.round(((wordCount - resultWordCount) / wordCount) * 100) : 0;
  const timeSaved = Math.max(0, Math.round((wordCount / 200) - (resultWordCount / 200)));

  const examples = [
    { icon: Newspaper, title: 'News Articles', desc: 'Summarize any news article into 3 key points instantly', text: 'The global economy is showing signs of recovery after a period of significant volatility. Central banks across major economies have started to stabilize interest rates, leading to renewed investor confidence. However, supply chain disruptions in key manufacturing hubs continue to pose risks to long-term growth. Experts suggest that a focus on sustainable energy and digital infrastructure will be the primary drivers of the next economic cycle.' },
    { icon: BookOpen, title: 'Research Papers', desc: 'Condense academic papers into digestible summaries', text: 'Recent studies in neuroplasticity have revealed that the human brain remains significantly more adaptable in adulthood than previously believed. Through a series of longitudinal experiments, researchers demonstrated that consistent engagement in novel cognitive tasks leads to measurable increases in synaptic density. This findings have profound implications for the treatment of age-related cognitive decline and the development of lifelong learning strategies.' },
    { icon: Mail, title: 'Long Emails', desc: 'Turn lengthy emails into quick action points', text: 'Hi Team, I hope you are all doing well. I wanted to follow up on our quarterly planning session from last week. We covered a lot of ground, including the new product roadmap, the marketing budget reallocation, and the upcoming team offsite in October. After reviewing the notes, I think we need to prioritize the API integration for the mobile app before we move forward with the UI redesign. Please let me know your thoughts by Friday so we can finalize the project plan.' }
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 pt-8 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <FileText className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">AI Summarizer</h1>
          <p className="text-sm text-slate-500 font-medium">Condense any text into key points instantly</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Section */}
        <div className="relative bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your article, essay, research paper, or any long text here to summarize..."
            className="w-full h-[180px] p-6 bg-transparent resize-none focus:outline-none text-slate-700 dark:text-slate-200 leading-relaxed"
          />
          <div className="absolute bottom-4 right-6 flex items-center gap-4">
            {isOverLimit && (
              <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-bold uppercase">
                <AlertTriangle className="w-3 h-3" />
                Limit: 1000 words
              </div>
            )}
            <div className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {wordCount} words
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 font-medium px-2">Free: up to 1000 words</p>

        {isOverLimit && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ Free limit is 1000 words. Your text has {wordCount} words. Summarizing first 1000 words.
            </p>
          </motion.div>
        )}

        {/* Controls Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mode Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Settings2 className="w-3 h-3" /> Summary Style
            </label>
            <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setMode('paragraph')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'paragraph' 
                    ? 'bg-[#6C63FF] text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Paragraph
              </button>
              <button
                onClick={() => setMode('bullets')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'bullets' 
                    ? 'bg-[#6C63FF] text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Bullet Points
              </button>
            </div>
          </div>

          {/* Length Slider */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-3 h-3" /> Summary Length
            </label>
            <div className="px-2 pt-2">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={length === 'short' ? 0 : length === 'medium' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setLength(val === 0 ? 'short' : val === 1 ? 'medium' : 'long');
                }}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span className={length === 'short' ? 'text-[#6C63FF]' : ''}>Short</span>
                <span className={length === 'medium' ? 'text-[#6C63FF]' : ''}>Medium</span>
                <span className={length === 'long' ? 'text-[#6C63FF]' : ''}>Long</span>
              </div>
              <p className="text-[10px] text-center text-slate-500 mt-1 font-medium italic">
                {length === 'short' ? '~25% of original' : length === 'medium' ? '~50% of original' : '~75% of original'}
              </p>
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Focus Keywords (Optional)
            </label>
            <span className="text-[10px] text-slate-400 font-medium italic">Add keywords to include in summary</span>
          </div>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. climate, economy"
            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#6C63FF] text-sm transition-colors"
          />
        </div>

        {/* Summarize Button */}
        <button
          onClick={() => handleSummarize()}
          disabled={loading || !input.trim()}
          className="w-full h-[52px] bg-gradient-to-r from-[#0EA5E9] to-[#6C63FF] text-white rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Summarize Now
            </>
          )}
        </button>

        {/* Result Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Summary Ready
                </h3>
                <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {wordCount} → {resultWordCount} words ({percentSaved}% shorter)
                </div>
              </div>

              <div className="relative group">
                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-slate-700 dark:text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
                  {result}
                </div>
                <button 
                  onClick={() => setShowCompare(!showCompare)}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-slate-500 hover:text-primary transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Words Before', value: wordCount, color: 'text-slate-400' },
                  { label: 'Words After', value: resultWordCount, color: 'text-blue-500' },
                  { label: 'Saved', value: `${percentSaved}%`, color: 'text-emerald-500' },
                  { label: 'Sents', value: result.split(/[.!?]+/).filter(s => s.trim().length > 0).length, color: 'text-purple-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-3 rounded-xl text-center shadow-sm">
                    <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium italic">
                <Clock className="w-3 h-3" />
                You saved approximately {timeSaved} minutes of reading time!
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button onClick={handleCopy} className="flex-1 min-w-[100px] py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button onClick={() => handleSummarize(true)} className="flex-1 min-w-[100px] py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
                <button onClick={handleDownload} className="flex-1 min-w-[100px] py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button onClick={handleHumanize} className="w-full py-4 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:bg-primary/20 transition-all">
                  <Sparkles className="w-4 h-4" /> Humanize This Summary
                </button>
              </div>

              {/* Side by Side Comparison */}
              {showCompare && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid md:grid-cols-2 gap-4 pt-4"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Original Text</p>
                    <div 
                      ref={originalScrollRef}
                      onScroll={(e) => handleSyncScroll(e, summaryScrollRef)}
                      className="h-[300px] overflow-y-auto p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-xs leading-relaxed text-slate-500 scroll-smooth no-scrollbar"
                    >
                      {input}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest px-2">AI Summary</p>
                    <div 
                      ref={summaryScrollRef}
                      onScroll={(e) => handleSyncScroll(e, originalScrollRef)}
                      className="h-[300px] overflow-y-auto p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs leading-relaxed text-slate-700 dark:text-slate-200 scroll-smooth no-scrollbar"
                    >
                      {result}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Examples */}
        {!result && !loading && (
          <div className="grid gap-4 pt-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Try an example</p>
            <div className="grid md:grid-cols-3 gap-4">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setInput(ex.text)}
                  className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-left hover:border-primary transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <ex.icon className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="text-sm font-black mb-1">{ex.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{ex.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

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
    </main>
  );
};
