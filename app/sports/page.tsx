'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClubCard from '@/components/ClubCard';
import { SPORTS_CLUBS } from '@/lib/data';
import { Search } from 'lucide-react';

const SPORTS = ['All', 'Football', 'Cricket', 'Badminton', 'Basketball', 'Running', 'Chess', 'Tennis'];
const SKILL_LEVELS = ['all', 'beginner', 'intermediate', 'advanced'];

export default function SportsPage() {
  const [sport, setSport] = useState('All');
  const [skill, setSkill] = useState('all');
  const [search, setSearch] = useState('');
  const [clubsList, setClubsList] = useState<any[]>(SPORTS_CLUBS);

  useEffect(() => {
    async function fetchSportsClubs() {
      const { data, error } = await supabase.from('sports_clubs').select('*');
      if (!error && data && data.length > 0) {
        setClubsList(data);
      }
    }
    fetchSportsClubs();
  }, []);

  const filtered = clubsList.filter((c) => {
    if (sport !== 'All' && c.sport !== sport) return false;
    if (skill !== 'all' && c.skill_level !== skill) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 pb-24">
        <div className="relative bg-gradient-to-b from-zoku-card to-zoku-bg py-12 px-4 overflow-hidden">
          <div className="orb w-64 h-64 bg-green top-0 right-0 opacity-10" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">⚽</span>
              <span className="neon-pill bg-green/10 text-green border border-green/20">Sports & Activities</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zoku-text mb-3">
              Find Your <span className="gradient-text-green">Sports Tribe</span>
            </h1>
            <p className="text-muted mb-6">Join local sports clubs and play with people who share your passion.</p>
            <div className="flex gap-3 max-w-xl">
              <div className="flex-1 flex items-center gap-2 glass rounded-xl px-4 py-3">
                <Search size={16} className="text-muted shrink-0" />
                <input placeholder="Search sports clubs..." className="bg-transparent text-sm text-zoku-text placeholder-muted outline-none w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn-primary !rounded-xl !py-2 !px-5 !text-sm">Search</button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-16 z-30 bg-zoku-bg/95 backdrop-blur-xl border-b border-zoku-border py-3">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {SPORTS.map((s) => (
                <button key={s} onClick={() => setSport(s)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${sport === s ? 'bg-green border-green text-white' : 'border-zoku-border text-muted hover:border-green/40'}`}>
                  {s}
                </button>
              ))}
              <div className="h-4 w-px bg-zoku-border shrink-0 self-center" />
              {SKILL_LEVELS.map((l) => (
                <button key={l} onClick={() => setSkill(l)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${skill === l ? 'bg-cyan border-cyan text-white' : 'border-zoku-border text-muted hover:border-cyan/40'}`}>
                  {l === 'all' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-sm text-muted mb-6"><span className="text-zoku-text font-semibold">{filtered.length}</span> clubs found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => <ClubCard key={c.id} club={c} />)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
