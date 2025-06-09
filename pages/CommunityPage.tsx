
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { NavItem, CommunitySearchResultItem, CommunityEntity, CommunityEntityType } from '../types';
import { HomeIcon, LearnIcon, AkfPlaceholderIcon, NewsIcon, EmergencyIcon, UserSearchIcon, LandmarkIcon, TempleIcon, MessageSquareIcon, QuestionMarkIcon } from '../constants';
import { MOCK_COMMUNITY_USERS, MOCK_COMMUNITY_ORGANIZATIONS, MOCK_TEMPLE_DESTINATIONS } from '../mockData';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface CommunityPageProps {
  onNavigateHome: () => void;
  onNavigateToChat: (entity: CommunityEntity) => void;
  onNavigateLearn: () => void;
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ 
  onNavigateHome, 
  onNavigateToChat,
  onNavigateLearn,
  onNavigateNews,
  onNavigateEmergency
}) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CommunitySearchResultItem[]>([]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const foundResults: CommunitySearchResultItem[] = [];

    MOCK_COMMUNITY_USERS.filter(user => user.name.toLowerCase().includes(lowerQuery))
      .forEach(user => foundResults.push({ id: user.id, name: user.name, type: 'user', avatarUrl: user.avatarUrl }));
    
    MOCK_COMMUNITY_ORGANIZATIONS.filter(org => org.name.toLowerCase().includes(lowerQuery) || (org.description && org.description.toLowerCase().includes(lowerQuery)))
      .forEach(org => foundResults.push({ id: org.id, name: org.name, type: 'organization', avatarUrl: org.avatarUrl, description: org.description }));

    MOCK_TEMPLE_DESTINATIONS.filter(temple => temple.name.toLowerCase().includes(lowerQuery) || temple.type.toLowerCase().includes(lowerQuery))
      .forEach(temple => foundResults.push({ id: temple.id, name: temple.name, type: 'temple', avatarUrl: temple.imageUrl, description: temple.type }));
      
    setResults(foundResults);
  };

  const getIconForType = (type: CommunityEntityType) => {
    const iconProps = { className: `w-8 h-8 ${theme === 'light' ? 'text-brand-orange' : 'text-brand-yellow'}` };
    switch(type) {
      case 'user': return <UserSearchIcon {...iconProps} />;
      case 'organization': return <LandmarkIcon {...iconProps} />;
      case 'temple': return <TempleIcon {...iconProps} />;
      default: return <QuestionMarkIcon {...iconProps} />;
    }
  };
  
  const communityPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => {} }, // Current page
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans">
      <PageHeader title={translate('communityConnectTitle', "Community Connect")} onBack={onNavigateHome} />
      <main className="p-4 pb-24 space-y-4">
        <SearchBar 
          placeholderText={translate('communitySearchPlaceholder', "Search users, orgs, temples...")}
          onSearch={handleSearch}
          onFilterClick={() => console.log('Filter clicked on CommunityPage')} // Replace with actual filter modal logic if needed
          initialQuery={searchTerm}
        />
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map(item => (
              <div key={`${item.id}-${item.type}`} className={`p-3 rounded-lg flex items-center gap-3 shadow ${theme === 'light' ? 'bg-light-surface hover:bg-light-surface-alt' : 'bg-dark-surface-alt hover:bg-dark-surface'}`}>
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface'}`}>
                  {item.avatarUrl ? <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover rounded-full" /> : getIconForType(item.type) }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{item.name}</p>
                  <p className={`text-xs capitalize ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{item.type}</p>
                </div>
                <button 
                  onClick={() => onNavigateToChat(item as CommunityEntity)} 
                  className="bg-brand-orange text-white p-2 rounded-full hover:bg-opacity-80 transition-colors"
                  aria-label={translate('messageButtonAriaLabel', `Message ${item.name}`, { name: item.name })}
                >
                  <MessageSquareIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <p className={`text-center py-6 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('noResultsFound', 'No results found for "{searchTerm}".', { searchTerm: searchTerm })}</p>
        ) : (
          <p className={`text-center py-6 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('searchToConnect', 'Search to connect with the community.')}</p>
        )}
      </main>
      <BottomNavBar navItems={communityPageNavItems} activeTabId="akf" />
    </div>
  );
};

export default CommunityPage;
