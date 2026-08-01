'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Menu, X, ChevronDown } from 'lucide-react';
import { useCity } from '@/context/CityContext';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-zoku-border py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white font-black text-base shadow-neon-purple">
                族
              </div>
              <span className="text-xl font-black tracking-widest text-zoku-text">ZOKU</span>
            </Link>

            {/* City Selector */}
            <div className="relative hidden md:flex">
              <button
                onClick={() => setCityOpen(!cityOpen)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-zoku-card border border-zoku-border text-sm font-bold text-zoku-text hover:border-purple-DEFAULT hover:shadow-lg transition-all active:scale-95"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-DEFAULT/10 flex items-center justify-center text-purple-DEFAULT">
                  <MapPin size={14} />
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
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all ${
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-purple-DEFAULT/20 text-purple-DEFAULT'
                      : 'text-muted hover:text-zoku-text hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Link href="/login" className="btn-secondary !py-2 !px-4 !text-sm !rounded-xl">
                Login
              </Link>
              <Link href="/signup" className="btn-primary !py-2 !px-4 !text-sm !rounded-xl">
                Join ZOKU
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-zoku-card border border-zoku-border text-zoku-text"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-zoku-bg/95 backdrop-blur-lg flex flex-col pt-20 px-4 pb-8 lg:hidden">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-zoku-card border border-zoku-border rounded-xl px-3 py-3 mb-4">
            <Search size={16} className="text-muted shrink-0" />
            <input
              placeholder="Search anything..."
              className="bg-transparent text-sm text-zoku-text placeholder-muted outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hidden" />
          </form>

          {/* Mobile City Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  city === selectedCity
                    ? 'bg-purple-DEFAULT border-purple-DEFAULT text-white'
                    : 'border-zoku-border text-muted'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Mobile Nav links */}
          <div className="overflow-y-auto flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center py-3.5 border-b border-zoku-border text-base font-semibold transition-colors ${
                  isActive(link.href) ? 'text-purple-DEFAULT' : 'text-zoku-text'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full !justify-center">
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full !justify-center">
                Join ZOKU
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zoku-card/80 backdrop-blur-xl border-t border-zoku-border px-2 py-2 flex items-center justify-around md:hidden safe-area-bottom">
        {[
          { href: '/', icon: '🏠', label: 'Home' },
          { href: '/explore', icon: '🔭', label: 'Explore' },
          { href: '/events', icon: '🎉', label: 'Events' },
          { href: '/inbox', icon: '💬', label: 'Inbox' },
          { href: '/profile', icon: '👤', label: 'Profile' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isActive(item.href) ? 'text-purple-DEFAULT' : 'text-muted'
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
