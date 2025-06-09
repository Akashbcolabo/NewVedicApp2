
import React from 'react';
import { XIcon } from '../constants'; // Assuming XIcon is available

interface PopupNotificationProps {
  title: string;
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

const PopupNotification: React.FC<PopupNotificationProps> = ({ title, message, onClose, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[200]"
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div 
        className="bg-dark-surface-alt text-white rounded-lg p-6 w-full max-w-md shadow-2xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Close notification"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <h2 id="popup-title" className="text-xl font-semibold mb-3 text-brand-orange">{title}</h2>
        <p className="text-gray-300 text-sm">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-brand-orange text-white py-2.5 rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-opacity-50"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default PopupNotification;