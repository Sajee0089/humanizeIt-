import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Check, 
  X, 
  Zap, 
  Star, 
  Shield, 
  CreditCard, 
  Lock, 
  RefreshCw, 
  ArrowRight,
  Crown,
  Gem,
  Loader2
} from 'lucide-react';
import { SEO } from './SEO';

const PAYPAL_URLS = {
  PRO_MONTHLY: import.meta.env.VITE_PAYPAL_PRO_MONTHLY || 'https://www.paypal.com/ncp/payment/TBZRN3EDQJBDG', 
  PRO_YEARLY: import.meta.env.VITE_PAYPAL_PRO_YEARLY || 'https://www.paypal.com/ncp/payment/NESKD8CMBS92W',   
  UNLIMITED_MONTHLY: import.meta.env.VITE_PAYPAL_UNLIMITED_MONTHLY || 'https://www.paypal.com/ncp/payment/HWPKHYSGD52H4', 
  UNLIMITED_YEARLY: import.meta.env.VITE_PAYPAL_UNLIMITED_YEARLY || 'https://www.paypal.com/ncp/payment/YSSXFLLLHYEML',   
};

export const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpgrade = async (planName: string, url: string) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setIsUpgrading(true);
    try {
      const plan = planName.toLowerCase().includes('unlimited') ? 'unlimited' : 'pro';
      const billing = isYearly ? 'yearly' : 'monthly';
      const amount = plan === 'pro' ? (isYearly ? 79 : 9.99) : (isYearly ? 159 : 19.99);
      
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
      const redirectUrl = new URL(url);
      redirectUrl.searchParams.append('token', token);
      redirectUrl.searchParams.append('custom', token); // For IPN/Webhooks
      redirectUrl.searchParams.append('plan', plan);
      redirectUrl.searchParams.append('billing', billing);
      
      // Add return URL to PayPal
      const appUrl = window.location.origin;
      const redirect = localStorage.getItem('redirectAfterAuth');
      const returnUrl = `${appUrl}/payment/verify?token=${token}&plan=${plan}&billing=${billing}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`;
      redirectUrl.searchParams.append('return', returnUrl);

      window.location.href = redirectUrl.toString();
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      // Log the full error object to the console
      console.dir(error); 
      alert(`There was an error initiating your payment: ${error.message || JSON.stringify(error) || 'Please try again.'}`);
      setIsUpgrading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      badge: "Get Started",
      price: "$0",
      period: "/forever",
      description: "Perfect for testing the waters",
      color: "slate",
      features: [
        { text: "500 words per day", included: true },
        { text: "AI Humanizer (Standard mode)", included: true },
        { text: "AI Detector (500 words)", included: true },
        { text: "AI Summarizer (500 words)", included: true },
        { text: "Plagiarism Checker (500 words)", included: true },
        { text: "Image Detector", included: false },
        { text: "Advanced modes", included: false },
        { text: "History saving", included: false },
        { text: "Priority processing", included: false },
      ],
      buttonText: "Start Free",
      buttonLink: "/humanize",
      isExternal: false,
    },
    {
      name: "Pro",
      badge: "⭐ Most Popular",
      price: isYearly ? "$79" : "$9.99",
      period: isYearly ? "/year" : "/month",
      savings: isYearly ? "Save $40/year" : null,
      description: "For creators and professionals",
      color: "purple",
      highlight: true,
      features: [
        { text: "10,000 words per day", included: true },
        { text: "All 5 AI tools", included: true },
        { text: "All 6 humanizer modes", included: true },
        { text: "AI Image Detector", included: true },
        { text: "History saved (30 days)", included: true },
        { text: "Priority processing", included: true },
        { text: "No ads", included: true },
        { text: "Unlimited words", included: false },
        { text: "API access", included: false },
        { text: "Brand voice saving", included: false },
      ],
      buttonText: "Get Pro Now →",
      buttonLink: isYearly ? PAYPAL_URLS.PRO_YEARLY : PAYPAL_URLS.PRO_MONTHLY,
      isExternal: true,
    },
    {
      name: "Unlimited",
      badge: "💎 Best Value",
      price: isYearly ? "$159" : "$19.99",
      period: isYearly ? "/year" : "/month",
      savings: isYearly ? "Save $81/year" : null,
      description: "Ultimate power for power users",
      color: "dark",
      features: [
        { text: "Unlimited words per day", included: true },
        { text: "All 5 AI tools unlimited", included: true },
        { text: "All 6 humanizer modes", included: true },
        { text: "Paragraph by paragraph mode", included: true },
        { text: "Unlimited history", included: true },
        { text: "Priority processing", included: true },
        { text: "No ads", included: true },
        { text: "API access (100 calls/day)", included: true },
        { text: "Brand voice saving", included: true },
        { text: "Email support", included: true },
      ],
      buttonText: "Go Unlimited →",
      buttonLink: isYearly ? PAYPAL_URLS.UNLIMITED_YEARLY : PAYPAL_URLS.UNLIMITED_MONTHLY,
      isExternal: true,
    }
  ];

  const comparisonData = [
    { feature: "Words per day", free: "500", pro: "10K", unlimited: "Unlimited" },
    { feature: "AI Humanizer", free: true, pro: true, unlimited: true },
    { feature: "AI Detector", free: true, pro: true, unlimited: true },
    { feature: "Summarizer", free: true, pro: true, unlimited: true },
    { feature: "Image Detector", free: false, pro: true, unlimited: true },
    { feature: "Plagiarism Check", free: true, pro: true, unlimited: true },
    { feature: "History", free: false, pro: "30d", unlimited: "Unlimited" },
    { feature: "Adv. Modes", free: false, pro: true, unlimited: true },
    { feature: "Priority Speed", free: false, pro: true, unlimited: true },
    { feature: "API Access", free: false, pro: false, unlimited: true },
    { feature: "Brand Voice", free: false, pro: false, unlimited: true },
    { feature: "Support", free: false, pro: "Email", unlimited: "Priority" },
  ];

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>, link: string, isExternal: boolean, planName: string) => {
    if (!user) {
      e.preventDefault();
      navigate('/signup');
      return;
    }

    if (isExternal) {
      handleUpgrade(planName, link);
    } else {
      const redirect = localStorage.getItem('redirectAfterAuth');
      if (redirect) {
        localStorage.removeItem('redirectAfterAuth');
        navigate(redirect);
      } else {
        navigate(link);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-20 px-4">
      <SEO 
        title="Pricing — Choose Your Plan | HumanizeIt"
        description="Affordable pricing for the best AI humanizer and writing tools. Choose from Free, Pro, or Unlimited plans."
        canonical="https://humanize-it1.vercel.app/pricing"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-lg mb-10"
          >
            Choose the plan that fits your needs. Scale as you grow.
          </motion.p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-slate-200 dark:bg-white/10 rounded-full p-1 transition-colors"
            >
              <div className={`w-5 h-5 bg-white dark:bg-primary rounded-full shadow-sm transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Yearly</span>
              <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                🏷️ Save 34%
              </span>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border-2 transition-all duration-300 ${
                plan.highlight 
                ? 'border-[#6C63FF] scale-105 z-10 shadow-[#6C63FF]/10' 
                : 'border-slate-100 dark:border-white/5'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg ${
                  plan.color === 'purple' ? 'bg-[#6C63FF] text-white' : 
                  plan.color === 'dark' ? 'bg-amber-400 text-black' : 
                  'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="mt-2 inline-block bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-lg">
                    {plan.savings}
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <Check className={`w-5 h-5 shrink-0 ${plan.color === 'purple' ? 'text-[#6C63FF]' : 'text-emerald-500'}`} />
                    ) : (
                      <X className="w-5 h-5 shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                    <span className={feature.included ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => handleAction(e, plan.buttonLink, plan.isExternal, plan.name)}
                disabled={isUpgrading && plan.isExternal}
                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.highlight 
                  ? 'bg-[#6C63FF] text-white hover:bg-[#5a52e6] shadow-lg shadow-[#6C63FF]/30' 
                  : plan.color === 'dark' 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'
                }`}
              >
                {isUpgrading && plan.isExternal ? <Loader2 className="w-5 h-5 animate-spin" /> : plan.buttonText}
              </button>

              {plan.isExternal && (
                <div className="mt-4 flex flex-col items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Secure payment via PayPal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>30-day money back guarantee</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Features</h2>
          <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5">
                    <th className="p-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Feature</th>
                    <th className="p-6 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Free</th>
                    <th className="p-6 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Pro</th>
                    <th className="p-6 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Unlimited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-6 font-medium text-slate-700 dark:text-slate-300">{row.feature}</td>
                      <td className="p-6 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : <span className="text-sm font-bold">{row.free}</span>}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <Check className="w-5 h-5 text-[#6C63FF] mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : <span className="text-sm font-bold">{row.pro}</span>}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.unlimited === 'boolean' ? (
                          row.unlimited ? <Check className="w-5 h-5 text-amber-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : <span className="text-sm font-bold">{row.unlimited}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-bold">Secure Payment via Gumroad</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-bold">Visa Mastercard PayPal</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-bold">Cancel anytime</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-bold">Instant access after payment</span>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-white/10">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold">Trusted by 10,000+ users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
