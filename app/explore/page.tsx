'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import GymCard from '@/components/GymCard';
import EventCard from '@/components/EventCard';
import ClubCard from '@/components/ClubCard';
import UserCard from '@/components/UserCard';
import { HOSTELS, GYMS, EVENTS, SPORTS_CLUBS, COMMUNITY_USERS } from '@/lib/data';
import { Search, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'hostels', label: 'Hostels', icon: '🏠', count: HOSTELS.length },
  { id: 'gyms', label: 'Gyms', icon: '💪', count: GYMS.length },
  { id: 'sports', label: 'Sports', icon: '⚽', count: SPORTS_CLUBS.length },
  { id: 'events', label: 'Events', icon: '🎉', count: EVENTS.length },
  { id: 'community', label: 'Community', icon: '👥', count: COMMUNITY_USERS.length },
];

function ExploreContent() {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const hostels = HOSTELS.filter(h =>
      !query ||
      h.name.toLowerCase().includes(query) ||
      h.address.toLowerCase().includes(query) ||
      h.city.toLowerCase().includes(query)
    ).map(h => ({ ...h, type: 'hostel' }));

    const gyms = GYMS.filter(g =>
      !query ||
      g.name.toLowerCase().includes(query) ||
      g.address.toLowerCase().includes(query) ||
      g.city.toLowerCase().includes(query)
    ).map(g => ({ ...g, type: 'gym' }));

    const sports = SPORTS_CLUBS.filter(s =>
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query)
    ).map(s => ({ ...s, type: 'sports' }));

    const events = EVENTS.filter(e =>
      !query ||
      e.title.toLowerCase().includes(query) ||
      (e.venue || '').toLowerCase().includes(query) ||
      e.city.toLowerCase().includes(query)
    ).map(e => ({ ...e, type: 'event' }));

    const community = COMMUNITY_USERS.filter(u =>
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.city.toLowerCase().includes(query) ||
      u.interests.some(i => i.toLowerCase().includes(query))
    ).map(u => ({ ...u, type: 'community' }));

    const allResults = [...hostels, ...gyms, ...sports, ...events, ...community];

    if (activeTab === 'all') return allResults;
    if (activeTab === 'hostels') return hostels;
    if (activeTab === 'gyms') return gyms;
    if (activeTab === 'sports') return sports;
    if (activeTab === 'events') return events;
    if (activeTab === 'community') return community;
    return [];
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-zoku-bg">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Page header */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h1 className="text-3xl font-black text-zoku-text mb-2">Explore Your City 🗺️</h1>
          <p className="text-muted mb-6">Find hostels, gyms, sports clubs, events and people near you</p>

          {/* Search Input */}
          <div className="relative group max-w-2xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-DEFAULT transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search anything — hostels, gyms, events, people..."
              className="w-full bg-zoku-card border border-zoku-border rounded-2xl py-4 pl-12 pr-10 text-zoku-text placeholder:text-muted focus:outline-none focus:border-purple-DEFAULT focus:ring-1 focus:ring-purple-DEFAULT transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-zoku-text"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="sticky top-20 z-30 bg-zoku-bg/80 backdrop-blur-md border-b border-zoku-border mb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    activeTab === cat.id
                      ? 'bg-purple-DEFAULT border-purple-DEFAULT text-white shadow-neon-purple'
                      : 'bg-zoku-card border-zoku-border text-muted hover:border-purple-DEFAULT/50 hover:text-zoku-text'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {cat.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === cat.id ? 'bg-white/20' : 'bg-zoku-bg'}`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <p className="text-sm text-muted">
            <span className="font-semibold text-zoku-text">{filteredResults.length}</span> results found
            {searchQuery && <span> for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>}
          </p>
        </div>

        {/* Results Grid */}
        <div className="max-w-7xl mx-auto px-4">
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResults.map((item: any) => {
                if (item.type === 'hostel') return <ListingCard key={`hostel-${item.id}`} hostel={item} />;
                if (item.type === 'gym') return <GymCard key={`gym-${item.id}`} gym={item} />;
                if (item.type === 'sports') return <ClubCard key={`sports-${item.id}`} club={item} />;
                if (item.type === 'event') return <EventCard key={`event-${item.id}`} event={item} />;
                if (item.type === 'community') return <UserCard key={`community-${item.id}`} user={item} />;
                return null;
              })}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center justify-center glass rounded-3xl border-dashed">
              <div className="w-20 h-20 bg-zoku-card rounded-full flex items-center justify-center mb-6 text-4xl">🔎</div>
              <h3 className="text-2xl font-bold text-zoku-text mb-2">No results found</h3>
              <p className="text-muted max-w-sm">Try a different search term or browse all categories.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                className="mt-6 text-purple-DEFAULT font-bold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zoku-bg flex flex-col">
          <div className="h-20 bg-zoku-bg" />
          <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
            <div className="h-8 w-64 bg-zoku-card rounded-xl animate-pulse mb-4" />
            <div className="h-4 w-96 bg-zoku-card rounded-xl animate-pulse mb-6" />
            <div className="h-14 w-full max-w-2xl bg-zoku-card rounded-2xl animate-pulse mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-64 bg-zoku-card rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
