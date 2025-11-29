
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, X, Check, Briefcase, Zap, Heart, Info, AlertCircle, Shield, User } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { Notification, NotificationPriority, NotificationSettings } from '../types';

const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, settings, updateSettings } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>('alerts');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityStyles = (priority: NotificationPriority, read: boolean) => {
    if (priority === 'high') return read ? 'border-l-4 border-red-200 bg-white' : 'border-l-4 border-red-500 bg-red-50';
    if (priority === 'medium') return read ? 'border-l-4 border-blue-200 bg-white' : 'border-l-4 border-brand-primary bg-blue-50';
    return read ? 'border-l-4 border-gray-200 bg-white' : 'border-l-4 border-gray-400 bg-gray-50';
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return <AlertCircle size={16} className="text-red-500" />;
      case 'offer': return <Zap size={16} className="text-yellow-500" />;
      case 'success': return <Check size={16} className="text-green-500" />;
      case 'info': 
      default: return <Info size={16} className="text-brand-primary" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-gray-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-brand-textMain">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fade-in origin-top-right">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-brand-surface">
            <h3 className="font-bold text-brand-textHeading flex items-center gap-2">
              Notifications {unreadCount > 0 && <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} New</span>}
            </h3>
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => setActiveTab('alerts')}
                 className={`p-1.5 rounded transition ${activeTab === 'alerts' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 title="Alerts"
               >
                 <Bell size={16} />
               </button>
               <button 
                 onClick={() => setActiveTab('settings')}
                 className={`p-1.5 rounded transition ${activeTab === 'settings' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 title="Settings"
               >
                 <Settings size={16} />
               </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="max-h-[400px] overflow-y-auto no-scrollbar bg-gray-50">
            
            {/* ALERTS TAB */}
            {activeTab === 'alerts' && (
              <>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3 text-gray-400">
                      <Bell size={24} />
                    </div>
                    <p className="text-brand-textMain font-bold">All caught up!</p>
                    <p className="text-xs text-gray-500 mt-1">Check back later for updates on jobs, artists, and bookings.</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer relative group ${getPriorityStyles(notification.priority, notification.read)}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                           <div className="mt-1 flex-shrink-0">{getIcon(notification.type)}</div>
                           <div className="flex-grow">
                             <div className="flex justify-between items-start">
                               <h4 className={`text-sm font-bold ${notification.read ? 'text-gray-600' : 'text-brand-textMain'}`}>{notification.title}</h4>
                               <span className="text-[10px] text-gray-400">{new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notification.message}</p>
                             
                             {notification.actionLabel && (
                               <button className="mt-2 text-xs bg-white border border-gray-200 px-3 py-1 rounded-full font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition shadow-sm">
                                 {notification.actionLabel}
                               </button>
                             )}
                           </div>
                        </div>
                        {/* Unread indicator dot */}
                        {!notification.read && (
                          <div className="absolute top-4 right-2 w-2 h-2 rounded-full bg-brand-primary"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="p-4 space-y-4">
                 <div className="flex items-center justify-between">
                   <h4 className="font-bold text-brand-textMain text-sm">Disable All</h4>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.disableAll} onChange={(e) => updateSettings('disableAll', e.target.checked)} />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                   </label>
                 </div>
                 <hr className="border-gray-200" />
                 
                 <div className={`space-y-4 ${settings.disableAll ? 'opacity-50 pointer-events-none' : ''}`}>
                    {[
                      { key: 'newArtistAlerts', label: 'New Artist Alerts', icon: User },
                      { key: 'newJobs', label: 'Job Opportunities', icon: Briefcase },
                      { key: 'studioOffers', label: 'Studio Discounts', icon: Zap },
                      { key: 'communityActivity', label: 'Community Activity', icon: Heart },
                      { key: 'bookingStatus', label: 'Booking Updates', icon: Shield },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          {/* @ts-ignore */}
                          <setting.icon size={16} className="text-gray-400" />
                          {setting.label}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={settings[setting.key as keyof NotificationSettings] as boolean} 
                              onChange={(e) => updateSettings(setting.key as keyof NotificationSettings, e.target.checked)} 
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                        </label>
                      </div>
                    ))}
                 </div>
              </div>
            )}

          </div>

          {/* Footer */}
          {activeTab === 'alerts' && notifications.length > 0 && (
            <div className="p-2 border-t border-gray-100 bg-white flex justify-between">
              <button onClick={markAllAsRead} className="text-xs text-brand-primary font-bold hover:underline px-2 py-1">Mark all read</button>
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 font-bold px-2 py-1">Clear all</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
