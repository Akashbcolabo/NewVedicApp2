
import React from 'react';
import { ProjectItem as ProjectItemType } from '../types'; // Renamed to avoid conflict
import { HeartIcon } from '../constants'; // Assuming HeartIcon for a "Donate" or "Support" button

interface OurProjectSectionProps {
  onProjectClick: (project: ProjectItemType) => void;
}

const projectItems: ProjectItemType[] = [
  {
    id: 'project1',
    title: 'Community Kitchen Initiative',
    description: 'Providing nutritious meals to those in need.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop&q=75&seed=kitchen',
    budget: 500000,
    collectedAmount: 125000,
    deadlineDays: 45,
  },
  {
    id: 'project2',
    title: 'Vedic Library & Learning Center',
    description: 'A serene space for study and exploration of ancient texts.',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=300&fit=crop&q=75&seed=library',
    budget: 1200000,
    collectedAmount: 350000,
    deadlineDays: 90,
  },
  {
    id: 'project3',
    title: 'Yoga & Wellness Workshops',
    description: 'Promoting holistic health through yoga and meditation.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop&q=75&seed=yoga',
    budget: 300000,
    collectedAmount: 275000,
    deadlineDays: 20,
  },
];

const OurProjectSection: React.FC<OurProjectSectionProps> = ({ onProjectClick }) => {
  return (
    <section className="px-4 py-2 bg-light-primary dark:bg-primary"> {/* Reduced py further */}
      <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">Our Project</h2> {/* Reduced mb */}
      <div className="flex space-x-2.5 overflow-x-auto scrollbar-hide pb-2"> {/* Reduced space-x */}
        {projectItems.map((item, index) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 w-64 sm:w-72 group cursor-pointer"
            role="article"
            aria-labelledby={`project-title-${item.id}`}
            // Removed direct onClick from the div, button will handle it
          >
            <div 
              className="relative h-40 sm:h-48 rounded-lg overflow-hidden shadow-xl transform group-hover:scale-105 transition-transform duration-300 bg-light-surface dark:bg-dark-card animate-multicolor-border border-2 border-transparent"
              style={{ animationDelay: `${index * 0.35}s` }} // Staggered animation delay
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 flex flex-col justify-end">
                <h3 id={`project-title-${item.id}`} className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                {item.description && <p className="text-xs text-gray-200 dark:text-gray-300 line-clamp-2 mb-2">{item.description}</p>}
                 <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent click from bubbling to parent if any other wrapper has an onClick
                        onProjectClick(item);
                    }}
                    className="mt-auto w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-md py-2 px-3 text-xs font-medium flex items-center justify-center gap-1.5"
                    aria-label={`Donate to ${item.title}`}
                  >
                    <HeartIcon className="w-3.5 h-3.5" />
                    Donate Now
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurProjectSection;