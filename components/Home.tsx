
import React, { useState, useMemo, useEffect } from 'react';
import Hero from './Hero';
import SectionHeading from './SectionHeading';
import { BadgeType, LocationDistrict } from '../types';
import { TOP_ARTISTS, STUDIOS, JOBS, TEACHERS, PRODUCTS, LOCATION_DATA, CATEGORIES, DIRECTORY_ARTISTS } from '../constants';
import { 
  Mic, Music, Clapperboard, MonitorPlay, Speaker, 
  Map, Calendar, Users, Heart, Star, MapPin, CheckCircle, Video, PlayCircle,
  User, Briefcase, Youtube, ChevronDown, Sparkles, Flame, ThumbsUp
} from 'lucide-react';

const ArtistCard: React.FC<{ artist: any; highlightBadge?: React.ReactNode }> = ({ artist, highlightBadge }) => (
  <div className="min-w-[160px] md:min-w-[220px] flex flex-col items-center p-4 cursor-pointer hover:-translate-y-2 transition-all duration-300 bg-white rounded-card shadow-card hover:shadow-card-hover border border-transparent relative group">
    {highlightBadge && (
      <div className="absolute top-3 left-3 z-10">{highlightBadge}</div>
    )}
    <div className="relative mb-3">
      <div className={`p-1 rounded-full ${
        artist.badge === BadgeType.GOLDEN ? 'bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300' :
        artist.badge === BadgeType.GOLD ? 'bg-yellow-400' :
        artist.badge === BadgeType.SILVER ? 'bg-gray-300' : 'bg-transparent'
      }`}>
        <img src={artist.imageUrl} alt={artist.name} className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-sm" />
      </div>
      {artist.badge === BadgeType.GOLDEN && (
        <div className="absolute -bottom-2 w-full text-center">
          <span className="bg-yellow-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm font-bold tracking-wide">Prashasti Patra</span>
        </div>
      )}
    </div>
    <h3 className="font-bold text-brand-textHeading text-center text-base md:text-lg mb-1 group-hover:text-brand-primary transition-colors">{artist.name}</h3>
    <p className="text-xs text-brand-textBody text-center font-medium">{artist.category}</p>
    <div className="flex items-center text-xs text-yellow-500 mt-2 font-semibold">
      <Star size={12} fill="currentColor" className="mr-1"/> {artist.rating} • <span className="text-brand-textBody ml-1 font-normal">{artist.city}</span>
    </div>
  </div>
);

