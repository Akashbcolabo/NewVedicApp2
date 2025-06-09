import React from 'react';
import { SearchResultItem } from '../types';
import { 
    TempleIcon, NewsIcon, YogaIcon, FoodIcon, VastuServiceIcon, JyotishServiceIcon, QuestionMarkIcon 
} from '../constants'; // Assuming QuestionMarkIcon for 'other' or 'service'

interface SearchResultsDisplayProps {
  results: SearchResultItem[];
  onResultClick: (item: SearchResultItem) => void;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ results, onResultClick }) => {
  
  const getIconForCategory = (category: SearchResultItem['category']) => {
    const iconProps = { className: "w-5 h-5 text-brand-orange flex-shrink-0" };
    switch (category) {
      case 'temple': return <TempleIcon {...iconProps} />;
      case 'news': return <NewsIcon {...iconProps} />;
      case 'yoga': return <YogaIcon {...iconProps} />;
      case 'food': return <FoodIcon {...iconProps} />;
      case 'vastu': return <VastuServiceIcon {...iconProps} />;
      case 'jyotish': return <JyotishServiceIcon {...iconProps} />;
      case 'service': // Fallthrough, uses QuestionMarkIcon
      case 'other':
      default: return <QuestionMarkIcon {...iconProps} />;
    }
  };

  if (results.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-400">
        <QuestionMarkIcon className="w-12 h-12 mx-auto mb-2 text-gray-500" />
        <p className="text-lg">No results found.</p>
        <p className="text-sm">Try different keywords or adjust your filters.</p>
      </div>
    );
  }

  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-semibold text-white mb-4">Search Results ({results.length})</h2>
      <div className="space-y-3">
        {results.map((item) => (
          <button
            key={item.id + '-' + item.category} // Ensure unique key if IDs can repeat across categories
            onClick={() => onResultClick(item)}
            className="w-full bg-dark-surface rounded-lg p-3.5 text-left shadow-md hover:bg-dark-surface-alt transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
            aria-label={`View details for ${item.title}`}
          >
            <div className="flex items-start gap-3">
              {item.imageUrl ? (
                <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-gray-700" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} // Hide if image fails to load
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {getIconForCategory(item.category)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                    <h3 className="text-base font-medium text-white truncate pr-2" title={item.title}>
                        {item.title}
                    </h3>
                    <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                        {item.category}
                    </span>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SearchResultsDisplay;