import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrainCircuit, Sparkles, Bot, FileSearch, FileText } from 'lucide-react';

interface ToolTabsProps {
  activeTab: 'detect' | 'humanize' | 'image-detect' | 'plagiarism' | 'summarize';
}

export const ToolTabs: React.FC<ToolTabsProps> = ({ activeTab }) => {
  const tabs = [
    { id: 'humanize', name: 'AI Humanizer', icon: Sparkles, path: '/humanize', color: 'text-accent' },
    { id: 'detect', name: 'AI Detector', icon: BrainCircuit, path: '/detect', color: 'text-primary' },
    { id: 'image-detect', name: 'Image Detector', icon: Bot, path: '/image-detect', color: 'text-purple-400' },
    { id: 'plagiarism', name: 'Plagiarism', icon: FileSearch, path: '/plagiarism', color: 'text-emerald-400' },
    { id: 'summarize', name: 'Summarizer', icon: FileText, path: '/summarize', color: 'text-blue-400' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-start sm:justify-center py-3 gap-8 sm:gap-12 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`group relative flex flex-col items-center gap-1 transition-all ${
                  isActive 
                    ? 'scale-105' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-white/10'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-500'
                }`}>
                  {tab.id === 'humanize' ? 'Humanize' : 
                   tab.id === 'detect' ? 'Detect' : 
                   tab.id === 'image-detect' ? 'Image' : 
                   tab.id === 'plagiarism' ? 'Check' : 'Summarize'}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -top-3 left-0 right-0 h-1 bg-primary rounded-b-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
