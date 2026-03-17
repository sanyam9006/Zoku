'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Users, Calendar } from 'lucide-react';
import type { SportsClub } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import AuthModal from './AuthModal';

interface ClubCardProps {
  club: SportsClub;
}

const SPORT_ICONS: Record<string, string> = {
  Football: '⚽', Badminton: '🏸', Cricket: '🏏', Basketball: '🏀',
  Chess: '♟️', Running: '🏃', Tennis: '🎾', Volleyball: '🏐', Swimming: '🏊',
};

const SKILL_COLORS: Record<string, string> = {
  beginner: 'text-green bg-green/10 border-green/20',
  intermediate: 'text-amber bg-amber/10 border-amber/20',
  advanced: 'text-pink bg-pink/10 border-pink/20',
  all: 'text-purple-DEFAULT bg-purple-DEFAULT/10 border-purple-DEFAULT/20',
};

export default function ClubCard({ club }: ClubCardProps) {
  const [joined, setJoined] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkMembership() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('club_memberships')
          .select('id')
          .eq('user_id', user.id)
          .eq('club_id', club.id)
          .single();
        if (data) setJoined(true);
      }
    }
    checkMembership();
  }, [club.id]);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (joined) {
      const { error } = await supabase
        .from('club_memberships')
        .delete()
        .eq('user_id', user.id)
        .eq('club_id', club.id);
      if (!error) setJoined(false);
    } else {
      const { error } = await supabase
        .from('club_memberships')
        .insert({ user_id: user.id, club_id: club.id });
      if (!error) setJoined(true);
    }
  };

  const icon = SPORT_ICONS[club.sport] || '🏅';
  const skillColor = SKILL_COLORS[club.skill_level];

  return (
    <Link href={`/sports/${club.id}`} className="block group">
      <div className="glow-card p-5 cursor-pointer">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan/20 to-purple-DEFAULT/20 border border-cyan/20 flex items-center justify-center text-3xl shrink-0 group-hover:shadow-neon-cyan transition-all">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zoku-text text-sm leading-tight line-clamp-1 mb-1 group-hover:text-cyan transition-colors">
              {club.name}
            </h3>
            <span className={`neon-pill border text-xs ${skillColor}`}>
              {club.skill_level.charAt(0).toUpperCase() + club.skill_level.slice(1)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <MapPin size={11} className="shrink-0" />
            <span className="line-clamp-1">{club.address}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Calendar size={11} className="shrink-0" />
            <span>{club.schedule}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Users size={11} className="shrink-0" />
            <span>{club.members_count} members</span>
          </div>
        </div>

        {/* Footer */}
        <button
          className={`w-full py-2 rounded-xl text-sm font-semibold transition-all border ${
            joined ? 'bg-green/10 border-green/20 text-green' : 'bg-cyan/10 border-cyan/20 text-cyan hover:bg-cyan/20'
          }`}
          onClick={handleJoin}
        >
          {joined ? '✓ Joined' : 'Join Club →'}
        </button>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        title="Join Sports Clubs"
        description="Join ZOKU to find sports partners, schedule games, and improve your skills."
      />
    </Link>
  );
}
