import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SPORTS_CLUBS } from '@/lib/data';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Users, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  return SPORTS_CLUBS.map((c) => ({ id: c.id }));
}

const SPORT_ICONS: Record<string, string> = {
  Football: '⚽', Badminton: '🏸', Cricket: '🏏', Basketball: '🏀',
  Chess: '♟️', Running: '🏃', Tennis: '🎾', Volleyball: '🏐',
};

export default function SportsDetailPage({ params }: { params: { id: string } }) {
  const club = SPORTS_CLUBS.find((c) => c.id === params.id);
  if (!club) return notFound();

  const icon = SPORT_ICONS[club.sport] || '🏅';
  const skillColors: Record<string, string> = {
    beginner: 'text-green bg-green/10 border-green/20',
    intermediate: 'text-amber bg-amber/10 border-amber/20',
    advanced: 'text-pink bg-pink/10 border-pink/20',
    all: 'text-purple-DEFAULT bg-purple-DEFAULT/10 border-purple-DEFAULT/20',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/sports" className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple-DEFAULT mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Sports
          </Link>

          <div className="glow-card p-8 mb-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green/20 to-cyan/20 border border-green/20 flex items-center justify-center text-5xl shrink-0">
                {icon}
              </div>
              <div>
                <h1 className="text-3xl font-black text-zoku-text mb-2">{club.name}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className={`neon-pill border ${skillColors[club.skill_level]}`}>
                    {club.skill_level.charAt(0).toUpperCase() + club.skill_level.slice(1)} Level
                  </span>
                  <span className="neon-pill bg-cyan/10 text-cyan border border-cyan/20">{club.sport}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-muted">
                <MapPin size={16} className="text-green shrink-0" /><span>{club.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Calendar size={16} className="text-cyan shrink-0" /><span>{club.schedule}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Users size={16} className="text-purple-DEFAULT shrink-0" /><span>{club.members_count} members</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Phone size={16} className="text-amber shrink-0" /><span>{club.phone}</span>
              </div>
            </div>

            {club.description && (
              <p className="text-muted text-sm leading-relaxed mb-6">{club.description}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary flex-1 !py-3.5 !rounded-xl">🤝 Join This Club</button>
              <button className="btn-secondary flex-1 !py-3.5 !rounded-xl">📞 Contact Organizer</button>
            </div>
          </div>

          {/* Members */}
          <div className="glow-card p-6">
            <h2 className="font-bold text-zoku-text mb-4">Recent Members</h2>
            <div className="flex -space-x-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-zoku-card bg-gradient-to-br ${['from-purple-DEFAULT to-pink', 'from-cyan to-purple-DEFAULT', 'from-green to-cyan', 'from-amber to-pink'][i % 4]} flex items-center justify-center text-xs font-bold text-white`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-zoku-card bg-zoku-card2 flex items-center justify-center text-xs font-bold text-muted">
                +{club.members_count - 8}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
