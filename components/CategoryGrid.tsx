

import React from 'react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section className="space-y-3">
      <div className="flex justify-start">
        <h2 className="text-sm font-medium bg-brand-light-gray text-gray-700 px-4 py-1.5 rounded-full inline-block">
          Category
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="flex flex-col items-center space-y-1.5 cursor-pointer group"
            role="button"
            tabIndex={0}
            aria-label={category.name}
          >
            <div className="bg-brand-orange p-3.5 sm:p-4 rounded-full group-hover:bg-opacity-80 transition-all aspect-square flex items-center justify-center shadow-md">
              {category.icon}
            </div>
            <span className="text-xs text-center text-gray-300 group-hover:text-white transition-colors">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};