'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Ticket, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Event } from '@/lib/types';
import AuthModal from './AuthModal';

interface EventCardProps {
  event: Event;
}

const CATEGORY_COLORS: Record<string, string> = {
  music: 'text-pink bg-pink/10 border-pink/20',
  sports: 'text-cyan bg-cyan/10 border-cyan/20',
  tech: 'text-purple-DEFAULT bg-purple-DEFAULT/10 border-purple-DEFAULT/20',
  culture: 'text-amber bg-amber/10 border-amber/20',
  networking: 'text-green bg-green/10 border-green/20',
  college: 'text-cyan bg-cyan/10 border-cyan/20',
  comedy: 'text-pink bg-pink/10 border-pink/20',
  food: 'text-amber bg-amber/10 border-amber/20',
};

const CATEGORY_ICONS: Record<string, string> = {
  music: '🎵', sports: '⚽', tech: '💻', culture: '🎭',
  networking: '🤝', college: '🎓', comedy: '😂', food: '🍕',
};

export default function EventCard({ event }: EventCardProps) {
  const [rsvpStatus, setRsvpStatus] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkRsvp() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('rsvps')
          .select('id')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .single();
        if (data) setRsvpStatus(true);
      }
    }
    checkRsvp();
  }, [event.id]);

  const colorClass = CATEGORY_COLORS[event.category] || 'text-purple-DEFAULT bg-purple-DEFAULT/10 border-purple-DEFAULT/20';
  const icon = CATEGORY_ICONS[event.category] || '🎉';

  const dateObj = new Date(event.event_date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en', { month: 'short' });

  const handleRSVP = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (rsvpStatus) {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', event.id);
      if (!error) setRsvpStatus(false);
    } else {
      const { error } = await supabase
        .from('rsvps')
        .insert({ user_id: user.id, event_id: event.id });
      if (!error) setRsvpStatus(true);
    }
  };

  return (
    <>
      <Link href={`/events/${event.id}`} className="block group">
        <div className="glow-card overflow-hidden cursor-pointer">
          {/* Image */}
          <div className="relative h-44 overflow-hidden">
            <Image
              src={event.photo || '/placeholder.jpg'}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Date badge */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-black text-white leading-none">{day}</p>
              <p className="text-xs text-muted font-semibold uppercase">{month}</p>
            </div>

            {/* Category */}
            <div className="absolute top-3 right-3">
              <span className={`neon-pill border text-xs ${colorClass}`}>
                {icon} {event.category}
              </span>
            </div>

            {/* Price / Free */}
            <div className="absolute bottom-3 right-3">
              {event.is_free ? (
                <span className="neon-pill bg-green/20 text-green border border-green/30 text-sm font-bold">FREE</span>
              ) : (
                <span className="bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1 text-sm font-bold text-white">
                  ₹{event.price}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-zoku-text text-sm leading-tight line-clamp-2 mb-2 group-hover:text-pink transition-colors">
              {event.title}
            </h3>

            <div className="flex items-center gap-1 text-xs text-muted mb-1">
              <MapPin size={11} />
              <span className="line-clamp-1">{event.city} · {(event.venue || '').split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted mb-3">
              <Calendar size={11} />
              <span>{event.event_time}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted">
                <Users size={11} />
                <span>{event.rsvp_count.toLocaleString()} going</span>
              </div>
              <button 
                className={`py-1.5 px-3 text-xs rounded-lg font-bold transition-all ${
                  rsvpStatus ? 'bg-green/10 text-green border border-green/20' : 'btn-primary'
                }`}
                onClick={handleRSVP}
              >
                {rsvpStatus ? 'Joined!' : 'RSVP'}
              </button>
            </div>
          </div>
        </div>
      </Link>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="RSVP for Events"
        description="Join the ZOKU tribe to RSVP for events, see who else is going, and get notified about updates."
      />
    </>
  );
}
