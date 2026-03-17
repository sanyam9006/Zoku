'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Wifi, Shield, Heart } from 'lucide-react';
import type { Hostel } from '@/lib/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import AuthModal from './AuthModal';

interface ListingCardProps {
  hostel: Hostel;
}

export default function ListingCard({ hostel }: ListingCardProps) {
  const [liked, setLiked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkSaved() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('saved_listings')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', hostel.id)
          .eq('listing_type', 'hostel')
          .single();
        if (data) setLiked(true);
      }
    }
    checkSaved();
  }, [hostel.id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (liked) {
      const { error } = await supabase
        .from('saved_listings')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', hostel.id)
        .eq('listing_type', 'hostel');
      if (!error) setLiked(false);
    } else {
      const { error } = await supabase
        .from('saved_listings')
        .insert({ user_id: user.id, listing_id: hostel.id, listing_type: 'hostel' });
      if (!error) setLiked(true);
    }
  };

  const genderColor = {
    boys: 'text-cyan bg-cyan/10 border-cyan/20',
    girls: 'text-pink bg-pink/10 border-pink/20',
    mixed: 'text-purple-DEFAULT bg-purple-DEFAULT/10 border-purple-DEFAULT/20',
  }[hostel.gender];

  const genderLabel = { boys: '👦 Boys', girls: '👧 Girls', mixed: '🧑‍🤝‍🧑 Mixed' }[hostel.gender];

  return (
    <>
      <Link href={`/hostels/${hostel.id}`} className="block group">
      <div className="glow-card overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={hostel.photos[0]}
            alt={hostel.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {hostel.verified && (
              <span className="neon-pill bg-green/10 text-green border border-green/20">
                <Shield size={10} />
                Verified
              </span>
            )}
            <span className={`neon-pill border ${genderColor}`}>
              {genderLabel}
            </span>
          </div>

          {/* Like button */}
          <button
            onClick={handleSave}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/60"
          >
            <Heart size={14} className={liked ? 'text-pink fill-pink' : 'text-white'} />
          </button>

          {/* Price */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-right">
            <p className="text-xs text-muted">from</p>
            <p className="text-sm font-bold text-white">₹{hostel.price_min.toLocaleString()}<span className="text-muted text-xs font-normal">/mo</span></p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="font-bold text-zoku-text text-sm leading-tight line-clamp-1 group-hover:text-purple-DEFAULT transition-colors">
              {hostel.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={12} className="text-amber fill-amber" />
              <span className="text-sm font-bold text-zoku-text">{hostel.rating}</span>
              <span className="text-xs text-muted">({hostel.reviews_count})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted mb-3">
            <MapPin size={11} />
            <span className="line-clamp-1">{hostel.address}</span>
            {hostel.distance && (
              <span className="ml-auto shrink-0 text-cyan font-semibold">{hostel.distance} km</span>
            )}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5">
            {hostel.amenities.slice(0, 4).map((amenity) => (
              <span key={amenity} className="text-xs px-2 py-0.5 rounded-full bg-zoku-card2 text-muted border border-zoku-border">
                {amenity}
              </span>
            ))}
            {hostel.amenities.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-DEFAULT/5 text-purple-DEFAULT border border-purple-DEFAULT/20">
                +{hostel.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>
      </Link>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        title="Save Hostels"
        description="Join ZOKU to save hostels, compare options, and find your perfect stay."
      />
    </>
  );
}
