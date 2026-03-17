export interface Hostel {
  id: string;
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
  owner_name?: string;
  contact?: string;
}

export interface Gym {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  type: 'gym' | 'yoga' | 'crossfit' | 'swimming' | 'mixed';
  timing: string;
  photos: string[];
  rating: number;
  reviews_count: number;
  distance?: number;
  description?: string;
  amenities?: string[];
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
  contact: string;
  distance?: number;
  description?: string;
  photos?: string[];
}

export interface Event {
  id: string;
  title: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  date: string;
  category: 'music' | 'sports' | 'tech' | 'culture' | 'networking' | 'college' | 'comedy' | 'food';
  price: number;
  is_free: boolean;
  photos: string[];
  rsvp_count: number;
  organizer?: string;
  description?: string;
  time?: string;
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
