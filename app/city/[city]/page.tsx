'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CITIES, HOSTELS, GYMS, EVENTS, SPORTS_CLUBS } from '@/lib/data';
import { notFound } from 'next/navigation';
import ListingCard from '@/components/ListingCard';
import EventCard from '@/components/EventCard';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';

export default function CityPage({ params }: { params: { city: string } }) {
  const city = CITIES.find((c) => c.slug === params.city);

  const [hostels, setHostels] = useState<any[]>(() => HOSTELS.filter((h) => h.city.toLowerCase() === city?.name.toLowerCase()));
  const [events, setEvents] = useState<any[]>(() => EVENTS.filter((e) => e.city.toLowerCase() === city?.name.toLowerCase()));
  const [gymsCount, setGymsCount] = useState<number>(() => GYMS.filter((g) => g.city.toLowerCase() === city?.name.toLowerCase()).length);
  const [sportsCount, setSportsCount] = useState<number>(() => SPORTS_CLUBS.filter((s) => s.city.toLowerCase() === city?.name.toLowerCase()).length);

  useEffect(() => {
    async function fetchCityData() {
      if (!city) return;
      const [hRes, eRes, gRes, sRes] = await Promise.all([
        supabase.from('hostels').select('*').ilike('city', city.name),
        supabase.from('events').select('*').ilike('city', city.name),
        supabase.from('gyms').select('id', { count: 'exact', head: true }).ilike('city', city.name),
        supabase.from('sports_clubs').select('id', { count: 'exact', head: true }).ilike('city', city.name),
      ]);
      if (hRes.data && hRes.data.length > 0) setHostels(hRes.data);
      if (eRes.data && eRes.data.length > 0) setEvents(eRes.data);
      if (gRes.count !== null && gRes.count > 0) setGymsCount(gRes.count);
      if (sRes.count !== null && sRes.count > 0) setSportsCount(sRes.count);
    }
    fetchCityData();
  }, [city]);

  if (!city) return null;

  const cityHostels = hostels.slice(0, 3);
  const cityEvents = events.slice(0, 3);

  const cityStats = [
    { label: 'Hostels & PGs', val: hostels.length || '20+', color: 'text-purple-DEFAULT' },
    { label: 'Gyms', val: gymsCount || '15+', color: 'text-cyan' },
    { label: 'Sports Clubs', val: sportsCount || '10+', color: 'text-green' },
    { label: 'Events/Month', val: '50+', color: 'text-amber' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 pb-24">
        {/* Hero */}
        <div className="relative h-80 overflow-hidden">
          <Image src={city.image} alt={city.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zoku-bg via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <p className="text-muted text-sm mb-2">Explore</p>
              <h1 className="text-5xl font-black text-white">{city.name} <span className="gradient-text">族</span></h1>
              <p className="text-muted mt-2">{city.listings}+ listings · Your city, your tribe.</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-zoku-card border-b border-t border-zoku-border">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {cityStats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { label: '🏠 Find Hostels', href: `/hostels`, color: 'border-purple-DEFAULT/30 text-purple-DEFAULT hover:bg-purple-DEFAULT/10' },
              { label: '💪 Find Gyms', href: `/gyms`, color: 'border-cyan/30 text-cyan hover:bg-cyan/10' },
              { label: '⚽ Sports Clubs', href: `/sports`, color: 'border-green/30 text-green hover:bg-green/10' },
              { label: '🎉 See Events', href: `/events`, color: 'border-amber/30 text-amber hover:bg-amber/10' },
              { label: '👥 Meet People', href: `/community`, color: 'border-pink/30 text-pink hover:bg-pink/10' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${link.color}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hostels in city */}
          {cityHostels.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-zoku-text mb-6">🏠 Top Hostels in {city.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cityHostels.map((h) => <ListingCard key={h.id} hostel={h} />)}
              </div>
            </div>
          )}

          {/* Events in city */}
          {cityEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-zoku-text mb-6">🎉 Events in {city.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cityEvents.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
