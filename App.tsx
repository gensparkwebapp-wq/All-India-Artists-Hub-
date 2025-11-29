
import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Directory from './components/Directory';
import { Phone, MapPin, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { NotificationProvider } from './contexts/NotificationContext';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'directory':
        return <Directory />;
      // For now, other links will just map to Home or show a placeholder if we were building them fully
      default:
        return <Home />;
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-brand-surface font-sans flex flex-col">
        <Header onNavigate={handleNavigate} />
        
        <main className="flex-grow">
          {renderPage()}
        </main>

        {/* Footer - Persistent across pages */}
        <footer className="bg-brand-textMain text-gray-400 py-16 border-t border-gray-800">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
             {/* Col 1 */}
             <div>
               <h2 className="text-white text-2xl font-bold mb-6 tracking-tight">ALL INDIA <span className="text-brand-primary">ARTISTS HUB</span></h2>
               <p className="text-sm mb-6 leading-relaxed text-gray-400">
                 India's largest digital platform for artists, studios, and event organizers. Connecting talent with opportunity.
               </p>
               <div className="text-xs bg-gray-800/50 p-4 rounded-card border border-gray-700">
                 <span className="opacity-75 text-gray-400">Powered by:</span> <br/>
                 <strong className="text-white text-sm">Meri Pahal Fast Help Artist Welfare Association</strong>
               </div>
             </div>

             {/* Col 2 */}
             <div>
               <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
               <ul className="space-y-3 text-sm">
                 <li><button onClick={() => handleNavigate('directory')} className="hover:text-brand-primary transition duration-200">Artists Directory</button></li>
                 <li><button onClick={() => handleNavigate('studios')} className="hover:text-brand-primary transition duration-200">Studios & Vendors</button></li>
                 <li><button onClick={() => handleNavigate('jobs')} className="hover:text-brand-primary transition duration-200">Jobs & Auditions</button></li>
                 <li><button onClick={() => handleNavigate('classes')} className="hover:text-brand-primary transition duration-200">Live Classes</button></li>
                 <li><button onClick={() => handleNavigate('about')} className="hover:text-brand-primary transition duration-200">About Us</button></li>
                 <li><button onClick={() => handleNavigate('ngo')} className="hover:text-brand-primary transition duration-200">NGO Welfare</button></li>
               </ul>
             </div>

             {/* Col 3 */}
             <div>
               <h3 className="text-white font-bold mb-6 text-lg">Contact & Support</h3>
               <p className="flex items-center mb-3 text-gray-300"><Phone size={18} className="mr-3 text-brand-primary"/> 7073741421</p>
               <p className="flex items-center mb-6 text-gray-300"><MapPin size={18} className="mr-3 text-brand-primary"/> Jaipur, Rajasthan, India</p>
               <div className="flex space-x-5 mt-4">
                 <a href="#" className="text-gray-400 hover:text-brand-primary transition duration-200 hover:-translate-y-1"><Facebook size={24}/></a>
                 <a href="#" className="text-gray-400 hover:text-brand-primary transition duration-200 hover:-translate-y-1"><Instagram size={24}/></a>
                 <a href="#" className="text-gray-400 hover:text-brand-primary transition duration-200 hover:-translate-y-1"><Youtube size={24}/></a>
                 <a href="#" className="text-gray-400 hover:text-brand-primary transition duration-200 hover:-translate-y-1"><Send size={24}/></a>
               </div>
             </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} All India Artists Hub. All Rights Reserved.
          </div>
        </footer>
      </div>
    </NotificationProvider>
  );
};

export default App;
