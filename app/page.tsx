import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import ScrollButton from '@/components/ScrollButton';
import { HOSTELS, GYMS, EVENTS, SPORTS_CLUBS, CITIES } from '@/lib/data';
import ListingCard from '@/components/ListingCard';
import EventCard from '@/components/EventCard';

const STATS = [
  { value: '10,000+', label: 'Verified Listings', color: 'text-purple-DEFAULT' },
  { value: '50,000+', label: 'Happy Users', color: 'text-pink' },
  { value: '6', label: 'Cities & Growing', color: 'text-cyan' },
  { value: '4.8★', label: 'Avg Rating', color: 'text-amber' },
];

const FEATURES = [
  {
    icon: '🏠',
    title: 'Hostel & PG Finder',
    desc: 'Find verified, safe hostels near your college or office. Photos, reviews, amenities — everything you need.',
    color: 'from-purple-DEFAULT to-pink',
    href: '/hostels',
  },
  {
    icon: '💪',
    title: 'Gym & Fitness',
    desc: 'Discover gyms, yoga studios, and CrossFit centers nearby. Filter by price, type, and distance.',
    color: 'from-cyan to-purple-DEFAULT',
    href: '/gyms',
  },
  {
    icon: '⚽',
    title: 'Sports Clubs',
    desc: 'Join local sports clubs — football, cricket, badminton, and more. Connect with fellow players.',
    color: 'from-green to-cyan',
    href: '/sports',
  },
  {
    icon: '🎉',
    title: 'Events & Nightlife',
    desc: 'Discover the best college fests, open mics, meetups, and cultural events happening in your city.',
    color: 'from-amber to-pink',
    href: '/events',
  },
  {
    icon: '👥',
    title: 'Community Tribe',
    desc: 'Connect with people from your hometown, college, or company. Build friendships in your new city.',
    color: 'from-green to-purple-DEFAULT',
    href: '/community',
  },
  {
    icon: '🗺️',
    title: 'City Explorer',
    desc: 'Explore your new city like a local — hidden gems, food spots, markets, and neighborhoods.',
    color: 'from-pink to-amber',
    href: '/explore',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose Your City', desc: 'Select from 6+ cities across India', icon: '🏙️' },
  { step: '02', title: 'Tell Us About You', desc: 'Enter your college, office, or area of interest', icon: '👤' },
  { step: '03', title: 'Discover Everything', desc: 'Browse hostels, gyms, sports clubs, and events', icon: '🔭' },
  { step: '04', title: 'Find Your Tribe', desc: 'Connect with like-minded people in your city', icon: '🤝' },
];

export default function HomePage() {
  const featuredHostels = HOSTELS.filter((h) => h.verified).slice(0, 3);
  const featuredEvents = EVENTS.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative animated-bg min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Floating orbs */}
        <div className="orb w-96 h-96 bg-purple-DEFAULT top-20 -left-20" />
        <div className="orb w-80 h-80 bg-pink top-40 right-10" />
        <div className="orb w-72 h-72 bg-cyan bottom-20 left-1/4" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-purple-DEFAULT/30 backdrop-blur-sm text-sm font-medium text-purple-DEFAULT mb-8">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse-glow" />
            🇮🇳 Built for India&apos;s Next Generation
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-none text-zoku-text">
            Find Your <span className="gradient-text">Tribe</span>
            <br />
            in Every <span className="gradient-text-cyan">City</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            New city? No problem. ZOKU helps you find <strong className="text-zoku-text">verified hostels</strong>, nearby <strong className="text-zoku-text">gyms</strong>, local <strong className="text-zoku-text">sports clubs</strong>, exciting <strong className="text-zoku-text">events</strong>, and most importantly — <strong className="text-zoku-text">your people.</strong>
          </p>

          {/* Search box */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10">
            <div className="flex-1 flex items-center gap-2 glass rounded-2xl px-4 py-3">
              <span className="text-xl">🔍</span>
              <input
                placeholder="College name, office, or area..."
                className="bg-transparent text-sm text-zoku-text placeholder-muted outline-none w-full"
              />
            </div>
            <Link href="/explore" className="btn-primary !rounded-2xl !px-6 !py-3 !text-base whitespace-nowrap">
              Explore Now →
            </Link>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['🏠 Hostels', '💪 Gyms', '⚽ Sports', '🎉 Events', '👥 Tribe'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-white border border-zoku-border text-sm text-muted hover:text-purple-DEFAULT hover:border-purple-DEFAULT transition-all cursor-pointer">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                <p className={`text-2xl sm:text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <ScrollButton />
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="neon-pill bg-purple-DEFAULT/10 text-purple-DEFAULT border border-purple-DEFAULT/20 mb-4 inline-block">
            Everything You Need
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-zoku-text mb-4">
            One Platform. <span className="gradient-text">Infinite Possibilities.</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            From finding a safe home to building friendships — ZOKU has it all.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <Link key={feature.title} href={feature.href} className="group block">
              <div className="glow-card p-6 h-full">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-zoku-text text-lg mb-2 group-hover:gradient-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-zoku-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="neon-pill bg-cyan/10 text-cyan border border-cyan/20 mb-4 inline-block">Simple Process</span>
            <h2 className="text-4xl font-black text-zoku-text mb-4">
              Get Started in <span className="gradient-text-cyan">4 Easy Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative text-center group">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-purple-DEFAULT/40 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-DEFAULT to-pink flex items-center justify-center text-3xl mx-auto mb-4 shadow-neon-purple group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-xs font-black text-purple-DEFAULT/50 tracking-widest">{step.step}</span>
                <h3 className="font-bold text-zoku-text text-base mt-1 mb-2">{step.title}</h3>
                <p className="text-muted text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOSTELS ── */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="neon-pill bg-purple-DEFAULT/10 text-purple-DEFAULT border border-purple-DEFAULT/20 mb-3 inline-block">Verified Stays</span>
            <h2 className="text-3xl font-black text-zoku-text">Top Hostels & PGs</h2>
          </div>
          <Link href="/hostels" className="btn-secondary !py-2 !px-4 !text-sm hidden sm:flex">
            See All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredHostels.map((hostel) => (
            <ListingCard key={hostel.id} hostel={hostel} />
          ))}
        </div>
      </section>

      {/* ── CITIES ── */}
      <section className="py-20 bg-zoku-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="neon-pill bg-amber/10 text-amber border border-amber/20 mb-4 inline-block">Available In</span>
            <h2 className="text-4xl font-black text-zoku-text mb-4">
              Explore Top <span className="gradient-text-amber">Indian Cities</span>
            </h2>
            <p className="text-muted">More cities launching soon!</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CITIES.map((city) => (
              <Link key={city.slug} href={`/city/${city.slug}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer">
                  <Image src={city.image} alt={city.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-purple-DEFAULT/60 transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                    <p className="font-bold text-white text-sm">{city.name}</p>
                    <p className="text-xs text-white/60">{city.listings}+ listings</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="neon-pill bg-amber/10 text-amber border border-amber/20 mb-3 inline-block">Happening Now</span>
            <h2 className="text-3xl font-black text-zoku-text">Upcoming Events</h2>
          </div>
          <Link href="/events" className="btn-secondary !py-2 !px-4 !text-sm hidden sm:flex">
            See All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-DEFAULT via-pink to-cyan opacity-20" />
            <div className="absolute inset-0 bg-zoku-card/80 backdrop-blur-sm" />
            <div className="absolute inset-0 border border-purple-DEFAULT/30 rounded-3xl" />

            <div className="relative z-10">
              <div className="text-5xl mb-6">🪷</div>
              <h2 className="text-4xl md:text-5xl font-black text-zoku-text mb-4">
                Ready to Find Your <span className="gradient-text">Tribe?</span>
              </h2>
              <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
                Join 50,000+ students and professionals who found their home, health, and happiness with ZOKU.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="btn-primary !py-3.5 !px-8 !text-base !rounded-2xl">
                  🚀 Join ZOKU Free
                </Link>
                <Link href="/explore" className="btn-secondary !py-3.5 !px-8 !text-base !rounded-2xl">
                  Explore the City →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
