import React, { useState, useEffect, useRef } from 'react';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  RotateCcw, 
  Mic, 
  Volume2, 
  Square,
  Check, 
  AlertCircle,
  Loader2,
  Trash2,
  BarChart3,
  Clock,
  Type,
  Hash,
  Download,
  History,
  Search,
  Calendar,
  ExternalLink,
  X as CloseIcon,
  ArrowRight,
  Split,
  ThumbsUp,
  ThumbsDown,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { humanizeText, deepHumanizeText, calculateAiScore, detectAiDeepScan } from '../lib/gemini';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { UpgradeModal } from './UpgradeModal';
import * as Diff from 'diff';
import { saveAs } from 'file-saver';

export const HumanizeTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('Standard');
  const [level, setLevel] = useState(5);
  const [loading, setLoading] = useState(false);
  const [isDeepHumanizing, setIsDeepHumanizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [heuristicScore, setHeuristicScore] = useState<{ perplexity: number; burstiness: number; totalScore: number } | null>(null);
  const [deepScanScore, setDeepScanScore] = useState<number | null>(null);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [fullHistory, setFullHistory] = useState<any[]>([]);
  const [historySearch, setHistorySearch] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeType, setUpgradeType] = useState<'limit' | 'feature'>('limit');
  const [wordsToday, setWordsToday] = useState(0);
  const [showCompare, setShowCompare] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const { user, profile, refreshProfile } = useAuth();
  
  useEffect(() => {
    const prefilled = localStorage.getItem('humanizer_input');
    if (prefilled) {
      setInput(prefilled);
      localStorage.removeItem('humanizer_input');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const currentLimit = profile?.words_limit || 500;
  const maxChars = 5000;
  const charCount = input.length;
  const isOverCharLimit = charCount > maxChars;

  useEffect(() => {
    if (user) {
      fetchHistory();
      fetchUsage();
    }
  }, [user]);

  const fetchUsage = async () => {
    try {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('usage')
        .select('words_used')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setWordsToday(data.words_used || 0);
      } else {
        setWordsToday(0);
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('humanizations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const fetchFullHistory = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('humanizations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFullHistory(data || []);
    } catch (err) {
      console.error("Failed to fetch full history:", err);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('humanizations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFullHistory(prev => prev.filter(item => item.id !== id));
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  useEffect(() => {
    if (showFullHistory) {
      fetchFullHistory();
    }
  }, [showFullHistory]);

  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const handleHumanize = async (isDeep: boolean = false) => {
    if (!input.trim() || isOverCharLimit) return;

    if (wordsToday + wordCount > currentLimit) {
      setUpgradeType('limit');
      setShowUpgradeModal(true);
      return;
    }
    
    setLoading(true);
    setProgress(0);
    setProgressMessage('Starting...');
    if (isDeep) setIsDeepHumanizing(true);
    setHeuristicScore(null);
    setDeepScanScore(null);
    setFeedback(null);
    setShowCompare(false);
    try {
      const result = isDeep 
        ? await deepHumanizeText(input, mode, level)
        : await humanizeText(input, mode, level, (p, m) => {
            setProgress(p);
            setProgressMessage(m);
          });
      
      setOutput(result);
      
      // Use heuristic for immediate feedback
      const initialScore = calculateAiScore(result);
      setHeuristicScore(initialScore);

      // Perform Deep Scan for higher accuracy
      setIsDeepScanning(true);
      const deepScore = await detectAiDeepScan(result);
      setDeepScanScore(deepScore);
      setIsDeepScanning(false);
      
      if (user) {
        try {
          const { error: humanizationError } = await supabase
            .from('humanizations')
            .insert({
              user_id: user.id,
              original_text: input,
              humanized_text: result,
              mode: isDeep ? `${mode} (Deep)` : mode,
              word_count: wordCount,
              created_at: new Date().toISOString()
            });

          if (humanizationError) throw humanizationError;

          // Update usage
          const today = new Date().toISOString().split('T')[0];
          
          const { data: existingUsage, error: fetchError } = await supabase
            .from('usage')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .maybeSingle();

          if (fetchError) throw fetchError;

          if (existingUsage) {
            const { error: updateError } = await supabase
              .from('usage')
              .update({
                words_used: existingUsage.words_used + wordCount,
                texts_count: existingUsage.texts_count + 1
              })
              .eq('id', existingUsage.id);
            
            if (updateError) throw updateError;
          } else {
            const { error: insertError } = await supabase
              .from('usage')
              .insert({
                user_id: user.id,
                date: today,
                words_used: wordCount,
                texts_count: 1
              });
            
            if (insertError) throw insertError;
          }

          fetchHistory();
          fetchUsage();
          refreshProfile();
        } catch (err) {
          console.error("Failed to update database:", err);
        }
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6C63FF', '#00D4FF']
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsDeepHumanizing(false);
      setIsDeepScanning(false);
      setProgress(0);
      setProgressMessage('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'docx' | 'pdf' = 'txt') => {
    if (!output) return;
    
    if (format === 'txt') {
      const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `humanized_${mode.toLowerCase()}.txt`);
    } else {
      // For docx/pdf we'd usually need more libs, but for now we'll just download as txt
      // with a different extension or alert the user
      const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `humanized_${mode.toLowerCase()}.${format}`);
    }
  };

  const handleFeedback = async (type: 'up' | 'down') => {
    setFeedback(type);
    if (user) {
      try {
        // Find the latest humanization for this user
        const { data } = await supabase
          .from('humanizations')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data) {
          await supabase
            .from('humanizations')
            .update({ feedback: type })
            .eq('id', data.id);
        }
      } catch (err) {
        console.error("Error saving feedback:", err);
      }
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };

    recognition.start();
  };

  const handleTTS = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!output) return;

    const utterance = new SpeechSynthesisUtterance(output);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const modes = ['Standard', 'Aggressive', 'Academic', 'Business', 'Creative', 'Casual'];

  return (
    <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="AI Text Humanizer" 
        description="Convert AI-generated text into natural, human-sounding writing that bypasses AI detectors." 
        keywords="ai humanizer, bypass ai detection, humanize ai text, ai writing tool"
      />
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls & Input */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> AI Text Humanizer
              </h1>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${wordCount > currentLimit ? 'text-red-500' : 'text-slate-500'}`}>
                  {wordCount} / {currentLimit} words
                </span>
                <span className={`text-sm font-medium ${isOverCharLimit ? 'text-red-500' : 'text-slate-500'}`}>
                  {charCount} / {maxChars} chars
                </span>
                <button 
                  onClick={() => setInput('')}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {isOverCharLimit && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Text is too long. Please reduce the length to under {maxChars} characters to ensure optimal performance and avoid API limits.</p>
              </div>
            )}
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your AI-generated text here..."
              className={`w-full h-64 bg-slate-50 dark:bg-black/20 border rounded-xl p-4 outline-none focus:ring-2 transition-all resize-none ${
                isOverCharLimit 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-200 dark:border-white/10 focus:ring-primary'
              }`}
            />

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {modes.map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    mode === m 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Humanization Level</label>
                <span className="text-sm font-bold text-primary">{level}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleHumanize(false)}
                disabled={loading || !input.trim() || wordCount > currentLimit || isOverCharLimit}
                className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && !isDeepHumanizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Quick Humanize
              </button>
              
              <button
                onClick={() => handleHumanize(true)}
                disabled={loading || !input.trim() || wordCount > currentLimit || isOverCharLimit}
                className="flex-1 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isDeepHumanizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                Deep Humanize
              </button>

              <button
                onClick={handleVoiceInput}
                className={`p-4 rounded-xl border border-slate-200 dark:border-white/10 transition-colors ${
                  isListening ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Output & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Humanized Result</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCompare(!showCompare)}
                  disabled={!output}
                  className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${showCompare ? 'text-primary bg-primary/10' : 'text-slate-500'} disabled:opacity-30`}
                  title="Compare with original"
                >
                  <Split className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleTTS}
                  disabled={!output}
                  className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${isSpeaking ? 'text-primary bg-primary/10' : 'text-slate-500'} disabled:opacity-30`}
                >
                  {isSpeaking ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleDownload('txt')}
                  disabled={!output}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 disabled:opacity-30"
                  title="Download as .txt"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleCopy}
                  disabled={!output}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 disabled:opacity-30"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 overflow-y-auto min-h-[300px]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">{progressMessage}</p>
                  <div className="w-full max-w-xs bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : output ? (
                <div className="space-y-6">
                  {showCompare ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {Diff.diffWords(input, output).map((part, i) => (
                          <span
                            key={i}
                            className={
                              part.added 
                                ? 'bg-green-500/20 text-green-600 dark:text-green-400 rounded px-1' 
                                : part.removed 
                                  ? 'bg-red-500/20 text-red-600 dark:text-red-400 line-through rounded px-1' 
                                  : ''
                            }
                          >
                            {part.value}
                          </span>
                        ))}
                      </div>
                      <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-[10px] text-primary font-medium flex items-center gap-2">
                        <Split className="w-3 h-3" />
                        Showing differences between original and humanized text.
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{output}</p>
                  )}
                  
                  {/* Feedback Section */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
                    <span className="text-xs text-slate-500">Is this result helpful?</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleFeedback('up')}
                        className={`p-2 rounded-lg transition-all ${feedback === 'up' ? 'bg-green-500 text-white' : 'hover:bg-green-500/10 text-slate-400 hover:text-green-500'}`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleFeedback('down')}
                        className={`p-2 rounded-lg transition-all ${feedback === 'down' ? 'bg-red-500 text-white' : 'hover:bg-red-500/10 text-slate-400 hover:text-red-500'}`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Input Content Statistics */}
                  <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <BarChart3 className="w-3 h-3" /> Input Content Statistics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Type className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase">Words</span>
                        </div>
                        <p className="text-lg font-black">{input.trim() ? input.trim().split(/\s+/).length : 0}</p>
                      </div>
                      <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Hash className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase">Chars</span>
                        </div>
                        <p className="text-lg font-black">{input.length}</p>
                      </div>
                      <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <BarChart3 className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase">Sentences</span>
                        </div>
                        <p className="text-lg font-black">{input.split(/[.!?]+/).filter(s => s.trim().length > 0).length}</p>
                      </div>
                      <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
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
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-sm">Humanized text will appear here</p>
                </div>
              )}
            </div>

            {(heuristicScore !== null || deepScanScore !== null) && (
              <div className="mt-6 space-y-4">
                {/* Heuristic Score */}
                {heuristicScore !== null && (
                  <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Linguistic Analysis</span>
                      <span className={`text-sm font-bold ${heuristicScore.totalScore < 20 ? 'text-green-500' : heuristicScore.totalScore < 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {heuristicScore.totalScore}% AI
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${heuristicScore.totalScore}%` }}
                        className={`h-full ${heuristicScore.totalScore < 20 ? 'bg-green-500' : heuristicScore.totalScore < 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Perplexity: {heuristicScore.perplexity}</span>
                      <span>Burstiness: {heuristicScore.burstiness}</span>
                    </div>
                  </div>
                )}

                {/* Deep Scan Score */}
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Semantic Deep Scan</span>
                      {isDeepScanning && (
                        <span className="flex items-center gap-1 text-[10px] text-primary animate-pulse font-bold">
                          <Loader2 className="w-2 h-2 animate-spin" /> Scanning
                        </span>
                      )}
                    </div>
                    {deepScanScore !== null && (
                      <span className={`text-sm font-bold ${deepScanScore < 20 ? 'text-green-500' : deepScanScore < 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {deepScanScore}% AI
                      </span>
                    )}
                  </div>
                  {deepScanScore !== null ? (
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${deepScanScore}%` }}
                        className={`h-full ${deepScanScore < 20 ? 'bg-green-500' : deepScanScore < 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      />
                    </div>
                  ) : isDeepScanning ? (
                    <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="h-full w-1/3 bg-primary/30 rounded-full"
                      />
                    </div>
                  ) : null}
                </div>

                <p className="text-[10px] text-center text-slate-500">
                  Linguistic Analysis checks patterns & structure. Semantic Deep Scan uses AI to detect intent.
                </p>
              </div>
            )}
          </div>

          {/* History Widget */}
          {user && history.length > 0 && (
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Recent History
                </h3>
                <button 
                  onClick={() => setShowFullHistory(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setInput(item.original_text);
                      setOutput(item.humanized_text);
                      setMode(item.mode);
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-primary">{item.mode}</span>
                      <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                      {item.original_text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Internal Linking SEO */}
          <div className="mt-12 pt-12 border-t border-slate-100 dark:border-white/10 flex flex-wrap justify-center gap-4">
            <Link 
              to="/plagiarism"
              className="px-6 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
            >
              Check plagiarism <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/summarize"
              className="px-6 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
            >
              Summarize first <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Full History Modal */}
      <AnimatePresence>
        {showFullHistory && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullHistory(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[80vh] bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <History className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Humanization History</h2>
                    <p className="text-xs text-slate-500">Review and restore your previous humanizations</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFullHistory(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-slate-200 dark:border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search history..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {fullHistory
                  .filter(item => 
                    item.original_text.toLowerCase().includes(historySearch.toLowerCase()) ||
                    item.humanized_text.toLowerCase().includes(historySearch.toLowerCase()) ||
                    item.mode.toLowerCase().includes(historySearch.toLowerCase())
                  )
                  .map((item) => (
                    <div 
                      key={item.id}
                      className="group bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md tracking-wider">
                            {item.mode}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.created_at).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Type className="w-3 h-3" />
                            {item.word_count} words
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setInput(item.original_text);
                              setOutput(item.humanized_text);
                              setMode(item.mode.replace(' (Deep)', ''));
                              setShowFullHistory(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <ExternalLink className="w-3 h-3" /> Restore
                          </button>
                          <button 
                            onClick={() => deleteHistoryItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 bg-white dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                            {item.original_text}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Humanized</p>
                          <p className="text-xs text-slate-900 dark:text-white line-clamp-3 bg-white dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                            {item.humanized_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {fullHistory.length === 0 && (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <History className="w-12 h-12 opacity-20" />
                    <p className="font-medium">No history found yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        type={upgradeType}
        featureName="Advanced Humanizer Modes"
        currentUsage={wordsToday}
        limit={currentLimit}
      />
    </main>
  );
};
