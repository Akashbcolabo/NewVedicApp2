import React, { useState, useEffect } from 'react';
import { XIcon, CreditCardIcon, CheckCircleIcon } from '../constants'; // Assuming these icons exist or create placeholders
import { ProjectItem } from '../types';
import { StripeService } from '../services/stripeService'; // Assuming StripeService is correctly set up

// Placeholder simple icons if not in constants
const BikashIconSVG: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.2828 6.04453C16.9228 5.76453 16.4828 5.70453 16.0528 5.89453L6.88281 9.89453C6.40281 10.1045 6.09281 10.5745 6.10281 11.0845L6.20281 17.7045C6.21281 18.2245 6.56281 18.6745 7.06281 18.8445L10.4028 19.9645L12.0028 14.1445L17.7528 6.69453C17.9228 6.47453 17.8228 6.16453 17.5828 6.04453H17.2828Z" fill="#DF146E"/>
      <path d="M17.5828 6.04453L12.0028 14.1445L13.6028 19.9645L17.0628 18.8445C17.5528 18.6745 17.9028 18.2245 17.9128 17.7045L18.0128 11.0845C18.0228 10.5745 17.7128 10.1045 17.2328 9.89453L16.0528 5.89453C16.0528 5.89453 17.5828 6.04453 17.5828 6.04453Z" fill="#E32372"/>
      <path d="M10.4028 19.9645L12.0028 14.1445L6.88281 9.89453L10.4028 19.9645Z" fill="#CC0D5F"/>
    </svg>
);
const NagadIconSVG: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
   <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5721 7.56302L12.7951 3.75L12 4.20302L5.20508 8.01302L4.42808 7.56302L12 3L19.5721 7.56302Z" fill="#F58220"/>
    <path d="M12 12.885L19.5721 8.325V15.675L12 20.241V12.885Z" fill="#F05A28"/>
    <path d="M12 12.885L4.42808 8.325V15.675L12 20.241V12.885Z" fill="#F26D21"/>
    <path d="M12 4.20302L5.20508 8.01302L12 11.823L18.7951 8.01302L12 4.20302Z" fill="#F58220"/>
   </svg>
);

const paymentMethods = [
  { id: 'bkash', name: 'bKash', icon: <BikashIconSVG /> },
  { id: 'nagad', name: 'Nagad', icon: <NagadIconSVG /> },
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCardIcon className="w-6 h-6 text-blue-400" /> },
];

const predefinedAmounts = [100, 500, 1000, 2000, 5000];


interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, project }) => {
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setDonationAmount('');
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
      setPaymentError(null);
      setPaymentSuccess(false);
    }
  }, [isOpen]);
  
  if (!isOpen || !project) {
    return null;
  }

  const handleDonateNow = async () => {
    const amount = parseInt(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      setPaymentError('Please enter a valid donation amount.');
      return;
    }
    if (!selectedPaymentMethod) {
      setPaymentError('Please select a payment method.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      // Using StripeService as per existing structure for card payments
      if (selectedPaymentMethod === 'card') {
        const session = await StripeService.createDonationSession(amount, `Donation for ${project.title}`);
         if (session && session.id) {
            // In a real app, redirect to Stripe: await StripeService.redirectToCheckout(session.id);
            // For this mock, we'll simulate success after a delay
            console.log("Mock Stripe session created for card payment:", session.id);
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            setPaymentSuccess(true);
        } else {
            throw new Error("Mock Stripe session creation failed.");
        }
      } else {
        // Simulate mobile payment processing
        console.log(`Processing ${selectedPaymentMethod} payment of ৳${amount} for ${project.title}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentSuccess(true);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const collectedPercentage = (project.collectedAmount / project.budget) * 100;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
    >
      <div 
        className="bg-dark-surface text-white rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="donation-modal-title" className="text-lg sm:text-xl font-semibold text-brand-orange">
            Support: {project.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close donation modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {!paymentSuccess ? (
          <>
            <div className="mb-4 bg-dark-surface-alt p-3 rounded-lg">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Collected: ৳{project.collectedAmount.toLocaleString()}</span>
                <span>Target: ৳{project.budget.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-brand-orange h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(collectedPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{project.deadlineDays} days left</p>
            </div>

            <div className="mb-4">
              <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-300 mb-1.5">Enter Amount (৳)</label>
              <input 
                type="number"
                id="donationAmount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="e.g., 500"
                className="w-full bg-dark-surface-alt rounded-lg px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide pb-1">
                {predefinedAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(String(amount))}
                    className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors ${donationAmount === String(amount) ? 'bg-brand-orange text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    ৳{amount}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-300 mb-2">Select Payment Method:</p>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all duration-200 ease-in-out border-2
                      ${selectedPaymentMethod === method.id 
                          ? 'bg-brand-orange/20 border-brand-orange text-brand-orange' 
                          : 'bg-dark-surface-alt border-gray-700 hover:border-brand-orange text-gray-200'
                      }`}
                  >
                    {React.cloneElement(method.icon, {className: `w-6 h-6 ${selectedPaymentMethod === method.id ? '' : (method.id === 'card' ? 'text-gray-400' : '')}`})}
                    <span className="text-sm font-medium">{method.name}</span>
                    {selectedPaymentMethod === method.id && <CheckCircleIcon className="w-5 h-5 ml-auto text-green-400" />}
                  </button>
                ))}
              </div>
            </div>
            
            {paymentError && (
              <p className="text-xs text-red-400 bg-red-900/30 border border-red-700/50 p-2 rounded-md mb-3 text-center">{paymentError}</p>
            )}

            <button
              onClick={handleDonateNow}
              disabled={isProcessing || !donationAmount || parseInt(donationAmount) <=0 || !selectedPaymentMethod}
              className="w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-3 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Donate ৳${donationAmount || '0'}`}
            </button>
          </>
        ) : (
           <div className="text-center py-5">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-3"/>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Thank You!</h3>
            <p className="text-gray-300 mb-1 text-sm">Your donation of ৳{donationAmount} for</p>
            <p className="text-gray-100 font-medium mb-4">{project.title} is successful.</p>
            <p className="text-xs text-gray-400">Your support makes a difference.</p>
            <button
                onClick={onClose}
                className="mt-6 w-full bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-2.5 font-medium"
            >
                Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationModal;