import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import { NavItem, ChatMessage as AppChatMessage } from '../types';
import { 
    HomeIcon, LearnIcon as LearnNavIcon, AkfPlaceholderIcon, NewsIcon as NewsNavIcon, EmergencyIcon as EmergencyNavIcon,
    ChevronDownIcon, ChevronRightIcon, MailIcon, PhoneIcon, MessageCircleIcon, SendIcon, XIcon, ListChecksIcon, LoaderIcon
} from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatMessage extends AppChatMessage {
  timestamp?: number;
}

interface FAQItem {
  questionKey: string; // Key for translation
  answerKey: string;   // Key for translation
}

interface HelpSupportPageProps {
  onNavigateBack: () => void;
  onNavigateHome: () => void;
  onNavigateLearn: () => void;
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const HelpSupportPage: React.FC<HelpSupportPageProps> = ({
  onNavigateBack,
  onNavigateHome,
  onNavigateLearn,
  onNavigateNews,
  onNavigateEmergency,
}) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userChatMessage, setUserChatMessage] = useState('');
  const [isSendingChatMessage, setIsSendingChatMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const faqItems: FAQItem[] = [
    { questionKey: 'faq_q1_change_language', answerKey: 'faq_a1_change_language_ans' },
    { questionKey: 'faq_q2_search_content', answerKey: 'faq_a2_search_content_ans' },
    { questionKey: 'faq_q3_report_issue', answerKey: 'faq_a3_report_issue_ans' },
  ];

  useEffect(() => {
    if (isChatActive) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatActive]);

  const toggleFAQ = (questionKey: string) => {
    setOpenFAQ(openFAQ === questionKey ? null : questionKey);
  };

  const handleStartChat = () => {
    setIsChatActive(true);
    setChatMessages([{ role: 'assistant', content: translate('supportChatWelcome', 'Hello! How can we assist you today?'), timestamp: Date.now() }]);
  };

  const handleCloseChat = () => {
    setIsChatActive(false);
    // Optionally clear chat messages or keep them for session
    // setChatMessages([]); 
  };

  const handleSendChatMessage = async () => {
    if (!userChatMessage.trim() || isSendingChatMessage) return;

    const newUserMessage: ChatMessage = { role: 'user', content: userChatMessage, timestamp: Date.now() };
    setChatMessages(prev => [...prev, newUserMessage]);
    const currentMessage = userChatMessage;
    setUserChatMessage('');
    setIsSendingChatMessage(true);

    // Simulate API call & response
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
    let replyContent = translate('supportChatGenericReply', 'Thank you for your message. An agent will be with you shortly.');
    if(currentMessage.toLowerCase().includes('password')) {
        replyContent = translate('supportChatPasswordHelp', 'For password issues, please try the "Forgot Password" link on the login page or contact support@vedicwisdomapp.com.');
    } else if (currentMessage.toLowerCase().includes('payment')) {
        replyContent = translate('supportChatPaymentHelp', 'For payment queries, please ensure your payment method is valid or contact us with transaction details.');
    }

    setChatMessages(prev => [...prev, { role: 'assistant', content: replyContent, timestamp: Date.now() }]);
    setIsSendingChatMessage(false);
  };

  const helpPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnNavIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => {} }, // Placeholder, should navigate to AKF page
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyNavIcon />, onClick: onNavigateEmergency },
  ];

  const commonButtonClasses = `w-full flex items-center justify-between p-4 rounded-lg transition-colors text-left text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-orange`;
  const lightButtonClasses = `bg-light-surface hover:bg-light-surface-alt text-light-text-primary`;
  const darkButtonClasses = `bg-dark-card hover:bg-dark-surface text-dark-text-primary`;
  const activeLightButtonClasses = `bg-brand-orange/10 text-brand-orange`;
  const activeDarkButtonClasses = `bg-brand-orange/20 text-brand-orange`;


  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans">
      <PageHeader title={translate('helpSupportTitle', "Help & Support")} onBack={onNavigateBack} />
      <main className="p-4 space-y-5 pb-24">
        {/* FAQ Section */}
        <section>
          <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
            <ListChecksIcon className="w-6 h-6 text-brand-orange" />
            {translate('faqTitle', 'Frequently Asked Questions')}
          </h2>
          <div className="space-y-2">
            {faqItems.map((item) => (
              <div key={item.questionKey} className={`rounded-lg overflow-hidden shadow ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                <button
                  onClick={() => toggleFAQ(item.questionKey)}
                  className={`w-full flex justify-between items-center p-3 text-left text-sm font-medium focus:outline-none
                    ${theme === 'light' ? 'text-light-text-primary hover:bg-gray-100' : 'text-dark-text-primary hover:bg-gray-700'}`}
                  aria-expanded={openFAQ === item.questionKey}
                >
                  <span>{translate(item.questionKey, `Q: Default ${item.questionKey}`)}</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform transform ${openFAQ === item.questionKey ? 'rotate-180' : ''}`} />
                </button>
                {openFAQ === item.questionKey && (
                  <div className={`p-3 border-t text-xs ${theme === 'light' ? 'border-gray-200 bg-gray-50 text-light-text-secondary' : 'border-gray-700 bg-dark-surface text-dark-text-secondary'}`}>
                    {translate(item.answerKey, `A: Default ${item.answerKey}`)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Us Section */}
        <section>
          <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
            <MailIcon className="w-6 h-6 text-brand-orange" />
            {translate('contactUsTitle', 'Contact Us')}
          </h2>
          <div className={`p-4 rounded-lg shadow ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
            <p className={`text-sm mb-2 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
              {translate('contactSupportText', 'For further assistance, you can reach us at:')}
            </p>
            <a href={`mailto:${translate('supportEmail', 'support@vedicwisdomapp.com')}`} className={`block text-brand-orange hover:underline text-sm mb-1`}>
              <MailIcon className="w-4 h-4 inline mr-1.5" /> {translate('supportEmail', 'support@vedicwisdomapp.com')}
            </a>
            <a href={`tel:${translate('supportPhone', '+1-800-VEDIC-HLP')}`} className={`block text-brand-orange hover:underline text-sm`}>
              <PhoneIcon className="w-4 h-4 inline mr-1.5" /> {translate('supportPhone', '+1-800-VEDIC-HLP')}
            </a>
          </div>
        </section>

        {/* Live Chat Section */}
        <section>
           <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
            <MessageCircleIcon className="w-6 h-6 text-brand-orange" />
            {translate('liveChatTitle', 'Live Chat')}
          </h2>
          {!isChatActive ? (
            <button
              onClick={handleStartChat}
              className={`${commonButtonClasses} ${theme === 'light' ? lightButtonClasses : darkButtonClasses} justify-center shadow-md hover:shadow-lg`}
            >
              <span>{translate('startLiveChatButton', 'Start Live Chat')}</span>
            </button>
          ) : (
            <div className={`rounded-lg shadow-xl flex flex-col h-[50vh] max-h-[400px] ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
              <div className={`p-3 flex items-center justify-between border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <span className="text-sm font-semibold">{translate('liveSupportChatHeader', 'Live Support Chat')}</span>
                <button onClick={handleCloseChat} className={`p-1.5 rounded-full ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`} aria-label={translate('closeChatAria', "Close chat")}>
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-xs shadow-sm ${msg.role === 'user' ? 'bg-brand-blue text-white rounded-br-none' : `${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-dark-surface text-gray-200'} rounded-bl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className={`p-2 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userChatMessage}
                    onChange={(e) => setUserChatMessage(e.target.value)}
                    placeholder={translate('typeYourMessagePlaceholder', 'Type your message...')}
                    className={`flex-1 rounded-full px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-orange ${theme === 'light' ? 'bg-gray-100 text-gray-800 placeholder-gray-500' : 'bg-gray-700 text-gray-200 placeholder-gray-400'}`}
                    disabled={isSendingChatMessage}
                    onKeyPress={(e) => e.key === 'Enter' && !isSendingChatMessage && handleSendChatMessage()}
                  />
                  <button
                    onClick={handleSendChatMessage}
                    disabled={isSendingChatMessage || !userChatMessage.trim()}
                    className="p-2 bg-brand-orange text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-60"
                    aria-label={translate('sendChatMessageAria', "Send chat message")}
                  >
                    {isSendingChatMessage ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <BottomNavBar navItems={helpPageNavItems} activeTabId={undefined} /> 
    </div>
  );
};

export default HelpSupportPage;