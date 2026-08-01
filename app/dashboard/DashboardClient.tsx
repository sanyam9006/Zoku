'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, Eye, MessageSquare, Star, Plus, Settings, TrendingUp, Users, DollarSign, Loader2, X } from 'lucide-react';
import type { Hostel, Gym } from '@/lib/types';

interface DashboardClientProps {
  profile: {
    id: string;
    full_name: string;
    role: string;
  };
}

export default function DashboardClient({ profile }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'enquiries' | 'analytics'>('listings');
  const [myHostels, setMyHostels] = useState<Hostel[]>([]);
  const [myGyms, setMyGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const [hostelsRes, gymsRes] = await Promise.all([
      supabase.from('hostels').select('*').eq('owner_id', profile.id).order('created_at', { ascending: false }),
      supabase.from('gyms').select('*').eq('owner_id', profile.id).order('created_at', { ascending: false }),
    ]);
    setMyHostels(hostelsRes.data || []);
    setMyGyms(gymsRes.data || []);
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const allListings = [
    ...myHostels.map((h) => ({ ...h, listingType: 'hostel' as const })),
    ...myGyms.map((g) => ({ ...g, listingType: 'gym' as const, price_max: g.price_min })),
  ];

  const STATS = [
    { label: 'My Listings', val: allListings.length.toString(), icon: <Eye size={18} />, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
    { label: 'Verified', val: allListings.filter((l) => 'verified' in l && l.verified).length.toString(), icon: <Star size={18} />, color: 'text-green', bg: 'bg-green/10 border-green/20' },
    { label: 'Pending', val: allListings.filter((l) => 'verified' in l && !l.verified).length.toString(), icon: <MessageSquare size={18} />, color: 'text-amber', bg: 'bg-amber/10 border-amber/20' },
    { label: 'Hostels', val: myHostels.length.toString(), icon: <DollarSign size={18} />, color: 'text-pink', bg: 'bg-pink/10 border-pink/20' },
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
              <p className="text-muted text-sm">Welcome, {profile.full_name}. Manage your listings and track performance.</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-primary !py-2 !px-4 !text-sm !rounded-xl flex items-center gap-1">
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
              {loading ? (
                <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-purple-DEFAULT" /></div>
              ) : allListings.length === 0 ? (
                <div className="glow-card p-8 text-center">
                  <div className="text-5xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Listings Yet</h3>
                  <p className="text-muted mb-4">Add your first hostel or gym listing to start getting enquiries.</p>
                  <button onClick={() => setShowAddModal(true)} className="btn-primary !py-2 !px-4 !text-sm !rounded-xl">
                    <Plus size={16} /> Add Listing
                  </button>
                </div>
              ) : (
                allListings.map((item) => (
                  <div key={item.id} className="glow-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {item.photos && item.photos[0] && (
                      <div className="relative w-full sm:w-24 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={item.photos[0]} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-zoku-text">{item.name}</h3>
                        <span className="neon-pill bg-purple-DEFAULT/10 text-purple-DEFAULT border border-purple-DEFAULT/20 text-xs">{item.listingType}</span>
                        {'verified' in item && (item.verified ? (
                          <span className="neon-pill bg-green/10 text-green border border-green/20 text-xs">✓ Verified</span>
                        ) : (
                          <span className="neon-pill bg-amber/10 text-amber border border-amber/20 text-xs">⏳ Pending</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted mb-2">{item.address}</p>
                      <p className="text-sm font-bold text-zoku-text">₹{item.price_min?.toLocaleString()}{item.price_max ? ` – ₹${item.price_max.toLocaleString()}` : ''}/mo</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/${item.listingType === 'hostel' ? 'hostels' : 'gyms'}/${item.id}`} className="btn-secondary !py-2 !px-3 !text-xs !rounded-xl"><Eye size={12} /></Link>
                    </div>
                  </div>
                ))
              )}
              <button onClick={() => setShowAddModal(true)} className="w-full py-4 rounded-2xl border-2 border-dashed border-zoku-border text-muted hover:border-purple-DEFAULT/40 hover:text-purple-DEFAULT transition-all flex items-center justify-center gap-2 text-sm">
                <Plus size={16} /> Add New Listing
              </button>
            </div>
          )}

          {/* Enquiries */}
          {activeTab === 'enquiries' && (
            <div className="glow-card p-8 text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">Enquiries Coming Soon</h3>
              <p className="text-muted">Once your listings are verified, enquiries from users will appear here.</p>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="glow-card p-8 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Analytics Coming Soon</h3>
              <p className="text-muted">Detailed views and engagement analytics will be available after the data migration.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Listing Modal */}
      {showAddModal && <AddListingModal ownerId={profile.id} onClose={() => { setShowAddModal(false); fetchListings(); }} />}

      <Footer />
    </div>
  );
}

// ─── Add Listing Modal ──────────────────────────────────────────

function AddListingModal({ ownerId, onClose }: { ownerId: string; onClose: () => void }) {
  const [listingType, setListingType] = useState<'hostel' | 'gym'>('hostel');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    city: '',
    address: '',
    description: '',
    price_min: '',
    price_max: '',
    gender: 'mixed',
    gym_type: 'gym',
    timing: '',
    amenities: '',
    photos: '',
    phone: '',
  });

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!form.name || !form.city || !form.address || !form.price_min) {
      setError('Please fill in all required fields.');
      setSaving(false);
      return;
    }

    const amenitiesArr = form.amenities.split(',').map((a) => a.trim()).filter(Boolean);
    const photosArr = form.photos.split(',').map((p) => p.trim()).filter(Boolean);

    if (listingType === 'hostel') {
      const { error: insertErr } = await supabase.from('hostels').insert({
        owner_id: ownerId,
        name: form.name,
        city: form.city,
        address: form.address,
        description: form.description || null,
        price_min: parseInt(form.price_min),
        price_max: form.price_max ? parseInt(form.price_max) : parseInt(form.price_min),
        gender: form.gender,
        amenities: amenitiesArr,
        photos: photosArr,
        phone: form.phone || null,
        verified: false,
      });
      if (insertErr) { setError(insertErr.message); setSaving(false); return; }
    } else {
      const { error: insertErr } = await supabase.from('gyms').insert({
        owner_id: ownerId,
        name: form.name,
        city: form.city,
        address: form.address,
        description: form.description || null,
        price_min: parseInt(form.price_min),
        gym_type: form.gym_type,
        timing: form.timing || null,
        photos: photosArr,
        phone: form.phone || null,
      });
      if (insertErr) { setError(insertErr.message); setSaving(false); return; }
    }

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glow-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-zoku-text">Add New Listing</h2>
          <button onClick={onClose} className="text-muted hover:text-white"><X size={20} /></button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Type selector */}
        <div className="flex gap-3 mb-6">
          {(['hostel', 'gym'] as const).map((t) => (
            <button key={t} onClick={() => setListingType(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${listingType === t ? 'bg-purple-DEFAULT/20 text-purple-DEFAULT border-purple-DEFAULT' : 'border-zoku-border text-muted hover:text-zoku-text'}`}
            >
              {t === 'hostel' ? '🏠 Hostel/PG' : '💪 Gym'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">Name *</label>
            <input className="input-dark" placeholder="Listing name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">City *</label>
              <input className="input-dark" placeholder="Bangalore" value={form.city} onChange={(e) => set('city', e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Phone</label>
              <input className="input-dark" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">Address *</label>
            <input className="input-dark" placeholder="Full address" value={form.address} onChange={(e) => set('address', e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">Description</label>
            <textarea className="input-dark !h-20 resize-none" placeholder="Describe your listing..." value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Min Price (₹/mo) *</label>
              <input type="number" className="input-dark" placeholder="3000" value={form.price_min} onChange={(e) => set('price_min', e.target.value)} required />
            </div>
            {listingType === 'hostel' && (
              <div>
                <label className="text-xs font-semibold text-muted mb-1.5 block">Max Price (₹/mo)</label>
                <input type="number" className="input-dark" placeholder="7000" value={form.price_max} onChange={(e) => set('price_max', e.target.value)} />
              </div>
            )}
          </div>

          {listingType === 'hostel' && (
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Gender</label>
              <select className="input-dark" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                <option value="mixed">Mixed</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
              </select>
            </div>
          )}

          {listingType === 'gym' && (
            <>
              <div>
                <label className="text-xs font-semibold text-muted mb-1.5 block">Gym Type</label>
                <select className="input-dark" value={form.gym_type} onChange={(e) => set('gym_type', e.target.value)}>
                  <option value="gym">Gym</option>
                  <option value="yoga">Yoga</option>
                  <option value="crossfit">CrossFit</option>
                  <option value="swimming">Swimming</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted mb-1.5 block">Timing</label>
                <input className="input-dark" placeholder="5:00 AM - 11:00 PM" value={form.timing} onChange={(e) => set('timing', e.target.value)} />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">Amenities (comma-separated)</label>
            <input className="input-dark" placeholder="WiFi, AC, Gym, Meals" value={form.amenities} onChange={(e) => set('amenities', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">Photo URLs (comma-separated)</label>
            <input className="input-dark" placeholder="https://..." value={form.photos} onChange={(e) => set('photos', e.target.value)} />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full !py-3 !rounded-xl !text-base flex items-center justify-center gap-2">
            {saving ? <Loader2 size={18} className="animate-spin" /> : 'Submit for Approval →'}
          </button>
          <p className="text-xs text-muted text-center">Your listing will be reviewed by an admin before going live.</p>
        </form>
      </div>
    </div>
  );
}
