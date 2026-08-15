'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '' });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('Supabase credentials missing. Please check your Vercel Environment Variables.');
      return;
    }

    if (!form.email || !form.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed') || (error as any).code === 'email_not_confirmed') {
          setError('Email not confirmed yet. Please verify your email via the confirmation link, or use the 1-Click Demo accounts below.');
        } else if (error.message.toLowerCase().includes('invalid login credentials')) {
          setError('Invalid email or password. Please double check or use a 1-Click Demo account.');
        } else {
          setError(error.message);
        }
        setLoading(false);
      } else if (data.session) {
        // Fetch user role to direct to correct page
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        const role = profile?.role || data.user.user_metadata?.role || 'user';
        const dest = role === 'admin' ? '/admin' : role === 'owner' ? '/dashboard' : '/profile';
        window.location.href = dest;
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please verify your internet connection.');
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured on Vercel yet.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const fillAndSubmit = async (demoEmail: string, roleName: string, destUrl: string) => {
    setError(null);
    setForm({ email: demoEmail, password: 'Password123!' });
    setActiveRole(roleName);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: 'Password123!',
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        setActiveRole(null);
      } else if (data.session) {
        window.location.href = destUrl;
      }
    } catch (err: any) {
      setError(err?.message || 'Sign in failed');
      setLoading(false);
      setActiveRole(null);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
      {/* Orbs */}
      <div className="orb w-72 h-72 bg-purple-DEFAULT top-10 right-10" />
      <div className="orb w-64 h-64 bg-pink bottom-10 left-10" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple-DEFAULT transition-colors mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        {/* Card */}
        <div className="glow-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div 
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-purple-DEFAULT/30 mx-auto mb-4"
            >
              族
            </div>
            <h1 className="text-2xl font-black text-zoku-text mb-1">Welcome Back</h1>
            <p className="text-muted text-sm">Sign in to your ZOKU account</p>
          </div>

          {/* Missing Supabase Config Notice on Vercel */}
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 rounded-2xl bg-amber/15 border border-amber/30 text-amber text-xs leading-relaxed">
              <p className="font-bold flex items-center gap-1.5 mb-1.5 text-zoku-text">
                <AlertCircle size={15} className="text-amber" />
                Vercel Setup Required
              </p>
              <p className="text-muted mb-2">To connect live Auth & Database, add these 2 variables in <strong>Vercel Settings → Environment Variables</strong>:</p>
              <div className="p-2.5 bg-black/5 rounded-xl font-mono text-[11px] text-zoku-text space-y-1">
                <div className="font-semibold text-purple-DEFAULT">NEXT_PUBLIC_SUPABASE_URL</div>
                <div className="font-semibold text-purple-DEFAULT">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
              ⚠️ {error}
            </div>
          )}

          {/* 1-Click Instant Demo Login */}
          <div className="mb-6 p-4 rounded-2xl bg-zoku-card2 border border-zoku-border shadow-sm">
            <p className="text-center text-[10px] font-black text-muted uppercase tracking-wider mb-2.5">
              ⚡ Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillAndSubmit('admin@zoku.app', 'admin', '/admin')}
                disabled={loading}
                className="p-3 rounded-xl border border-amber/40 bg-amber/10 text-amber hover:bg-amber/20 hover:scale-[1.02] transition-all text-xs font-bold flex flex-col items-center gap-1.5 text-center active:scale-95 disabled:opacity-50 shadow-sm"
              >
                <span className="text-base">🛡️</span>
                <span className="text-xs font-black">{activeRole === 'admin' ? 'Logging in...' : 'Admin'}</span>
              </button>
              <button
                type="button"
                onClick={() => fillAndSubmit('owner@zoku.app', 'owner', '/dashboard')}
                disabled={loading}
                className="p-3 rounded-xl border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20 hover:scale-[1.02] transition-all text-xs font-bold flex flex-col items-center gap-1.5 text-center active:scale-95 disabled:opacity-50 shadow-sm"
              >
                <span className="text-base">🏠</span>
                <span className="text-xs font-black">{activeRole === 'owner' ? 'Logging in...' : 'Owner'}</span>
              </button>
              <button
                type="button"
                onClick={() => fillAndSubmit('demo@zoku.app', 'demo', '/profile')}
                disabled={loading}
                className="p-3 rounded-xl border border-purple-DEFAULT/40 bg-purple-DEFAULT/10 text-purple-DEFAULT hover:bg-purple-DEFAULT/20 hover:scale-[1.02] transition-all text-xs font-bold flex flex-col items-center gap-1.5 text-center active:scale-95 disabled:opacity-50 shadow-sm"
              >
                <span className="text-base">👤</span>
                <span className="text-xs font-black">{activeRole === 'demo' ? 'Logging in...' : 'User'}</span>
              </button>
            </div>
          </div>

          {/* Google OAuth */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-zoku-card border border-zoku-border text-zoku-text text-sm font-medium hover:bg-zoku-card2 transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-zoku-border" />
            <span className="text-xs text-muted font-medium">or login with credentials</span>
            <div className="flex-1 h-px bg-zoku-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} noValidate className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zoku-text mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-dark !pl-10 text-sm font-medium"
                  value={form.email}
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zoku-text mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-dark !pl-10 !pr-10 text-sm font-medium"
                  value={form.password}
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-zoku-text p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full !py-3.5 !rounded-xl !text-base font-bold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            New to ZOKU?{' '}
            <Link href="/signup" className="text-purple-DEFAULT font-bold hover:underline transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
