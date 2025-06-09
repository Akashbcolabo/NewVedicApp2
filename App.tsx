
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ServiceIcons from './components/ServiceIcons';
import VedaSection from './components/VedaSection';
import OurProjectSection from './components/OurProjectSection'; 
import { BottomNavBar } from './components/BottomNavBar';
import FilterModal from './components/FilterModal'; 
import SearchResultsDisplay from './components/SearchResultsDisplay'; 
import SideNavBar from './components/SideNavBar';
import DonationModal from './components/DonationModal'; 
import WelcomePopupModal from './components/WelcomePopupModal';
import { 
    AlertCircleIcon, HomeIcon, LearnIcon as BottomNavLearnIcon, 
    AkfPlaceholderIcon, NewsIcon as NewsNavIcon, EmergencyIcon,
    TempleIcon, YogaIcon, FoodIcon as FoodServiceIcon, VastuServiceIcon, JyotishServiceIcon, 
    LearnIcon, ChevronLeftIcon, ChevronRightIcon, UsersIcon, ConsultancyIcon 
} from './constants'; 
import AkfPage from './pages/AkfPage'; // Changed from TemplePage
import AIAgentPage from './pages/AIAgentPage';
import NewsPage from './pages/NewsPage';
import FoodPage from './pages/FoodPage'; 
import EmergencyPage from './pages/EmergencyPage'; 
import LearnPage from './pages/LearnPage'; 
import YogaPage from './pages/YogaPage';
import VastuPage from './pages/VastuPage';
import JyotishPage from './pages/JyotishPage';
import VedaReaderPage from './pages/VedaReaderPage'; 
import CommunityPage from './pages/CommunityPage'; 
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ConsultancyPage from './pages/ConsultancyPage'; 
import AuthPage from './pages/AuthPage';
import HelpSupportPage from './pages/HelpSupportPage'; // Added HelpSupportPage
import { NavItem, SearchResultItem, FilterOption, ItemCategory, VedicText, CommunityEntity, UserProfileData, HeroContent, ProjectItem, Doctor, VedicDate, User } from './types'; 
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; 
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MOCK_YOGA_PROGRAMS, MOCK_NEWS_ARTICLES, MOCK_RECIPES, MOCK_TEMPLE_DESTINATIONS, MOCK_VASTU_TIPS, MOCK_JYOTISH_ITEMS, MOCK_VEDIC_TEXTS, MOCK_USER_PROFILE_DATA, MOCK_HERO_IMAGES, MOCK_DOCTORS, MOCK_CONTACTED_PROFILES } from './mockData'; 
import { calculateVedicDate } from './utils/vedicTime';


type PageState = 'home' | 'akf' | 'learnMain' | 'aiAgent' | 'news' | 'food' | 'emergency' | 
                 'yogaStandalone' | 'vastu' | 'jyotish' | 'vedaReader' | 
                 'community' | 'chatWithEntity' | 
                 'settings' | 'userProfile' | 'notifications' | 'consultancy' | 'helpSupport'; // Added helpSupport

function debounce<F extends (...args: any[]) => any>(func: F, delay: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}


