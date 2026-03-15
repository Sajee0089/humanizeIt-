-- SUPABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  words_limit INTEGER DEFAULT 1000,
  plan_expires TIMESTAMPTZ,
  paypal_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create USAGE table
CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  words_used INTEGER DEFAULT 0,
  texts_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- 4. Create HUMANIZATIONS table
CREATE TABLE IF NOT EXISTS humanizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  humanized_text TEXT NOT NULL,
  mode TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  feedback TEXT, -- 'up' or 'down'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create PENDING_PAYMENTS table
CREATE TABLE IF NOT EXISTS pending_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  plan TEXT NOT NULL,
  billing TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  paypal_payment_id TEXT
);

-- 6. Create TASKS table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create WAITLIST table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create POSTS table (for Blog)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  author_name TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE humanizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS Policies

-- PROFILES: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "System can insert profiles" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- USAGE: Users can read/update their own usage
CREATE POLICY "Users can view own usage" ON usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON usage FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- HUMANIZATIONS: Users can read/insert their own history
CREATE POLICY "Users can view own history" ON humanizations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON humanizations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON humanizations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- PENDING_PAYMENTS: Users can insert/read their own payments
CREATE POLICY "Users can insert own pending payments" ON pending_payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own pending payments" ON pending_payments FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- TASKS: Users can manage their own tasks
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL TO authenticated USING (auth.uid() = user_id);

-- WAITLIST: Anyone can join waitlist
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);

-- POSTS: Everyone can read posts
CREATE POLICY "Everyone can read posts" ON posts FOR SELECT TO anon, authenticated USING (true);

-- 11. Create a trigger to automatically create a profile on signup (Optional but recommended)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, email, full_name, plan, words_limit)
--   VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'free', 1000);
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
