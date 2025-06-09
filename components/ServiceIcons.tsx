
import React from 'react';
import { YogaIcon, TempleIcon, FoodIcon, ConsultancyIcon, ShopIcon, VastuServiceIcon, JyotishServiceIcon, UsersIcon } from '../constants'; // Removed NewsIcon

interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactElement<{ className?: string }>;
  bgColorClass: string; 
}

const services: ServiceItem[] = [
  { id: 'yoga', name: 'Yoga', icon: <YogaIcon />, bgColorClass: 'bg-red-500 dark:bg-red-600' },
  { id: 'temples', name: 'Community Hub', icon: <UsersIcon />, bgColorClass: 'bg-sky-500 dark:bg-sky-600' }, 
  { id: 'food', name: 'Food', icon: <FoodIcon />, bgColorClass: 'bg-emerald-500 dark:bg-emerald-600' },
  { id: 'vastu', name: 'Vastu', icon: <VastuServiceIcon />, bgColorClass: 'bg-purple-500 dark:bg-purple-600' },
  { id: 'jyotish', name: 'Jyotish', icon: <JyotishServiceIcon />, bgColorClass: 'bg-pink-500 dark:bg-pink-600' },
  { id: 'consult', name: 'Consultancy', icon: <ConsultancyIcon />, bgColorClass: 'bg-amber-500 dark:bg-amber-600' },
  // { id: 'news', name: 'News', icon: <NewsIcon/>, bgColorClass: 'bg-blue-500 dark:bg-blue-600'}, // Removed News
  { id: 'shop', name: 'Shop', icon: <ShopIcon />, bgColorClass: 'bg-teal-500 dark:bg-teal-600' },
];

interface ServiceIconsProps {
  onServiceClick: (serviceId: string) => void;
}

const ServiceIcons: React.FC<ServiceIconsProps> = ({ onServiceClick }) => {
  return (
    <section className="px-2 py-1"> {/* Further reduced py */}
      <div className="flex overflow-x-auto scrollbar-hide gap-x-2.5 items-start pb-2 pt-1"> {/* Reduced gap-x, pt for border visibility */}
        {services.map((service, index) => (
          <button
            key={service.id}
            aria-label={service.name}
            className="flex flex-col items-center space-y-1 text-center group flex-shrink-0" 
            onClick={() => onServiceClick(service.id)}
          >
            <div 
              className={`p-3 ${service.bgColorClass} rounded-full group-hover:opacity-90 transition-opacity duration-300 aspect-square flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 border-2 border-transparent animate-multicolor-border shadow-lg`}
              style={{ animationDelay: `${index * 0.3}s` }} // Staggered animation delay
            >
              {React.cloneElement(service.icon, { className: "w-6 h-6 sm:w-7 sm:h-7 text-white transition-colors" })} 
            </div>
            <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors w-16 truncate">{service.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ServiceIcons;
