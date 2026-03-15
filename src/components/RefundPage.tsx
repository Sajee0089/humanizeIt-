import React from 'react';
import { motion } from 'motion/react';
import { SEO } from './SEO';

export const RefundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <SEO 
        title="Refund Policy | HumanizeIt"
        description="Understand our 30-day money-back guarantee and refund process."
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-white/5 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Refund Policy
        </motion.h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
          <p>Last Updated: March 15, 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">30-Day Money-Back Guarantee</h2>
            <p>At HumanizeIt, we want you to be completely satisfied with our service. If you are not happy with your Pro or Unlimited subscription for any reason, you are eligible for a full refund within 30 days of your initial purchase.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">How to Request a Refund</h2>
            <p>To request a refund, please email us at support@humanize-it.com with your account email and the transaction ID from your PayPal receipt. We process most refund requests within 2-3 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Exceptions</h2>
            <p>Refunds are only available for the initial purchase of a subscription. Renewal payments are not eligible for refunds unless required by local law. If you have used more than 50% of your monthly word limit, we reserve the right to deny the refund request.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Cancellation</h2>
            <p>You can cancel your subscription at any time through your PayPal account or by contacting our support. After cancellation, you will continue to have access to your plan features until the end of your current billing period.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
