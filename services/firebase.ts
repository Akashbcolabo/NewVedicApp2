
import { User, UserProfileData } from '../types';

// Mock Supabase client for local development if not fully set up
interface MockSupabaseQueryBuilder {
  select: (columns?: string) => MockSupabaseQueryBuilder;
  eq: (column: string, value: any) => MockSupabaseQueryBuilder;
  single: () => Promise<{ data: any | null; error: any | null }>;
}

interface MockSupabaseClient {
  from: (table: string) => MockSupabaseQueryBuilder;
}

export const supabase: MockSupabaseClient = {
  from: (table: string) => ({
    select: function(columns: string = '*') { return this; },
    eq: function(column: string, value: any) { return this; },
    single: async function() {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (table === 'hero_content') { /* ... (hero content mock) ... */ }
      return { data: null, error: { message: "Mock error: Row not found", code: "PGRST116" } };
    }
  })
};

// --- Mock Firebase Auth ---
export let mockUserDatabase: UserProfileData[] = [];

export const saveMockUser = (userData: UserProfileData): void => {
  const existingUserIndex = mockUserDatabase.findIndex(u => u.email === userData.email);
  if (existingUserIndex > -1) {
    mockUserDatabase[existingUserIndex] = { ...mockUserDatabase[existingUserIndex], ...userData };
  } else {
    mockUserDatabase.push(userData);
  }
};

export const getMockUserByEmail = (email: string): User | null => {
    const profileData = mockUserDatabase.find(u => u.email === email);
    if (profileData) {
        return {
            uid: profileData.id,
            email: profileData.email,
            displayName: profileData.name,
            photoURL: profileData.avatarUrl, // This maps avatarUrl to photoURL
            // Map other fields from UserProfileData to User if needed for currentUser
            country: profileData.country,
            state: profileData.state,
            city: profileData.city,
            village: profileData.village,
            phone: profileData.phone,
            dob: profileData.dob,
            preferredLanguage: profileData.preferredLanguage,
        };
    }
    return null;
};


let mockOtpStore: { [recipient: string]: string } = {}; // Store OTPs by email/phone

export const mockSendOtp = async (method: 'email' | 'phone', recipient: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate sending
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    mockOtpStore[recipient] = otp;
    console.log(`Mock OTP for ${recipient} (${method}): ${otp}`);
    alert(`(Mock) OTP sent to ${recipient}: ${otp}`); // For testing
    return true;
};

export const mockVerifyOtp = async (otp: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate verification
    // In a real scenario, you'd check against the recipient (email/phone)
    // For this simple mock, just check if the OTP exists in the store
    const isValid = Object.values(mockOtpStore).includes(otp);
    if (isValid) {
        // Clear OTP after successful verification (optional, depends on real system)
        const recipient = Object.keys(mockOtpStore).find(key => mockOtpStore[key] === otp);
        if (recipient) delete mockOtpStore[recipient];
    }
    return isValid;
};


