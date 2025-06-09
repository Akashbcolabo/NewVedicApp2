import React, { useState, useEffect, useRef } from 'react';
import {
  SearchLucideIcon,
  XIcon,
  MessageSquareIcon,
  Trash2Icon,
  HomeIcon, 
  LearnIcon as LearnNavIcon, 
  AkfPlaceholderIcon, 
  NewsIcon as NewsNavIcon, 
  EmergencyIcon as EmergencyNavIcon,
  ClockIcon,
  SendIcon, 
  SendRequestIcon, // Added import
  CheckCircleIcon as AcceptIcon,
  XCircleIcon as DeclineIcon,
  UserProfileIcon,
  LandmarkIcon,
  TempleIcon,
  SchoolIcon, 
  QuestionMarkIcon,
  ExternalLinkIcon,
  LoaderIcon 
} from '../constants';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar'; 
import { NavItem, CommunityEntity, ChatMessage as AppChatMessage, CommunityEntityType } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MOCK_CONTACTED_PROFILES, MOCK_CHAT_HISTORY, MOCK_COMMUNITY_USERS, MOCK_COMMUNITY_ORGANIZATIONS, MOCK_TEMPLE_DESTINATIONS } from '../mockData';

interface ChatMessage extends AppChatMessage {
  timestamp?: number; 
}

interface AkfPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void;
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const allSearchableEntities: CommunityEntity[] = [
  ...MOCK_COMMUNITY_USERS.map(u => ({ ...u, type: 'user' as CommunityEntityType, description: u.description || 'Vedic Community User' })),
  ...MOCK_COMMUNITY_ORGANIZATIONS.map(o => ({ ...o, type: 'organization' as CommunityEntityType, description: o.description || 'Community Organization' })),
  ...MOCK_TEMPLE_DESTINATIONS.map(t => ({ id: t.id, name: t.name, type: 'temple' as CommunityEntityType, avatarUrl: t.imageUrl, description: t.type })),
  { id: 'gurukul1', name: 'Ananda Vedic Gurukul', type: 'organization' as CommunityEntityType, avatarUrl: 'https://images.unsplash.com/photo-1542649760-a08c40361a02?w=100&h=100&fit=crop&q=60&seed=gurukul1', description: 'Traditional Vedic Education Center' },
  { id: 'gurukul2', name: 'Patanjali Yoga Gurukul', type: 'organization' as CommunityEntityType, avatarUrl: 'https://images.unsplash.com/photo-1593697821039-551595cb450b?w=100&h=100&fit=crop&q=60&seed=gurukul2', description: 'Yoga and Philosophy Studies' },
];

const WEBSITE_URL = "https://www.akfbd.org";


