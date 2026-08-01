'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Dumbbell } from 'lucide-react';
import type { Gym } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import AuthModal from './AuthModal';

interface GymCardProps {
  gym: Gym;
}

const TYPE_ICONS: Record<string, string> = {
  gym: '💪', yoga: '🧘', crossfit: '🔥', swimming: '🏊', mixed: '⚡',
};

const TYPE_COLORS: Record<string, string> = {
  gym: 'text-purple-DEFAULT bg-purple-DEFAULT/10 border-purple-DEFAULT/20',
  yoga: 'text-green bg-green/10 border-green/20',
  crossfit: 'text-pink bg-pink/10 border-pink/20',
  swimming: 'text-cyan bg-cyan/10 border-cyan/20',
  mixed: 'text-amber bg-amber/10 border-amber/20',
};

export default function GymCard({ gym }: GymCardProps) {
  const [enquired, setEnquired] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkEnquiry() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('gym_enquiries')
          .select('id')
          .eq('user_id', user.id)
          .eq('gym_id', gym.id)
          .single();
        if (data) setEnquired(true);
      }
    }
    checkEnquiry();
  }, [gym.id]);

  const handleEnquire = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!enquired) {
      const { error } = await supabase
        .from('gym_enquiries')
        .insert({ user_id: user.id, gym_id: gym.id, message: 'I am interested in joining this gym.' });
      if (!error) {
        setEnquired(true);
        alert('Enquiry sent successfully!');
      }
    }
  };

  const icon = TYPE_ICONS[gym.gym_type] || '💪';
  const colorClass = TYPE_COLORS[gym.gym_type] || TYPE_COLORS.gym;

  return (
    <Link href={`/gyms/${gym.id}`} className="block group">
      <div className="glow-card overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={gym.photos[0]}
            alt={gym.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-3 left-3">
            <span className={`neon-pill border ${colorClass}`}>
              {icon} {gym.gym_type.charAt(0).toUpperCase() + gym.gym_type.slice(1)}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-right">
            <p className="text-xs text-muted">from</p>
            <p className="text-sm font-bold text-white">₹{gym.price_min.toLocaleString()}<span className="text-muted text-xs font-normal">/mo</span></p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="font-bold text-zoku-text text-sm line-clamp-1 group-hover:text-purple-DEFAULT transition-colors">
              {gym.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={12} className="text-amber fill-amber" />
              <span className="text-sm font-bold text-zoku-text">{gym.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted mb-1">
            <MapPin size={11} />
            <span className="line-clamp-1">{gym.address}</span>
            {gym.distance && (
              <span className="ml-auto shrink-0 text-cyan font-semibold">{gym.distance} km</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted mb-3">
            <Clock size={11} />
            <span>{gym.timing}</span>
          </div>

          <button
            className={`w-full py-2 rounded-xl text-sm font-semibold transition-all border ${
              enquired ? 'bg-green/10 border-green/20 text-green' : 'bg-purple-DEFAULT/10 border-purple-DEFAULT/20 text-purple-DEFAULT hover:bg-purple-DEFAULT/20'
            }`}
            onClick={handleEnquire}
          >
            {enquired ? '✓ Enquired' : 'Enquire →'}
          </button>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        title="Enquire for Gyms"
        description="Join ZOKU to enquire about gyms, get exclusive discounts, and book free trials."
      />
    </Link>
  );
}
