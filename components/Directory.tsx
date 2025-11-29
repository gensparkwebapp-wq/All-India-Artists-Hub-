import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, Star, Navigation, MapPin, Search, Filter, X, ChevronDown } from 'lucide-react';
import { BadgeType, PageData, DirectoryArtist } from '../types';
import { DIRECTORY_ARTISTS, LOCATION_DATA, CATEGORIES, SUBCATEGORIES } from '../constants';
import FollowButton from './FollowButton';
import SectionHeading from './SectionHeading';

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

  // Handle Initial Filters update
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.state) setSelectedState(initialFilters.state);
      if (initialFilters.district) setSelectedDistrict(initialFilters.district);
    }
  }, [initialFilters]);

  const districts = useMemo(() => {
    return LOCATION_DATA.find(s => s.name === selectedState)?.districts || [];
  }, [selectedState]);

  const subCategories = useMemo(() => {
    return selectedCategory ? SUBCATEGORIES[selectedCategory] || [] : [];
  }, [selectedCategory]);

  const filteredArtists = useMemo(() => {
    return DIRECTORY_ARTISTS.filter(artist => {
      if (searchTerm && !artist.name.toLowerCase().includes(searchTerm.toLowerCase()) && !artist.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
      if (selectedState && artist.state !== selectedState) return false;
      if (selectedDistrict && artist.district !== selectedDistrict) return false;
      if (selectedCategory && artist.category !== selectedCategory) return false;
      if (selectedSubCategory && artist.subcategory !== selectedSubCategory) return false;
      return true;
    }).map(artist => ({
        ...artist,
        distance: initialFilters?.nearby ? Math.random() * 10 : undefined // Mock distance if nearby is requested
    }));
  }, [searchTerm, selectedState, selectedDistrict, selectedCategory, selectedSubCategory, initialFilters]);

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
                       className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                     />
                     <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                   </div>
                 </div>

                 {/* Location */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location</label>
                   <select 
                      value={selectedState} 
                      onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm mb-2"
                   >
                     <option value="">All States</option>
                     {LOCATION_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                   </select>
                   <select 
                      value={selectedDistrict} 
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedState}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50"
                   >
                     <option value="">All Districts</option>
                     {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                   </select>
                 </div>

                 {/* Category */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                   <select 
                      value={selectedCategory} 
                      onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubCategory(''); }}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm mb-2"
                   >
                     <option value="">All Categories</option>
                     {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                   
                   {selectedCategory && subCategories.length > 0 && (
                     <select 
                        value={selectedSubCategory} 
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm animate-fade-in"
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
               <p className="text-sm text-gray-500">Showing <strong>{filteredArtists.length}</strong> artists</p>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-500">Sort By:</span>
                 <select className="text-xs border-none bg-transparent font-bold text-brand-textMain focus:ring-0 cursor-pointer">
                   <option>Recommended</option>
                   <option>Rating: High to Low</option>
                   <option>Price: Low to High</option>
                 </select>
               </div>
            </div>

            {filteredArtists.length > 0 ? (
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
                 <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                 <button 
                    onClick={() => {
                        setSearchTerm('');
                        setSelectedState('');
                        setSelectedDistrict('');
                        setSelectedCategory('');
                        setSelectedSubCategory('');
                    }}
                    className="mt-4 text-brand-primary font-bold hover:underline"
                 >
                   Clear All Filters
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory;