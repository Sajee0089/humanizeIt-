import React, { useState, useRef } from 'react';
import { SEO } from './SEO';
import { motion } from 'motion/react';
import { Bot, Upload, Loader2, AlertCircle, CheckCircle2, XCircle, Info, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { detectAiImage } from '../lib/gemini';
import { useAuth } from '../lib/AuthContext';
import { UpgradeModal } from './UpgradeModal';

export const ImageDetector: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (profile?.plan === 'free') {
        setShowUpgradeModal(true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    if (profile?.plan === 'free') {
      setShowUpgradeModal(true);
      return;
    }
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const data = await detectAiImage(base64Data, mimeType);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title="AI Image Detector" 
        description="Detect AI-generated images from Midjourney, DALL-E, and other AI image generators with our AI image detector." 
        keywords="ai image detector, detect ai images, ai generated image checker, image authenticity"
      />
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h1 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Bot className="w-5 h-5 text-primary" /> AI Image Detector
            </h1>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
                image ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-white/10 hover:border-primary hover:bg-primary/5'
              }`}
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-contain" loading="lazy" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-sm font-medium text-slate-500">Click to upload image</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WEBP</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !image}
              className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
              Analyze Image
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-bold mb-6">Analysis Results</h2>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Scanning for AI artifacts...</p>
              </div>
            ) : result ? (
              <div className="space-y-8">
                {/* Result Header */}
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  result.isAI ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    result.isAI ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {result.isAI ? <XCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`text-lg font-black ${result.isAI ? 'text-red-500' : 'text-green-500'}`}>
                      {result.isAI ? 'AI Generated' : 'Real Photograph'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.aiProbability}%` }}
                          className={`h-full ${result.isAI ? 'bg-red-500' : 'bg-green-500'}`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        AI Score: {result.aiProbability}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Key Indicators
                  </h3>
                  <div className="grid gap-2">
                    {result.reasons.map((reason: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Artifacts */}
                {result.artifacts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Detected Artifacts</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.artifacts.map((art: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {art}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                <ImageIcon className="w-8 h-8" />
                <p className="text-sm">Upload an image to start analysis</p>
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

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        type="feature"
        featureName="AI Image Detector"
      />
    </main>
  );
};
