
import React from 'react';
import { MOCK_VEDIC_TEXTS } from '../mockData'; 
import { VedicText } from '../types';

interface VedaSectionProps {
  onVedaClick: (vedaId: string) => void;
}

const VedaSection: React.FC<VedaSectionProps> = ({ onVedaClick }) => {
  const vedasToDisplay = MOCK_VEDIC_TEXTS; 

  return (
    <section className="px-4 py-2 bg-light-primary dark:bg-primary"> {/* Reduced py */}
      <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">Sacred Texts</h2> {/* Reduced mb */}
      <div className="flex space-x-2.5 overflow-x-auto scrollbar-hide pb-2"> {/* Reduced space-x */}
        {vedasToDisplay.map((veda: VedicText, index: number) => (
          <div 
            key={veda.id} 
            className="flex-shrink-0 w-28 sm:w-32 group cursor-pointer" 
            role="button"
            tabIndex={0}
            aria-label={veda.title}
            onClick={() => onVedaClick(veda.id)}
            onKeyPress={(e) => e.key === 'Enter' && onVedaClick(veda.id)}
          >
            <div 
              className="relative h-40 sm:h-44 rounded-lg overflow-hidden transform group-hover:scale-105 transition-transform duration-300 animate-multicolor-border border-2 border-transparent"
              style={{ animationDelay: `${index * 0.25}s` }} // Added staggered animation delay
            >
              <img 
                src={veda.imageUrl} 
                alt={veda.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                 {/* The title is now part of this overlay, or implied by the image. Text below is removed. */}
              </div>
            </div>
            {/* Title and Subtitle below the card are removed as per request */}
            {/* 
            <h3 className="text-sm font-medium text-gray-200 mt-2 text-center truncate group-hover:text-white transition-colors">{veda.title}</h3>
            {veda.subtitle && <p className="text-xs text-center text-gray-400 truncate group-hover:text-gray-200 transition-colors">{veda.subtitle}</p>} 
            */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default VedaSection;