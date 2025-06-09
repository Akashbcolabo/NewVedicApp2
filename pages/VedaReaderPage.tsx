
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import ReportModal from '../components/ReportModal';
import { VedicText, Section, Subsection, Verse, NavItem, Language as LanguageType, VerseTranslation, ReportSubmission } from '../types';
import { useLanguage, languages as appLanguages } from '../contexts/LanguageContext';
import { HomeIcon, LearnIcon, AkfPlaceholderIcon, NewsIcon, EmergencyIcon, LanguagesIcon, ChevronLeftIcon, ChevronRightIcon, LoaderIcon, AlertCircleIcon, FlagIcon, SearchLucideIcon, XIcon as CloseIcon } from '../constants';
import { VedicTranslationService } from '../services/vedicTranslationService';
import { useTheme } from '../contexts/ThemeContext';

interface VedaReaderPageProps {
  veda: VedicText;
  onNavigateBack: () => void;
  onNavigateLearn: () => void;
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const VedaReaderPage: React.FC<VedaReaderPageProps> = ({ 
  veda, 
  onNavigateBack,
  onNavigateLearn,
  onNavigateNews,
  onNavigateEmergency
}) => {
  const { currentLanguage: globalAppLanguage, translate } = useLanguage();
  const { theme } = useTheme();

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedSubsectionId, setSelectedSubsectionId] = useState<string | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  
  const [targetLanguage, setTargetLanguage] = useState<LanguageType>(globalAppLanguage);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [languageSearchTerm, setLanguageSearchTerm] = useState('');

