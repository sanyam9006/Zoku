'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Eye, EyeOff, Mail, Lock, User, MapPin, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const CITIES = ['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'];

export default function SignupPage() {
  const router = useRouter();

  
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '', role: 'user' });

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured on Vercel yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel Project Settings.');
      setLoading(false);
      return;
    }

    // Validation
    if (!form.name || form.name.length < 2) {
      setError('Name is too short');
      setLoading(false);
      return;
    }
    if (!form.city) {
      setError('Please select a city');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
            city: form.city,
            role: form.role,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        if (authData.session) {
          router.push('/onboarding');
        } else {
          setSuccessMessage('🎉 Account created successfully! If email confirmation is enabled on your Supabase project, check your inbox to confirm, or click Login below.');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up. Please verify your internet connection.');
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured on Vercel yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.');
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

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
      <div className="orb w-72 h-72 bg-cyan top-10 left-10" />
      <div className="orb w-64 h-64 bg-green bottom-10 right-10" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple-DEFAULT transition-colors mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="glow-card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan to-purple-DEFAULT flex items-center justify-center text-white font-black text-2xl shadow-neon-cyan mx-auto mb-4">
              族
            </div>
            <h1 className="text-2xl font-black text-zoku-text mb-1">Join ZOKU</h1>
            <p className="text-muted text-sm">Find your tribe in every city</p>
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

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green/10 border border-green/20 text-green text-xs font-semibold">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Google OAuth */}
          <button 
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-zoku-card border border-zoku-border text-zoku-text text-sm font-medium hover:bg-zoku-card2 transition-all mb-6 disabled:opacity-50"
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
            <span className="text-xs text-muted">or</span>
            <div className="flex-1 h-px bg-zoku-border" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Your name" 
                  className="input-dark !pl-10" 
                  value={form.name} 
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="input-dark !pl-10" 
                  value={form.email} 
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  className="input-dark !pl-10 !pr-10" 
                  value={form.password} 
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-zoku-text">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Your City</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10" />
                <select 
                  className="input-dark !pl-10 appearance-none text-zoku-text" 
                  value={form.city} 
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                >
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-2 block">I am a...</label>
              <div className="flex gap-2">
                {[
                  { value: 'user', label: '🎓 Student / Pro' },
                  { value: 'owner', label: '🏠 Listing Owner' },
                  { value: 'organizer', label: '🎉 Organizer' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    disabled={loading}
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`flex-1 py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                      form.role === r.value ? 'bg-purple-DEFAULT/20 border-purple-DEFAULT text-purple-DEFAULT' : 'border-zoku-border text-muted hover:border-purple-DEFAULT/40'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full !py-3 !rounded-xl !text-base flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already on ZOKU?{' '}
            <Link href="/login" className="text-purple-DEFAULT font-semibold hover:text-purple-light transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
