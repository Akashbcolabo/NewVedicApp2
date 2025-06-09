
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase'; // Keep for potential future use
import { YogaProgram, NavItem } from '../types';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import { 
    SearchLucideIcon, XIcon as ClearSearchIcon, MicIcon, StopCircleIcon, CalendarIcon, MoveIcon,
    HomeIcon, LearnIcon, AkfPlaceholderIcon, NewsIcon as NewsNavIcon, EmergencyIcon
} from '../constants';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage

// Declare comprehensive SpeechRecognition types for window object and global scope
declare global {
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
    // For compatibility with some older implementations or type definitions
    readonlyemma?: any; 
    readonly interpretation?: any;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  // Use SpeechRecognitionErrorEvent for the onerror handler
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode; // More specific type for error codes
    readonly message: string; 
  }

  // Standard SpeechRecognitionError codes
  type SpeechRecognitionErrorCode =
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported';


  interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    grammars: SpeechGrammarList;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI?: string; 

    start(): void;
    stop(): void;
    abort(): void;

    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  }

  interface SpeechGrammarList {
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    readonly length: number;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
  }
  interface SpeechGrammar {
    src: string;
    weight: number;
  }

  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}

interface YogaPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void; // Navigates to the main multi-tab LearnPage
  onNavigateNews: () => void; 
  onNavigateEmergency: () => void; 
}

