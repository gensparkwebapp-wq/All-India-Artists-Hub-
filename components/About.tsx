
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, Users, Target, Shield, CheckCircle, ChevronRight, User, Star, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // SEO Title
  useEffect(() => {
    document.title = "About ArtistsHub India | Uniting Talent";
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  // Content Dictionary
  const content = {
    en: {
      hero: {
        title: "Our Journey: Uniting Indian Artists",
        sub: "Connecting singers, actors, dancers & more across India. A movement to give every artist a stage.",
        join: "Join the Movement",
        explore: "Explore Directory",
        founder: "Founded by Vijay Kumar",
        role: "Passionate Artist & NGO Leader"
      },
      story: {
        title: "Why Us?",
        text: "Launched in 2025, ArtistsHub India is a revolutionary platform empowering over 50,000+ artists across 10+ states. In a country rich with talent but poor in organized opportunities, we bridge the gap between rural potential and global stages.",
        quote: "Talent needs a platform, and we are that stage."
      },
      mission: {
        title: "What We Do",
        cards: [
          { title: "Mission", desc: "To empower every artist with a verified digital identity and direct work opportunities." },
          { title: "Vision", desc: "Global recognition for Indian regional talent, eliminating middlemen." },
          { title: "Values", desc: "Transparency, Respect (Samman), and Community (Sangathan)." }
        ]
      },
      ngo: {
        title: "Our NGO Root",
        sub: "Powered by 'Meri Pahal Fast Help Artist Welfare Association'",
        text: "We are more than a website. We are a Trust dedicated to the welfare of artists. From providing medical aid to ensuring women's safety in the industry, our NGO stands as a pillar of support.",
        stats: ["Women Empowerment", "Medical Aid", "Lifetime Membership ₹100"]
      },
      team: {
        title: "Our Team",
        stats: "50K Artists | 10 States | 500+ Events"
      },
      join: {
        title: "Join Us",
        sub: "Be part of the revolution. Register today.",
        name: "Full Name",
        email: "Email Address",
        submit: "Submit Application"
      },
      footer: "© 2025 ArtistsHub India. All Rights Reserved."
    },
    hi: {
      hero: {
        title: "हमारी यात्रा: भारतीय कलाकारों को एकजुट करना",
        sub: "भारत भर के गायकों, अभिनेताओं, नर्तकों और अन्य कलाकारों को जोड़ना। हर कलाकार को एक मंच देने का आंदोलन।",
        join: "आंदोलन में शामिल हों",
        explore: "डायरेक्टरी देखें",
        founder: "संस्थापक: विजय कुमार",
        role: "भावुक कलाकार और एनजीओ नेता"
      },
      story: {
        title: "हम क्यों?",
        text: "2025 में शुरू किया गया, आर्टिस्टहब इंडिया 10+ राज्यों में 50,000+ कलाकारों को सशक्त बनाने वाला एक क्रांतिकारी मंच है। ऐसे देश में जहां प्रतिभा की कमी नहीं है लेकिन अवसरों की कमी है, हम ग्रामीण क्षमता और वैश्विक मंचों के बीच की खाई को पाटते हैं।",
        quote: "प्रतिभा को एक मंच की आवश्यकता होती है, और हम वह मंच हैं।"
      },
      mission: {
        title: "हम क्या करते हैं",
        cards: [
          { title: "मिशन", desc: "हर कलाकार को सत्यापित डिजिटल पहचान और सीधे काम के अवसर प्रदान करना।" },
          { title: "दृष्टि", desc: "भारतीय क्षेत्रीय प्रतिभा के लिए वैश्विक पहचान, बिचौलियों को खत्म करना।" },
          { title: "मूल्य", desc: "पारदर्शिता, सम्मान (Samman), और समुदाय (Sangathan)।" }
        ]
      },
      ngo: {
        title: "हमारा एनजीओ",
        sub: "'मेरी पहल फास्ट हेल्प आर्टिस्ट वेलफेयर एसोसिएशन' द्वारा संचालित",
        text: "हम सिर्फ एक वेबसाइट नहीं हैं। हम कलाकारों के कल्याण के लिए समर्पित एक ट्रस्ट हैं। चिकित्सा सहायता प्रदान करने से लेकर उद्योग में महिलाओं की सुरक्षा सुनिश्चित करने तक, हमारा एनजीओ समर्थन के स्तंभ के रूप में खड़ा है।",
        stats: ["महिला सशक्तिकरण", "चिकित्सा सहायता", "आजीवन सदस्यता ₹100"]
      },
      team: {
        title: "हमारी टीम",
        stats: "50,000 कलाकार | 10 राज्य | 500+ कार्यक्रम"
      },
      join: {
        title: "हमसे जुड़ें",
        sub: "क्रांति का हिस्सा बनें। आज ही पंजीकरण करें।",
        name: "पूरा नाम",
        email: "ईमेल पता",
        submit: "आवेदन जमा करें"
      },
      footer: "© 2025 आर्टिस्टहब इंडिया। सर्वाधिकार सुरक्षित।"
    }
  };

  const t = content[lang];

  return (
    <div className="font-poppins bg-gray-50 min-h-screen text-gray-800 overflow-x-hidden">
      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* Language Toggle */}
      <div className="fixed top-24 right-4 z-50">
        <button 
          onClick={toggleLang}
          className="bg-white/90 backdrop-blur shadow-lg border border-[#FF6B35]/30 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition transform hover:scale-105"
        >
          <Globe size={16} /> {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-16">
        {/* Artistic Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?q=80&w=1920&auto=format&fit=crop" 
            alt="Indian Artist" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#007BFF]/90 via-[#004a99]/80 to-[#FF6B35]/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium tracking-wider uppercase border border-white/30">
              Est. 2025 • Pan India
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
          >
            {t.hero.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-100 mb-10 max-w-3xl font-light leading-relaxed"
          >
            {t.hero.sub}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-5 mb-16">
            <button className="bg-[#FF6B35] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-[#e55a2b] transition transform hover:scale-105 flex items-center justify-center gap-2">
              {t.hero.join} <ArrowRight size={20} />
            </button>
            <button className="bg-white text-[#007BFF] px-10 py-4 rounded-full font-bold shadow-xl hover:bg-gray-100 transition transform hover:scale-105">
              {t.hero.explore}
            </button>
          </div>

          {/* Founder Profile */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 pr-6 rounded-full border border-white/20 hover:bg-white/20 transition cursor-default"
          >
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="Founder" 
              className="w-14 h-14 rounded-full border-2 border-white object-cover"
            />
            <div className="text-left">
              <h4 className="text-white font-bold text-sm">{t.hero.founder}</h4>
              <p className="text-gray-300 text-xs">{t.hero.role}</p>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* 2. Story Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 space-y-8"
          >
            <div className="inline-block bg-blue-50 text-[#007BFF] px-4 py-1 rounded-full font-bold text-sm tracking-wide">OUR ORIGIN</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111827]">{t.story.title}</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#007BFF] to-[#FF6B35] rounded-full"></div>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              {t.story.text}
            </p>
            <blockquote className="border-l-4 border-[#FF6B35] pl-6 italic text-gray-800 font-serif text-xl bg-orange-50/50 py-6 pr-6 rounded-r-xl shadow-sm">
              "{t.story.quote}"
            </blockquote>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 flex justify-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-orange-200 rounded-full blur-3xl opacity-30 animate-pulse" />
            <img 
              src="https://via.placeholder.com/400?text=Union+Logo" 
              alt="Union Logo" 
              className="w-80 h-80 object-contain drop-shadow-2xl relative z-10 transform hover:scale-105 transition duration-500"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Mission Grid */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-16 text-[#111827]">{t.mission.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.mission.cards.map((card, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }} 
                className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300 ${
                  idx === 0 ? 'bg-blue-50 text-[#007BFF] group-hover:bg-[#007BFF] group-hover:text-white' : 
                  idx === 1 ? 'bg-orange-50 text-[#FF6B35] group-hover:bg-[#FF6B35] group-hover:text-white' : 
                  'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white'
                }`}>
                  {idx === 0 ? <Target size={36} /> : idx === 1 ? <Globe size={36} /> : <Heart size={36} />}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NGO Section */}
      <section className="py-24 bg-[#007BFF] text-white relative">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 space-y-8">
            <div className="inline-block bg-[#FF6B35] text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg">
              SOCIAL IMPACT
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {t.ngo.title}
            </h2>
            <p className="text-xl font-medium text-blue-100 italic border-l-4 border-white pl-4">
              {t.ngo.sub}
            </p>
            <p className="text-lg leading-relaxed opacity-90">
              {t.ngo.text}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {t.ngo.stats.map((stat, i) => (
                <div key={i} className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur border border-white/20 flex items-center gap-2 font-semibold hover:bg-white/20 transition">
                  <CheckCircle size={18} className="text-[#FF6B35]" /> {stat}
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-[#FF6B35] rounded-2xl transform rotate-6 opacity-20"></div>
            <img 
              src="https://via.placeholder.com/500x600?text=NGO+Activities" 
              alt="NGO Poster" 
              className="rounded-2xl shadow-2xl border-4 border-white/20 relative z-10 transform hover:scale-[1.02] transition duration-500 w-full"
            />
          </div>
        </div>
      </section>

      {/* 5. Team & Stats */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-16 text-[#111827]">{t.team.title}</h2>
        
        <div className="flex flex-wrap justify-center gap-12 mb-20">
          {[
            { name: "Vijay Kumar", role: "Founder & Visionary", img: "https://via.placeholder.com/150?text=Vijay" },
            { name: "Anjali Singh", role: "Welfare Head", img: "https://via.placeholder.com/150?text=Anjali" },
            { name: "Rahul Verma", role: "Tech Lead", img: "https://via.placeholder.com/150?text=Rahul" },
            { name: "Priya Das", role: "Community Manager", img: "https://via.placeholder.com/150?text=Priya" },
          ].map((member, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-5 border-4 border-white shadow-lg group-hover:border-[#007BFF] transition-all duration-300 relative">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
              </div>
              <span className="font-bold text-gray-900 text-lg">{member.name}</span>
              <span className="text-sm text-[#007BFF] font-medium mt-1 bg-blue-50 px-3 py-0.5 rounded-full">{member.role}</span>
            </div>
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="bg-[#111827] text-white py-12 px-10 rounded-3xl shadow-2xl inline-block border-2 border-gray-800 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#FF6B35] rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#007BFF] rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
            <div className="text-3xl md:text-5xl font-extrabold text-[#FF6B35] tracking-widest mb-3 font-mono">
              {t.team.stats}
            </div>
            <p className="text-gray-400 text-sm uppercase tracking-[0.3em] font-medium">Impact & Growth</p>
          </div>
        </motion.div>
      </section>

      {/* 6. Join Form - STRICT DARK INPUTS */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#007BFF] to-[#FF6B35]"></div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#111827] mb-3">{t.join.title}</h2>
              <p className="text-gray-500">{t.join.sub}</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide ml-1">{t.join.name}</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-4 focus:ring-[#007BFF]/20 focus:border-[#007BFF] outline-none transition caret-white text-lg shadow-inner" 
                    placeholder="Enter your full name..." 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide ml-1">{t.join.email}</label>
                <div className="relative">
                  <div className="absolute left-4 top-4 text-gray-400">@</div>
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-4 focus:ring-[#007BFF]/20 focus:border-[#007BFF] outline-none transition caret-white text-lg shadow-inner" 
                    placeholder="Enter your email address..." 
                  />
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:-translate-y-1 transition duration-300 text-lg mt-4 flex justify-center items-center gap-2 group">
                {t.join.submit} <ChevronRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500 font-medium">{t.footer}</p>
      </footer>
    </div>
  );
};

export default About;
