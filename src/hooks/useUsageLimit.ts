import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export const useUsageLimit = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [wordsToday, setWordsToday] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeType, setUpgradeType] = useState<'limit' | 'feature'>('limit');

  useEffect(() => {
    if (user) {
      fetchUsage();
    }
  }, [user]);

  const fetchUsage = async () => {
    try {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('usage')
        .select('words_used')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setWordsToday(data.words_used || 0);
      } else {
        setWordsToday(0);
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    }
  };

  const checkLimit = (wordCount: number) => {
    const currentLimit = profile?.words_limit || 500;
    if (wordsToday + wordCount > currentLimit) {
      setUpgradeType('limit');
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const checkFeature = (featureName: string) => {
    if (profile?.plan === 'free') {
      setUpgradeType('feature');
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const updateUsage = async (wordCount: number) => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingUsage, error: fetchError } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingUsage) {
        const { error: updateError } = await supabase
          .from('usage')
          .update({
            words_used: existingUsage.words_used + wordCount,
            texts_count: existingUsage.texts_count + 1
          })
          .eq('id', existingUsage.id);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('usage')
          .insert({
            user_id: user.id,
            date: today,
            words_used: wordCount,
            texts_count: 1
          });
        
        if (insertError) throw insertError;
      }
      await fetchUsage();
      await refreshProfile();
    } catch (err) {
      console.error("Failed to update usage:", err);
    }
  };

  return {
    wordsToday,
    currentLimit: profile?.words_limit || 500,
    showUpgradeModal,
    setShowUpgradeModal,
    upgradeType,
    checkLimit,
    checkFeature,
    updateUsage
  };
};
