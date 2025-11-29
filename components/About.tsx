import React, { useState, useEffect, useRef } from 'react';
import SectionHeading from './SectionHeading';
import { Heart, Users, Shield, Award, Target, CheckCircle, Smartphone, Facebook, CreditCard, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const [missionVisible, setMissionVisible] = useState(false);
  const missionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMissionVisible(true);
          observer.disconnect(); // Trigger animation only once
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    if (missionRef.current) {
      observer.observe(missionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-brand-surface min-h-screen font-sans text-brand-textBody">
      {/* SECTION 1 — HERO HEADER */}
      <div className="relative bg-brand-textMain text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/indianculture/1920/1080" 
            alt="Indian Culture" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-textMain/95 via-brand-textMain/90 to-brand-textMain"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in-up">
          {/* Subtitle */}
          <p className="text-brand-primary font-bold uppercase tracking-wider text-xs md:text-sm mb-5">
            Sangeet Kalakar Union & Meri Pahal Fast Help Artist Welfare Association (Trust)
          </p>
          
          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            भारत के कलाकारों की आवाज़ – <br className="hidden md:block" />
            <span className="text-white">एकता, पहचान और सम्मान</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-2xl text-gray-300 font-light italic mb-12 max-w-4xl mx-auto">
            "कलाकार सिर्फ़ मनोरंजन नहीं, एक राष्ट्र की सांस्कृतिक पहचान हैं।"
          </p>

          {/* Buttons Row */}
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center mb-16">
            <button className="bg-white text-brand-textMain px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-gray-100 transition flex items-center w-full md:w-auto justify-center group hover:-translate-y-1">
              <Smartphone className="mr-2 group-hover:scale-110 transition text-brand-primary" size={20} /> Join Kutumb App (45k+)
            </button>
            <button className="bg-[#1877F2] text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center w-full md:w-auto justify-center group hover:-translate-y-1">
              <Facebook className="mr-2 group-hover:scale-110 transition" size={20} /> Join Facebook Group
            </button>
             <button className="bg-brand-primary text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-brand-primaryDark transition flex items-center w-full md:w-auto justify-center group hover:-translate-y-1">
              <CreditCard className="mr-2 group-hover:scale-110 transition" size={20} /> Register as Artist (ID Card)
            </button>
          </div>

          {/* Counter Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10 max-w-6xl mx-auto">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">45k+</div>
              <div className="text-sm md:text-base text-gray-300 font-medium tracking-wide">कलाकार जुड़े</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">18+</div>
              <div className="text-sm md:text-base text-gray-300 font-medium tracking-wide">राज्यों में कार्यरत</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">400+</div>
              <div className="text-sm md:text-base text-gray-300 font-medium tracking-wide">जनप्रतिनिधि</div>
            </div>
             <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">2019</div>
              <div className="text-sm md:text-base text-gray-300 font-medium tracking-wide">से सक्रिय संगठन</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <section className="py-16 container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-8 rounded-card shadow-card hover:shadow-card-hover border-t-4 border-orange-500 text-center transform hover:-translate-y-2 transition duration-300">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-textMain">Sangathan (Unity)</h3>
            <p className="text-brand-textBody text-base leading-relaxed">Uniting artists from every village, district, and state of India under one digital roof.</p>
          </div>
          <div className="bg-white p-8 rounded-card shadow-card hover:shadow-card-hover border-t-4 border-green-600 text-center transform hover:-translate-y-2 transition duration-300">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-green">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-textMain">Suraksha (Security)</h3>
            <p className="text-brand-textBody text-base leading-relaxed">Providing social security, insurance, medical aid, and pension support to registered artists.</p>
          </div>
          <div className="bg-white p-8 rounded-card shadow-card hover:shadow-card-hover border-t-4 border-[#0F62FE] text-center transform hover:-translate-y-2 transition duration-300">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-textMain">Samman (Respect)</h3>
            <p className="text-brand-textBody text-base leading-relaxed">Ensuring fair pay, direct bookings without middlemen, and national recognition for talent.</p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Who We Are / हम कौन हैं */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <img src="https://picsum.photos/seed/teamwork123/800/600" alt="NGO Team Work" className="rounded-card shadow-2xl hover:scale-[1.02] transition duration-500" />
          </div>
          <div className="lg:w-1/2 space-y-8">
             <span className="text-brand-primary font-bold tracking-widest uppercase text-xs bg-brand-surface px-3 py-1 rounded-full border border-gray-100">About The Movement</span>
             
             {/* Bilingual Heading Correction */}
             <h2 className="text-3xl md:text-5xl font-extrabold text-brand-textMain leading-tight">
               Who We Are / <br className="md:hidden"/> <span className="text-brand-primary">हम कौन हैं</span>
             </h2>
             
             <div className="space-y-4">
                <p className="text-brand-textBody text-lg leading-relaxed font-medium">
                  <strong className="text-brand-textMain">Meri Pahal Fast Help Artist Welfare Association (Trust)</strong> और <strong className="text-brand-textMain">Sangeet Kalakar Union</strong> भारत के कलाकारों के लिए बनाया गया एक राष्ट्रीय प्लेटफ़ॉर्म और सामाजिक आंदोलन है।
                </p>
                <p className="text-brand-textBody text-base italic opacity-90">
                  (Meri Pahal Fast Help Artist Welfare Association & Sangeet Kalakar Union is a national platform and social movement designed for the artists of India.)
                </p>
             </div>

             <div 
               ref={missionRef}
               className="rounded-card border border-[#0F62FE] bg-gradient-to-r from-[#f0f7ff] to-[#f7faff] mt-8"
               style={{
                 boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                 padding: '28px 32px'
               }}
             >
               <h4 className="font-bold text-brand-textMain mb-6 text-lg">हमारा उद्देश्य है (Our Mission):</h4>
               <ul className="space-y-5">
                 <li 
                    className={`flex items-start gap-4 transition-all duration-1000 ease-out transform ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} 
                    style={{ transitionDelay: '200ms' }}
                 >
                   <CheckCircle className="mt-0.5 flex-shrink-0 text-brand-green" size={22}/> 
                   <div>
                     <span className="text-brand-textMain text-base font-bold">कलाकारों को पहचान देना</span>
                     <span className="text-brand-textBody text-sm ml-2 font-normal block md:inline">(Giving Identity)</span>
                   </div>
                 </li>
                 <li 
                    className={`flex items-start gap-4 transition-all duration-1000 ease-out transform ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} 
                    style={{ transitionDelay: '400ms' }}
                 >
                   <CheckCircle className="mt-0.5 flex-shrink-0 text-brand-green" size={22}/> 
                   <div>
                     <span className="text-brand-textMain text-base font-bold">कानूनी और सामाजिक सुरक्षा उपलब्ध कराना</span>
                     <span className="text-brand-textBody text-sm ml-2 font-normal block md:inline">(Legal & Social Security)</span>
                   </div>
                 </li>
                 <li 
                    className={`flex items-start gap-4 transition-all duration-1000 ease-out transform ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} 
                    style={{ transitionDelay: '600ms' }}
                 >
                   <CheckCircle className="mt-0.5 flex-shrink-0 text-brand-green" size={22}/> 
                   <div>
                     <span className="text-brand-textMain text-base font-bold">रोजगार और अवसरों से जोड़ना</span>
                     <span className="text-brand-textBody text-sm ml-2 font-normal block md:inline">(Connecting with Jobs)</span>
                   </div>
                 </li>
                 <li 
                    className={`flex items-start gap-4 transition-all duration-1000 ease-out transform ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} 
                    style={{ transitionDelay: '800ms' }}
                 >
                   <CheckCircle className="mt-0.5 flex-shrink-0 text-brand-orange" size={22}/> 
                   <div>
                     <span className="text-brand-textMain text-base font-bold text-brand-primary">और सबसे अहम — कलाकारों को सम्मान और अधिकार दिलाना।</span>
                   </div>
                 </li>
               </ul>
             </div>

             <div className="bg-blue-50 border-l-[6px] border-[#0F62FE] pl-6 py-5 rounded-r-lg">
                <p className="text-brand-textHeading leading-relaxed font-medium">
                  यह मंच संगीतकारों, गायकों, नर्तकों, यूट्यूब कलाकारों, बॉलीवुड कलाकारों, जूनियर आर्टिस्ट्स, स्टूडियो, लाइव साउंड टीम, DJs, इवेंट मैनेजर्स और सभी कला क्षेत्रों के लिए खुला है।
                </p>
             </div>

             <button className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-brand-primaryDark transition mt-4 hover:-translate-y-1">
               Download Trust Brochure
             </button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Why This Union Exists / बदलाव की ज़रूरत क्यों? */}
      <section className="py-24 bg-brand-surface">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-brand-warningBg rounded-full mb-6 text-brand-warning border border-red-100">
               <AlertTriangle size={32} />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-textMain mb-6">
              Why This Union Exists / <span className="text-brand-warning">बदलाव की ज़रूरत क्यों?</span>
            </h2>
            <p className="text-lg text-brand-textHeading max-w-2xl mx-auto font-medium">
              भारत में लाखों कलाकारों को ये चुनौतियाँ झेलनी पड़ती हैं: 
            </p>
            <p className="text-brand-textBody text-sm mt-1">(Millions of artists in India face these challenges)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              { title: "उचित भुगतान नहीं मिलता", sub: "(Unfair pay structures)" },
              { title: "एजेंट और मिडल-मैन द्वारा शोषण", sub: "(Exploitation by middlemen)" },
              { title: "मेडिकल / आर्थिक सहायता का अभाव", sub: "(Lack of medical/financial aid)" },
              { title: "Skill development की कमी", sub: "(Lack of verified identity & skills)" },
              { title: "कोई राष्ट्रीय Artist Protection Law नहीं", sub: "(No national Artist Protection Law)", full: true }
            ].map((item, idx) => (
              <div key={idx} className={`bg-white p-8 rounded-card shadow-card border border-transparent flex items-start gap-5 hover:shadow-card-hover transition hover:-translate-y-1 ${item.full ? 'md:col-span-2 lg:col-span-2 justify-center' : ''}`}>
                <div className="bg-brand-warningBg p-3 rounded-full flex-shrink-0">
                  <XCircle className="text-brand-warning" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-textMain text-lg mb-2">{item.title}</h4>
                  <p className="text-brand-textBody text-sm font-normal">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-xl md:text-2xl font-bold text-brand-primary flex items-center justify-center gap-3">
              हम इस स्थिति को बदलने के लिए काम कर रहे हैं <ArrowRight size={24} />
            </p>
          </div>
        </div>
      </section>

      {/* Objectives Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
           <SectionHeading title="Our Key Objectives" centered subtext="What we strive for every single day" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
              {[
                { title: "Digital Identity", desc: "Every artist gets a verified profile to showcase work globally." },
                { title: "Direct Income", desc: "Eliminating commission agents so artists earn what they deserve." },
                { title: "Crisis Support", desc: "Emergency funds for medical or financial crisis situations." },
                { title: "Skill Development", desc: "Workshops and training to upgrade artistic skills." }
              ].map((obj, i) => (
                <div key={i} className="bg-brand-surface p-8 rounded-card shadow-card hover:shadow-card-hover transition hover:-translate-y-1 border border-transparent">
                   <div className="w-14 h-14 bg-[#E6EEFF] rounded-full flex items-center justify-center text-brand-primary font-bold mb-6 text-xl shadow-sm">{i+1}</div>
                   <h4 className="font-bold text-xl mb-3 text-brand-textMain">{obj.title}</h4>
                   <p className="text-brand-textBody text-base leading-relaxed">{obj.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-brand-surface">
        <div className="container mx-auto px-4">
          <SectionHeading title="Glimpses of Impact" centered subtext="Our events, distributions, and cultural programs" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
             {[1,2,3,4].map(i => (
                <div key={i} className="overflow-hidden rounded-card shadow-card hover:shadow-card-hover transition cursor-pointer group">
                  <img src={`https://picsum.photos/seed/event${i}/400/300`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-primary text-white text-center">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-white">Be Part of the Movement</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed text-blue-100">
              Join thousands of artists who are building a secure future with us. Registration is simple and free.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white text-brand-primary px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition hover:-translate-y-1">
                Join as an Artist
              </button>
              <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg shadow-none hover:bg-white/10 transition hover:-translate-y-1">
                Support / Donate
              </button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;