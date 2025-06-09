import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeftIcon, CheckCircleIcon, LoaderIcon, AlertCircleIcon } from '../constants';

interface OtpVerificationPageProps {
  email: string; // Or phone, depending on verification method
  onOtpVerified: () => void;
  onBack: () => void; // Go back to previous signup step or login
}

const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({ email, onOtpVerified, onBack }) => {
  const { verifyOtp, sendOtp, isLoadingAuth } = useAuth();
  const { translate } = useLanguage();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>; // Changed from NodeJS.Timeout
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus next input
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, otp.length).split('');
    if (pastedData.every(char => /^[0-9]$/.test(char))) {
        const newOtp = [...otp];
        pastedData.forEach((char, i) => {
            if (i < otp.length) newOtp[i] = char;
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length -1, otp.length - 1)]?.focus();
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== otp.length) {
      setError(translate('otpIncomplete', 'Please enter the complete OTP.'));
      return;
    }
    setError(null);
    setIsVerifying(true);
    try {
      const success = await verifyOtp(enteredOtp);
      if (success) {
        onOtpVerified(); // AuthProvider will handle logging in the user fully
      } else {
        setError(translate('otpInvalid', 'Invalid OTP. Please try again.'));
      }
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      setError(err.message || translate('otpVerificationFailed', 'OTP verification failed.'));
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setIsResending(true);
    try {
        // Assuming email for now. Could be dynamic based on signup method.
        const success = await sendOtp('email', email); 
        if(success) {
            alert(translate('otpResent', 'A new OTP has been sent to your email.'));
            setResendCooldown(60); // 60 seconds cooldown
        } else {
            setError(translate('otpResendFailed', 'Failed to resend OTP. Please try again later.'));
        }
    } catch (err: any) {
        console.error("Resend OTP Error:", err);
        setError(err.message || translate('otpResendFailed', 'Failed to resend OTP.'));
    } finally {
        setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={onBack} className="mb-6 text-sm text-brand-orange hover:text-brand-yellow flex items-center gap-1" disabled={isVerifying || isResending}>
        <ArrowLeftIcon className="w-4 h-4" />
        {translate('backButton', 'Back')}
      </button>
      <h2 className="text-2xl font-bold text-center text-brand-orange mb-2">
        {translate('verifyYourAccount', 'Verify Your Account')}
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6">
        {translate('otpSentTo', 'An OTP has been sent to')} <span className="font-medium text-gray-200">{email}</span>.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-3 py-2.5 rounded-lg text-xs flex items-center gap-2 mb-4">
          <AlertCircleIcon className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }} // Corrected ref assignment
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined} // Allow paste only on the first input
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-medium bg-dark-surface rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
              disabled={isVerifying || isLoadingAuth}
              aria-label={`OTP Digit ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isVerifying || isLoadingAuth || otp.join('').length !== otp.length}
          className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-opacity-90 p-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:opacity-70"
        >
          {(isVerifying || isLoadingAuth) ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <CheckCircleIcon className="w-5 h-5" />}
          {translate('verifyOtpButton', 'Verify OTP')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        {translate('didNotReceiveOtp', "Didn't receive the OTP?")}{' '}
        <button 
            onClick={handleResendOtp} 
            disabled={isResending || resendCooldown > 0}
            className="font-medium text-brand-orange hover:text-brand-yellow disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {isResending 
            ? translate('resendingOtp', 'Resending...') 
            : resendCooldown > 0 
            ? `${translate('resendOtpIn', 'Resend OTP in')} ${resendCooldown}s`
            : translate('resendOtp', 'Resend OTP')}
        </button>
      </p>
    </div>
  );
};

export default OtpVerificationPage;