const CategoryCard = ({ icon: Icon, title, desc, color }: any) => (
  <div className="bg-white p-6 rounded-card shadow-card hover:shadow-card-hover border border-transparent transition-all duration-300 group text-center md:text-left hover:-translate-y-2">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto md:mx-0 ${color} shadow-md`}>
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="font-bold text-xl mb-2 text-brand-textHeading group-hover:text-brand-primary transition">{title}</h3>
    <p className="text-sm text-brand-textBody mb-5 leading-relaxed">{desc}</p>
    <button className="text-brand-primary text-sm font-bold hover:underline underline-offset-4 flex items-center justify-center md:justify-start">
      View All Artists <span className="ml-1 text-lg leading-none">&rarr;</span>
    </button>
  </div>
);

const StudioCard: React.FC<{ studio: any }> = ({ studio }) => (
  <div className="bg-white rounded-card shadow-card hover:shadow-card-hover border border-transparent overflow-hidden group transition-all duration-300 hover:-translate-y-2">
    <div className="h-48 overflow-hidden relative">
      <img src={studio.imageUrl} alt={studio.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-brand-textMain text-xs font-bold px-2 py-1 rounded shadow-sm">{studio.type.toUpperCase()}</div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-lg text-brand-textHeading">{studio.name}</h4>
        <span className="text-xs bg-brand-surface text-brand-textBody px-2 py-1 rounded-full font-medium border border-gray-100">{studio.city}</span>
      </div>
      <p className="text-sm text-brand-textBody mb-4 line-clamp-1">{studio.services.join(', ')}</p>
      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
        <span className="font-bold text-brand-primary text-lg">₹{studio.priceStart}+</span>
        <button className="text-xs bg-brand-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-brand-primaryDark transition shadow-sm">Book Now</button>
      </div>
    </div>
  </div>
);

const MessageIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
)

const Home: React.FC = () => {
  // --- AI Engine State & Logic ---
  const [userInterest, setUserInterest] = useState<string>('Singer'); // Default interest
  const [userLocation, setUserLocation] = useState<string>('Jaipur'); // Default location simulation

  // Simulate learning: Change interest on interactions (can be expanded)
  // For demo, we just rely on the default or voice search updates.

  // --- AI Recommendations ---
  const aiRecommendations = useMemo(() => {
    return {
      // 1. Recommended for You (Matches Interest + High Rating)
      forYou: DIRECTORY_ARTISTS
        .filter(a => a.category.includes(userInterest) || a.skills.some(s => s.includes(userInterest)))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5),

      // 2. Trending Now (Trending Flag + Views)
      trending: DIRECTORY_ARTISTS
        .filter(a => a.isTrending)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5),

      // 3. New Joiners (Simulated by Date - assuming mockup data has it or we pick some)
      newJoiners: DIRECTORY_ARTISTS
        .filter(a => a.joinedDate && new Date(a.joinedDate) > new Date('2023-06-01'))
        .sort((a, b) => (b.joinedDate ? new Date(b.joinedDate).getTime() : 0) - (a.joinedDate ? new Date(a.joinedDate).getTime() : 0))
        .slice(0, 5)
    };
  }, [userInterest]);

  // --- Quick Filter State for Map Section ---
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Derived Districts based on State
  const districts = useMemo(() => {
    return LOCATION_DATA.find(s => s.name === selectedState)?.districts || [];
  }, [selectedState]);

  // Filtered Artists for Home Map Section (Limit to top results)
  const filteredHomeArtists = useMemo(() => {
    return DIRECTORY_ARTISTS.filter(artist => {
      if (selectedState && artist.state !== selectedState) return false;
      if (selectedDistrict && artist.district !== selectedDistrict) return false;
      if (selectedCategory && artist.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedState, selectedDistrict, selectedCategory]);

  const displayArtists = filteredHomeArtists.slice(0, 3);

  return (
    <div className="bg-brand-surface font-sans text-brand-textBody">
      <Hero />

      {/* --- AI Personalized Banner --- */}
      <div className="bg-gradient-to-r from-blue-900 to-brand-primary text-white py-3 overflow-hidden relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
           <div className="flex items-center gap-2 animate-fade-in text-sm md:text-base font-medium">
             <Sparkles size={18} className="text-yellow-300 animate-pulse" />
             <span>
               Hello! Based on your interest in <strong>{userInterest}</strong>, we have found {aiRecommendations.forYou.length} top artists for you.
             </span>
           </div>
           <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition hidden md:block">
             Personalize Recommendations
           </button>
        </div>
      </div>

      {/* 3. AI - Recommended For You */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <ThumbsUp className="text-brand-primary" size={24} />
                <h3 className="font-bold text-xl text-brand-textHeading">Recommended For You</h3>
             </div>
             <a href="#" className="text-brand-primary text-sm font-bold hover:underline">View All</a>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x px-1">
            {aiRecommendations.forYou.length > 0 ? (
              aiRecommendations.forYou.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))
            ) : (
               <div className="text-sm text-gray-500 italic">Explore more categories to get personalized recommendations.</div>
            )}
          </div>
        </div>
      </section>

      {/* 4. AI - Trending Now */}
      <section className="py-12 bg-brand-surface border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <Flame className="text-orange-500" size={24} />
                <h3 className="font-bold text-xl text-brand-textHeading">Trending Now</h3>
             </div>
             <a href="#" className="text-brand-primary text-sm font-bold hover:underline">View Leaderboard</a>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x px-1">
            {aiRecommendations.trending.map((artist) => (
              <ArtistCard 
                key={artist.id} 
                artist={artist} 
                highlightBadge={<span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm"><Flame size={10} fill="currentColor"/> Trending</span>}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Explore by Category */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Explore Categories" centered />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard 
            icon={Mic} title="Singers" desc="Bollywood, Folk, Rapper, Wedding & Devotional Singers" color="bg-red-500"
          />
          <CategoryCard 
            icon={Music} title="Musicians" desc="Guitarist, Keyboard, Drummer, Live Bands" color="bg-blue-500"
          />
          <CategoryCard 
            icon={Clapperboard} title="Actors & Models" desc="Film, TV, Theatre, Child Artist, Junior Artist" color="bg-purple-500"
          />
          <CategoryCard 
            icon={Video} title="Studios" desc="Recording, Dubbing, Video Shoot, Photography" color="bg-indigo-600"
          />
          <CategoryCard 
            icon={Speaker} title="Live Sound" desc="PA Systems, DJ Sound, LED Walls, Stage Setup" color="bg-orange-500"
          />
          <CategoryCard 
            icon={Calendar} title="Event Managers" desc="Wedding Planners, Organizers, Celebrity Booking" color="bg-pink-500"
          />
        </div>
      </section>

      {/* 6. AI - New Joiners */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <Sparkles className="text-purple-500" size={24} />
                <h3 className="font-bold text-xl text-brand-textHeading">New Artists Near You</h3>
             </div>
             <a href="#" className="text-brand-primary text-sm font-bold hover:underline">View All New</a>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x px-1">
            {aiRecommendations.newJoiners.map((artist) => (
              <ArtistCard 
                key={artist.id} 
                artist={artist}
                highlightBadge={<span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">New Joiner</span>} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Map Section */}
      <section className="bg-brand-surface py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
           <SectionHeading title="Aapke Sheher ke Artists – Map par dekhiyé" subtext="Find talent in your specific block, district or pincode" />
           
           <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 bg-white p-8 rounded-card shadow-card border border-transparent h-fit">
                <h4 className="font-bold text-xl mb-6 text-brand-textHeading">Quick Filter</h4>
                <div className="space-y-4">
                   <div className="relative">
                     <select 
                       value={selectedState} 
                       onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                       className="w-full border border-gray-200 p-3 rounded-card text-sm bg-brand-surface text-brand-textMain focus:ring-2 focus:ring-brand-primary outline-none appearance-none"
                     >
                       <option value="">Select State</option>
                       {LOCATION_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                     </select>
                     <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                   </div>

                   <div className="relative">
                     <select 
                       value={selectedDistrict}
                       onChange={(e) => setSelectedDistrict(e.target.value)}
                       disabled={!selectedState}
                       className="w-full border border-gray-200 p-3 rounded-card text-sm bg-brand-surface text-brand-textMain focus:ring-2 focus:ring-brand-primary outline-none appearance-none disabled:opacity-50"
                     >
                       <option value="">Select District</option>
                       {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                     </select>
                     <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                   </div>

                   <div className="relative">
                     <select 
                       value={selectedCategory}
                       onChange={(e) => setSelectedCategory(e.target.value)}
                       className="w-full border border-gray-200 p-3 rounded-card text-sm bg-brand-surface text-brand-textMain focus:ring-2 focus:ring-brand-primary outline-none appearance-none"
                     >
                       <option value="">All Categories</option>
                       {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                   </div>

                   <button className="w-full bg-brand-primary text-white py-3 rounded-card font-bold mt-4 shadow-md hover:bg-brand-primaryDark transition hover:-translate-y-0.5">Open Full Directory</button>
                </div>
                <div className="mt-8">
                  <h5 className="text-sm font-bold text-brand-textSub mb-4 uppercase tracking-wide">
                    {selectedDistrict ? `Artists in ${selectedDistrict}` : 'Top Artists'}
                  </h5>
                  <div className="space-y-4">
                    {displayArtists.length > 0 ? (
                      displayArtists.map(artist => (
                        <div key={artist.id} className="flex items-center gap-4 border-b border-gray-100 pb-3 last:border-0 group cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                          <img src={artist.imageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                          <div className="flex-grow">
                             <div className="text-sm font-bold text-brand-textMain group-hover:text-brand-primary">{artist.name}</div>
                             <div className="text-xs text-brand-textBody">{artist.category} • {artist.rating}★</div>
                          </div>
                          <button className="text-xs bg-brand-surface border border-gray-200 px-2 py-1 rounded font-semibold hover:bg-brand-primary hover:text-white transition">View</button>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 italic">No artists found in this area. Try checking the full directory.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:w-2/3 bg-gray-200 rounded-card h-[450px] relative overflow-hidden group shadow-inner">
                 {/* Mock Map */}
                 <img src="https://picsum.photos/seed/map/800/600" alt="Map Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-700" />
                 
                 {/* Dynamic Pins based on Filtered Artists */}
                 {displayArtists.map((artist, idx) => (
                    <div 
                      key={artist.id} 
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce drop-shadow-lg flex flex-col items-center"
                      style={{ 
                        top: `${artist.lat}%`, 
                        left: `${artist.lng}%`,
                        animationDelay: `${idx * 150}ms`
                      }}
                    >
                      <MapPin size={36} className="text-brand-primary fill-current" />
                      <span className="bg-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm mt-1">{artist.name}</span>
                    </div>
                 ))}

                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-transparent transition pointer-events-none">
                    <button className="pointer-events-auto bg-white text-brand-textMain px-8 py-3 rounded-full shadow-2xl font-bold hover:scale-105 transition flex items-center border border-gray-200">
                      <Map className="mr-2 text-brand-primary" size={20} /> Explore Interactive Map
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 8. Studios & Sound */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Recording Studio, Video Shoot & Live Sound" subtext="One Click Booking for your next project" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {STUDIOS.map(studio => <StudioCard key={studio.id} studio={studio} />)}
        </div>
        <div className="text-center mt-12">
          <button className="border-2 border-brand-textMain text-brand-textMain px-8 py-3 rounded-full font-bold hover:bg-brand-textMain hover:text-white transition duration-300">
            View All Studios & Live Sound Vendors
          </button>
        </div>
      </section>

      {/* 9. Social Feed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Artists ki Latest Activity" centered subtext="Reels, Shorts, Updates direct from the community" />
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
             {[1, 2].map(item => (
               <div key={item} className="w-full md:w-[400px] bg-white border border-transparent rounded-card shadow-card hover:shadow-card-hover transition duration-300 hover:-translate-y-2">
                  <div className="p-4 flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/artist${item}/50/50`} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-brand-textMain">Priya Singh</h4>
                      <p className="text-xs text-brand-textSub">2 hours ago • Mumbai</p>
                    </div>
                  </div>
                  <div className="h-72 bg-gray-100 overflow-hidden relative">
                    <img src={`https://picsum.photos/seed/post${item}/400/300`} className="w-full h-full object-cover" />
                    <PlayCircle className="absolute inset-0 m-auto text-white/90 w-14 h-14 drop-shadow-lg cursor-pointer hover:scale-110 transition" />
                  </div>
                  <div className="p-4 flex gap-6 text-brand-textSub border-t border-gray-50">
                     <span className="flex items-center text-sm font-medium hover:text-brand-primary cursor-pointer transition"><Heart size={18} className="mr-2"/> Like</span>
                     <span className="flex items-center text-sm font-medium hover:text-brand-primary cursor-pointer transition"><Users size={18} className="mr-2"/> Share</span>
                  </div>
               </div>
             ))}
          </div>
          <p className="text-center text-sm text-brand-textBody mt-6 font-medium">Full social feed dekhne ke liye login karein.</p>
        </div>
      </section>

      {/* 10. Job Portal */}
      <section className="py-20 bg-brand-surface border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3 sticky top-24">
               <SectionHeading title="Jobs & Auditions" subtext="Singing, Dancing, Acting opportunities" />
               <ul className="space-y-4 mb-8 text-brand-textBody">
                 <li className="flex items-center"><CheckCircle size={20} className="text-green-500 mr-3"/> Free Job Posting</li>
                 <li className="flex items-center"><CheckCircle size={20} className="text-green-500 mr-3"/> Direct Contact</li>
                 <li className="flex items-center"><CheckCircle size={20} className="text-green-500 mr-3"/> Verified Profiles</li>
               </ul>
               <div className="flex gap-4">
                 <button className="bg-brand-primary text-white px-6 py-3 rounded-card font-bold shadow-md hover:bg-brand-primaryDark transition">Browse Jobs</button>
                 <button className="bg-white border-2 border-brand-primary text-brand-primary px-6 py-3 rounded-card font-bold hover:bg-blue-50 transition">Post a Job</button>
               </div>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
               {JOBS.map(job => (
                 <div key={job.id} className="bg-white p-6 rounded-card shadow-card border-l-4 border-brand-primary hover:shadow-card-hover transition duration-300 hover:-translate-y-2">
                    <h4 className="font-bold text-brand-textMain mb-2 text-lg">{job.title}</h4>
                    <p className="text-sm text-brand-textBody mb-4 flex items-center"><MapPin size={14} className="mr-1"/> {job.location}</p>
                    <div className="flex justify-between items-center text-xs mb-4">
                      <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{job.budget}</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{job.type}</span>
                    </div>
                    <button className="w-full text-sm bg-brand-primary text-white py-2.5 rounded-lg font-semibold hover:bg-brand-primaryDark transition">Apply Now</button>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Live Classes */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Live Online Classes" subtext="Direct from Verified Artists" centered />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEACHERS.map(teacher => (
            <div key={teacher.id} className="flex bg-white rounded-card shadow-card hover:shadow-card-hover overflow-hidden border border-transparent transition-all duration-300 hover:-translate-y-2">
               <img src={teacher.imageUrl} className="w-1/3 object-cover" alt={teacher.name} />
               <div className="p-5 w-2/3 flex flex-col justify-between">
                 <div>
                   <h4 className="font-bold text-base text-brand-textHeading">{teacher.name}</h4>
                   <p className="text-xs text-brand-primary font-bold uppercase tracking-wide mt-1">{teacher.subject}</p>
                   <p className="text-xs text-brand-textBody mt-1">{teacher.city}</p>
                 </div>
                 <div className="flex justify-between items-end mt-4">
                   <div>
                      <span className="text-xs text-gray-400 block">Rate</span>
                      <span className="text-base font-bold text-brand-textHeading">₹{teacher.ratePerMin}<span className="text-xs font-normal">/min</span></span>
                   </div>
                   <button className="text-xs bg-brand-primary text-white px-3 py-1.5 rounded-full font-bold hover:bg-brand-primaryDark transition">Book Class</button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Video Zone */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Watch & Earn - Video Zone" light />
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/3">
              <div className="bg-gray-900 rounded-card overflow-hidden shadow-2xl border border-gray-800 hover:border-gray-700 transition">
                <img src="https://picsum.photos/seed/featured/600/350" className="w-full opacity-90" />
                <div className="p-6">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2 block">Featured Channel</span>
                  <h3 className="text-2xl font-bold mb-2">Swar Raag Music Academy</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Best tutorials for classical music and instrument learning.</p>
                  <button className="bg-red-600 text-white px-6 py-3 rounded-card w-full font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg">
                    <Youtube size={20} /> Visit Channel
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3">
              <h4 className="text-xl font-bold mb-6 text-gray-200">Trending Shorts & Music Videos</h4>
              <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="min-w-[160px] bg-gray-900 rounded-card overflow-hidden border border-gray-800 hover:-translate-y-2 transition duration-300">
                    <div className="h-32 md:h-40 relative group">
                       <img src={`https://picsum.photos/seed/vid${i}/300/400`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                       <PlayCircle className="absolute inset-0 m-auto w-10 h-10 text-white opacity-90" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold line-clamp-2 text-gray-300">Amazing Vocal Performance by Rahul</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-gray-900 rounded-card border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400 max-w-lg">Channel banaiye, videos upload kijiye, views & earnings track kijiye – sab ek hi dashboard se.</p>
                <button className="text-sm bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition">Open Video Zone</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Marketplace */}
      <section className="py-20 container mx-auto px-4 bg-brand-surface">
        <SectionHeading title="Artist Marketplace" subtext="Buy & Sell Instruments & Gear" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {PRODUCTS.map(product => (
             <div key={product.id} className="bg-white rounded-card shadow-card hover:shadow-card-hover p-4 group transition-all duration-300 hover:-translate-y-2 border border-transparent">
               <div className="relative overflow-hidden rounded-lg mb-4">
                 <img src={product.imageUrl} className="w-full h-40 object-cover group-hover:scale-110 transition duration-500" />
                 <span className="absolute top-2 right-2 text-[10px] bg-black/70 backdrop-blur text-white px-2 py-1 rounded font-medium">{product.condition}</span>
               </div>
               <h4 className="text-base font-bold truncate text-brand-textMain mb-1">{product.title}</h4>
               <p className="text-lg font-extrabold text-brand-primary mb-2">₹{product.price.toLocaleString()}</p>
               <p className="text-xs text-brand-textBody mb-4 flex items-center"><MapPin size={10} className="mr-1"/>{product.city}</p>
               <button className="w-full bg-brand-textMain text-white text-xs py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition">
                 <MessageIcon size={14} /> Contact Seller
               </button>
             </div>
           ))}
        </div>
      </section>

      {/* 14. Podcasts / News */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {/* Podcasts */}
           <div>
             <h3 className="font-bold text-xl mb-6 pb-2 border-b border-gray-200 text-brand-textHeading">Artist Podcasts</h3>
             <div className="space-y-4">
               {[1,2].map(i => (
                 <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-card shadow-card hover:shadow-card-hover transition cursor-pointer border border-transparent hover:-translate-y-1">
                   <div className="w-14 h-14 bg-[#E6EEFF] rounded-full flex items-center justify-center text-brand-primary shadow-sm"><Mic size={24} /></div>
                   <div>
                     <h4 className="text-base font-bold text-brand-textMain">Music Career Talk</h4>
                     <p className="text-xs text-brand-textSub font-medium">Ep {i}: Ft. Sonu Nigam</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
           
           {/* News */}
           <div>
             <h3 className="font-bold text-xl mb-6 pb-2 border-b border-gray-200 text-brand-textHeading">Artist News</h3>
             <ul className="space-y-4">
               <li className="text-sm text-brand-textBody hover:text-brand-primary cursor-pointer font-medium leading-relaxed">• New Artist Welfare Scheme Launched by NGO</li>
               <li className="text-sm text-brand-textBody hover:text-brand-primary cursor-pointer font-medium leading-relaxed">• Top 10 Tips for New Singers in 2024</li>
               <li className="text-sm text-brand-textBody hover:text-brand-primary cursor-pointer font-medium leading-relaxed">• Government Grants for Folk Artists declared</li>
             </ul>
           </div>

           {/* Events */}
           <div>
             <h3 className="font-bold text-xl mb-6 pb-2 border-b border-gray-200 text-brand-textHeading">Upcoming Events</h3>
             <div className="bg-orange-50 p-6 rounded-card border border-orange-100 hover:shadow-md transition">
               <h4 className="font-bold text-brand-orange text-lg mb-2">Singing Competition</h4>
               <p className="text-sm text-gray-700 mb-3 font-medium">Jaipur • 25th Oct</p>
               <button className="text-sm text-brand-orange font-bold hover:underline">View Details &rarr;</button>
             </div>
           </div>
        </div>
      </section>

      {/* 15. NGO */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Artist Welfare" light subtext="by Meri Pahal Fast Help Artist Welfare Association" centered />
          <div className="flex flex-col md:flex-row gap-12 items-center mt-12">
            <div className="md:w-1/2">
               <h3 className="text-3xl font-extrabold mb-6">Our Mission</h3>
               <p className="mb-8 text-blue-100 text-lg leading-relaxed">
                 Hamari NGO ka lakshya hai Bharat ke har kalakar ko social security, medical support, job opportunities, aur financial help dena. We stand for the dignity of art.
               </p>
               <ul className="space-y-4 mb-8">
                 <li className="flex items-center text-blue-50 text-lg font-medium"><Star size={20} className="mr-3 text-yellow-400 fill-current"/> Free/Low-cost health support</li>
                 <li className="flex items-center text-blue-50 text-lg font-medium"><Star size={20} className="mr-3 text-yellow-400 fill-current"/> Emergency Help for Artists</li>
                 <li className="flex items-center text-blue-50 text-lg font-medium"><Star size={20} className="mr-3 text-yellow-400 fill-current"/> Artist ID Card & Official Directory</li>
               </ul>
            </div>
            <div className="md:w-1/2 flex flex-col gap-6 w-full">
               <div className="bg-white/10 p-8 rounded-card backdrop-blur-md border border-white/20 shadow-2xl">
                 <h4 className="text-2xl font-bold mb-3">Need Support?</h4>
                 <p className="text-base mb-6 opacity-90">Apply for welfare programs today.</p>
                 <button className="bg-white text-brand-primary px-8 py-4 rounded-full font-bold w-full hover:bg-gray-100 transition shadow-lg text-lg">Apply for Artist Welfare</button>
               </div>
               <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold w-full hover:bg-white/10 transition text-lg">Know More About NGO</button>
            </div>
          </div>
        </div>
      </section>

      {/* 16. How it Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading title="Ye Platform Kaise Kaam Karta Hai?" centered />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-10">
            {[
              { icon: User, title: "1. Join for Free", desc: "Artist, Studio ya Organizer ke roop me ek registration karein." },
              { icon: MonitorPlay, title: "2. Create Profile", desc: "Apne photos, videos, audio, links & skills add karein." },
              { icon: Briefcase, title: "3. Get Opportunities", desc: "Direct booking, jobs & online classes se earning shuru karein." }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white p-8 rounded-card shadow-card hover:shadow-card-hover transition duration-300 hover:-translate-y-2 border border-transparent">
                <div className="w-20 h-20 bg-[#E6EEFF] rounded-full flex items-center justify-center mb-6 text-brand-primary shadow-sm">
                  <step.icon size={36} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-brand-textHeading">{step.title}</h4>
                <p className="text-brand-textBody leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <button className="bg-brand-primary text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-brand-primaryDark transition hover:-translate-y-1">Start Now - Register Free</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
