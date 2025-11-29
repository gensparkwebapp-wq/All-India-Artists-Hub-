
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationSettings, NotificationPriority, NotificationCategory } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  updateSettings: (key: keyof NotificationSettings, value: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_SETTINGS: NotificationSettings = {
  newArtistAlerts: true,
  newJobs: true,
  studioOffers: true,
  bookingStatus: true,
  communityActivity: true,
  trendingArtists: true,
  disableAll: false,
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  // Computed unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- Smart Trigger Logic (Simulating AI) ---
  useEffect(() => {
    // 1. Initial Load Triggers (Simulating "Welcome Back" or missed alerts)
    const initialTimers = [
      setTimeout(() => {
        triggerSmartNotification({
          title: "Job Alert: Singer Needed",
          message: "Wedding Singer needed in Jaipur on 12 Jan. Budget: ₹15,000",
          type: 'info',
          category: 'job',
          priority: 'medium',
          actionLabel: "Apply Now"
        });
      }, 3000), // 3 seconds after load

      setTimeout(() => {
        triggerSmartNotification({
          title: "Studio Discount",
          message: "Sonic Boom Studios is offering 20% off for the next 24 Hours.",
          type: 'offer',
          category: 'offer',
          priority: 'low',
          actionLabel: "Book Slot"
        });
      }, 15000), // 15 seconds after load
      
      setTimeout(() => {
         triggerSmartNotification({
           title: "Profile Incomplete",
           message: "Add your latest showreel to increase booking chances by 40%.",
           type: 'warning',
           category: 'update',
           priority: 'high',
           actionLabel: "Update Profile"
         });
      }, 45000) // 45 seconds
    ];

    return () => initialTimers.forEach(clearTimeout);
  }, []);

  // Helper to add notification with Spam Protection & Sorting
  const addNotification = (notifData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    triggerSmartNotification(notifData);
  };

  const triggerSmartNotification = (notifData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // 1. Check Settings
    if (settings.disableAll) return;
    if (notifData.category === 'job' && !settings.newJobs) return;
    if (notifData.category === 'offer' && !settings.studioOffers) return;
    // ... add other category checks

    setNotifications(prev => {
      // 2. Anti-Spam / Frequency Control
      // Max 4 notifications per day derived logic (simplified to: don't show duplicates)
      const isDuplicate = prev.some(n => n.title === notifData.title && n.timestamp > Date.now() - 3600000); // 1 hour dedup
      if (isDuplicate) return prev;

      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
        ...notifData
      };

      // 3. Priority Sorting (High > Medium > Low, then Time)
      const updatedList = [newNotification, ...prev];
      return updatedList.sort((a, b) => {
        const priorityScore = { high: 3, medium: 2, low: 1 };
        if (priorityScore[a.priority] !== priorityScore[b.priority]) {
          return priorityScore[b.priority] - priorityScore[a.priority];
        }
        return b.timestamp - a.timestamp;
      });
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      settings,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      updateSettings
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
