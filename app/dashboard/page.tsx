'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HOSTELS, GYMS } from '@/lib/data';
import Link from 'next/link';
import { BarChart3, Eye, MessageSquare, Star, Plus, Settings, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'enquiries' | 'analytics'>('listings');
  const myListings = HOSTELS.slice(0, 2);

  const STATS = [
    { label: 'Total Views', val: '2,847', icon: <Eye size={18} />, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
    { label: 'Enquiries', val: '43', icon: <MessageSquare size={18} />, color: 'text-green', bg: 'bg-green/10 border-green/20' },
    { label: 'Avg Rating', val: '4.7★', icon: <Star size={18} />, color: 'text-amber', bg: 'bg-amber/10 border-amber/20' },
    { label: 'Revenue Lead', val: '₹1.2L', icon: <DollarSign size={18} />, color: 'text-pink', bg: 'bg-pink/10 border-pink/20' },
  ];

  const ENQUIRIES = [
    { name: 'Siddharth R.', msg: 'Hi, is the AC room available from April?', time: '2h ago', status: 'new' },
    { name: 'Ananya K.', msg: 'What is the security deposit amount?', time: '5h ago', status: 'replied' },
    { name: 'Rohit M.', msg: 'Can couples stay? We are looking for mixed rooms.', time: '1d ago', status: 'replied' },
    { name: 'Meera S.', msg: 'I need for 3 months, is that possible?', time: '2d ago', status: 'new' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-zoku-text mb-1">Owner Dashboard</h1>
              <p className="text-muted text-sm">Manage your listings, view enquiries, and track performance.</p>
            </div>
            <button className="btn-primary !py-2 !px-4 !text-sm !rounded-xl">
              <Plus size={16} /> Add Listing
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((s) => (
              <div key={s.label} className={`glow-card p-5 border ${s.bg}`}>
                <div className={`${s.color} mb-3`}>{s.icon}</div>
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 border-b border-zoku-border pb-3">
            {[
              { id: 'listings', label: '🏠 My Listings' },
              { id: 'enquiries', label: '💬 Enquiries' },
              { id: 'analytics', label: '📊 Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-purple-DEFAULT/20 text-purple-DEFAULT border border-purple-DEFAULT' : 'text-muted hover:text-zoku-text'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Listings */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              {myListings.map((h) => (
                <div key={h.id} className="glow-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <img src={h.photos[0]} alt={h.name} className="w-full sm:w-24 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-zoku-text">{h.name}</h3>
                      {h.verified ? (
                        <span className="neon-pill bg-green/10 text-green border border-green/20 text-xs">✓ Verified</span>
                      ) : (
                        <span className="neon-pill bg-amber/10 text-amber border border-amber/20 text-xs">⏳ Pending</span>
                      )}
                    </div>
                    <p className="text-xs text-muted mb-2">{h.address}</p>
                    <p className="text-sm font-bold text-zoku-text">₹{h.price_min.toLocaleString()} – ₹{h.price_max.toLocaleString()}/mo</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/hostels/${h.id}`} className="btn-secondary !py-2 !px-3 !text-xs !rounded-xl"><Eye size={12} /></Link>
                    <button className="btn-secondary !py-2 !px-3 !text-xs !rounded-xl"><Settings size={12} /></button>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 rounded-2xl border-2 border-dashed border-zoku-border text-muted hover:border-purple-DEFAULT/40 hover:text-purple-DEFAULT transition-all flex items-center justify-center gap-2 text-sm">
                <Plus size={16} /> Add New Listing
              </button>
            </div>
          )}

          {/* Enquiries */}
          {activeTab === 'enquiries' && (
            <div className="space-y-3">
              {ENQUIRIES.map((eq, i) => (
                <div key={i} className="glow-card p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {eq.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-zoku-text text-sm">{eq.name}</p>
                      <span className={`neon-pill text-xs border ${eq.status === 'new' ? 'bg-green/10 text-green border-green/20' : 'bg-zoku-border text-muted border-zoku-border'}`}>
                        {eq.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted line-clamp-1 mb-1">{eq.msg}</p>
                    <p className="text-xs text-muted">{eq.time}</p>
                  </div>
                  <button className="btn-primary !py-1.5 !px-3 !text-xs !rounded-lg shrink-0">Reply</button>
                </div>
              ))}
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="glow-card p-6">
                <h3 className="font-bold text-zoku-text mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-cyan" /> Views Over Time</h3>
                <div className="flex items-end gap-2 h-40">
                  {[60, 85, 70, 90, 75, 95, 88, 100, 78, 92, 85, 98].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-gradient-to-t from-purple-DEFAULT to-pink opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                      <span className="text-[9px] text-muted">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glow-card p-5">
                  <h3 className="font-bold text-zoku-text mb-4 flex items-center gap-2"><Users size={16} className="text-green" /> Top Sources</h3>
                  {[['Direct Search', '45%'], ['Google', '30%'], ['Social Media', '15%'], ['Referral', '10%']].map(([src, pct]) => (
                    <div key={src} className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted">{src}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-zoku-border rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-DEFAULT to-pink rounded-full" style={{ width: pct }} />
                        </div>
                        <span className="text-xs text-zoku-text font-semibold w-8 text-right">{pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="glow-card p-5">
                  <h3 className="font-bold text-zoku-text mb-4 flex items-center gap-2"><Star size={16} className="text-amber" /> Review Summary</h3>
                  {[5,4,3,2,1].map((stars) => {
                    const widths = ['75%','15%','5%','3%','2%'];
                    return (
                      <div key={stars} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted w-4">{stars}★</span>
                        <div className="flex-1 h-1.5 bg-zoku-border rounded-full overflow-hidden">
                          <div className="h-full bg-amber rounded-full" style={{ width: widths[5-stars] }} />
                        </div>
                        <span className="text-xs text-zoku-text font-semibold w-8 text-right">{widths[5-stars]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
