import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, languages as appLanguages } from '../contexts/LanguageContext';
import { UserProfileData, Language } from '../types';
import { UserIcon, EmailIcon, LockIcon, PhoneIcon, CalendarIcon, GlobeIcon, MapPinIcon, ArrowLeftIcon, ArrowRightIcon, LoaderIcon, AlertCircleIcon, CheckCircleIcon, GoogleIcon } from '../constants';
import OtpVerificationPage from './OtpVerificationPage'; // Import for OTP step

type SignupStep = 1 | 2 | 3 | 4 | 5; // 5 is OTP

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onBackToMain: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin, onBackToMain }) => {
  const { signupWithEmail, loginWithGoogle, isLoadingAuth, sendOtp } = useAuth();
  const { translate } = useLanguage();
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<UserProfileData & { password?: string; confirmPassword?: string }>>({
    name: '',
    email: '',
    country: '',
    state: '',
    city: '',
    village: '',
    phone: '',
    dob: '',
    preferredLanguage: appLanguages.find(l => l.code === 'bn')?.code || appLanguages[0].code, // Default to Bengali or first
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setError(null); // Clear error on step change
    // Basic validation for current step before proceeding
    if (currentStep === 1 && (!formData.name?.trim() || !formData.email?.trim())) {
      setError(translate('nameAndEmailRequired', 'Full Name and Email are required.'));
      return;
    }
    if (currentStep === 1 && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(translate('invalidEmailFormat', 'Please enter a valid email address.'));
      return;
    }
    if (currentStep === 4 && (!formData.password || formData.password.length < 6)) {
        setError(translate('passwordMinLength', 'Password must be at least 6 characters.'));
        return;
    }
    if (currentStep === 4 && formData.password !== formData.confirmPassword) {
        setError(translate('passwordsDoNotMatch', 'Passwords do not match.'));
        return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5) as SignupStep);
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1) as SignupStep);
  };
  
  const handleGoogleSignup = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await loginWithGoogle(); // Uses loginWithGoogle which might create user if not exists in Firebase
      if (user) {
        // If Google Sign-up needs OTP too (less common), go to step 5
        // For now, assume Google Sign-up bypasses manual OTP
        // AuthProvider handles setting currentUser and App.tsx handles redirect
        // Potentially, here you could prompt for any missing profile info if Google doesn't provide it all
        // For this mock, we assume success and redirect.
      }
    } catch (err: any) {
      console.error("Google Sign-Up Error:", err);
      setError(err.message || translate('googleSignUpFailed', 'Google Sign-Up failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentStep !== 4) return; // Final form data submission happens at step 4
    
    if (formData.password !== formData.confirmPassword) {
      setError(translate('passwordsDoNotMatch', 'Passwords do not match.'));
      return;
    }
    if (!formData.email || !formData.password || !formData.name) {
        setError(translate('fillRequiredFields', 'Please fill all required fields.'));
        return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const { confirmPassword, ...signupData } = formData; // Exclude confirmPassword
      const user = await signupWithEmail(signupData as UserProfileData & { password: string });
      if (user && user.email) {
        // Successfully "created" user, now send OTP
        localStorage.setItem('pendingSignupEmail', user.email); // Store for OTP verification step
        const otpSent = await sendOtp('email', user.email); // Mock send OTP to email
        if (otpSent) {
          setCurrentStep(5); // Move to OTP verification step
        } else {
          setError(translate('otpSendFailed', 'Failed to send OTP. Please try again.'));
        }
      } else {
        setError(translate('signupFailed', 'Signup failed. Please try again.'));
      }
    } catch (err: any) {
      console.error("Signup Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError(translate('emailInUse', 'This email is already registered. Try logging in.'));
      } else {
        setError(err.message || translate('signupFailed', 'Signup failed. Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const InputField: React.FC<{name: string, type: string, label: string, placeholder?: string, icon: React.ReactNode, required?: boolean, value: string | undefined, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = 
  ({name, type, label, placeholder, icon, required, value, onChange}) => (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
        <input id={name} name={name} type={type} required={required} value={value || ''} onChange={onChange}
               className="w-full pl-10 pr-3 py-2.5 bg-dark-surface rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
               placeholder={placeholder} />
      </div>
    </div>
  );

  const progressPercentage = ((currentStep -1) / 4) * 100; // 4 main steps before OTP

  if (currentStep === 5) {
      return <OtpVerificationPage 
                email={formData.email || ''} 
                onOtpVerified={() => { /* AuthProvider handles login after successful OTP */ }} 
                onBack={() => setCurrentStep(4)} 
             />;
  }


  return (
    <div className="w-full max-w-md">
      <button onClick={currentStep === 1 ? onBackToMain : handlePrevStep} className="mb-4 text-sm text-brand-orange hover:text-brand-yellow flex items-center gap-1">
        <ArrowLeftIcon className="w-4 h-4" />
        {translate(currentStep === 1 ? 'backToOptions' : 'previousStep', currentStep === 1 ? 'Back to options' : 'Previous Step')}
      </button>

      <h2 className="text-2xl font-bold text-center text-brand-orange mb-1">
        {translate('createYourAccount', 'Create Your Account')}
      </h2>
      <p className="text-center text-sm text-gray-400 mb-5">
        {translate('joinVedicCommunity', 'Join our community to explore Vedic wisdom.')}
      </p>
      
      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{translate('step', 'Step')} {currentStep} {translate('of', 'of')} 4</span>
          {/* <span>{Math.round(progressPercentage)}%</span> */}
        </div>
        <div className="w-full bg-dark-surface rounded-full h-1.5">
          <div className="bg-brand-orange h-1.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>


      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-3 py-2.5 rounded-lg text-xs flex items-center gap-2 mb-4">
          <AlertCircleIcon className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {currentStep === 1 && (
          <>
            <InputField name="name" type="text" label={translate('fullNameLabel', 'Full Name')} placeholder={translate('fullNamePlaceholder', 'Enter your full name')} icon={<UserIcon className="w-4 h-4 text-gray-500" />} required value={formData.name} onChange={handleChange} />
            <InputField name="email" type="email" label={translate('emailLabel', 'Email Address')} placeholder={translate('emailPlaceholder', 'you@example.com')} icon={<EmailIcon className="w-4 h-4 text-gray-500" />} required value={formData.email} onChange={handleChange} />
          </>
        )}
        {currentStep === 2 && (
          <>
            <InputField name="country" type="text" label={translate('countryLabel', 'Country')} placeholder={translate('countryPlaceholder', 'e.g., India, Bangladesh')} icon={<GlobeIcon className="w-4 h-4 text-gray-500" />} value={formData.country} onChange={handleChange} />
            <InputField name="state" type="text" label={translate('stateLabel', 'State/Province')} placeholder={translate('statePlaceholder', 'e.g., West Bengal, Dhaka Division')} icon={<MapPinIcon className="w-4 h-4 text-gray-500" />} value={formData.state} onChange={handleChange} />
            <InputField name="city" type="text" label={translate('cityLabel', 'City/Town')} placeholder={translate('cityPlaceholder', 'e.g., Kolkata, Dhaka')} icon={<MapPinIcon className="w-4 h-4 text-gray-500" />} value={formData.city} onChange={handleChange} />
            <InputField name="village" type="text" label={translate('villageLabel', 'Village/Area (Optional)')} placeholder={translate('villagePlaceholder', 'e.g., Shantiniketan, Mirpur')} icon={<MapPinIcon className="w-4 h-4 text-gray-500" />} value={formData.village} onChange={handleChange} />
          </>
        )}
        {currentStep === 3 && (
          <>
            <InputField name="phone" type="tel" label={translate('phoneLabel', 'Phone Number (with country code)')} placeholder={translate('phonePlaceholder', 'e.g., +8801712345678')} icon={<PhoneIcon className="w-4 h-4 text-gray-500" />} value={formData.phone} onChange={handleChange} />
            <InputField name="dob" type="date" label={translate('dobLabel', 'Date of Birth')} icon={<CalendarIcon className="w-4 h-4 text-gray-500" />} value={formData.dob} onChange={handleChange} />
          </>
        )}
        {currentStep === 4 && (
          <>
            <div>
              <label htmlFor="preferredLanguage" className="block text-xs font-medium text-gray-400 mb-1">{translate('languageLabel', 'Preferred Language')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><GlobeIcon className="w-4 h-4 text-gray-500" /></div>
                <select id="preferredLanguage" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className="w-full pl-10 pr-3 py-2.5 bg-dark-surface rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-orange appearance-none">
                  {appLanguages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                </select>
              </div>
            </div>
            <InputField name="password" type="password" label={translate('createPasswordLabel', 'Create Password')} placeholder="••••••••" icon={<LockIcon className="w-4 h-4 text-gray-500" />} required value={formData.password} onChange={handleChange} />
            <InputField name="confirmPassword" type="password" label={translate('confirmPasswordLabel', 'Confirm Password')} placeholder="••••••••" icon={<LockIcon className="w-4 h-4 text-gray-500" />} required value={formData.confirmPassword} onChange={handleChange} />
          </>
        )}
        
        <div className="pt-2">
          {currentStep < 4 ? (
            <button type="button" onClick={handleNextStep} disabled={isLoadingAuth}
                    className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-opacity-90 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-70">
              {translate('nextButton', 'Next')} <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting || isLoadingAuth}
                    className="w-full flex items-center justify-center gap-2 bg-brand-green text-white hover:bg-opacity-90 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-70">
              {(isSubmitting || isLoadingAuth) ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <CheckCircleIcon className="w-5 h-5" />}
              {translate('createAccountAndVerify', 'Create Account & Verify')}
            </button>
          )}
        </div>
      </form>
      
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-600" /></div>
        <div className="relative flex justify-center text-xs"><span className="px-2 bg-black text-gray-400">{translate('orSignupWith', 'Or sign up with')}</span></div>
      </div>

      <button
        onClick={handleGoogleSignup}
        disabled={isSubmitting || isLoadingAuth}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-brand-blue disabled:opacity-70"
      >
        {(isSubmitting || isLoadingAuth) ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
        <span className="text-sm font-medium">{translate('signupWithGoogleShort', 'Sign up with Google')}</span>
      </button>

      <p className="mt-6 text-center text-sm text-gray-400">
        {translate('alreadyHaveAccount', 'Already have an account?')}{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-brand-orange hover:text-brand-yellow">
          {translate('loginLink', 'Login here')}
        </button>
      </p>
    </div>
  );
};

export default SignupPage;
