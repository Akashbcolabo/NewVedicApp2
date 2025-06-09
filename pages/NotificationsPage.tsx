
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { NotificationItem } from '../types';
import { MOCK_NOTIFICATIONS } from '../mockData';
import { XIcon, CheckCircleIcon, BellIcon as PageBellIcon, AlertCircleIcon, InfoIcon, UsersIcon, BookOpenIcon, NewsIcon as ArticleIcon } from '../constants'; 
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationsPageProps {
  onNavigateBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigateBack }) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const toggleReadStatus = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const getIconForType = (type: NotificationItem['type'], isRead: boolean) => {
    const baseClass = "w-6 h-6 sm:w-7 sm:h-7 mr-3 flex-shrink-0";
    let colorClass = "";
    if (theme === 'light') {
      colorClass = isRead ? "text-light-text-tertiary" : "text-brand-orange";
    } else {
      colorClass = isRead ? "text-dark-text-tertiary" : "text-brand-orange";
    }
    const combinedClass = `${baseClass} ${colorClass}`;

    switch (type) {
        case 'alert': return <AlertCircleIcon className={combinedClass} />;
        case 'info': return <InfoIcon className={combinedClass} />;
        case 'community': return <UsersIcon className={combinedClass} />;
        case 'content': return <ArticleIcon className={combinedClass} />; 
        default: return <PageBellIcon className={combinedClass} />;
    }
  };


  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans">
      <PageHeader title={translate('notificationsTitle', "Notifications")} onBack={onNavigateBack} />
      <main className="p-4 space-y-4 pb-20">
        <div className="flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
                {notifications.filter(n => !n.isRead).length > 0 
                    ? translate('unreadNotificationsCount', `${notifications.filter(n => !n.isRead).length} Unread`, { count: notifications.filter(n => !n.isRead).length })
                    : translate('allCaughtUp', "All caught up!")}
            </h2>
            <div className="flex gap-2">
                <button 
                    onClick={markAllAsRead} 
                    className="text-xs text-brand-orange hover:underline disabled:opacity-50"
                    disabled={notifications.every(n => n.isRead) || notifications.length === 0}
                >
                    {translate('markAllAsReadButton', 'Mark all as read')}
                </button>
                <button 
                    onClick={clearAllNotifications} 
                    className="text-xs text-red-500 hover:underline disabled:opacity-50"
                    disabled={notifications.length === 0}
                >
                    {translate('clearAllButton', 'Clear All')}
                </button>
            </div>
        </div>

        {notifications.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>
            <PageBellIcon className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl">{translate('noNotificationsYetTitle', 'No Notifications Yet')}</p>
            <p className="text-sm">{translate('checkBackLaterMessage', 'Check back later for updates.')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3.5 sm:p-4 rounded-lg shadow-md flex items-start gap-3 transition-all duration-200
                  ${notification.isRead 
                    ? `${theme === 'light' ? 'bg-light-surface-alt opacity-80 hover:opacity-100' : 'bg-dark-surface-alt opacity-70 hover:opacity-100'}` 
                    : `${theme === 'light' ? 'bg-light-surface hover:bg-light-surface-alt' : 'bg-dark-card hover:bg-dark-surface'}`
                  }`}
                onClick={() => toggleReadStatus(notification.id)}
                role="button"
                tabIndex={0}
                aria-label={translate('notificationAriaLabel', `Notification: ${notification.title}. Status: ${notification.isRead ? 'Read' : 'Unread'}.`, { title: notification.title, status: notification.isRead ? 'Read' : 'Unread' })}
              >
                {getIconForType(notification.type, notification.isRead)}
                <div className="flex-1">
                  <h3 className={`text-sm sm:text-base font-semibold ${notification.isRead ? (theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary') : (theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary')}`}>{notification.title}</h3>
                  <p className={`text-xs sm:text-sm ${notification.isRead ? (theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary') : (theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary')}`}>{notification.message}</p>
                  <p className={`text-xs mt-1 ${notification.isRead ? (theme === 'light' ? 'text-gray-400' : 'text-gray-600') : (theme === 'light' ? 'text-gray-500' : 'text-gray-500')}`}>{notification.timestamp}</p>
                </div>
                {!notification.isRead && (
                    <div className="w-2.5 h-2.5 bg-brand-orange rounded-full mt-1 flex-shrink-0" title={translate('unreadIndicatorTitle', 'Unread')}></div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
