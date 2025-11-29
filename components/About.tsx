import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimationControls, animate } from 'framer-motion';
import {
  Globe, Heart, Twitter, Instagram, Youtube, Mic, MapPin, Users, X
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { LOCATION_DATA } from '../constants';


// A reusable counter component for animated stats
const StatCounter = ({ to, text, icon: Icon }: { to: number, text: string, icon: React.ElementType }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimationControls();
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const animation = animate(0, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          const value = Math.round(latest);
           if (value >= 1000000) {
            setDisplayValue((value / 1000000).toFixed(1).replace('.0', '') + "M+");
          } else if (value >= 1000) {
            setDisplayValue(Math.round(value / 1000) + "K+");
          } else {
            setDisplayValue(value.toString() + "+");
          }
        },
      });
      return () => animation.stop();
    }
  }, [isInView, to]);

  return (
    <div ref={ref} className="text-center">
      <div className="flex justify-center items-center mb-2">
        <Icon className="w-8 h-8 text-orange-400" />
        <span className="text-4xl font-bold text-white ml-2 tabular-nums">
          {displayValue}
        </span>
      </div>
      <p className="text-sm text-gray-300 uppercase tracking-wider">{text}</p>
    </div>
  );
};

const NgoMembershipModal = ({ isOpen, onClose, onSubmit, t }: { isOpen: boolean, onClose: () => void, onSubmit: (data: any) => void, t: any }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Become a Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="ngo-name" className="font-semibold text-gray-700 text-sm">Full Name</label>
            <input id="ngo-name" name="name" type="text" placeholder="Your Name" required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          <div>
            <label htmlFor="ngo-email" className="font-semibold text-gray-700 text-sm">Email Address</label>
            <input id="ngo-email" name="email" type="email" placeholder="Your Email" required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          <div>
            <label htmlFor="ngo-state" className="font-semibold text-gray-700 text-sm">State</label>
            <select id="ngo-state" name="state" required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition bg-white appearance-none">
              <option value="">Select your state</option>
              {LOCATION_DATA.map(state => (
                <option key={state.name} value={state.name}>{state.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-[#007BFF] text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5 shadow-md">
            Submit Application
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};


const About: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [isNgoModalOpen, setIsNgoModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "About ArtistsHub India – Empowering Indian Artists";
    const metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    metaDesc.content = "Learn about ArtistsHub India, a platform dedicated to empowering Indian artists. Discover our mission to unite singers, dancers, actors, and musicians, and learn about our NGO partnership for artist welfare. Join the largest indian singers directory and artist booking community.";
    document.head.appendChild(metaDesc);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');
  
    const handleNgoSubmit = (data: any) => {
    // Simulate API call to /api/membership
    console.log("Submitting NGO Membership:", data);
    
    // Show success toast and close modal
    showToast(`Thank you, ${data.name}! Your application is submitted.`);
    setIsNgoModalOpen(false);
  };
  
  const content = {
    en: {
      nav_lang: "हिंदी",
      hero_title: "Our Journey: Uniting Indian Artists",
      hero_subtitle: "ArtistsHub India is a digital platform connecting all Indian artists – singers, musicians, actors, dancers, film/TV artists, YouTubers, karaoke artists, live stage performers, and audio/video studio owners. Our mission: Empower talent, simplify bookings, and build community across states like Rajasthan, Haryana, Madhya Pradesh, Bihar, Jharkhand, Assam, Uttar Pradesh, Uttarakhand, West Bengal, Delhi, Odisha, Goa, Maharashtra.",
      hero_cta_join: "Join Community",
      hero_cta_explore: "Explore Directory",
      founder_caption: "Founded by Vijay Kumar – Passionate Artist & NGO Leader",
      story_title: "Why ArtistsHub India?",
      story_p1: "In India, millions of artists struggle to showcase their talent. Bookings, promotions, jobs – everything is scattered. Launched in 2025 by Vijay Kumar (Founder, 'Meri Pahal Fast Help Artist Welfare Association'), this platform stems from 'Sanget Kalakar Union' – an All India Artists Community. Today, we connect 50,000+ artists across 10+ states.",
      story_quote: "“Talent never wastes; it just needs the right platform.” – Vijay Kumar",
      mission_title: "What We Do",
      mission_card_title: "Mission",
      mission_card_content: "Empowerment: Free profiles, portfolios, search tools for artists.\nCommunity Build: Facebook-clone pages, referral prestige points, awards (Silver for 100 referrals, Gold for 500, Golden for 1000 – digital certificates public on site).\nSupport: NGO tie-ups for welfare, events, news, podcasts.",
      vision_card_title: "Vision",
      vision_card_content: "Global Reach: International bookings, monetization.\nInnovation: AI job portal, YouTube clone, live music classes – all in one.\nGrowth: Spotlight top artists (highest followers/points) on homepage side-scrolling.",
      values_card_title: "Values",
      values_card_content: "Inclusive: Open to all categories (Singer/Actor/Dancer/Model/Photographer etc.).\nTransparency: Free access, clear paid services (bookings, ads, artist cards).\nSustainable: Marketplace for instruments/gear, ad revenue share.",
      ngo_title: "Meri Pahal: For Artist Welfare",
      ngo_content: "'Meri Pahal Fast Help Artist Welfare Association (Trust)' – Reg No: 4186/22-23,12A80G. Focus: Women empowerment, self-employment schemes from Rajasthan (Jaipur) to Haryana, MP, Bihar, Jharkhand, Assam, UP, Uttarakhand, WB, Delhi, Odisha, Goa, Maharashtra. Membership: ₹100/year – Help card with discounts, medical support, recharges. Posters integrate workshops for artists.",
      ngo_cta: "Become Member",
      team_title: "Our Team",
      team_content: "Founder: Vijay Kumar – 10+ years in artist welfare. Team: Developers (React/Node), Content Creators, Artist Mentors. Achievements: 10,000+ registrations at 2025 launch, 500+ events hosted, Golden awards to top referrers.",
      stat_artists: "Artists Connected",
      stat_states: "States Covered",
      stat_views: "Video Views",
      join_title: "Join Us!",
      join_content: "Single registration unlocks everything: Free profile, search, community. Paid: Bookings, ads, cards. Questions? support@artistshubindia.com",
      form_name: "Name",
      form_email: "Email",
      form_message: "Message",
      form_submit: "Send Message",
      footer_copyright: "© 2025 ArtistsHub India",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Service"
    },
    hi: {
      nav_lang: "English",
      hero_title: "हमारा सफर: भारतीय कलाकारों को एकजुट करना",
      hero_subtitle: "आर्टिस्टहब इंडिया एक डिजिटल प्लेटफॉर्म है जो सभी भारतीय कलाकारों को जोड़ता है - गायक, संगीतकार, अभिनेता, नर्तक, फिल्म/टीवी कलाकार, यूट्यूबर, कराओके कलाकार, लाइव स्टेज कलाकार, और ऑडियो/वीडियो स्टूडियो मालिक। हमारा मिशन: प्रतिभा को सशक्त बनाना, बुकिंग को सरल बनाना, और राजस्थान, हरियाणा, मध्य प्रदेश, बिहार, झारखंड, असम, उत्तर प्रदेश, उत्तराखंड, पश्चिम बंगाल, दिल्ली, ओडिशा, गोवा, महाराष्ट्र जैसे राज्यों में समुदाय का निर्माण करना।",
      hero_cta_join: "समुदाय से जुड़ें",
      hero_cta_explore: "डायरेक्टरी देखें",
      founder_caption: "संस्थापक विजय कुमार - भावुक कलाकार और एनजीओ नेता",
      story_title: "आर्टिस्टहब इंडिया ही क्यों?",
      story_p1: "भारत में, लाखों कलाकार अपनी प्रतिभा दिखाने के लिए संघर्ष करते हैं। बुकिंग, प्रमोशन, नौकरियां - सब कुछ बिखरा हुआ है। 2025 में विजय कुमार (संस्थापक, 'मेरी पहल फास्ट हेल्प आर्टिस्ट वेलफेयर एसोसिएशन') द्वारा शुरू किया गया यह प्लेटफॉर्म 'संगीत कलाकार यूनियन' - एक अखिल भारतीय कलाकार समुदाय - से उपजा है। आज, हम 10+ राज्यों में 50,000+ कलाकारों को जोड़ते हैं।",
      story_quote: "\"प्रतिभा कभी बर्बाद नहीं होती; उसे बस सही मंच की जरूरत होती है।\" - विजय कुमार",
      mission_title: "हम क्या करते हैं",
      mission_card_title: "मिशन",
      mission_card_content: "सशक्तिकरण: कलाकारों के लिए मुफ्त प्रोफाइल, पोर्टफोलियो, खोज उपकरण।\nसामुदायिक निर्माण: फेसबुक-क्लोन पेज, रेफरल प्रतिष्ठा अंक, पुरस्कार (100 रेफरल के लिए सिल्वर, 500 के लिए गोल्ड, 1000 के लिए गोल्डन - साइट पर सार्वजनिक डिजिटल प्रमाण पत्र)।\nसमर्थन: कल्याण, घटनाओं, समाचार, पॉडकास्ट के लिए एनजीओ टाई-अप।",
      vision_card_title: "दृष्टि",
      vision_card_content: "वैश्विक पहुंच: अंतर्राष्ट्रीय बुकिंग, मुद्रीकरण।\nनवाचार: एआई जॉब पोर्टल, यूट्यूब क्लोन, लाइव संगीत कक्षाएं - सब एक में।\nविकास: होमपेज साइड-स्क्रॉलिंग पर शीर्ष कलाकारों (उच्चतम अनुयायियों/अंकों) को स्पॉटलाइट करें।",
      values_card_title: "मूल्य",
      values_card_content: "समावेशी: सभी श्रेणियों के लिए खुला (गायक/अभिनेता/नर्तक/मॉडल/फोटोग्राफर आदि)।\nपारदर्शिता: मुफ्त पहुंच, स्पष्ट भुगतान सेवाएं (बुकिंग, विज्ञापन, कलाकार कार्ड)।\nसतत: उपकरणों/गियर के लिए बाज़ार, विज्ञापन राजस्व में हिस्सेदारी।",
      ngo_title: "मेरी पहल: कलाकार कल्याण के लिए",
      ngo_content: "'मेरी पहल फास्ट हेल्प आर्टिस्ट वेलफेयर एसोसिएशन (ट्रस्ट)' - पंजीकरण संख्या: 4186/22-23,12A80G। फोकस: महिला सशक्तिकरण, राजस्थान (जयपुर) से हरियाणा, एमपी, बिहार, झारखंड, असम, यूपी, उत्तराखंड, डब्ल्यूबी, दिल्ली, ओडिशा, गोवा, महाराष्ट्र तक स्वरोजगार योजनाएं। सदस्यता: ₹100/वर्ष - छूट, चिकित्सा सहायता, रिचार्ज के साथ हेल्प कार्ड। पोस्टर कलाकारों के लिए कार्यशालाओं को एकीकृत करते हैं।",
      ngo_cta: "सदस्य बनें",
      team_title: "हमारी टीम",
      team_content: "संस्थापक: विजय कुमार - कलाकार कल्याण में 10+ वर्ष। टीम: डेवलपर्स (रिएक्ट/नोड), सामग्री निर्माता, कलाकार मेंटर्स। उपलब्धियां: 2025 के लॉन्च पर 10,000+ पंजीकरण, 500+ कार्यक्रम आयोजित, शीर्ष रेफरर्स को गोल्डन पुरस्कार।",
      stat_artists: "कलाकार जुड़े",
      stat_states: "राज्य कवर",
      stat_views: "वीडियो देखे गए",
      join_title: "हमसे जुड़ें!",
      join_content: "एक ही पंजीकरण सब कुछ अनलॉक करता है: मुफ्त प्रोफाइल, खोज, समुदाय। भुगतान: बुकिंग, विज्ञापन, कार्ड। प्रश्न? support@artistshubindia.com",
      form_name: "नाम",
      form_email: "ईमेल",
      form_message: "संदेश",
      form_submit: "संदेश भेजें",
      footer_copyright: "© 2025 आर्टिस्टहब इंडिया",
      footer_privacy: "गोपनीयता नीति",
      footer_terms: "सेवा की शर्तें"
    }
  };
  
  const t = content[lang];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="font-poppins bg-gray-50 text-gray-800 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>
      
      <NgoMembershipModal 
        isOpen={isNgoModalOpen} 
        onClose={() => setIsNgoModalOpen(false)}
        onSubmit={handleNgoSubmit}
        t={t}
      />
      
      <div className="fixed top-28 right-4 z-50">
        <button
          onClick={toggleLang}
          aria-label="Toggle Language"
          className="bg-white/80 backdrop-blur-md shadow-lg px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <Globe size={16} /> {t.nav_lang}
        </button>
      </div>

      {/* 1. Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative min-h-screen flex items-center justify-center text-center px-4 pt-20 pb-10 bg-black"
      >
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 z-0 opacity-40"
        >
          <img
            src="https://source.unsplash.com/random/1920x1080/?indian-music"
            alt="Indian artists performing on stage with vibrant lights"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#007BFF]/70 to-[#FF6B35]/50 z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
          >
            {t.hero_title}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-md md:text-xl text-gray-200 mb-8 max-w-3xl font-light"
          >
            {t.hero_subtitle}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <a href="/register" className="bg-[#FF6B35] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 transition transform hover:scale-105">
              {t.hero_cta_join}
            </a>
            <a href="/directory" className="bg-[#007BFF] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105">
              {t.hero_cta_explore}
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20"
          >
            <img
              src="https://example.com/vijay-blue-suit.jpg"
              alt="Vijay Kumar, Founder of ArtistsHub India, in a professional blue suit"
              className="w-16 h-16 rounded-full border-2 border-white object-cover bg-gray-300"
            />
            <div className="text-left">
              <p className="text-white font-bold">{t.founder_caption.split('–')[0]}</p>
              <p className="text-gray-300 text-sm">{t.founder_caption.split('–')[1]}</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. Our Story Section */}
      <section className="py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.story_title}</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 text-justify">{t.story_p1}</p>
            <blockquote className="border-l-4 border-orange-400 pl-6 py-4 bg-orange-50 rounded-r-lg">
              <p className="text-xl italic text-gray-700">{t.story_quote}</p>
            </blockquote>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center items-center"
          >
            <img
              src="https://example.com/sanget-logo.png"
              alt="Sanget Kalakar Union Logo with a harp icon and stars"
              className="w-80 h-80 object-contain p-4 border-4 border-orange-400 rounded-full bg-white shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section className="py-20 px-4 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">{t.mission_title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Mic, title: t.mission_card_title, content: t.mission_card_content, color: 'blue' },
              { icon: Globe, title: t.vision_card_title, content: t.vision_card_content, color: 'orange' },
              { icon: Heart, title: t.values_card_title, content: t.values_card_content, color: 'green' }
            ].map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                  ${card.color === 'blue' ? 'bg-blue-100 text-blue-600' : card.color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}
                >
                  <card.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                 <div className="text-gray-600 leading-relaxed text-center space-y-3">
                  {card.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 4. NGO Partnership Section */}
      <section className="py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="relative group"
          >
            <a href="/ngo" aria-label="Learn more about our NGO partner">
              <img
                src="https://example.com/meri-pahal-poster.jpg"
                alt="Meri Pahal NGO Poster with tricolor logo and list of states served"
                className="rounded-lg shadow-xl w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-200 aspect-[3/4]"
              />
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ngo_title}</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-8">{t.ngo_content}</p>
            <button 
              onClick={() => setIsNgoModalOpen(true)}
              className="bg-[#007BFF] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              {t.ngo_cta}
            </button>
          </motion.div>
        </div>
      </section>

      {/* 5. Team & Achievements Section */}
      <section className="py-20 px-4 bg-gray-800 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.team_title}</h2>
          <p className="max-w-2xl mx-auto text-gray-300 mb-12">{t.team_content}</p>
          <div className="flex justify-center mb-16 -space-x-4">
             <img src="https://example.com/vijay-blue-suit.jpg" alt="Founder Vijay Kumar" className="w-16 h-16 rounded-full border-4 border-gray-800 object-cover shadow-lg" />
            {Array(3).fill(0).map((_, i) => (
              <img key={i} src={`https://i.pravatar.cc/150?img=${i+10}`} alt={`Team member ${i+1}`} className="w-16 h-16 rounded-full border-4 border-gray-800 object-cover shadow-lg" />
            ))}
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold border-4 border-gray-800 shadow-lg">5+</div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StatCounter to={50000} text={t.stat_artists} icon={Users} />
            <StatCounter to={10} text={t.stat_states} icon={MapPin} />
            <StatCounter to={1000000} text={t.stat_views} icon={Youtube} />
          </div>
        </div>
      </section>

      {/* 6. Join Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.join_title}</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">{t.join_content}</p>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg mx-auto text-left"
            >
              <form action="/api/contact" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="name" className="font-semibold text-gray-700">{t.form_name}</label>
                  <input id="name" name="name" type="text" placeholder="Your Name" required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition" />
                </div>
                <div>
                  <label htmlFor="email" className="font-semibold text-gray-700">{t.form_email}</label>
                  <input id="email" name="email" type="email" placeholder="Your Email" required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition" />
                </div>
                <div>
                  <label htmlFor="message" className="font-semibold text-gray-700">{t.form_message}</label>
                  <textarea id="message" name="message" placeholder="Your Message" rows={4} required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"></textarea>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-[#007BFF] to-[#0056b3] text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition transform hover:-translate-y-1">
                  {t.form_submit}
                </button>
              </form>
            </motion.div>
            <div className="mt-8 flex justify-center space-x-6">
              <a href="#" aria-label="Follow us on Twitter" className="text-gray-500 hover:text-blue-600 transition"><Twitter size={24} /></a>
              <a href="#" aria-label="Follow us on Instagram" className="text-gray-500 hover:text-pink-600 transition"><Instagram size={24} /></a>
              <a href="#" aria-label="Subscribe to our YouTube channel" className="text-gray-500 hover:text-red-600 transition"><Youtube size={24} /></a>
            </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ArtistsHub India</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="/privacy-policy" className="hover:text-blue-600">{t.footer_privacy}</a>
            <a href="/terms-of-service" className="hover:text-blue-600">{t.footer_terms}</a>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-gray-600"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-gray-600"><Instagram size={20} /></a>
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-gray-600"><Youtube size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;