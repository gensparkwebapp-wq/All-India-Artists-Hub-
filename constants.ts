
import { ArtistProfile, BadgeType, Job, Product, Studio, Teacher, DirectoryArtist, LocationState } from './types';

export const HERO_STATS = [
  { label: "Registered Artists", value: "2,500+" },
  { label: "Recording & Shooting Studios", value: "120+" },
  { label: "Successful Bookings", value: "500+" },
  { label: "Coverage", value: "Pan India" },
];

export const TOP_ARTISTS: ArtistProfile[] = [
  { id: '1', name: 'Rahul Sharma', category: 'Playback Singer', city: 'Mumbai', rating: 4.9, imageUrl: 'https://picsum.photos/seed/artist1/150/150', badge: BadgeType.GOLDEN, followers: '120k' },
  { id: '2', name: 'Priya Singh', category: 'Classical Dancer', city: 'Delhi', rating: 4.8, imageUrl: 'https://picsum.photos/seed/artist2/150/150', badge: BadgeType.GOLD, followers: '85k' },
  { id: '3', name: 'Amit Verma', category: 'Guitarist', city: 'Bangalore', rating: 4.7, imageUrl: 'https://picsum.photos/seed/artist3/150/150', badge: BadgeType.SILVER, followers: '40k' },
  { id: '4', name: 'Sneha Kapoor', category: 'TV Actor', city: 'Mumbai', rating: 4.6, imageUrl: 'https://picsum.photos/seed/artist4/150/150' },
  { id: '5', name: 'Vikram Beats', category: 'DJ & Producer', city: 'Goa', rating: 4.8, imageUrl: 'https://picsum.photos/seed/artist5/150/150' },
  { id: '6', name: 'Arjun Das', category: 'Voice Over Artist', city: 'Chennai', rating: 4.5, imageUrl: 'https://picsum.photos/seed/artist6/150/150' },
];

export const STUDIOS: Studio[] = [
  { id: '1', name: 'Swara Studios', city: 'Mumbai', services: ['Vocal Recording', 'Mixing'], priceStart: 800, imageUrl: 'https://picsum.photos/seed/studio1/300/200', type: 'recording' },
  { id: '2', name: 'Pixel Perfect', city: 'Delhi', services: ['Green Screen', '4K Shoot'], priceStart: 2500, imageUrl: 'https://picsum.photos/seed/studio2/300/200', type: 'video' },
  { id: '3', name: 'Boom Box Live', city: 'Pune', services: ['Line Array', 'Stage Light'], priceStart: 15000, imageUrl: 'https://picsum.photos/seed/studio3/300/200', type: 'sound' },
];

export const JOBS: Job[] = [
  { id: '1', title: 'Wedding Singer needed', location: 'Jaipur', budget: '₹15,000', type: 'One-time' },
  { id: '2', title: 'Dancer group for corporate event', location: 'Delhi', budget: '₹25,000', type: 'One-time' },
  { id: '3', title: 'Background actors for web series', location: 'Mumbai', budget: '₹2,000/day', type: 'Contract' },
];

export const TEACHERS: Teacher[] = [
  { id: '1', name: 'Pt. Ravi Kumar', subject: 'Classical Vocal', city: 'Varanasi', ratePerMin: 15, imageUrl: 'https://picsum.photos/seed/teach1/150/150' },
  { id: '2', name: 'Sarah Jones', subject: 'Western Dance', city: 'Mumbai', ratePerMin: 20, imageUrl: 'https://picsum.photos/seed/teach2/150/150' },
  { id: '3', name: 'Mike D', subject: 'Guitar Basics', city: 'Online', ratePerMin: 10, imageUrl: 'https://picsum.photos/seed/teach3/150/150' },
];

export const PRODUCTS: Product[] = [
  { id: '1', title: 'Fender Stratocaster', condition: 'Used', price: 45000, city: 'Mumbai', imageUrl: 'https://picsum.photos/seed/gear1/200/200' },
  { id: '2', title: 'Shure SM58 Mic', condition: 'New', price: 8500, city: 'Delhi', imageUrl: 'https://picsum.photos/seed/gear2/200/200' },
  { id: '3', title: 'Focusrite Scarlett 2i2', condition: 'Used', price: 9000, city: 'Bangalore', imageUrl: 'https://picsum.photos/seed/gear3/200/200' },
  { id: '4', title: 'Yamaha Keyboard', condition: 'Used', price: 12000, city: 'Pune', imageUrl: 'https://picsum.photos/seed/gear4/200/200' },
];

// --- Directory Data ---

export const CATEGORIES = [
  "Singer", "Musician", "Actor", "Dancer", "Model", "Recording Studio", "Live Sound", "Photographer", "Video Editor", "Makeup Artist"
];

