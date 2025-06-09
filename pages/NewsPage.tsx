
import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import { TranslationService } from '../services/translationService';
import { useLanguage, languages as appLanguages } from '../contexts/LanguageContext';
import { NewsArticle, NavItem, Language } from '../types';
import {
  SearchLucideIcon,
  CalendarIcon,
  EyeIcon,
  Share2Icon,
  LanguagesIcon,
  XIcon,
  ExternalLinkIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  Link2Icon,
  HomeIcon,
  LearnIcon,
  AkfPlaceholderIcon,
  NewsIcon as NewsNavIcon,
  EmergencyIcon,
  FilterIcon,
  HeartIcon, // Added for love react
  LoaderIcon // Added for loading states
} from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface NewsPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void;
  onNavigateEmergency: () => void;
}

const categoryButtonColors = [
  'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700',
  'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700',
  'bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700',
  'bg-pink-500 dark:bg-pink-600 hover:bg-pink-600 dark:hover:bg-pink-700',
  'bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700',
  'bg-teal-500 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-700',
  'bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-black dark:text-gray-900', // Ensure text contrast for yellow
];

// Define base English categories for state management and logic
const baseEnglishCategories = ['All', 'Education', 'Event', 'Health', 'Culture', 'Spirituality', 'Community'];

const NewsPage: React.FC<NewsPageProps> = ({ onNavigateHome, onNavigateLearn, onNavigateEmergency }) => {
  const { currentLanguage, translate } = useLanguage();
  const { theme } = useTheme();
  
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTargetNews, setShareTargetNews] = useState<NewsArticle | null>(null);
  
  const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({}); 
  const [translatedArticles, setTranslatedArticles] = useState<Record<number, Record<string, Partial<NewsArticle>>>>({});
  const [loveReacts, setLoveReacts] = useState<Record<number, { count: number; loved: boolean }>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // Stores English category name
  const [dropdownSelectedLanguage, setDropdownSelectedLanguage] = useState<Language>(currentLanguage);

  useEffect(() => {
    setDropdownSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const initialNewsData: NewsArticle[] = [
    {
      id: 1,
      title: "বৈদিক শিক্ষার নতুন পাঠক্রম চালু",
      summary: "আগামী শিক্ষাবর্ষ থেকে বৈদিক শিক্ষার নতুন পাঠক্রম চালু করা হবে। এই পাঠক্রমে সংস্কৃত ভাষা, বেদ, উপনিষদ, গীতা এবং অন্যান্য প্রাচীন গ্রন্থের শিক্ষা অন্তর্ভুক্ত করা হয়েছে।",
      content: `আগামী শিক্ষাবর্ষ থেকে বৈদিক শিক্ষার নতুন পাঠক্রম চালু করা হবে। এই পাঠক্রমে সংস্কৃত ভাষা, বেদ, উপনিষদ, গীতা এবং অন্যান্য প্রাচীন গ্রন্থের শিক্ষা অন্তর্ভুক্ত করা হয়েছে। নতুন পাঠক্রমের মাধ্যমে শিক্ষার্থীরা প্রাচীন ভারতীয় জ্ঞান ও দর্শনের সাথে পরিচিত হতে পারবে। এছাড়াও যোগ, আয়ুর্বেদ এবং ধ্যানের মতো বিষয়গুলিও শিক্ষা দেওয়া হবে। পাঠক্রমটি আধুনিক শিক্ষা পদ্ধতির সাথে সামঞ্জস্যপূর্ণভাবে তৈরি করা হয়েছে। ডিজিটাল মাধ্যমে শিক্ষাদান এবং অনলাইন কোর্সের ব্যবস্থাও থাকবে। এই উদ্যোগটি শিক্ষার্থীদের মধ্যে ভারতীয় সংস্কৃতির প্রতি আগ্রহ বাড়াতে সাহায্য করবে এবং তাদের নৈতিক ও আধ্যাত্মিক বিকাশে সহায়ক হবে।`,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=60",
      date: "March 15, 2024",
      views: "2.5K",
      category: "Education" 
    },
    {
      id: 2,
      title: "সনাতন ধর্মের মূল্যবোধ শিক্ষা কর্মশালা",
      summary: "আগামী সপ্তাহে অনুষ্ঠিত হবে সনাতন ধর্মের মূল্যবোধ শিক্ষা বিষয়ক কর্মশালা। এই কর্মশালায় বিভিন্ন বিশেষজ্ঞ ও পণ্ডিতগণ অংশগ্রহণ করবেন।",
      content: `আগামী সপ্তাহে অনুষ্ঠিত হবে সনাতন ধর্মের মূল্যবোধ শিক্ষা বিষয়ক কর্মশালা। এই কর্মশালায় বিভিন্ন বিশেষজ্ঞ ও পণ্ডিতগণ অংশগ্রহণ করবেন। কর্মশালায় সনাতন ধর্মের মৌলিক মূল্যবোধ, নৈতিক শিক্ষা এবং আধ্যাত্মিক উন্নয়নের বিষয়ে আলোচনা করা হবে। বিশেষ করে যুব সমাজের মধ্যে এই মূল্যবোধগুলি কীভাবে প্রচার করা যায় সে বিষয়ে গুরুত্ব দেওয়া হবে। অংশগ্রহণকারীদের জন্য বিনামূল্যে প্রশিক্ষণ সামগ্রী ও সার্টিফিকেট প্রদান করা হবে। কর্মশালাটি অনলাইন এবং অফলাইন উভয় মাধ্যমেই পরিচালিত হবে।`,
      image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=60",
      date: "March 14, 2024",
      views: "1.8K",
      category: "Event"
    },
    {
      id: 3,
      title: "যোগ ও ধ্যান শিবির",
      summary: "প্রতি শনিবার সকালে অনুষ্ঠিত হবে যোগ ও ধ্যান শিবির। এই শিবিরে অভিজ্ঞ যোগ শিক্ষক ও ধ্যান গুরুরা উপস্থিত থাকবেন।",
      content: `প্রতি শনিবার সকালে অনুষ্ঠিত হবে যোগ ও ধ্যান শিবির। এই শিবিরে অভিজ্ঞ যোগ শিক্ষক ও ধ্যান গুরুরা উপস্থিত থাকবেন। শিবিরে অংশগ্রহণকারীরা বিভিন্ন যোগাসন, প্রাণায়াম এবং ধ্যান পদ্ধতি শিখতে পারবেন। এছাড়াও স্বাস্থ্যকর জীবনযাপন ও মানসিক শান্তি বিষয়ে পরামর্শ দেওয়া হবে। সকল বয়সের মানুষের জন্য এই শিবির উন্মুক্ত। আগ্রহীরা অনলাইনে রেজিস্ট্রেশন করতে পারবেন। শিবিরের শেষে একটি বিশেষ মেডিটATION সেশনের আয়োজন করা হবে।`,
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&auto=format&fit=crop&q=60",
      date: "March 13, 2024",
      views: "3.2K",
      category: "Health"
    }
  ];
  
  const [newsFeed, setNewsFeed] = useState<NewsArticle[]>(initialNewsData);
  
  useEffect(() => {
    const initialLoveReacts: Record<number, { count: number; loved: boolean }> = {};
    newsFeed.forEach(article => {
        initialLoveReacts[article.id] = { count: Math.floor(Math.random() * 100) + 10, loved: false };
    });
    setLoveReacts(initialLoveReacts);
  }, [newsFeed]);


  const translateArticleIfNeeded = useCallback(async (article: NewsArticle, targetLang: Language) => {
    if (targetLang.code === 'bn') { 
      setTranslatedArticles(prev => ({
        ...prev,
        [article.id]: {
          ...prev[article.id],
          [targetLang.code]: { title: article.title, summary: article.summary, content: article.content }
        }
      }));
      return;
    }

    const translationKey = `${article.id}_${targetLang.code}`;
    if (translatedArticles[article.id]?.[targetLang.code]?.content) return;

    setIsTranslating(prev => ({ ...prev, [translationKey]: true }));
    try {
      const [titleRes, summaryRes, contentRes] = await Promise.all([
        TranslationService.translate({ sourceText: article.title, targetLanguageCode: targetLang.code, targetLanguageName: targetLang.name, sourceLanguageCode: 'bn', sourceLanguageName: 'Bengali' }),
        TranslationService.translate({ sourceText: article.summary, targetLanguageCode: targetLang.code, targetLanguageName: targetLang.name, sourceLanguageCode: 'bn', sourceLanguageName: 'Bengali' }),
        TranslationService.translate({ sourceText: article.content, targetLanguageCode: targetLang.code, targetLanguageName: targetLang.name, sourceLanguageCode: 'bn', sourceLanguageName: 'Bengali' })
      ]);
      setTranslatedArticles(prev => ({
        ...prev,
        [article.id]: {
          ...prev[article.id],
          [targetLang.code]: { title: titleRes.translatedText, summary: summaryRes.translatedText, content: contentRes.translatedText }
        }
      }));
    } catch (error) {
      console.error(`Error translating article ${article.id} to ${targetLang.name}:`, error);
    } finally {
      setIsTranslating(prev => ({ ...prev, [translationKey]: false }));
    }
  }, [translatedArticles]); // Added translatedArticles to dependencies

  useEffect(() => {
    newsFeed.forEach(article => {
      translateArticleIfNeeded(article, dropdownSelectedLanguage);
    });
  }, [dropdownSelectedLanguage, newsFeed, translateArticleIfNeeded]);


  const filteredNews = newsFeed.filter(item => {
    const lowerQuery = searchQuery.toLowerCase();
    const currentTranslation = translatedArticles[item.id]?.[dropdownSelectedLanguage.code];
    
    const titleToSearch = currentTranslation?.title || item.title;
    const contentToSearch = currentTranslation?.content || item.content;
    const categoryToSearch = item.category; // Use original English category for filtering

    const matchesCategory = selectedCategory === 'All' || categoryToSearch === selectedCategory;
    const matchesSearch = !lowerQuery || 
                          titleToSearch.toLowerCase().includes(lowerQuery) ||
                          contentToSearch.toLowerCase().includes(lowerQuery);
    return matchesCategory && matchesSearch;
  });

  const handleOpenArticleModal = (article: NewsArticle) => {
    setSelectedNewsItem(article);
    setIsArticleModalOpen(true);
  };
  
  const handleLoveReact = (articleId: number) => {
    setLoveReacts(prev => {
        const currentReact = prev[articleId] || { count: 0, loved: false };
        return {
            ...prev,
            [articleId]: {
                count: currentReact.loved ? currentReact.count - 1 : currentReact.count + 1,
                loved: !currentReact.loved
            }
        };
    });
  };


  const handleShare = (newsItem: NewsArticle) => {
    setShareTargetNews(newsItem);
    setShowShareModal(true);
  };

  const handleSharePlatform = (platform: string) => {
    if (!shareTargetNews) return;
    const url = window.location.href; 
    const text = encodeURIComponent(translatedArticles[shareTargetNews.id]?.[dropdownSelectedLanguage.code]?.title || shareTargetNews.title);
    const summary = encodeURIComponent(translatedArticles[shareTargetNews.id]?.[dropdownSelectedLanguage.code]?.summary || shareTargetNews.summary);
    let shareUrl = '';

    switch (platform) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${text}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${text}&summary=${summary}`; break;
      case 'copy':
        navigator.clipboard.writeText(`${translatedArticles[shareTargetNews.id]?.[dropdownSelectedLanguage.code]?.title || shareTargetNews.title} - ${url}`)
          .then(() => alert(translate('linkCopied', 'Link copied to clipboard!')))
          .catch(err => console.error('Failed to copy: ', err));
        setShowShareModal(false);
        return;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    setShowShareModal(false);
  };

  const newsPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => {} }, // Placeholder for Community Hub
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: () => {} }, // Current page
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans pb-20">
      <PageHeader title={translate('newsPageTitle', "News Feed")} onBack={onNavigateHome} />

      <div className={`p-4 space-y-3 sticky top-[60px] z-30 border-b ${theme === 'light' ? 'bg-light-primary border-gray-200' : 'bg-primary border-gray-700/50'}`}> 
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <SearchLucideIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange" />
            <input
              type="text"
              placeholder={translate('searchNewsPlaceholder', "Search news...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-light-surface dark:bg-dark-surface-alt pl-10 pr-4 py-3 rounded-lg outline-none text-light-text-primary dark:text-dark-text-primary placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary focus:ring-2 focus:ring-brand-orange`}
            />
          </div>
          <select
            value={dropdownSelectedLanguage.code}
            onChange={(e) => {
                const lang = appLanguages.find(l => l.code === e.target.value);
                if (lang) {
                  setDropdownSelectedLanguage(lang);
                }
            }}
            className={`bg-light-surface dark:bg-dark-surface-alt rounded-lg px-4 py-3 outline-none appearance-none cursor-pointer sm:min-w-[150px] text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-brand-orange`}
            aria-label={translate('selectLanguageAria', "Select language for translation")}
          >
            {appLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary">
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {baseEnglishCategories.map((englishCat, index) => {
            const translatedDisplayCat = translate(`newsCategory_${englishCat.toLowerCase()}`, englishCat);
            const isActive = selectedCategory === englishCat;
            return (
                <button
                key={englishCat}
                onClick={() => setSelectedCategory(englishCat)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full whitespace-nowrap text-xs sm:text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${ isActive
                        ? `${categoryButtonColors[index % categoryButtonColors.length]} text-white font-semibold ring-2 ring-offset-1 dark:ring-offset-primary ring-white/70`
                        : `bg-light-surface-alt dark:bg-dark-surface-alt text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-light-text-primary dark:hover:text-dark-text-primary`
                    }`}
                >
                {translatedDisplayCat}
                </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4 pt-2">
        {filteredNews.length === 0 && !Object.values(isTranslating).some(v => v) ? (
          <div className={`text-center py-8 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>
            <FilterIcon className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p className="text-lg">{translate('noNewsFound', 'No news found.')}</p>
            <p className="text-sm">{translate('tryAdjustingFilters', 'Try adjusting your search or category filters.')}</p>
          </div>
        ) : (
          filteredNews.map((item) => {
            const translationKey = `${item.id}_${dropdownSelectedLanguage.code}`;
            const isLoadingTranslation = isTranslating[translationKey];
            const translated = translatedArticles[item.id]?.[dropdownSelectedLanguage.code];
            const displayTitle = translated?.title || item.title;
            const displaySummary = translated?.summary || item.summary;
            const { count: loveCount, loved: userLoved } = loveReacts[item.id] || { count: 0, loved: false };
            const displayCategory = translate(`newsCategory_${item.category.toLowerCase()}`, item.category);
            const categoryColorIndex = baseEnglishCategories.indexOf(item.category);


            return (
            <div key={item.id} 
                className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-brand-orange/20 dark:hover:shadow-brand-orange/30 cursor-pointer ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}
                onClick={() => handleOpenArticleModal(item)}
            >
              <img 
                src={item.image} 
                alt={displayTitle}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <span className={`text-xs px-2.5 py-1 text-white rounded-full mb-2 inline-block ${categoryButtonColors[categoryColorIndex % categoryButtonColors.length] || 'bg-gray-500 dark:bg-gray-600'}`}>
                  {displayCategory}
                </span>
                <h2 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
                  {isLoadingTranslation && !translated?.title ? <LoaderIcon className="w-5 h-5 inline animate-spin mr-2" /> : displayTitle}
                </h2>
                
                <p className={`text-sm line-clamp-3 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                  {isLoadingTranslation && !translated?.summary ? <LoaderIcon className="w-4 h-4 inline animate-spin mr-1" /> : displaySummary}
                </p>

                <div className={`flex items-center justify-between text-xs mt-4 pt-3 ${theme === 'light' ? 'text-light-text-tertiary border-t border-gray-200' : 'text-dark-text-tertiary border-t border-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1" title={translate('datePublishedTooltip', "Date published")}>
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1" title={translate('viewsTooltip', "Views")}>
                      <EyeIcon className="w-3.5 h-3.5" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleLoveReact(item.id);}}
                        className={`p-1.5 rounded-full transition-colors ${userLoved ? 'text-pink-500 hover:text-pink-600' : `${theme === 'light' ? 'text-gray-400 hover:text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}`}
                        aria-label={userLoved ? translate('unlikeArticleAria', "Unlike article") : translate('likeArticleAria', "Like article")}
                    >
                        <HeartIcon className={`w-4 h-4 ${userLoved ? 'fill-current' : ''}`} /> 
                    </button>
                    <span className="text-xs">{loveCount}</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(item);}}
                        aria-label={translate('shareArticleAria', `Share ${displayTitle}`, { title: displayTitle })}
                        className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'hover:bg-brand-orange/10 text-gray-400 hover:text-brand-orange' : 'hover:bg-brand-orange/20 text-gray-500 hover:text-brand-orange'}`}
                    >
                        <Share2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )})
        )}
      </div>

      {showShareModal && shareTargetNews && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]" onClick={() => setShowShareModal(false)}>
          <div className={`rounded-xl p-6 w-full max-w-xs shadow-2xl ${theme === 'light' ? 'bg-light-surface text-light-text-primary' : 'bg-dark-card text-dark-text-primary'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">{translate('shareNewsTitle', 'Share News')}</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className={`p-1 rounded-full transition-colors ${theme === 'light' ? 'text-gray-500 hover:bg-gray-200 hover:text-gray-700' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                aria-label={translate('closeShareModalAria', "Close share modal")}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {(['facebook', 'twitter', 'linkedin', 'copy'] as const).map((platform, idx) => (
                <button
                  key={platform}
                  onClick={() => handleSharePlatform(platform)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 
                            ${categoryButtonColors[idx % categoryButtonColors.length]} text-white hover:opacity-90 focus:ring-white/50`}
                >
                  {platform === 'facebook' && <FacebookIcon className="w-5 h-5" />}
                  {platform === 'twitter' && <TwitterIcon className="w-5 h-5" />}
                  {platform === 'linkedin' && <LinkedinIcon className="w-5 h-5" />}
                  {platform === 'copy' && <Link2Icon className="w-5 h-5" />}
                  <span className="capitalize">{platform === 'copy' ? translate('copyLink', 'Copy Link') : platform}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isArticleModalOpen && selectedNewsItem && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[90]" 
            onClick={() => setIsArticleModalOpen(false)}
        >
          <div 
            className={`rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl ${theme === 'light' ? 'bg-light-surface text-light-text-primary' : 'bg-dark-card text-dark-text-primary'}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
          >
            <div className={`flex justify-between items-center p-4 border-b sticky top-0 rounded-t-xl ${theme === 'light' ? 'bg-light-surface border-gray-200' : 'bg-dark-card border-gray-700'}`}>
              <h2 id="article-modal-title" className="text-lg font-semibold text-brand-orange truncate pr-2" title={translatedArticles[selectedNewsItem.id]?.[dropdownSelectedLanguage.code]?.title || selectedNewsItem.title}>
                {translatedArticles[selectedNewsItem.id]?.[dropdownSelectedLanguage.code]?.title || selectedNewsItem.title}
              </h2>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'text-gray-500 hover:bg-gray-200 hover:text-gray-700' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                aria-label={translate('closeArticleModalAria', "Close article details")}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-5 flex-grow overflow-y-auto">
              <img src={selectedNewsItem.image} alt={selectedNewsItem.title} className="w-full h-56 object-cover rounded-lg mb-4"/>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {isTranslating[`${selectedNewsItem.id}_${dropdownSelectedLanguage.code}`] && !translatedArticles[selectedNewsItem.id]?.[dropdownSelectedLanguage.code]?.content 
                  ? <span className="flex items-center gap-2"><LoaderIcon className="w-4 h-4 animate-spin" /> {translate('translatingContent', 'Translating content...')}</span>
                  : (translatedArticles[selectedNewsItem.id]?.[dropdownSelectedLanguage.code]?.content || selectedNewsItem.content)
                }
              </p>
            </div>
            <div className={`p-4 border-t flex justify-between items-center sticky bottom-0 rounded-b-xl ${theme === 'light' ? 'bg-light-surface border-gray-200' : 'bg-dark-card border-gray-700'}`}>
                <div className={`text-xs ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                    {selectedNewsItem.date} &bull; {selectedNewsItem.views} {translate('views', 'views')}
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleLoveReact(selectedNewsItem.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors
                                    ${loveReacts[selectedNewsItem.id]?.loved 
                                        ? 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20' 
                                        : `${theme === 'light' ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}`}
                        aria-label={loveReacts[selectedNewsItem.id]?.loved ? translate('unlikeArticleAria', "Unlike article") : translate('likeArticleAria', "Like article")}
                    >
                        <HeartIcon className={`w-4 h-4 ${loveReacts[selectedNewsItem.id]?.loved ? 'fill-current' : ''}`} /> 
                        <span>{loveReacts[selectedNewsItem.id]?.count || 0}</span>
                    </button>
                     <button 
                        onClick={() => { handleShare(selectedNewsItem); setIsArticleModalOpen(false); }}
                        className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        aria-label={translate('shareArticleButtonAria', "Share article")}
                    >
                        <Share2Icon className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar navItems={newsPageNavItems} activeTabId="news" />
    </div>
  );
};

export default NewsPage;
