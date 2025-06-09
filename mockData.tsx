
import React from 'react';
import { 
    HeroContent, 
    YogaProgram, NewsArticle, Recipe, PopularDestinationItem, 
    VastuTip, DailyHoroscopeItem, VedicText, Verse, Section, Subsection, ItemCategory,
    Course, RealVideo, QuizTopic, Quiz, EmergencyContact, ChatMessage, VastuExpert, VastuVideo,
    TempleDirectoryItem, MockCommunityUser, MockCommunityOrganization,
    UserProfileData, NotificationItem, Doctor, CommunityEntity, ChatHistory
} from './types';
import { 
    VastuServiceIcon, TempleIcon, YogaIcon, FoodIcon as FoodServiceIcon, 
    NewsIcon as NewsNavIcon, AkfPlaceholderIcon, EmergencyIcon as BottomNavEmergencyIcon, 
    LearnIcon, HomeIcon, JyotishServiceIcon, AlertCircleIcon, BellIcon, UsersIcon, BookOpenIcon
} from './constants'; 

// --- Hero Images & Videos ---
export const MOCK_HERO_IMAGES: HeroContent[] = [
  { type: 'image', url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1920&h=1080&auto=format&fit=crop&q=80', altText: 'Beautiful serene landscape with mountains and a lake', duration: 10000 },
  { 
    type: 'video', 
    url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', // Poster or fallback image
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', 
    altText: 'Short clip of Big Buck Bunny' 
    // Duration for videos is determined by the video itself
  },
  { type: 'image', url: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1920&h=1080&auto=format&fit=crop&q=80', altText: 'Wooden pier extending into a calm blue lake with misty mountains', duration: 8000 },
  { type: 'image', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1920&h=1080&auto=format&fit=crop&q=80', altText: 'Green hills under a blue sky with a winding road', duration: 10000 },
  { type: 'image', url: 'https://images.unsplash.com/photo-1609766418204-94aae0ecf4e5?w=1920&h=1080&auto=format&fit=crop&q=80', altText: 'Sun setting over a tranquil ocean with waves lapping the shore', duration: 12000 },
  { 
    type: 'video', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-shore-5856-large.mp4', // Poster
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-shore-5856-large.mp4', 
    altText: 'Calm waves on a shore' 
  },
  { type: 'image', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&auto=format&fit=crop&q=80', altText: 'Sunlight filtering through a dense forest canopy', duration: 10000 },
];


// --- Existing Mock Data (condensed for brevity) ---
export const MOCK_YOGA_PROGRAMS: YogaProgram[] = [
    { id: 'yoga1', title: 'Morning Flow Yoga', description: 'Start your day with energizing yoga poses for all.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop', level: 'beginner', duration: '30 min', instructor: 'Sarah Johnson', category: 'Hatha Yoga' },
    { id: 'yoga2', title: 'Power Vinyasa', description: 'Dynamic and challenging flow sequence to build strength.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop', level: 'advanced', duration: '60 min', instructor: 'Michael Chen', category: 'Vinyasa' },
];
export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
    { id: 1, title: 'বৈদিক শিক্ষার নতুন পাঠক্রম', summary: 'আগামী শিক্ষাবর্ষ থেকে বৈদিক শিক্ষার নতুন পাঠক্রম চালু করা হবে।', content: '...', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=200&fit=crop', date: 'Mar 15, 2024', views: '2.5K', category: 'Education' },
    { id: 2, title: 'সনাতন ধর্মের কর্মশালা', summary: 'আগামী সপ্তাহে অনুষ্ঠিত হবে সনাতন ধর্মের মূল্যবোধ শিক্ষা বিষয়ক কর্মশালা।', content: '...', image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=300&h=200&fit=crop', date: 'Mar 14, 2024', views: '1.8K', category: 'Event' },
];
export const MOCK_RECIPES: Recipe[] = [
    { id: 'food1', name: 'Sattvic Khichdi', category: 'sattvic', ingredients: [], instructions: [], imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop', cookingTime: '30 mins', difficulty: 'Easy', cuisine: 'Vedic' },
];
export const MOCK_TEMPLE_DESTINATIONS: PopularDestinationItem[] = [
    { id: 'temple1', name: 'Jagannath Temple, Puri', imageUrl: 'https://images.unsplash.com/photo-1587135960431-7f6515a0ae40?w=300&h=200&fit=crop', type: 'Temple' },
    { id: 'temple2', name: 'Kashi Vishwanath', imageUrl: 'https://images.unsplash.com/photo-1612765352888-912a2c00a4a0?w=300&h=200&fit=crop', type: 'Temple' },
];
export const MOCK_VASTU_TIPS: VastuTip[] = [
    { title: 'Main Entrance Vastu', icon: <VastuServiceIcon/>, category: 'entrance', tips: ['North-East entrance is auspicious.'] },
];
export const MOCK_JYOTISH_ITEMS: DailyHoroscopeItem[] = [
    { sign: 'Aries (मेष)', prediction: 'A favorable day ahead. New opportunities may arise.', lucky: { color: 'Red', number: '9', direction: 'North' } },
];

// --- Updated Mock Data for Vedic Texts with Sections, Subsections, and Verses ---
const rigvedaSukta1_1Verses: Verse[] = [
  { id: 'RV1.1.1', sanskritLines: ['अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।', 'होतारं रत्नधातमम् ॥'], devanagariLines: ['अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।', 'होतारं रत्नधातमम् ॥'], englishTranslation: 'I worship Agni, the foremost priest, the divine priest of the sacrifice, the invoker, the bestower of treasures.', bengaliTranslation: 'আমি অগ্নিদেবের পূজা করি, যিনি প্রধান পুরোহিত, যজ্ঞের দিব্য পুরোহিত, আহ্বানকারী এবং শ্রেষ্ঠ রত্ন প্রদানকারী।', humanVerifiedLanguages: ['bn']},
  { id: 'RV1.1.2', sanskritLines: ['अग्निः पूर्वेभिर्ऋषिभिरीड्यो नूतनैरुत ।', 'स देवाँ एह वक्षति ॥'], devanagariLines: ['अग्निः पूर्वेभिर्ऋषिभिरीड्यो नूतनैरुत ।', 'स देवाँ एह वक्षति ॥'], englishTranslation: 'Agni, worthy of worship by ancient and modern sages, may he bring the gods here.', bengaliTranslation: 'অগ্নিদেব প্রাচীন ও আধুনিক ঋষিগণের দ্বারা পূজিত হওয়ার যোগ্য, তিনি দেবতাদের এখানে আনয়ন করুন।'},
  { id: 'RV1.1.3', sanskritLines: ['अग्निना रयिमश्नवत्पोषमेव दिवेदिवे ।', 'यशसं वीरवत्तमम् ॥'], devanagariLines: ['अग्निना रयिमश्नवत्पोषमेव दिवेदिवे ।', 'यशसं वीरवत्तमम् ॥'], englishTranslation: 'Through Agni, one may obtain wealth and prosperity day by day, glorious and most abounding in heroes.', bengaliTranslation: 'অগ্নিদেবের মাধ্যমে প্রতিদিন ধন ও সমৃদ্ধি লাভ করা যায়, যা যশস্বী এবং বীরপুরুষে পরিপূর্ণ।'},
];

const rigvedaSukta1_2Verses: Verse[] = [
  { id: 'RV1.2.1', sanskritLines: ['वायवा याहि दर्शतेमे सोमा अरंकृताः ।', 'तेषां पाहि श्रुधी हवम् ॥'], devanagariLines: ['वायवा याहि दर्शतेमे सोमा अरंकृताः ।', 'तेषां पाहि श्रुधी हवम् ॥'], englishTranslation: 'O Vayu, come, beautiful to behold, these Soma juices are prepared. Drink of them, hear our call.', bengaliTranslation: 'হে বায়ু, এসো, তুমি দর্শনীয়, এই সোমরস প্রস্তুত। এগুলি পান কর, আমাদের আহ্বান শোনো।', humanVerifiedLanguages: ['en']},
];

const rigvedaMandala1Subsections: Subsection[] = [
  { id: 'RV1.1', title: 'Sukta 1 (సూక్తం ౧)', description: 'Hymn to Agni', verses: rigvedaSukta1_1Verses },
  { id: 'RV1.2', title: 'Sukta 2 (సూక్తం ౨)', description: 'Hymn to Vayu', verses: rigvedaSukta1_2Verses },
];

const rigvedaMandala2Subsections: Subsection[] = [
    { id: 'RV2.1', title: 'Sukta 1 (Mandala 2)', description: 'Hymn to Agni (Mandala 2)', verses: [
        { id: 'RV2.1.1', sanskritLines: ['त्वमग्ने द्युभिस्त्वमाशुशुक्षणिस्त्वमद्भ्यस्त्वमश्मनस्परि ।', 'त्वं वनेभ्यस्त्वमोषधीभ्यस्त्वं नृणां नृपते जायसे शुचिः ॥'], devanagariLines: ['त्वमग्ने द्युभिस्त्वमाशुशुक्षणिस्त्वमद्भ्यस्त्वमश्मनस्परि ।', 'त्वं वनेभ्यस्त्वमोषधीभ्यस्त्वं नृणां नृपते जायसे शुचिः ॥'], englishTranslation: 'You, Agni, through the days, you are the swift kindler, you are from the waters, you are from the stone. You are from the forests, you are from the plants, you, O Lord of men, are born pure.', bengaliTranslation: 'হে অগ্নি, তুমি দিনের আলোতে, তুমি দ্রুত প্রজ্বলিত হও, তুমি জল থেকে, তুমি পাথর থেকে। তুমি বন থেকে, তুমি ঔষধি থেকে, হে মনুষ্যদের অধিপতি, তুমি পবিত্ররূপে জন্মগ্রহণ কর।'},
    ] },
];


export const MOCK_VEDIC_TEXTS: VedicText[] = [
  {
    id: 'rigveda',
    title: 'Rigveda',
    subtitle: 'ऋग्वेदः',
    description: 'The Rigveda is an ancient Indian collection of Vedic Sanskrit hymns. It is one of the four sacred canonical texts (śruti) of Hinduism known as the Vedas.',
    imageUrl: 'https://images.unsplash.com/photo-1593189000899-766a7f0e6f5d?w=400&h=300&fit=crop&q=75&seed=rigveda',
    sectionLevelName: 'Mandala',
    subsectionLevelName: 'Sukta',
    verseLevelName: 'Mantra',
    sections: [
      { id: 'RV1', title: 'Mandala 1 (మండలం ౧)', description: 'First book of Rigveda', subsections: rigvedaMandala1Subsections },
      { id: 'RV2', title: 'Mandala 2 (మండలం ౨)', description: 'Second book of Rigveda', subsections: rigvedaMandala2Subsections },
    ],
  },
  {
    id: 'samaveda',
    title: 'Samaveda',
    subtitle: 'सामवेदः',
    description: 'The Samaveda is the Veda of melodies and chants. It is an ancient Vedic Sanskrit text, and part of the scriptures of Hinduism.',
    imageUrl: 'https://images.unsplash.com/photo-1604523307950-592d39ed72c7?w=400&h=300&fit=crop&q=75&seed=samaveda',
    sectionLevelName: 'Archika',
    subsectionLevelName: 'Chapter',
    verseLevelName: 'Mantra',
    sections: [
        { id: 'SV_P1', title: 'Purvarchika', subsections: [
            { id: 'SV_P1_CH1', title: 'Chapter 1', verses: [
                 { id: 'SV1.1.1', sanskritLines: ['अग्न आ याहि वीतये गृणानो हव्यदातये ।', 'नि होता सत्सि बर्हिषि ॥'], devanagariLines: ['अग्न आ याहि वीतये गृणानो हव्यदातये ।', 'नि होता सत्सि बर्हिषि ॥'], englishTranslation: 'O Agni, come for our delight, praised, to the gift of sacrifice. Sit as priest on the sacred grass.', bengaliTranslation: 'হে অগ্নি, আমাদের আনন্দের জন্য এসো, প্রশংসিত হয়ে, যজ্ঞের নৈবেদ্য গ্রহণের জন্য। পবিত্র কুশের উপর পুরোহিত রূপে উপবেশন কর।', humanVerifiedLanguages: ['bn']},
            ]}
        ]}
    ],
  },
  {
    id: 'yajurveda',
    title: 'Yajurveda',
    subtitle: 'यजुर्वेदः',
    description: 'The Yajurveda is the Veda of prose mantras. An ancient Vedic Sanskrit text, it is a compilation of ritual-offering formulas that were said by a priest while an individual performed ritual actions.',
    imageUrl: 'https://images.unsplash.com/photo-1602796497500-cf787343e0fc?w=400&h=300&fit=crop&q=75&seed=yajurveda',
    sectionLevelName: 'Kanda',
    subsectionLevelName: 'Prapathaka',
    verseLevelName: 'Mantra',
     sections: [
        { id: 'YV_CH1', title: 'Kanda 1', subsections: [
            { id: 'YV_CH1_S1', title: 'Prapathaka 1', verses: [
                { id: 'YV.VS.1.1', sanskritLines: ['इषे त्वोर्जे त्वा वायव स्थ देवो वः सविता प्रार्पयतु श्रेष्ठतमाय कर्मणे ॥'], devanagariLines: ['इषे त्वोर्जे त्वा वायव स्थ देवो वः सविता प्रार्पयतु श्रेष्ठतमाय कर्मणे ॥'], englishTranslation: 'For food, for strength, you (branches) are. May Vayu (be with you). May god Savitr impel you to the noblest work.', bengaliTranslation: 'খাদ্যের জন্য, শক্তির জন্য তোমরা (শাখা)। বায়ু (তোমাদের সঙ্গে থাকুক)। দেবতা সবিতা তোমাদের শ্রেষ্ঠতম কর্মে প্রবৃত্ত করুন।', humanVerifiedLanguages: ['en', 'bn']},
            ]}
        ]}
    ],
  },
  {
    id: 'atharvaveda',
    title: 'Atharvaveda',
    subtitle: 'अथर्ववेदः',
    description: 'The Atharvaveda is a Vedic-era collection of spells, prayers, charms, and hymns.',
    imageUrl: 'https://images.unsplash.com/photo-1546890924-887a7751fd5b?w=400&h=300&fit=crop&q=75&seed=atharvaveda',
    sectionLevelName: 'Kanda',
    subsectionLevelName: 'Sukta',
    verseLevelName: 'Mantra',
    sections: [
        { id: 'AV_K1', title: 'Kanda 1', subsections: [
            { id: 'AV_K1_S1', title: 'Sukta 1', verses: [
                 { id: 'AV1.1.1', sanskritLines: ['शं नो देवीरभिष्टय आपो भवन्तु पीतये ।', 'शं योरभि स्रवन्तु नः ॥'], devanagariLines: ['शं नो देवीरभिष्टय आपो भवन्तु पीतये ।', 'शं योरभि स्रवन्तु नः ॥'], englishTranslation: 'Auspicious be the divine waters for our protection, for our drink. Auspicious and favorable, may they flow upon us.', bengaliTranslation: 'আমাদের রক্ষার জন্য, আমাদের পানের জন্য দিব্য জলসমূহ মঙ্গলময় হোক। মঙ্গলময় ও অনুকূল হয়ে, তারা আমাদের উপর প্রবাহিত হোক।'},
            ]}
        ]}
    ],
  },
  {
    id: 'manusmriti',
    title: 'Manusmriti',
    subtitle: 'मनुस्मृतिः',
    description: 'The Manusmriti (Laws of Manu) is an ancient legal text and constitution among the many Dharmaśāstras of Hinduism.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&q=75&seed=ancienttext',
    sectionLevelName: 'Adhyaya',
    subsectionLevelName: 'Section',
    verseLevelName: 'Shloka',
    sections: [
      { id: 'MS_CH2', title: 'Adhyaya 2: Sources of Dharma', subsections: [
        { id: 'MS_CH2_S1', title: 'Verses 6-13', verses: [
          { id: 'MS2.6', sanskritLines: ['वेदोऽखिलो धर्ममूलं स्मृतिशीले च तद्विदाम् ।', 'आचारश्चैव साधूनामात्मनस्तुष्टिरेव च ॥'], devanagariLines: ['वेदोऽखिलो धर्ममूलं स्मृतिशीले च तद्विदाम् ।', 'आचारश्चैव साधूनामात्मनस्तुष्टिरेव च ॥'], englishTranslation: 'The entire Veda is the (first) source of the sacred law, next the tradition and the virtuous conduct of those who know the (Veda), also the customs of holy men, and (finally) self-satisfaction.', bengaliTranslation: 'সম্পূর্ণ বেদই ধর্মের মূল উৎস, তারপর বেদজ্ঞদের স্মৃতি ও সদাচার, সজ্জনের আচার এবং আত্মতৃপ্তিও (ধর্মের প্রমাণ)।'},
          { id: 'MS2.13', sanskritLines: ['ऊर्ध्वं प्राणा ह्युत्क्रामन्ति यूनः स्थविर आयति ।', 'प्रत्युत्थानाभिवादाभ्यां पुनस्तान्प्रतिपद्यते ॥'], devanagariLines: ['ऊर्ध्वं प्राणा ह्युत्क्रामन्ति यूनः स्थविर आयति ।', 'प्रत्युत्थानाभिवादाभ्यां पुनस्तान्प्रतिपद्यते ॥'], englishTranslation: 'The vital airs of a young man mount upwards to leave his body when an elder approaches; but by rising to meet him and saluting he recovers them.', bengaliTranslation: 'বৃদ্ধ ব্যক্তি আসলে যুবকের প্রাণবায়ু ঊর্ধ্বগামী হয় (অর্থাৎ শরীর ত্যাগ করতে উদ্যত হয়); কিন্তু উঠে দাঁড়িয়ে অভিবাদন করলে সে পুনরায় সেই প্রাণবায়ু লাভ করে।'},
        ]}
      ]}
    ],
  },
  {
    id: 'gita',
    title: 'Bhagavad Gita',
    subtitle: 'श्रीमद्भगवद्गीता',
    description: 'The Bhagavad Gita ("Song of God") is a 700-verse Hindu scripture that is part of the epic Mahabharata.',
    imageUrl: 'https://images.unsplash.com/photo-1609605190928-144c8b2b51f7?w=400&h=300&fit=crop&q=75&seed=gita',
    sectionLevelName: 'Adhyaya',
    subsectionLevelName: 'Section', // Gita can be by verse groups
    verseLevelName: 'Shloka',
    sections: [
      { id: 'BG_CH2', title: 'Adhyaya 2: Sankhya Yoga', subsections: [
        { id: 'BG_CH2_S1', title: 'Verses 47-50', verses: [
          { id: 'BG2.47', sanskritLines: ['कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।', 'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥'], devanagariLines: ['कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।', 'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥'], englishTranslation: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.', bengaliTranslation: 'তোমার কর্মেই অধিকার, ফলে কখনও নয়। কর্মফলের হেতু হয়ো না, অকর্মণ্যতায়ও যেন তোমার আসক্তি না থাকে।', humanVerifiedLanguages: ['en', 'bn']},
        ]}
      ]},
      { id: 'BG_CH18', title: 'Adhyaya 18: Moksha Sannyasa Yoga', subsections: [
        { id: 'BG_CH18_S1', title: 'Verse 66', verses: [ 
           { id: 'BG18.66', sanskritLines: ['सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।', 'अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥'], devanagariLines: ['सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।', 'अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥'], englishTranslation: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions; do not fear.', bengaliTranslation: 'সকল প্রকার ধর্ম পরিত্যাগ করে কেবলমাত্র আমার शरण নাও। আমি তোমাকে সকল পাপ থেকে মুক্ত করব, শোক করো না।', humanVerifiedLanguages: ['en', 'bn']},
        ]}
      ]}
    ],
  },
];

// --- Mock data for Community Connect Page ---
export const MOCK_COMMUNITY_USERS: MockCommunityUser[] = [
  { id: 'user1', name: 'Rohan Sharma', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&q=60', description: "Student of Vedanta" },
  { id: 'user2', name: 'Priya Patel', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29130?w=100&h=100&fit=crop&q=60', description: "Yoga Practitioner" },
  { id: 'user3', name: 'Amit Das', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=60', description: "Interested in Dharma" },
];

export const MOCK_COMMUNITY_ORGANIZATIONS: MockCommunityOrganization[] = [
  { id: 'org1', name: 'Vedic Study Circle', description: 'Weekly discussions and study groups on Vedic texts.', avatarUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=100&h=100&fit=crop&q=60' },
  { id: 'org2', name: 'Community Kitchen Sewa', description: 'Serving free meals to the needy every Sunday.', avatarUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=100&h=100&fit=crop&q=60' },
  { id: 'org3', name: 'Yoga & Meditation Center', description: 'Daily classes for all levels.', avatarUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop&q=60' },
];

// --- Mock User Profile Data ---
export const MOCK_USER_PROFILE_DATA: UserProfileData = {
  id: 'guestuser001', // Default guest ID
  name: 'Guest User',
  email: 'guest@example.com',
  avatarUrl: 'https://avatar.iran.liara.run/username?username=Guest+User', // Default avatar
  joinDate: new Date().toLocaleDateString(), // Today's date for guest
  bio: 'Exploring Vedic wisdom as a guest.',
  stats: {
    mantrasSaved: 0,
    quizzesTaken: 0,
    articlesRead: 0,
  },
  country: '',
  state: '',
  city: '',
  village: '',
  phone: '',
  dob: '',
  preferredLanguage: 'en', // Default language
};

// --- Mock Notifications Data ---
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'content',
    title: 'New Article: The Essence of Upanishads',
    message: 'Explore the profound teachings of the Upanishads in our latest article.',
    timestamp: '2 hours ago',
    isRead: false,
    icon: <NewsNavIcon className="w-5 h-5 text-blue-400" />,
    link: '#news/article/essence-of-upanishads'
  },
  {
    id: '2',
    type: 'community',
    title: 'Community Event: Online Satsang this Sunday',
    message: 'Join us for an online satsang session this Sunday at 10 AM. Link will be shared soon.',
    timestamp: '1 day ago',
    isRead: true,
    icon: <UsersIcon className="w-5 h-5 text-green-400" />,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Profile Update Required',
    message: 'Please update your profile information for a better experience.',
    timestamp: '3 days ago',
    isRead: false,
    icon: <AlertCircleIcon className="w-5 h-5 text-yellow-400" />,
  },
  {
    id: '4',
    type: 'info',
    title: 'Mantra of the Day: Om Namah Shivaya',
    message: 'Chant this powerful mantra for peace and clarity.',
    timestamp: 'Mar 15, 2024',
    isRead: true,
    icon: <BookOpenIcon className="w-5 h-5 text-purple-400" />,
  },
   {
    id: '5',
    type: 'content',
    title: 'Vastu Tip: Entrance Significance',
    message: 'Learn about the Vastu importance of your home entrance in our new Vastu guide.',
    timestamp: 'Mar 14, 2024',
    isRead: false,
    icon: <VastuServiceIcon className="w-5 h-5 text-indigo-400" />,
  },
];

// --- Mock Doctors for Consultancy Page ---
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    speciality: 'Ayurvedic Physician',
    experience: '15 years',
    rating: 4.9,
    nextAvailable: '10:00 AM Tomorrow',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&q=60',
    price: '2000',
    category: 'Ayurvedic'
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    speciality: 'Yoga Therapist',
    experience: '12 years',
    rating: 4.8,
    nextAvailable: '2:30 PM Today',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&q=60',
    price: '1800',
    category: 'Yoga'
  },
  {
    id: 3,
    name: 'Dr. Amit Patel',
    speciality: 'Mental Health Specialist',
    experience: '10 years',
    rating: 4.7,
    nextAvailable: '11:15 AM Today',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&q=60',
    price: '2200',
    category: 'Mental Health'
  },
  {
    id: 4,
    name: 'Dr. Sunita Singh',
    speciality: 'Family Counselor',
    experience: '18 years',
    rating: 4.9,
    nextAvailable: '4:00 PM Today',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop&q=60',
    price: '2500',
    category: 'Family'
  },
  {
    id: 5,
    name: 'Dr. Arjun Mehta',
    speciality: 'Relationship Coach',
    experience: '9 years',
    rating: 4.6,
    nextAvailable: '9:00 AM Tomorrow',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&q=60',
    price: '1900',
    category: 'Relationship'
  }
];

// --- Mock Contacted Profiles for AKF Page ---
export const MOCK_CONTACTED_PROFILES: CommunityEntity[] = [
  { ...MOCK_COMMUNITY_USERS[0], type: 'user' },
  { ...MOCK_COMMUNITY_ORGANIZATIONS[0], type: 'organization'},
  { ...MOCK_COMMUNITY_USERS[1], type: 'user'},
  { ...MOCK_TEMPLE_DESTINATIONS[0], type: 'temple', avatarUrl: MOCK_TEMPLE_DESTINATIONS[0].imageUrl, description: MOCK_TEMPLE_DESTINATIONS[0].type},
];

// --- Mock Chat History for AKF Page ---
export const MOCK_CHAT_HISTORY: ChatHistory = {
  [MOCK_CONTACTED_PROFILES[0].id]: [
    { role: 'user', content: 'Namaste! Interested in your Vedanta study group.' },
    { role: 'assistant', content: 'Namaste! Thank you for your interest. Our group meets every Saturday at 5 PM. Would you like more details?' },
    { role: 'user', content: 'Yes, please. What topics do you usually cover?' },
  ],
  [MOCK_CONTACTED_PROFILES[1].id]: [
    { role: 'assistant', content: 'Welcome to Vedic Study Circle! How can we help you today?' },
    { role: 'user', content: 'I would like to know more about your weekly discussions.' },
  ],
  [MOCK_CONTACTED_PROFILES[2].id]: [
    { role: 'user', content: 'Hello Priya, I saw your profile on the community hub.' },
    { role: 'assistant', content: 'Hello! Nice to meet you. How can I help?' },
  ],
   [MOCK_CONTACTED_PROFILES[3].id]: [
    { role: 'user', content: 'Inquiring about darshan timings at Jagannath Temple.' },
    { role: 'assistant', content: 'Darshan timings are generally from 6 AM to 9 PM. Please check the official website for specific festival days.' },
  ],
};
