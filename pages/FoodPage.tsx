
import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import PopupNotification from '../components/PopupNotification';
import { AIRecipeService } from '../services/aiRecipeService';
import { Recipe as RecipeType, NavItem } from '../types'; 
import {
  SearchLucideIcon,
  MicIcon,
  StopCircleIcon,
  BrainIcon,
  ClockIcon,
  StarIcon,
  ChevronRightIcon,
  XIcon,
  LoaderIcon,
  HeartIcon,
  HomeIcon,
  LearnIcon,
  AkfPlaceholderIcon,
  NewsIcon as NewsNavIcon,
  EmergencyIcon,
  ShoppingBagIcon, 
} from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface FoodPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void; 
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const FoodPage: React.FC<FoodPageProps> = ({ onNavigateHome, onNavigateLearn, onNavigateNews, onNavigateEmergency }) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null); 

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognitionInstance: SpeechRecognition = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US'; // Consider making this dynamic based on app language

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);
        setIsListening(false);
      };
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognitionInstance;
    } else {
        console.warn('Speech recognition not supported in this browser.');
    }
  }, []);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert(translate('voiceNotSupported', 'Speech recognition is not supported or not initialized.'));
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting voice search:", err);
        setIsListening(false);
      }
    }
  };

  const handleGenerateRecipe = async () => {
    if (!recipePrompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const recipe = await AIRecipeService.generateRecipe(recipePrompt);
      setRecipePrompt('');
      setShowAIModal(false);
      setRecipes(prev => [recipe, ...prev.filter(r => r.id !== recipe.id)]); // Add or update recipe
      setSelectedRecipe(recipe); 
      setShowRecipeModal(true);
    } catch (err: any) {
      console.error('Error generating recipe:', err);
      setError(err.message || translate('recipeGenerationFailed', 'Failed to generate recipe. Please try again.'));
    } finally {
      setIsGenerating(false);
    }
  };

  const initialRecipes: RecipeType[] = [
    {
      id: 'sattvic-khichdi',
      name: 'Sattvic Khichdi',
      category: 'sattvic',
      ingredients: ['Moong Dal (1/2 cup)', 'Rice (1/2 cup)', 'Ghee (1 tbsp)', 'Cumin Seeds (1 tsp)', 'Turmeric (1/2 tsp)', 'Water (3 cups)', 'Salt to taste'],
      instructions: [
        'Wash rice and dal thoroughly.',
        'Heat ghee in a pressure cooker.',
        'Add cumin seeds and let them crackle.',
        'Add rice, dal, turmeric, and salt.',
        'Add water and pressure cook for 3-4 whistles.',
        'Let pressure release naturally. Serve hot with a dollop of ghee.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60',
      cookingTime: '30 mins',
      difficulty: 'Easy',
      cuisine: 'Vedic'
    },
    {
      id: 'prasad-halwa',
      name: 'Prasad Halwa',
      category: 'prasad',
      ingredients: ['Semolina (1 cup)', 'Ghee (1/2 cup)', 'Sugar (1 cup)', 'Water (2 cups)', 'Cardamom powder (1/2 tsp)', 'Mixed Nuts (2 tbsp, chopped)'],
      instructions: [
        'Heat ghee in a pan and roast semolina on low heat until golden brown and aromatic.',
        'In a separate saucepan, bring water and sugar to a boil to make sugar syrup.',
        'Gradually add the hot sugar syrup to the roasted semolina, stirring continuously to avoid lumps.',
        'Add cardamom powder and cook until the halwa thickens and leaves the sides of the pan.',
        'Garnish with chopped nuts and serve warm as prasad.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=60',
      cookingTime: '25 mins',
      difficulty: 'Medium',
      cuisine: 'Temple'
    },
    {
      id: 'ayurvedic-tea',
      name: 'Ayurvedic Herbal Tea',
      category: 'ayurvedic',
      ingredients: ['Water (2 cups)', 'Fresh Ginger (1 inch, grated)', 'Tulsi (Holy Basil) leaves (5-6)', 'Cardamom pods (2, crushed)', 'Cinnamon stick (1 inch)', 'Honey or Jaggery to taste (optional)'],
      instructions: [
        'Bring water to a boil in a saucepan.',
        'Add grated ginger, tulsi leaves, crushed cardamom, and cinnamon stick.',
        'Simmer on low heat for 5-7 minutes to let the flavors infuse.',
        'Strain the tea into cups.',
        'Add honey or jaggery if desired. Serve hot.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc819f459dc?w=800&auto=format&fit=crop&q=60',
      cookingTime: '10 mins',
      difficulty: 'Easy',
      cuisine: 'Ayurvedic'
    }
  ];
  
  const [recipes, setRecipes] = useState<RecipeType[]>(initialRecipes);


  const categories = [
    { id: 'all', name: translate('allCategory', 'All'), icon: <ShoppingBagIcon /> },
    { id: 'sattvic', name: translate('sattvicCategory', 'Sattvic'), icon: <span className="text-2xl">🌱</span> },
    { id: 'prasad', name: translate('prasadCategory', 'Prasad'), icon: <span className="text-2xl">🍲</span> },
    { id: 'ayurvedic', name: translate('ayurvedicFoodCategory', 'Ayurvedic'), icon: <span className="text-2xl">🌿</span> },
    { id: 'fasting', name: translate('fastingCategory', 'Fasting'), icon: <span className="text-2xl">🍚</span> }
  ];

  const filteredRecipes = recipes.filter(recipe => 
    (selectedCategory === 'all' || recipe.category.toLowerCase() === selectedCategory) &&
    (!searchQuery || recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewRecipe = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };
  
  const foodPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnIcon />, onClick: onNavigateLearn }, 
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => {} }, // Current Page
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans pb-20">
      <PageHeader title={translate('foodPageTitle', "Vedic Food & Recipes")} onBack={onNavigateHome} />
      
      {/* Welcome Popup is themed via its own component */}
      <PopupNotification 
        title={translate('foodWelcomeTitle', "Welcome to Vedic Food!")}
        message={translate('foodWelcomeMessage', "Explore traditional recipes or use our AI to generate new ones based on your preferences.")}
        isVisible={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
      />

      <div className={`p-4 flex flex-col sm:flex-row gap-2 sticky top-[60px] z-30 ${theme === 'light' ? 'bg-light-primary dark:bg-dark-primary' : 'bg-primary dark:bg-black'}`}>
        <div className="flex-1 relative">
          <SearchLucideIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange" />
          <input
            type="text"
            placeholder={translate('searchRecipesPlaceholder', "Search recipes...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-12 py-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange ${theme === 'light' ? 'bg-light-surface text-light-text-primary placeholder-light-text-tertiary' : 'bg-dark-surface-alt text-dark-text-primary placeholder-dark-text-tertiary'}`}
            aria-label="Search recipes"
          />
          <button
            onClick={handleVoiceSearch}
            aria-label={isListening ? translate('stopVoiceSearch', "Stop voice search") : translate('startVoiceSearch', "Start voice search")}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
              isListening ? 'text-red-500 animate-pulse' : 'text-brand-orange hover:text-opacity-80'
            }`}
            disabled={!recognitionRef.current}
          >
            {isListening ? <StopCircleIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
          </button>
        </div>
        <button
          onClick={() => setShowAIModal(true)}
          className="bg-brand-orange px-4 py-3 sm:py-0 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors text-white font-medium"
        >
          <BrainIcon className="w-5 h-5" />
          <span>{translate('aiRecipeButton', 'AI Recipe')}</span>
        </button>
      </div>
      
      {isListening && (
         <div className="px-4">
            <div className={`rounded-lg p-2 mt-1 text-center ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface-alt'}`}>
              <div className={`flex items-center justify-center gap-2 text-xs ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                <span>{translate('listening', 'Listening...')}</span>
              </div>
            </div>
        </div>
      )}


      <div className="grid grid-cols-5 gap-2 sm:gap-4 p-4 mt-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center gap-1.5 text-center transition-all aspect-square
              ${selectedCategory === category.id 
                ? `ring-2 ring-brand-orange shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}` 
                : `${theme === 'light' ? 'bg-light-surface hover:bg-gray-200' : 'bg-dark-surface-alt hover:bg-gray-700'}`
              }`}
            aria-pressed={selectedCategory === category.id}
          >
            <div className={`text-xl sm:text-2xl ${selectedCategory === category.id ? 'text-brand-orange' : (theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary')}`}>
                {typeof category.icon === 'string' 
                  ? category.icon 
                  : React.cloneElement(category.icon as React.ReactElement<{ className?: string }>, {className: 'w-6 h-6 sm:w-7 sm:h-7'})
                }
            </div>
            <span className={`text-xs font-medium ${selectedCategory === category.id ? 'text-brand-orange' : (theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary')}`}>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-brand-orange/20 dark:hover:shadow-brand-orange/30 hover:transform hover:-translate-y-1 ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
            <img 
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className={`font-semibold text-lg mb-2 truncate ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`} title={recipe.name}>{recipe.name}</h3>
              <div className={`flex items-center gap-4 text-sm mb-3 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4" />
                  <span>{recipe.cookingTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
              <button
                onClick={() => handleViewRecipe(recipe)}
                className="w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium"
                aria-label={translate('viewRecipeAriaLabel', `View recipe for ${recipe.name}`, { name: recipe.name })}
              >
                <span>{translate('viewRecipeButton', 'View Recipe')}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredRecipes.length === 0 && !isGenerating && (
            <div className={`md:col-span-2 text-center py-10 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>
                <p className="text-xl mb-2">(._.)</p>
                <p>{translate('noRecipesFound', 'No recipes found for "{searchTermOrCategory}".', { searchTermOrCategory: searchQuery || selectedCategory })}</p>
                <p className="text-sm mt-1">{translate('tryDifferentSearchOrAI', 'Try a different search or category, or use the AI Recipe generator!')}</p>
            </div>
        )}
      </div>

      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowRecipeModal(false)}>
          <div className={`rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl ${theme === 'light' ? 'bg-light-surface text-light-text-primary' : 'bg-dark-card text-dark-text-primary'}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="recipe-title">
            <div className="flex justify-between items-center mb-4">
              <h2 id="recipe-title" className="text-xl font-bold text-brand-orange">{selectedRecipe.name}</h2>
              <button onClick={() => setShowRecipeModal(false)} className={`p-1.5 rounded-full ${theme === 'light' ? 'text-gray-500 hover:bg-gray-200' : 'text-gray-400 hover:bg-gray-700'}`} aria-label={translate('closeRecipeModalAria', "Close recipe details")}>
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedRecipe.imageUrl} alt={selectedRecipe.name} className="w-full h-56 object-cover rounded-lg mb-4" />
            <div className="space-y-4 text-sm">
              <div>
                <h3 className={`font-semibold mb-1.5 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('cuisineLabel', 'Cuisine')}: <span className={`font-normal ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{selectedRecipe.cuisine}</span></h3>
                <h3 className={`font-semibold mb-1.5 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('cookingTimeLabel', 'Cooking Time')}: <span className={`font-normal ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{selectedRecipe.cookingTime}</span></h3>
                <h3 className={`font-semibold mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('difficultyLabel', 'Difficulty')}: <span className={`font-normal ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{selectedRecipe.difficulty}</span></h3>
              </div>
              <div>
                <h3 className={`font-semibold mb-1.5 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('ingredientsLabel', 'Ingredients')}:</h3>
                <ul className={`list-disc list-inside space-y-1 pl-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                  {selectedRecipe.ingredients.map((ingredient: string, index: number) => <li key={index}>{ingredient}</li>)}
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold mb-1.5 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('instructionsLabel', 'Instructions')}:</h3>
                <ol className={`list-decimal list-inside space-y-1.5 pl-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                  {selectedRecipe.instructions.map((instruction: string, index: number) => <li key={index}>{instruction}</li>)}
                </ol>
              </div>
              <div className={`flex items-center justify-end pt-4 mt-4 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'}`}>
                <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${theme === 'light' ? 'text-red-600 hover:text-red-700 hover:bg-red-100' : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'}`}>
                  <HeartIcon className="w-4 h-4" />
                  <span>{translate('saveRecipeButton', 'Save Recipe')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAIModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowAIModal(false)}>
          <div className={`rounded-xl p-6 w-full max-w-lg shadow-2xl ${theme === 'light' ? 'bg-light-surface text-light-text-primary' : 'bg-dark-card text-dark-text-primary'}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="ai-recipe-title">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <BrainIcon className="w-6 h-6 text-brand-orange" />
                <h2 id="ai-recipe-title" className="text-xl font-bold">{translate('aiRecipeGeneratorTitle', 'AI Recipe Generator')}</h2>
              </div>
              <button onClick={() => setShowAIModal(false)} className={`p-1.5 rounded-full ${theme === 'light' ? 'text-gray-500 hover:bg-gray-200' : 'text-gray-400 hover:bg-gray-700'}`} aria-label={translate('closeAIRecipeModalAria', "Close AI recipe generator")}>
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="recipe-prompt" className={`block text-sm mb-1.5 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('describeRecipePrompt', 'Describe the recipe you want (e.g., ingredients, cuisine, type):')}</label>
                <textarea
                  id="recipe-prompt"
                  value={recipePrompt}
                  onChange={(e) => setRecipePrompt(e.target.value)}
                  placeholder={translate('recipePromptPlaceholder', "E.g., A healthy sattvic breakfast using oats and fruits...")}
                  className={`w-full rounded-lg px-3 py-2.5 outline-none h-28 resize-none focus:ring-2 focus:ring-brand-orange ${theme === 'light' ? 'bg-light-surface-alt text-light-text-primary placeholder-light-text-tertiary' : 'bg-dark-surface-alt text-dark-text-primary placeholder-dark-text-tertiary'}`}
                />
              </div>
              {error && <div className={`rounded-lg p-3 text-sm ${theme === 'light' ? 'bg-red-100 border border-red-300 text-red-700' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>{error}</div>}
              <button
                onClick={handleGenerateRecipe}
                disabled={isGenerating || !recipePrompt.trim()}
                className="w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-3 flex items-center justify-center gap-2 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGenerating ? (<><LoaderIcon className="w-5 h-5 animate-spin" /><span>{translate('generatingButton', 'Generating...')}</span></>) : (<><span>{translate('generateRecipeButton', 'Generate Recipe')}</span></>)}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar navItems={foodPageNavItems} activeTabId="akf" />
    </div>
  );
};

export default FoodPage;