const YogaPage: React.FC<YogaPageProps> = ({ onNavigateHome, onNavigateLearn, onNavigateNews, onNavigateEmergency }) => {
  const { theme } = useTheme(); // Get theme
  const { translate } = useLanguage(); // Get translate function

  const [searchQuery, setSearchQuery] = useState('');
  const [initialYogaPrograms, setInitialYogaPrograms] = useState<YogaProgram[]>([
    {
      id: '1',
      title: 'Morning Flow Yoga',
      description: 'Start your day with energizing yoga poses for all.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60',
      level: 'beginner',
      duration: '30 min',
      instructor: 'Sarah Johnson',
      category: 'Hatha Yoga'
    },
    {
      id: '2',
      title: 'Power Vinyasa',
      description: 'Dynamic and challenging flow sequence to build strength.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60',
      level: 'advanced',
      duration: '60 min',
      instructor: 'Michael Chen',
      category: 'Vinyasa'
    },
    {
      id: '3',
      title: 'Gentle Yoga',
      description: 'Relaxing and restorative practice to calm the mind.',
      image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&auto=format&fit=crop&q=60',
      level: 'beginner',
      duration: '45 min',
      instructor: 'Emily Parker',
      category: 'Restorative'
    },
    {
      id: '4',
      title: 'Intermediate Flow',
      description: 'Balance strength and flexibility with this engaging flow.',
      image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&auto=format&fit=crop&q=60',
      level: 'intermediate',
      duration: '45 min',
      instructor: 'David Wilson',
      category: 'Vinyasa'
    },
    {
      id: '5',
      title: 'Advanced Ashtanga',
      description: 'Traditional Ashtanga sequence for experienced yogis.',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=60',
      level: 'advanced',
      duration: '90 min',
      instructor: 'Anna Martinez',
      category: 'Ashtanga'
    },
    {
      id: '6',
      title: 'Meditation & Yoga',
      description: 'Mindful movement and meditation for inner peace.',
      image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&auto=format&fit=crop&q=60',
      level: 'beginner',
      duration: '40 min',
      instructor: 'Sarah Johnson',
      category: 'Mindful'
    }
  ]);
  const [filteredPrograms, setFilteredPrograms] = useState<YogaProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

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
        console.error('Speech recognition error:', event.error, event.message);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognitionInstance;
    } else {
      console.warn('Speech recognition not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
        setFilteredPrograms(initialYogaPrograms);
        setIsLoading(false);
    }, 500);
  }, [initialYogaPrograms]);

  useEffect(() => {
    const filterPrograms = () => {
      let filtered = [...initialYogaPrograms];
      const query = searchQuery.toLowerCase();

      if (query) {
        filtered = filtered.filter(program => 
          program.title.toLowerCase().includes(query) ||
          program.description.toLowerCase().includes(query) ||
          program.instructor.toLowerCase().includes(query) ||
          program.category.toLowerCase().includes(query)
        );
      }

      if (selectedLevel !== 'all') {
        filtered = filtered.filter(program => program.level === selectedLevel);
      }
      setFilteredPrograms(filtered);
    };

    if (!isLoading) { 
        filterPrograms();
    }
  }, [searchQuery, selectedLevel, initialYogaPrograms, isLoading]);


  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported or not initialized.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  const levels = [
    { id: 'all', name: translate('allLevels', 'All Levels') },
    { id: 'beginner', name: translate('beginnerLevel', 'Beginner') },
    { id: 'intermediate', name: translate('intermediateLevel', 'Intermediate') },
    { id: 'advanced', name: translate('advancedLevel', 'Advanced') }
  ];
  
  const yogaPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => console.log('AKF clicked from Yoga Page') },
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans">
      <PageHeader title={translate('yogaProgramsTitle', "Yoga Programs")} onBack={onNavigateHome} />

      <main className="pb-24 px-4 pt-4"> 
        <div className="relative mb-6"> 
          <div className={`rounded-full flex items-center px-3 py-2 shadow-md ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-surface'}`}>
            <SearchLucideIcon className="w-4 h-4 text-brand-orange mr-2" />
            <input
              type="text"
              placeholder={translate('searchYogaPlaceholder', "Search yoga programs...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent w-full outline-none text-light-text-primary dark:text-dark-text-primary placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary text-sm`}
              aria-label="Search yoga programs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className={`p-1.5 text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-orange dark:hover:text-brand-orange`}
              >
                <ClearSearchIcon className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleVoiceSearch}
              aria-label={isListening ? translate('stopVoiceSearch', "Stop voice search") : translate('startVoiceSearch', "Start voice search")}
              className={`p-1.5 -mr-1 rounded-full transition-colors ${
                isListening ? 'text-red-500 animate-pulse' : 'text-brand-orange hover:text-opacity-80'
              }`}
              disabled={!recognitionRef.current} 
            >
              {isListening ? (
                <StopCircleIcon className="w-5 h-5" />
              ) : (
                <MicIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {isListening && (
            <div className={`absolute inset-x-0 top-full mt-2 rounded-lg p-3 text-center shadow ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface-alt'}`}>
              <div className={`flex items-center justify-center gap-2 text-xs ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span>{translate('listening', 'Listening...')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-4 px-4">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-opacity-50 ${
                selectedLevel === level.id
                  ? 'bg-brand-orange text-white font-semibold'
                  : `${theme === 'light' ? 'bg-light-surface-alt text-light-text-secondary hover:bg-gray-200 hover:text-light-text-primary' : 'bg-dark-surface-alt text-dark-text-secondary hover:bg-gray-700 hover:text-dark-text-primary'}`
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-light-text-primary dark:text-dark-text-primary text-xl font-bold`}>{translate('yogaProgramsTitle', 'Yoga Programs')}</h2>
            <div className="flex gap-3">
              <CalendarIcon className="text-brand-orange w-5 h-5 cursor-pointer hover:text-opacity-80" />
              <MoveIcon className="text-brand-orange w-5 h-5 cursor-pointer hover:text-opacity-80" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`animate-pulse p-3 rounded-lg ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface-alt'}`}>
                  <div className={`h-32 rounded-lg mb-3 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`} />
                  <div className={`h-4 w-3/4 rounded mb-2 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`} />
                  <div className={`h-3 w-1/2 rounded mb-2 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`} />
                  <div className={`h-3 w-1/3 rounded ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`} />
                </div>
              ))
            ) : filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <div key={program.id} className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-brand-orange/20 dark:hover:shadow-brand-orange/30 hover:transform hover:-translate-y-1 ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-surface-alt'}`}>
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className={`font-semibold text-base text-light-text-primary dark:text-dark-text-primary mb-1.5 truncate`} title={program.title}>{program.title}</h3>
                    <p className={`text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3 h-10 overflow-hidden line-clamp-2`}>{program.description}</p>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        program.level === 'beginner' ? (theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-300') :
                        program.level === 'intermediate' ? (theme === 'light' ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500/20 text-yellow-300') :
                        (theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-300')
                      }`}>
                        {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                      </span>
                      <span className={`text-light-text-secondary dark:text-dark-text-secondary`}>{program.duration}</span>
                    </div>
                    <div className={`mt-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary`}>
                      By: <span className={`font-medium text-light-text-secondary dark:text-dark-text-secondary`}>{program.instructor}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`sm:col-span-2 text-center py-10 text-light-text-tertiary dark:text-dark-text-tertiary`}>
                <p className="text-lg mb-2">(╥_╥)</p>
                <p>{translate('noYogaProgramsFound', 'No yoga programs found matching your criteria.')}</p>
                <p className="text-sm mt-1">{translate('tryAdjustingSearchOrFilters', 'Try adjusting your search or filters.')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavBar navItems={yogaPageNavItems} activeTabId="learn" />
    </div>
  );
}

export default YogaPage;
