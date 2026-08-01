'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase/client';
import { Shield, CheckCircle2, XCircle, Clock, Eye, Search, Loader2 } from 'lucide-react';

interface AdminClientProps {
  profile: {
    id: string;
    full_name: string;
    role: string;
  };
}

interface PendingItem {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  status: string;
}

export default function AdminClient({ profile }: AdminClientProps) {
  const [tab, setTab] = useState<'pending' | 'users' | 'reports'>('pending');
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({ users: 0, listings: 0, pending: 0, events: 0 });

  const fetchPending = useCallback(async () => {
    setLoading(true);
    const [hostelsRes, gymsRes] = await Promise.all([
      supabase.from('hostels').select('id, name, city, address').eq('verified', false),
      supabase.from('gyms').select('id, name, city, address').eq('verified', false),
    ]);

    const items: PendingItem[] = [
      ...(hostelsRes.data || []).map((h) => ({ ...h, type: 'Hostel', status: 'pending' })),
      ...(gymsRes.data || []).map((g) => ({ ...g, type: 'Gym', status: 'pending' })),
    ];
    setPending(items);
    setLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, city, role, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    setUsers(data || []);
  }, []);

  const fetchStats = useCallback(async () => {
    const [usersRes, hostelsRes, gymsRes, eventsRes, pendingHostels] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('hostels').select('id', { count: 'exact', head: true }),
      supabase.from('gyms').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('hostels').select('id', { count: 'exact', head: true }).eq('verified', false),
    ]);
    setStats({
      users: usersRes.count || 0,
      listings: (hostelsRes.count || 0) + (gymsRes.count || 0),
      pending: pendingHostels.count || 0,
      events: eventsRes.count || 0,
    });
  }, []);

  useEffect(() => {
    fetchPending();
    fetchUsers();
    fetchStats();
  }, [fetchPending, fetchUsers, fetchStats]);

  const handleApprove = async (item: PendingItem) => {
    setActionLoading(item.id);
    const table = item.type === 'Hostel' ? 'hostels' : 'gyms';
    const { error } = await supabase.from(table).update({ verified: true }).eq('id', item.id);
    if (!error) {
      setPending((prev) => prev.filter((p) => p.id !== item.id));
      setStats((prev) => ({ ...prev, pending: prev.pending - 1 }));
    } else {
      alert('Failed to approve: ' + error.message);
    }
    setActionLoading(null);
  };

  const handleReject = async (item: PendingItem) => {
    if (!confirm(`Are you sure you want to reject "${item.name}"? This will delete it.`)) return;
    setActionLoading(item.id);
    const table = item.type === 'Hostel' ? 'hostels' : 'gyms';
    const { error } = await supabase.from(table).delete().eq('id', item.id);
    if (!error) {
      setPending((prev) => prev.filter((p) => p.id !== item.id));
      setStats((prev) => ({ ...prev, pending: prev.pending - 1 }));
    } else {
      alert('Failed to reject: ' + error.message);
    }
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zoku-bg">
      <Navbar />
      <div className="pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zoku-text">Admin Panel</h1>
              <p className="text-xs text-muted">ZOKU Platform Management · Logged in as {profile.full_name}</p>
            </div>
          </div>

          {/* Stat cards — real data */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', val: stats.users.toLocaleString(), color: 'text-purple-DEFAULT', icon: '👥' },
              { label: 'Active Listings', val: stats.listings.toLocaleString(), color: 'text-cyan', icon: '🏠' },
              { label: 'Pending Approval', val: stats.pending.toLocaleString(), color: 'text-amber', icon: '⏳' },
              { label: 'Events', val: stats.events.toLocaleString(), color: 'text-green', icon: '🎉' },
            ].map((s) => (
              <div key={s.label} className="glow-card p-5">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 border-b border-zoku-border pb-3">
            {[
              { id: 'pending', label: '⏳ Pending Approvals', count: pending.length },
              { id: 'users', label: '👥 Users' },
              { id: 'reports', label: '🚩 Reports' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-purple-DEFAULT/20 text-purple-DEFAULT border border-purple-DEFAULT' : 'text-muted hover:text-zoku-text'}`}
              >
                {t.label}
                {t.count != null && <span className="bg-amber/20 text-amber text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>}
              </button>
            ))}
          </div>

          {/* Pending */}
          {tab === 'pending' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-purple-DEFAULT" />
                </div>
              ) : pending.length === 0 ? (
                <div className="glow-card p-8 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-white mb-2">All Caught Up</h3>
                  <p className="text-muted">No pending approvals right now.</p>
                </div>
              ) : (
                pending.map((item) => (
                  <div key={item.id} className="glow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-zoku-text">{item.name}</h3>
                        <span className="neon-pill bg-amber/10 text-amber border border-amber/20 text-xs">{item.type}</span>
                        <span className="neon-pill bg-amber/10 text-amber border border-amber/20 text-xs flex items-center gap-1"><Clock size={9} /> Pending</span>
                      </div>
                      <p className="text-xs text-muted">{item.city} · {item.address}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(item)}
                        disabled={actionLoading === item.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green/10 border border-green/20 text-green text-xs font-semibold hover:bg-green/20 transition-all disabled:opacity-50"
                      >
                        {actionLoading === item.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />} Approve
                      </button>
                      <button
                        onClick={() => handleReject(item)}
                        disabled={actionLoading === item.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink/10 border border-pink/20 text-pink text-xs font-semibold hover:bg-pink/20 transition-all disabled:opacity-50"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div>
              <div className="flex items-center gap-2 glass rounded-xl px-4 py-3 mb-4 max-w-sm">
                <Search size={16} className="text-muted" />
                <input placeholder="Search users..." className="bg-transparent text-sm text-zoku-text placeholder-muted outline-none w-full" />
              </div>
              <div className="glow-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zoku-border">
                      {['User', 'Role', 'City', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-zoku-border hover:bg-white/2 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white text-xs font-bold">
                              {(u.full_name || 'U')[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-zoku-text">{u.full_name || 'Unknown'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`neon-pill border text-xs ${u.role === 'owner' ? 'text-cyan bg-cyan/10 border-cyan/20' : u.role === 'admin' ? 'text-amber bg-amber/10 border-amber/20' : 'text-muted bg-white/5 border-white/10'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted">{u.city || '-'}</td>
                        <td className="px-5 py-4 text-sm text-muted">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs text-cyan hover:text-cyan/80">View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports */}
          {tab === 'reports' && (
            <div className="glow-card p-8 text-center">
              <div className="text-5xl mb-4">🚩</div>
              <h3 className="text-xl font-bold text-white mb-2">No Reports</h3>
              <p className="text-muted">No flagged content at the moment. The community is thriving! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
