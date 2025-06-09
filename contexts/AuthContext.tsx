import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserProfileData } from '../types';
import { auth as firebaseAuth, mockUserDatabase, saveMockUser, getMockUserByEmail, mockSendOtp, mockVerifyOtp } from '../services/firebase'; // Assuming firebase.ts exports these

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Check for persisted user (e.g., from localStorage in a real app)
    const storedUser = localStorage.getItem('vedicAppUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Basic validation if it's a User object
        if (parsedUser && parsedUser.uid && parsedUser.email) {
           setCurrentUser(parsedUser);
        } else {
            localStorage.removeItem('vedicAppUser'); // Clear invalid stored user
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('vedicAppUser');
      }
    }
    setIsLoadingAuth(false);

    // Mock Firebase onAuthStateChanged
    // const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
    //   setCurrentUser(user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null);
    //   setIsLoadingAuth(false);
    // });
    // return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setIsLoadingAuth(true);
    try {
      const user = await firebaseAuth.signInWithEmailAndPassword(email, pass);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('vedicAppUser', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow to be caught by UI
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signupWithEmail = async (userDataWithPassword: Omit<UserProfileData, 'id' | 'joinDate' | 'stats' | 'avatarUrl'> & {password: string}): Promise<User | null> => {
    setIsLoadingAuth(true);
    const { password, ...userData } = userDataWithPassword;
    try {
      const user = await firebaseAuth.createUserWithEmailAndPassword(userData.email, password, userData);
      if (user) {
        // setCurrentUser(user); // Don't set current user until OTP verified
        // localStorage.setItem('vedicAppUser', JSON.stringify(user));
        return user; // Return the created user, OTP step will follow
      }
      return null;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };
  
  const loginWithGoogle = async (): Promise<User | null> => {
    setIsLoadingAuth(true);
    try {
      const user = await firebaseAuth.signInWithPopup();
       if (user) {
        setCurrentUser(user);
        localStorage.setItem('vedicAppUser', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // const signupWithGoogle = loginWithGoogle; // Often the same flow

  const logout = async (): Promise<void> => {
    setIsLoadingAuth(true);
    try {
      await firebaseAuth.signOut();
      setCurrentUser(null);
      localStorage.removeItem('vedicAppUser');
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const sendOtp = async (method: 'email' | 'phone', recipient: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const success = await mockSendOtp(method, recipient);
      return success;
    } catch (error) {
      console.error("Send OTP failed:", error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const success = await mockVerifyOtp(otp);
      if (success) {
        // If OTP is successful, we'd typically fully log in the user.
        // For this mock, if there was a pending signup, we'd retrieve that user.
        // This part needs careful handling based on how user data is temporarily stored before OTP.
        // For simplicity, let's assume if verifyOtp is called after signup, we log in the last "signed-up" user.
        const pendingUserEmail = localStorage.getItem('pendingSignupEmail');
        if (pendingUserEmail) {
            const userToLogin = getMockUserByEmail(pendingUserEmail);
            if (userToLogin) {
                setCurrentUser(userToLogin);
                localStorage.setItem('vedicAppUser', JSON.stringify(userToLogin));
                localStorage.removeItem('pendingSignupEmail');
            }
        }
      }
      return success;
    } catch (error) {
      console.error("Verify OTP failed:", error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, isLoadingAuth, loginWithEmail, signupWithEmail, loginWithGoogle, logout, sendOtp, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
