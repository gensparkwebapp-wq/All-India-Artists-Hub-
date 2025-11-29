import React, { useState, useMemo } from 'react';
import { Search, Briefcase, Mic, ChevronDown } from 'lucide-react';
import { HERO_STATS, LOCATION_DATA, CATEGORIES } from '../constants';

const Hero: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [category, setCategory] = useState("Select Category...");
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const districts = useMemo(() => {
    return LOCATION_DATA.find(s => s.name === selectedState)?.districts || [];
  }, [selectedState]);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        // Simple heuristic matching for categories
        if (transcript.includes('singer')) setCategory('Singer');
        else if (transcript.includes('musician')) setCategory('Musician');
        else if (transcript.includes('actor') || transcript.includes('model')) setCategory('Actor / Model');
        else if (transcript.includes('studio')) setCategory('Recording Studio');
        else if (transcript.includes('sound') || transcript.includes('dj')) setCategory('Live Sound / DJ');
        else if (transcript.includes('event')) setCategory('Event Manager');
        else {
          alert(`Heard: "${transcript}". Please try saying a category like Singer, Actor, or Studio.`);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Voice search is not supported in this browser.");
    }
  };

  return (
    <section className="relative bg-brand-textMain text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/seed/concert/1920/1080" 
          alt="Artists Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-textMain via-brand-textMain/90 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="lg:w-7/12 space-y-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
              India ka Sabse Bada Artists Platform <br/>
              <span className="text-brand-primary">Singer, Musician, Actor, Studio...</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl leading-relaxed">
              Khojo • Connect Karo • Book Karo • Earn Karo – All India Artists, Studios, Live Sound & Events ek hi digital छत के नीचे.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-white text-brand-primaryDark px-8 py-4 rounded-card font-bold hover:bg-gray-100 transition duration-250 shadow-lg hover:-translate-y-1">
                Find Artists Near Me
              </button>
              <button className="bg-brand-primary text-white px-8 py-4 rounded-card font-bold hover:bg-brand-primaryDark transition duration-250 shadow-lg hover:-translate-y-1">
                Join as Artist / Studio
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {HERO_STATS.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md p-4 rounded-card border border-white/10 hover:bg-white/10 transition">
                  <div className="text-2xl md:text-3xl font-bold text-brand-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Search Box */}
          <div className="lg:w-5/12 w-full">
            <div className="bg-white text-gray-800 p-8 rounded-card shadow-card-hover">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center text-brand-textMain">
                  <Search className="w-5 h-5 mr-2 text-brand-primary" />
                  Quick Artist Search
                </h3>
                {isListening && <span className="text-xs text-red-500 animate-pulse font-semibold">Listening...</span>}
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-brand-textSub mb-2 uppercase tracking-wide">What are you looking for?</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-card focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:outline-none appearance-none bg-white text-brand-textMain"
                    >
                      <option>Select Category...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button 
                      onClick={startListening}
                      className={`absolute right-2 top-2 p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      title="Voice Search"
                      type="button"
                    >
                      <Mic size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-textSub mb-2 uppercase tracking-wide">State</label>
                    <div className="relative">
                      <select 
                        value={selectedState}
                        onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                        className="w-full px-3 py-3 border border-gray-200 rounded-card focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:outline-none bg-white text-sm text-brand-textMain appearance-none"
                      >
                        <option value="">All India</option>
                        {LOCATION_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-textSub mb-2 uppercase tracking-wide">District</label>
                    <div className="relative">
                      <select 
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedState}
                        className="w-full px-3 py-3 border border-gray-200 rounded-card focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:outline-none bg-white text-sm text-brand-textMain appearance-none disabled:opacity-50"
                      >
                        <option value="">Select...</option>
                        {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-brand-textSub mb-2 uppercase tracking-wide">Budget Range</label>
                   <div className="flex gap-4">
                     <input type="number" placeholder="Min Budget" className="w-1/2 px-3 py-3 border border-gray-200 rounded-card text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:outline-none text-brand-textMain placeholder-gray-400" />
                     <input type="number" placeholder="Max Budget" className="w-1/2 px-3 py-3 border border-gray-200 rounded-card text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:outline-none text-brand-textMain placeholder-gray-400" />
                   </div>
                </div>

                <button className="w-full bg-brand-primary text-white py-4 rounded-card font-bold hover:bg-brand-primaryDark transition duration-250 text-lg shadow-md hover:-translate-y-1">
                  Search Now
                </button>
                
                <p className="text-xs text-center text-brand-textBody mt-3 font-medium">
                  Advanced filters available on Directory page
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;