  const [currentTranslation, setCurrentTranslation] = useState<VerseTranslation | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingVerse, setReportingVerse] = useState<Verse | null>(null);

  const flattenedVerses = useMemo(() => {
    const flatList: { verse: Verse; subsection: Subsection; section: Section }[] = [];
    veda.sections.forEach(sec => {
      sec.subsections.forEach(subSec => {
        subSec.verses.forEach(v => {
          flatList.push({ verse: v, subsection: subSec, section: sec });
        });
      });
    });
    return flatList;
  }, [veda]);

  const currentVerseIndex = useMemo(() => {
    return flattenedVerses.findIndex(item => item.verse.id === selectedVerseId);
  }, [flattenedVerses, selectedVerseId]);

  const currentSection = useMemo(() => veda.sections.find(s => s.id === selectedSectionId), [veda.sections, selectedSectionId]);
  const currentSubsection = useMemo(() => currentSection?.subsections.find(ss => ss.id === selectedSubsectionId), [currentSection, selectedSubsectionId]);
  const currentVerse = useMemo(() => flattenedVerses[currentVerseIndex]?.verse, [flattenedVerses, currentVerseIndex]);

  const updateSelections = useCallback((sectionId: string, subsectionId: string, verseId: string) => {
    setSelectedSectionId(sectionId);
    setSelectedSubsectionId(subsectionId);
    setSelectedVerseId(verseId);
    setCurrentTranslation(null);
    setTranslationError(null);
  }, []);

  useEffect(() => {
    if (flattenedVerses.length > 0 && (!selectedVerseId || !flattenedVerses.find(fv => fv.verse.id === selectedVerseId))) {
      const firstItem = flattenedVerses[0];
      if (firstItem) {
        updateSelections(firstItem.section.id, firstItem.subsection.id, firstItem.verse.id);
      }
    }
  }, [flattenedVerses, updateSelections, selectedVerseId]);
  
  const handleTranslate = useCallback(async () => {
    if (!currentVerse || !targetLanguage || isTranslating) return;
    
    setIsTranslating(true);
    setTranslationError(null);
    setCurrentTranslation(null);

    if (targetLanguage.code === 'en' && currentVerse.englishTranslation) {
        setCurrentTranslation({ bhavartha: currentVerse.englishTranslation }); setIsTranslating(false); return;
    }
    if (targetLanguage.code === 'bn' && currentVerse.bengaliTranslation) {
        setCurrentTranslation({ bhavartha: currentVerse.bengaliTranslation }); setIsTranslating(false); return;
    }
    if (currentVerse.aiTranslations && currentVerse.aiTranslations[targetLanguage.code]) {
        setCurrentTranslation(currentVerse.aiTranslations[targetLanguage.code]); setIsTranslating(false); return;
    }

    try {
      const sanskritText = currentVerse.sanskritLines.join('\n');
      const translationResult = await VedicTranslationService.translateVerseDetails(sanskritText, targetLanguage.code, targetLanguage.name);
      setCurrentTranslation(translationResult);
      // To cache AI translations for the session:
      // currentVerse.aiTranslations = { ...(currentVerse.aiTranslations || {}), [targetLanguage.code]: translationResult };
    } catch (error: any) {
      console.error("Translation error:", error);
      setTranslationError(error.message || "Failed to translate. Please try again.");
    } finally {
      setIsTranslating(false);
      setShowLanguageModal(false); // Close modal on success or failure of translation initiated from modal
    }
  }, [currentVerse, targetLanguage, isTranslating]);

  useEffect(() => {
    if (currentVerse && targetLanguage) {
        handleTranslate();
    }
  }, [currentVerse, targetLanguage, handleTranslate]);


  const handleSectionSelect = (sectionId: string) => {
    const section = veda.sections.find(s => s.id === sectionId);
    if (section && section.subsections.length > 0 && section.subsections[0].verses.length > 0) {
      updateSelections(section.id, section.subsections[0].id, section.subsections[0].verses[0].id);
    }
  };

  const handleSubsectionSelect = (subsectionId: string) => {
    const section = currentSection;
    const subsection = section?.subsections.find(ss => ss.id === subsectionId);
    if (section && subsection && subsection.verses.length > 0) {
      updateSelections(section.id, subsection.id, subsection.verses[0].id);
    }
  };
  
  const handleVerseSelect = (verseId: string) => {
     if (currentSection && currentSubsection) {
        updateSelections(currentSection.id, currentSubsection.id, verseId);
     }
  };

  const navigateVerse = (direction: 'next' | 'previous') => {
    if (currentVerseIndex === -1) return;
    const newIndex = direction === 'next' ? currentVerseIndex + 1 : currentVerseIndex - 1;
    if (newIndex >= 0 && newIndex < flattenedVerses.length) {
      const { verse, subsection, section } = flattenedVerses[newIndex];
      updateSelections(section.id, subsection.id, verse.id);
    }
  };

  const handleOpenReportModal = (verse: Verse) => {
    setReportingVerse(verse);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportingVerse(null);
  };

  const handleSubmitReport = (submission: ReportSubmission) => {
    console.log("Report Submitted:", submission);
    alert(`Report for verse ${submission.verseId} submitted. Reason: ${submission.reason}. Feedback: "${submission.feedback}"`);
    handleCloseReportModal();
  };
  
  const vedaReaderPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateBack },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => console.log('AKF Clicked') },
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];

  const isHumanVerified = currentVerse?.humanVerifiedLanguages?.includes(targetLanguage.code);

  const filteredAppLanguages = appLanguages.filter(lang => 
    lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(languageSearchTerm.toLowerCase())
  );

  const commonSelectClasses = `p-2.5 rounded-md text-sm w-full focus:ring-2 focus:ring-brand-orange outline-none transition-colors duration-150 ease-in-out`;
  const lightSelectClasses = `bg-white border border-gray-300 text-gray-700 hover:border-gray-400`;
  const darkSelectClasses = `bg-dark-surface text-gray-200 border-gray-600 hover:border-gray-500`;

  const commonButtonClasses = `px-3 sm:px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2`;
  const lightButtonNavClasses = `bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400 focus:ring-offset-light-surface`;
  const darkButtonNavClasses = `bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400 focus:ring-offset-dark-surface`;
  const primaryButtonClasses = `bg-brand-orange hover:bg-opacity-90 text-white focus:ring-brand-orange focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface`;


  return (
    <div className={`min-h-screen flex flex-col font-sans ${theme === 'light' ? 'bg-brand-light-gray text-light-text-primary' : 'bg-black text-white'}`}>
      <PageHeader title={veda.title} onBack={onNavigateBack} />
      <main className="flex-grow px-2 sm:px-4 pt-3 pb-20 space-y-3">
        
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-2 rounded-lg shadow ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-surface-alt'}`}>
          <select 
            value={selectedSectionId || ''} 
            onChange={(e) => handleSectionSelect(e.target.value)}
            className={`${commonSelectClasses} ${theme === 'light' ? lightSelectClasses : darkSelectClasses}`}
            aria-label={veda.sectionLevelName || 'Select Section'}
          >
            <option value="" disabled>{veda.sectionLevelName || 'Section'}</option>
            {veda.sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <select 
            value={selectedSubsectionId || ''} 
            onChange={(e) => handleSubsectionSelect(e.target.value)}
            disabled={!currentSection}
            className={`${commonSelectClasses} ${theme === 'light' ? lightSelectClasses : darkSelectClasses}`}
            aria-label={veda.subsectionLevelName || 'Select Subsection'}
          >
            <option value="" disabled>{veda.subsectionLevelName || 'Subsection'}</option>
            {currentSection?.subsections.map(ss => <option key={ss.id} value={ss.id}>{ss.title}</option>)}
          </select>
          <select 
            value={selectedVerseId || ''} 
            onChange={(e) => handleVerseSelect(e.target.value)}
            disabled={!currentSubsection}
            className={`${commonSelectClasses} ${theme === 'light' ? lightSelectClasses : darkSelectClasses}`}
            aria-label={veda.verseLevelName || 'Select Verse'}
          >
            <option value="" disabled>{veda.verseLevelName || 'Verse'}</option>
            {currentSubsection?.verses.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
          </select>
        </div>

        {currentVerse ? (
          <div className={`p-3 sm:p-4 rounded-lg shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-surface-alt'}`}>
            <div id={`verse-sanskrit-${currentVerse.id}`} className="mb-4">
              {currentVerse.sanskritLines.map((line, index) => (
                <p key={index} className={`font-sanskrit text-xl sm:text-2xl whitespace-pre-wrap leading-relaxed ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>{line}</p>
              ))}
              {currentVerse.devanagariLines && currentVerse.devanagariLines.map((line, index) => (
                 <p key={`dev-${index}`} className={`font-devanagari text-xl sm:text-2xl mt-1.5 whitespace-pre-wrap leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{line}</p>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <button 
                onClick={() => setShowLanguageModal(true)}
                className={`${commonButtonClasses} ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400' : 'bg-brand-blue hover:bg-opacity-90 text-white focus:ring-brand-blue'}`}
                aria-haspopup="true"
                aria-expanded={showLanguageModal}
              >
                <LanguagesIcon className="w-4 h-4" /> {translate('translateTo', 'Translate to')}: {targetLanguage.name} <ChevronRightIcon className={`w-4 h-4 transform transition-transform ${showLanguageModal ? 'rotate-90' : ''}`} />
              </button>
              <button
                onClick={() => handleOpenReportModal(currentVerse)}
                className={`p-2.5 rounded-full transition-colors ${theme === 'light' ? 'text-gray-500 hover:bg-red-100 hover:text-red-600 focus:ring-2 focus:ring-red-300' : 'text-gray-400 hover:bg-red-500/20 hover:text-red-400 focus:ring-2 focus:ring-red-500'}`}
                title={translate('reportMantraTitle', 'Report issue with this mantra')}
                aria-label="Report Mantra"
              >
                <FlagIcon className="w-4 h-4" />
              </button>
            </div>
            
            {isTranslating && (
              <div className={`my-4 p-3 rounded-md flex items-center justify-center gap-2 text-sm ${theme === 'light' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-800 text-gray-300'}`}>
                <LoaderIcon className="w-5 h-5 animate-spin" /> {translate('translatingTo', 'Translating to')} {targetLanguage.name}...
              </div>
            )}
            {translationError && (
              <div className={`my-4 p-3 rounded-md flex items-center gap-2 text-sm ${theme === 'light' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                <AlertCircleIcon className="w-5 h-5" /> {translationError}
              </div>
            )}

            {currentTranslation && !isTranslating && !translationError && (
              <div className={`space-y-3.5 mt-4 pt-4 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'}`}>
                <div className={`flex items-center gap-2 text-xs mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span>{translate('translationByAI', 'Translation by AI')}</span>
                  {isHumanVerified && (
                     <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white'}`}>{translate('humanVerified', 'Human Verified')}</span>
                  )}
                </div>
                {currentTranslation.pada && (
                  <div>
                    <h4 className={`font-semibold mb-1.5 ${theme === 'light' ? 'text-brand-blue' : 'text-brand-orange'}`}>{translate('padaLabel', 'पद (Key Terms/Word Meanings)')}:</h4>
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{currentTranslation.pada}</p>
                  </div>
                )}
                {currentTranslation.padartha && (
                  <div>
                    <h4 className={`font-semibold mb-1.5 ${theme === 'light' ? 'text-brand-blue' : 'text-brand-orange'}`}>{translate('padarthaLabel', 'पदार्थ (Phrase Analysis)')}:</h4>
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{currentTranslation.padartha}</p>
                  </div>
                )}
                {currentTranslation.bhavartha && (
                  <div>
                    <h4 className={`font-semibold mb-1.5 ${theme === 'light' ? 'text-brand-blue' : 'text-brand-orange'}`}>{translate('bhavarthaLabel', 'भावार्थ (Purport/Essence)')}:</h4>
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{currentTranslation.bhavartha}</p>
                  </div>
                )}
              </div>
            )}
             
            <div className={`flex justify-between items-center mt-6 pt-4 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'}`}>
                <button
                    onClick={() => navigateVerse('previous')}
                    disabled={currentVerseIndex <= 0}
                    className={`${commonButtonClasses} ${theme === 'light' ? lightButtonNavClasses : darkButtonNavClasses}`}
                >
                    <ChevronLeftIcon className="w-4 h-4" /> {translate('previousVerse', 'Previous')}
                </button>
                <span className={`text-sm font-mono ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {currentVerse.id}
                </span>
                <button
                    onClick={() => navigateVerse('next')}
                    disabled={currentVerseIndex >= flattenedVerses.length - 1}
                    className={`${commonButtonClasses} ${primaryButtonClasses}`}
                >
                    {translate('nextVerse', 'Next')} <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>

          </div>
        ) : (
          <div className={`text-center py-12 ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
            {veda.sections.length > 0 ? (
                 <p>{translate('selectVersePrompt', 'Select a section, subsection, and verse to display.')}</p>
            ) : (
                <p>{translate('noVedicTextAvailable', 'No content available for this Vedic text yet.')}</p>
            )}
          </div>
        )}
      </main>

      {showLanguageModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={() => setShowLanguageModal(false)}
        >
          <div 
            className={`rounded-xl w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col ${theme === 'light' ? 'bg-light-surface text-light-text-primary' : 'bg-dark-surface text-dark-text-primary'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center p-4 ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'}`}>
              <h2 className="text-lg font-semibold text-brand-orange">{translate('selectTranslationLanguage', 'Select Translation Language')}</h2>
              <button onClick={() => setShowLanguageModal(false)} className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'text-gray-500 hover:bg-gray-200' : 'text-gray-400 hover:bg-gray-700'}`} aria-label="Close language selection">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className={`p-3 ${theme === 'light' ? 'border-b border-gray-200' : 'border-b border-gray-700'}`}>
              <div className="relative">
                <SearchLucideIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                <input 
                  type="text"
                  placeholder={translate('searchLanguagesPlaceholder', 'Search languages...')}
                  value={languageSearchTerm}
                  onChange={(e) => setLanguageSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-md text-sm outline-none focus:ring-1 focus:ring-brand-orange ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-700 placeholder-gray-400' : 'bg-dark-surface-alt text-gray-200 border-gray-600 placeholder-gray-500'}`}
                />
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-1">
              {filteredAppLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setTargetLanguage(lang);
                    // handleTranslate will be called by useEffect for currentVerse/targetLanguage change
                    // No need to call it explicitly here if the goal is to auto-translate on selection.
                    // If an explicit button click is desired after selection, then this approach is fine.
                    // For now, relying on useEffect.
                    setShowLanguageModal(false); 
                    setLanguageSearchTerm('');
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded-md my-0.5 transition-colors
                    ${targetLanguage.code === lang.code 
                      ? 'bg-brand-orange text-white font-medium' 
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100 hover:text-brand-orange' : 'text-gray-300 hover:bg-dark-surface-alt hover:text-brand-orange'}`
                    }`}
                >
                  {lang.name} <span className={`text-xs ${theme === 'light' ? 'opacity-60' : 'opacity-70'}`}>({lang.code})</span>
                </button>
              ))}
              {filteredAppLanguages.length === 0 && (
                <p className={`text-center py-4 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>{translate('noLanguagesFound', 'No languages found matching')} "{languageSearchTerm}".</p>
              )}
            </div>
          </div>
        </div>
      )}

      {isReportModalOpen && reportingVerse && (
        <ReportModal
            isOpen={isReportModalOpen}
            onClose={handleCloseReportModal}
            verseId={reportingVerse.id}
            vedaTitle={veda.title}
            onSubmitReport={handleSubmitReport}
        />
      )}

      <BottomNavBar navItems={vedaReaderPageNavItems} activeTabId="learn" />
    </div>
  );
};

export default VedaReaderPage;

  