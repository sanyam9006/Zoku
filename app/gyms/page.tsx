'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GymCard from '@/components/GymCard';
import { GYMS } from '@/lib/data';
import { Search } from 'lucide-react';

const GYM_TYPES = ['all', 'gym', 'yoga', 'crossfit', 'swimming', 'mixed'];

export default function GymsPage() {
  const [type, setType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [search, setSearch] = useState('');

  const filtered = GYMS.filter((g) => {
    if (type !== 'all' && g.gym_type !== type) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.price_min - b.price_min;
    if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 pb-24">
        {/* Hero */}
        <div className="relative bg-gradient-to-b from-zoku-card to-zoku-bg py-12 px-4 overflow-hidden">
          <div className="orb w-64 h-64 bg-cyan top-0 right-0 opacity-10" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">💪</span>
              <span className="neon-pill bg-cyan/10 text-cyan border border-cyan/20">Fitness Discovery</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zoku-text mb-3">
              Find Your <span className="gradient-text-cyan">Perfect Gym</span>
            </h1>
            <p className="text-muted mb-6">Gyms, yoga studios, CrossFit, and swimming pools near you.</p>
            <div className="flex gap-3 max-w-xl">
              <div className="flex-1 flex items-center gap-2 glass rounded-xl px-4 py-3">
                <Search size={16} className="text-muted shrink-0" />
                <input placeholder="Search gyms..." className="bg-transparent text-sm text-zoku-text placeholder-muted outline-none w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn-primary !rounded-xl !py-2 !px-5 !text-sm">Search</button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="sticky top-16 z-30 bg-zoku-bg/95 backdrop-blur-xl border-b border-zoku-border py-3">
          <div className="max-w-7xl mx-auto px-4 flex gap-3 items-center overflow-x-auto scrollbar-hide">
            {GYM_TYPES.map((t) => {
              const icons: Record<string, string> = { all: '🏋️', gym: '💪', yoga: '🧘', crossfit: '🔥', swimming: '🏊', mixed: '⚡' };
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    type === t ? 'bg-cyan border-cyan text-white' : 'border-zoku-border text-muted hover:border-cyan/40'
                  }`}
                >
                  {icons[t]} {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              );
            })}
            <div className="h-4 w-px bg-zoku-border shrink-0" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="shrink-0 bg-zoku-card border border-zoku-border text-sm text-zoku-text rounded-xl px-3 py-1.5 outline-none cursor-pointer">
              <option value="rating">Best Rated</option>
              <option value="price">Lowest Price</option>
              <option value="distance">Nearest</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-sm text-muted mb-6"><span className="text-zoku-text font-semibold">{filtered.length}</span> gyms found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((g) => <GymCard key={g.id} gym={g} />)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
