
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Zap, Loader2, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Verification email sent! Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen tosca-gradient flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-8 mx-auto font-bold transition-colors">
            <Zap size={20} /> ZieAds
          </button>
          <h1 className="text-3xl font-black text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Get Started Free'}
          </h1>
          <p className="text-teal-50">
            {isLogin ? 'Log in to manage your campaigns' : 'Create your account and launch ads in minutes'}
          </p>
        </div>

        <div className="glass-card rounded-[32px] p-8 shadow-2xl overflow-hidden relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 tosca-bg text-white font-black rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login to Dashboard' : 'Create My Account')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 tosca-text font-black hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