export const SUBCATEGORIES: Record<string, string[]> = {
  "Singer": ["Bollywood", "Folk", "Classical", "Rapper", "Devotional", "Playback"],
  "Dancer": ["Classical", "Hip Hop", "Contemporary", "Folk", "Bollywood"],
  "Musician": ["Guitarist", "Drummer", "Keyboardist", "Flutist", "Tabla"],
  "Actor": ["TV Actor", "Film Actor", "Theatre", "Voice Over", "Child Artist"],
  "Recording Studio": ["Vocal Recording", "Dubbing", "Mixing/Mastering", "Jam Room"],
  "Live Sound": ["DJ", "PA System", "Orchestra", "Sound Engineer"],
  "Photographer": ["Wedding", "Fashion", "Product", "Event"],
  "Makeup Artist": ["Bridal", "Party", "Cinematic", "SFX"]
};

export const LOCATION_DATA: LocationState[] = [
  {
    name: "Rajasthan",
    districts: [
      { name: "Jaipur", blocks: ["Sanganer", "Jhotwara", "Amer", "Phulera"] },
      { name: "Jodhpur", blocks: ["Luni", "Mandore", "Osian", "Bilara"] },
      { name: "Udaipur", blocks: ["Girwa", "Badgaon", "Mavli", "Salumbar"] },
      { name: "Kota", blocks: ["Ladpura", "Digod", "Sangod"] }
    ]
  },
  {
    name: "Maharashtra",
    districts: [
      { name: "Mumbai", blocks: ["Andheri", "Bandra", "Colaba", "Dadar"] },
      { name: "Pune", blocks: ["Haveli", "Khed", "Mulshi"] },
      { name: "Nagpur", blocks: ["Ramtek", "Hingna", "Kamptee"] }
    ]
  },
  {
    name: "Delhi",
    districts: [
      { name: "New Delhi", blocks: ["Connaught Place", "Chanakyapuri"] },
      { name: "South Delhi", blocks: ["Hauz Khas", "Saket", "Mehrauli"] },
      { name: "North Delhi", blocks: ["Civil Lines", "Sadar Bazar"] }
    ]
  }
];