export const auth = {
  currentUser: null as User | null, 
  
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    console.warn("Mock onAuthStateChanged called. AuthContext is primary for currentUser.");
    let _currentUserInternal: User | null = auth.currentUser; 
    const interval = setInterval(() => {
        if (auth.currentUser !== _currentUserInternal) {
             _currentUserInternal = auth.currentUser;
             callback(_currentUserInternal);
        }
    }, 1000);
    return () => clearInterval(interval);
  },

  signInWithEmailAndPassword: async (email: string, pass: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    const userProfile = mockUserDatabase.find(u => u.email === email);
    // @ts-ignore - In a real Firebase, password is not stored directly on user profile
    if (userProfile && userProfile.password === pass) {
      const loggedInUser: User = { 
        uid: userProfile.id, 
        email: userProfile.email, 
        displayName: userProfile.name, 
        photoURL: userProfile.avatarUrl, // Ensure photoURL is set
        country: userProfile.country,
        state: userProfile.state,
        city: userProfile.city,
        village: userProfile.village,
        phone: userProfile.phone,
        dob: userProfile.dob,
        preferredLanguage: userProfile.preferredLanguage,
      };
      auth.currentUser = loggedInUser;
      return auth.currentUser;
    }
    throw { code: 'auth/invalid-credential', message: 'Invalid email or password.' };
  },

  createUserWithEmailAndPassword: async (email: string, pass: string, profileData: Omit<UserProfileData, 'id' | 'joinDate' | 'stats' | 'avatarUrl'>): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (mockUserDatabase.some(u => u.email === email)) {
      throw { code: 'auth/email-already-in-use', message: 'Email already in use.' };
    }
    const newUserId = `mock-uid-${Date.now()}`;
    const newUserProfile: UserProfileData = {
      id: newUserId,
      ...profileData, // name, email, country, etc.
      // @ts-ignore
      password: pass, // Storing password for mock login; NOT FOR PRODUCTION
      joinDate: new Date().toLocaleDateString(),
      avatarUrl: `https://avatar.iran.liara.run/username?username=${encodeURIComponent(profileData.name || 'User')}`, // Generic avatar
      stats: { mantrasSaved: 0, quizzesTaken: 0, articlesRead: 0 },
    };
    saveMockUser(newUserProfile);
    // Don't set auth.currentUser here, OTP verification will handle "logging in"
    // Return a User-like object for the OTP step to know who is verifying
    return { 
        uid: newUserId, 
        email: newUserProfile.email, 
        displayName: newUserProfile.name, 
        photoURL: newUserProfile.avatarUrl, // Ensure photoURL is set
        country: newUserProfile.country,
        state: newUserProfile.state,
        city: newUserProfile.city,
        village: newUserProfile.village,
        phone: newUserProfile.phone,
        dob: newUserProfile.dob,
        preferredLanguage: newUserProfile.preferredLanguage,
    };
  },

  signInWithPopup: async (): Promise<User | null> => { // Simulates Google Sign-In
    await new Promise(resolve => setTimeout(resolve, 1000));
    const googleUserInitial: Omit<User, 'uid'> & {uid?: string} = { // uid is optional initially from Google response
      email: 'google.user@example.com',
      displayName: 'Google User',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29130?w=100&h=100&fit=crop', 
      country: 'USA',
      preferredLanguage: 'en',
    };
    const googleUid = `mock-google-uid-${Date.now()}`;

    // Check if this Google user exists in our mock DB, if not, "create" them
    let userProfile = mockUserDatabase.find(u => u.email === googleUserInitial.email);
    if (!userProfile) {
        const newUserProfile: UserProfileData = {
            id: googleUid,
            name: googleUserInitial.displayName || 'Google User',
            email: googleUserInitial.email!,
            avatarUrl: googleUserInitial.photoURL || `https://avatar.iran.liara.run/username?username=Google+User`,
            joinDate: new Date().toLocaleDateString(),
            country: googleUserInitial.country,
            preferredLanguage: googleUserInitial.preferredLanguage,
            stats: { mantrasSaved: 0, quizzesTaken: 0, articlesRead: 0 },
        };
        saveMockUser(newUserProfile);
        userProfile = newUserProfile;
    }
    
    const finalUser: User = {
        uid: userProfile.id, // Use ID from our database (could be new or existing)
        email: userProfile.email,
        displayName: userProfile.name,
        photoURL: userProfile.avatarUrl, // Ensure this is mapped from avatarUrl
        country: userProfile.country,
        state: userProfile.state,
        city: userProfile.city,
        village: userProfile.village,
        phone: userProfile.phone,
        dob: userProfile.dob,
        preferredLanguage: userProfile.preferredLanguage,
    };
    auth.currentUser = finalUser;
    return auth.currentUser;
  },

  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    auth.currentUser = null;
    return Promise.resolve();
  },
  
  sendEmailVerification: async (): Promise<void> => {
    console.log("Mock: Email verification sent (simulated).");
    return Promise.resolve();
  }
};

console.log("Using MOCK Supabase and Firebase clients with enhanced auth.");
