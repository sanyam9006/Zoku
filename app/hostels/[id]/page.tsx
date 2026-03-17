'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HOSTELS } from '@/lib/data';
import { 
  MapPin, Star, ShieldCheck, Coffee, Wifi, 
  Wind, Lock, Users, Phone, ChevronLeft, 
  ChevronRight, Share2, Heart, MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function HostelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const hostel = HOSTELS.find((h) => h.id === id);

  const [activePhoto, setActivePhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!hostel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zoku-bg">
        <h1 className="text-2xl font-bold text-zoku-text mb-4">Hostel not found</h1>
        <Link href="/hostels" className="btn-primary">Back to Hostels</Link>
      </div>
    );
  }

  const amenities = [
    { icon: <Wifi size={20} />, label: 'Free High-speed Wi-Fi' },
    { icon: <Wind size={20} />, label: 'Air Conditioning' },
    { icon: <Coffee size={20} />, label: 'Breakfast Included' },
    { icon: <Lock size={20} />, label: 'Personal Lockers' },
    { icon: <Users size={20} />, label: 'Social Common Room' },
  ];

  return (
    <div className="min-h-screen bg-zoku-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Actions */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted hover:text-zoku-text transition-colors font-bold text-sm"
            >
              <ChevronLeft size={18} /> Back to Search
            </button>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl bg-zoku-card border border-zoku-border text-muted hover:text-purple-DEFAULT transition-all">
                <Share2 size={18} />
              </button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-xl bg-zoku-card border border-zoku-border transition-all ${isLiked ? 'text-pink border-pink/30' : 'text-muted hover:text-pink'}`}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

          {/* Title & Location Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className={`neon-pill font-bold text-xs ${
                hostel.gender === 'boys' ? 'bg-cyan/10 text-cyan border-cyan/20' : 
                hostel.gender === 'girls' ? 'bg-pink/10 text-pink border-pink/20' : 
                'bg-purple-DEFAULT/10 text-purple-DEFAULT border-purple-DEFAULT/20'
              }`}>
                {hostel.gender === 'boys' ? '♂ Boys Only' : hostel.gender === 'girls' ? '♀ Girls Only' : '🧑‍🤝‍🧑 Mixed'}
              </span>
              {hostel.verified && (
                <span className="neon-pill bg-green/10 text-green border border-green/20 font-bold text-xs flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zoku-text mb-4 tracking-tight">{hostel.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-muted">
              <div className="flex items-center gap-1.5 font-bold">
                <MapPin size={18} className="text-purple-DEFAULT" />
                <span>{hostel.address}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Star size={18} className="text-amber fill-amber" />
                <span className="text-zoku-text">{hostel.rating}</span>
                <span className="text-xs">({hostel.reviews_count} reviews)</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">
            <div className="md:col-span-8 relative rounded-[2.5rem] overflow-hidden bg-zoku-card aspect-video border border-zoku-border shadow-2xl">
              <img 
                src={hostel.photos[activePhoto]} 
                alt={hostel.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
                <p className="text-white font-bold">View of the {activePhoto === 0 ? 'Main Entrance' : activePhoto === 1 ? 'Common Area' : 'Luxury Room'}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActivePhoto(prev => (prev > 0 ? prev - 1 : hostel.photos.length - 1))}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all text-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActivePhoto(prev => (prev < hostel.photos.length - 1 ? prev + 1 : 0))}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all text-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 grid grid-cols-1 gap-4">
              {hostel.photos.slice(0, 2).map((photo, i) => (
                <div 
                  key={i}
                  className={`relative rounded-[2rem] overflow-hidden bg-zoku-card h-full border-2 transition-all cursor-pointer ${activePhoto === i ? 'border-purple-DEFAULT scale-[0.98]' : 'border-zoku-border'}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-all" />
                </div>
              ))}
              <div className="relative rounded-[2rem] overflow-hidden bg-zoku-card h-full border border-zoku-border group cursor-pointer">
                <img src={hostel.photos[2] || hostel.photos[0]} alt="" className="w-full h-full object-cover opacity-50 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-xl">+ {hostel.photos.length - 2} Photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              {/* Description */}
              <section className="mb-12">
                <h2 className="text-2xl font-black text-zoku-text mb-6">About this Stay</h2>
                <p className="text-muted text-lg leading-relaxed mb-8">
                  {hostel.description || `Located in the heart of ${hostel.city}, ${hostel.name} offers a premium living experience tailored for students and working professionals. With modern architecture and a community-driven atmosphere, it's more than just a place to sleep.`}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zoku-card border border-zoku-border group hover:border-purple-DEFAULT transition-all">
                      <div className="w-10 h-10 rounded-xl bg-purple-DEFAULT/10 flex items-center justify-center text-purple-DEFAULT group-hover:bg-purple-DEFAULT group-hover:text-white transition-all">
                        {amenity.icon}
                      </div>
                      <span className="font-bold text-zoku-text">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Location Map Placeholder */}
              <section className="mb-12">
                <h2 className="text-2xl font-black text-zoku-text mb-6">Location</h2>
                <div className="w-full aspect-[21/9] bg-zoku-card border border-zoku-border rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200')] bg-cover bg-center grayscale opacity-30 group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-purple-DEFAULT rounded-full flex items-center justify-center text-white shadow-neon-purple animate-pulse">
                        <MapPin size={24} />
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-xl whitespace-nowrap">
                        <span className="text-xs font-black text-black">{hostel.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <p className="text-white text-sm font-bold bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                      {hostel.address}
                    </p>
                    <button className="btn-primary !py-2 !px-4 !text-xs !rounded-xl">Open in Maps</button>
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-zoku-text">Reviews</h2>
                  <button className="text-purple-DEFAULT font-bold hover:underline">Write a review</button>
                </div>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-zoku-card border border-zoku-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white font-bold`}>
                            {i === 1 ? 'A' : 'R'}
                          </div>
                          <div>
                            <p className="font-bold text-zoku-text">{i === 1 ? 'Ananya Singh' : 'Rahul Verma'}</p>
                            <p className="text-xs text-muted">Stayed 3 months ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber">
                          {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= (i === 1 ? 5 : 4) ? 'fill-current' : ''} />)}
                        </div>
                      </div>
                      <p className="text-muted leading-relaxed">
                        {i === 1 
                          ? "The best hostel I've stayed in Bangalore. The common areas are so vibrant and I've made so many friends here already. The Wi-Fi is perfect for my remote work!" 
                          : "Great location and very clean. The management is responsive. Only small issue was the laundry room being busy sometimes, but overall 4/5."}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sticky Booking Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-zoku-card border border-zoku-border rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                  <div className="orb w-32 h-32 bg-purple-DEFAULT -top-16 -right-16 opacity-10" />
                  
                  <div className="relative z-10">
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-black text-zoku-text">₹{hostel.price_min.toLocaleString()}</span>
                      <span className="text-muted font-bold">/ month</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-zoku-bg border border-zoku-border">
                        <span className="text-sm font-bold text-muted">Room Type</span>
                        <span className="text-sm font-black text-zoku-text">Double Sharing</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-zoku-bg border border-zoku-border">
                        <span className="text-sm font-bold text-muted">Availability</span>
                        <span className="text-sm font-black text-green">3 Units Left</span>
                      </div>
                    </div>

                    <button className="w-full btn-primary !py-4 !rounded-2xl mb-4 group shadow-neon-purple font-black tracking-wide">
                      RESERVE NOW 
                    </button>
                    <button className="w-full py-4 rounded-2xl bg-zoku-bg border border-zoku-border text-zoku-text font-black text-sm hover:bg-zoku-card transition-all flex items-center justify-center gap-2">
                      <Phone size={18} /> CONTACT OWNER
                    </button>
                    
                    <p className="text-[10px] text-center text-muted mt-4 font-bold uppercase tracking-widest">
                      Free cancellation within 24 hours
                    </p>
                  </div>
                </div>

                {/* Owner info */}
                <div className="bg-zoku-card border border-zoku-border rounded-[2.5rem] p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan to-blue-500 flex items-center justify-center text-white font-black text-xl">
                    {hostel.owner_name?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <p className="text-xs text-muted font-bold uppercase">Managed by</p>
                    <p className="font-black text-zoku-text">{hostel.owner_name || 'Premium Stays Ltd'}</p>
                    <div className="flex items-center gap-1 text-green text-[10px] font-black uppercase">
                       <ShieldCheck size={10} /> Certified Provider
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
