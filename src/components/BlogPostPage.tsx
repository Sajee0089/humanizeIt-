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
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;
        
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
            },
            'best-free-ai-humanizer-tool': {
              id: '4',
              title: 'Best Free AI Humanizer Tool in 2026 — Turn AI Text Human Instantly',
              slug: 'best-free-ai-humanizer-tool',
              excerpt: 'Looking for the best free AI humanizer? HumanizeIt converts ChatGPT, Gemini & Bard text into 100% human-sounding content that bypasses all AI detectors. Try free today.',
              content: `
# Best Free AI Humanizer Tool in 2026 — Turn AI Text Human Instantly

AI-generated content is everywhere in 2026. Writers, students, marketers, and bloggers all use tools like ChatGPT, Gemini, and Bard to speed up their workflow. But there is one big problem — AI detectors like GPTZero, Originality.ai, and Turnitin can flag your content in seconds, leading to penalties, lower Google rankings, and failed assignments.

That is why you need a reliable free AI humanizer tool — and HumanizeIt is built exactly for this.

## What Is an AI Humanizer?

An AI humanizer is a tool that takes AI-generated text and rewrites it to sound naturally human. It adjusts sentence structure, word choice, and flow so the final output reads like a real person wrote it — not a machine.

Unlike basic paraphrasers that just swap synonyms, a true AI humanizer like HumanizeIt restructures content at a deeper level, preserving your original meaning while eliminating robotic patterns that detectors look for.

## Why HumanizeIt Is the Best Free AI Humanizer in 2026

HumanizeIt offers everything you need in one platform — completely free to start:

### Bypass All Major AI Detectors
HumanizeIt's output passes GPTZero, Originality.ai, ZeroGPT, Turnitin, Copyleaks, and Winston AI. Your content looks and reads like it was written by a human professional.

### 6 Humanizer Modes
Choose from multiple humanizer modes to match your tone — academic, professional, casual, creative, SEO-optimized, and more. Whether you are writing a blog post, an essay, or a marketing email, HumanizeIt adapts to your needs.

### SEO Keyword Preservation
Unlike many humanizers that strip keywords during rewriting, HumanizeIt intelligently keeps your target keywords intact. Your SEO value stays protected while the content gets fully humanized.

### Fast and Easy to Use
No technical knowledge needed. Paste your AI-generated text, click Humanize, and get human-sounding content in under 30 seconds. It works directly in your browser with no installation required.

### All 5 AI Writing Tools in One Place
HumanizeIt is not just a humanizer. You also get an AI Detector, Plagiarism Checker, AI Summarizer, and AI Image Detector — all in a single platform.

## How to Humanize AI Text in 3 Simple Steps

1. Go to HumanizeIt and open the AI Humanizer tool
2. Paste your ChatGPT, Gemini, or Bard-generated text
3. Click Humanize and download your human-sounding content

It takes less than a minute. The output is original, natural-sounding, and undetectable by AI detection systems.

## Who Needs an AI Humanizer?

- Students who use AI to draft essays and need to avoid Turnitin detection
- Content writers and bloggers who want to publish AI-assisted articles without Google penalties
- SEO professionals who need keyword-rich, human-readable content at scale
- Marketing teams producing bulk content that must pass brand and editorial review
- Freelancers delivering AI-assisted work that meets client quality standards

## Start Humanizing for Free

HumanizeIt offers 500 free words every day with no credit card required. Upgrade to Pro for 10,000 words per day and access to all 6 humanizer modes, priority processing, and 30 days of history saving.

[Try HumanizeIt Free](https://humanize-it-nine.vercel.app)
`,
              created_at: '2026-03-15T10:00:00Z',
              author_name: 'HumanizeIt Team',
              category: 'Guides',
              image_url: 'https://picsum.photos/seed/humanizer/1200/600'
            },
            'free-ai-detector-online': {
              id: '5',
              title: 'Free AI Detector Online 2026 — Check If Text Is AI Generated Instantly',
              slug: 'free-ai-detector-online',
              excerpt: 'Use HumanizeIt\'s free AI detector to check if any text was written by ChatGPT, Gemini, or other AI tools. Get instant results with high accuracy. No sign-up needed.',
              content: `
# Free AI Detector Online 2026 — Check If Text Is AI Generated Instantly

With AI writing tools becoming more powerful and accessible, the ability to detect AI-generated content has never been more important. Teachers need to verify student work. Editors need to confirm article authenticity. Businesses need to ensure their brand voice is genuinely human. HumanizeIt's free AI detector gives you instant, accurate results with no sign-up required.

## Why AI Detection Matters in 2026

AI content has flooded the internet. Google's Helpful Content system now actively penalizes pages that feel machine-generated, reducing their visibility in search results. Universities using Turnitin and similar tools are flagging student submissions at record rates. Brands are discovering AI-written copy slipping through their review processes.

Whether you are a publisher, educator, or content manager, having a reliable AI detector in your toolkit is essential.

## How HumanizeIt's AI Detector Works

HumanizeIt analyzes your text using advanced natural language processing models that look for the patterns AI writing tools leave behind — predictable sentence structures, overused transitional phrases, unnatural keyword density, and rhythm that feels machine-assembled rather than organically written.

The result is a clear AI probability score that tells you how likely the content was generated by an AI tool like ChatGPT, Gemini, Claude, Jasper, or Bard.

## Key Features of HumanizeIt's AI Detector

### High Accuracy Detection
Our detector is trained on millions of human and AI-written samples to give you the most accurate detection score available. It identifies AI content from all major tools including ChatGPT-4, Gemini Ultra, Claude 3, and more.

### Instant Results
Paste your text and get your AI score in seconds. No waiting, no loading screens, no account required to get started.

### Free to Use
Up to 500 words per day are completely free. No credit card. No hidden fees. Just paste and detect.

### Works on Any Content Type
Blog posts, academic essays, product descriptions, social media captions, news articles — HumanizeIt's AI detector works across all writing formats and genres.

### Paired With AI Humanizer
If your content is flagged as AI-generated, you can immediately humanize it using HumanizeIt's built-in humanizer tool. Detect, humanize, and re-check all in one platform — no switching between different websites.

## Who Should Use an AI Detector?

- Teachers and professors checking student assignments for AI use
- Blog editors and content managers verifying freelance submissions
- SEO agencies ensuring client content meets Google's helpful content standards
- HR teams reviewing AI-assisted job applications
- Publishers maintaining editorial authenticity

## Detect AI Content Now — It's Free

HumanizeIt makes AI detection simple, fast, and free. Start checking your content today.

[Try the Free AI Detector](https://humanize-it-nine.vercel.app)
`,
              created_at: '2026-03-15T10:00:00Z',
              author_name: 'HumanizeIt Team',
              category: 'Guides',
              image_url: 'https://picsum.photos/seed/detector/1200/600'
            },
            'free-plagiarism-checker-online': {
              id: '6',
              title: 'Free Plagiarism Checker Online 2026 — Check Content Originality Instantly',
              slug: 'free-plagiarism-checker-online',
              excerpt: 'HumanizeIt\'s free plagiarism checker scans your content against billions of web pages to detect copied text. Get an originality report in seconds. Try free now.',
              content: `
# Free Plagiarism Checker Online 2026 — Check Content Originality Instantly

Whether you are a student submitting an assignment, a blogger publishing new content, or a business protecting its brand reputation, originality matters. Plagiarized content damages credibility, triggers academic penalties, and tanks your Google rankings. HumanizeIt's free plagiarism checker gives you a detailed originality report in seconds — no account needed.

## What Is a Plagiarism Checker?

A plagiarism checker scans your text and compares it against a massive database of web pages, academic papers, articles, and published content to identify any matching or similar passages. The result is an originality score that shows you what percentage of your content is unique versus copied.

## Why You Need to Check for Plagiarism Before Publishing

Search engines, particularly Google, penalize duplicate content. If your article contains passages that closely match existing content online, your page may be ranked lower or removed from search results entirely.

For students, plagiarism in academic work can result in failing grades or expulsion. For businesses, publishing plagiarized content creates legal liability and destroys trust with their audience.

Running every piece of content through a plagiarism checker before publishing is one of the most important habits any writer, content creator, or student can develop.

## HumanizeIt Plagiarism Checker — Key Features

### Deep Web Scanning
HumanizeIt compares your text against billions of web pages, published articles, blog posts, and academic content sources to give you a comprehensive originality check.

### Instant Originality Score
You get a clear percentage score showing how much of your content is original and how much matches existing sources. Flagged passages are highlighted for easy review.

### Free for Up to 500 Words
Start checking your content for free with no credit card required. The Pro plan gives you access to higher word limits and full plagiarism reports.

### Works Alongside AI Humanizer
Use the plagiarism checker with HumanizeIt's AI Humanizer for a complete content quality workflow — humanize AI text, check for plagiarism, and publish with confidence.

### Fast and Private
Your content is never stored or shared. HumanizeIt processes your text securely and delivers results privately.

## How to Check Your Content for Plagiarism

1. Open HumanizeIt and go to the Plagiarism Checker tool
2. Paste or type your content into the text box
3. Click Check Plagiarism
4. Review your originality score and flagged passages
5. Edit or rewrite flagged sections and re-check

The entire process takes under a minute for most content.

## Check Your Content for Free Today

Do not publish until you are sure your content is 100% original. Use HumanizeIt's free plagiarism checker to protect your reputation, your grades, and your SEO rankings.

[Check for Plagiarism Free](https://humanize-it-nine.vercel.app)
`,
              created_at: '2026-03-15T10:00:00Z',
              author_name: 'HumanizeIt Team',
              category: 'Guides',
              image_url: 'https://picsum.photos/seed/plagiarism/1200/600'
            },
            'ai-image-detector-free': {
              id: '7',
              title: 'Free AI Image Detector 2026 — Find Out If an Image Was AI Generated',
              slug: 'ai-image-detector-free',
              excerpt: 'Use HumanizeIt\'s free AI image detector to instantly identify AI-generated images from Midjourney, DALL-E, Stable Diffusion & more. Fast, accurate, free to try.',
              content: `
# Free AI Image Detector 2026 — Find Out If an Image Was AI Generated

AI image generation has exploded in 2026. Tools like Midjourney, DALL-E 3, Stable Diffusion, and Adobe Firefly can create photorealistic images indistinguishable from real photographs — at least to the human eye. But HumanizeIt's free AI image detector can tell the difference instantly.

## Why Detecting AI Images Is Now Essential

Fake AI-generated images are being used to spread misinformation, fabricate news stories, deceive consumers, and manipulate social media audiences. Journalists, fact-checkers, brands, educators, and platform moderators all need a reliable way to verify whether an image is real or AI-generated.

At the same time, publishers and content platforms are introducing policies that require disclosure when AI-generated images are used. Knowing whether your visuals are AI-created is not just ethically important — it may soon be a legal requirement in many jurisdictions.

## How HumanizeIt's AI Image Detector Works

HumanizeIt's image detector analyzes visual patterns, pixel-level artifacts, texture inconsistencies, and metadata signals that AI image generators leave behind. These subtle digital fingerprints are invisible to the naked eye but detectable by our trained detection models.

The tool identifies images created by all major AI generation platforms including Midjourney, DALL-E, Stable Diffusion, Adobe Firefly, Bing Image Creator, and others.

## Key Features

### Accurate AI Image Detection
Our detection model is trained to identify AI-generated images with high confidence, flagging characteristic patterns from the most widely used image generation tools available in 2026.

### Fast Upload and Scan
Upload your image directly in your browser. Results appear in seconds with a clear AI probability score and detection confidence rating.

### Support for All Major Image Formats
HumanizeIt supports JPG, PNG, WEBP, and other common formats. No special file preparation required.

### Free to Start
The AI image detector is included in HumanizeIt's free plan. No account needed for basic use.

### Part of a Complete AI Content Toolkit
Pair the image detector with HumanizeIt's text-based AI detector, plagiarism checker, humanizer, and summarizer for complete content authenticity verification.

## Who Uses AI Image Detection?

- Journalists and fact-checkers verifying news images for authenticity
- Social media managers ensuring brand visuals are genuine
- E-commerce businesses checking supplier product images
- Educators confirming students are not using AI-generated images in submissions
- Legal and compliance teams documenting media authenticity

## Check Your Images for AI Now — Free

With AI image generation more realistic than ever, do not guess. Verify. HumanizeIt's AI image detector gives you the confidence to publish, share, and report with accuracy.

[Detect AI Images Free](https://humanize-it-nine.vercel.app)
`,
              created_at: '2026-03-15T10:00:00Z',
              author_name: 'HumanizeIt Team',
              category: 'Guides',
              image_url: 'https://picsum.photos/seed/image-detector/1200/600'
            },
            'free-ai-summarizer-tool': {
              id: '8',
              title: 'Free AI Summarizer Tool 2026 — Summarize Any Text in Seconds',
              slug: 'free-ai-summarizer-tool',
              excerpt: 'HumanizeIt\'s free AI summarizer condenses long articles, research papers, PDFs, and documents into clear, accurate summaries instantly. Save hours of reading time. Try free.',
              content: `
# Free AI Summarizer Tool 2026 — Summarize Any Text in Seconds

Reading long articles, research papers, reports, and documents takes time — time that most people simply do not have. HumanizeIt's free AI summarizer condenses any text into a clear, accurate summary in seconds, saving you hours of reading while keeping all the key information you need.

## What Is an AI Summarizer?

An AI summarizer uses natural language processing to analyze a piece of text and extract its most important ideas, arguments, and conclusions. The result is a shorter, condensed version that captures the essential meaning of the original content — without the filler, repetition, and background detail that bulk up most long-form writing.

Unlike simply skimming or copying key sentences, an AI summarizer understands context and produces a coherent, readable summary that flows naturally.

## Why Use HumanizeIt's AI Summarizer?

### Save Time on Research
Students, researchers, and professionals who regularly read lengthy papers and reports can cut their reading time by up to 80% using HumanizeIt's summarizer. Get the key takeaways from a 5,000-word paper in under 30 seconds.

### Understand Complex Content Faster
Long legal documents, technical reports, medical research, and financial filings are hard to read. HumanizeIt's summarizer breaks down complex content into plain, accessible language that anyone can understand.

### Summarize Any Content Type
Blog posts, news articles, research papers, meeting notes, emails, PDFs, academic journals — HumanizeIt's AI summarizer works across all content formats and subject areas.

### Control Summary Length
Choose how short or long you want your summary. HumanizeIt lets you adjust the output length so you get exactly the level of detail you need — from a one-paragraph overview to a comprehensive summary of key points.

### Free to Use
Up to 500 words of summarization per day is completely free. No sign-up required to get started.

### Integrated With All HumanizeIt Tools
After summarizing content, you can immediately run it through the AI detector or plagiarism checker within the same platform. HumanizeIt is your all-in-one AI writing toolkit.

## How to Summarize Text With HumanizeIt

1. Open HumanizeIt and go to the AI Summarizer tool
2. Paste your long article, paper, or document text
3. Choose your preferred summary length
4. Click Summarize
5. Copy your clean, accurate summary in seconds

## Who Benefits From An AI Summarizer?

- Students summarizing textbooks, papers, and lecture notes for exam preparation
- Researchers reviewing large volumes of academic literature quickly
- Journalists getting the key facts from long press releases and reports
- Business professionals summarizing meeting notes, contracts, and strategy documents
- Content creators researching topics without reading every source in full

## Start Summarizing for Free Today

Stop wasting hours reading content word by word. Let HumanizeIt's free AI summarizer extract what matters most so you can stay informed, work faster, and do more.

[Try the Free AI Summarizer](https://humanize-it-nine.vercel.app)
`,
              created_at: '2026-03-15T10:00:00Z',
              author_name: 'HumanizeIt Team',
              category: 'Guides',
              image_url: 'https://picsum.photos/seed/summarizer/1200/600'
            }
          };
        
        if (data) {
          setPost(data as Post);
        } else if (slug && mockPosts[slug]) {
          setPost(mockPosts[slug]);
        } else {
          navigate('/blog');
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
              <Markdown>{post.content}</Markdown>
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
