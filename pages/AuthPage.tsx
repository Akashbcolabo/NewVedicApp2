
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { GoogleIcon, EmailIcon, UserPlusIcon, LoaderIcon, AlertCircleIcon } from '../constants'; 
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import { useTheme } from '../contexts/ThemeContext';

type AuthMode = 'main' | 'login' | 'signup';

const AuthPage: React.FC = () => {
  const { loginWithGoogle, isLoadingAuth } = useAuth();
  const { translate } = useLanguage();
  const { theme } = useTheme();
  const [authMode, setAuthMode] = useState<AuthMode>('main');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || translate('googleSignInFailed', 'Google Sign-In failed. Please try again.'));
    }
  };
  
  const renderContent = () => {
    switch(authMode) {
      case 'login':
        return <LoginPage onSwitchToSignup={() => setAuthMode('signup')} onBackToMain={() => setAuthMode('main')} />;
      case 'signup':
        return <SignupPage onSwitchToLogin={() => setAuthMode('login')} onBackToMain={() => setAuthMode('main')} />;
      case 'main':
      default:
        return (
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <img src="/logo_placeholder.png" alt="App Logo" className="w-24 h-24 mx-auto mb-4 rounded-full bg-brand-orange p-2" />
              <h1 className="text-3xl font-bold text-brand-orange">
                {translate('appName', 'Vedic Wisdom')}
              </h1>
              <p className={`mt-2 text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                {translate('authPageWelcome', 'Discover ancient knowledge. Connect with community.')}
              </p>
            </div>

            {error && (
              <div className={`px-3 py-2.5 rounded-lg text-xs flex items-center gap-2 ${theme === 'light' ? 'bg-red-100 border border-red-300 text-red-700' : 'bg-red-500/10 border border-red-500/50 text-red-300'}`}>
                <AlertCircleIcon className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoadingAuth}
              className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 
                          ${theme === 'light' 
                            ? 'bg-white text-gray-700 hover:bg-gray-100 focus:ring-offset-light-primary focus:ring-brand-blue' 
                            : 'bg-dark-surface text-dark-text-primary hover:bg-gray-600 focus:ring-offset-primary focus:ring-brand-blue' // Adjusted dark theme for Google button
                          }`}
            >
              {isLoadingAuth ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
              <span className="text-sm font-medium">{translate('continueWithGoogle', 'Continue with Google')}</span>
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className={`w-full border-t ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${theme === 'light' ? 'bg-light-primary text-light-text-secondary' : 'bg-primary text-dark-text-secondary'}`}>{translate('or', 'OR')}</span>
              </div>
            </div>

            <button
              onClick={() => setAuthMode('signup')}
              disabled={isLoadingAuth}
              className="w-full flex items-center justify-center gap-3 bg-brand-orange text-white hover:bg-opacity-90 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-70"
            >
              {isLoadingAuth ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <UserPlusIcon className="w-5 h-5" />}
              <span className="text-sm font-medium">{translate('createAccount', 'Create an Account')}</span>
            </button>

            <button
              onClick={() => setAuthMode('login')}
              disabled={isLoadingAuth}
              className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70
                          ${theme === 'light' 
                            ? 'bg-light-surface-alt text-light-text-primary hover:bg-gray-200 focus:ring-offset-light-primary focus:ring-brand-orange' 
                            : 'bg-dark-surface text-dark-text-primary hover:bg-gray-600 focus:ring-offset-primary focus:ring-brand-orange' // Adjusted dark theme for email login
                          }`}
            >
              {isLoadingAuth ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <EmailIcon className="w-5 h-5" />}
              <span className="text-sm font-medium">{translate('loginWithEmail', 'Login with Email')}</span>
            </button>
            
            <p className={`mt-8 text-center text-xs ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>
              {translate('termsAndPrivacyIntro', 'By continuing, you agree to our ')}
              <a href="#" className="font-medium text-brand-orange hover:text-brand-yellow">{translate('termsOfService', 'Terms of Service')}</a>
              {translate('and', ' and ')}
              <a href="#" className="font-medium text-brand-orange hover:text-brand-yellow">{translate('privacyPolicy', 'Privacy Policy')}</a>.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary flex flex-col items-center justify-center p-4 font-sans">
      {renderContent()}
    </div>
  );
};

export default AuthPage;
