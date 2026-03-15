import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Lock, 
  Star, 
  Check, 
  X, 
  Zap, 
  Shield, 
  Sparkles,
  Crown,
  Loader2
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'limit' | 'feature';
  featureName?: string;
  currentUsage?: number;
  limit?: number;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  featureName, 
  currentUsage, 
  limit 
}) => {
  const { user } = useAuth();
  const PAYPAL_PRO_MONTHLY = import.meta.env.VITE_PAYPAL_PRO_MONTHLY || 'https://www.paypal.com/ncp/payment/TBZRN3EDQJBDG';
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgradeClick = async () => {
    if (!user) return;
    
    setIsUpgrading(true);
    try {
      const plan = 'pro';
      const billing = 'monthly';
      const amount = 9.99;
      
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const paymentId = crypto.randomUUID();
      
      const { error: paymentError } = await supabase
        .from('pending_payments')
        .insert({
          id: paymentId,
          user_id: user.id,
          user_email: user.email || 'no-email@example.com',
          plan: plan,
          billing: billing,
          amount: amount,
          token: token,
          status: 'pending',
          created_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        });

      if (paymentError) {
        console.error("Supabase payment insert error:", paymentError);
        throw new Error(`Database error: ${paymentError.message}`);
      }

      // Redirect to PayPal with token
      const redirectUrl = new URL(PAYPAL_PRO_MONTHLY);
      redirectUrl.searchParams.append('token', token);
      redirectUrl.searchParams.append('custom', token); // For IPN/Webhooks
      redirectUrl.searchParams.append('plan', plan);
      redirectUrl.searchParams.append('billing', billing);
      
      const appUrl = import.meta.env.VITE_APP_URL || 'https://humanize-it1.vercel.app';
      const returnUrl = `${appUrl}/payment/verify?token=${token}&plan=${plan}&billing=${billing}`;
      redirectUrl.searchParams.append('return', returnUrl);

      window.location.href = redirectUrl.toString();
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      alert(`There was an error initiating your payment: ${error.message || 'Please try again.'}`);
      setIsUpgrading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-dark-bg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
          >
            {/* Header Decoration */}
            <div className="h-2 bg-gradient-to-r from-primary to-accent" />
            
            <div className="p-8">
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      type === 'limit' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {type === 'limit' ? <Lock className="w-6 h-6" /> : <Crown className="w-6 h-6" />}
                    </div>
                    <button 
                      onClick={handleClose}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">
                    {type === 'limit' ? 'Daily Limit Reached' : 'Pro Feature'}
                  </h2>
                  
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    {type === 'limit' ? (
                      <>You've used <span className="font-bold text-slate-900 dark:text-white">{currentUsage}/{limit}</span> words today on the free plan. Upgrade to Pro for 10,000 words/day!</>
                    ) : (
                      <><span className="font-bold text-slate-900 dark:text-white">{featureName}</span> is available on Pro plan. Upgrade to unlock all advanced tools.</>
                    )}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span>{type === 'limit' ? '10,000 words/day' : 'Image Detector'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span>All 5 AI tools & 6 humanizer modes</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span>Priority processing & No ads</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleUpgradeClick}
                      disabled={isUpgrading}
                      className="w-full py-4 bg-[#6C63FF] text-white rounded-2xl font-bold hover:bg-[#5a52e6] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6C63FF]/20 disabled:opacity-70"
                    >
                      {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          <Star className="w-5 h-5 fill-current" />
                          {type === 'limit' ? 'Upgrade to Pro $9.99' : 'Get Pro — $9.99/mo'}
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full py-4 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all"
                    >
                      {type === 'limit' ? 'Continue Tomorrow Free' : 'Maybe Later'}
                    </button>
                  </div>
                </>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
