
import React from 'react';
import { UserProfileIcon, SettingsIcon, LogOutIcon, XIcon, HelpCircleIcon } from '../constants'; // Added HelpCircleIcon
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

interface SideNavBarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateProfile: () => void;
  onNavigateSettings: () => void;
  onNavigateHelp: () => void; // Added prop for Help navigation
  onLogout: () => void; 
}

const SideNavBar: React.FC<SideNavBarProps> = ({ 
  isOpen, 
  onClose, 
  onNavigateProfile, 
  onNavigateSettings, 
  onNavigateHelp, // Destructure new prop
  onLogout 
}) => {
  const { currentUser } = useAuth(); 

  const navItemClass = "w-full text-left px-3 py-3 text-sm text-gray-200 hover:bg-brand-orange hover:text-white rounded-md flex items-center gap-3 transition-colors";

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Side Navigation Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-dark-surface shadow-xl z-50 
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="navigation"
        aria-label="Main menu"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <img 
                  src={currentUser.photoURL || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(currentUser.displayName || 'User')}`} 
                  alt="User" 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <div>
                    <h2 className="text-md font-semibold text-white truncate max-w-[150px]">{currentUser.displayName || 'Vedic User'}</h2>
                    <p className="text-xs text-gray-400 truncate  max-w-[150px]">{currentUser.email}</p>
                </div>
              </div>
            ) : (
                <h2 className="text-xl font-semibold text-white">Vedic Wisdom</h2>
            )}
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
              aria-label="Close menu"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow p-4 space-y-2">
            <button
              onClick={() => { onNavigateProfile(); onClose(); }}
              className={navItemClass}
            >
              <UserProfileIcon className="w-5 h-5" /> My Profile
            </button>
            <button
              onClick={() => { onNavigateSettings(); onClose(); }}
              className={navItemClass}
            >
              <SettingsIcon className="w-5 h-5" /> Settings
            </button>
            <button
              onClick={() => { onNavigateHelp(); onClose(); }} // Added Help navigation
              className={navItemClass}
            >
              <HelpCircleIcon className="w-5 h-5" /> Help & Support
            </button>
            {/* Add more navigation items here if needed */}
          </nav>

          {/* Footer/Logout */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => { onLogout(); onClose(); }} 
              className="w-full text-left px-3 py-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-md flex items-center gap-3 transition-colors"
            >
              <LogOutIcon className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavBar;
