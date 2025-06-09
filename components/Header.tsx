import React from 'react';
import { MenuIcon, BellIcon, UserProfileIcon, XIcon, CalendarIcon } from '../constants'; 
import { VedicDate } from '../types';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage

interface HeaderProps {
  onToggleSideNav: () => void; 
  onNavigateNotifications: () => void;
  onNavigateProfile: () => void;
  vedicDate?: VedicDate; // Optional VedicDate prop
}

const Header: React.FC<HeaderProps> = ({ 
  onToggleSideNav,
  onNavigateNotifications, 
  onNavigateProfile, 
  vedicDate,
}) => {
  const { translate } = useLanguage(); // Get translate function
  const displayDate = vedicDate 
    ? `${vedicDate.tithi}, ${vedicDate.paksha}, ${vedicDate.month}`
    : "Vedic Wisdom";

  return (
    <header className="bg-light-surface dark:bg-primary px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-gray-200 dark:border-gray-700/50">
      <div className="relative">
        <button 
          aria-label="Open side menu" 
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          onClick={onToggleSideNav} 
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="text-center">
        {vedicDate ? (
          <div className="flex items-center justify-center text-xs sm:text-sm font-medium text-brand-orange dark:text-brand-yellow">
            <CalendarIcon className="w-4 h-4 mr-1.5 opacity-80" />
            <span>{`তিথি: ${vedicDate.tithi}, ${vedicDate.paksha}`}</span> {/* This specific date string would also need translation */}
            <span className="mx-1 sm:mx-1.5 opacity-60">|</span>
            <span>{`মাস: ${vedicDate.month}`}</span> {/* This specific date string would also need translation */}
          </div>
        ) : (
          <div className="text-xl font-semibold text-light-text-primary dark:text-white">
            {translate('appName', 'Vedic Wisdom')}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button 
          aria-label="View notifications" 
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          onClick={onNavigateNotifications}
        >
          <BellIcon className="w-6 h-6" />
        </button>
        <button 
          aria-label="User profile" 
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          onClick={onNavigateProfile}
        >
          <UserProfileIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;