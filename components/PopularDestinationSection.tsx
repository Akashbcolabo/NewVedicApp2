

import React from 'react';
import { PopularDestinationItem } from '../types';
import { PlusIcon } from '../constants';

interface PopularDestinationSectionProps {
  items: PopularDestinationItem[];
}

export const PopularDestinationSection: React.FC<PopularDestinationSectionProps> = ({ items }) => {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-white">Popular Destination</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="relative min-w-[140px] h-48 sm:min-w-[160px] sm:h-56 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
            role="article"
            aria-labelledby={`popular-${item.id}-title`}
          >
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
              <h3 id={`popular-${item.id}-title`} className="text-white text-sm font-medium">{item.type}</h3>
              <button 
                aria-label={`Add ${item.type} to favorites`}
                className="bg-white text-brand-orange rounded-full p-1.5 hover:bg-gray-200 transition-colors shadow-md"
              >
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};