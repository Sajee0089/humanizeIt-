import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { HumanizeTool } from './components/HumanizeTool';
import { AIDetector } from './components/AIDetector';
import { ImageDetector } from './components/ImageDetector';
import { PlagiarismChecker } from './components/PlagiarismChecker';
import { Summarizer } from './components/Summarizer';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Dashboard } from './components/Dashboard';
import { HistoryPage } from './components/HistoryPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { ToolTabs } from './components/ToolTabs';
import { HelmetProvider } from 'react-helmet-async';
import { ComparisonPage } from './components/Comparison';
import { ToolsSEORedirect } from './components/ToolsSEO';
import { SEO } from './components/SEO';
import { PricingPage } from './components/PricingPage';
import { PaymentVerifyPage } from './components/PaymentVerifyPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { RefundPage } from './components/RefundPage';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const isSummarizePage = location.pathname === '/summarize';

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {!isSummarizePage && <Navbar />}
      <main className={!isSummarizePage ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={
            <>
              <SEO 
                title="HumanizeIt — Free AI Humanizer | Turn AI Text Human Instantly"
                description="Free AI humanizer tool. Convert ChatGPT, Bard & AI text into natural human writing instantly. No signup needed. 500 words free daily."
                keywords="AI humanizer, humanize AI text, free AI humanizer, AI to human text, humanize ChatGPT text, bypass AI detection"
                ogTitle="HumanizeIt — #1 Free AI Humanizer"
                ogDescription="Turn any AI text into natural human writing in seconds. Free."
                jsonLd={[
                  {
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": "HumanizeIt",
                    "url": "https://humanize-it1.vercel.app",
                    "description": "Free AI text humanizer and writing toolkit",
                    "applicationCategory": "UtilitiesApplication",
                    "operatingSystem": "Web Browser",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "USD"
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": "4.9",
                      "ratingCount": "1247",
                      "bestRating": "5"
                    },
                    "featureList": [
                      "AI Text Humanizer",
                      "AI Content Detector", 
                      "AI Image Detector",
                      "Plagiarism Checker",
                      "AI Text Summarizer"
                    ]
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                      {
                        "@type": "Question",
                        "name": "What is an AI humanizer?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "An AI humanizer converts AI-generated text into natural human-sounding writing by varying sentence structure, adding contractions, and removing robotic patterns."
                        }
                      },
                      {
                        "@type": "Question", 
                        "name": "Is HumanizeIt free?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Yes, HumanizeIt is completely free with 500 words per day. No signup or credit card required."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "How does the AI detector work?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Our AI detector analyzes text patterns, sentence structure, and vocabulary to determine if content was written by AI or a human, showing results sentence by sentence."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "What AI detectors does it work against?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "HumanizeIt optimizes text to sound natural and human. It improves human score across various AI detection systems."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Can I use it for academic writing?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Yes, we have a dedicated Academic mode that rewrites text in scholarly natural language suitable for research papers and essays."
                        }
                      }
                    ]
                  }
                ]}
              />
              <LandingPage />
            </>
          } />
          <Route path="/humanize" element={
            <>
              <SEO 
                title="AI Text Humanizer — Free Online Tool | HumanizeIt"
                description="Humanize AI-generated text for free. Works with ChatGPT, Claude, Gemini output. 6 writing modes. Instant results. No signup required."
                canonical="https://humanize-it1.vercel.app/humanize"
              />
              <ToolTabs activeTab="humanize" />
              <HumanizeTool />
            </>
          } />
          <Route path="/detect" element={
            <>
              <SEO 
                title="Free AI Content Detector — Check If Text Is AI Written | HumanizeIt"
                description="Detect AI-generated content instantly. Check if text was written by ChatGPT, Claude or any AI. Free sentence-by-sentence analysis."
                canonical="https://humanize-it1.vercel.app/detect"
              />
              <ToolTabs activeTab="detect" />
              <AIDetector />
            </>
          } />
          <Route path="/image-detect" element={
            <>
              <SEO 
                title="AI Image Detector — Is It Real or AI Generated? | HumanizeIt"
                description="Detect AI-generated images instantly. Find out if any image was created by Midjourney, DALL-E, or Stable Diffusion. 100% free."
                canonical="https://humanize-it1.vercel.app/image-detect"
              />
              <ToolTabs activeTab="image-detect" />
              <ImageDetector />
            </>
          } />
          <Route path="/plagiarism" element={
            <>
              <SEO 
                title="Free Plagiarism Checker Online — Check Content Originality | HumanizeIt"
                description="Check your content for plagiarism free online. Get originality score instantly. No account needed. Works for essays, blogs and articles."
                canonical="https://humanize-it1.vercel.app/plagiarism"
              />
              <ToolTabs activeTab="plagiarism" />
              <PlagiarismChecker />
            </>
          } />
          <Route path="/summarize" element={
            <>
              <SEO 
                title="Free AI Text Summarizer Online — Summarize Any Text | HumanizeIt"
                description="Summarize any article, essay or document for free. Get bullet points or paragraph summaries instantly. No signup. Powered by AI."
                canonical="https://humanize-it1.vercel.app/summarize"
              />
              <ToolTabs activeTab="summarize" />
              <Summarizer />
            </>
          } />
          
          {/* SEO New Routes */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/:type/:slug" element={<ComparisonPage />} />
          <Route path="/tools/:tool" element={<ToolsSEORedirect />} />
          <Route path="/alternatives/:slug" element={<ComparisonPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment/verify" element={<PaymentVerifyPage />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
