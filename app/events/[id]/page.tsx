'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EVENTS } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import type { Event } from '@/lib/types';

const CATEGORY_EMOJIS: Record<string, string> = {
  music: '🎵', sports: '⚽', tech: '💻', culture: '🎭',
  networking: '🤝', college: '🎓', comedy: '😂', food: '🍕',
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(() => EVENTS.find((e) => e.id === params.id) || null);

  useEffect(() => {
    async function fetchEvent() {
      if (!params.id) return;
      const { data, error } = await supabase.from('events').select('*').eq('id', params.id).single();
      if (!error && data) {
        setEvent(data as Event);
      }
    }
    fetchEvent();
  }, [params.id]);

  const [attendees, setAttendees] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAttendees() {
      if (!event?.id) return;
      const { data: rsvpData } = await supabase
        .from('rsvps')
        .select('user_id')
        .eq('event_id', event.id);

      if (rsvpData && rsvpData.length > 0) {
        const userIds = rsvpData.map((r) => r.user_id);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, city, interests, hometown')
          .in('id', userIds);

        setAttendees(profileData || []);
      }
    }
    fetchAttendees();
  }, [event?.id]);

  if (!event) return null;

  const emoji = CATEGORY_EMOJIS[event.category] || '🎉';
  const dateObj = new Date(event.event_date);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple-DEFAULT mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Events
          </Link>

          {/* Hero image */}
          <div className="relative rounded-2xl overflow-hidden h-72 mb-8">
            <Image src={event.photo || '/placeholder.jpg'} alt={event.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="neon-pill bg-black/60 backdrop-blur-sm text-white border border-white/20 text-sm">
                {emoji} {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-black text-zoku-text mb-4">{event.title}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <Calendar size={16} className="text-amber shrink-0" />
                    <span>{dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {event.event_time && (
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <Clock size={16} className="text-cyan shrink-0" />
                      <span>{event.event_time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <MapPin size={16} className="text-pink shrink-0" />
                    <span>{event.venue}, {event.city}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <Users size={16} className="text-green shrink-0" />
                    <span>{event.rsvp_count.toLocaleString()} people going</span>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="glow-card p-5">
                  <h2 className="font-bold text-zoku-text mb-3">About This Event</h2>
                  <p className="text-muted text-sm leading-relaxed">{event.description}</p>
                </div>
              )}

              {/* Social Matching Section */}
              <div className="glow-card p-5 border border-purple-DEFAULT/30">
                <h2 className="font-bold text-zoku-text mb-2 flex items-center gap-2">
                  <span className="text-xl">🤝</span> Find Your Tribe at This Event
                </h2>
                <p className="text-xs text-muted mb-4">
                  {attendees.length > 0
                    ? `${attendees.length} members going are also looking to build their network in ${event.city}!`
                    : `RSVP now to connect with other students & professionals going to this event in ${event.city}!`}
                </p>

                {attendees.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {attendees.slice(0, 5).map((att) => (
                      <div key={att.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs">
                        <div className="w-6 h-6 rounded-full bg-purple-DEFAULT flex items-center justify-center font-bold text-white text-[10px]">
                          {(att.full_name || 'U')[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-zoku-text">{att.full_name || 'Tribe Member'}</p>
                          {att.hometown && <p className="text-[10px] text-muted">From {att.hometown}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-purple-DEFAULT/10 rounded-xl border border-purple-DEFAULT/20 text-xs text-purple-DEFAULT">
                    <span>✨</span> RSVPing shows your profile to fellow attendees with shared interests.
                  </div>
                )}
              </div>

              {event.organizer && (
                <div className="glow-card p-5">
                  <h2 className="font-bold text-zoku-text mb-3">Organized by</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber to-pink flex items-center justify-center text-white font-bold text-sm">
                      {event.organizer[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-zoku-text text-sm">{event.organizer}</p>
                      <p className="text-xs text-muted">Event Organizer</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ticket card */}
            <div className="lg:col-span-1">
              <div className="glow-card p-6 sticky top-24">
                <div className="mb-4">
                  {event.is_free ? (
                    <div>
                      <p className="text-muted text-sm mb-1">Entry</p>
                      <p className="text-3xl font-black text-green">FREE</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted text-sm mb-1">Ticket Price</p>
                      <p className="text-3xl font-black text-zoku-text">₹{event.price}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted mb-5">
                  <Users size={11} />
                  <span>{event.rsvp_count.toLocaleString()} already going</span>
                </div>
                <button className="btn-primary w-full !py-3.5 !rounded-xl mb-3">
                  {event.is_free ? '✅ RSVP Now' : '🎟️ Buy Ticket'}
                </button>
                <button className="btn-secondary w-full !py-3.5 !rounded-xl">
                  📤 Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
