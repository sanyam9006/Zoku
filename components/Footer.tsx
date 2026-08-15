'use client';

import Link from 'next/link';
import { MapPin, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const FOOTER_LINKS = {
  'Discover': [
    { label: 'Hostels & PG', href: '/hostels' },
    { label: 'Gyms & Fitness', href: '/gyms' },
    { label: 'Sports Clubs', href: '/sports' },
    { label: 'Events', href: '/events' },
    { label: 'Community', href: '/community' },
  ],
  'Cities': [
    { label: 'Jaipur', href: '/city/jaipur' },
    { label: 'Delhi', href: '/city/delhi' },
    { label: 'Mumbai', href: '/city/mumbai' },
    { label: 'Bangalore', href: '/city/bangalore' },
    { label: 'Pune', href: '/city/pune' },
  ],
  'Portals': [
    { label: 'Owner Dashboard', href: '/dashboard' },
    { label: 'Admin Panel', href: '/admin' },
    { label: 'Messages & Inbox', href: '/inbox' },
    { label: 'User Profile', href: '/profile' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'List Your Property', href: '/dashboard' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-zoku-card border-t border-zoku-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-white font-black text-lg shadow-neon-purple">
                族
              </div>
              <span className="text-2xl font-black tracking-widest text-zoku-text">ZOKU</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs mb-5">
              Find your tribe in every city. Verified hostels, gyms, sports clubs, events, and a community of like-minded people — all in one place.
            </p>
            <p className="text-xs text-muted/70 italic mb-4">
              🪷 Inspired by the lotus — blooming beautifully wherever it is planted.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Twitter size={16} />, href: '#' },
                { icon: <Instagram size={16} />, href: '#' },
                { icon: <Linkedin size={16} />, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className="w-9 h-9 rounded-xl bg-zoku-card2 border border-zoku-border flex items-center justify-center text-muted hover:text-purple-DEFAULT hover:border-purple-DEFAULT transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-bold text-zoku-text text-sm mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-purple-DEFAULT transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-zoku-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted">
            © 2025 ZOKU Technologies Pvt. Ltd. · Made with 💜 in India
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-purple-DEFAULT transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-DEFAULT transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
