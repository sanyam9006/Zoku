'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Navigation, ExternalLink, Star } from 'lucide-react';

interface MapItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  address?: string;
  price_min?: number;
  rating?: number;
  photos?: string[];
  type?: string;
}

interface MapViewProps {
  items: MapItem[];
  category: 'hostel' | 'gym' | 'event';
}

export default function MapView({ items, category }: MapViewProps) {
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(items[0] || null);

  // Compute map center or fallback to Bangalore coords
  const centerLat = items.length > 0 ? items.reduce((acc, i) => acc + i.lat, 0) / items.length : 12.9716;
  const centerLng = items.length > 0 ? items.reduce((acc, i) => acc + i.lng, 0) / items.length : 77.5946;

  // Build OpenStreetMap embed URL with bbox or marker
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.08}%2C${centerLat - 0.08}%2C${centerLng + 0.08}%2C${centerLat + 0.08}&layer=mapnik&marker=${selectedItem?.lat || centerLat}%2C${selectedItem?.lng || centerLng}`;

  return (
    <div className="glow-card overflow-hidden rounded-3xl border border-zoku-border grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
      {/* Map Column */}
      <div className="lg:col-span-8 relative bg-zoku-bg min-h-[350px] lg:min-h-[500px]">
        <iframe
          title="Zoku Map View"
          width="100%"
          height="100%"
          className="w-full h-full border-0 grayscale brightness-90 contrast-125 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
          loading="lazy"
          src={mapUrl}
        />

        {/* Map Overlay Badge */}
        <div className="absolute top-4 left-4 bg-zoku-card/90 backdrop-blur-md border border-zoku-border px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-zoku-text shadow-lg">
          <MapPin size={14} className="text-purple-DEFAULT" />
          <span>Interactive Location View ({items.length} locations)</span>
        </div>
      </div>

      {/* Item List / Detail Sidebar Column */}
      <div className="lg:col-span-4 p-5 bg-zoku-card flex flex-col justify-between overflow-y-auto max-h-[500px]">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zoku-border">
            <h3 className="font-bold text-zoku-text text-sm uppercase tracking-wider">Locations List</h3>
            <span className="text-xs text-muted font-semibold">{items.length} Pins</span>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-DEFAULT/15 border-purple-DEFAULT text-zoku-text shadow-md'
                      : 'bg-zoku-bg/60 border-zoku-border text-muted hover:border-purple-DEFAULT/40 hover:text-zoku-text'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-sm text-zoku-text line-clamp-1">{item.name}</h4>
                    {item.rating && (
                      <span className="text-xs font-bold text-amber shrink-0 flex items-center gap-0.5">
                        <Star size={10} className="fill-amber" /> {item.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted line-clamp-1 mb-2">📍 {item.address || item.city}</p>
                  <div className="flex items-center justify-between text-xs">
                    {item.price_min && (
                      <span className="font-bold text-zoku-text">₹{item.price_min.toLocaleString()}/mo</span>
                    )}
                    <span className="text-[10px] text-purple-DEFAULT font-semibold">
                      {item.lat.toFixed(3)}, {item.lng.toFixed(3)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Item Quick Action */}
        {selectedItem && (
          <div className="mt-4 pt-3 border-t border-zoku-border">
            <Link
              href={`/${category === 'hostel' ? 'hostels' : category === 'gym' ? 'gyms' : 'events'}/${selectedItem.id}`}
              className="btn-primary w-full !py-2.5 !rounded-xl !text-xs flex items-center justify-center gap-1.5"
            >
              <span>View Location Details</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
