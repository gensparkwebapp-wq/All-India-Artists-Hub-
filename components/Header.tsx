
import React, { useState } from 'react';
import { Menu, X, Phone, Globe, User } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <header className="w-full shadow-card z-50 sticky top-0 bg-white">
      {/* 1.1 Top Bar */}
      <div className="bg-brand-textMain text-white py-2 px-4 text-xs md:text-sm flex flex-col md:flex-row justify-between items-center transition-colors">
        <div className="mb-1 md:mb-0 text-center md:text-left">
          <span className="opacity-80">Powered by:</span> <span className="font-semibold text-white ml-1">Meri Pahal Fast Help Artist Welfare Association (Trust)</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://wa.me/917073741421" className="flex items-center hover:text-brand-primary transition duration-200">
            <Phone size={14} className="mr-1" /> 7073741421
          </a>
          
          {/* Notification Center Integration */}
          <div className="flex items-center border-l border-r border-gray-700 px-3 mx-2">
            <NotificationCenter />
          </div>

          <div className="flex items-center cursor-pointer hover:text-brand-primary transition duration-200">
            <Globe size={14} className="mr-1" /> हिंदी | Eng
          </div>
          <button className="bg-brand-primary px-4 py-1.5 rounded-full text-white font-bold hover:bg-brand-primaryDark transition duration-200 text-xs shadow-md">
            Login / Signup
          </button>
        </div>
      </div>

      {/* 1.2 Main Nav */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex flex-col cursor-pointer group" onClick={() => handleNav('home')}>
          <h1 className="text-xl md:text-2xl font-extrabold text-brand-textMain tracking-tight group-hover:opacity-90 transition">
            ALL INDIA <span className="text-brand-primary">ARTISTS HUB</span>
          </h1>
          <span className="text-[10px] text-brand-textSub font-medium tracking-widest uppercase">Connecting Talent Across India</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-brand-textSub">
          <button onClick={() => handleNav('home')} className="hover:text-brand-primary hover:underline underline-offset-4 decoration-brand-primary transition duration-200">Home</button>
          <button onClick={() => handleNav('about')} className="hover:text-brand-primary hover:underline underline-offset-4 decoration-brand-primary transition duration-200">About Us</button>
          <button onClick={() => handleNav('directory')} className="hover:text-brand-primary hover:underline underline-offset-4 decoration-brand-primary transition duration-200">Directory</button>
          <button onClick={() => handleNav('studios')} className="hover:text-brand-primary hover:underline underline-offset-4 decoration-brand-primary transition duration-200">Studios</button>
          <button onClick={() => handleNav('jobs')} className="hover:text-brand-primary hover:underline underline-offset-4 decoration-brand-primary transition duration-200">Jobs</button>
          <button onClick={() => handleNav('classes')} className="hover:text-brand-primary hover:underline underline-offset-4 decoration-brand-primary transition duration-200">Classes</button>
          <button onClick={() => handleNav('ngo')} className="hover:text-brand-primary hover:underline underline-offset-4 decoration-brand-primary transition duration-200">NGO</button>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <button className="bg-brand-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand-primaryDark transition-all duration-250 shadow-md hover:-translate-y-0.5 hover:shadow-lg flex items-center">
            <User size={18} className="mr-2" /> Become Member
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden text-brand-textMain" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-xl absolute w-full z-40">
          <div className="flex flex-col space-y-3 font-medium text-brand-textSub">
            <button onClick={() => handleNav('home')} className="block py-3 border-b border-gray-100 text-left hover:text-brand-primary">Home</button>
             <button onClick={() => handleNav('about')} className="block py-3 border-b border-gray-100 text-left hover:text-brand-primary">About Us</button>
            <button onClick={() => handleNav('directory')} className="block py-3 border-b border-gray-100 text-left hover:text-brand-primary">Artists Directory</button>
            <button onClick={() => handleNav('studios')} className="block py-3 border-b border-gray-100 text-left hover:text-brand-primary">Studios & Live Sound</button>
            <button onClick={() => handleNav('jobs')} className="block py-3 border-b border-gray-100 text-left hover:text-brand-primary">Jobs & Auditions</button>
            <button onClick={() => handleNav('classes')} className="block py-3 border-b border-gray-100 text-left hover:text-brand-primary">Live Classes</button>
            <button onClick={() => handleNav('ngo')} className="block py-3 border-b border-gray-100 text-left hover:text-brand-primary">NGO & Welfare</button>
            <button className="bg-brand-primary text-white w-full py-3 rounded-card mt-4 font-bold shadow-md hover:bg-brand-primaryDark">
              Become an Artist Member
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
