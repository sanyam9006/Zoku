'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Menu, X, ChevronDown, Shield, LayoutDashboard, MessageSquare, User, LogOut } from 'lucide-react';
import { useCity } from '@/context/CityContext';
import { supabase } from '@/lib/supabase/client';

const CITIES = ['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'];

const NAV_LINKS = [
  { href: '/hostels', label: 'Hostels' },
  { href: '/gyms', label: 'Gyms' },
  { href: '/sports', label: 'Sports' },
  { href: '/events', label: 'Events' },
  { href: '/community', label: 'Community' },
];

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { city: selectedCity, setCity: setSelectedCity } = useCity();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, role, avatar_url, city')
          .eq('id', user.id)
          .maybeSingle();

        setUserProfile(profile || { full_name: user.user_metadata?.full_name || 'User', role: user.user_metadata?.role || 'user' });
      } else {
        setUserProfile(null);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, role, avatar_url, city')
          .eq('id', session.user.id)
          .maybeSingle();
        setUserProfile(profile || { full_name: session.user.user_metadata?.full_name || 'User', role: session.user.user_metadata?.role || 'user' });
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}&city=${selectedCity}`);
      setMobileOpen(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityOpen(false);
    if (pathname === '/explore') {
      router.push(`/explore?q=${searchQuery}&city=${city}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserProfile(null);
    setUserDropdownOpen(false);
    setMobileOpen(false);
    router.push('/');
    router.refresh();
  };

  const isAdmin = userProfile?.role === 'admin';
  const isOwner = userProfile?.role === 'owner' || isAdmin;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-zoku-border py-3 shadow-sm' : 'py-5 bg-zoku-bg/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-DEFAULT via-purple-dark to-pink flex items-center justify-center text-white font-black text-lg shadow-neon-purple group-hover:scale-105 transition-transform">
                族
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-widest text-zoku-text leading-none group-hover:text-purple-DEFAULT transition-colors">
                  ZOKU
                </span>
                <span className="text-[9px] font-bold text-muted tracking-tighter uppercase">Find Your Tribe</span>
              </div>
            </Link>

            {/* City Selector */}
            <div className="relative hidden md:flex">
              <button
                onClick={() => setCityOpen(!cityOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-zoku-card border border-zoku-border text-sm font-bold text-zoku-text hover:border-purple-DEFAULT hover:shadow-sm transition-all active:scale-95"
              >
                <div className="w-5 h-5 rounded-lg bg-purple-DEFAULT/10 flex items-center justify-center text-purple-DEFAULT">
                  <MapPin size={13} />
                </div>
                {selectedCity}
                <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${cityOpen ? 'rotate-180' : ''}`} />
              </button>
              {cityOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCityOpen(false)} />
                  <div className="absolute top-full mt-3 left-0 bg-zoku-card border border-zoku-border rounded-[2rem] overflow-hidden shadow-2xl z-50 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-300 p-2">
                    <div className="px-3 py-2 text-[10px] font-black text-muted uppercase tracking-widest border-b border-zoku-border mb-1">Select City</div>
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all ${
                          city === selectedCity 
                            ? 'bg-purple-DEFAULT/10 text-purple-DEFAULT font-black' 
                            : 'text-zoku-text hover:bg-zoku-bg hover:text-purple-DEFAULT'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {city === 'Bangalore' ? '🌳' : city === 'Mumbai' ? '🌊' : city === 'Delhi' ? '🏛️' : city === 'Pune' ? '⛰️' : city === 'Hyderabad' ? '🏰' : '🏙️'}
                          {city}
                        </span>
                        {city === selectedCity && <div className="w-1.5 h-1.5 rounded-full bg-purple-DEFAULT shadow-neon-purple" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs items-center gap-2 bg-zoku-card border border-zoku-border rounded-xl px-3 py-2 hover:border-purple-DEFAULT transition-all group">
              <Search size={16} className="text-muted group-hover:text-purple-DEFAULT transition-colors shrink-0" />
              <input
                placeholder="Search hostels, gyms, events..."
                className="bg-transparent text-sm text-zoku-text placeholder-muted outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="hidden" />
            </form>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? 'bg-purple-DEFAULT/10 text-purple-DEFAULT'
                      : 'text-muted hover:text-zoku-text hover:bg-zoku-card2'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth / User Actions */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {/* Messages / Inbox Link */}
                  <Link
                    href="/inbox"
                    className={`p-2.5 rounded-xl border transition-all ${
                      pathname.startsWith('/inbox')
                        ? 'bg-purple-DEFAULT text-white border-purple-DEFAULT shadow-sm'
                        : 'bg-zoku-card border-zoku-border text-muted hover:text-zoku-text hover:border-purple-DEFAULT/40'
                    }`}
                    title="Inbox & Messages"
                  >
                    <MessageSquare size={17} />
                  </Link>

                  {/* Dashboard link for owner/admin */}
                  {isOwner && (
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        pathname.startsWith('/dashboard')
                          ? 'bg-cyan/15 border-cyan text-cyan'
                          : 'bg-zoku-card border-zoku-border text-muted hover:text-cyan hover:border-cyan/40'
                      }`}
                    >
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* Admin link for admins */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        pathname.startsWith('/admin')
                          ? 'bg-amber/15 border-amber text-amber'
                          : 'bg-zoku-card border-zoku-border text-muted hover:text-amber hover:border-amber/40'
                      }`}
                    >
                      <Shield size={14} />
                      <span>Admin</span>
                    </Link>
                  )}

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-zoku-card border border-zoku-border hover:border-purple-DEFAULT transition-all"
                    >
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white font-bold text-xs overflow-hidden relative">
                        {userProfile?.avatar_url ? (
                          <Image src={userProfile.avatar_url} alt="Profile" fill className="object-cover" />
                        ) : (
                          <span>{(userProfile?.full_name || 'U')[0]}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-zoku-text max-w-[90px] truncate">
                        {userProfile?.full_name || 'Account'}
                      </span>
                      <ChevronDown size={13} className="text-muted" />
                    </button>

                    {userDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-zoku-card border border-zoku-border rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                          <div className="px-3 py-2 border-b border-zoku-border mb-1">
                            <p className="text-xs font-bold text-zoku-text truncate">{userProfile?.full_name}</p>
                            <p className="text-[10px] text-muted capitalize font-medium">{userProfile?.role || 'Member'} · {userProfile?.city || 'India'}</p>
                          </div>
                          <Link
                            href="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zoku-text hover:bg-zoku-bg hover:text-purple-DEFAULT rounded-xl transition-colors"
                          >
                            <User size={14} /> My Profile
                          </Link>
                          <Link
                            href="/inbox"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zoku-text hover:bg-zoku-bg hover:text-purple-DEFAULT rounded-xl transition-colors"
                          >
                            <MessageSquare size={14} /> Messages
                          </Link>
                          {isOwner && (
                            <Link
                              href="/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zoku-text hover:bg-zoku-bg hover:text-cyan rounded-xl transition-colors"
                            >
                              <LayoutDashboard size={14} /> Owner Dashboard
                            </Link>
                          )}
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zoku-text hover:bg-zoku-bg hover:text-amber rounded-xl transition-colors"
                            >
                              <Shield size={14} /> Admin Panel
                            </Link>
                          )}
                          <div className="border-t border-zoku-border my-1" />
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="btn-secondary !py-2 !px-4 !text-sm !rounded-xl">
                    Login
                  </Link>
                  <Link href="/signup" className="btn-primary !py-2 !px-4 !text-sm !rounded-xl">
                    Join ZOKU
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-zoku-card border border-zoku-border text-zoku-text hover:border-purple-DEFAULT transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-zoku-bg/98 backdrop-blur-2xl flex flex-col pt-24 px-5 pb-8 lg:hidden animate-in fade-in duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-zoku-card border border-zoku-border rounded-2xl px-4 py-3 mb-4 shadow-sm">
            <Search size={18} className="text-muted shrink-0" />
            <input
              placeholder="Search hostels, gyms, events..."
              className="bg-transparent text-sm text-zoku-text placeholder-muted outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Mobile City Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  city === selectedCity
                    ? 'bg-purple-DEFAULT border-purple-DEFAULT text-white shadow-sm'
                    : 'bg-zoku-card border-zoku-border text-muted'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Mobile Nav links */}
          <div className="overflow-y-auto flex-1 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between py-3 px-4 rounded-xl text-base font-bold transition-colors ${
                  isActive(link.href) ? 'bg-purple-DEFAULT/10 text-purple-DEFAULT' : 'text-zoku-text hover:bg-zoku-card2'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-xs text-muted">→</span>
              </Link>
            ))}

            {/* Quick App Management Links in Mobile Drawer */}
            <div className="pt-4 border-t border-zoku-border mt-3 space-y-1">
              <p className="px-4 text-[10px] font-black text-muted uppercase tracking-widest mb-1">Portals & Tools</p>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-bold text-zoku-text hover:bg-zoku-card2"
              >
                <LayoutDashboard size={16} className="text-cyan" />
                <span>Owner Dashboard</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-bold text-zoku-text hover:bg-zoku-card2"
              >
                <Shield size={16} className="text-amber" />
                <span>Admin Panel</span>
              </Link>
              <Link
                href="/inbox"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-bold text-zoku-text hover:bg-zoku-card2"
              >
                <MessageSquare size={16} className="text-purple-DEFAULT" />
                <span>Messages & Inbox</span>
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="pt-6 mt-4 border-t border-zoku-border flex flex-col gap-3">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-zoku-card rounded-2xl border border-zoku-border">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white font-bold text-sm">
                      {(userProfile?.full_name || 'U')[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-zoku-text">{userProfile?.full_name || 'My Account'}</p>
                      <p className="text-xs text-muted capitalize">{userProfile?.role || 'Member'}</p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="btn-secondary w-full !justify-center !rounded-xl">
                    View Profile
                  </Link>
                  <button onClick={handleSignOut} className="w-full py-3 rounded-xl border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500/10 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full !justify-center !rounded-xl">
                    Login to Account
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full !justify-center !rounded-xl">
                    Join ZOKU Community
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zoku-card/90 backdrop-blur-xl border-t border-zoku-border px-2 py-2 flex items-center justify-around md:hidden safe-area-bottom shadow-lg">
        {[
          { href: '/', icon: '🏠', label: 'Home' },
          { href: '/explore', icon: '🔭', label: 'Explore' },
          { href: '/events', icon: '🎉', label: 'Events' },
          { href: '/inbox', icon: '💬', label: 'Inbox' },
          { href: currentUser ? '/profile' : '/login', icon: '👤', label: currentUser ? 'Profile' : 'Login' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isActive(item.href) ? 'text-purple-DEFAULT font-bold' : 'text-muted'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-zoku-bg" />}>
      <NavbarContent />
    </Suspense>
  );
}
