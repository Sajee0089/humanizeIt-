import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { SEO } from './SEO';
import { supabase } from '../lib/supabase';
import Markdown from 'react-markdown';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  created_at: string;
  author_name: string;
  category: string;
  image_url: string;
}

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        
        if (data) {
          setPost(data as Post);
        } else {
          // Mock data fallback for specific slugs
          const mockPosts: Record<string, Post> = {
            'how-to-bypass-ai-detectors-2026': {
              id: '1',
              title: 'How to Bypass AI Detectors in 2026',
              slug: 'how-to-bypass-ai-detectors-2026',
              excerpt: 'Learn the latest techniques to make your AI-generated content indistinguishable from human writing.',
              content: `
# How to Bypass AI Detectors in 2026

The landscape of AI detection has evolved rapidly. In 2026, detectors like Turnitin and GPTZero use advanced semantic analysis, perplexity mapping, and burstiness detection to identify robotic writing. However, human writing remains distinct in its unpredictability and emotional resonance.

## 1. Understanding the Metrics

AI detectors look for two primary things:
- **Perplexity:** The randomness of the text. AI tends to use the most "probable" next word.
- **Burstiness:** The variation in sentence structure and length. AI often produces very uniform sentences.

## 2. Techniques for Humanization

To make your AI text pass as human, you must inject these qualities back into the writing.

### Vary Your Sentence Structure
Don't let every sentence follow the Subject-Verb-Object pattern. Use prepositional phrases, dependent clauses, and fragments for emphasis.

### Use Nuanced Vocabulary
AI loves words like "pivotal," "comprehensive," and "delve." Replace these with more specific, context-heavy human choices.

### Add Personal Anecdotes
AI can't (yet) truly simulate personal experience. Adding "In my experience" or specific examples from your life is a massive human signal.

## 3. Using HumanizeIt

Our tool uses a multi-pass approach to automatically apply these techniques. By selecting the "Aggressive" mode, you ensure that every sentence is restructured to maximize both perplexity and burstiness.

Stay ethical, stay creative!
              `,
              created_at: '2026-03-10T10:00:00Z',
              author_name: 'HumanizeIt Team',
              category: 'Guides',
              image_url: 'https://picsum.photos/seed/ai/1200/600'
            }
          };

          if (slug && mockPosts[slug]) {
            setPost(mockPosts[slug]);
          } else {
            navigate('/blog');
          }
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50 dark:bg-dark-bg">
      <SEO 
        title={`${post.title} | HumanizeIt Blog`}
        description={post.excerpt}
        ogImage={post.image_url}
      />

      <div className="max-w-4xl mx-auto">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium">{post.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <div className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_200px] gap-12">
            <div className="prose dark:prose-invert max-w-none">
              <div className="markdown-body">
                <Markdown>{post.content}</Markdown>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-400">Share Article</h3>
                <div className="flex flex-col gap-3">
                  <button className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    <span className="text-sm font-medium">Twitter</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                    <Facebook className="w-4 h-4 text-[#4267B2]" />
                    <span className="text-sm font-medium">Facebook</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                    <LinkIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium">Copy Link</span>
                  </button>
                </div>

                <div className="mt-12 p-6 bg-primary rounded-3xl text-white">
                  <h4 className="font-bold mb-2">Ready to Humanize?</h4>
                  <p className="text-xs text-white/80 mb-4">Try our advanced AI humanizer today and bypass all detectors.</p>
                  <Link 
                    to="/humanize"
                    className="block w-full py-3 bg-white text-primary text-center rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Try for Free
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
