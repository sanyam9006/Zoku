import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GYMS } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Star, MapPin, Clock, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function generateStaticParams() {
  return GYMS.map((g) => ({ id: g.id }));
}

const TYPE_ICONS: Record<string, string> = {
  gym: '💪', yoga: '🧘', crossfit: '🔥', swimming: '🏊', mixed: '⚡',
};

export default function GymDetailPage({ params }: { params: { id: string } }) {
  const gym = GYMS.find((g) => g.id === params.id);
  if (!gym) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 pb-24">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/gyms" className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple-DEFAULT mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Gyms
          </Link>

          {/* Photo */}
          <div className="relative rounded-2xl overflow-hidden h-72 mb-8">
            <Image src={gym.photos[0]} alt={gym.name} fill className="object-cover" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="neon-pill bg-purple-DEFAULT/10 text-purple-DEFAULT border border-purple-DEFAULT/20">
                    {TYPE_ICONS[gym.gym_type]} {gym.gym_type.charAt(0).toUpperCase() + gym.gym_type.slice(1)}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-zoku-text mb-2">{gym.name}</h1>
                <div className="flex items-center gap-2 text-muted text-sm mb-1">
                  <MapPin size={14} /><span>{gym.address}</span>
                </div>
                <div className="flex items-center gap-2 text-muted text-sm mb-1">
                  <Clock size={14} /><span>{gym.timing}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Star size={16} className="text-amber fill-amber" />
                  <span className="text-zoku-text font-bold">{gym.rating}</span>
                  <span className="text-muted text-sm">({gym.reviews_count} reviews)</span>
                </div>
              </div>

              {gym.description && (
                <div className="glow-card p-5">
                  <h2 className="font-bold text-zoku-text mb-3">About</h2>
                  <p className="text-muted text-sm leading-relaxed">{gym.description}</p>
                </div>
              )}

              {gym.amenities && (
                <div className="glow-card p-5">
                  <h2 className="font-bold text-zoku-text mb-4">Facilities</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {gym.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 text-sm text-muted">
                        <CheckCircle2 size={14} className="text-cyan shrink-0" />{a}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking card */}
            <div className="lg:col-span-1">
              <div className="glow-card p-6 sticky top-24">
                <p className="text-muted text-sm mb-1">Membership</p>
                <p className="text-3xl font-black text-zoku-text mb-1">₹{gym.price_min.toLocaleString()}</p>
                <p className="text-xs text-muted mb-6">per month</p>
                <button className="btn-primary w-full !py-3.5 !rounded-xl mb-3">📞 Enquire Now</button>
                <button className="btn-secondary w-full !py-3.5 !rounded-xl">🔖 Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
