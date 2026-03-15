import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import { SEO } from './SEO';
import { supabase } from '../lib/supabase';

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

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const MOCK_POSTS: Post[] = [
    {
      id: '1',
      title: 'How to Bypass AI Detectors in 2026',
      slug: 'how-to-bypass-ai-detectors-2026',
      excerpt: 'Learn the latest techniques to make your AI-generated content indistinguishable from human writing.',
      content: '',
      created_at: '2026-03-10T10:00:00Z',
      author_name: 'HumanizeIt Team',
      category: 'Guides',
      image_url: 'https://picsum.photos/seed/ai/800/400'
    },
    {
      id: '2',
      title: 'The Future of AI Writing: Human-AI Collaboration',
      slug: 'future-of-ai-writing',
      excerpt: 'Why the best content of the future will be a blend of artificial intelligence and human creativity.',
      content: '',
      created_at: '2026-03-05T12:00:00Z',
      author_name: 'Sarah Chen',
      category: 'Insights',
      image_url: 'https://picsum.photos/seed/future/800/400'
    },
    {
      id: '3',
      title: 'Understanding Perplexity and Burstiness',
      slug: 'understanding-perplexity-and-burstiness',
      excerpt: 'A deep dive into the two most important metrics used by AI detectors like GPTZero and Turnitin.',
      content: '',
      created_at: '2026-02-28T15:00:00Z',
      author_name: 'Dr. James Wilson',
      category: 'Technical',
      image_url: 'https://picsum.photos/seed/data/800/400'
    },
    {
      id: '4',
      title: 'Best Free AI Humanizer Tool in 2026 — Turn AI Text Human Instantly',
      slug: 'best-free-ai-humanizer-tool',
      excerpt: 'Looking for the best free AI humanizer? HumanizeIt converts ChatGPT, Gemini & Bard text into 100% human-sounding content that bypasses all AI detectors. Try free today.',
      content: '',
      created_at: '2026-03-15T10:00:00Z',
      author_name: 'HumanizeIt Team',
      category: 'Guides',
      image_url: 'https://picsum.photos/seed/humanizer/800/400'
    },
    {
      id: '5',
      title: 'Free AI Detector Online 2026 — Check If Text Is AI Generated Instantly',
      slug: 'free-ai-detector-online',
      excerpt: 'Use HumanizeIt\'s free AI detector to check if any text was written by ChatGPT, Gemini, or other AI tools. Get instant results with high accuracy. No sign-up needed.',
      content: '',
      created_at: '2026-03-15T10:00:00Z',
      author_name: 'HumanizeIt Team',
      category: 'Guides',
      image_url: 'https://picsum.photos/seed/detector/800/400'
    },
    {
      id: '6',
      title: 'Free Plagiarism Checker Online 2026 — Check Content Originality Instantly',
      slug: 'free-plagiarism-checker-online',
      excerpt: 'HumanizeIt\'s free plagiarism checker scans your content against billions of web pages to detect copied text. Get an originality report in seconds. Try free now.',
      content: '',
      created_at: '2026-03-15T10:00:00Z',
      author_name: 'HumanizeIt Team',
      category: 'Guides',
      image_url: 'https://picsum.photos/seed/plagiarism/800/400'
    },
    {
      id: '7',
      title: 'Free AI Image Detector 2026 — Find Out If an Image Was AI Generated',
      slug: 'ai-image-detector-free',
      excerpt: 'Use HumanizeIt\'s free AI image detector to instantly identify AI-generated images from Midjourney, DALL-E, Stable Diffusion & more. Fast, accurate, free to try.',
      content: '',
      created_at: '2026-03-15T10:00:00Z',
      author_name: 'HumanizeIt Team',
      category: 'Guides',
      image_url: 'https://picsum.photos/seed/image-detector/800/400'
    },
    {
      id: '8',
      title: 'Free AI Summarizer Tool 2026 — Summarize Any Text in Seconds',
      slug: 'free-ai-summarizer-tool',
      excerpt: 'HumanizeIt\'s free AI summarizer condenses long articles, research papers, PDFs, and documents into clear, accurate summaries instantly. Save hours of reading time. Try free.',
      content: '',
      created_at: '2026-03-15T10:00:00Z',
      author_name: 'HumanizeIt Team',
      category: 'Guides',
      image_url: 'https://picsum.photos/seed/summarizer/800/400'
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setPosts(data as Post[]);
        } else {
          setPosts(MOCK_POSTS);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50 dark:bg-dark-bg">
      <SEO 
        title="Blog — AI Writing Insights & Guides | HumanizeIt"
        description="Stay updated with the latest trends in AI writing, humanization techniques, and academic integrity guides."
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            HumanizeIt Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Expert guides, technical insights, and the latest news in the world of AI-assisted writing.
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-white/10" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author_name}
                    </div>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
