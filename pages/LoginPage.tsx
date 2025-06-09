import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { EmailIcon, LockIcon, ArrowLeftIcon, LoaderIcon, AlertCircleIcon, GoogleIcon } from '../constants';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onBackToMain: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onBackToMain }) => {
  const { loginWithEmail, loginWithGoogle, isLoadingAuth } = useAuth();
  const { translate } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
      // On success, AuthProvider updates currentUser, App.tsx handles redirect
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(translate('loginFailedInvalid', 'Incorrect email or password.'));
      } else {
        setError(err.message || translate('loginFailed', 'Login failed. Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || translate('googleSignInFailed', 'Google Sign-In failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <button onClick={onBackToMain} className="mb-6 text-sm text-brand-orange hover:text-brand-yellow flex items-center gap-1">
        <ArrowLeftIcon className="w-4 h-4" />
        {translate('backToOptions', 'Back to options')}
      </button>
      <h2 className="text-2xl font-bold text-center text-brand-orange mb-1">
        {translate('welcomeBack', 'Welcome Back!')}
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6">
        {translate('loginToContinue', 'Login to continue your journey.')}
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-3 py-2.5 rounded-lg text-xs flex items-center gap-2 mb-4">
          <AlertCircleIcon className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-medium text-gray-400 mb-1">
            {translate('emailLabel', 'Email Address')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EmailIcon className="w-4 h-4 text-gray-500" />
            </div>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-dark-surface rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder={translate('emailPlaceholder', 'you@example.com')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-medium text-gray-400 mb-1">
            {translate('passwordLabel', 'Password')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="w-4 h-4 text-gray-500" />
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-dark-surface rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="text-right">
            <a href="#" onClick={(e) => { e.preventDefault(); alert(translate('forgotPasswordComingSoon', 'Forgot password feature coming soon!')); }} className="text-xs text-brand-orange hover:text-brand-yellow">
                {translate('forgotPassword', 'Forgot Password?')}
            </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoadingAuth}
          className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-opacity-90 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:opacity-70"
        >
          {(isSubmitting || isLoadingAuth) ? <LoaderIcon className="w-5 h-5 animate-spin" /> : null}
          {translate('loginButton', 'Login')}
        </button>
      </form>
      
        <div className="relative my-5">
            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-600" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-black text-gray-400">{translate('orLoginWith', 'Or login with')}</span></div>
        </div>

        <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isLoadingAuth}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-brand-blue disabled:opacity-70"
        >
            {(isSubmitting || isLoadingAuth) && !error ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
            <span className="text-sm font-medium">{translate('loginWithGoogleShort', 'Login with Google')}</span>
        </button>


      <p className="mt-6 text-center text-sm text-gray-400">
        {translate('dontHaveAccount', "Don't have an account?")}{' '}
        <button onClick={onSwitchToSignup} className="font-medium text-brand-orange hover:text-brand-yellow">
          {translate('signupNow', 'Sign up now')}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
