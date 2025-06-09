

import React from 'react';
// import { ChevronLeftIcon } from '../constants'; // Optional: for a back button

interface PageHeaderProps {
  title: string;
  onBack?: () => void; // Optional back navigation handler
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack }) => {
  return (
    <header className="bg-black text-white px-4 py-4 sticky top-0 z-40 flex items-center">
      {onBack && (
        <button 
          onClick={onBack} 
          aria-label="Go back"
          className="p-2 mr-2 -ml-2 text-gray-300 hover:text-white"
        >
          {/* <ChevronLeftIcon className="w-6 h-6" /> Placeholder for back icon*/}
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}
      <h1 className="text-xl font-semibold">{title}</h1>
      {/* Additional actions or icons can be added here */}
    </header>
  );
};

export default PageHeader;