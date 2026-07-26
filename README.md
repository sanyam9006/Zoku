# ZOKU 族 — Find Your Tribe in Every City

Zoku helps students and young professionals who relocate to a new city find verified hostels/PGs, gyms, sports clubs, and events — and connect with people going through the same move. Housing, fitness, activities, and community, in one place, instead of five different apps and a dozen WhatsApp groups.

**Live demo:** [zoku-nine.vercel.app](https://zoku-nine.vercel.app/)

---

## Why

Moving to a new city means solving the same five problems every time: where to live, where to work out, how to stay active, what's happening this weekend, and who your people are going to be. Zoku bundles all five into one product built around a single idea — you shouldn't have to start from zero every time you land in a new place.

## Features

- 🏠 **Hostels & PGs** — browse verified stays by city, price range, gender preference, and amenities
- 💪 **Gyms & fitness** — gyms, yoga studios, CrossFit boxes, and swimming with timings and pricing
- 🏸 **Sports clubs** — find clubs by sport and skill level, see schedules and member counts
- 🎉 **Events** — city events across music, tech, culture, sports, and more, with RSVP
- 🤝 **Community** — discover and connect with people by interest, hometown, college, or company
- 👤 **Profiles & onboarding** — guided setup that captures who you are and what you're into
- 🔐 **Auth** — email/password and Google OAuth via Supabase
- 🛠️ **Owner dashboard & admin panel** — listing management and platform moderation tooling

## Tech stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend / Auth / DB | [Supabase](https://supabase.com/) (Postgres + Row Level Security) |
| Animation | Framer Motion |
| Icons | Lucide, Heroicons |
| Hosting | Vercel |

## Project structure

```
app/                # Next.js App Router pages (hostels, gyms, sports, events, community, ...)
components/         # Reusable UI components (cards, navbar, modals)
context/            # React context (e.g. selected-city state)
lib/
  data.ts           # Sample/seed data for listings
  types.ts          # Shared TypeScript types
  supabase/         # Supabase client, server, and middleware helpers
supabase/
  schema.sql        # Full Postgres schema with RLS policies
```

## Data model

The Supabase schema covers profiles, hostels, gyms, sports clubs, events, RSVPs, connections, club memberships, enquiries, saved listings, reviews, and posts — all with Row Level Security policies scoping access to the right owner or participant. See [`supabase/schema.sql`](./supabase/schema.sql) for the full definition.

## Getting started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) project

### Setup

```bash
git clone https://github.com/sanyam9006/Zoku.git
cd Zoku
npm install
```

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Set up the database by running [`supabase/schema.sql`](./supabase/schema.sql) in your Supabase project's SQL editor.

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roadmap

- [ ] Move listings from static seed data to live Supabase queries
- [ ] Direct messaging between connected users
- [ ] Map view for hostels and gyms
- [ ] Reviews with photos
- [ ] Notifications for enquiries, connections, and event reminders
- [ ] Role-gated admin and owner dashboards

## Contributing

Issues and PRs are welcome. If you're picking up a roadmap item, feel free to open an issue first to coordinate.

## License

MIT
