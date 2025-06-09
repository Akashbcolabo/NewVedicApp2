

import React from 'react';
import { RecommendedItem } from '../types';

interface RecommendedSectionProps {
  items: RecommendedItem[];
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({ items }) => {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-white">Recommended</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="min-w-[240px] sm:min-w-[280px] h-40 sm:h-48 bg-dark-card rounded-xl overflow-hidden shadow-lg group cursor-pointer"
            role="article"
            aria-labelledby={`recommended-${item.id}-title`}
            >
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay for text if needed in future, currently not in screenshot for this section */}
            {/* <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <h3 id={`recommended-${item.id}-title`} className="text-lg font-medium text-white">{item.name}</h3>
            </div> */}
          </div>
        ))}
      </div>
    </section>
  );
};