import React, { useState, useEffect } from 'react';
import { FilterOption, ItemCategory } from '../types';
import { XIcon, FilterXIcon } from '../constants';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: FilterOption[];
  currentFilters: ItemCategory[];
  onApplyFilters: (selectedFilters: ItemCategory[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, options, currentFilters, onApplyFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState<ItemCategory[]>(currentFilters);

  useEffect(() => {
    setSelectedFilters(currentFilters);
  }, [currentFilters, isOpen]);

  const actualCategoryOptions = options.filter(opt => opt.id !== 'all');
  const allActualCategoryIds = actualCategoryOptions.map(opt => opt.id as ItemCategory);

  const isAllSelectedForUI = actualCategoryOptions.length > 0 && 
                           selectedFilters.length === actualCategoryOptions.length &&
                           allActualCategoryIds.every(id => selectedFilters.includes(id));

  const handleToggleFilter = (filterId: ItemCategory | 'all') => {
    if (filterId === 'all') {
      if (isAllSelectedForUI) {
        setSelectedFilters([]); // Deselect all
      } else {
        setSelectedFilters(allActualCategoryIds); // Select all
      }
    } else {
      // It's an ItemCategory
      const catId = filterId as ItemCategory;
      setSelectedFilters(prev =>
        prev.includes(catId)
          ? prev.filter(id => id !== catId)
          : [...prev, catId]
      );
    }
  };
  
  const handleClearFilters = () => {
    setSelectedFilters([]);
    onApplyFilters([]); // Apply empty filters immediately
    onClose();
  };

  const handleSubmit = () => {
    onApplyFilters(selectedFilters); // selectedFilters now only contains ItemCategory
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <div 
        className="bg-dark-surface text-white rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="filter-modal-title" className="text-xl font-semibold text-brand-orange">Filter Search Results</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close filter modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-1 -mr-1 mb-4 scrollbar-hide">
          {options.map((option) => {
            const isChecked = option.id === 'all' ? isAllSelectedForUI : selectedFilters.includes(option.id as ItemCategory);
            return (
              <label
                key={option.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-150 border-2
                  ${isChecked
                    ? 'bg-brand-orange/20 border-brand-orange text-brand-orange'
                    : 'bg-dark-surface-alt border-gray-700 hover:border-gray-600 text-gray-300'
                  }`}
              >
                <input
                  type="checkbox"
                  className="form-checkbox w-5 h-5 text-brand-orange bg-gray-700 border-gray-600 rounded focus:ring-brand-orange focus:ring-offset-dark-surface-alt mr-3"
                  checked={isChecked}
                  onChange={() => handleToggleFilter(option.id)}
                  aria-labelledby={`filter-option-${option.id}`}
                />
                {option.icon && React.cloneElement(option.icon, { className: `w-5 h-5 mr-2 ${isChecked ? 'text-brand-orange' : 'text-gray-400'}`})}
                <span id={`filter-option-${option.id}`} className="text-sm font-medium">{option.name}</span>
              </label>
            );
          })}
        </div>
        
        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-700">
            <button
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 transition-colors text-white rounded-lg py-2.5 text-sm font-medium"
                aria-label="Clear all filters"
            >
                <FilterXIcon className="w-4 h-4"/>
                Clear Filters
            </button>
            <button
                onClick={handleSubmit}
                className="w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-2.5 text-sm font-medium"
            >
                Apply Filters
            </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;