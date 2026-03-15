import React, { useState } from 'react';
import { SEO } from './SEO';
import { motion } from 'motion/react';
import { BrainCircuit, Loader2, Trash2, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { detectAiContent } from '../lib/gemini';
import { useUsageLimit } from '../hooks/useUsageLimit';
import { UpgradeModal } from './UpgradeModal';

export const AIDetector: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { 
    wordsToday, 
    currentLimit, 
    showUpgradeModal, 
    setShowUpgradeModal, 
    upgradeType, 
    checkLimit, 
    updateUsage 
  } = useUsageLimit();
  
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  const handleDetect = async () => {
    if (!input.trim()) return;
    if (!checkLimit(wordCount)) return;

    setLoading(true);
    try {
      const data = await detectAiContent(input);
      setResult(data);
      await updateUsage(wordCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-500 bg-green-500';
    if (score <= 70) return 'text-yellow-500 bg-yellow-500';
    return 'text-red-500 bg-red-500';
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title="AI Detector" 
        description="Analyze text for AI patterns with sentence-by-sentence highlights to detect AI-generated content." 
        keywords="ai detector, gpt detector, check for ai text, ai writing checker"
      />
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" /> AI Content Detector
              </h1>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${wordCount > currentLimit ? 'text-red-500' : 'text-slate-500'}`}>
                  {wordCount} / {currentLimit} words
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
              placeholder="Paste text to analyze for AI patterns..."
              className="w-full h-80 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />

            <button
              onClick={handleDetect}
              disabled={loading || !input.trim() || wordCount > currentLimit}
              className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
              Analyze Content
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-bold mb-6">Detection Results</h2>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Analyzing linguistic patterns...</p>
              </div>
            ) : result ? (
              <div className="space-y-8">
                {/* Score Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-500">AI Probability</span>
                    <span className={`text-lg font-black ${getScoreColor(result.score).split(' ')[0]}`}>
                      {result.score}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      className={`h-full ${getScoreColor(result.score).split(' ')[1]}`}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Human</span>
                    <span>AI Generated</span>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Analysis Reasoning
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {result.reasoning}
                  </p>
                </div>

                {/* Sentence Analysis */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Sentence-by-Sentence Analysis</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {result.sentences.map((s: any, i: number) => (
                      <div 
                        key={i}
                        className={`p-2 rounded text-sm leading-relaxed ${
                          s.isAI 
                            ? 'bg-red-500/10 border-l-2 border-red-500 text-red-700 dark:text-red-400' 
                            : 'bg-green-500/10 border-l-2 border-green-500 text-green-700 dark:text-green-400'
                        }`}
                      >
                        {s.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm">Analysis results will appear here</p>
              </div>
            )}
          </div>
          {/* Internal Linking SEO */}
          <div className="mt-12 pt-12 border-t border-slate-100 dark:border-white/10 flex justify-center">
            <Link 
              to="/humanize"
              className="px-8 py-4 bg-primary/10 text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-primary/5"
            >
              Humanize this text <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        type={upgradeType}
        featureName="AI Content Detector"
        currentUsage={wordsToday}
        limit={currentLimit}
      />
    </main>
  );
};
