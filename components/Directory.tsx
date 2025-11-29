
import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, Star, Navigation, MapPin, Search, Filter, X, ChevronDown, Map as MapIcon, AlertCircle, List, Loader2 } from 'lucide-react';
import { BadgeType, PageData, DirectoryArtist } from '../types';
import { DIRECTORY_ARTISTS, LOCATION_DATA, CATEGORIES, SUBCATEGORIES } from '../constants';
import FollowButton from './FollowButton';
import SectionHeading from './SectionHeading';
import { searchRealWorldPlaces, MapPlace } from '../services/genai';
import AppSelect from './AppSelect';

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

      {/* Short Bio Section */}
      {artist.description && (
        <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
          {artist.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {artist.skills.slice(0, 3).map((skill: string, idx: number) => (
          <span key={idx} className="px-2 py-1 bg-brand-surface text-brand-textBody text-[10px] rounded-full border border-gray-200">
            {skill}
          </span>
        ))}
      </div>

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

// --- Map View Component ---
const ArtistMap = ({ artists, places, isRealWorld, onMarkerHover }: { 
    artists: (DirectoryArtist & { distance?: number })[], 
    places: MapPlace[],
    isRealWorld: boolean,
    onMarkerHover: (id: string | null) => void 
}) => {
  const [positions, setPositions] = useState<Record<string, { top: string, left: string }>>({});

  useEffect(() => {
    if (isRealWorld && places.length > 0) {
        const placesWithCoords = places.filter(p => p.latitude && p.longitude);
        if(placesWithCoords.length === 0) {
            setPositions({});
            return;
        };

        const bounds = placesWithCoords.reduce(
          (acc, place) => ({
            minLat: Math.min(acc.minLat, place.latitude!),
            maxLat: Math.max(acc.maxLat, place.latitude!),
            minLng: Math.min(acc.minLng, place.longitude!),
            maxLng: Math.max(acc.maxLng, place.longitude!),
          }),
          { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 }
        );

        const latRange = Math.abs(bounds.maxLat - bounds.minLat);
        const lngRange = Math.abs(bounds.maxLng - bounds.minLng);
        const PADDING = 0.1;

        const newPositions = placesWithCoords.reduce((acc, place) => {
            const topPercent = latRange === 0 ? 50 : 100 - (((place.latitude! - bounds.minLat) / latRange) * (100 - PADDING * 200) + PADDING * 100);
            const leftPercent = lngRange === 0 ? 50 : (((place.longitude! - bounds.minLng) / lngRange) * (100 - PADDING * 200) + PADDING * 100);
            acc[place.placeId || place.title] = { top: `${topPercent}%`, left: `${leftPercent}%` };
            return acc;
        }, {} as Record<string, {top: string, left: string}>);

        setPositions(newPositions);
    }
  }, [places, isRealWorld]);

  const items = isRealWorld ? places : artists;

  return (
    <div className="relative w-full h-[600px] lg:h-full bg-gray-200 rounded-lg shadow-inner overflow-hidden border border-gray-300 animate-fade-in">
        <img src="https://picsum.photos/seed/mapbg/1200/800" alt="Map background" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>

        {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg">
                    <MapIcon size={32} className="mx-auto text-gray-400 mb-2"/>
                    <p className="font-bold text-gray-700">No locations to display</p>
                    <p className="text-xs text-gray-500">Adjust your filters to see results on the map.</p>
                </div>
            </div>
        )}

        {isRealWorld ? (
            places.map(place => (
                positions[place.placeId || place.title] && (
                    <MapMarker 
                        key={place.placeId || place.title} 
                        id={place.placeId || place.title}
                        position={positions[place.placeId || place.title]}
                        onHover={onMarkerHover}
                    >
                        <h4 className="font-bold text-sm">{place.title}</h4>
                        <p className="text-xs text-gray-500">{place.formattedAddress}</p>
                    </MapMarker>
                )
            ))
        ) : (
            artists.map(artist => (
                <MapMarker 
                    key={artist.id} 
                    id={artist.id}
                    position={{ top: `${artist.lat}%`, left: `${artist.lng}%` }}
                    onHover={onMarkerHover}
                >
                    <div className="flex items-center gap-2">
                        <img src={artist.imageUrl} className="w-8 h-8 rounded-full object-cover"/>
                        <div>
                            <h4 className="font-bold text-sm">{artist.name}</h4>
                            <p className="text-xs text-gray-500">{artist.category}</p>
                        </div>
                    </div>
                </MapMarker>
            ))
        )}
    </div>
  );
};

const MapMarker = ({ id, position, onHover, children }: { id: string, position: { top: string, left: string }, onHover: (id: string | null) => void, children: React.ReactNode }) => (
    <div 
        className="absolute transform -translate-x-1/2 -translate-y-full"
        style={{ ...position }}
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onHover(null)}
    >
        <div className="relative group">
            <MapPin size={32} className="text-brand-primary fill-current drop-shadow-lg cursor-pointer transition-transform duration-200 group-hover:scale-125" />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-white p-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-200">
                {children}
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white transform rotate-45"></div>
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
  
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const [useRealWorldMap, setUseRealWorldMap] = useState(false);
  const [realWorldPlaces, setRealWorldPlaces] = useState<MapPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Control variables for mutually exclusive filters
  const isDistanceSearchActive = selectedRadius !== null;
  const isLocationSearchActive = !!selectedState;

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.state) setSelectedState(initialFilters.state);
      if (initialFilters.district) setSelectedDistrict(initialFilters.district);
      if (initialFilters.nearby) {
        setSelectedRadius(25);
        detectUserLocation();
      }
      if (initialFilters.viewMap) {
        setViewMode('map');
      }
    }
  }, [initialFilters]);

  useEffect(() => {
    const performSearch = async () => {
      if (useRealWorldMap && searchTerm.length > 2) {
        setIsLoadingPlaces(true);
        setRealWorldPlaces([]);
        const places = await searchRealWorldPlaces(searchTerm, userCoords?.lat, userCoords?.lng);
        setRealWorldPlaces(places);
        setIsLoadingPlaces(false);
      }
    };
  
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 500);
  
    return () => clearTimeout(debounceTimer);
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
          setSelectedRadius(null);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLocating(false);
    }
  };

  const districts = useMemo(() => {
    if (!selectedState) return [];
    return LOCATION_DATA.find(s => s.name === selectedState)?.districts || [];
  }, [selectedState]);

  const subCategories = useMemo(() => {
    return selectedCategory ? SUBCATEGORIES[selectedCategory] || [] : [];
  }, [selectedCategory]);

  const filteredArtists = useMemo(() => {
    const artistsWithDistance = DIRECTORY_ARTISTS.map(artist => {
      if (userCoords && artist.geoLat && artist.geoLng) {
        const dist = calculateDistance(userCoords.lat, userCoords.lng, artist.geoLat, artist.geoLng);
        return { ...artist, distance: dist };
      }
      return { ...artist, distance: undefined };
    });

    const isDistanceSearch = selectedRadius !== null && userCoords;

    const results = artistsWithDistance.filter(artist => {
      // Apply non-location filters first
      if (searchTerm && !artist.name.toLowerCase().includes(searchTerm.toLowerCase()) && !artist.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
      if (selectedCategory && artist.category !== selectedCategory) return false;
      if (selectedSubCategory && artist.subcategory !== selectedSubCategory) return false;

      // Apply mutually exclusive location filters
      if (isDistanceSearch) {
        return artist.distance !== undefined && artist.distance <= selectedRadius;
      } else {
        if (selectedState && artist.state !== selectedState) return false;
        if (selectedDistrict && artist.district !== selectedDistrict) return false;
      }
      
      return true;
    });

    if (isDistanceSearch) {
      results.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    return results;
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedRadius(null);
    setUserCoords(null);
    setLocationError('');
    setRealWorldPlaces([]);
  };

  const resultsCount = useRealWorldMap ? realWorldPlaces.length : filteredArtists.length;

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
                  onClick={clearFilters}
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
                       placeholder="Name, Skill, or Place..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                     />
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location</label>
                   <AppSelect 
                      value={selectedState} 
                      onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                      disabled={isDistanceSearchActive}
                   >
                     <option value="">All States</option>
                     {LOCATION_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                   </AppSelect>
                   <AppSelect 
                      value={selectedDistrict} 
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedState || isDistanceSearchActive}
                   >
                     <option value="">All Districts</option>
                     {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                   </AppSelect>
                   {isDistanceSearchActive && <p className="text-[10px] text-gray-500 mt-1">State/District is disabled when searching by distance.</p>}
                 </div>

                 {/* Distance Filter */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block flex justify-between">
                     Distance 
                     {isLocating && <span className="text-brand-primary animate-pulse">Locating...</span>}
                   </label>
                   <AppSelect 
                      value={selectedRadius !== null ? selectedRadius : 'all'}
                      onChange={handleRadiusChange}
                      disabled={isLocationSearchActive}
                   >
                     <option value="all">All India</option>
                     <option value="5">Within 5 km</option>
                     <option value="10">Within 10 km</option>
                     <option value="25">Within 25 km</option>
                     <option value="50">Within 50 km</option>
                     <option value="100">Within 100 km</option>
                   </AppSelect>
                   {isLocationSearchActive && <p className="text-[10px] text-gray-500 mt-1">Distance is disabled when a location is selected.</p>}
                   {locationError && <p className="text-[10px] text-red-500 mt-1">{locationError}</p>}
                   {userCoords && selectedRadius !== null && (
                     <p className="text-[10px] text-green-600 mt-1 flex items-center">
                       <CheckCircle size={10} className="mr-1" /> Location active
                     </p>
                   )}
                 </div>

                 {/* Category */}
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                   <AppSelect 
                      value={selectedCategory} 
                      onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubCategory(''); }}
                   >
                     <option value="">All Categories</option>
                     {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </AppSelect>
                   
                   {selectedCategory && subCategories.length > 0 && (
                     <AppSelect 
                        value={selectedSubCategory} 
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        className="animate-fade-in"
                     >
                       <option value="">All Sub-categories</option>
                       {subCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                     </AppSelect>
                   )}
                 </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:w-3/4">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
               <p className="text-sm text-gray-500">
                 Showing <strong>{resultsCount}</strong> results
                 {useRealWorldMap && <span className="ml-2 text-brand-primary font-bold">(Google Maps Data)</span>}
               </p>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 p-1 bg-gray-200 rounded-lg">
                    <button 
                      onClick={() => setViewMode('list')} 
                      className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors ${
                        viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:bg-gray-300/50'
                      }`}
                      aria-label="List View"
                    >
                      <List size={14}/> List
                    </button>
                    <button 
                      onClick={() => setViewMode('map')} 
                      className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors ${
                        viewMode === 'map' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:bg-gray-300/50'
                      }`}
                      aria-label="Map View"
                    >
                      <MapIcon size={14}/> Map
                    </button>
                  </div>
                 <div className="flex items-center gap-2">
                   <span className="text-xs font-bold text-gray-500">Sort By:</span>
                   <AppSelect className="text-xs font-bold !py-1 !px-2 !pr-6 border-none !shadow-none bg-transparent">
                     <option>Recommended</option>
                     <option>Rating: High to Low</option>
                     <option>Price: Low to High</option>
                     {selectedRadius !== null && <option>Distance: Nearest</option>}
                   </AppSelect>
                 </div>
               </div>
            </div>

            {isLoadingPlaces ? (
              <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-sm">
                <Loader2 size={32} className="text-brand-primary animate-spin" />
              </div>
            ) : viewMode === 'list' ? (
                useRealWorldMap ? (
                    <div className="space-y-4">
                      {realWorldPlaces.length > 0 ? (
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
                  filteredArtists.length > 0 ? (
                      <div>
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
                            onClick={clearFilters}
                            className="mt-4 text-brand-primary font-bold hover:underline"
                        >
                            Clear All Filters
                        </button>
                      </div>
                  )
                )
            ) : (
              <ArtistMap 
                artists={filteredArtists} 
                places={realWorldPlaces} 
                isRealWorld={useRealWorldMap}
                onMarkerHover={() => {}} // Placeholder for hover logic if needed later
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory;
