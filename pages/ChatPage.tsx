
import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import { NavItem, CommunityEntity, ChatMessage } from '../types';
import { HomeIcon, LearnIcon, AkfPlaceholderIcon, NewsIcon, EmergencyIcon, SendIcon, UserProfileIcon } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';


interface ChatPageProps {
  entity: CommunityEntity;
  onNavigateBack: () => void; // To CommunityPage
  onNavigateHome: () => void;
  onNavigateLearn: () => void;
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ 
  entity, 
  onNavigateBack,
  onNavigateHome,
  onNavigateLearn,
  onNavigateNews,
  onNavigateEmergency
}) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { role: 'assistant', content: translate('chatPageWelcome', `You are now chatting with ${entity.name}. Say hello!`, { name: entity.name }) }
    ]);
  }, [entity, translate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const newMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, newMessage]);
    const currentMsg = message;
    setMessage('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages(prev => [...prev, { role: 'assistant', content: translate('chatPageMockResponse', `Received: "${currentMsg}". (This is a mock response)`, { message: currentMsg }) }]);
    setIsLoading(false);
  };
  
  const chatPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: onNavigateBack },
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];
  
  const AssistantIcon = () => {
    if (entity.avatarUrl) {
        return <img src={entity.avatarUrl} alt={entity.name} className="w-full h-full object-cover rounded-full" />;
    }
    const initial = entity.name.substring(0,1).toUpperCase();
    const charCodeSum = entity.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colors = ['bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-amber-500', 'bg-lime-500'];
    const colorClass = colors[charCodeSum % colors.length];

    return <div className={`w-full h-full rounded-full ${colorClass} flex items-center justify-center font-medium text-sm text-white`}>{initial}</div>;
  };


  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary flex flex-col font-sans">
      <PageHeader title={translate('chatWithEntityTitle', `Chat with ${entity.name}`, { name: entity.name })} onBack={onNavigateBack} />
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface'}`}>
                 <AssistantIcon />
              </div>
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
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm ${theme === 'light' ? 'bg-light-surface-alt text-light-text-secondary' : 'bg-dark-surface-alt text-dark-text-secondary'}`}>
                <UserProfileIcon className="w-5 h-5"/>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface'}`}>
                 <AssistantIcon />
            </div>
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
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={translate('chatPlaceholder', `Message ${entity.name}...`, { name: entity.name })}
            className={`flex-1 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange ${theme === 'light' ? 'bg-light-surface-alt text-light-text-primary placeholder-light-text-tertiary' : 'bg-dark-surface-alt text-dark-text-primary placeholder-dark-text-tertiary'}`}
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <button 
            onClick={handleSend}
            className="p-3 bg-brand-orange rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim() || isLoading}
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <BottomNavBar navItems={chatPageNavItems} activeTabId="akf" />
    </div>
  );
};

export default ChatPage;
