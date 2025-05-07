import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoCardOutline,
  IoStarOutline,
  IoTimeOutline,
  IoReceiptOutline,
  IoRefreshOutline,
} from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';
import SideNavbar from './userlayout/sidebar';
import CheckoutForm from './CheckoutForm';
import SubscriptionManagement from './SubscriptionManagement';

const Pricingplan = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentPlanExpiry, setCurrentPlanExpiry] = useState(null);
  const [autoRenewEnabled, setAutoRenewEnabled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [stripePromise, setStripePromise] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [view, setView] = useState('plans');
  
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem('bizwizusertoken');
        if (!token) {
          toast.error(t('messages.loginRequired'));
          navigate('/userlogin');
          return;
        }

        const plansResponse = await ApiService("/pricing-plans", "GET");
        
        if (plansResponse.success && plansResponse.plans) {
          const plansArray = Array.isArray(plansResponse.plans) ? plansResponse.plans : [];
          setPricingPlans(plansArray);
          
          if (plansArray.length > 0) {
            const defaultPlan = plansArray.find(plan => plan.is_popular) || plansArray[0];
            setSelectedPlan(defaultPlan);
          }
        } else {
          toast.error(t('messages.loadPlansError'));
        }

        const stripeConfigResponse = await ApiService("/stripe-config", "GET");
        if (stripeConfigResponse.success && stripeConfigResponse.publishable_key) {
          setStripePromise(loadStripe(stripeConfigResponse.publishable_key));
        }
        
        const subscriptionsResponse = await ApiService("/active-subscriptions", "GET");
        if (subscriptionsResponse.success && subscriptionsResponse.subscriptions) {
          setActiveSubscriptions(subscriptionsResponse.subscriptions);
          
          if (subscriptionsResponse.subscriptions.length > 0) {
            const activeSub = subscriptionsResponse.subscriptions[0];
            const planDetails = activeSub.plan;
            
            if (planDetails) {
              setCurrentPlan(planDetails);
              setCurrentPlanExpiry(activeSub.next_billing_date);
              setAutoRenewEnabled(activeSub.auto_renew);
            }
          }
        }
      } catch (error) {
        const errormessage = error?.response?.data?.message || t('messages.genericError');
        
        if (errormessage.toLowerCase().includes('login') || 
            errormessage.toLowerCase().includes('token') || 
            errormessage.toLowerCase().includes('auth')) {
          localStorage.removeItem('bizwizusertoken');
          navigate('/userlogin');
        }
        toast.error(errormessage);
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
  }, [navigate, t]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const toggleBillingCycle = (cycle) => {
    setBillingCycle(cycle);
  };

  const toggleView = (newView) => {
    if (newView === 'subscriptions') {
      navigate('/manageplan');
    } else {
      setView(newView);
    }
  };

  const getRemainingDays = () => {
    if (!currentPlanExpiry) return 0;
    const expiryDate = new Date(currentPlanExpiry);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const response = await ApiService("/payment/transactions", "GET");
      if (response.success) {
        setTransactions(response.data || []);
        setShowTransactions(true);
        toast.success(t('messages.transactionsLoaded'));
      } else {
        toast.error(response.message || t('messages.transactionsError'));
      }
    } catch (error) {
      const errormessage = error?.response?.data?.message || t('messages.transactionsError');
      toast.error(errormessage);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const getPrice = (plan) => {
    if (billingCycle === 'yearly') {
      const price = plan.yearly_price || plan.annual_price;
      return price ? Number(price).toFixed(2) : Number(plan.monthly_price * 10).toFixed(2);
    }
    return Number(plan.monthly_price).toFixed(2);
  };

  const getYearlySavings = (plan) => {
    const yearlyPrice = Number(plan.yearly_price || plan.annual_price);
    const monthlyTotal = Number(plan.monthly_price) * 12;
    return (monthlyTotal - yearlyPrice).toFixed(2);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <LoadingPage name={t('loading.loadingPlans')} />;

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavbar />
      
      <main className="flex-1 px-4 py-8 md:px-8 lg:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-center"
          >
            <h1 className="mb-3 text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              {t(`pricing.title.${view}`)}
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400">
              {t(`pricing.subtitle.${view}`)}
              {currentPlan && view === 'plans' && (
                <span className="block mt-2 text-sm">
                  <span className="text-cyan-400">
                    {t('pricing.currentPlan', { plan: currentPlan.name, days: getRemainingDays() })}
                  </span>
                  <span className="ml-2 text-xs">
                    {autoRenewEnabled ? (
                      <span className="text-green-400">
                        <IoRefreshOutline className="inline-block w-3 h-3 mr-1" />
                        {t('pricing.autoRenewEnabled')}
                      </span>
                    ) : (
                      <span className="text-yellow-400">{t('pricing.autoRenewDisabled')}</span>
                    )}
                  </span>
                </span>
              )}
            </p>
            
            <div className="flex justify-center mt-6">
              <div className="p-1 bg-gray-900 rounded-lg inline-flex">
                {['plans', 'subscriptions'].map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => toggleView(viewType)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      view === viewType
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t(`pricing.view.${viewType}`)}
                    {viewType === 'subscriptions' && activeSubscriptions.length > 0 && (
                      ` (${activeSubscriptions.length})`
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.header>

          {view === 'plans' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="mb-8 flex justify-center"
              >
                <div className="p-1 bg-gray-900 rounded-lg inline-flex">
                  {['monthly', 'yearly'].map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => toggleBillingCycle(cycle)}
                      className={`px-4 py-2 rounded-md text-sm transition-all ${
                        billingCycle === cycle
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t(`pricing.billing.${cycle}`)}
                      {cycle === 'yearly' && billingCycle !== 'yearly' && (
                        <span className="ml-1 text-xs text-cyan-400">
                          {t('pricing.billing.save')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>

              <div className="flex flex-col lg:flex-row gap-10">
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:w-2/5 order-2 lg:order-1"
                >
                  <div className="p-6 md:p-8 bg-black border border-gray-800 rounded-xl shadow-lg">
                    <h2 className="mb-6 text-xl font-medium text-white">
                      {t('pricing.availablePlans')}
                    </h2>
                    
                    {pricingPlans.length > 0 ? (
                      <div className="space-y-4 mb-8">
                        {pricingPlans.map((plan) => (
                          <motion.div
                            key={plan.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePlanSelect(plan)}
                            className={`relative cursor-pointer p-4 rounded-lg border ${
                              selectedPlan?.id === plan.id 
                                ? 'border-purple-500 bg-purple-500/10' 
                                : 'border-gray-700 bg-gray-900/50'
                            }`}
                          >
                            {plan.is_popular && (
                              <div className="absolute -top-2 -right-2 text-xs px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white">
                                {t('pricing.popularBadge')}
                              </div>
                            )}
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-lg font-medium text-white">{plan.name}</div>
                                <div className="text-sm text-gray-400">
                                  {plan.description || t('pricing.defaultPlanDescription', { plan: plan.name })}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-white">
                                  {t('pricing.price', { price: getPrice(plan) })}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {t(`pricing.billing.${billingCycle}`)}
                                </div>
                                {billingCycle === 'yearly' && (
                                  <div className="text-xs text-cyan-400">
                                    {t('pricing.yearlySavings', { amount: getYearlySavings(plan) })}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {plan.features?.length > 0 && (
                              <div className="mt-3 grid grid-cols-1 gap-2">
                                {plan.features.map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                                    <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-400 border border-gray-800 rounded-lg mb-8">
                        <p>{t('pricing.noPlansAvailable')}</p>
                      </div>
                    )}

                    {currentPlan && (
                      <div className="p-4 rounded-lg bg-gray-900 mb-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <IoStarOutline className="text-purple-400 w-5 h-5" />
                            <span className="text-gray-300">
                              {t('pricing.currentPlanLabel')}
                            </span>
                          </div>
                          <span className="text-white font-medium">{currentPlan.name}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                          <div className="flex items-center gap-2">
                            <IoTimeOutline className="text-cyan-400 w-5 h-5" />
                            <span className="text-gray-300">
                              {t('pricing.expiresIn')}
                            </span>
                          </div>
                          <span className="text-white font-medium">
                            {t('pricing.daysRemaining', { days: getRemainingDays() })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                          <div className="flex items-center gap-2">
                            <IoRefreshOutline className={`w-5 h-5 ${autoRenewEnabled ? 'text-green-400' : 'text-gray-500'}`} />
                            <span className="text-gray-300">
                              {t('pricing.autoRenewal')}
                            </span>
                          </div>
                          <span className={`font-medium ${autoRenewEnabled ? 'text-green-400' : 'text-yellow-400'}`}>
                            {t(autoRenewEnabled ? 'pricing.enabled' : 'pricing.disabled')}
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedPlan && (
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-gray-800">
                        <h3 className="text-lg font-medium text-white mb-2">
                          {t('pricing.summary')}
                        </h3>
                        <div className="space-y-2">
                          {[
                            { label: 'selectedPlanLabel', value: selectedPlan.name },
                            { 
                              label: 'billingCycleLabel', 
                              value: t(`pricing.duration.${billingCycle}`) 
                            },
                            { 
                              label: 'featuresLabel', 
                              value: selectedPlan.features?.length || 0,
                              condition: selectedPlan.features
                            },
                          ].map((item, index) => (
                            item.condition !== false && (
                              <div key={index} className="flex justify-between">
                                <span className="text-gray-400">
                                  {t(`pricing.${item.label}`)}
                                </span>
                                <span className="text-white">{item.value}</span>
                              </div>
                            )
                          ))}
                          
                          <div className="border-t border-gray-700 my-2 pt-2"></div>
                          <div className="flex justify-between">
                            <span className="text-gray-300 font-medium">
                              {t('pricing.totalAmount')}
                            </span>
                            <span className="text-white font-bold">
                              {t('pricing.price', { price: getPrice(selectedPlan) })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchTransactions}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-gray-300 border border-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-400 transition-all duration-200"
                      >
                        <IoReceiptOutline className="w-4 h-4" />
                        <span>
                          {t(showTransactions ? 'pricing.refreshTransactions' : 'pricing.viewTransactions')}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="lg:w-3/5 order-1 lg:order-2"
                >
                  <div className="p-6 md:p-8 bg-black border border-gray-800 rounded-xl shadow-lg">
                    <div className="mb-6">
                      <h2 className="text-xl font-medium text-white mb-3 sm:mb-0">
                        {t('pricing.paymentDetails')}
                      </h2>
                    </div>
                    
                    {selectedPlan ? (
                      <>
                        {stripePromise ? (
                          <Elements stripe={stripePromise}>
                            <CheckoutForm 
                              selectedPlan={selectedPlan} 
                              billingCycle={billingCycle} 
                              successMessage={t('messages.paymentSuccess')}
                              errorMessage={t('messages.paymentError')}
                            />
                          </Elements>
                        ) : (
                          <div className="text-center py-10 text-gray-400">
                            <div className="animate-spin mb-4 mx-auto w-8 h-8 border-2 border-gray-500 border-t-purple-500 rounded-full"></div>
                            <p>{t('loading.loadingPayment')}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-10 text-gray-400">
                        <p>{t('pricing.selectPlanPrompt')}</p>
                      </div>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {showTransactions && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8 p-6 md:p-8 bg-black border border-gray-800 rounded-xl shadow-lg"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-medium text-white">
                            {t('pricing.transactionHistory')}
                          </h2>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowTransactions(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </motion.button>
                        </div>
                        
                        {transactionsLoading ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="animate-spin w-8 h-8 border-2 border-gray-500 border-t-purple-500 rounded-full"></div>
                          </div>
                        ) : transactions.filter(t => t.purchase_type === 'subscription').length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="text-left border-b border-gray-800">
                                  {['date', 'plan', 'amount', 'billingCycle', 'autoRenewal', 'status'].map((header) => (
                                    <th key={header} className="pb-2 text-sm font-medium text-gray-400">
                                      {t(`pricing.${header}`)}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {transactions
                                  .filter(t => t.purchase_type === 'subscription')
                                  .map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-900/30">
                                      <td className="py-3 text-sm text-gray-300">
                                        {formatDate(transaction.created_at)}
                                      </td>
                                      <td className="py-3 text-sm text-gray-300">
                                        {transaction.plan_name || t('pricing.subscription')}
                                      </td>
                                      <td className="py-3 text-sm text-gray-300">
                                        {t('pricing.price', { price: Number(transaction.amount).toFixed(2), currency: transaction.currency?.toUpperCase() })}
                                      </td>
                                      <td className="py-3 text-sm text-gray-300">
                                        {t(`pricing.billing.${transaction.billing_cycle || 'monthly'}`)}
                                      </td>
                                      <td className="py-3 text-sm">
                                        {transaction.auto_renew !== null && (
                                          <span className={`px-2 py-1 rounded-full text-xs ${
                                            transaction.auto_renew 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-yellow-500/20 text-yellow-400'
                                          }`}>
                                            {t(transaction.auto_renew ? 'pricing.enabled' : 'pricing.disabled')}
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                          transaction.status === 'completed' 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : transaction.status === 'pending'
                                              ? 'bg-yellow-500/20 text-yellow-400'
                                              : transaction.status === 'failed'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                          {t(`pricing.stat.${transaction.status}`)}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <p>{t('pricing.noTransactionsFound')}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </>
          )}
          
          {view === 'subscriptions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SubscriptionManagement 
                successMessage={t('messages.subscriptionUpdateSuccess')}
                errorMessage={t('messages.subscriptionUpdateError')}
              />
            </motion.div>
          )}
        </div>
      </main>
      
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Pricingplan;