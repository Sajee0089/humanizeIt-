import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from './SEO';
import { motion } from 'motion/react';
import { Check, X, ArrowRight } from 'lucide-react';

const COMPARISONS = {
  'quillbot': {
    title: "HumanizeIt vs QuillBot: Which is Better? (2026 Comparison)",
    competitor: "QuillBot",
    description: "Compare features, show HumanizeIt advantages: More tools, completely free, no word limit per session, and better humanization.",
    features: [
      { name: "AI Humanizer", us: true, them: true },
      { name: "AI Detector", us: true, them: false },
      { name: "Image Detector", us: true, them: false },
      { name: "Plagiarism Checker", us: true, them: true },
      { name: "Summarizer", us: true, them: true },
      { name: "Free Daily Words", us: "500+", them: "125" },
      { name: "No Signup Needed", us: true, them: false }
    ]
  },
  'undetectable-ai': {
    title: "HumanizeIt vs Undetectable.ai: Free Alternative That Works Better",
    competitor: "Undetectable.ai",
    description: "Why HumanizeIt is the best free alternative to Undetectable.ai for natural human writing.",
    features: [
      { name: "Free Access", us: "100%", them: "Limited Trial" },
      { name: "Writing Modes", us: "6 Modes", them: "3 Modes" },
      { name: "Deep Scan", us: true, them: true },
      { name: "Sentence Analysis", us: true, them: false },
      { name: "No Account Required", us: true, them: false }
    ]
  },
  'writehuman': {
    title: "HumanizeIt vs WriteHuman: Free vs Paid AI Humanizer 2026",
    competitor: "WriteHuman",
    description: "Don't pay for what you can get for free. HumanizeIt vs WriteHuman comparison.",
    features: [
      { name: "Price", us: "Free", them: "$12+/mo" },
      { name: "Word Limits", us: "Generous", them: "Strict" },
      { name: "Multi-Tool Suite", us: true, them: false },
      { name: "API Access", us: "Coming Soon", them: "Paid" }
    ]
  }
};

const ALTERNATIVES = {
  'grammarly': {
    title: "Best Free Grammarly Alternatives for AI Writing 2026",
    competitor: "Grammarly",
    description: "Looking for a free Grammarly alternative? HumanizeIt offers advanced AI writing tools without the subscription."
  },
  'quillbot': {
    title: "Best Free QuillBot Alternatives That Actually Work",
    competitor: "QuillBot",
    description: "HumanizeIt is the #1 free QuillBot alternative for humanizing AI text and detecting AI content."
  }
};

export const ComparisonPage: React.FC = () => {
  const { type, slug } = useParams<{ type: string, slug: string }>();
  
  const data = type === 'vs' ? COMPARISONS[slug as keyof typeof COMPARISONS] : ALTERNATIVES[slug as keyof typeof ALTERNATIVES];

  if (!data) return <div className="pt-24 text-center">Comparison not found.</div>;

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <SEO 
        title={data.title}
        description={data.description}
        canonical={`https://humanize-it1.vercel.app/${type}/${slug}`}
      />
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            {data.title}
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Discover why thousands of users are switching from {data.competitor} to HumanizeIt for their AI writing needs.
          </p>
        </motion.div>

        {type === 'vs' && 'features' in data && (
          <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 mb-16">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5">
                  <th className="p-6 font-bold text-slate-400 uppercase text-xs tracking-widest">Feature</th>
                  <th className="p-6 font-black text-primary text-xl">HumanizeIt</th>
                  <th className="p-6 font-bold text-slate-400 text-xl">{data.competitor}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {(data as any).features.map((f: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-6 font-medium text-slate-600 dark:text-slate-400">{f.name}</td>
                    <td className="p-6">
                      {typeof f.us === 'boolean' ? (
                        f.us ? <Check className="text-emerald-500 w-6 h-6" /> : <X className="text-red-500 w-6 h-6" />
                      ) : (
                        <span className="font-bold text-primary">{f.us}</span>
                      )}
                    </td>
                    <td className="p-6">
                      {typeof f.them === 'boolean' ? (
                        f.them ? <Check className="text-slate-400 w-6 h-6" /> : <X className="text-slate-300 w-6 h-6" />
                      ) : (
                        <span className="font-medium text-slate-400">{f.them}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
            <h3 className="text-xl font-bold mb-4">Why Choose HumanizeIt?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Advanced AI humanization that bypasses top detectors.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Completely free to use with no hidden subscriptions.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Privacy-focused: No signup or personal data required.</span>
              </li>
            </ul>
          </div>
          <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold mb-4">Ready to switch?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Experience the power of a truly free AI writing suite today.</p>
            <Link 
              to="/humanize"
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Start Humanizing <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
