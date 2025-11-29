
export enum BadgeType {
  SILVER = 'Silver',
  GOLD = 'Gold',
  GOLDEN = 'Golden'
}

export interface ArtistProfile {
  id: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  imageUrl: string;
  badge?: BadgeType;
  followers?: string;
  isFollowed?: boolean;
}

export interface Studio {
  id: string;
  name: string;
  city: string;
  services: string[];
  priceStart: number;
  imageUrl: string;
  type: 'recording' | 'video' | 'sound';
}

export interface Job {
  id: string;
  title: string;
  location: string;
  budget: string;
  type: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  city: string;
  ratePerMin: number;
  imageUrl: string;
}

export interface Product {
  id: string;
  title: string;
  condition: 'New' | 'Used';
  price: number;
  city: string;
  imageUrl: string;
}

// Directory Specific Types
export interface LocationBlock {
  name: string;
}

export interface LocationDistrict {
  name: string;
  blocks: string[]; // List of block names
}

export interface LocationState {
  name: string;
  districts: LocationDistrict[];
}

export interface DirectoryArtist extends ArtistProfile {
  state: string;
  district: string;
  block?: string;
  pincode?: string;
  skills: string[];
  startingPrice?: number;
  verified: boolean;
  lat: number; // For map simulation (0-100 scale)
  lng: number; // For map simulation (0-100 scale)
  description?: string;
  reviews?: number;
  
  // Advanced Filter Fields
  experience?: number; // Years
  availability?: 'Online' | 'Offline' | 'Both';
  subcategory?: string;

  // AI Recommendation Fields
  isTrending?: boolean;
  views?: number;
  bookings?: number;
  joinedDate?: string; // ISO Date string for "New Joiner" logic
}

// --- Notification System Types ---

export type NotificationPriority = 'high' | 'medium' | 'low';
export type NotificationCategory = 'booking' | 'job' | 'update' | 'follower' | 'offer' | 'alert';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning' | 'offer'; // Visual style
  category: NotificationCategory; // Logic grouping
  priority: NotificationPriority;
  timestamp: number;
  read: boolean;
  actionLabel?: string;
  actionLink?: string;
  image?: string;
}

export interface NotificationSettings {
  newArtistAlerts: boolean;
  newJobs: boolean;
  studioOffers: boolean;
  bookingStatus: boolean;
  communityActivity: boolean;
  trendingArtists: boolean;
  disableAll: boolean;
}

// --- Navigation Data Type ---
export interface PageData {
  nearby?: boolean;
  state?: string;
  district?: string;
  manualLocation?: boolean;
  // Add other potential filters
}
