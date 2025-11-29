
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToast({ id, message });
    
    // Auto hide
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-up">
           <div className="bg-[#111827] text-white px-6 py-3 rounded-[10px] shadow-2xl flex items-center gap-3 min-w-[300px] justify-between border border-gray-700">
             <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
             <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white">
               <X size={16} />
             </button>
           </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
