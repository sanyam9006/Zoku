'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MapPin, Briefcase, GraduationCap, Home, Heart, Settings, Grid, Bookmark, Users, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function ProfileClient({ initialProfile }: { initialProfile: any }) {
  const [profile, setProfile] = useState(initialProfile)
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Connections', count: 12, icon: Users, color: 'text-blue-500' },
    { label: 'RSVPs', count: 4, icon: MessageSquare, color: 'text-purple-500' },
    { label: 'Saved', count: 8, icon: Bookmark, color: 'text-pink-500' },
    { label: 'Clubs', count: 2, icon: Grid, color: 'text-orange-500' },
  ]

  return (
    <div className="pb-24">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-zoku-border px-4 pt-8 pb-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-purple-light to-purple-DEFAULT p-1 shadow-xl">
              <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-purple-DEFAULT">{profile.full_name?.[0] || 'U'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h1 className="text-2xl font-black text-zoku-text">{profile.full_name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-DEFAULT/10 text-purple-DEFAULT text-[10px] font-bold uppercase tracking-wider">
                {profile.user_type}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted mb-4">
              <div className="flex items-center gap-1">
                <MapPin size={14} /> {profile.city}
              </div>
              <div className="flex items-center gap-1">
                {profile.user_type === 'student' ? <GraduationCap size={14} /> : <Briefcase size={14} />}
                {profile.college || profile.company || 'Not set'}
              </div>
              <div className="flex items-center gap-1">
                <Home size={14} /> From {profile.hometown || 'Earth'}
              </div>
            </div>

            <div className="flex gap-2 justify-center md:justify-start">
              <button className="px-6 py-2 rounded-xl bg-purple-DEFAULT text-white text-sm font-bold shadow-lg shadow-purple-DEFAULT/20 hover:scale-105 transition-transform active:scale-95">
                Edit Profile
              </button>
              <button className="p-2 rounded-xl bg-zoku-bg border border-zoku-border hover:bg-white transition-colors">
                <Settings size={20} className="text-muted" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glow-card p-4 text-center hover:scale-[1.02] transition-transform cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl bg-zoku-bg flex items-center justify-center mx-auto mb-2 group-hover:bg-white transition-colors`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className="text-xl font-black text-zoku-text">{stat.count}</div>
              <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Interests */}
        <div className="glow-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={18} className="text-pink-500" />
            <h2 className="font-black text-zoku-text uppercase text-xs tracking-widest">Interests</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests?.map((tag: string) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-zoku-bg border border-zoku-border text-xs font-bold text-zoku-text">
                #{tag}
              </span>
            )) || <span className="text-sm text-muted">No interests added yet</span>}
          </div>
        </div>

        {/* Empty State / Tabs */}
        <div className="text-center py-12 px-6 border-2 border-dashed border-zoku-border rounded-[32px]">
          <div className="w-16 h-16 rounded-2xl bg-zoku-bg flex items-center justify-center mx-auto mb-4">
            <Bookmark size={24} className="text-muted" />
          </div>
          <h3 className="text-lg font-black text-zoku-text mb-2">No Saved Items</h3>
          <p className="text-muted text-sm max-w-xs mx-auto mb-6">Start exploring hostels, gyms, and events to build your collection.</p>
          <Link href="/explore" className="btn-primary inline-flex items-center gap-2">
            Explore Now
          </Link>
        </div>
      </div>
    </div>
  )
}
