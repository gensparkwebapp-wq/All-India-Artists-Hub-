
import React, { useState } from 'react';
import { Check, UserPlus, Heart, X, AlertTriangle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useNotifications } from '../contexts/NotificationContext';

interface FollowButtonProps {
  artistId: string;
  artistName: string;
  initialIsFollowing?: boolean;
  isFollowBack?: boolean; // If artist follows user
  compact?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
  artistId, 
  artistName, 
  initialIsFollowing = false,
  isFollowBack = false,
  compact = false
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    
    // Logic
    setIsFollowing(true);
    showToast(`You are now following ${artistName}.`);
    
    // Simulate smart notification update
    setTimeout(() => {
        addNotification({
            title: `Updates from ${artistName}`,
            message: `You will now receive updates when ${artistName} posts new content.`,
            type: 'success',
            category: 'follower',
            priority: 'low'
        });
    }, 1000);

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleUnfollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmUnfollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(false);
    setShowConfirm(false);
    showToast(`Unfollowed ${artistName}.`);
  };

  // --- UI RENDER ---
  
  // 1. Unfollow Confirmation Popup
  if (showConfirm) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center" onClick={(e) => e.stopPropagation()}>
         <div className="flex flex-col items-center gap-2">
           <p className="text-[10px] font-bold text-gray-800">Unfollow?</p>
           <div className="flex gap-2">
             <button onClick={confirmUnfollow} className="bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold hover:bg-red-600">Yes</button>
             <button onClick={(e) => {e.stopPropagation(); setShowConfirm(false);}} className="bg-gray-200 text-gray-700 text-[10px] px-2 py-1 rounded font-bold hover:bg-gray-300">No</button>
           </div>
         </div>
      </div>
    );
  }

  // 2. Following State
  if (isFollowing) {
    return (
      <button 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleUnfollowClick}
        className={`
           relative overflow-hidden font-semibold border transition-all duration-200 flex items-center justify-center gap-1.5
           ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-1.5 text-xs md:text-sm'}
           rounded-lg
           ${isHovered 
             ? 'bg-red-50 border-red-200 text-red-600' // Hover Unfollow
             : 'bg-gray-200 border-gray-300 text-brand-textMain' // Default Following
           }
        `}
      >
        {isHovered ? (
           <>Unfollow</>
        ) : (
           <>
             <Check size={14} strokeWidth={3} />
             Following
           </>
        )}
      </button>
    );
  }

  // 3. Follow Back State
  if (isFollowBack) {
    return (
      <button 
        onClick={handleFollow}
        className={`
          bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 rounded-lg
          ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-1.5 text-xs md:text-sm'}
          ${isAnimating ? 'scale-105' : 'hover:scale-105 active:scale-95'}
        `}
      >
        <Heart size={14} fill="currentColor" /> Follow Back
      </button>
    );
  }

  // 4. Default Follow State
  return (
    <button 
      onClick={handleFollow}
      className={`
        bg-brand-primary hover:bg-brand-primaryDark text-white font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 rounded-lg shadow-sm
        ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-1.5 text-xs md:text-sm'}
        ${isAnimating ? 'scale-105' : 'hover:scale-105 active:scale-95'}
      `}
      aria-label={`Follow ${artistName}`}
    >
      <UserPlus size={16} /> Follow
    </button>
  );
};

export default FollowButton;
