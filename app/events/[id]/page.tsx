import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EVENTS } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

const CATEGORY_EMOJIS: Record<string, string> = {
  music: '🎵', sports: '⚽', tech: '💻', culture: '🎭',
  networking: '🤝', college: '🎓', comedy: '😂', food: '🍕',
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = EVENTS.find((e) => e.id === params.id);
  if (!event) return notFound();

  const emoji = CATEGORY_EMOJIS[event.category] || '🎉';
  const dateObj = new Date(event.date);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple-DEFAULT mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Events
          </Link>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden h-72 mb-8 relative">
            <img src={event.photos[0]} alt={event.title} className="w-full h-full object-cover" />
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
                  {event.time && (
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <Clock size={16} className="text-cyan shrink-0" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <MapPin size={16} className="text-pink shrink-0" />
                    <span>{event.address}, {event.city}</span>
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
