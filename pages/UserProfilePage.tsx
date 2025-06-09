
import React from 'react';
import PageHeader from '../components/PageHeader';
import { UserProfileData } from '../types';
import { EditIcon, SettingsIcon, ChevronRightIcon, BookOpenIcon, AwardIcon, NewsIcon as ArticleIcon } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfilePageProps {
  userProfile: UserProfileData;
  onNavigateBack: () => void;
  onNavigateToSettings: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ userProfile, onNavigateBack, onNavigateToSettings }) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  
  const StatItem: React.FC<{icon: React.ReactElement<{ className?: string }>, label: string, value: string | number}> = ({icon, label, value}) => (
    <div className={`p-3 rounded-lg flex items-center gap-3 ${theme === 'light' ? 'bg-light-surface shadow' : 'bg-dark-card shadow-md'}`}>
        {React.cloneElement(icon, {className: "w-6 h-6 text-brand-orange"})}
        <div>
            <p className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{label}</p>
            <p className={`text-lg font-semibold ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{value}</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans">
      <PageHeader title={translate('userProfileTitle', "My Profile")} onBack={onNavigateBack} />
      <main className="p-4 space-y-6 pb-20">
        
        <section className={`rounded-xl p-5 sm:p-6 text-center shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
          <img 
            src={userProfile.avatarUrl} 
            alt={userProfile.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 border-4 border-brand-orange object-cover shadow-md"
          />
          <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{userProfile.name}</h2>
          <p className={`text-sm mb-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{userProfile.email}</p>
          <p className={`text-xs ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('joinedDateLabel', 'Joined')}: {userProfile.joinDate}</p>
          {userProfile.bio && <p className={`text-sm mt-3 max-w-md mx-auto ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{userProfile.bio}</p>}
          <button 
            onClick={() => alert(translate('editProfileComingSoon', 'Edit Profile functionality coming soon!'))}
            className={`mt-4 text-brand-orange rounded-lg px-5 py-2 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors
                        ${theme === 'light' ? 'bg-brand-orange/10 hover:bg-brand-orange/20' : 'bg-brand-orange/20 hover:bg-brand-orange/30'}`}
          >
            <EditIcon className="w-4 h-4" />
            {translate('editProfileButton', 'Edit Profile')}
          </button>
        </section>

        <section>
          <h3 className={`text-md font-semibold uppercase mb-3 px-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('activitySummaryTitle', 'Activity Summary')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <StatItem icon={<BookOpenIcon />} label={translate('mantrasSavedLabel', 'Mantras Saved')} value={userProfile.stats?.mantrasSaved || 0} />
            <StatItem icon={<AwardIcon />} label={translate('quizzesTakenLabel', 'Quizzes Taken')} value={userProfile.stats?.quizzesTaken || 0} />
            <StatItem icon={<ArticleIcon />} label={translate('articlesReadLabel', 'Articles Read')} value={userProfile.stats?.articlesRead || 0} />
          </div>
        </section>
        
        <section>
          <h3 className={`text-md font-semibold uppercase mb-3 px-1 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('accountAndAppSettingsTitle', 'Account & App')}</h3>
           <div className="space-y-2">
            <button
                onClick={onNavigateToSettings}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-lg transition-colors text-left 
                            ${theme === 'light' ? 'bg-light-surface hover:bg-gray-100 shadow' : 'bg-dark-card hover:bg-gray-700/70 shadow-md'}`}
            >
                <div className="flex items-center gap-3">
                    <SettingsIcon className="w-5 h-5 text-brand-orange"/>
                    <span className={`text-sm sm:text-base ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('appSettingsButton', 'App Settings')}</span>
                </div>
                <ChevronRightIcon className={`w-5 h-5 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`} />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default UserProfilePage;
