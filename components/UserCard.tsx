'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { User } from '@/lib/types';
import { MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import AuthModal from './AuthModal';

interface UserCardProps {
  user: User;
  compact?: boolean;
}

export default function UserCard({ user, compact = false }: UserCardProps) {
  const [connected, setConnected] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    async function checkConnection() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setSessionUser(currentUser);
      
      if (currentUser) {
        const { data: conn } = await supabase
          .from('connections')
          .select('id')
          .or(
            `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),` +
            `and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`
          )
          .maybeSingle();
        if (conn) setConnected(true);
      }
    }
    checkConnection();
  }, [user.id]);

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sessionUser) {
      setShowAuthModal(true);
      return;
    }

    if (connected) {
      // For now, just a simple toggle/delete for the demo
      await supabase
        .from('connections')
        .delete()
        .or(`and(sender_id.eq.${sessionUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${sessionUser.id})`);
      setConnected(false);
    } else {
      await supabase
        .from('connections')
        .insert({ sender_id: sessionUser.id, receiver_id: user.id, status: 'pending' });
      setConnected(true);
    }
  };

  return (
    <>
      <div className="glow-card p-5 cursor-pointer group">
        {/* Avatar + Name */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative shrink-0">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="rounded-2xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green rounded-full border-2 border-zoku-card" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zoku-text text-sm mb-0.5 group-hover:text-green transition-colors">{user.name}</h3>
            {user.hometown && (
              <p className="text-xs text-muted">🏡 From {user.hometown}</p>
            )}
            <div className="flex items-center gap-1 text-xs text-muted mt-1">
              <MapPin size={10} />
              <span>{user.city}</span>
            </div>
          </div>
        </div>

        {/* College / Company */}
        {!compact && (
          <div className="space-y-1.5 mb-4">
            {user.college && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <GraduationCap size={12} className="text-purple-DEFAULT shrink-0" />
                <span className="line-clamp-1">{user.college}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <Briefcase size={12} className="text-cyan shrink-0" />
                <span className="line-clamp-1">{user.company}</span>
              </div>
            )}
          </div>
        )}

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {user.interests.slice(0, 3).map((interest) => (
            <span key={interest} className="text-xs px-2 py-0.5 rounded-full bg-purple-DEFAULT/10 text-purple-DEFAULT border border-purple-DEFAULT/20">
              {interest}
            </span>
          ))}
        </div>

        {/* Bio */}
        {!compact && user.bio && (
          <p className="text-xs text-muted line-clamp-2 mb-4">{user.bio}</p>
        )}

        {/* Connect */}
        <button 
          onClick={handleConnect}
          className={`w-full py-2 rounded-xl text-sm font-semibold transition-all border ${
            connected 
              ? 'bg-green/10 border-green/30 text-green shadow-inner' 
              : 'bg-zoku-card border-zoku-border text-zoku-text hover:border-green/50 hover:text-green'
          }`}
        >
          {connected ? '✓ Connected' : 'Connect →'}
        </button>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="Connect with Others"
        description="Join the ZOKU tribe to connect with people from your hometown, college, or company."
      />
    </>
  );
}
