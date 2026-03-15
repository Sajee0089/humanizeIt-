import React from 'react';
import { motion } from 'motion/react';
import { SEO } from './SEO';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <SEO 
        title="Terms of Service | HumanizeIt"
        description="Read our terms of service to understand the rules and guidelines for using HumanizeIt."
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-white/5 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Terms of Service
        </motion.h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
          <p>Last Updated: March 15, 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using HumanizeIt, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Description of Service</h2>
            <p>HumanizeIt provides AI-powered writing assistance, including text humanization, detection, and summarization. Our tools are designed to assist in the writing process and should be used ethically.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Ethical Use</h2>
            <p>Users are responsible for ensuring their use of HumanizeIt complies with their institution's or employer's academic integrity policies. We do not condone or support plagiarism or academic dishonesty.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Payments and Refunds</h2>
            <p>Payments are processed securely via PayPal. We offer a 30-day money-back guarantee for our Pro and Unlimited plans if you are not satisfied with the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Limitation of Liability</h2>
            <p>HumanizeIt is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use our services.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
