// Types aligned with supabase/schema.sql
// DB uses UUID ids, but we keep `string` since UUID is a string at the JS level.

export interface Hostel {
  id: string;
  owner_id?: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  price_min: number;
  price_max: number;
  gender: 'boys' | 'girls' | 'mixed';
  amenities: string[];
  photos: string[];
  verified: boolean;
  rating: number;
  reviews_count: number;
  distance?: number;
  description?: string;
  phone?: string;
  whatsapp?: string;
  created_at?: string;
  // Legacy fields kept for backward compat during migration
  owner_name?: string;
  contact?: string;
}

export interface Gym {
  id: string;
  owner_id?: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  price_min: number;           // DB column (was `price` in data.ts)
  gym_type: 'gym' | 'yoga' | 'crossfit' | 'swimming' | 'mixed';  // DB column (was `type` in data.ts)
  timing: string;
  photos: string[];
  rating: number;
  distance?: number;
  description?: string;
  amenities?: string[];
  phone?: string;
  reviews_count?: number;
  created_at?: string;
}

export interface SportsClub {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  sport: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  schedule: string;
  members_count: number;
  phone?: string;              // DB column (was `contact` in data.ts)
  contact_name?: string;
  whatsapp?: string;
  distance?: number;
  description?: string;
  photos?: string[];
  created_at?: string;
}

export interface Event {
  id: string;
  organizer_id?: string;
  title: string;
  city: string;
  venue: string;               // DB column (was `address` in data.ts)
  address?: string;            // DB has separate address column
  lat: number;
  lng: number;
  event_date: string;          // DB column (was `date` in data.ts)
  event_time?: string;         // DB column (was `time` in data.ts)
  category: 'music' | 'sports' | 'tech' | 'culture' | 'networking' | 'college' | 'comedy' | 'food';
  price: number;
  is_free: boolean;
  photo?: string;              // DB column — single string (was `photos[]` in data.ts)
  rsvp_count: number;
  max_capacity?: number;
  organizer?: string;
  description?: string;
  created_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
  college?: string;
  company?: string;
  bio?: string;
  hometown?: string;
  interests: string[];
  role: 'user' | 'owner' | 'organizer' | 'admin';
}

export interface Review {
  id: string;
  user_id: string;
  listing_id: string;
  listing_type: 'hostel' | 'gym' | 'sports' | 'event';
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
}

export type Category = 'hostels' | 'gyms' | 'sports' | 'events' | 'community';

export interface City {
  name: string;
  slug: string;
  image: string;
  listings: number;
}
