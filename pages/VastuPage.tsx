
import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import { NavItem, VastuTip, VastuExpert, VastuVideo } from '../types';
import { 
  SearchLucideIcon, FilterIcon, PlayIcon, ArrowRightIcon, StarIcon, ClockIcon, MicIcon, StopCircleIcon, XIcon, PauseIcon,
  CompassIcon, DoorOpenIcon, BedIcon, KitchenIcon, BathIcon, Plant2Icon, TempleIcon, 
  HomeIcon, LearnIcon, AkfPlaceholderIcon, NewsIcon as NewsNavIcon, EmergencyIcon, CalendarIcon
} from '../constants'; 
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';


interface VastuPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void;
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const VastuPage: React.FC<VastuPageProps> = ({ 
  onNavigateHome, 
  onNavigateLearn, 
  onNavigateNews, 
  onNavigateEmergency 
}) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const initialVastuTips: VastuTip[] = [
    {
      title: translate('vastuMainEntranceTitle', 'Main Entrance'),
      icon: <DoorOpenIcon />,
      category: 'entrance',
      tips: [
        translate('vastuTipEntrance1', 'North-East entrance is considered most auspicious for overall prosperity.'),
        translate('vastuTipEntrance2', 'Avoid obstructions like poles or large trees directly in front of the main door.'),
        translate('vastuTipEntrance3', 'The entrance door should always open inward, clockwise.'),
        translate('vastuTipEntrance4', 'Keep the entrance area well-lit and clean.')
      ]
    },
    {
      title: translate('vastuBedroomTitle', 'Bedroom'),
      icon: <BedIcon />,
      category: 'bedroom',
      tips: [
        translate('vastuTipBedroom1', 'Master bedroom should ideally be in the South-West direction.'),
        translate('vastuTipBedroom2', 'Sleep with your head pointing South or East for peaceful sleep.'),
        translate('vastuTipBedroom3', 'Avoid placing mirrors directly opposite the bed.'),
        translate('vastuTipBedroom4', 'Use calming colors for bedroom walls.')
      ]
    },
    {
      title: translate('vastuKitchenTitle', 'Kitchen'),
      icon: <KitchenIcon />,
      category: 'kitchen',
      tips: [
        translate('vastuTipKitchen1', 'The South-East corner is ideal for the kitchen (Agni corner).'),
        translate('vastuTipKitchen2', 'Cooking stove should be placed such that the cook faces East.'),
        translate('vastuTipKitchen3', 'Water source (sink, tap) should be in the North-East of the kitchen.'),
        translate('vastuTipKitchen4', 'Avoid placing the stove and sink directly opposite each other.')
      ]
    },
     {
      title: translate('vastuBathroomTitle', 'Bathroom & Toilet'),
      icon: <BathIcon />,
      category: 'bathroom',
      tips: [
        translate('vastuTipBathroom1', 'North-West is the preferred direction for bathrooms and toilets.'),
        translate('vastuTipBathroom2', 'Toilet seat should ideally face South or North.'),
        translate('vastuTipBathroom3', 'Ensure good ventilation and keep the bathroom door closed when not in use.'),
        translate('vastuTipBathroom4', 'Avoid constructing toilets in the North-East or South-West corners.')
      ]
    },
    {
      title: translate('vastuTempleRoomTitle', 'Temple Room (Pooja Room)'),
      icon: <TempleIcon />, 
      category: 'temple',
      tips: [
        translate('vastuTipTemple1', 'The North-East (Ishan Kona) is the most sacred direction for a pooja room.'),
        translate('vastuTipTemple2', 'Idols should face West or East.'),
        translate('vastuTipTemple3', 'Keep the pooja room clean, clutter-free, and well-lit.'),
        translate('vastuTipTemple4', 'Avoid placing the pooja room under a staircase or next to a bathroom.')
      ]
    }
  ];

  const initialVastuExperts: VastuExpert[] = [
    {
      id: 1,
      name: 'Dr. Acharya Vinod Shastri',
      speciality: translate('vastuAndVedicAstrology', 'Vastu & Vedic Astrology'),
      experience: translate('experience20Years', '20 years'),
      rating: 4.9,
      price: '₹2000',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=60',
      nextAvailable: translate('availableNow', 'Available Now')
    },
    {
      id: 2,
      name: 'Smt. Radhika Sharma',
      speciality: translate('residentialCommercialVastu', 'Residential & Commercial Vastu'),
      experience: translate('experience15Years', '15 years'),
      rating: 4.8,
      price: '₹1500',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=60',
      nextAvailable: translate('tomorrow10AM', 'Tomorrow, 10 AM')
    }
  ];
  
  const vastuVideosData: VastuVideo[] = [
    {
      id: 1,
      title: translate('vastuPrinciplesVideoTitle', 'Introduction to Vastu Shastra Principles'),
      duration: '15:30',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', 
      views: '1.2M'
    },
    {
      id: 2,
      title: translate('homeOfficeVastuVideoTitle', 'Vastu Guidelines for a Prosperous Home Office'),
      duration: '12:45',
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60',
      videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', 
      views: '850K'
    }
  ];


  const [filteredTips, setFilteredTips] = useState<VastuTip[]>(initialVastuTips);
  const [filteredExperts, setFilteredExperts] = useState<VastuExpert[]>(initialVastuExperts);
  const [videoStates, setVideoStates] = useState<Map<number, {isPlaying: boolean}>>(new Map());
  const videoRefs = useRef<Map<number, HTMLVideoElement | null>>(new Map());

  useEffect(() => {
    const initialStates = new Map<number, {isPlaying: boolean}>();
    vastuVideosData.forEach(video => initialStates.set(video.id, {isPlaying: false}));
    setVideoStates(initialStates);
  }, []);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognitionInstance;
    }
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    
    setFilteredTips(
      initialVastuTips.filter(tip => 
        (selectedCategory === 'all' || tip.category === selectedCategory) &&
        (!query || tip.title.toLowerCase().includes(query) || tip.tips.some(t => t.toLowerCase().includes(query)))
      )
    );

    setFilteredExperts(
      initialVastuExperts.filter(expert =>
        !query || expert.name.toLowerCase().includes(query) || expert.speciality.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, selectedCategory, initialVastuTips, initialVastuExperts, translate]); // Added translate to dependencies

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert(translate('voiceNotSupported', 'Speech recognition is not supported in this browser.'));
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

  const handleVideoPlayToggle = (videoId: number) => {
    const currentVideoRef = videoRefs.current.get(videoId);
    if (!currentVideoRef) return;

    const isCurrentlyPlaying = videoStates.get(videoId)?.isPlaying || false;

    // Pause other videos if we are about to play this one.
    if (!isCurrentlyPlaying) {
        videoRefs.current.forEach((ref, id) => {
            if (id !== videoId && ref && !ref.paused) {
                ref.pause();
                setVideoStates(prev => new Map(prev).set(id, { isPlaying: false }));
            }
        });
    }
    
    if (isCurrentlyPlaying) {
        currentVideoRef.pause();
        setVideoStates(prev => new Map(prev).set(videoId, { isPlaying: false }));
    } else {
        currentVideoRef.play().catch(error => console.error("Error playing video:", error));
        setVideoStates(prev => new Map(prev).set(videoId, { isPlaying: true }));
    }
  };

  const vastuPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => {} },
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];
  
  const vastuCategories = [
    { id: 'all', name: translate('allCategory', 'All'), icon: <CompassIcon /> },
    { id: 'entrance', name: translate('vastuMainEntranceTitle', 'Entrance'), icon: <DoorOpenIcon /> },
    { id: 'bedroom', name: translate('vastuBedroomTitle', 'Bedroom'), icon: <BedIcon /> },
    { id: 'kitchen', name: translate('vastuKitchenTitle', 'Kitchen'), icon: <KitchenIcon /> },
    { id: 'bathroom', name: translate('vastuBathroomTitle', 'Bathroom'), icon: <BathIcon /> },
    { id: 'temple', name: translate('vastuTempleRoomTitle', 'Temple'), icon: <TempleIcon /> },
    { id: 'garden', name: translate('vastuGardenTitle', 'Garden'), icon: <Plant2Icon /> },
  ];

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans pb-20">
      <PageHeader title={translate('vastuShastraTitle', "Vastu Shastra")} onBack={onNavigateHome}/>
      
      <div className={`p-4 space-y-4 sticky top-[60px] z-30 ${theme === 'light' ? 'bg-light-primary dark:bg-dark-primary' : 'bg-primary dark:bg-black'}`}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <SearchLucideIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange" />
            <input
              type="text"
              placeholder={translate('searchVastuPlaceholder', "Search Vastu tips, experts...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange ${theme === 'light' ? 'bg-light-surface text-light-text-primary placeholder-light-text-tertiary' : 'bg-dark-surface-alt text-dark-text-primary placeholder-dark-text-tertiary'}`}
            />
            <button
              onClick={handleVoiceSearch}
              aria-label={isListening ? translate('stopVoiceSearch', "Stop voice search") : translate('startVoiceSearch', "Start voice search")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-brand-orange hover:text-opacity-80'}`}
              disabled={!recognitionRef.current}
            >
              {isListening ? <StopCircleIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
            </button>
          </div>
          <button className={`px-4 rounded-lg flex items-center gap-2 transition-colors ${theme === 'light' ? 'bg-light-surface text-light-text-secondary hover:bg-gray-200' : 'bg-dark-surface-alt text-dark-text-secondary hover:text-dark-text-primary hover:bg-gray-700'}`}
            onClick={() => alert(translate('filterComingSoon', 'Filter functionality coming soon!'))}
          >
            <FilterIcon className="w-5 h-5" /> <span className="hidden sm:inline">{translate('filterButton', 'Filter')}</span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {vastuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full whitespace-nowrap text-xs sm:text-sm transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-opacity-50 flex items-center ${
                selectedCategory === category.id
                  ? 'bg-brand-orange text-white font-semibold'
                  : `${theme === 'light' ? 'bg-light-surface-alt text-light-text-secondary hover:bg-gray-200' : 'bg-dark-surface-alt text-dark-text-secondary hover:bg-gray-700 hover:text-dark-text-primary'}`
              }`}
            >
              {React.cloneElement(category.icon, {className: `w-4 h-4 mr-1.5 ${selectedCategory === category.id ? 'text-white': (theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary')}`})}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4 pt-0 space-y-6">
        <section>
          <h2 className={`text-lg font-semibold mb-3 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('vastuVideosTitle', 'Vastu Videos')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vastuVideosData.map((video) => (
              <div key={video.id} className={`rounded-lg overflow-hidden shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                <div className="relative">
                  <video
                    ref={el => { videoRefs.current.set(video.id, el); }}
                    src={video.videoUrl}
                    poster={video.thumbnail}
                    className="w-full h-40 object-cover"
                    preload="metadata"
                    onPlay={() => setVideoStates(prev => new Map(prev).set(video.id, { isPlaying: true }))}
                    onPause={() => setVideoStates(prev => new Map(prev).set(video.id, { isPlaying: false }))}
                    onEnded={() => setVideoStates(prev => new Map(prev).set(video.id, { isPlaying: false }))}
                    playsInline 
                  />
                  <button
                    onClick={() => handleVideoPlayToggle(video.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-opacity"
                    aria-label={videoStates.get(video.id)?.isPlaying ? translate('pauseVideo', 'Pause Video') : translate('playVideo', 'Play Video')}
                  >
                    {videoStates.get(video.id)?.isPlaying ? <PauseIcon className="w-10 h-10 text-white/80" /> : <PlayIcon className="w-10 h-10 text-white/80" />}
                  </button>
                </div>
                <div className="p-3">
                  <h3 className={`font-medium text-sm truncate mb-1 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`} title={video.title}>{video.title}</h3>
                  <div className={`flex justify-between items-center text-xs ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                    <span>{video.duration}</span>
                    <span>{video.views} {translate('views', 'views')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('popularVastuTipsTitle', 'Popular Vastu Tips')}</h2>
          {filteredTips.length > 0 ? (
            <div className="space-y-3">
              {filteredTips.map((tip, index) => (
                <details key={index} className={`rounded-lg shadow-md overflow-hidden ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                  <summary className={`p-3 cursor-pointer flex items-center gap-3 transition-colors hover:bg-opacity-80 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}>
                    {React.cloneElement(tip.icon, { className: `w-6 h-6 text-brand-orange`})}
                    <span className={`font-medium text-sm ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{tip.title}</span>
                    <ArrowRightIcon className="w-4 h-4 ml-auto transform transition-transform details-arrow" />
                  </summary>
                  <div className={`p-3 border-t text-xs space-y-1.5 ${theme === 'light' ? 'border-gray-200 text-light-text-secondary bg-light-surface-alt/50' : 'border-gray-700 text-dark-text-secondary bg-dark-surface/50'}`}>
                    {tip.tips.map((t, i) => <p key={i}>{t}</p>)}
                  </div>
                </details>
              ))}
            </div>
          ) : (
             <p className={`text-center py-6 text-sm ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('noVastuTipsFound', 'No Vastu tips found for "{searchTermOrCategory}".', { searchTermOrCategory: searchQuery || selectedCategory})}</p>
          )}
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('vastuExpertsTitle', 'Vastu Experts')}</h2>
          {filteredExperts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExperts.map((expert) => (
                <div key={expert.id} className={`rounded-lg p-3 shadow-lg flex gap-3 ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                  <img src={expert.image} alt={expert.name} className="w-20 h-20 rounded-md object-cover"/>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{expert.name}</h3>
                    <p className="text-xs text-brand-orange mb-0.5">{expert.speciality}</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{expert.experience}</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                        <StarIcon className="w-3 h-3 text-yellow-400" /> <span className={`${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{expert.rating}</span>
                        <span className={`mx-1 ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}`}>|</span>
                        <span className={`${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{expert.price}</span>
                    </div>
                    <button className={`mt-2 text-xs px-3 py-1 rounded-md text-white transition-colors ${theme === 'light' ? 'bg-brand-blue hover:bg-blue-600' : 'bg-brand-blue hover:bg-blue-500'}`}>
                        {translate('bookAppointmentButton', 'Book Appointment')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center py-6 text-sm ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('noVastuExpertsFound', 'No Vastu experts found for "{searchTerm}".', {searchTerm: searchQuery})}</p>
          )}
        </section>
      </main>
      <BottomNavBar navItems={vastuPageNavItems} activeTabId="akf" />
    </div>
  );
};

export default VastuPage;

<style>
  {`
    details summary::-webkit-details-marker {
      display: none;
    }
    details[open] .details-arrow {
      transform: rotate(90deg);
    }
  `}
</style>
