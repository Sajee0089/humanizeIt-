import React from 'react';
import { motion } from 'motion/react';
import { SEO } from './SEO';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <SEO 
        title="Privacy Policy | HumanizeIt"
        description="Learn how we protect your data and privacy at HumanizeIt."
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-white/5 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Privacy Policy
        </motion.h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
          <p>Last Updated: March 15, 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, use our tools, or contact support. This includes your email address, name, and the text you process through our tools.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to provide, maintain, and improve our services, process payments, and communicate with you. Your text is processed by Google Gemini AI to provide the requested services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Data Retention</h2>
            <p>We store your humanization and summarization history to allow you to access it later. You can delete your history or your entire account at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Third-Party Services</h2>
            <p>We use Supabase for database and authentication, PayPal for payment processing, and Google Gemini for AI processing. Each of these services has its own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Security</h2>
            <p>We take reasonable measures to protect your information from unauthorized access, loss, or misuse. However, no internet transmission is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@humanize-it.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
