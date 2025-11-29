
import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, Star, Navigation, MapPin, Search, Filter, X, ChevronDown, Map as MapIcon, AlertCircle } from 'lucide-react';
import { BadgeType, PageData, DirectoryArtist } from '../types';
import { DIRECTORY_ARTISTS, LOCATION_DATA, CATEGORIES, SUBCATEGORIES } from '../constants';
import FollowButton from './FollowButton';
import SectionHeading from './SectionHeading';
import { searchRealWorldPlaces, MapPlace } from '../services/genai';

// --- Helper: Haversine Distance Calculation ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

// --- Artist Card with Distance ---
const ArtistListCard: React.FC<{ artist: DirectoryArtist & { distance?: number } }> = ({ artist }) => (
  <div className="bg-white rounded-card shadow-card hover:shadow-card-hover border border-transparent hover:border-brand-primary/20 transition-all duration-300 p-4 flex flex-col sm:flex-row gap-5 animate-fade-in group relative mb-4">
    <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
      <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover rounded-lg" />
      {artist.badge && (
        <div className={`absolute top-0 left-0 px-2 py-0.5 text-[10px] font-bold text-white rounded-tl-lg rounded-br-lg ${
          artist.badge === BadgeType.GOLDEN ? 'bg-yellow-600' : 
          artist.badge === BadgeType.GOLD ? 'bg-yellow-400' : 'bg-gray-400'
        }`}>
          {artist.badge}
        </div>
      )}
    </div>
    
    <div className="flex-grow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-brand-textMain flex items-center gap-2">
            {artist.name}
            {artist.verified && <CheckCircle size={16} className="text-brand-primary" fill="currentColor" color="white" />}
          </h3>
          <p className="text-sm text-brand-textHeading font-medium">
            {artist.category}
            {artist.subcategory && <span className="text-gray-500 font-normal"> • {artist.subcategory}</span>}
          </p>
        </div>
        <div className="flex flex-col items-end">
           <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold text-xs mb-1">
             {artist.rating} <Star size={12} fill="currentColor" className="ml-1" />
           </div>
           {artist.distance !== undefined && (
             <div className="text-[10px] font-bold text-brand-primary bg-blue-50 px-2 py-0.5 rounded-full flex items-center mb-1">
               <Navigation size={10} className="mr-1" />
               {artist.distance.toFixed(1)} km away
             </div>
           )}
        </div>
      </div>

      <div className="text-xs text-brand-textBody mt-2 flex items-center flex-wrap gap-1">
        <MapPin size={12} className="text-gray-400" />
        <span>{artist.state} &gt; {artist.district}</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {artist.skills.slice(0, 3).map((skill: string, idx: number) => (
          <span key={idx} className="px-2 py-1 bg-brand-surface text-brand-textBody text-[10px] rounded-full border border-gray-200">
            {skill}
          </span>
        ))}
      </div>

      {/* Short Bio Section */}
      {artist.description && (
        <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
          {artist.description}
        </p>
      )}

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Starting from</span>
          <div className="font-bold text-brand-primary">₹{artist.startingPrice?.toLocaleString()}</div>
        </div>
        <div className="flex gap-2">
           <FollowButton artistId={artist.id} artistName={artist.name} initialIsFollowing={artist.isFollowed} compact />
           <button className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-surface text-brand-textMain hover:bg-gray-200 transition">View Profile</button>
           <button className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-primary text-white hover:bg-brand-primaryDark transition shadow-md hover:-translate-y-0.5">Book Now</button>
        </div>
      </div>
    </div>
  </div>
);