// Mock Directory Artists with specific lat/lng for visual simulation
// Lat/Lng here are conceptual % positions on a container (0-100)
export const DIRECTORY_ARTISTS: DirectoryArtist[] = [
  { 
    id: 'd1', name: 'Aarav Singh', category: 'Singer', subcategory: 'Playback', city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur', block: 'Sanganer', pincode: '302029',
    rating: 4.8, imageUrl: 'https://picsum.photos/seed/sing1/200/200', badge: BadgeType.GOLDEN, 
    skills: ['Bollywood', 'Sufi', 'Classical'], startingPrice: 15000, verified: true, lat: 40, lng: 30, description: "Professional playback singer with 5 years experience.", reviews: 120,
    isTrending: true, views: 5200, bookings: 45, joinedDate: '2023-01-15', experience: 5, availability: 'Both'
  },
  { 
    id: 'd2', name: 'Riya Gupta', category: 'Dancer', subcategory: 'Kathak', city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai', block: 'Bandra', pincode: '400050',
    rating: 4.9, imageUrl: 'https://picsum.photos/seed/dance1/200/200', badge: BadgeType.GOLD,
    skills: ['Kathak', 'Contemporary', 'Bollywood'], startingPrice: 20000, verified: true, lat: 60, lng: 25, description: "Available for stage shows and wedding choreography.", reviews: 85,
    isTrending: true, views: 8900, bookings: 62, joinedDate: '2023-03-10', experience: 8, availability: 'Offline'
  },
  { 
    id: 'd3', name: 'Sonic Boom Studios', category: 'Recording Studio', subcategory: 'Mixing/Mastering', city: 'Delhi', state: 'Delhi', district: 'South Delhi', block: 'Hauz Khas', pincode: '110016',
    rating: 4.5, imageUrl: 'https://picsum.photos/seed/studioD/200/200',
    skills: ['Vocal Recording', 'Mixing', 'Mastering'], startingPrice: 1000, verified: true, lat: 25, lng: 35, description: "State of the art recording facility in South Delhi.", reviews: 45,
    isTrending: false, views: 1200, bookings: 15, joinedDate: '2023-05-20', experience: 10, availability: 'Offline'
  },
  { 
    id: 'd4', name: 'Vikram Malhotra', category: 'Actor', subcategory: 'Theatre', city: 'Mumbai', state: 'Maharashtra', district: 'Mumbai', block: 'Andheri', pincode: '400053',
    rating: 4.2, imageUrl: 'https://picsum.photos/seed/actor1/200/200', badge: BadgeType.SILVER,
    skills: ['Method Acting', 'Theatre', 'Voice Over'], startingPrice: 5000, verified: false, lat: 62, lng: 26, description: "Theatre artist looking for serious roles.", reviews: 20,
    isTrending: false, views: 800, bookings: 5, joinedDate: '2023-08-05', experience: 3, availability: 'Both'
  },
  { 
    id: 'd5', name: 'DJ Max', category: 'Live Sound', subcategory: 'DJ', city: 'Pune', state: 'Maharashtra', district: 'Pune', block: 'Haveli', pincode: '411001',
    rating: 4.7, imageUrl: 'https://picsum.photos/seed/dj1/200/200', badge: BadgeType.GOLD,
    skills: ['EDM', 'Wedding DJ', 'Sound Setup'], startingPrice: 25000, verified: true, lat: 65, lng: 30, description: "Best DJ in town for your parties.", reviews: 210,
    isTrending: true, views: 3500, bookings: 80, joinedDate: '2023-02-12', experience: 7, availability: 'Offline'
  },
  { 
    id: 'd6', name: 'Neha Kakkad', category: 'Singer', subcategory: 'Folk', city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur', block: 'Jhotwara', pincode: '302012',
    rating: 4.6, imageUrl: 'https://picsum.photos/seed/sing2/200/200',
    skills: ['Folk', 'Bhajan'], startingPrice: 8000, verified: true, lat: 41, lng: 31, description: "Specialist in Rajasthani Folk music.", reviews: 30,
    isTrending: false, views: 1500, bookings: 20, joinedDate: '2023-06-18', experience: 12, availability: 'Offline'
  },
  { 
    id: 'd7', name: 'Raj Photography', category: 'Photographer', subcategory: 'Wedding', city: 'Udaipur', state: 'Rajasthan', district: 'Udaipur', block: 'Girwa', pincode: '313001',
    rating: 4.9, imageUrl: 'https://picsum.photos/seed/photo1/200/200', badge: BadgeType.GOLDEN,
    skills: ['Wedding', 'Portfolio', 'Event'], startingPrice: 35000, verified: true, lat: 50, lng: 28, description: "Capturing moments that last forever.", reviews: 500,
    isTrending: true, views: 12000, bookings: 150, joinedDate: '2022-11-30', experience: 15, availability: 'Offline'
  },
  { 
    id: 'd8', name: 'Suraj Band', category: 'Musician', subcategory: 'Live Band', city: 'Jodhpur', state: 'Rajasthan', district: 'Jodhpur', block: 'Mandore', pincode: '342001',
    rating: 4.3, imageUrl: 'https://picsum.photos/seed/band1/200/200',
    skills: ['Live Band', 'Orchestra'], startingPrice: 50000, verified: false, lat: 45, lng: 25, description: "Complete live band for weddings.", reviews: 15,
    isTrending: false, views: 600, bookings: 8, joinedDate: '2023-09-01', experience: 4, availability: 'Offline'
  },
  { 
    id: 'd9', name: 'Delhi Dance Academy', category: 'Dancer', subcategory: 'Hip Hop', city: 'Delhi', state: 'Delhi', district: 'North Delhi', block: 'Civil Lines', pincode: '110054',
    rating: 4.4, imageUrl: 'https://picsum.photos/seed/dance2/200/200',
    skills: ['Hip Hop', 'Salsa'], startingPrice: 1500, verified: true, lat: 22, lng: 36, description: "Learn dance from the experts.", reviews: 60,
    isTrending: false, views: 2200, bookings: 12, joinedDate: '2023-04-10', experience: 9, availability: 'Online'
  },
  { 
    id: 'd10', name: 'Amit Keys', category: 'Musician', subcategory: 'Keyboardist', city: 'Kota', state: 'Rajasthan', district: 'Kota', block: 'Ladpura', pincode: '324001',
    rating: 4.0, imageUrl: 'https://picsum.photos/seed/keys1/200/200',
    skills: ['Keyboard', 'Piano'], startingPrice: 5000, verified: false, lat: 48, lng: 35, description: "Freelance keyboard player.", reviews: 8,
    isTrending: false, views: 300, bookings: 2, joinedDate: '2023-10-05', experience: 2, availability: 'Offline'
  },
   { 
    id: 'd11', name: 'Studio 99', category: 'Recording Studio', subcategory: 'Dubbing', city: 'Jaipur', state: 'Rajasthan', district: 'Jaipur', block: 'Amer', pincode: '302028',
    rating: 4.6, imageUrl: 'https://picsum.photos/seed/studio99/200/200',
    skills: ['Dubbing', 'Music Production'], startingPrice: 1200, verified: true, lat: 39, lng: 29, description: "Affordable recording studio in Amer.", reviews: 40,
    isTrending: false, views: 1100, bookings: 18, joinedDate: '2023-07-22', experience: 6, availability: 'Offline'
  },
  { 
    id: 'd12', name: 'Simran Makeovers', category: 'Makeup Artist', subcategory: 'Bridal', city: 'Chandigarh', state: 'Punjab', district: 'Mohali', block: 'Sector 62', pincode: '160062',
    rating: 4.8, imageUrl: 'https://picsum.photos/seed/makeup1/200/200', badge: BadgeType.GOLD,
    skills: ['Bridal', 'Party', 'HD Makeup'], startingPrice: 12000, verified: true, lat: 15, lng: 30, description: "Certified makeup artist.", reviews: 95,
    isTrending: true, views: 4000, bookings: 55, joinedDate: '2023-01-05', experience: 7, availability: 'Offline'
  }
];