const AppContent: React.FC = () => {
  const { theme } = useTheme(); 
  const { translate } = useLanguage();
  const { currentUser, logout: authLogout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [previousPageStack, setPreviousPageStack] = useState<PageState[]>(['home']);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroScrollContainerRef = useRef<HTMLDivElement>(null);
  const heroVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const heroIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [selectedVeda, setSelectedVeda] = useState<VedicText | null>(null);
  const [selectedCommunityEntity, setSelectedCommunityEntity] = useState<CommunityEntity | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ItemCategory[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedProjectForDonation, setSelectedProjectForDonation] = useState<ProjectItem | null>(null);

  const [currentVedicDate, setCurrentVedicDate] = useState<VedicDate>(calculateVedicDate());

  const [isWelcomePopupOpen, setIsWelcomePopupOpen] = useState(false);
  const [hasShownWelcomePopup, setHasShownWelcomePopup] = useState(false);
  const welcomePopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userProfileToDisplay: UserProfileData = currentUser 
    ? {
        ...MOCK_USER_PROFILE_DATA, 
        id: currentUser.uid,
        name: currentUser.displayName || MOCK_USER_PROFILE_DATA.name,
        email: currentUser.email || MOCK_USER_PROFILE_DATA.email,
        avatarUrl: currentUser.photoURL || MOCK_USER_PROFILE_DATA.avatarUrl,
        country: currentUser.country || MOCK_USER_PROFILE_DATA.country,
        state: currentUser.state || MOCK_USER_PROFILE_DATA.state,
        city: currentUser.city || MOCK_USER_PROFILE_DATA.city,
        village: currentUser.village || MOCK_USER_PROFILE_DATA.village,
        phone: currentUser.phone || MOCK_USER_PROFILE_DATA.phone,
        dob: currentUser.dob || MOCK_USER_PROFILE_DATA.dob,
        preferredLanguage: currentUser.preferredLanguage || MOCK_USER_PROFILE_DATA.preferredLanguage,
      }
    : MOCK_USER_PROFILE_DATA; 


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const updateDate = () => {
      setCurrentVedicDate(calculateVedicDate());
    };
    updateDate(); 
    const timerId = setInterval(updateDate, 24 * 60 * 60 * 1000); 
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (welcomePopupTimerRef.current) {
      clearTimeout(welcomePopupTimerRef.current);
      welcomePopupTimerRef.current = null;
    }

    if (currentPage === 'home' && !hasShownWelcomePopup) {
      welcomePopupTimerRef.current = setTimeout(() => {
        setIsWelcomePopupOpen(true);
        setHasShownWelcomePopup(true); 
      }, 3000); 
    } else if (currentPage !== 'home' && isWelcomePopupOpen) {
      setIsWelcomePopupOpen(false);
    }

    return () => {
      if (welcomePopupTimerRef.current) {
        clearTimeout(welcomePopupTimerRef.current);
        welcomePopupTimerRef.current = null;
      }
    };
  }, [currentPage, hasShownWelcomePopup, isWelcomePopupOpen]);


  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen);

  const navigateTo = (page: PageState, replace = false) => {
    if (currentPage !== page) {
        if (replace) {
            setPreviousPageStack(prevStack => [...prevStack.slice(0, -1), page]);
        } else {
            setPreviousPageStack(prevStack => [...prevStack, page]);
        }
    }
    setCurrentPage(page);
    setIsSideNavOpen(false); 
  };
  
  const handleBackNavigation = () => {
    if (previousPageStack.length > 1) {
        const newStack = [...previousPageStack];
        newStack.pop(); 
        const prevPage = newStack[newStack.length - 1]; 
        setCurrentPage(prevPage);
        setPreviousPageStack(newStack);
    } else {
        navigateTo('home', true);
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      navigateToHome(); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigateToAkfPage = () => navigateTo('akf'); // Changed from navigateToTemplePage
  const navigateToHome = () => {
    setSearchQuery('');
    setSearchResults([]);
    setActiveFilters([]);
    setSelectedVeda(null);
    setSelectedCommunityEntity(null);
    navigateTo('home', true); 
  };
  const navigateToLearnPage = () => navigateTo('learnMain'); 
  const navigateToAIAgentPage = () => navigateTo('aiAgent'); 
  const navigateToNewsPage = () => navigateTo('news');
  const navigateToFoodPage = () => navigateTo('food'); 
  const navigateToEmergencyPage = () => navigateTo('emergency');
  const navigateToYogaStandalonePage = () => navigateTo('yogaStandalone');
  const navigateToVastuPage = () => navigateTo('vastu');
  const navigateToJyotishPage = () => navigateTo('jyotish');
  const navigateToConsultancyPage = () => navigateTo('consultancy');
  const navigateToHelpSupportPage = () => navigateTo('helpSupport');
  
  const navigateToVedaReader = (vedaId: string) => {
    const vedaData = MOCK_VEDIC_TEXTS.find(v => v.id === vedaId);
    if (vedaData) {
      setSelectedVeda(vedaData);
      navigateTo('vedaReader');
    } else {
      console.error(`Veda with id ${vedaId} not found.`);
    }
  };

  const navigateToCommunityPage = () => navigateTo('community');
  const navigateToChatPage = (entity: CommunityEntity) => {
    setSelectedCommunityEntity(entity);
    navigateTo('chatWithEntity');
  };

  const navigateToSettingsPage = () => navigateTo('settings');
  const navigateToUserProfilePage = () => navigateTo('userProfile');
  const navigateToNotificationsPage = () => navigateTo('notifications');
  
  const advanceHeroSlide = useCallback(() => {
    if (heroScrollContainerRef.current && MOCK_HERO_IMAGES.length > 0) {
      const currentItem = MOCK_HERO_IMAGES[currentHeroSlide];
      const videoElement = currentItem.type === 'video' ? heroVideoRefs.current[currentHeroSlide] : null;

      if (videoElement && !videoElement.paused) {
        return;
      }

      const newSlideIndex = (currentHeroSlide + 1) % MOCK_HERO_IMAGES.length;
      heroScrollContainerRef.current.scrollTo({
        left: newSlideIndex * heroScrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      });
      setCurrentHeroSlide(newSlideIndex);
    }
  }, [currentHeroSlide]);

  useEffect(() => {
    heroVideoRefs.current = heroVideoRefs.current.slice(0, MOCK_HERO_IMAGES.length);
  }, []);


  useEffect(() => {
    if (MOCK_HERO_IMAGES.length <= 1 || currentPage !== 'home') {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
      return;
    }
  
    const setupInterval = () => {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
  
      const currentItem = MOCK_HERO_IMAGES[currentHeroSlide];
      if (currentItem.type === 'image' || !currentItem.videoUrl) {
        heroIntervalRef.current = setInterval(advanceHeroSlide, currentItem.duration || 10000);
      } else {
        const videoElement = heroVideoRefs.current[currentHeroSlide];
        if (videoElement && videoElement.paused) { 
             heroIntervalRef.current = setInterval(advanceHeroSlide, 10000); 
        }
      }
    };
  
    setupInterval();
  
    return () => {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    };
  }, [currentHeroSlide, advanceHeroSlide, currentPage]);


  const handleVideoEvents = (index: number, eventType: 'play' | 'ended' | 'pause') => {
    if (eventType === 'play') {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    } else if (eventType === 'ended') {
      advanceHeroSlide(); 
    } else if (eventType === 'pause') {
        const videoElement = heroVideoRefs.current[index];
        if (videoElement && !videoElement.ended) {
            if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
             heroIntervalRef.current = setInterval(advanceHeroSlide, MOCK_HERO_IMAGES[index].duration || 10000);
        }
    }
  };


  const debouncedUpdateSlideIndex = useRef(
    debounce((scrollLeft: number, clientWidth: number, totalSlides: number) => {
      if (clientWidth > 0) {
        const newIndex = Math.round(scrollLeft / clientWidth);
        if (newIndex >= 0 && newIndex < totalSlides && newIndex !== currentHeroSlide) {
          setCurrentHeroSlide(newIndex);
        }
      }
    }, 150)
  ).current;

  const handleManualHeroScroll = () => {
    if (heroScrollContainerRef.current) {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current); 
      debouncedUpdateSlideIndex(
        heroScrollContainerRef.current.scrollLeft,
        heroScrollContainerRef.current.clientWidth,
        MOCK_HERO_IMAGES.length
      );
      setTimeout(() => {
        if (currentPage === 'home') { 
        }
      }, 5000); 
    }
  };

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'temples') navigateToAkfPage(); // Changed from navigateToTemplePage to navigateToAkfPage
    else if (serviceId === 'yoga') navigateToYogaStandalonePage();
    else if (serviceId === 'food') navigateToFoodPage();
    else if (serviceId === 'vastu') navigateToVastuPage();
    else if (serviceId === 'jyotish') navigateToJyotishPage();
    else if (serviceId === 'news') navigateToNewsPage(); 
    else if (serviceId === 'consult') navigateToConsultancyPage(); 
    else if (serviceId === 'shop') console.log('Shop service clicked - no page yet');
  };

  const handleSearch = async (query: string, filters: ItemCategory[] = activeFilters) => {
    setSearchQuery(query);
    setActiveFilters(filters);
    if (!query.trim() && filters.length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 300)); 

    const lowerQuery = query.toLowerCase();
    let results: SearchResultItem[] = [];

    const applyCategoryFilter = (itemCategory: ItemCategory) => {
        return filters.length === 0 || filters.includes(itemCategory);
    };

    if (applyCategoryFilter('veda')) {
        MOCK_VEDIC_TEXTS.filter(veda => veda.title.toLowerCase().includes(lowerQuery) || veda.description.toLowerCase().includes(lowerQuery))
            .forEach(veda => results.push({ 
                id: veda.id, 
                category: 'veda', 
                title: veda.title, 
                description: veda.description, 
                imageUrl: veda.imageUrl, 
                originalData: veda, 
                onClick: () => navigateToVedaReader(veda.id) 
            }));
    }
    if (applyCategoryFilter('yoga')) {
        MOCK_YOGA_PROGRAMS.filter(program => program.title.toLowerCase().includes(lowerQuery) || program.description.toLowerCase().includes(lowerQuery))
            .forEach(program => results.push({ id: program.id, category: 'yoga', title: program.title, description: program.description, imageUrl: program.image, originalData: program, onClick: () => navigateToYogaStandalonePage() }));
    }
    if (applyCategoryFilter('news')) {
        MOCK_NEWS_ARTICLES.filter(article => article.title.toLowerCase().includes(lowerQuery) || article.summary.toLowerCase().includes(lowerQuery))
            .forEach(article => results.push({ id: String(article.id), category: 'news', title: article.title, description: article.summary, imageUrl: article.image, originalData: article, onClick: () => navigateToNewsPage() }));
    }
    if (applyCategoryFilter('food')) {
        MOCK_RECIPES.filter(recipe => recipe.name.toLowerCase().includes(lowerQuery))
            .forEach(recipe => results.push({ id: recipe.id, category: 'food', title: recipe.name, description: `Cuisine: ${recipe.cuisine}, Difficulty: ${recipe.difficulty}`, imageUrl: recipe.imageUrl, originalData: recipe, onClick: () => navigateToFoodPage() }));
    }
    if (applyCategoryFilter('temple')) { // This filter might need to be renamed if 'temple' category is now AKF/Community Hub
        MOCK_TEMPLE_DESTINATIONS.filter(dest => dest.name.toLowerCase().includes(lowerQuery)) 
            .forEach(dest => results.push({ id: dest.id, category: 'temple', title: dest.name, description: `Type: ${dest.type}`, imageUrl: dest.imageUrl, originalData: dest, onClick: () => navigateToAkfPage() })); // Changed to navigateToAkfPage
    }
    if (applyCategoryFilter('vastu')) {
        MOCK_VASTU_TIPS.filter(tip => tip.title.toLowerCase().includes(lowerQuery) || tip.tips.some(t => t.toLowerCase().includes(lowerQuery)))
            .forEach(tip => results.push({ 
                id: tip.title.replace(/\s+/g, '-').toLowerCase(), 
                category: 'vastu', 
                title: tip.title, 
                description: tip.tips.join(' '), 
                originalData: { title: tip.title, category: tip.category, tips: tip.tips }, 
                onClick: () => navigateToVastuPage() 
            }));
    }
    if (applyCategoryFilter('jyotish')) {
        MOCK_JYOTISH_ITEMS.filter(item => item.sign.toLowerCase().includes(lowerQuery) || item.prediction.toLowerCase().includes(lowerQuery))
            .forEach(item => results.push({ id: item.sign.replace(/\s+/g, '-').toLowerCase(), category: 'jyotish', title: item.sign, description: item.prediction, originalData: item, onClick: () => navigateToJyotishPage() }));
    }
     if (applyCategoryFilter('consultancy')) {
        MOCK_DOCTORS.filter(doc => doc.name.toLowerCase().includes(lowerQuery) || doc.speciality.toLowerCase().includes(lowerQuery) || doc.category.toLowerCase().includes(lowerQuery))
            .forEach(doc => results.push({ 
                id: String(doc.id), 
                category: 'consultancy', 
                title: doc.name, 
                description: `${doc.speciality} - ${doc.experience}`, 
                imageUrl: doc.image, 
                originalData: doc, 
                onClick: () => navigateToConsultancyPage() 
            }));
    }

    setSearchResults(results);
    setIsSearching(false);
  };
  
  const handleApplyFilters = (newFilters: ItemCategory[]) => {
    setActiveFilters(newFilters);
    setIsFilterModalOpen(false);
    handleSearch(searchQuery, newFilters); 
  };

  const handleOpenDonationModal = (project: ProjectItem) => {
    setSelectedProjectForDonation(project);
    setIsDonationModalOpen(true);
  };

  const handleCloseDonationModal = () => {
    setIsDonationModalOpen(false);
    setSelectedProjectForDonation(null);
  };

  const filterOptions: FilterOption[] = [
    { id: 'all', name: 'All Types' },
    { id: 'veda', name: 'Vedas', icon: <LearnIcon className="w-4 h-4 mr-2 opacity-70" /> }, 
    { id: 'temple', name: 'Community Hub Items', icon: <UsersIcon className="w-4 h-4 mr-2 opacity-70" /> }, // This might need adjustment based on AKF page changes
    { id: 'news', name: 'News', icon: <NewsNavIcon className="w-4 h-4 mr-2 opacity-70" /> },
    { id: 'yoga', name: 'Yoga', icon: <YogaIcon className="w-4 h-4 mr-2 opacity-70" /> },
    { id: 'food', name: 'Food', icon: <FoodServiceIcon className="w-4 h-4 mr-2 opacity-70" /> },
    { id: 'vastu', name: 'Vastu', icon: <VastuServiceIcon className="w-4 h-4 mr-2 opacity-70" /> },
    { id: 'jyotish', name: 'Jyotish', icon: <JyotishServiceIcon className="w-4 h-4 mr-2 opacity-70" /> },
    { id: 'consultancy', name: 'Consultancy', icon: <ConsultancyIcon className="w-4 h-4 mr-2 opacity-70" /> },
  ];
  
  const appNavItems: NavItem[] = [
    { id: 'home', name: 'Home', icon: <HomeIcon />, onClick: navigateToHome },
    { id: 'learn', name: 'Learn', icon: <BottomNavLearnIcon />, onClick: navigateToLearnPage }, 
    { id: 'akf', name: 'AKF', icon: <AkfPlaceholderIcon />, onClick: navigateToAkfPage }, // Changed to navigateToAkfPage
    { id: 'news', name: 'News', icon: <NewsNavIcon />, onClick: navigateToNewsPage },
    { id: 'emergency', name: 'Emergency', icon: <EmergencyIcon />, onClick: navigateToEmergencyPage },
  ];

  const pageIdentifier = currentPage;

  if (pageIdentifier === 'settings') return <SettingsPage onNavigateBack={handleBackNavigation} />;
  if (pageIdentifier === 'userProfile') return <UserProfilePage userProfile={userProfileToDisplay} onNavigateBack={handleBackNavigation} onNavigateToSettings={navigateToSettingsPage} />;
  if (pageIdentifier === 'notifications') return <NotificationsPage onNavigateBack={handleBackNavigation} />;
  if (pageIdentifier === 'akf') return <AkfPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage} />; // Changed from TemplePage
  if (pageIdentifier === 'learnMain') return <LearnPage onNavigateHome={navigateToHome} onNavigateToAIAgent={navigateToAIAgentPage} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateFood={navigateToFoodPage} onNavigateEmergency={navigateToEmergencyPage} onNavigateTemple={navigateToAkfPage} />;
  if (pageIdentifier === 'aiAgent') return <AIAgentPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateFood={navigateToFoodPage} onNavigateEmergency={navigateToEmergencyPage} onNavigateTemple={navigateToAkfPage} />;
  if (pageIdentifier === 'news') return <NewsPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'food') return <FoodPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'emergency') return <EmergencyPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateFood={navigateToFoodPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'yogaStandalone') return <YogaPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'vastu') return <VastuPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'jyotish') return <JyotishPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'consultancy') return <ConsultancyPage onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'vedaReader' && selectedVeda) return <VedaReaderPage veda={selectedVeda} onNavigateBack={handleBackNavigation} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage}  />;
  if (pageIdentifier === 'community') return <CommunityPage onNavigateHome={navigateToHome} onNavigateToChat={navigateToChatPage} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'chatWithEntity' && selectedCommunityEntity) return <ChatPage entity={selectedCommunityEntity} onNavigateBack={handleBackNavigation} onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage} />;
  if (pageIdentifier === 'helpSupport') return <HelpSupportPage onNavigateBack={handleBackNavigation} onNavigateHome={navigateToHome} onNavigateLearn={navigateToLearnPage} onNavigateNews={navigateToNewsPage} onNavigateEmergency={navigateToEmergencyPage}  />;


  let activeBottomNavTab = 'home';
  if (['learnMain', 'aiAgent', 'yogaStandalone', 'vedaReader'].includes(currentPage)) activeBottomNavTab = 'learn';
  else if (['community', 'akf', 'consultancy', 'vastu', 'jyotish', 'food'].includes(currentPage)) activeBottomNavTab = 'akf'; // Added 'akf' here
  else if (currentPage === 'news') activeBottomNavTab = 'news';
  else if (currentPage === 'emergency') activeBottomNavTab = 'emergency';
  else if (currentPage === 'helpSupport') activeBottomNavTab = ''; // No active tab for help page via bottom nav

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans">
      <SideNavBar 
        isOpen={isSideNavOpen} 
        onClose={toggleSideNav}
        onNavigateProfile={navigateToUserProfilePage}
        onNavigateSettings={navigateToSettingsPage}
        onNavigateHelp={navigateToHelpSupportPage} // Pass navigation to Help page
        onLogout={handleLogout} 
      />
      <Header 
        onToggleSideNav={toggleSideNav} 
        onNavigateNotifications={navigateToNotificationsPage}
        onNavigateProfile={navigateToUserProfilePage}
        vedicDate={currentVedicDate}
      />
      <main className="pb-20"> 
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-light-surface dark:bg-dark-surface">
          <div 
            ref={heroScrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory h-full"
            onScroll={handleManualHeroScroll}
          >
            {MOCK_HERO_IMAGES.map((item, index) => (
              <div key={index} className="w-full flex-shrink-0 snap-center h-full bg-black">
                {item.type === 'image' || !item.videoUrl ? (
                  <img 
                    src={item.url} 
                    alt={item.altText || `Hero image ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <video
                    ref={(el: HTMLVideoElement | null) => { heroVideoRefs.current[index] = el; }}
                    src={item.videoUrl}
                    className="w-full h-full object-cover"
                    muted 
                    autoPlay={index === currentHeroSlide} 
                    loop={false} 
                    playsInline
                    onPlay={() => handleVideoEvents(index, 'play')}
                    onEnded={() => handleVideoEvents(index, 'ended')}
                    onPause={() => handleVideoEvents(index, 'pause')}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-4 py-3 bg-light-primary dark:bg-primary"> 
          <SearchBar 
            placeholderText={translate('searchPlaceholder', "Search Vedic wisdom, temples, news...")}
            onSearch={(query) => handleSearch(query)}
            onFilterClick={() => setIsFilterModalOpen(true)}
            initialQuery={searchQuery}
          />
        </div>
        
        <ServiceIcons onServiceClick={handleServiceClick} />

        {isSearching && (
            <div className="px-4 py-6 text-center text-light-text-secondary dark:text-dark-text-secondary">
                <div className="inline-block w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-2"></div>
                <p>{translate('searching', 'Searching...')}</p>
            </div>
        )}

        {!isSearching && (searchQuery.length > 0 || activeFilters.length > 0) && (
            <SearchResultsDisplay results={searchResults} onResultClick={(item) => item.onClick ? item.onClick() : console.log('Clicked search result:', item)} />
        )}

        {!isSearching && searchResults.length === 0 && searchQuery.length === 0 && activeFilters.length === 0 && (
            <>
                <VedaSection onVedaClick={navigateToVedaReader} />
                <OurProjectSection onProjectClick={handleOpenDonationModal} />
            </>
        )}

      </main>
      <BottomNavBar navItems={appNavItems} activeTabId={activeBottomNavTab} />
      
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        options={filterOptions}
        currentFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
      />
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={handleCloseDonationModal}
        project={selectedProjectForDonation}
      />
      <WelcomePopupModal
        isOpen={isWelcomePopupOpen}
        onClose={() => setIsWelcomePopupOpen(false)}
        title={translate('welcomePopupTitle', "Welcome to Vedic Wisdom!")}
        message={translate('welcomePopupMessage', "Explore ancient scriptures, connect with our community, and discover spiritual services. Your journey to enlightenment starts here.")}
        ctaText={translate('welcomePopupCta', "Explore Learn Section")}
        ctaLinkAction={navigateToLearnPage}
        imageUrl="https://images.unsplash.com/photo-1542649760-a08c40361a02?w=800&auto=format&fit=crop&q=70" 
        imageAlt="Serene temple scene"
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider> 
      <LanguageProvider>
        <AuthProvider>
          <AppController />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

const AppController: React.FC = () => {
  const { currentUser, isLoadingAuth } = useAuth();
  const { translate } = useLanguage();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 bg-light-primary dark:bg-primary flex flex-col items-center justify-center text-brand-orange">
        <svg className="animate-spin h-10 w-10 text-brand-orange mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-medium">{translate('loadingApp', 'লোড হচ্ছে...')}</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  return <AppContent />;
};

export default App;
