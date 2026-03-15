import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import confetti from 'canvas-confetti';

export const PaymentVerifyPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!user) {
        setErrorMessage('You must be logged in to verify payment.');
        setStatus('error');
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      const plan = searchParams.get('plan');
      const billing = searchParams.get('billing');
      const paymentId = searchParams.get('paymentId') || searchParams.get('token'); // PayPal might pass paymentId or we use token

      if (!token || !plan || !billing) {
        setErrorMessage('Missing required payment information.');
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId,
            token,
            plan,
            billing,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Payment verification failed:', response.status, errorText);
          throw new Error(`Payment verification failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        if (response.ok && data.verified) {
          setStatus('success');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          setErrorMessage(data.error || 'Payment verification failed.');
          setStatus('error');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setErrorMessage('An unexpected error occurred during verification.');
        setStatus('error');
      }
    };

    verifyPayment();
  }, [location.search, navigate, user]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-200 dark:border-white/10"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#6C63FF] animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Please wait while we confirm your payment with PayPal...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Verified! ✅</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Your account has been upgraded successfully.
            </p>
            <p className="text-sm text-slate-400">
              Redirecting to your dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {errorMessage}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              If you paid, please wait 5 minutes and refresh. Contact support if the issue persists.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-3 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            >
              Return to Pricing
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
