'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { HOSTELS, GYMS, EVENTS } from '@/lib/data';
import { Shield, CheckCircle2, XCircle, Clock, Eye, Search } from 'lucide-react';

export default function AdminPage() {
  const [tab, setTab] = useState<'pending' | 'users' | 'reports'>('pending');

  const PENDING = [
    ...HOSTELS.filter((h) => !h.verified).map((h) => ({ ...h, type: 'Hostel', status: 'pending' })),
    { id: '99', name: 'FitZone Gym', type: 'Gym', city: 'Pune', address: 'Kothrud, Pune', status: 'pending' },
  ];

  const USERS_LIST = [
    { id: '1', name: 'Arjun Mehta', email: 'arjun@example.com', role: 'user', joined: 'Jan 2025', city: 'Bangalore' },
    { id: '2', name: 'Priya Nair', email: 'priya@example.com', role: 'user', joined: 'Feb 2025', city: 'Bangalore' },
    { id: '3', name: 'Ravi Kumar', email: 'ravi@example.com', role: 'owner', joined: 'Jan 2025', city: 'Bangalore' },
    { id: '4', name: 'Nisha Shah', email: 'nisha@example.com', role: 'owner', joined: 'Dec 2024', city: 'Mumbai' },
  ];

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
              <p className="text-xs text-muted">ZOKU Platform Management</p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', val: '12,847', color: 'text-purple-DEFAULT', icon: '👥' },
              { label: 'Active Listings', val: '4,210', color: 'text-cyan', icon: '🏠' },
              { label: 'Pending Approval', val: '18', color: 'text-amber', icon: '⏳' },
              { label: 'Events This Month', val: '134', color: 'text-green', icon: '🎉' },
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
              { id: 'pending', label: '⏳ Pending Approvals', count: PENDING.length },
              { id: 'users', label: '👥 Users' },
              { id: 'reports', label: '🚩 Reports' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-purple-DEFAULT/20 text-purple-DEFAULT border border-purple-DEFAULT' : 'text-muted hover:text-zoku-text'}`}
              >
                {t.label}
                {t.count && <span className="bg-amber/20 text-amber text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>}
              </button>
            ))}
          </div>

          {/* Pending */}
          {tab === 'pending' && (
            <div className="space-y-4">
              {PENDING.map((item, i) => (
                <div key={i} className="glow-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-zoku-text">{item.name}</h3>
                      <span className="neon-pill bg-amber/10 text-amber border border-amber/20 text-xs">{item.type}</span>
                      <span className="neon-pill bg-amber/10 text-amber border border-amber/20 text-xs flex items-center gap-1"><Clock size={9} /> Pending</span>
                    </div>
                    <p className="text-xs text-muted">{item.city} · {item.address}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green/10 border border-green/20 text-green text-xs font-semibold hover:bg-green/20 transition-all">
                      <CheckCircle2 size={13} /> Approve
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink/10 border border-pink/20 text-pink text-xs font-semibold hover:bg-pink/20 transition-all">
                      <XCircle size={13} /> Reject
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold hover:bg-cyan/20 transition-all">
                      <Eye size={13} /> View
                    </button>
                  </div>
                </div>
              ))}
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
                    {USERS_LIST.map((u) => (
                      <tr key={u.id} className="border-b border-zoku-border hover:bg-white/2 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white text-xs font-bold">{u.name[0]}</div>
                            <div>
                              <p className="text-sm font-semibold text-zoku-text">{u.name}</p>
                              <p className="text-xs text-muted">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`neon-pill border text-xs ${u.role === 'owner' ? 'text-cyan bg-cyan/10 border-cyan/20' : 'text-muted bg-white/5 border-white/10'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted">{u.city}</td>
                        <td className="px-5 py-4 text-sm text-muted">{u.joined}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs text-cyan hover:text-cyan/80">View</button>
                            <button className="text-xs text-pink hover:text-pink/80">Ban</button>
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
