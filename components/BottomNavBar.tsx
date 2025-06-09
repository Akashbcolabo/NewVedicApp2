
import React from 'react';
import { NavItem } from '../types'; // Uses the updated NavItem type

interface BottomNavBarProps {
  navItems: NavItem[];
  activeTabId?: string; // Optional: to highlight the active tab
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ navItems, activeTabId }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-light-surface dark:bg-dark-surface shadow-top-md z-50 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-md mx-auto h-16 flex justify-around items-center px-2">
        {navItems.map((item) => {
          const isActive = item.id === activeTabId;
          if (item.id === 'akf') { 
            return (
              <button
                key={item.id}
                aria-label={item.name}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center text-center -mt-6" 
              >
                <div className={`bg-brand-blue w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-colors ${isActive ? 'ring-2 ring-white dark:ring-gray-300' : ''}`}>
                  {React.cloneElement(item.icon, { className: "w-8 h-8 text-white" })} 
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-brand-orange' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>{item.name}</span>
              </button>
            );
          }
          return (
            <button
              key={item.id}
              aria-label={item.name}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center text-center p-1 flex-1 group transition-colors ${
                isActive ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-light-text-primary dark:hover:text-white'
              }`}
            >
              <div className={`mb-0.5 ${isActive ? 'text-brand-orange' : (item.id === 'emergency' ? 'text-brand-yellow group-hover:text-light-text-primary dark:group-hover:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-light-text-primary dark:group-hover:text-white')}`}>
                {React.cloneElement(item.icon, { className: item.id === 'emergency' ? (isActive ? 'w-5 h-5 text-brand-orange' : 'w-5 h-5 text-brand-yellow') : (isActive ? 'w-5 h-5 text-brand-orange' : `w-5 h-5 ${isActive ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 group-hover:text-light-text-primary dark:group-hover:text-white'}`) })}
              </div>
              <span className={`text-xs ${isActive ? 'text-brand-orange' : (item.id === 'emergency' ? 'text-brand-yellow group-hover:text-light-text-primary dark:group-hover:text-white' : 'text-gray-500 dark:text-gray-300 group-hover:text-light-text-primary dark:group-hover:text-white')}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
