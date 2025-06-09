
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import QuizModal from '../components/QuizModal';
import { QuizService } from '../services/quizService';
import { 
    Course, 
    RealVideo, 
    QuizTopic, 
    Quiz, 
    NavItem 
} from '../types';
import { 
  MessageSquareIcon, 
  BrainIcon, 
  BookOpenIcon, 
  PlayIcon, 
  AwardIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  LoaderIcon,
  VideoIcon,
  XIcon,
  HomeIcon,
  LearnIcon as BottomNavLearnIcon,
  AkfPlaceholderIcon,
  NewsIcon as NewsNavIcon,
  EmergencyIcon
} from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';


interface LearnPageProps {
  onNavigateHome: () => void;
  onNavigateToAIAgent: () => void; 
  onNavigateLearn: () => void; 
  onNavigateNews: () => void;
  onNavigateFood: () => void;
  onNavigateEmergency: () => void;
  onNavigateTemple: () => void;
}

const LearnPage: React.FC<LearnPageProps> = ({ 
    onNavigateHome, 
    onNavigateToAIAgent,
    onNavigateLearn,
    onNavigateNews,
    onNavigateFood,
    onNavigateEmergency,
    onNavigateTemple
}) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState<'courses' | 'videos' | 'ai' | 'quiz'>('courses');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<RealVideo | null>(null);

  const courses: Course[] = [
    {
      title: translate('introToVedasTitle', 'Introduction to Vedas'),
      description: translate('introToVedasDesc', 'Learn the basics of Vedic knowledge, scriptures, and core concepts.'),
      duration: translate('duration2Hours', '2 hours'),
      progress: 60,
      image: 'https://images.unsplash.com/photo-1532653495815-8631ce38b510?w=800&auto=format&fit=crop&q=60',
      lastLesson: translate('vedicPhilosophyLesson', 'Understanding Vedic Philosophy')
    },
    {
      title: translate('sanskritBasicsTitle', 'Sanskrit Basics for Beginners'),
      description: translate('sanskritBasicsDesc', 'An introductory course to learn fundamental Sanskrit alphabets and grammar.'),
      duration: translate('duration3Hours', '3 hours'),
      progress: 30,
      image: 'https://images.unsplash.com/photo-1516383607781-913a19294fd1?w=800&auto=format&fit=crop&q=60',
      lastLesson: translate('sanskritGrammarLesson', 'Basic Sanskrit Grammar - Part 1')
    }
  ];

  const realVideos: RealVideo[] = [
    {
      title: translate('vedicChantsTitle', 'Morning Vedic Chants for Positive Energy'),
      duration: translate('duration15Min', '15 min'),
      instructor: translate('panditSharma', 'Pandit Sharma'),
      views: '12K',
      thumbnail: 'https://images.unsplash.com/photo-1609766418204-94aae0ecf4e5?w=800&auto=format&fit=crop&q=60',
      videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' 
    },
    {
      title: translate('gitaDiscourseTitle', 'Discourse on Bhagavad Gita - Chapter 2'),
      duration: translate('duration45Min', '45 min'),
      instructor: translate('swamiRamdev', 'Swami Ramdev'),
      views: '25K',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' 
    },
    {
      title: translate('sanskritPronunciationTitle', 'Sanskrit Pronunciation Guide for Beginners'),
      duration: translate('duration30Min', '30 min'),
      instructor: translate('drPatel', 'Dr. Patel'),
      views: '8K',
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60',
      videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4' 
    }
  ];

  const quizTopics: QuizTopic[] = [
    { title: translate('rigvedaQuizTitle', 'Rigveda Basics'), difficulty: 'Beginner' },
    { title: translate('sanskritGrammarQuizTitle', 'Sanskrit Grammar Fundamentals'), difficulty: 'Intermediate' },
    { title: translate('vedicPhilosophyQuizTitle', 'Core Vedic Philosophy'), difficulty: 'Advanced' },
    { title: translate('upanishadsQuizTitle', 'Introduction to Upanishads'), difficulty: 'Intermediate' }
  ];

  const handleGenerateQuiz = async (topic: string, difficulty: Quiz['difficulty']) => {
    try {
      setIsGeneratingQuiz(true);
      setError(null);
      const quiz = await QuizService.generateQuiz(topic, difficulty);
      setCurrentQuiz(quiz);
    } catch (err: any) {
      console.error('Error generating quiz:', err);
      setError(err.message || translate('quizGenerationFailed', 'Failed to generate quiz. Please try again.'));
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizComplete = async (score: number, totalQuestions: number) => {
    console.log(`Quiz completed with score: ${score}/${totalQuestions}`);
    // Potentially show a summary or save results
  };

  const handleContinueLearning = (course: Course) => {
    console.log("Navigating to course:", course.title, "Last lesson:", course.lastLesson);
    alert(translate('continueLearningAlert', `Continue learning: ${course.title}`, { title: course.title }));
  };

  const handleVideoPlay = (video: RealVideo) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };
  
  const learnPageNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <BottomNavLearnIcon />, onClick: onNavigateLearn }, 
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: onNavigateTemple },
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyIcon />, onClick: onNavigateEmergency },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={index} className={`rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-brand-orange/20 dark:hover:shadow-brand-orange/30 ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                <img src={course.image} alt={course.title} className="w-full h-40 object-cover"/>
                <div className="p-4">
                  <h3 className={`font-semibold text-lg ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{course.title}</h3>
                  <p className={`text-sm mb-3 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{course.description}</p>
                  <div className={`flex items-center justify-between text-xs mb-3 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>
                    <div className="flex items-center gap-1.5"><ClockIcon className="w-3.5 h-3.5" /><span>{course.duration}</span></div>
                    <span>{course.progress}% {translate('complete', 'Complete')}</span>
                  </div>
                  <div className={`w-full rounded-full h-2 mb-4 ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface'}`}><div className="bg-brand-orange h-2 rounded-full" style={{ width: `${course.progress}%` }}/></div>
                  <button onClick={() => handleContinueLearning(course)} className="w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium">
                    <PlayIcon className="w-4 h-4" /><span>{translate('continueLearningButton', 'Continue Learning')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'videos':
        return (
          <div className="space-y-4">
            {realVideos.map((video, index) => (
              <div key={index} className={`rounded-lg overflow-hidden shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover"/>
                  <button onClick={() => handleVideoPlay(video)} className={`absolute inset-0 flex items-center justify-center group ${theme === 'light' ? 'bg-black/20 hover:bg-black/40' : 'bg-black/40 hover:bg-black/60'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${theme === 'light' ? 'bg-black/10 group-hover:bg-black/20' : 'bg-white/10 group-hover:bg-white/20'}`}><PlayIcon className="w-6 h-6 text-white" /></div>
                  </button>
                  <div className={`absolute bottom-2 right-2 px-2 py-1 rounded text-xs backdrop-blur-sm ${theme === 'light' ? 'bg-black/50 text-gray-100' : 'bg-black/60 text-white'}`}>{video.duration}</div>
                </div>
                <div className="p-4">
                  <h3 className={`font-medium mb-1.5 truncate ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`} title={video.title}>{video.title}</h3>
                  <div className={`flex items-center justify-between text-xs ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}><span>{video.instructor}</span><span>{video.views} {translate('views', 'views')}</span></div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-6">
            <div className={`rounded-lg p-6 text-center shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
              <MessageSquareIcon className="w-12 h-12 mx-auto mb-4 text-brand-orange" />
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('aiLearningAssistantTitle', 'AI Learning Assistant')}</h3>
              <p className={`mb-6 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('aiLearningAssistantDesc', 'Get personalized help with your Vedic studies. Ask questions, get explanations, and deepen your understanding.')}</p>
              <button onClick={onNavigateToAIAgent} className="bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 mx-auto font-medium">
                <BrainIcon className="w-5 h-5" /><span>{translate('startConversationButton', 'Start Conversation')}</span>
              </button>
            </div>
            <div className={`rounded-lg p-6 shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
              <h3 className={`font-semibold mb-3 text-lg ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('whatCanAIHelpWithTitle', 'What can AI help you with?')}</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  translate('aiHelpItem1', "Explain complex Vedic concepts"), 
                  translate('aiHelpItem2', "Answer questions about Sanskrit"), 
                  translate('aiHelpItem3', "Help with pronunciation of mantras"), 
                  translate('aiHelpItem4', "Provide study recommendations")
                ].map(item => (
                  <li key={item} className={`flex items-start gap-2.5 ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                    <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-4">
            {error && <div className={`rounded-lg p-3 text-sm ${theme === 'light' ? 'bg-red-100 border border-red-300 text-red-700' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>{error}</div>}
            {isGeneratingQuiz ? (
              <div className={`rounded-lg p-8 text-center ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}><LoaderIcon className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-orange" /><p className={`${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('generatingQuizMessage', 'Generating your quiz...')}</p></div>
            ) : (
              <>
                {quizTopics.map((topic, index) => (
                  <div key={index} className={`rounded-lg p-4 shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className={`font-semibold text-lg ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{topic.title}</h3>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1.5 ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>{topic.difficulty}</span>
                      </div>
                      <AwardIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    </div>
                    <button onClick={() => handleGenerateQuiz(topic.title, topic.difficulty)} className="w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium">
                      <BookOpenIcon className="w-4 h-4" /><span>{translate('startQuizButton', 'Start Quiz')}</span>
                    </button>
                  </div>
                ))}
                 <div className={`rounded-lg p-4 mt-6 shadow-lg ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('moreQuizzesComingSoonTitle', 'More Quizzes Coming Soon!')}</h3>
                      <p className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('moreQuizzesComingSoonDesc', 'Check back for AI-generated quizzes based on your learning.')}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      default: return null;
    }
  };

  const TabButton: React.FC<{tabId: 'courses' | 'videos' | 'ai' | 'quiz'; label: string;}> = ({ tabId, label}) => (
    <button
        onClick={() => setActiveTab(tabId)}
        className={`flex-1 py-2.5 sm:py-3 px-1 text-xs sm:text-sm rounded-lg transition-all duration-200 ease-in-out font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-opacity-70 ${
        activeTab === tabId ? 'bg-brand-orange text-white' : `${theme === 'light' ? 'bg-light-surface-alt text-light-text-secondary hover:bg-gray-200' : 'bg-dark-surface-alt text-dark-text-secondary hover:bg-gray-700 hover:text-dark-text-primary'}`
        }`}
    >
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans pb-20">
      <PageHeader title={translate('learnPageTitle', "Learn & Explore")} onBack={onNavigateHome} />

      <div className={`p-4 sticky top-[60px] z-30 mb-2 ${theme === 'light' ? 'bg-light-primary dark:bg-dark-primary' : 'bg-primary dark:bg-black'}`}>
        <div className="flex gap-2">
          <TabButton tabId="courses" label={translate('coursesTab', "Courses")} />
          <TabButton tabId="videos" label={translate('videosTab', "Videos")} />
          <TabButton tabId="ai" label={translate('aiAssistantTab', "AI Assistant")} />
          <TabButton tabId="quiz" label={translate('quizTab', "Quiz")} />
        </div>
      </div>

      <main className="p-4 pt-0"> 
        {renderTabContent()}
      </main>

      {currentQuiz && <QuizModal quiz={currentQuiz} onClose={() => setCurrentQuiz(null)} onComplete={handleQuizComplete} />}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" onClick={() => setShowVideoModal(false)}>
          <div className={`w-full max-w-2xl rounded-lg shadow-2xl ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-surface'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end pt-2 pr-2">
              <button onClick={() => setShowVideoModal(false)} className={`p-1.5 rounded-full ${theme === 'light' ? 'hover:bg-black/10 text-black' : 'hover:bg-white/10 text-white'}`}><XIcon className="w-5 h-5" /></button>
            </div>
            <video src={selectedVideo.videoUrl} controls autoPlay className="w-full aspect-video rounded-b-lg">
              {translate('videoNotSupported', 'Your browser does not support the video tag.')}
            </video>
            <div className={`p-4 rounded-b-lg -mt-1 ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface-alt'}`}>
              <h3 className={`text-base font-semibold ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{selectedVideo.title}</h3>
              <p className={`text-xs ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{selectedVideo.instructor}</p>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar navItems={learnPageNavItems} activeTabId="learn" />
    </div>
  );
};

export default LearnPage;
