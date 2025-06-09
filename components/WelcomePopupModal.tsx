
import React from 'react';
import { XIcon, ArrowRightIcon } from '../constants'; // Assuming these icons are available
import { useTheme } from '../contexts/ThemeContext';

interface WelcomePopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  ctaText: string;
  ctaLinkAction: () => void;
  imageUrl?: string; // Optional image URL
  imageAlt?: string; // Optional alt text for the image
}

const WelcomePopupModal: React.FC<WelcomePopupModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  ctaText,
  ctaLinkAction,
  imageUrl,
  imageAlt,
}) => {
  const { theme } = useTheme();

  if (!isOpen) {
    return null;
  }

  const handleCtaClick = () => {
    ctaLinkAction();
    onClose(); // Close the modal after CTA click
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[200]"
      onClick={onClose} // Close when clicking on the overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
    >
      <div
        className={`rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100
          ${theme === 'light' ? 'bg-gradient-to-br from-white to-gray-100 text-gray-800' : 'bg-gradient-to-br from-dark-surface to-gray-800 text-white'}
        `}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
      >
        {/* Close button remains at the top right of the entire modal card */}
        <button
            onClick={onClose}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors
              ${theme === 'light' ? 'text-gray-500 hover:bg-gray-200 hover:text-gray-700' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
            `}
            aria-label="Close welcome popup"
          >
            <XIcon className="w-5 h-5" />
        </button>

        {imageUrl && (
          <div className="w-full h-48 overflow-hidden rounded-t-xl">
            <img
              src={imageUrl}
              alt={imageAlt || title} // Use title as fallback alt text
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className={`relative p-6 sm:p-8 ${imageUrl ? 'pt-4' : ''} ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'}`}>
          <div className="flex items-center mb-3">
            {!imageUrl && ( /* Only show placeholder logo if no custom image */
              <img src="/logo_placeholder.png" alt="App Logo" className="w-12 h-12 mr-3 rounded-full bg-brand-orange p-1" />
            )}
            <h2 id="welcome-popup-title" className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-brand-orange' : 'text-brand-yellow'} ${imageUrl ? 'mt-1' : ''}`}>
              {title}
            </h2>
          </div>
          <p className={`text-sm sm:text-base leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {message}
          </p>
        </div>
        <div className="px-6 py-4 sm:px-8 sm:py-5">
          <button
            onClick={handleCtaClick}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-transform duration-150 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2
              ${theme === 'light' 
                ? 'bg-brand-orange text-white hover:bg-opacity-90 focus:ring-brand-orange focus:ring-offset-gray-50' 
                : 'bg-brand-yellow text-black hover:bg-opacity-90 focus:ring-brand-yellow focus:ring-offset-gray-800'
              }
            `}
          >
            <span>{ctaText}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopupModal;