const AkfPage: React.FC<AkfPageProps> = ({
  onNavigateHome,
  onNavigateLearn,
  onNavigateNews,
  onNavigateEmergency,
}) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CommunityEntity[]>([]);
  
  const [contactedProfiles, setContactedProfiles] = useState<CommunityEntity[]>(MOCK_CONTACTED_PROFILES);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(MOCK_CHAT_HISTORY);

  const [incomingRequests, setIncomingRequests] = useState<CommunityEntity[]>([
    { id: 'new_user_request_1', name: 'Aisha Khan', type: 'user', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=60', description: 'Wants to connect about scriptures.'},
    { id: 'new_org_request_1', name: 'Vedic Heritage Foundation', type: 'organization', avatarUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=100&h=100&fit=crop&q=60', description: 'Collaboration inquiry.'},
  ]);
  const [sentRequests, setSentRequests] = useState<string[]>([]); 
  const [requestStatusMessage, setRequestStatusMessage] = useState<string | null>(null);

  const [selectedProfile, setSelectedProfile] = useState<CommunityEntity | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>([]);
  const [messageTimers, setMessageTimers] = useState<Record<string, ReturnType<typeof setTimeout>>>({});
  
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);


  const [showWebsiteConfirmDialog, setShowWebsiteConfirmDialog] = useState(false);
  const [showInAppBrowser, setShowInAppBrowser] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      Object.values(messageTimers).forEach(clearTimeout);
    };
  }, [messageTimers]);
  
  useEffect(() => {
    if (selectedProfile && activeChatMessages.length > 0) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatMessages, selectedProfile]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = allSearchableEntities.filter(entity =>
      entity.name.toLowerCase().includes(lowerQuery) ||
      (entity.description && entity.description.toLowerCase().includes(lowerQuery)) ||
      entity.id.toLowerCase().includes(lowerQuery)
    ).filter(entity => !contactedProfiles.some(cp => cp.id === entity.id) && !incomingRequests.some(ir => ir.id === entity.id) ); 
    setSearchResults(filtered);
  };

  const handleSendMessageRequest = (entity: CommunityEntity) => {
    if (sentRequests.includes(entity.id)) return; 

    setSentRequests(prev => [...prev, entity.id]);
    setRequestStatusMessage(translate('messageRequestSent', `Message request sent to ${entity.name}.`, { name: entity.name }));
    setTimeout(() => setRequestStatusMessage(null), 3000); 
  };
  
  const handleAcceptRequest = (entityId: string) => {
    const requestToAccept = incomingRequests.find(r => r.id === entityId);
    if (requestToAccept) {
      setContactedProfiles(prev => [requestToAccept, ...prev.filter(p => p.id !== entityId)]);
      setIncomingRequests(prev => prev.filter(r => r.id !== entityId));
      setChatHistory(prev => ({
        ...prev,
        [entityId]: [{ role: 'assistant', content: translate('requestAcceptedStartChat', `You accepted the message request from ${requestToAccept.name}. You can now chat.`, {name: requestToAccept.name}), timestamp: Date.now() }]
      }));
    }
  };

  const handleDeclineRequest = (entityId: string) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== entityId));
  };


  const handleProfileClick = (profile: CommunityEntity) => {
    setSelectedProfile(profile);
    const history = chatHistory[profile.id] || [];
    // Filter out any auto-cleared messages before displaying
    const currentDisplayableMessages = history.filter(msg => msg.content !== translate('messageAutoCleared', "Message has been automatically cleared."));
    const messagesWithTimestamp = currentDisplayableMessages.map(msg => ({...msg, timestamp: msg.timestamp || Date.now()}));
    
    setActiveChatMessages(messagesWithTimestamp.length > 0 ? messagesWithTimestamp : [{ role: 'assistant', content: translate('startTypingToChat', `You can start typing to chat with ${profile.name}.`, {name: profile.name}), timestamp: Date.now() }]);


    if (messageTimers[profile.id]) clearTimeout(messageTimers[profile.id]);

    const timerId = setTimeout(() => {
      setActiveChatMessages([{ role: 'assistant', content: translate('messageAutoCleared', "Message has been automatically cleared."), timestamp: Date.now() }]);
      // Optionally clear chatHistory as well, or keep it but show cleared message in activeChat
       setChatHistory(prev => ({
        ...prev,
        [profile.id]: [{ role: 'assistant', content: translate('messageAutoCleared', "Message has been automatically cleared."), timestamp: Date.now() }]
      }));
    }, 60000); 
    setMessageTimers(prev => ({ ...prev, [profile.id]: timerId }));
  };
  
  const resetAutoClearTimer = (profileId: string) => {
    if (messageTimers[profileId]) {
      clearTimeout(messageTimers[profileId]);
    }
    const newTimerId = setTimeout(() => {
      setActiveChatMessages([{ role: 'assistant', content: translate('messageAutoCleared', "Message has been automatically cleared."), timestamp: Date.now() }]);
       setChatHistory(prev => ({
        ...prev, 
        [profileId]: [{ role: 'assistant', content: translate('messageAutoCleared', "Message has been automatically cleared."), timestamp: Date.now() }]
      }));
    }, 60000); // 60 seconds
    setMessageTimers(prev => ({ ...prev, [profileId]: newTimerId })); 
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProfile || isSending) return;
  
    setIsSending(true);
    const userMessage: ChatMessage = { role: 'user', content: newMessage, timestamp: Date.now() };
  
    // If current active message is "start typing", replace it. Otherwise, append.
    setActiveChatMessages(prev => {
        const isPlaceholder = prev.length === 1 && prev[0].content.startsWith(translate('startTypingToChat', `You can start typing to chat with`, {name: ''}).substring(0,10)); // Check first few words
        return isPlaceholder ? [userMessage] : [...prev, userMessage];
    });
    
    // Filter out placeholder from history before adding new message
    setChatHistory(prev => {
        const currentHistory = (prev[selectedProfile.id] || []).filter(m => m.content !== translate('messageAutoCleared', "Message has been automatically cleared.") && !m.content.startsWith(translate('startTypingToChat', `You can start typing to chat with`, {name: ''}).substring(0,10)) );
        return {
            ...prev,
            [selectedProfile.id]: [...currentHistory, userMessage]
        };
    });
  
    const currentMessageText = newMessage;
    setNewMessage(''); 
  
    resetAutoClearTimer(selectedProfile.id);
  
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
    const assistantReply: ChatMessage = {
      role: 'assistant',
      content: translate('akfChatMockReply', `I received your message: "${currentMessageText}". This is an automated AKF Hub reply.`, { message: currentMessageText }),
      timestamp: Date.now()
    };
    setActiveChatMessages(prev => [...prev, assistantReply]);
    setChatHistory(prev => ({
      ...prev,
      [selectedProfile.id]: [...(prev[selectedProfile.id] || []).filter(m => m.content !== translate('messageAutoCleared', "Message has been automatically cleared.")), assistantReply]
    }));
    
    resetAutoClearTimer(selectedProfile.id);
    setIsSending(false);
  };


  const handleDeleteProfile = (profileId: string) => {
    const profileName = contactedProfiles.find(p=>p.id === profileId)?.name || 'this user';
    if (window.confirm(translate('confirmProfileDelete', `Are you sure you want to delete the chat with ${profileName}? This action cannot be undone.`, { name: profileName }))) {
        setContactedProfiles(prev => prev.filter(p => p.id !== profileId));
        setChatHistory(prev => {
            const newHistory = {...prev};
            delete newHistory[profileId];
            return newHistory;
        });
        if (selectedProfile?.id === profileId) {
            setSelectedProfile(null);
            setActiveChatMessages([]);
        }
        if (messageTimers[profileId]) {
            clearTimeout(messageTimers[profileId]);
            setMessageTimers(prev => {
                const newTimers = {...prev};
                delete newTimers[profileId];
                return newTimers;
            });
        }
    }
  };

  const closeChatView = () => {
    if (selectedProfile && messageTimers[selectedProfile.id]) {
        clearTimeout(messageTimers[selectedProfile.id]);
         setMessageTimers(prev => {
            const newTimers = {...prev};
            if (selectedProfile) delete newTimers[selectedProfile.id];
            return newTimers;
        });
    }
    setSelectedProfile(null);
    setActiveChatMessages([]);
  };
  
  const getIconForEntityType = (type: CommunityEntityType) => {
    const iconClassName = `w-6 h-6 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`;
    switch(type) {
        case 'user': return <UserProfileIcon className={iconClassName} />;
        case 'organization':
            // Example: if description or name indicates Gurukul, use SchoolIcon
            // This is a simple check, you might need more robust logic
            // For this example, assume if "gurukul" is in description (case-insensitive)
            // if (entity?.description?.toLowerCase().includes('gurukul')) {
            //     return <SchoolIcon className={iconClassName} />;
            // } // This check needs entity passed or type refined
            return <LandmarkIcon className={iconClassName} />;
        case 'temple': return <TempleIcon className={iconClassName} />;
        default: return <QuestionMarkIcon className={iconClassName} />;
    }
  };

  const handleVisitWebsiteConfirm = () => {
    setShowWebsiteConfirmDialog(false);
    setShowInAppBrowser(true);
  };

  const akfPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnNavIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => {} }, 
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyNavIcon />, onClick: onNavigateEmergency },
  ];

  const renderContent = () => {
    if (showInAppBrowser) {
      return (
        <div className="h-full flex flex-col">
          <div className={`p-3 flex items-center justify-between border-b ${theme === 'light' ? 'bg-light-surface-alt border-gray-200' : 'bg-dark-surface border-gray-700'}`}>
            <span className={`text-sm font-semibold ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('viewingWebsiteTitle', 'Viewing AKFBD.ORG')}</span>
            <button onClick={() => setShowInAppBrowser(false)} className={`p-1.5 rounded-full ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`} aria-label={translate('closeInAppBrowserAria', 'Close website view')}>
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <iframe src={WEBSITE_URL} title="AKFBD.ORG Website" className="w-full h-full flex-1 border-0" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
        </div>
      );
    }

    if (selectedProfile) {
      return (
        <div className="h-full flex flex-col">
          <div className={`p-3 flex items-center justify-between border-b ${theme === 'light' ? 'bg-light-surface-alt border-gray-200' : 'bg-dark-surface border-gray-700'}`}>
              <div className="flex items-center gap-2">
                  {selectedProfile.avatarUrl ? (
                      <img src={selectedProfile.avatarUrl} alt={selectedProfile.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${theme === 'light' ? 'bg-gray-300 text-gray-700' : 'bg-gray-600 text-gray-100'}`}>
                          {selectedProfile.name.substring(0,1).toUpperCase()}
                      </div>
                  )}
                  <span className={`text-sm font-semibold ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{selectedProfile.name}</span>
              </div>
            <button onClick={closeChatView} className={`p-1.5 rounded-full ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`} aria-label="Close chat">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {activeChatMessages.map((msg, index) => (
              <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-2.5 rounded-lg shadow text-xs ${msg.role === 'user' ? 'bg-brand-blue text-white rounded-br-none' : `${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-dark-card text-gray-200'} rounded-bl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
            {activeChatMessages.length === 0 && ( 
              <p className={`text-center text-xs py-4 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>
                {translate('noMessagesInChat', 'No messages in this chat or they have been cleared.')}
              </p>
            )}
          </div>
          {/* Message Input Area */}
          <div className={`p-2 border-t ${theme === 'light' ? 'bg-light-surface border-gray-200' : 'bg-dark-surface border-gray-700'}`}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={translate('typeMessagePlaceholder', 'Type a message...')}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange 
                            ${theme === 'light' ? 'bg-gray-100 text-gray-800 placeholder-gray-500' : 'bg-gray-700 text-gray-200 placeholder-gray-400'}`}
                disabled={isSending}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                aria-label={translate('chatInputAriaLabel', 'Chat message input')}
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                className="p-2.5 bg-brand-orange text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-60"
                aria-label={translate('sendMessageButtonAria', 'Send message')}
              >
                {isSending ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
           <div className={`p-2 border-t ${theme === 'light' ? 'bg-light-surface border-gray-200' : 'bg-dark-surface border-gray-700'}`}>
              <p className={`text-center text-[10px] ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <ClockIcon className="w-2.5 h-2.5 inline mr-1" /> {translate('messagesAutoDeleteNote', 'Messages are for temporary viewing and will be cleared automatically.')}
              </p>
          </div>
        </div>
      );
    }

    if (searchQuery.trim() !== '') {
      return (
        <div className="p-3 space-y-2">
            {searchResults.length > 0 ? (
                searchResults.map(entity => (
                    <div key={entity.id} className={`p-2.5 rounded-lg flex items-center gap-3 ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                         {entity.avatarUrl ? (
                            <img src={entity.avatarUrl} alt={entity.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                                {getIconForEntityType(entity.type)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{entity.name}</p>
                            <p className={`text-xs capitalize truncate ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{entity.description || entity.type}</p>
                        </div>
                        <button 
                            onClick={() => handleSendMessageRequest(entity)}
                            disabled={sentRequests.includes(entity.id)}
                            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                                ${sentRequests.includes(entity.id) 
                                    ? `${theme === 'light' ? 'bg-gray-200 text-gray-500' : 'bg-gray-600 text-gray-400'}`
                                    : `${theme === 'light' ? 'bg-brand-blue text-white hover:bg-opacity-90' : 'bg-brand-blue text-white hover:bg-opacity-90'}`
                                }`}
                        >
                            {sentRequests.includes(entity.id) ? translate('requestSentButton', 'Request Sent') : <SendRequestIcon className="w-3.5 h-3.5 inline mr-1" />}{sentRequests.includes(entity.id) ? '' : translate('sendMessageRequestButton', 'Message Request')}
                        </button>
                    </div>
                ))
            ) : (
                 <p className={`text-center text-sm py-8 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('noEntitiesMatchSearch', 'No entities match your search.')}</p>
            )}
        </div>
      );
    }

    return (
      <>
          {/* Incoming Message Requests Section */}
          <div className="p-3">
              <h3 className={`text-sm font-semibold mb-2 px-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('incomingRequestsTitle', 'Incoming Message Requests')}</h3>
              {incomingRequests.length > 0 ? (
                  incomingRequests.map(request => (
                      <div key={request.id} className={`p-2.5 rounded-lg flex items-center gap-3 mb-2 ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface-alt'}`}>
                          {request.avatarUrl ? (
                              <img src={request.avatarUrl} alt={request.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${theme === 'light' ? 'bg-gray-300 text-gray-700' : 'bg-gray-600 text-gray-100'}`}>
                                  {request.name.substring(0,1).toUpperCase()}
                              </div>
                          )}
                          <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{request.name}</p>
                              <p className={`text-xs truncate ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{request.description || request.type}</p>
                          </div>
                          <button onClick={() => handleAcceptRequest(request.id)} className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors" aria-label="Accept request">
                              <AcceptIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeclineRequest(request.id)} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors" aria-label="Decline request">
                              <DeclineIcon className="w-4 h-4" />
                          </button>
                      </div>
                  ))
              ) : (
                   <p className={`text-center text-xs py-4 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('noIncomingRequests', 'No new message requests.')}</p>
              )}
          </div>

          {/* Recent Chats Section */}
          <div className="p-3">
              <h3 className={`text-sm font-semibold mb-2 px-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('recentChatsTitle', 'Recent Chats')}</h3>
              {contactedProfiles.length > 0 ? (
                  contactedProfiles.map(profile => (
                      <div
                      key={profile.id}
                      className={`p-2.5 rounded-lg flex items-center gap-3 cursor-pointer transition-colors duration-150 mb-2
                                  ${theme === 'light' ? 'bg-light-surface hover:bg-light-surface-alt active:bg-gray-200' : 'bg-dark-card hover:bg-dark-surface active:bg-gray-700'}`}
                      onClick={() => handleProfileClick(profile)}
                      >
                      {profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt={profile.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${theme === 'light' ? 'bg-gray-300 text-gray-700' : 'bg-gray-600 text-gray-100'}`}>
                          {profile.name.substring(0, 1).toUpperCase()}
                          </div>
                      )}
                      <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{profile.name}</p>
                          <p className={`text-xs truncate ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{profile.description || profile.type}</p>
                      </div>
                      <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteProfile(profile.id); }}
                          className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'text-gray-400 hover:bg-red-100 hover:text-red-500' : 'text-gray-500 hover:bg-red-500/20 hover:text-red-400'}`}
                          aria-label={translate('deleteProfileAria', `Delete chat with ${profile.name}`, {name: profile.name})}
                      >
                          <Trash2Icon className="w-4 h-4" />
                      </button>
                      </div>
                  ))
              ) : (
                  <p className={`text-center text-xs py-4 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('noRecentChats', 'No recent chats. Accept requests or search to connect.')}</p>
              )}
          </div>
      </>
    );
  };


  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary flex flex-col font-sans">
      <PageHeader title={translate('akfPageTitle', "AKF Hub & Messages")} onBack={onNavigateHome}/>

      <div className={`p-3 sticky top-[60px] z-30 ${theme === 'light' ? 'bg-light-primary border-b border-gray-200' : 'bg-primary border-b border-gray-700/50'}`}>
        <div className="relative">
          <SearchLucideIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange" />
          <input
            type="text"
            placeholder={translate('akfSearchPlaceholder', "Search persons, orgs, temples...")}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange 
                        ${theme === 'light' ? 'bg-light-surface text-light-text-primary placeholder-light-text-tertiary' : 'bg-dark-surface-alt text-dark-text-primary placeholder-dark-text-tertiary'}`}
            aria-label={translate('akfSearchPlaceholderAria', 'Search for people, organizations, or temples in the AKF Hub')}
          />
        </div>
        {!selectedProfile && !showInAppBrowser && (
            <button
                onClick={() => setShowWebsiteConfirmDialog(true)}
                className={`mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${theme === 'light' ? 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20' : 'bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/30'}`}
            >
                <ExternalLinkIcon className="w-4 h-4" />
                {translate('visitWebsiteButton', 'Visit Our Website')}
            </button>
        )}
      </div>
      {requestStatusMessage && (
        <div className={`px-3 py-1.5 text-xs text-center ${theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-300'}`}>
          {requestStatusMessage}
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      {showWebsiteConfirmDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setShowWebsiteConfirmDialog(false)}>
          <div 
            className={`rounded-xl p-6 w-full max-w-xs shadow-2xl ${theme === 'light' ? 'bg-light-surface text-light-text-primary' : 'bg-dark-card text-dark-text-primary'}`}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="website-confirm-title"
            aria-describedby="website-confirm-desc"
          >
            <h3 id="website-confirm-title" className={`text-lg font-semibold mb-2 ${theme==='light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('websiteConfirmTitle', 'Confirm Navigation')}</h3>
            <p id="website-confirm-desc" className={`text-sm mb-4 ${theme==='light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('websiteConfirmMessage', 'Do you want to visit our website? AKFBD.ORG')}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWebsiteConfirmDialog(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}`}
              >
                {translate('cancelButton', 'Cancel')}
              </button>
              <button
                onClick={handleVisitWebsiteConfirm}
                className="px-4 py-2 bg-brand-orange hover:bg-opacity-90 text-white rounded-md text-sm font-medium transition-colors"
              >
                {translate('visitButton', 'Visit')}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar navItems={akfPageNavItems} activeTabId="akf" />
    </div>
  );
};

export default AkfPage;