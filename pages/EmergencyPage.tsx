
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import { EmergencyContact, NavItem } from '../types';
import {
  PhoneIcon,
  AlertTriangleIcon,
  MessageSquareIcon,
  ClockIcon,
  MapPinIcon,
  SendIcon,
  LoaderIcon,
  HomeIcon,
  LearnIcon,
  AkfPlaceholderIcon,
  NewsIcon as NewsNavIcon,
  EmergencyIcon as BottomNavEmergencyIcon, 
  FoodIcon
} from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface EmergencyPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void; 
  onNavigateNews: () => void;
  onNavigateFood: () => void;
  onNavigateEmergency: () => void; 
}

const EmergencyPage: React.FC<EmergencyPageProps> = ({ 
  onNavigateHome, 
  onNavigateLearn, 
  onNavigateNews,
  onNavigateFood,
  onNavigateEmergency
}) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    { name: translate('akfEmergencyHotline', 'AKF Emergency Hotline'), number: '+8801612131631', available: translate('time247', '24/7'), type: 'call' },
    { name: translate('akfWhatsappSupport', 'AKF WhatsApp Support'), number: '+8801540731551', available: translate('time247', '24/7'), type: 'whatsapp' },
    { name: translate('akfOfficeDaytime', 'AKF Office (Daytime)'), number: '+8801540731551', available: translate('time9to5', '9 AM - 5 PM'), type: 'call' }
  ];

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      console.log('Sending emergency alert:', message);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      setMessage('');
      setTimeout(() => setShowSuccess(false), 5000); 
    } catch (error) {
      console.error('Error sending emergency notification:', error);
      alert(translate('emergencySendFailed', 'Failed to send emergency alert. Please try again or use the contacts below.'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const emergencyPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnIcon />, onClick: onNavigateLearn }, 
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: onNavigateFood }, 
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <BottomNavEmergencyIcon />, onClick: onNavigateEmergency },
  ];

  return (
    <div 
      className={`min-h-screen font-sans pb-20 ${theme === 'light' ? 'bg-red-50 text-red-800' : 'text-white bg-black dark:bg-gradient-to-br from-red-900 via-black to-black'}`}
    >
      <PageHeader title={translate('emergencyHelpTitle', "Emergency Help")} onBack={onNavigateHome} />

      <main className="pt-4">
        <div className="p-4">
          <div className={`rounded-xl p-5 sm:p-6 shadow-[0_0_25px_rgba(239,68,68,0.4)] ${theme === 'light' ? 'bg-red-500 text-white border border-red-600' : 'bg-red-600/80 backdrop-blur-sm border border-red-500/50'}`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{translate('needImmediateHelp', 'Need Immediate Help?')}</h2>
                <p className={`text-sm ${theme === 'light' ? 'text-red-100' : 'text-red-200'}`}>{translate('describeSituation', "Describe your situation. We're here 24/7.")}</p>
              </div>
            </div>

            <form onSubmit={handleEmergencySubmit} className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={translate('emergencyPlaceholder', "Briefly describe your emergency...")}
                className={`w-full rounded-lg p-4 outline-none resize-none h-28 sm:h-32 shadow-inner focus:ring-2 
                  ${theme === 'light' 
                    ? 'bg-white border border-red-300 text-red-900 placeholder-red-400 focus:ring-red-500' 
                    : 'bg-white/10 text-white placeholder-red-200/70 focus:ring-red-400 border-red-500/30'
                  }`}
                required
                aria-label="Emergency message input"
              />
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className={`w-full rounded-lg py-3 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 
                  ${theme === 'light' 
                    ? 'bg-white text-red-600 hover:bg-red-100 focus:ring-offset-red-500 focus:ring-red-700' 
                    : 'bg-white text-red-600 hover:bg-red-100 focus:ring-offset-red-600/80 focus:ring-white'
                  }`}
                aria-live="polite"
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon className="w-5 h-5 animate-spin" />
                    <span>{translate('sendingAlert', 'Sending Alert...')}</span>
                  </>
                ) : (
                  <>
                    <SendIcon className="w-5 h-5" />
                    <span>{translate('sendEmergencyAlert', 'Send Emergency Alert')}</span>
                  </>
                )}
              </button>
            </form>

            {showSuccess && (
              <div className={`mt-4 p-3 rounded-lg text-center shadow-lg text-sm ${theme === 'light' ? 'bg-green-500 text-white' : 'bg-green-600/90 text-white'}`} role="alert">
                {translate('alertSentSuccess', 'Alert sent successfully! We will contact you as soon as possible.')}
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-red-700' : 'text-gray-100'}`}>{translate('quickContactsTitle', 'Quick Contacts')}</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 flex items-center justify-between shadow-lg ${theme === 'light' ? 'bg-white border border-gray-200 text-gray-800' : 'bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 text-gray-100'}`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>{contact.name}</h3>
                  <p className="text-sm text-brand-orange font-medium">{contact.number}</p>
                  <div className={`flex items-center gap-1.5 mt-1 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>{translate('available', 'Available')}: {contact.available}</span>
                  </div>
                </div>
                <a
                  href={contact.type === 'whatsapp' 
                    ? `https://wa.me/${contact.number.replace(/[^0-9]/g, '')}`
                    : `tel:${contact.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={translate('contactAriaLabel', `Contact ${contact.name} via ${contact.type}`, { name: contact.name, type: contact.type })}
                  className="bg-brand-orange p-3 ml-2 rounded-full hover:bg-opacity-80 transition-colors shadow-md flex-shrink-0"
                >
                  {contact.type === 'whatsapp' ? (
                    <MessageSquareIcon className="w-5 h-5 text-white" />
                  ) : (
                    <PhoneIcon className="w-5 h-5 text-white" />
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-red-700' : 'text-gray-100'}`}>{translate('visitOfficeTitle', 'Visit Our Office')}</h2>
          <div className={`rounded-lg p-4 shadow-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-900/60 backdrop-blur-sm border border-gray-700/50'}`}>
            <div className="flex items-center gap-3 mb-2">
              <MapPinIcon className={`w-5 h-5 ${theme === 'light' ? 'text-brand-orange' : 'text-brand-yellow' } flex-shrink-0`} />
              <h3 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>{translate('akfOfficeName', 'Arya Kalyan Foundation')}</h3>
            </div>
            <p className={`text-sm ml-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{translate('akfOfficeAddress', 'Rangpur Sadar, Kamal Kachna, Notun Para, Rangpur, Bangladesh')}</p>
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Arya+Kalyan+Foundation+Rangpur+Bangladesh`, '_blank')}
              className={`w-full mt-4 rounded-lg py-2.5 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-brand-orange transition-colors
                ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-800/70 hover:bg-gray-700/70 text-gray-200'}`}
            >
              {translate('getDirectionsButton', 'Get Directions on Google Maps')}
            </button>
          </div>
        </div>
      </main>

      <BottomNavBar navItems={emergencyPageNavItems} activeTabId="emergency" />
    </div>
  );
};

export default EmergencyPage;
