'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import EmptyState from '@/components/EmptyState';
import { HOSTELS, CITIES } from '@/lib/data';
import { Search, MapPin, X, RotateCcw, GraduationCap, Briefcase } from 'lucide-react';

const PRICE_RANGES = [
  { label: 'Under ₹4k', min: 0, max: 4000 },
  { label: '₹4k–8k', min: 4000, max: 8000 },
  { label: '₹8k–15k', min: 8000, max: 15000 },
  { label: '₹15k+', min: 15000, max: Infinity },
];

export default function HostelsPage() {

  const [gender, setGender] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedCity, setSelectedCity] = useState('all');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const [hostelsList, setHostelsList] = useState<any[]>(HOSTELS);

  useEffect(() => {
    async function fetchHostels() {
      const { data, error } = await supabase.from('hostels').select('*');
      if (!error && data && data.length > 0) {
        setHostelsList(data);
      }
    }
    fetchHostels();
  }, []);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserProfile(user.user_metadata);
      }
    }
    getProfile();
  }, []);

  const filtered = useMemo(() => {
    return hostelsList.filter((h) => {
      if (selectedCity !== 'all' && h.city !== selectedCity) return false;
      if (gender !== 'all' && h.gender !== gender) return false;
      if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.address.toLowerCase().includes(search.toLowerCase())) return false;
      if (priceRange !== 'all') {
        const range = PRICE_RANGES.find((r) => r.label === priceRange);
        if (range && (h.price_min < range.min || h.price_min > range.max)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price') return (a.price_min || 0) - (b.price_min || 0);
      if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
      return 0;
    });
  }, [hostelsList, gender, priceRange, search, sortBy, selectedCity]);

  const clearFilters = () => {
    setGender('all');
    setPriceRange('all');
    setSearch('');
    setSortBy('rating');
    setSelectedCity('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zoku-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-24">
        {/* Hero */}
        <div className="relative bg-gradient-to-b from-zoku-card to-zoku-bg py-16 px-4 overflow-hidden border-b border-zoku-border">
          <div className="orb w-96 h-96 bg-purple-DEFAULT -top-20 -left-20 opacity-[0.05]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-DEFAULT/10 flex items-center justify-center text-2xl shadow-inner">🏠</div>
              <span className="neon-pill bg-purple-DEFAULT/10 text-purple-DEFAULT border border-purple-DEFAULT/20 font-bold">Verified Stays</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-zoku-text mb-4 tracking-tight">
              Premium <span className="gradient-text">Hostels & PGs</span>
            </h1>
            <p className="text-muted text-lg mb-8 max-w-2xl">Discover hand-picked, verified stays. From social hostels to quiet PGs, find your next home with ease.</p>

            <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
              <div className="flex-1 flex items-center gap-3 bg-zoku-card border border-zoku-border rounded-2xl px-5 py-4 shadow-sm focus-within:border-purple-DEFAULT transition-all group">
                <Search size={20} className="text-muted group-focus-within:text-purple-DEFAULT" />
                <input
                  placeholder="Search by name, area, or landmark..."
                  className="bg-transparent text-base text-zoku-text placeholder:text-muted outline-none w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && <X size={18} className="text-muted hover:text-zoku-text cursor-pointer" onClick={() => setSearch('')} />}
              </div>
              
              <div className="flex gap-2">
                {userProfile?.college && (
                  <button 
                    onClick={() => { setSearch(userProfile.college); setSelectedCity('all'); }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-purple-DEFAULT/10 border border-purple-DEFAULT/20 text-purple-DEFAULT text-sm font-bold hover:bg-purple-DEFAULT hover:text-white transition-all shadow-sm whitespace-nowrap"
                  >
                    <GraduationCap size={18} /> Near My College
                  </button>
                )}
                {userProfile?.company && (
                  <button 
                    onClick={() => { setSearch(userProfile.company); setSelectedCity('all'); }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-cyan/10 border border-cyan/20 text-cyan text-sm font-bold hover:bg-cyan hover:text-white transition-all shadow-sm whitespace-nowrap"
                  >
                    <Briefcase size={18} /> Near My Office
                  </button>
                )}
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-zoku-card border border-zoku-border text-zoku-text text-sm font-bold hover:bg-purple-DEFAULT hover:text-white transition-all shadow-sm">
                  <MapPin size={18} /> Near Me
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="sticky top-16 z-30 bg-zoku-bg/80 backdrop-blur-xl border-b border-zoku-border py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex gap-4 items-center overflow-x-auto scrollbar-hide">
            {/* City */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="shrink-0 bg-zoku-card border border-zoku-border text-sm font-bold text-zoku-text rounded-xl px-4 py-2.5 outline-none hover:border-purple-DEFAULT transition-all appearance-none pr-10 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2rem]"
            >
              <option value="all">Everywhere</option>
              {CITIES.map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}
            </select>

            <div className="h-6 w-px bg-zoku-border shrink-0" />

            {/* Gender */}
            <div className="flex gap-2 shrink-0">
              {['all', 'boys', 'girls', 'mixed'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    gender === g ? 'bg-purple-DEFAULT border-purple-DEFAULT text-white shadow-neon-purple' : 'bg-zoku-card border-zoku-border text-muted hover:border-purple-DEFAULT/40'
                  }`}
                >
                  {g === 'all' ? 'All' : g === 'boys' ? '👦 Boys' : g === 'girls' ? '👧 Girls' : '🧑‍🤝‍🧑 Mixed'}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-zoku-border shrink-0" />

            {/* Price */}
            <div className="flex gap-2 shrink-0">
              {['all', ...PRICE_RANGES.map((r) => r.label)].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriceRange(p)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    priceRange === p ? 'bg-cyan border-cyan text-white shadow-neon-cyan' : 'bg-zoku-card border-zoku-border text-muted hover:border-cyan/40'
                  }`}
                >
                  {p === 'all' ? 'Any Price' : p}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-zoku-border shrink-0 ml-auto" />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shrink-0 bg-zoku-card border border-zoku-border text-sm font-bold text-zoku-text rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-purple-DEFAULT transition-all"
            >
              <option value="rating">Best Rated</option>
              <option value="price">Lowest Price</option>
              <option value="distance">Nearest</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-zoku-text">
              {viewMode === 'grid' ? 'Stays in' : 'Map view:'} {selectedCity === 'all' ? 'India' : selectedCity} 
              <span className="text-muted font-normal text-sm ml-2">({filtered.length})</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-zoku-card border border-zoku-border p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-purple-DEFAULT text-white shadow-neon-purple' : 'text-muted hover:text-zoku-text'}`}
                >
                  Grid
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-purple-DEFAULT text-white shadow-neon-purple' : 'text-muted hover:text-zoku-text'}`}
                >
                  Map
                </button>
              </div>
              {(gender !== 'all' || priceRange !== 'all' || search || selectedCity !== 'all') && (
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-purple-DEFAULT hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Clear all
                </button>
              )}
            </div>
          </div>

          {viewMode === 'grid' ? (
            filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map((h) => <ListingCard key={h.id} hostel={h} />)}
              </div>
            ) : (
              <EmptyState 
                title="No Stays Found" 
                description="We couldn't find any hostels matching your current filters. Try relaxing them or searching in a different area." 
                onClear={clearFilters}
              />
            )
          ) : (
            /* Map View Mock */
            <div className="relative w-full aspect-[21/10] min-h-[500px] bg-zoku-card border border-zoku-border rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200')] bg-cover bg-center grayscale opacity-40" />
              <div className="absolute inset-0 bg-zoku-bg/40 backdrop-blur-[1px]" />
              
              {/* Pins */}
              {filtered.map((h, i) => (
                <div 
                  key={h.id}
                  className="absolute animate-in zoom-in fade-in duration-700"
                  style={{ 
                    top: `${20 + (i * 18) % 60}%`, 
                    left: `${15 + (i * 22) % 70}%` 
                  }}
                >
                  <div className="relative group">
                    <div className="bg-purple-DEFAULT text-white px-3 py-1.5 rounded-full font-black text-xs shadow-neon-purple hover:scale-110 transition-all cursor-pointer">
                      ₹{h.price_min.toLocaleString()}
                    </div>
                    {/* Hover Card */}
                    <Link href={`/hostels/${h.id}`} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 bg-zoku-card border border-zoku-border rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-105 pointer-events-auto">
                      <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3 shadow-sm"><Image src={h.photos[0]} alt={h.name} fill className="object-cover" /></div>
                      <p className="font-black text-sm text-zoku-text mb-1 truncate">{h.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted uppercase tracking-tighter">⭐ {h.rating}</span>
                        <span className="text-xs font-black text-purple-DEFAULT uppercase">View Detail</span>
                      </div>
                    </Link>
                    <div className="w-0.5 h-3 bg-purple-DEFAULT mx-auto shadow-neon-purple opacity-50" />
                  </div>
                </div>
              ))}

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="bg-zoku-card/80 backdrop-blur-md border border-zoku-border rounded-2xl px-6 py-3 shadow-xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green shadow-neon-green animate-pulse" />
                  <p className="text-sm font-black text-zoku-text uppercase tracking-widest">
                    Showing {filtered.length} locations
                  </p>
                </div>
                <button className="btn-secondary !bg-zoku-card/80 !backdrop-blur-md !py-3 !px-6 !rounded-2xl !text-xs !font-black !uppercase !tracking-widest">
                  Reset View
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* Mobile Floating Near Me */}
      <div className="fixed bottom-24 right-4 z-40 md:hidden">
        <button 
          className="w-14 h-14 rounded-full bg-purple-DEFAULT text-white flex items-center justify-center shadow-neon-purple active:scale-90 transition-all"
          onClick={() => { /* Mock near me logic */ }}
        >
          <MapPin size={24} />
        </button>
      </div>
    </div>
  );
}
