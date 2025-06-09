import React, { useState, useEffect, useRef } from 'react';
import {
  SearchLucideIcon,
  XIcon,
  MessageSquareIcon,
  Trash2Icon,
  HomeIcon, 
  LearnIcon as LearnNavIcon, 
  AkfPlaceholderIcon, 
  NewsIcon as NewsNavIcon, 
  EmergencyIcon as EmergencyNavIcon,
  ClockIcon,
  SendIcon, 
  SendRequestIcon, // Added import
  CheckCircleIcon as AcceptIcon,
  XCircleIcon as DeclineIcon,
  UserProfileIcon,
  LandmarkIcon,
  TempleIcon,
  SchoolIcon, 
  QuestionMarkIcon,
  ExternalLinkIcon,
  LoaderIcon 
} from '../constants';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar'; 
import { NavItem, CommunityEntity, ChatMessage as AppChatMessage, CommunityEntityType } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MOCK_CONTACTED_PROFILES, MOCK_CHAT_HISTORY, MOCK_COMMUNITY_USERS, MOCK_COMMUNITY_ORGANIZATIONS, MOCK_TEMPLE_DESTINATIONS } from '../mockData';

interface ChatMessage extends AppChatMessage {
  timestamp?: number; 
}

interface AkfPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void;
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const allSearchableEntities: CommunityEntity[] = [
  ...MOCK_COMMUNITY_USERS.map(u => ({ ...u, type: 'user' as CommunityEntityType, description: u.description || 'Vedic Community User' })),
  ...MOCK_COMMUNITY_ORGANIZATIONS.map(o => ({ ...o, type: 'organization' as CommunityEntityType, description: o.description || 'Community Organization' })),
  ...MOCK_TEMPLE_DESTINATIONS.map(t => ({ id: t.id, name: t.name, type: 'temple' as CommunityEntityType, avatarUrl: t.imageUrl, description: t.type })),
  { id: 'gurukul1', name: 'Ananda Vedic Gurukul', type: 'organization' as CommunityEntityType, avatarUrl: 'https://images.unsplash.com/photo-1542649760-a08c40361a02?w=100&h=100&fit=crop&q=60&seed=gurukul1', description: 'Traditional Vedic Education Center' },
  { id: 'gurukul2', name: 'Patanjali Yoga Gurukul', type: 'organization' as CommunityEntityType, avatarUrl: 'https://images.unsplash.com/photo-1593697821039-551595cb450b?w=100&h=100&fit=crop&q=60&seed=gurukul2', description: 'Yoga and Philosophy Studies' }
];

const WEBSITE_URL = "https://www.akfbd.org";

const AkfPage: React.FC<AkfPageProps> = ({
  onNavigateHome,
  onNavigateLearn,
  onNavigateNews,
  onNavigateEmergency,
}) => {
  // ... rest of the component code ...
};

export default AkfPage;