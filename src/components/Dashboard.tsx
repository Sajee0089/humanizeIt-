import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  History, 
  Settings, 
  User, 
  TrendingUp, 
  Clock,
  FileText,
  ExternalLink,
  Star,
  Zap,
  CheckCircle2,
  Circle,
  Plus,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    wordsToday: 0,
    totalTexts: 0,
    totalWords: 0
  });
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      if (!user) return;
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Tasks fetch error:', error);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user) return;

    try {
      const newTask = {
        user_id: user.id,
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
        completed: false,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();
      
      if (error) throw error;
      
      setTasks([data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!user) return;

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch stats
      const today = new Date().toISOString().split('T')[0];
      
      const { data: usageData, error: usageError } = await supabase
        .from('usage')
        .select('words_used')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (usageError) throw usageError;
      
      let wordsToday = 0;
      if (usageData) {
        wordsToday = usageData.words_used || 0;
      }

      const { data: totalData, error: totalError } = await supabase
        .from('humanizations')
        .select('word_count')
        .eq('user_id', user.id);
      
      if (totalError) throw totalError;
      
      let totalWords = 0;
      totalData?.forEach(item => {
        totalWords += item.word_count || 0;
      });

      setStats({
        wordsToday,
        totalTexts: totalData?.length || 0,
        totalWords
      });

      // Fetch history
      const { data: historyData, error: historyError } = await supabase
        .from('humanizations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (historyError) throw historyError;
      setHistory(historyData || []);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Words Used Today",
      value: stats.wordsToday,
      limit: 500,
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      color: "bg-primary/10"
    },
    {
      label: "Total Texts",
      value: stats.totalTexts,
      icon: <FileText className="w-5 h-5 text-accent" />,
      color: "bg-accent/10"
    },
    {
      label: "Total Words",
      value: stats.totalWords,
      icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-500/10"
    }
  ];

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}</h1>
        <p className="text-slate-500">Manage your humanization usage and history.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              {stat.limit && (
                <span className="text-xs font-medium text-slate-500">
                  {Math.round((stat.value / stat.limit) * 100)}% of limit
                </span>
              )}
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
            
            {stat.limit && (
              <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min(100, (stat.value / stat.limit) * 100)}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Recent Humanizations
              </h2>
              <Link to="/history" className="text-xs text-primary font-bold hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Mode</th>
                    <th className="px-6 py-4">Words</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-6 py-4 bg-slate-50/50 dark:bg-white/5 h-12" />
                      </tr>
                    ))
                  ) : history.length > 0 ? (
                    history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">
                            {item.mode}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{item.word_count}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No history found. Start humanizing!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Plan Card */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> Your Plan
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Current Plan:</span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  profile?.plan === 'unlimited' ? 'bg-amber-100 text-amber-600' :
                  profile?.plan === 'pro' ? 'bg-purple-100 text-purple-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {profile?.plan === 'unlimited' ? '💎 UNLIMITED' :
                   profile?.plan === 'pro' ? '⭐ PRO' : 'FREE'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Words today:</span>
                  <span className="font-bold">{stats.wordsToday.toLocaleString()} / {(profile?.words_limit || 500).toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${profile?.plan === 'unlimited' ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${Math.min(100, (stats.wordsToday / (profile?.words_limit || 500)) * 100)}%` }}
                  />
                </div>
              </div>
              {profile?.plan_expires && (
                <div className="text-[10px] text-slate-400">
                  Renews: {new Date(profile.plan_expires).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-2 pt-2">
                {profile?.plan !== 'unlimited' && (
                  <Link
                    to="/pricing"
                    className="w-full py-2.5 text-center text-xs font-bold bg-primary text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Upgrade to Unlimited
                  </Link>
                )}
                {profile?.plan !== 'free' && (
                  <a 
                    href="mailto:support@humanizelt.com?subject=Manage Subscription"
                    className="w-full py-2.5 block text-center text-xs font-bold border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Contact Support
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" /> Account Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                <div className="w-10 h-10 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-bold">{profile?.full_name || user?.email?.split('@')[0] || 'User'}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>
              
              <button className="w-full py-3 text-sm font-medium border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                Edit Profile
              </button>
              <button className="w-full py-3 text-sm font-medium border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Pro Tip
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Use "Academic" mode for essays and "Aggressive" mode to bypass the toughest AI detectors.
            </p>
          </div>

          {/* Tasks Section */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> Your Tasks
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="p-2 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </form>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        task.completed 
                          ? 'bg-slate-50 dark:bg-white/5 border-transparent opacity-60' 
                          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleTask(task.id, task.completed)}
                          className={`text-slate-400 hover:text-primary transition-colors ${task.completed ? 'text-primary' : ''}`}
                        >
                          {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <span className={`text-sm ${task.completed ? 'line-through text-slate-500' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                          task.priority === 'high' ? 'bg-red-100 text-red-600' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {task.priority}
                        </span>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No tasks yet. Add one above!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
