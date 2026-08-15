'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserCard from '@/components/UserCard';
import EmptyState from '@/components/EmptyState';
import { COMMUNITY_USERS, CITIES } from '@/lib/data';
import { Search, Filter, MessageSquare, MapPin, X, RotateCcw } from 'lucide-react';

const FEED_POSTS = [
  { id: 1, user: 'Arjun M.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', city: 'Bangalore', time: '2h ago', content: 'Finally settled in Koramangala! Looking for people to play football this weekend 🏃 Anyone interested?', likes: 24, comments: 8 },
  { id: 2, user: 'Priya N.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', city: 'Bangalore', time: '5h ago', content: 'Best affordable cafes for remote work in HSR Layout: 1. Third Wave Coffee 2. Dyu Art Café 3. Kumara Park 🖥️☕ Save this thread!', likes: 89, comments: 22 },
  { id: 3, user: 'Kabir S.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', city: 'Delhi', time: '1d ago', content: 'New to Delhi from Jaipur. If anyone wants to explore Old Delhi on Saturday, DM me! 🏛️ Solo trips are boring.', likes: 31, comments: 15 },
];

const INTERESTS = ['All', 'Football', 'Yoga', 'Tech', 'Music', 'Travel', 'Chess', 'Running', 'Cooking'];

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'feed'>('discover');
  const [interest, setInterest] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [usersList, setUsersList] = useState<any[]>(COMMUNITY_USERS);

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data && data.length > 0) {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.full_name || 'Anonymous User',
          city: p.city || 'Bangalore',
          hometown: p.hometown || '',
          college: p.college || '',
          company: p.company || '',
          bio: p.bio || '',
          avatar: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          interests: Array.isArray(p.interests) ? p.interests : ['Tech', 'Networking'],
        }));
        setUsersList(mapped);
      }
    }
    fetchProfiles();
  }, []);

  const filtered = useMemo(() => {
    return usersList.filter((u) => {
      if (selectedCity !== 'all' && u.city !== selectedCity) return false;
      if (interest !== 'All' && !u.interests.some((i: string) => i.toLowerCase().includes(interest.toLowerCase()))) return false;
      if (
        search &&
        !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.bio?.toLowerCase().includes(search.toLowerCase()) &&
        !u.college?.toLowerCase().includes(search.toLowerCase()) &&
        !u.company?.toLowerCase().includes(search.toLowerCase()) &&
        !u.hometown?.toLowerCase().includes(search.toLowerCase())
      ) return false;
      return true;
    });
  }, [usersList, interest, search, selectedCity]);

  const clearFilters = () => {
    setInterest('All');
    setSearch('');
    setSelectedCity('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zoku-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-24">
        {/* Hero */}
        <div className="relative bg-gradient-to-b from-zoku-card to-zoku-bg py-16 px-4 overflow-hidden border-b border-zoku-border text-center">
          <div className="orb w-96 h-96 bg-green -top-20 -right-20 opacity-[0.05]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center text-3xl shadow-inner mx-auto mb-6">🤝</div>
            <span className="neon-pill bg-green/10 text-green border border-green/20 mb-4 inline-block font-bold">Community Tribe</span>
            <h1 className="text-4xl md:text-6xl font-black text-zoku-text mb-4 tracking-tight">
              Find Your <span className="gradient-text-green">Tribe</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              Connect with people from your hometown, college, or company. Build genuine friendships and find activity partners in your new city.
            </p>

            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-1 flex items-center gap-3 bg-zoku-card border border-zoku-border rounded-2xl px-5 py-4 shadow-sm focus-within:border-green transition-all group">
                <Search size={20} className="text-muted group-focus-within:text-green" />
                <input 
                  placeholder="Search by name, bio, interests..." 
                  className="bg-transparent text-base text-zoku-text placeholder:text-muted outline-none w-full" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
                {search && <X size={18} className="text-muted hover:text-zoku-text cursor-pointer" onClick={() => setSearch('')} />}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 z-30 bg-zoku-bg/80 backdrop-blur-md border-b border-zoku-border py-2 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex justify-center">
            <div className="flex bg-zoku-card border border-zoku-border p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('discover')}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'discover' ? 'bg-green text-white shadow-neon-green' : 'text-muted hover:text-zoku-text'}`}
              >
                👥 People
              </button>
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'feed' ? 'bg-green text-white shadow-neon-green' : 'text-muted hover:text-zoku-text'}`}
              >
                📱 Feed
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'discover' && (
            <>
              {/* Filter bar */}
              <div className="flex gap-4 items-center overflow-x-auto scrollbar-hide mb-8 py-2">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="shrink-0 bg-zoku-card border border-zoku-border text-sm font-bold text-zoku-text rounded-xl px-4 py-2 outline-none hover:border-green transition-all appearance-none pr-10 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2rem]"
                >
                  <option value="all">Everywhere</option>
                  {CITIES.map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}
                </select>

                <div className="h-6 w-px bg-zoku-border shrink-0" />

                {INTERESTS.map((i) => (
                  <button
                    key={i}
                    onClick={() => setInterest(i)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${interest === i ? 'bg-green border-green text-white shadow-neon-green' : 'bg-zoku-card border-zoku-border text-muted hover:border-green/40'}`}
                  >
                    {i}
                  </button>
                ))}

                {(interest !== 'All' || search || selectedCity !== 'all') && (
                  <button 
                    onClick={clearFilters}
                    className="shrink-0 text-xs font-bold text-green hover:underline flex items-center gap-1 ml-auto"
                  >
                    <RotateCcw size={12} /> Clear all
                  </button>
                )}
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.map((u) => <UserCard key={u.id} user={u} />)}
                </div>
              ) : (
                <EmptyState 
                  title="No People Found" 
                  description="We couldn't find anyone matching your current filters. Try relaxing them or searching in a different city." 
                  onClear={clearFilters}
                  icon="👥"
                />
              )}
            </>
          )}

          {activeTab === 'feed' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Post input */}
              <div className="glow-card p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white font-black shrink-0 text-xl shadow-neon-purple">Y</div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Share a tip, experience, or ask the tribe..."
                      rows={1}
                      className="w-full bg-zoku-bg border border-zoku-border rounded-2xl px-5 py-3 text-sm text-zoku-text placeholder:text-muted outline-none focus:border-green transition-all resize-none overflow-hidden min-h-[50px]"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-xl text-muted hover:text-green hover:bg-green/10 transition-all">📷</button>
                        <button className="p-2 rounded-xl text-muted hover:text-green hover:bg-green/10 transition-all">📍</button>
                      </div>
                      <button className="btn-primary !bg-green !text-white !py-2.5 !px-6 !text-sm !rounded-xl !shadow-neon-green">Post</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed */}
              {FEED_POSTS.map((post) => (
                <div key={post.id} className="glow-card p-6 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-zoku-border group-hover:ring-green/50 transition-all shrink-0"><Image src={post.avatar} alt={post.user} fill className="object-cover" /></div>
                    <div>
                      <p className="font-black text-zoku-text text-base">{post.user}</p>
                      <p className="text-xs text-muted font-semibold uppercase">{post.city} · {post.time}</p>
                    </div>
                  </div>
                  <p className="text-zoku-text leading-relaxed mb-6 text-base">{post.content}</p>
                  <div className="flex items-center gap-6 text-sm text-muted pt-4 border-t border-zoku-border">
                    <button className="flex items-center gap-2 hover:text-pink transition-all font-bold">❤️ {post.likes}</button>
                    <button className="flex items-center gap-2 hover:text-cyan transition-all font-bold"><MessageSquare size={16} /> {post.comments}</button>
                    <button className="flex items-center gap-2 hover:text-purple-DEFAULT transition-all font-bold ml-auto">📤 Share</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
