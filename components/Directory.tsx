
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, MapPin, Filter, Mic, Camera, Music, Video, User, 
  CheckCircle, Star, Map as MapIcon, List, X, ChevronDown, Heart, Sparkles, Tag, Briefcase, Navigation, AlertCircle
} from 'lucide-react';
import { DIRECTORY_ARTISTS, LOCATION_DATA, CATEGORIES, SUBCATEGORIES } from '../constants';
import { DirectoryArtist, LocationDistrict, BadgeType, PageData } from '../types';
import { useNotifications } from '../contexts/NotificationContext';
import FollowButton from './FollowButton';

interface DirectoryProps {
  initialFilters?: PageData;
}

const DISTANCE_OPTIONS = [5, 10, 25, 50, 100];

// Helper to calculate distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat1)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const Directory: React.FC<DirectoryProps> = ({ initialFilters }) => {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedPincode, setSelectedPincode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  
  // Advanced Filter State
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minExperience, setMinExperience] = useState<number | ''>('');
  const [maxExperience, setMaxExperience] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('Any'); // Any, Online, Offline
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [newSkillTag, setNewSkillTag] = useState('');

  // Distance Filter State
  const [searchRadius, setSearchRadius] = useState<number | 'All'>('All');
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<string>('Recommended');
  const [itemsToShow, setItemsToShow] = useState(10); // Pagination

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list'); // 'list' or 'map'
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedMapArtist, setSelectedMapArtist] = useState<(DirectoryArtist & { distance?: number | null }) | null>(null);
  
  // Loading State for Near Me
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [showNearbyBanner, setShowNearbyBanner] = useState(false);

  // Notification Context
  const { addNotification } = useNotifications();

  // --- Initialize Filters from Props ---
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.nearby) {
        setIsLoadingNearby(true);
        setShowNearbyBanner(true);
        setSearchRadius(25); // Default to 25km for "Near Me"
        detectUserLocation();
        
        // Simulate data loading
        setTimeout(() => {
          if (initialFilters.state) setSelectedState(initialFilters.state);
          if (initialFilters.district) setSelectedDistrict(initialFilters.district);
          setViewMode('map');
          setSortOption('Distance'); // Prefer Distance sorting
          setIsLoadingNearby(false);
        }, 1000);
      } 
      
      if (initialFilters.manualLocation) {
        // Just focus on state dropdown logic - handled by user UI
      }
    }
  }, [initialFilters]);

  // --- Smart Triggers for Notifications ---
  useEffect(() => {
    if (viewMode === 'map') {
      const timer = setTimeout(() => {
        addNotification({
          title: "Explore Nearby",
          message: "You are viewing the map. There are 12 Verified Artists in this area.",
          type: 'info',
          category: 'alert',
          priority: 'low',
          actionLabel: "Show Verified"
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  useEffect(() => {
    if (selectedCategory) {
      const timer = setTimeout(() => {
        addNotification({
          title: `Top ${selectedCategory}s`,
          message: `We found 5 highly rated ${selectedCategory}s matching your filter.`,
          type: 'success',
          category: 'alert',
          priority: 'medium'
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory]);

  // --- Geolocation Logic ---
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
        // If sorting isn't manual, default to Distance
        if (sortOption === 'Recommended') setSortOption('Distance');
      },
      (error) => {
        console.error("Error detecting location:", error);
        setIsLocating(false);
        setLocationError("Location access denied.");
        setSearchRadius('All'); // Reset if failed
      }
    );
  };

  const handleRadiusChange = (radius: number | 'All') => {
    setSearchRadius(radius);
    if (radius !== 'All' && !userLocation) {
      detectUserLocation();
    }
  };

  // --- Derived Data for Cascading Dropdowns ---
  const districts = useMemo(() => {
    return LOCATION_DATA.find(s => s.name === selectedState)?.districts || [];
  }, [selectedState]);

  const blocks = useMemo(() => {
    return districts.find((d: LocationDistrict) => d.name === selectedDistrict)?.blocks || [];
  }, [districts, selectedDistrict]);

  const subcategories = useMemo(() => {
    return selectedCategory ? (SUBCATEGORIES[selectedCategory] || []) : [];
  }, [selectedCategory]);

  // --- Smart Search Suggestions Logic ---
  const smartSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    
    interface Suggestion {
      type: 'category' | 'location' | 'artist';
      text: string;
      subtext: string;
      value: string;
      data?: any;
    }
    
    const suggestions: Suggestion[] = [];

    const matchedCats = CATEGORIES.filter(c => c.toLowerCase().includes(q));
    matchedCats.forEach(c => suggestions.push({ type: 'category', text: c, subtext: 'Category', value: c }));

    LOCATION_DATA.forEach(state => {
      if (state.name.toLowerCase().includes(q)) suggestions.push({ type: 'location', text: `Artists in ${state.name}`, subtext: 'State', value: state.name });
      state.districts.forEach(dist => {
        if (dist.name.toLowerCase().includes(q)) suggestions.push({ type: 'location', text: `Artists in ${dist.name}`, subtext: `District in ${state.name}`, value: dist.name });
      });
    });

    const matchedArtists = DIRECTORY_ARTISTS.filter(a => a.name.toLowerCase().includes(q));
    matchedArtists.forEach(a => suggestions.push({ type: 'artist', text: a.name, subtext: `${a.category} • ${a.city}`, value: a.name, data: a }));

    return suggestions.sort((a, b) => {
        const typeOrder = { category: 1, location: 2, artist: 3 };
        return typeOrder[a.type] - typeOrder[b.type];
    }).slice(0, 6);
  }, [searchQuery]);


  // --- Filter & AI Sort Logic ---
  const filteredArtists = useMemo(() => {
    let result = DIRECTORY_ARTISTS.map(artist => {
      // Calculate distance if user location is available
      let dist = null;
      if (userLocation && (artist as any).geoLat && (artist as any).geoLng) {
        dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, (artist as any).geoLat, (artist as any).geoLng);
      }
      return { ...artist, distance: dist };
    }).filter(artist => {
      // 1. Distance Filter
      if (searchRadius !== 'All' && artist.distance !== null && artist.distance > searchRadius) return false;
      // If radius is selected but distance unknown, usually filter out, but for demo keep or hide?
      // Let's hide if we strictly want radius.
      if (searchRadius !== 'All' && artist.distance === null) return false;

      // 2. Text Search
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        artist.name.toLowerCase().includes(query) ||
        artist.category.toLowerCase().includes(query) ||
        (artist.subcategory && artist.subcategory.toLowerCase().includes(query)) ||
        artist.city.toLowerCase().includes(query) ||
        artist.state.toLowerCase().includes(query) ||
        artist.district.toLowerCase().includes(query) ||
        (artist.pincode && artist.pincode.includes(query)) ||
        artist.skills.some(skill => skill.toLowerCase().includes(query));

      if (!matchesSearch && searchQuery) return false;

      // 3. Dropdown Filters
      if (selectedState && artist.state !== selectedState) return false;
      if (selectedDistrict && artist.district !== selectedDistrict) return false;
      if (selectedBlock && artist.block !== selectedBlock) return false;
      if (selectedPincode && artist.pincode !== selectedPincode) return false;
      if (selectedCategory && artist.category !== selectedCategory) return false;
      if (selectedSubcategory && artist.subcategory !== selectedSubcategory) return false;

      // 4. Other Filters
      if (minPrice !== '' && (artist.startingPrice || 0) < Number(minPrice)) return false;
      if (maxPrice !== '' && (artist.startingPrice || 0) > Number(maxPrice)) return false;
      if (minExperience !== '' && (artist.experience || 0) < Number(minExperience)) return false;
      if (maxExperience !== '' && (artist.experience || 0) > Number(maxExperience)) return false;
      if (minRating > 0 && artist.rating < minRating) return false;
      if (availabilityFilter !== 'Any') {
         if (artist.availability === 'Both') { } 
         else if (artist.availability !== availabilityFilter) return false;
      }
      if (skillTags.length > 0) {
        const hasAllTags = skillTags.every(tag => artist.skills.some(s => s.toLowerCase().includes(tag.toLowerCase())));
        if (!hasAllTags) return false;
      }

      // 5. Quick Chips
      if (activeFilters.includes('Verified Artists Only') && !artist.verified) return false;
      if (activeFilters.includes('Top Rated') && artist.rating < 4.5) return false;
      if (activeFilters.includes('Affordable') && (artist.startingPrice || 0) > 10000) return false;
      if (activeFilters.includes('New Joiners')) {
         if (!artist.joinedDate || new Date(artist.joinedDate) < new Date('2023-01-01')) return false;
      }
      if (activeFilters.includes('Available Now')) {
         if (artist.availability === 'Offline') return false; 
      }

      return true;
    });

    // 6. Sorting Logic
    if (sortOption === 'Distance' && userLocation) {
        result = result.sort((a, b) => (a.distance || 99999) - (b.distance || 99999));
    } else if (sortOption === 'Recommended' || activeFilters.includes('Recommended')) {
        result = result.sort((a, b) => {
          // Boost nearest verified first if distance known
          if (a.distance && b.distance) {
             const scoreA = (a.verified ? 1000 : 0) - a.distance;
             const scoreB = (b.verified ? 1000 : 0) - b.distance;
             return scoreB - scoreA; 
          }
          const scoreA = (a.rating * 10) + ((a.bookings || 0) * 0.5);
          const scoreB = (b.rating * 10) + ((b.bookings || 0) * 0.5);
          return scoreB - scoreA;
        });
    } else if (sortOption === 'Price: Low to High') {
        result = result.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
    } else if (sortOption === 'Price: High to Low') {
        result = result.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
    } else if (sortOption === 'Highest Rated') {
        result = result.sort((a, b) => b.rating - a.rating);
    }

    return result;

  }, [searchQuery, selectedState, selectedDistrict, selectedBlock, selectedPincode, selectedCategory, selectedSubcategory, activeFilters, minPrice, maxPrice, minExperience, maxExperience, minRating, availabilityFilter, skillTags, sortOption, searchRadius, userLocation]);

  const displayedArtists = filteredArtists.slice(0, itemsToShow);

  // --- Handlers ---
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleAddSkillTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkillTag.trim()) {
      if (!skillTags.includes(newSkillTag.trim())) {
        setSkillTags([...skillTags, newSkillTag.trim()]);
      }
      setNewSkillTag('');
    }
  };

  const removeSkillTag = (tagToRemove: string) => {
    setSkillTags(skillTags.filter(tag => tag !== tagToRemove));
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Singer')) return <Mic size={16} />;
    if (category.includes('Studio')) return <Music size={16} />;
    if (category.includes('Camera') || category.includes('Photo')) return <Camera size={16} />;
    if (category.includes('Actor')) return <Video size={16} />;
    return <User size={16} />;
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.value);
      setSearchQuery('');
    } else if (suggestion.type === 'location') {
      const isState = LOCATION_DATA.some(s => s.name === suggestion.value);
      if (isState) {
        setSelectedState(suggestion.value);
      } else {
        const state = LOCATION_DATA.find(s => s.districts.some(d => d.name === suggestion.value));
        if (state) {
          setSelectedState(state.name);
          setSelectedDistrict(suggestion.value);
        }
      }
      setSearchQuery('');
    } else {
      setSearchQuery(suggestion.value);
    }
    setShowSuggestions(false);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setShowSuggestions(true);
      };
      recognition.start();
    } else {
      alert("Voice search is not supported.");
    }
  };

  // --- Artist Card with Distance ---
  const ArtistListCard: React.FC<{ artist: any }> = ({ artist }) => (
    <div className="bg-white rounded-card shadow-card hover:shadow-card-hover border border-transparent hover:border-brand-primary/20 transition-all duration-300 p-4 flex flex-col sm:flex-row gap-5 animate-fade-in group relative">
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
             {artist.distance !== null && (
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

  return (
    <div className="bg-brand-surface min-h-screen font-sans">
      {/* 1. Global Search Header */}
      <div className="bg-brand-textMain shadow-md border-b border-gray-700 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Search 'Singer in Jaipur', 'Recording Studio', or 'Name'..."
                className="w-full pl-12 pr-24 py-4 rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none shadow-lg transition-all caret-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button 
                  onClick={startListening}
                  className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                  <Mic size={20} />
                </button>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700">
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Suggestions Render (Same as before) */}
            {showSuggestions && smartSuggestions.length > 0 && (
               <div className="absolute top-full left-0 right-0 bg-gray-800 text-white rounded-card shadow-2xl border border-gray-700 mt-2 p-2 z-40 max-h-80 overflow-y-auto">
                  {smartSuggestions.map((suggestion, idx) => (
                    <div 
                      key={idx} 
                      className="px-3 py-3 hover:bg-gray-700 rounded-lg cursor-pointer flex justify-between items-center group transition"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          suggestion.type === 'category' ? 'bg-blue-900/50 text-blue-400' :
                          suggestion.type === 'location' ? 'bg-green-900/50 text-green-400' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {suggestion.type === 'category' && <Briefcase size={14} />}
                          {suggestion.type === 'location' && <MapPin size={14} />}
                          {suggestion.type === 'artist' && <User size={14} />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-brand-primary transition">{suggestion.text}</div>
                          <div className="text-xs text-gray-400">{suggestion.subtext}</div>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button 
                onClick={() => toggleFilter('Recommended')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1 ${
                  activeFilters.includes('Recommended') 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md' 
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-purple-500 hover:text-purple-400'
                }`}
              >
                <Sparkles size={14} /> Recommended
              </button>
            {['Verified Artists Only', 'Top Rated', 'New Joiners', 'Available Now', 'Affordable'].map(filter => (
              <button 
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeFilters.includes(filter) 
                    ? 'bg-brand-primary text-white border-brand-primary shadow-md' 
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-brand-primary hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Nearby Banner */}
        {showNearbyBanner && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg flex items-center justify-between shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-blue-600" />
              <div>
                <h3 className="font-bold text-lg">Showing artists near you</h3>
                <p className="text-sm">
                  {userLocation 
                    ? `Based on your detected location (Lat: ${userLocation.lat.toFixed(2)}, Lng: ${userLocation.lng.toFixed(2)})` 
                    : 'Detecting location...'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => { setShowNearbyBanner(false); setSearchRadius('All'); setSelectedState(''); }}
              className="text-xs bg-white border border-blue-200 px-3 py-1 rounded hover:bg-blue-100"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Location Permission Error Banner */}
        {locationError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg flex items-center justify-between shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-red-600" />
              <div>
                <h3 className="font-bold text-lg">Location access needed</h3>
                <p className="text-sm">{locationError} <br/>To search by distance, please allow location access or enter manual filters.</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={detectUserLocation} className="text-xs bg-white border border-red-200 px-3 py-1.5 rounded hover:bg-red-100 font-bold">Retry</button>
               <button onClick={() => setLocationError(null)} className="text-xs text-red-600 hover:underline">Dismiss</button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-250px)]">
          {/* Left Column: Filters & List */}
          <div className={`flex flex-col gap-6 w-full ${viewMode === 'map' ? 'hidden lg:flex lg:w-1/3' : 'lg:w-1/3'}`}>
            <div className="bg-white p-6 rounded-card shadow-card border border-gray-100 space-y-5 overflow-y-auto max-h-[75vh] no-scrollbar">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-brand-textMain flex items-center gap-2"><Filter size={18} /> Filters</h3>
                 <button 
                   onClick={() => {
                     setSelectedState(''); setSelectedDistrict(''); setSelectedCategory(''); 
                     setSearchRadius('All'); setMinPrice(''); setSkillTags([]);
                     setSortOption('Recommended');
                   }}
                   className="text-xs text-brand-primary font-bold hover:underline"
                 >
                   Reset All
                 </button>
               </div>
               
               <div className="space-y-4">
                 {/* Locations */}
                 <div>
                    <label className="text-xs font-bold text-brand-textSub mb-1 block uppercase">Location</label>
                    <div className="space-y-2">
                       <select 
                         value={selectedState} 
                         onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                         className="w-full appearance-none bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-primary outline-none"
                       >
                         <option value="">Select State</option>
                         {LOCATION_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                       </select>
                       <select 
                         value={selectedDistrict} 
                         onChange={(e) => setSelectedDistrict(e.target.value)}
                         disabled={!selectedState}
                         className="w-full appearance-none bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-primary outline-none disabled:opacity-50"
                       >
                         <option value="">Select District</option>
                         {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                       </select>
                    </div>
                 </div>

                 {/* Distance Filter */}
                 <div className="animate-fade-in">
                    <label className="text-xs font-bold text-brand-textSub mb-2 block uppercase flex justify-between">
                      <span>Distance Range (Radius)</span>
                      {isLocating && <span className="text-brand-primary animate-pulse">Locating...</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                       {['All', ...DISTANCE_OPTIONS].map((opt) => (
                         <button
                           key={opt}
                           onClick={() => handleRadiusChange(opt as number | 'All')}
                           className={`px-3 py-1.5 text-xs rounded-full font-bold transition border ${
                             searchRadius === opt 
                               ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                               : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                           }`}
                         >
                           {opt === 'All' ? 'All India' : `${opt} km`}
                         </button>
                       ))}
                    </div>
                    {userLocation && searchRadius !== 'All' && (
                       <p className="text-[10px] text-green-600 mt-1 flex items-center">
                         <MapPin size={10} className="mr-1"/> Location active
                       </p>
                    )}
                 </div>
                 
                 {/* Category Filter */}
                 <div>
                    <label className="text-xs font-bold text-brand-textSub mb-1 block uppercase">Category</label>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(''); }}
                      className="w-full appearance-none bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-primary outline-none"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>

                 {/* Price & Rating (Simplified for brevity) */}
                 <div>
                    <label className="text-xs font-bold text-brand-textSub mb-2 block uppercase">Budget (₹)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                        className="w-full text-sm p-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-brand-primary caret-white"
                      />
                    </div>
                 </div>
               </div>
            </div>

            {/* Results Count & List */}
            <div className="flex-grow flex flex-col min-h-0">
               <div className="flex justify-between items-center mb-4 px-1">
                 <div>
                    <h2 className="font-bold text-brand-textMain">{filteredArtists.length} Results Found</h2>
                 </div>
                 <div className="relative">
                    <select 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none bg-gray-800 border border-gray-600 text-xs font-bold text-white py-1.5 pl-3 pr-8 rounded-lg focus:outline-none cursor-pointer shadow-sm hover:border-brand-primary"
                    >
                      <option>Recommended</option>
                      <option>Distance</option>
                      <option>Price: Low to High</option>
                      <option>Highest Rated</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                 </div>
               </div>
               
               <div className="flex-grow overflow-y-auto pr-2 space-y-4 no-scrollbar pb-20 lg:pb-0">
                 {isLoadingNearby ? (
                   <div className="text-center py-10">Loading nearby artists...</div>
                 ) : displayedArtists.length > 0 ? (
                   <>
                     {displayedArtists.map(artist => <ArtistListCard key={artist.id} artist={artist} />)}
                   </>
                 ) : (
                   <div className="text-center py-10 bg-white rounded-card shadow-sm border border-gray-100">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Navigation size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-brand-textMain mb-2">No artists found nearby</h3>
                      <p className="text-sm text-brand-textBody mb-6 max-w-xs mx-auto">
                        Try expanding your search radius to 50km or 100km.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setSearchRadius(50)} className="text-xs bg-brand-surface border border-gray-300 px-3 py-1.5 rounded font-bold hover:bg-gray-200">Expand to 50km</button>
                        <button onClick={() => setSearchRadius('All')} className="text-xs bg-brand-primary text-white px-3 py-1.5 rounded font-bold hover:bg-brand-primaryDark">Search All India</button>
                      </div>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Right Column: Map View */}
          <div className={`w-full lg:w-2/3 h-full rounded-card overflow-hidden shadow-card border border-gray-200 relative bg-blue-50 ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
             <div className="absolute inset-0 bg-[#eef2f6] relative overflow-hidden group">
               {/* Pattern */}
               <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
               </div>
               
               {/* Use My Location Button */}
               <button onClick={detectUserLocation} className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-50 text-brand-primary" title="Use My Location">
                 <Navigation size={20} className={isLocating ? 'animate-spin' : ''} />
               </button>
               
               {/* Markers */}
               {displayedArtists.map(artist => (
                 <div 
                   key={artist.id}
                   className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 z-0 hover:z-20"
                   style={{ top: `${artist.lat}%`, left: `${artist.lng}%` }}
                   onClick={() => setSelectedMapArtist(artist)}
                 >
                   <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white ${
                      artist.category.includes('Singer') ? 'bg-red-500' : 'bg-brand-primary'
                   }`}>
                      {getCategoryIcon(artist.category)}
                   </div>
                 </div>
               ))}
               
               {/* Popup */}
               {selectedMapArtist && (
                 <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white rounded-card shadow-2xl p-4 z-30 animate-fade-in-up border border-gray-100">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedMapArtist(null); }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                    <div className="flex gap-4">
                       <img src={selectedMapArtist.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                       <div>
                         <h4 className="font-bold text-brand-textMain text-base">{selectedMapArtist.name}</h4>
                         <p className="text-xs text-brand-textSub mb-1">{selectedMapArtist.category}</p>
                         {selectedMapArtist.distance !== undefined && selectedMapArtist.distance !== null && (
                            <span className="text-[10px] text-brand-primary font-bold">{selectedMapArtist.distance.toFixed(1)} km away</span>
                         )}
                       </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                       <FollowButton artistId={selectedMapArtist.id} artistName={selectedMapArtist.name} initialIsFollowing={selectedMapArtist.isFollowed} compact />
                       <button className="flex-1 bg-brand-primary text-white py-2 rounded text-xs font-bold hover:bg-brand-primaryDark transition">Book Now</button>
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
           <button 
             onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
             className="bg-brand-textMain text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
           >
             {viewMode === 'list' ? <><MapIcon size={18} /> View Map</> : <><List size={18} /> View List</>}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Directory;
