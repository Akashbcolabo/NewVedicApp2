
import React, { useState, useRef, useEffect } from 'react';
import { DeepSeekService } from '../services/deepseekService'; // Will use Gemini via this service
import { ChatMessage, NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { BottomNavBar } from '../components/BottomNavBar';
import PageHeader from '../components/PageHeader'; // Import PageHeader
import { 
  SendIcon, 
  ArrowLeftIcon, 
  MicIcon, 
  CameraIcon, 
  PlusCircleIcon, 
  AlertCircleIcon,
  HomeIcon,
  LearnIcon as BottomNavLearnIcon, // Alias to avoid conflict if any
  AkfPlaceholderIcon,
  NewsIcon,
  EmergencyIcon,
  StopCircleIcon
} from '../constants';
import { useTheme } from '../contexts/ThemeContext';


interface AIAgentPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void; // This function will navigate to 'learnMain' (the new LearnPage)
  onNavigateNews: () => void;
  onNavigateFood: () => void;
  onNavigateEmergency: () => void;
  onNavigateTemple: () => void;
}

const AIAgentPage: React.FC<AIAgentPageProps> = ({
  onNavigateHome,
  onNavigateLearn, // This is effectively "onBackToLearnMain" or "onNavigateToLearnTabs"
  onNavigateNews,
  onNavigateFood,
  onNavigateEmergency,
  onNavigateTemple
}) => {
  const { currentLanguage, translate } = useLanguage();
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiProvider, setAiProvider] = useState<'deepseek' | 'gemini' | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);


  useEffect(() => {
    DeepSeekService.initialize().catch(err => {
      console.error('Error initializing AI services:', err);
      setError(translate('aiServiceErrorInit', 'AI সেবা শুরু করতে সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'));
    });

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = currentLanguage.code === 'bn' ? 'bn-BD' : 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        // setIsListening(false); // onend will handle this
      };
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);
        setError(translate('voiceInputError', `Voice input error: ${event.error}. Please try typing.`));
        // setIsListening(false); // onend will handle this
      };
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognitionInstance;
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }, [currentLanguage.code, translate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
   useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = currentLanguage.code === 'bn' ? 'bn-BD' : 'en-US';
    }
  }, [currentLanguage.code]);


  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const newMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, newMessage]);
    setMessage(''); // Clear message input after capturing
    setIsLoading(true);
    setError(null);

    try {
      const response = await DeepSeekService.chat([...messages, newMessage], currentLanguage.name);
      setMessages(prev => [...prev, response]);
      if (response.provider) {
        setAiProvider(response.provider);
      }
    } catch (err: any) {
      console.error('AI Service Error:', err);
      const errorMessage = err.message || translate('aiServiceUnavailable', 'দুঃখিত, এই মুহূর্তে AI সেবা অনুপলব্ধ।');
      setError(errorMessage);
       setMessages(prev => [...prev, {role: 'assistant', content: errorMessage}]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError(translate('voiceNotSupported', 'Voice input is not supported in your browser.'));
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      // setIsListening(false); // onend handles this
    } else {
      try {
        setError(null); 
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting voice input:", err);
        setError(translate('voiceStartError', "Could not start voice input. Please check microphone permissions."));
        setIsListening(false);
      }
    }
  };

  const aiAgentPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <BottomNavLearnIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: onNavigateTemple },
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];
  
  const headerTitle = translate('aiAssistantTitle', "AI সহায়ক");
  const headerSubTitle = aiProvider ? translate('poweredBy', `Powered by ${aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)}`) : undefined;


  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary flex flex-col font-sans">
      <PageHeader title={headerTitle} onBack={onNavigateLearn} />
      {headerSubTitle && (
         <div className={`sticky top-[60px] z-40 backdrop-blur-md shadow-sm -mt-px ${theme === 'light' ? 'bg-light-surface/80 dark:bg-dark-surface/80' : 'bg-primary/80 dark:bg-black/80'}`}>
            <div className="px-4 pb-2 text-center">
                 <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{headerSubTitle}</p>
            </div>
        </div>
      )}

      <div className={`flex-1 p-4 space-y-4 overflow-y-auto pb-32 ${headerSubTitle ? 'pt-2' : 'pt-4'}`}>
        {error && !messages.find(m => m.content.includes(error)) && (
          <div className={`rounded-lg p-3 flex items-start gap-2 text-sm ${theme === 'light' ? 'bg-red-100 border border-red-300 text-red-700' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
            <AlertCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 text-white font-semibold">AI</div>
            <div className={`rounded-2xl rounded-tl-none p-3.5 shadow ${theme === 'light' ? 'bg-light-surface-alt text-light-text-primary' : 'bg-dark-surface-alt text-dark-text-primary'}`}>
              <p>{translate('aiWelcomeMessage', 'স্বাগতম! আমি আপনার AI সহায়ক। বৈদিক জ্ঞান সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।')}</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 text-white font-medium text-sm">AI</div>
            )}
            <div className={`
              ${msg.role === 'user' 
                ? 'bg-brand-blue text-white rounded-2xl rounded-tr-none' 
                : `${theme === 'light' ? 'bg-light-surface-alt text-light-text-primary' : 'bg-dark-card text-dark-text-primary'} rounded-2xl rounded-tl-none`}
              p-3 shadow-md max-w-[80%] break-words
            `}>
              <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm ${theme === 'light' ? 'bg-light-surface-alt text-light-text-secondary' : 'bg-dark-surface-alt text-dark-text-secondary'}`}>U</div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 text-white font-semibold">AI</div>
            <div className={`rounded-2xl rounded-tl-none p-4 shadow ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-card'}`}>
              <div className="flex gap-1.5 items-center">
                <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={`w-2 h-2 rounded-full animate-bounce delay-100 ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`} />
                <div className={`w-2 h-2 rounded-full animate-bounce delay-200 ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className={`fixed bottom-[60px] left-0 right-0 p-3 border-t ${theme === 'light' ? 'bg-light-surface border-light-surface-alt' : 'bg-primary border-gray-700/50'}`}>
        <div className="flex items-center gap-2">
          <button className={`p-2.5 rounded-full transition-colors ${theme === 'light' ? 'bg-light-surface-alt hover:bg-brand-orange text-light-text-secondary hover:text-white' : 'bg-dark-surface-alt hover:bg-brand-orange text-dark-text-secondary hover:text-white'}`} aria-label={translate('moreOptions', "More options")}>
            <PlusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className={`flex-1 flex items-center gap-2 rounded-full px-3.5 ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface-alt'}`}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder={translate('typeYourQuestion', "আপনার প্রশ্ন লিখুন...")}
              className={`flex-1 bg-transparent outline-none py-3 text-sm sm:text-base ${theme === 'light' ? 'text-light-text-primary placeholder-light-text-tertiary' : 'text-dark-text-primary placeholder-dark-text-tertiary'}`}
              disabled={isLoading}
              aria-label={translate('chatInputAriaLabel', "Chat message input")}
            />
            <div className="flex gap-1">
              <button onClick={handleVoiceInput} className={`p-2 rounded-full transition-colors ${isListening ? (theme === 'light' ? 'text-red-600 bg-red-100' : 'text-red-400 bg-red-500/20') : (theme === 'light' ? 'text-light-text-secondary hover:text-white hover:bg-brand-orange' : 'text-dark-text-secondary hover:text-white hover:bg-brand-orange')}`} aria-label={isListening ? translate('stopVoiceInput', "Stop voice input") : translate('startVoiceInput', "Start voice input")} disabled={!recognitionRef.current}>
                {isListening ? <StopCircleIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
              </button>
              <button className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'text-light-text-secondary hover:text-white hover:bg-brand-orange' : 'text-dark-text-secondary hover:text-white hover:bg-brand-orange'}`} aria-label={translate('attachImage', "Attach image")}>
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button 
            onClick={handleSend}
            className="p-3 bg-brand-orange rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim() || isLoading}
            aria-label={translate('sendMessage', "Send message")}
          >
            <SendIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </div>
      <BottomNavBar navItems={aiAgentPageNavItems} activeTabId="learn" />
    </div>
  );
};

export default AIAgentPage;
