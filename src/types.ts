export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  plan: 'free' | 'pro' | 'unlimited';
  words_limit: number;
  plan_expires: string | null;
  paypal_transaction_id: string | null;
};

export type Usage = {
  id: string;
  user_id: string;
  date: string;
  words_used: number;
  texts_count: number;
};

export type Humanization = {
  id: string;
  user_id: string;
  original_text: string;
  humanized_text: string;
  mode: string;
  word_count: number;
  created_at: string;
};

export type Waitlist = {
  id: string;
  email: string;
  created_at: string;
};

export type Summary = {
  id: string;
  user_id: string;
  original_text: string;
  summary_text: string;
  mode: 'paragraph' | 'bullets';
  length_setting: 'short' | 'medium' | 'long';
  original_word_count: number;
  summary_word_count: number;
  keywords: string | null;
  created_at: string;
};

export type PendingPayment = {
  id: string;
  user_id: string;
  user_email: string;
  plan: 'pro' | 'unlimited';
  billing: 'monthly' | 'yearly';
  amount: number;
  token: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  expires_at: string;
  paypal_payment_id?: string;
};
