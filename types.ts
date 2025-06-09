
import React from 'react';

export interface HeroContent {
  type: 'image' | 'video';
  url: string; // For images, src. For videos, can be a poster or src.
  videoUrl?: string; // Specific URL for video source
  altText?: string; 
  duration?: number; // For images, duration in ms (e.g., 10000 for 10s)
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode; 
}

export interface PopularDestinationItem {
  id:string;
  name: string; 
  imageUrl: string;
  type: string; 
}

export interface RecommendedItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface NavItem {
  id: string;
  name: string; 
  label?: string; 
  icon: React.ReactElement<{ className?: string }>; 
  onClick?: () => void;
}

export interface YogaProgram {
  id: string;
  title: string;
  description: string;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced' | string; 
  duration: string;
  instructor: string;
  category: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  views: string;
  category: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string; 
  ingredients: string[];
  instructions: string[];
  imageUrl: string; 
  cookingTime: string;
  difficulty: string; 
  cuisine: string; 
}

export interface EmergencyContact {
  name: string;
  number: string;
  available: string;
  type: 'call' | 'whatsapp';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  provider?: 'deepseek' | 'gemini'; 
}

export interface Course {
  title: string;
  description: string;
  duration: string;
  progress: number;
  image: string;
  lastLesson: string;
}

export interface RealVideo {
  title: string;
  duration: string;
  instructor: string;
  views: string;
  thumbnail: string;
  videoUrl: string;
}

export interface QuizTopic {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  userAnswerIndex?: number; 
}

export interface Quiz {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: QuizQuestion[];
}

export interface VedicDate {
  vikramYear: number;
  month: string;
  paksha: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vara: string; 
  ayana: string;
  ritu: string;
}

export interface VastuTip {
  title: string;
  icon: React.ReactElement<{ className?: string }>;
  category: string;
  tips: string[];
}

export interface VastuExpert {
  id: number;
  name: string;
  speciality: string;
  experience: string;
  rating: number;
  price: string;
  image: string;
  nextAvailable: string;
}

export interface VastuVideo {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  views: string;
}

export interface DailyHoroscopeItem {
  sign: string;
  prediction: string;
  lucky: {
    color: string;
    number: string;
    direction: string;
  };
}

export interface TempleDirectoryItem {
  type: 'temple' | 'org' | 'gurukul' | string; 
  name: string;
  image: string;
  location: string;
  rating: number;
  description: string;
  userId: string; 
  contactName?: string; 
}

export type ItemCategory = 'temple' | 'news' | 'yoga' | 'food' | 'vastu' | 'jyotish' | 'service' | 'other' | 'veda' | 'consultancy';

export interface SearchResultItem {
  id: string;
  category: ItemCategory;
  title: string;
  description?: string;
  imageUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalData: any; 
  onClick?: () => void; 
}

export interface FilterOption {
  id: ItemCategory | 'all';
  name: string;
  icon?: React.ReactElement<{ className?: string }>; 
}

export interface VerseTranslation {
  pada?: string;
  padartha?: string;
  bhavartha?: string;
}
export interface Verse {
  id: string; 
  sanskritLines: string[]; 
  devanagariLines?: string[]; 
  englishTranslation?: string; 
  bengaliTranslation?: string; 
  aiTranslations?: Record<string, VerseTranslation>; 
  humanVerifiedLanguages?: string[]; 
  notes?: string;
}

export interface Subsection {
  id: string; 
  title: string; 
  description?: string;
  verses: Verse[];
}

export interface Section {
  id: string; 
  title: string; 
  description?: string;
  subsections: Subsection[];
}

export interface VedicText {
  id: 'rigveda' | 'samaveda' | 'yajurveda' | 'atharvaveda' | 'manusmriti' | 'gita' | string; 
  title: string; 
  subtitle?: string; 
  description: string; 
  imageUrl: string; 
  sections: Section[]; 
  sectionLevelName?: string; 
  subsectionLevelName?: string; 
  verseLevelName?: string; 
}

export type CommunityEntityType = 'user' | 'organization' | 'temple';

export interface CommunitySearchResultItem {
  id: string;
  name: string;
  type: CommunityEntityType;
  avatarUrl?: string; 
  description?: string; 
}

export interface CommunityEntity extends CommunitySearchResultItem {
   // description made optional in CommunitySearchResultItem
}

export interface MockCommunityUser {
    id: string; 
    name: string;
    avatarUrl?: string;
    description?: string; // Added for consistency if a user profile has a bio
}

export interface MockCommunityOrganization {
    id: string; 
    name: string;
    description: string;
    avatarUrl?: string; 
}

export interface NotificationItem {
  id: string;
  type: 'alert' | 'info' | 'community' | 'content';
  title: string;
  message: string;
  timestamp: string; 
  isRead: boolean;
  link?: string; 
  icon?: React.ReactElement; 
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  joinDate: string;
  bio?: string;
  stats?: {
    mantrasSaved?: number;
    quizzesTaken?: number;
    articlesRead?: number;
  };
  country?: string;
  state?: string;
  city?: string;
  village?: string;
  phone?: string;
  dob?: string; // Date of Birth
  preferredLanguage?: string; // Language code
}

export interface ProjectItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  budget: number; 
  collectedAmount: number; 
  deadlineDays: number; 
}

export interface LanguageOption { // Used in VedaReaderPage for its own language selection
  code: string; 
  name: string; 
}

export interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: string;
  rating: number;
  nextAvailable: string;
  image: string;
  price: string; 
  category: string; 
}

// UI String Types for i18n
export type UIStrings = {
  [key: string]: string;
};

export type AllTranslations = {
  [langCode: string]: UIStrings;
};

// --- Auth Types ---
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null; // For Google Sign-in
  // Add other app-specific user fields that are part of UserProfileData
  country?: string;
  state?: string;
  city?: string;
  village?: string;
  phone?: string;
  dob?: string;
  preferredLanguage?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoadingAuth: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<User | null>;
  signupWithEmail: (userData: Omit<UserProfileData, 'id' | 'joinDate' | 'stats' | 'avatarUrl'> & {password: string}) => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>; 
  sendOtp: (method: 'email' | 'phone', recipient: string) => Promise<boolean>;
}

// --- Report Types ---
export type ReportReason = 'incorrect_sanskrit' | 'incorrect_translation' | 'offensive_content' | 'technical_issue' | 'other';

export interface ReportSubmission {
  verseId: string;
  reason: ReportReason;
  feedback: string;
  timestamp: string;
}

// --- Chat History Type for AKF Page ---
export type ChatHistory = Record<string, ChatMessage[]>;
