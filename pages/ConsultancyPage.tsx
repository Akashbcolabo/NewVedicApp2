
import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { BottomNavBar } from '../components/BottomNavBar';
import { StripeService } from '../services/stripeService'; 
import { NavItem, Doctor } from '../types';
import { 
  SearchLucideIcon, 
  FilterIcon, 
  MessageSquareIcon, 
  StarIcon,
  ClockIcon,
  CalendarIcon,
  AlertTriangleIcon,
  XIcon,
  CreditCardIcon,
  WalletIcon,
  PhoneIcon,
  CheckCircleIcon,
  LoaderIcon,
  HomeIcon, 
  LearnIcon as LearnNavIcon, 
  AkfPlaceholderIcon, 
  NewsIcon as NewsNavIcon, 
  EmergencyIcon as EmergencyNavIcon
} from '../constants';
import { MOCK_DOCTORS } from '../mockData'; 
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

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


interface ConsultancyPageProps {
  onNavigateHome: () => void;
  onNavigateLearn: () => void;
  onNavigateNews: () => void;
  onNavigateEmergency: () => void;
}

const ConsultancyPage: React.FC<ConsultancyPageProps> = ({
  onNavigateHome,
  onNavigateLearn,
  onNavigateNews,
  onNavigateEmergency,
}) => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bkash' | 'nagad' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const categories = [
    {id: 'all', name: translate('allCategories', 'All Categories')},
    {id: 'Ayurvedic', name: translate('ayurvedicCategory', 'Ayurvedic')},
    {id: 'Yoga', name: translate('yogaCategory', 'Yoga')},
    {id: 'Mental Health', name: translate('mentalHealthCategory', 'Mental Health')},
    {id: 'Family', name: translate('familyCategory', 'Family')},
    {id: 'Relationship', name: translate('relationshipCategory', 'Relationship')}
  ];
  
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(MOCK_DOCTORS);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const newFilteredDoctors = MOCK_DOCTORS.filter(doctor => {
      const matchesCategory = selectedCategory === 'all' || doctor.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !lowerQuery || 
                            doctor.name.toLowerCase().includes(lowerQuery) ||
                            doctor.speciality.toLowerCase().includes(lowerQuery);
      return matchesCategory && matchesSearch;
    });
    setFilteredDoctors(newFilteredDoctors);
  }, [searchQuery, selectedCategory]);


  const handleBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowPaymentModal(true);
    setPaymentError(null);
    setPaymentSuccess(false);
    setSelectedPaymentMethod(null);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !selectedDoctor) return;

    setIsProcessing(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      if (selectedPaymentMethod === 'card') {
        const session = await StripeService.createDonationSession( 
          parseInt(selectedDoctor.price),
          translate('consultationWith', `Consultation with ${selectedDoctor.name}`, { name: selectedDoctor.name })
        );
        if (session && session.id) {
          console.log("Mock Stripe session created:", session.id);
          await new Promise(resolve => setTimeout(resolve, 1500)); 
          setPaymentSuccess(true);
        } else {
          throw new Error(translate('stripeSessionFailed', "Mock Stripe session creation failed."));
        }

      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentSuccess(true);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || translate('paymentFailed', 'Payment failed. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const consultancyNavItems: NavItem[] = [
    { id: 'home', name: translate('navHome', 'Home'), icon: <HomeIcon />, onClick: onNavigateHome },
    { id: 'learn', name: translate('navLearn', 'Learn'), icon: <LearnNavIcon />, onClick: onNavigateLearn },
    { id: 'akf', name: translate('navAkf', 'AKF'), icon: <AkfPlaceholderIcon />, onClick: () => {} }, 
    { id: 'news', name: translate('navNews', 'News'), icon: <NewsNavIcon />, onClick: onNavigateNews },
    { id: 'emergency', name: translate('navEmergency', 'Emergency'), icon: <EmergencyNavIcon />, onClick: onNavigateEmergency },
  ];

  return (
    <div className="min-h-screen bg-light-primary dark:bg-primary text-light-text-primary dark:text-dark-text-primary font-sans pb-20">
      <PageHeader title={translate('consultancyTitle', "Consultancy Services")} onBack={onNavigateHome}/>

      <div className={`p-4 space-y-4 sticky top-[60px] z-30 ${theme === 'light' ? 'bg-light-primary dark:bg-dark-primary' : 'bg-primary dark:bg-black'}`}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <SearchLucideIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-orange" />
            <input
              type="text"
              placeholder={translate('searchDoctorsPlaceholder', "Search doctors, specialities...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange ${theme === 'light' ? 'bg-light-surface text-light-text-primary placeholder-light-text-tertiary' : 'bg-dark-surface-alt text-dark-text-primary placeholder-dark-text-tertiary'}`}
            />
          </div>
          <button 
            className={`px-4 rounded-lg flex items-center gap-2 transition-colors ${theme === 'light' ? 'bg-light-surface text-light-text-secondary hover:bg-gray-200' : 'bg-dark-surface-alt text-dark-text-secondary hover:text-dark-text-primary hover:bg-gray-700'}`}  
            onClick={() => alert(translate('filterComingSoon', 'Filter functionality coming soon!'))}
          >
            <FilterIcon className="w-5 h-5" /> <span className="hidden sm:inline">{translate('filterButton', 'Filter')}</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full whitespace-nowrap text-xs sm:text-sm transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-opacity-50 ${
                selectedCategory === category.id
                  ? 'bg-brand-orange text-white font-semibold'
                  : `${theme === 'light' ? 'bg-light-surface-alt text-light-text-secondary hover:bg-gray-200' : 'bg-dark-surface-alt text-dark-text-secondary hover:bg-gray-700 hover:text-dark-text-primary'}`
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <main className="p-4 pt-0">
        <h2 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('availableExpertsTitle', 'Available Experts')}</h2>
        {filteredDoctors.length > 0 ? (
            <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className={`rounded-xl p-4 shadow-lg transition-all hover:shadow-brand-orange/20 dark:hover:shadow-brand-orange/30 hover:transform hover:-translate-y-1 ${theme === 'light' ? 'bg-light-surface' : 'bg-dark-card'}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0 mx-auto sm:mx-0"
                    />
                    <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-1">
                        <div>
                        <h3 className={`font-semibold text-lg ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{doctor.name}</h3>
                        <p className="text-sm text-brand-orange">{doctor.speciality}</p>
                        </div>
                        <div className="text-center sm:text-right mt-2 sm:mt-0">
                        <p className={`text-md font-semibold ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>৳{doctor.price}</p>
                        <p className={`text-xs ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>{translate('perSession', 'Per Session')}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-1 my-1.5">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{doctor.rating} ({doctor.experience} {translate('experience', 'experience')})</span>
                    </div>
                    
                    <div className={`flex items-center justify-center sm:justify-start gap-2 text-xs mb-3 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>{translate('nextAvailable', 'Next available')}: {doctor.nextAvailable}</span>
                    </div>

                    <button
                        onClick={() => handleBooking(doctor)}
                        className="w-full sm:w-auto bg-brand-orange hover:bg-opacity-90 transition-colors text-white rounded-lg py-2 px-5 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <MessageSquareIcon className="w-4 h-4" />
                        <span>{translate('bookNowButton', 'Book Now')}</span>
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className={`text-center py-10 ${theme === 'light' ? 'text-light-text-tertiary' : 'text-dark-text-tertiary'}`}>
                <p className="text-xl mb-2">(._.)</p>
                <p>{translate('noExpertsFound', 'No experts found matching your criteria.')}</p>
                <p className="text-sm mt-1">{translate('tryAdjustingFilters', 'Try adjusting your search or category filters.')}</p>
            </div>
        )}
      </main>

      {showPaymentModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => {if(!isProcessing) setShowPaymentModal(false);}}>
          <div className={`rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto ${theme === 'light' ? 'bg-light-surface text-light-text-primary' : 'bg-dark-card text-dark-text-primary'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-brand-orange">{translate('confirmBookingTitle', 'Confirm Booking')}</h2>
              <button
                onClick={() => {if(!isProcessing) setShowPaymentModal(false);}}
                disabled={isProcessing}
                className={`p-1.5 rounded-full transition-colors disabled:opacity-50 ${theme === 'light' ? 'hover:bg-gray-200 text-light-text-secondary' : 'hover:bg-gray-700 text-dark-text-secondary'}`}
                aria-label={translate('closePaymentModalAria', "Close payment modal")}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {!paymentSuccess ? (
              <>
                <div className={`mb-5 rounded-lg p-4 ${theme === 'light' ? 'bg-light-surface-alt' : 'bg-dark-surface-alt'}`}>
                  <h3 className={`font-medium mb-1.5 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('consultationWithLabel', 'Consultation With:')}</h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Dr. {selectedDoctor.name} ({selectedDoctor.speciality})</p>
                  <p className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>{translate('timeLabel', 'Time')}: {selectedDoctor.nextAvailable}</p>
                  <p className="text-md font-semibold text-brand-orange mt-2">{translate('totalAmountLabel', 'Total Amount')}: ৳{selectedDoctor.price}</p>
                </div>

                <div className="space-y-3">
                  <h3 className={`font-medium mb-1 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>{translate('selectPaymentMethodLabel', 'Select Payment Method:')}</h3>
                  
                  {(['card', 'bkash', 'nagad'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setSelectedPaymentMethod(method)}
                      disabled={isProcessing}
                      className={`w-full p-3.5 rounded-lg flex items-center gap-3 transition-all duration-200 ease-in-out border-2
                        ${ selectedPaymentMethod === method
                            ? 'bg-brand-orange/20 border-brand-orange text-brand-orange font-medium'
                            : `${theme === 'light' ? 'bg-light-surface-alt border-gray-300 hover:border-brand-orange text-light-text-secondary' : 'bg-dark-surface-alt border-gray-600 hover:border-brand-orange text-dark-text-secondary'} disabled:opacity-70`
                        }`}
                    >
                      {method === 'card' && <CreditCardIcon className="w-5 h-5" />}
                      {method === 'bkash' && <BikashIconSVG className="w-5 h-5" />}
                      {method === 'nagad' && <NagadIconSVG className="w-5 h-5" />}
                      <span className="capitalize text-sm">{method}</span>
                      {selectedPaymentMethod === method && (
                        <CheckCircleIcon className="w-5 h-5 ml-auto text-green-400" />
                      )}
                    </button>
                  ))}
                </div>

                {paymentError && (
                  <div className={`mt-4 rounded-lg p-3 text-sm flex items-center gap-2 ${theme === 'light' ? 'bg-red-100 border border-red-300 text-red-700' : 'bg-red-900/30 border border-red-700 text-red-300'}`}>
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || isProcessing}
                  className="w-full mt-6 bg-brand-orange hover:bg-opacity-90 transition-colors rounded-lg py-3 flex items-center justify-center gap-2 font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                      <span>{translate('processingPayment', 'Processing Payment...')}</span>
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-5 h-5" />
                      <span>{translate('payAmountButton', `Pay ৳${selectedDoctor.price}`, { amount: selectedDoctor.price })}</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircleIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">{translate('paymentSuccessfulTitle', 'Payment Successful!')}</h3>
                <p className={`mb-6 text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
                  {translate('bookingConfirmationMessage', `Your consultation with Dr. ${selectedDoctor.name} has been booked. You will receive a confirmation shortly.`, { name: selectedDoctor.name })}
                </p>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="bg-brand-orange hover:bg-opacity-90 transition-colors rounded-lg px-6 py-2.5 text-white font-medium"
                >
                  {translate('doneButton', 'Done')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNavBar navItems={consultancyNavItems} activeTabId="akf" />
    </div>
  );
};

export default ConsultancyPage;
