'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import { EVENTS, CITIES } from '@/lib/data';
import { Search, MapPin, X, RotateCcw } from 'lucide-react';

const CATEGORIES = ['all', 'music', 'sports', 'tech', 'culture', 'networking', 'comedy', 'food'];
const CAT_ICONS: Record<string, string> = { all: '🎪', music: '🎵', sports: '⚽', tech: '💻', culture: '🎭', networking: '🤝', comedy: '😂', food: '🍕' };

export default function EventsPage() {
  const [category, setCategory] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [eventsList, setEventsList] = useState<any[]>(EVENTS);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from('events').select('*');
      if (!error && data && data.length > 0) {
        setEventsList(data);
      }
    }
    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    return eventsList.filter((e) => {
      if (selectedCity !== 'all' && e.city !== selectedCity) return false;
      if (category !== 'all' && e.category !== category) return false;
      if (freeOnly && !e.is_free) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [eventsList, category, freeOnly, search, selectedCity]);

  const clearFilters = () => {
    setCategory('all');
    setFreeOnly(false);
    setSearch('');
    setSelectedCity('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zoku-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-24">
        {/* Hero */}
        <div className="relative bg-gradient-to-b from-zoku-card to-zoku-bg py-16 px-4 overflow-hidden border-b border-zoku-border">
          <div className="orb w-96 h-96 bg-amber -top-20 -right-20 opacity-[0.05]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-2xl shadow-inner">🎉</div>
              <span className="neon-pill bg-amber/10 text-amber border border-amber/20 font-bold">Events & Nightlife</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-zoku-text mb-4 tracking-tight">
              Discover <span className="gradient-text-amber">What&apos;s Happening</span>
            </h1>
            <p className="text-muted text-lg mb-8 max-w-2xl">Find the best tech meetups, festivals, open mics, and networking nights in your city.</p>
            
            <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
              <div className="flex-1 flex items-center gap-3 bg-zoku-card border border-zoku-border rounded-2xl px-5 py-4 shadow-sm focus-within:border-amber transition-all group">
                <Search size={20} className="text-muted group-focus-within:text-amber" />
                <input 
                  placeholder="Search events by name, organizer..." 
                  className="bg-transparent text-base text-zoku-text placeholder:text-muted outline-none w-full" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
                {search && <X size={18} className="text-muted hover:text-zoku-text cursor-pointer" onClick={() => setSearch('')} />}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-16 z-30 bg-zoku-bg/80 backdrop-blur-xl border-b border-zoku-border py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex gap-4 items-center overflow-x-auto scrollbar-hide">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="shrink-0 bg-zoku-card border border-zoku-border text-sm font-bold text-zoku-text rounded-xl px-4 py-2.5 outline-none hover:border-amber transition-all appearance-none pr-10 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2rem]"
            >
              <option value="all">Everywhere</option>
              {CITIES.map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}
            </select>

            <div className="h-6 w-px bg-zoku-border shrink-0" />

            <div className="flex gap-2 shrink-0">
              {CATEGORIES.map((c) => (
                <button 
                  key={c} 
                  onClick={() => setCategory(c)} 
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    category === c ? 'bg-amber border-amber text-white shadow-neon-amber' : 'bg-zoku-card border-zoku-border text-muted hover:border-amber/40'
                  }`}
                >
                  {CAT_ICONS[c]} {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-zoku-border shrink-0" />

            <button 
              onClick={() => setFreeOnly(!freeOnly)} 
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                freeOnly ? 'bg-green border-green text-white shadow-neon-green' : 'bg-zoku-card border-zoku-border text-muted hover:border-green/40'
              }`}
            >
              {freeOnly ? '✓ Free Only' : '🆓 Free Events'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-zoku-text">Events in {selectedCity === 'all' ? 'India' : selectedCity} <span className="text-muted font-normal text-sm ml-2">({filtered.length})</span></h2>
            {(category !== 'all' || freeOnly || search || selectedCity !== 'all') && (
              <button 
                onClick={clearFilters}
                className="text-xs font-bold text-amber hover:underline flex items-center gap-1"
              >
                <RotateCcw size={12} /> Clear all
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <EmptyState 
              title="No Events Found" 
              description="We couldn't find any events matching your current filters. Try relaxing them or searching in a different city." 
              onClear={clearFilters}
              icon="🎟️"
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