const Directory: React.FC<{ initialFilters?: PageData }> = ({ initialFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState(initialFilters?.state || '');
  const [selectedDistrict, setSelectedDistrict] = useState(initialFilters?.district || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  
  // Distance Filter States
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Google Maps Grounding State
  const [useRealWorldMap, setUseRealWorldMap] = useState(false);
  const [realWorldPlaces, setRealWorldPlaces] = useState<MapPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  // Handle Initial Filters update
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.state) setSelectedState(initialFilters.state);
      if (initialFilters.district) setSelectedDistrict(initialFilters.district);
      if (initialFilters.nearby) {
        setSelectedRadius(25); // Default to 25km if nearby requested
        detectUserLocation();
      }
    }
  }, [initialFilters]);

  // Handle Real World Search
  useEffect(() => {
    if (useRealWorldMap && searchTerm.length > 3) {
      const fetchPlaces = async () => {
        setIsLoadingPlaces(true);
        // Pass user coords if available to bias search
        const places = await searchRealWorldPlaces(searchTerm, userCoords?.lat, userCoords?.lng);
        setRealWorldPlaces(places);
        setIsLoadingPlaces(false);
      };
      // Debounce slightly
      const timer = setTimeout(fetchPlaces, 800);
      return () => clearTimeout(timer);
    }
  }, [useRealWorldMap, searchTerm, userCoords]);

  const detectUserLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error detecting location:", error);
          setLocationError('Could not detect location. Please enable GPS.');
          setIsLocating(false);
          setSelectedRadius(null); // Reset if failed
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLocating(false);
    }
  };

  const districts = useMemo(() => {
    return LOCATION_DATA.find(s => s.name === selectedState)?.districts || [];
  }, [selectedState]);

  const subCategories = useMemo(() => {
    return selectedCategory ? SUBCATEGORIES[selectedCategory] || [] : [];
  }, [selectedCategory]);

  const filteredArtists = useMemo(() => {
    let artists = DIRECTORY_ARTISTS.filter(artist => {
      if (searchTerm && !artist.name.toLowerCase().includes(searchTerm.toLowerCase()) && !artist.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
      if (selectedState && artist.state !== selectedState) return false;
      if (selectedDistrict && artist.district !== selectedDistrict) return false;
      if (selectedCategory && artist.category !== selectedCategory) return false;
      if (selectedSubCategory && artist.subcategory !== selectedSubCategory) return false;
      return true;
    }).map(artist => {
        // Calculate Distance if user coords available
        if (userCoords && artist.geoLat && artist.geoLng) {
            const dist = calculateDistance(userCoords.lat, userCoords.lng, artist.geoLat, artist.geoLng);
            return { ...artist, distance: dist };
        }
        return { ...artist, distance: undefined };
    });

    // Filter by Radius
    if (selectedRadius !== null && userCoords) {
        artists = artists.filter(a => a.distance !== undefined && a.distance <= selectedRadius);
        // Sort by nearest
        artists.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return artists;
  }, [searchTerm, selectedState, selectedDistrict, selectedCategory, selectedSubCategory, selectedRadius, userCoords]);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      setSelectedRadius(null);
    } else {
      setSelectedRadius(Number(val));
      if (!userCoords) {
        detectUserLocation();
      }
    }
  };

  return (
    <div className="bg-brand-surface min-h-screen py-8">
      <div className="container mx-auto px-4">
        <SectionHeading title="Artists Directory" subtext="Find and book verified artists, musicians, and studios." />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-card shadow-card sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><Filter size={18}/> Filters</h3>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedState('');
                    setSelectedDistrict('');
                    setSelectedCategory('');
                    setSelectedSubCategory('');
                    setSelectedRadius(null);
                  }}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                 {/* Search */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Search</label>
                   <div className="relative">
                     <input 
                       type="text" 
                       placeholder="Name, Skill..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none bg-gray-800 text-white placeholder-gray-400 caret-white"
                     />
                     <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                   </div>
                 </div>

                 {/* Use Real World Maps Toggle */}
                 <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                      <MapIcon size={14} /> Google Maps
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={useRealWorldMap} onChange={(e) => setUseRealWorldMap(e.target.checked)} />
                      <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                 </div>

                 {/* Location */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location</label>
                   <select 
                      value={selectedState} 
                      onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                      className="w-full p-2 border border-gray-600 rounded-lg text-sm mb-2 bg-gray-800 text-white"
                   >
                     <option value="">All States</option>
                     {LOCATION_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                   </select>
                   <select 
                      value={selectedDistrict} 
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedState}
                      className="w-full p-2 border border-gray-600 rounded-lg text-sm disabled:bg-gray-700 disabled:text-gray-500 bg-gray-800 text-white"
                   >
                     <option value="">All Districts</option>
                     {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                   </select>
                 </div>

                 {/* Distance Filter (NEW) */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block flex justify-between">
                     Distance 
                     {isLocating && <span className="text-brand-primary animate-pulse">Locating...</span>}
                   </label>
                   <select 
                      value={selectedRadius !== null ? selectedRadius : 'all'}
                      onChange={handleRadiusChange}
                      className="w-full p-2 border border-gray-600 rounded-lg text-sm bg-gray-800 text-white"
                   >
                     <option value="all">All India</option>
                     <option value="5">5 km</option>
                     <option value="10">10 km</option>
                     <option value="25">25 km</option>
                     <option value="50">50 km</option>
                     <option value="100">100 km</option>
                   </select>
                   {locationError && <p className="text-[10px] text-red-500 mt-1">{locationError}</p>}
                   {userCoords && selectedRadius && (
                     <p className="text-[10px] text-green-600 mt-1 flex items-center">
                       <CheckCircle size={10} className="mr-1" /> Location Detected
                     </p>
                   )}
                 </div>

                 {/* Category */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                   <select 
                      value={selectedCategory} 
                      onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubCategory(''); }}
                      className="w-full p-2 border border-gray-600 rounded-lg text-sm mb-2 bg-gray-800 text-white"
                   >
                     <option value="">All Categories</option>
                     {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                   
                   {selectedCategory && subCategories.length > 0 && (
                     <select 
                        value={selectedSubCategory} 
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-lg text-sm animate-fade-in bg-gray-800 text-white"
                     >
                       <option value="">All Sub-categories</option>
                       {subCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                     </select>
                   )}
                 </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex justify-between items-center">
               <p className="text-sm text-gray-500">
                 Showing <strong>{useRealWorldMap ? realWorldPlaces.length : filteredArtists.length}</strong> results
                 {useRealWorldMap && <span className="ml-2 text-brand-primary font-bold">(Google Maps Data)</span>}
               </p>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-500">Sort By:</span>
                 <select className="text-xs border-none bg-transparent font-bold text-brand-textMain focus:ring-0 cursor-pointer">
                   <option>Recommended</option>
                   <option>Rating: High to Low</option>
                   <option>Price: Low to High</option>
                 </select>
               </div>
            </div>

            {/* REAL WORLD RESULTS */}
            {useRealWorldMap ? (
              <div className="space-y-4">
                {isLoadingPlaces ? (
                  <div className="text-center py-10 text-gray-500">
                    <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                    Searching Google Maps...
                  </div>
                ) : realWorldPlaces.length > 0 ? (
                  realWorldPlaces.map((place, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-card shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
                       <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                         <MapPin className="text-brand-primary" />
                       </div>
                       <div className="flex-grow">
                         <h3 className="font-bold text-brand-textMain">{place.title}</h3>
                         <p className="text-sm text-gray-500 mb-2">{place.formattedAddress}</p>
                         <a href={place.sourceUri} target="_blank" rel="noreferrer" className="text-xs text-brand-primary font-bold hover:underline flex items-center">
                           View on Google Maps <Navigation size={10} className="ml-1" />
                         </a>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-card">
                    <p className="text-gray-500">No Google Maps results found. Try a specific search term.</p>
                  </div>
                )}
              </div>
            ) : (
              /* INTERNAL DIRECTORY RESULTS */
              filteredArtists.length > 0 ? (
                <div className="space-y-4">
                  {filteredArtists.map(artist => (
                    <ArtistListCard key={artist.id} artist={artist} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-card text-center shadow-sm">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Search size={32} />
                   </div>
                   <h3 className="text-lg font-bold text-gray-800">No artists found</h3>
                   <p className="text-gray-500">Try adjusting your filters, search terms, or increasing the distance.</p>
                   {selectedRadius && (
                     <p className="text-xs text-orange-500 mt-2 font-medium flex items-center justify-center">
                       <AlertCircle size={12} className="mr-1" />
                       You are filtering within {selectedRadius} km. Try 'All India'.
                     </p>
                   )}
                   <button 
                      onClick={() => {
                          setSearchTerm('');
                          setSelectedState('');
                          setSelectedDistrict('');
                          setSelectedCategory('');
                          setSelectedSubCategory('');
                          setSelectedRadius(null);
                      }}
                      className="mt-4 text-brand-primary font-bold hover:underline"
                   >
                     Clear All Filters
                   </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory;
