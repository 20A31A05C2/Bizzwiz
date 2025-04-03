// Existing imports
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
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';
import SideNavbar from './userlayout/sidebar';
import CheckoutForm from './CheckoutForm';
import SubscriptionManagement from './SubscriptionManagement';

// Main Pricing Plan Component
const Pricingplan = () => {
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
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly'); // Default to monthly billing
  const [view, setView] = useState('plans'); // 'plans', 'subscriptions'
  
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem('bizwizusertoken');
        if (!token) {
          toast.error("Please login to continue");
          navigate('/userlogin');
          return;
        }

        // Fetch pricing plans from backend
        const plansResponse = await ApiService("/pricing-plans", "GET");
        
        if (plansResponse.success && plansResponse.plans) {
          // Direct access to the plans array, as the backend structure returns plans directly
          const plansArray = Array.isArray(plansResponse.plans) 
            ? plansResponse.plans 
            : [];
          
          setPricingPlans(plansArray);
          
          // Select the popular plan by default if available
          if (plansArray.length > 0) {
            const defaultPlan = plansArray.find(plan => plan.is_popular) || plansArray[0];
            setSelectedPlan(defaultPlan);
          }
        } else {
          toast.error("Could not load pricing plans. Please try again later.");
        }

        // Fetch Stripe config directly from stripe-config endpoint
        const stripeConfigResponse = await ApiService("/stripe-config", "GET");
        if (stripeConfigResponse.success && stripeConfigResponse.publishable_key) {
          setStripePromise(loadStripe(stripeConfigResponse.publishable_key));
        }
        
        // Fetch active subscriptions
        const subscriptionsResponse = await ApiService("/active-subscriptions", "GET");
        if (subscriptionsResponse.success && subscriptionsResponse.subscriptions) {
          setActiveSubscriptions(subscriptionsResponse.subscriptions);
          
          // If there are active subscriptions, get the current user's plan
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
        const errormessage = error?.response?.data?.message || "An error occurred";
        
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
  }, [navigate]);

  // Function to handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  // Toggle billing cycle
  const toggleBillingCycle = (cycle) => {
    setBillingCycle(cycle);
  };

  // Toggle view between plans and subscriptions
  const toggleView = (newView) => {
    if (newView === 'subscriptions') {
      // Navigate to manage plan URL instead of showing the component inline
      navigate('/manageplan');
    } else {
      setView(newView);
    }
  };

  // Calculate remaining days for current plan
  const getRemainingDays = () => {
    if (!currentPlanExpiry) return 0;
    
    const expiryDate = new Date(currentPlanExpiry);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Function to fetch transaction history
  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const response = await ApiService("/payment/transactions", "GET");
      if (response.success) {
        setTransactions(response.data || []);
        setShowTransactions(true);
      } else {
        toast.error(response.message || "Failed to fetch transaction history");
      }
    } catch (error) {
      const errormessage = error?.response?.data?.message || "Failed to load transaction history";
      toast.error(errormessage);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Function to get the correct price based on billing cycle
  const getPrice = (plan) => {
    if (billingCycle === 'yearly') {
      // Use yearly_price if available, otherwise fallback to annual_price
      const price = plan.yearly_price || plan.annual_price;
      return price ? Number(price).toFixed(2) : Number(plan.monthly_price * 10).toFixed(2);
    }
    return Number(plan.monthly_price).toFixed(2);
  };

  // Calculate yearly savings
  const getYearlySavings = (plan) => {
    const yearlyPrice = Number(plan.yearly_price || plan.annual_price);
    const monthlyTotal = Number(plan.monthly_price) * 12;
    return (monthlyTotal - yearlyPrice).toFixed(2);
  };

  // Format date for transaction history
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <LoadingPage name="Loading Plans..." />;

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavbar />
      
      <main className="flex-1 px-4 py-8 md:px-8 lg:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-center"
          >
            <h1 className="mb-3 text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              {view === 'plans' ? 'Select a Subscription Plan' : 'Manage Your Subscriptions'}
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400">
              {view === 'plans' 
                ? 'Choose the plan that best fits your needs and unlock premium features.' 
                : 'View and manage your active subscriptions and auto-renewal settings.'}
              {currentPlan && view === 'plans' && (
                <span className="block mt-2 text-sm">
                  <span className="text-cyan-400">
                    Current plan: <strong>{currentPlan.name}</strong> • {getRemainingDays()} days remaining
                  </span>
                  <span className="ml-2 text-xs">
                    {autoRenewEnabled ? (
                      <span className="text-green-400">
                        <IoRefreshOutline className="inline-block w-3 h-3 mr-1" />
                        Auto-renewal enabled
                      </span>
                    ) : (
                      <span className="text-yellow-400">Auto-renewal disabled</span>
                    )}
                  </span>
                </span>
              )}
            </p>
            
            {/* View Toggle */}
            <div className="flex justify-center mt-6">
              <div className="p-1 bg-gray-900 rounded-lg inline-flex">
                <button
                  onClick={() => toggleView('plans')}
                  className={`px-4 py-2 rounded-md text-sm transition-all ${
                    view === 'plans'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Browse Plans
                </button>
                
                <button
                  onClick={() => toggleView('subscriptions')}
                  className={`px-4 py-2 rounded-md text-sm transition-all ${
                    view === 'subscriptions'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Manage Subscriptions {activeSubscriptions.length > 0 && `(${activeSubscriptions.length})`}
                </button>
              </div>
            </div>
          </motion.header>

          {view === 'plans' && (
            <>
              {/* Billing Cycle Toggle */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="mb-8 flex justify-center"
              >
                <div className="p-1 bg-gray-900 rounded-lg inline-flex">
                  <button
                    onClick={() => toggleBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  
                  <button
                    onClick={() => toggleBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      billingCycle === 'yearly'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Yearly
                    {billingCycle !== 'yearly' && (
                      <span className="ml-1 text-xs text-cyan-400">Save 20%</span>
                    )}
                  </button>
                </div>
              </motion.div>

              <div className="flex flex-col lg:flex-row gap-10">
                {/* Plans Selection Section */}
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:w-2/5 order-2 lg:order-1"
                >
                  <div className="p-6 md:p-8 bg-black border border-gray-800 rounded-xl shadow-lg">
                    <h2 className="mb-6 text-xl font-medium text-white">Available Plans</h2>
                    
                    {pricingPlans.length > 0 ? (
                      <div className="space-y-4 mb-8">
                        {pricingPlans.map((plan) => (
                          <motion.div
                            key={plan.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePlanSelect(plan)}
                            className={`relative cursor-pointer p-4 rounded-lg border ${
                              selectedPlan && selectedPlan.id === plan.id 
                                ? 'border-purple-500 bg-purple-500/10' 
                                : 'border-gray-700 bg-gray-900/50'
                            }`}
                          >
                            {plan.is_popular && (
                              <div className="absolute -top-2 -right-2 text-xs px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white">
                                Popular
                              </div>
                            )}
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-lg font-medium text-white">{plan.name}</div>
                                <div className="text-sm text-gray-400">{plan.description || `${plan.name} Subscription`}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-white">
                                  ${getPrice(plan)}
                                </div>
                                <div className="text-xs text-gray-400">{billingCycle}</div>
                                {billingCycle === 'yearly' && (
                                  <div className="text-xs text-cyan-400">
                                    Save ${getYearlySavings(plan)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Show features */}
                            {plan.features && plan.features.length > 0 && (
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
                        <p>No plans available at the moment.</p>
                      </div>
                    )}

                    {currentPlan && (
                      <div className="p-4 rounded-lg bg-gray-900 mb-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <IoStarOutline className="text-purple-400 w-5 h-5" />
                            <span className="text-gray-300">Current Plan</span>
                          </div>
                          <span className="text-white font-medium">{currentPlan.name}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                          <div className="flex items-center gap-2">
                            <IoTimeOutline className="text-cyan-400 w-5 h-5" />
                            <span className="text-gray-300">Expires In</span>
                          </div>
                          <span className="text-white font-medium">{getRemainingDays()} days</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                          <div className="flex items-center gap-2">
                            <IoRefreshOutline className={`w-5 h-5 ${autoRenewEnabled ? 'text-green-400' : 'text-gray-500'}`} />
                            <span className="text-gray-300">Auto-Renewal</span>
                          </div>
                          <span className={`font-medium ${autoRenewEnabled ? 'text-green-400' : 'text-yellow-400'}`}>
                            {autoRenewEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedPlan && (
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-gray-800">
                        <h3 className="text-lg font-medium text-white mb-2">Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Selected Plan</span>
                            <span className="text-white">{selectedPlan.name}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Billing Cycle</span>
                            <span className="text-white">{billingCycle === 'yearly' ? 'Yearly (365 days)' : 'Monthly (30 days)'}</span>
                          </div>
                          
                          {selectedPlan.features && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Features</span>
                              <span className="text-white">{Array.isArray(selectedPlan.features) ? selectedPlan.features.length : 0}</span>
                            </div>
                          )}
                          
                          <div className="border-t border-gray-700 my-2 pt-2"></div>
                          <div className="flex justify-between">
                            <span className="text-gray-300 font-medium">Total Amount</span>
                            <span className="text-white font-bold">
                              ${getPrice(selectedPlan)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Transaction History Button */}
                    <div className="mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchTransactions}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-gray-300 border border-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-400 transition-all duration-200"
                      >
                        <IoReceiptOutline className="w-4 h-4" />
                        <span>{showTransactions ? 'Refresh' : 'View'} Transaction History</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Form Section */}
                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="lg:w-3/5 order-1 lg:order-2"
                >
                  <div className="p-6 md:p-8 bg-black border border-gray-800 rounded-xl shadow-lg">
                    <div className="mb-6">
                      <h2 className="text-xl font-medium text-white mb-3 sm:mb-0">Payment Details</h2>
                    </div>
                    
                    {selectedPlan ? (
                      <>
                        {/* Credit Card Payment Form */}
                        {stripePromise ? (
                          <Elements stripe={stripePromise}>
                            <CheckoutForm selectedPlan={selectedPlan} billingCycle={billingCycle} />
                          </Elements>
                        ) : (
                          <div className="text-center py-10 text-gray-400">
                            <div className="animate-spin mb-4 mx-auto w-8 h-8 border-2 border-gray-500 border-t-purple-500 rounded-full"></div>
                            <p>Loading payment system...</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-10 text-gray-400">
                        <p>Please select a plan to continue.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Transaction History Section */}
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
                          <h2 className="text-xl font-medium text-white">Subscription Transactions</h2>
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
                        ) : (
                          <>
                            {/* Filter only subscription transactions */}
                            {(() => {
                              const subscriptionTransactions = transactions.filter(
                                transaction => transaction.purchase_type === 'subscription'
                              );
                        
                              return subscriptionTransactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="text-left border-b border-gray-800">
                                        <th className="pb-2 text-sm font-medium text-gray-400">Date</th>
                                        <th className="pb-2 text-sm font-medium text-gray-400">Plan</th>
                                        <th className="pb-2 text-sm font-medium text-gray-400">Amount</th>
                                        <th className="pb-2 text-sm font-medium text-gray-400">Billing Cycle</th>
                                        <th className="pb-2 text-sm font-medium text-gray-400">Auto-Renewal</th>
                                        <th className="pb-2 text-sm font-medium text-gray-400">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {subscriptionTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-900/30">
                                          <td className="py-3 text-sm text-gray-300">{formatDate(transaction.created_at)}</td>
                                          <td className="py-3 text-sm text-gray-300">
                                            {transaction.plan_name || 'Subscription'}
                                          </td>
                                          <td className="py-3 text-sm text-gray-300">
                                            ${Number(transaction.amount).toFixed(2)} {transaction.currency?.toUpperCase()}
                                          </td>
                                          <td className="py-3 text-sm text-gray-300">
                                            <span className="capitalize">{transaction.billing_cycle || 'Monthly'}</span>
                                          </td>
                                          <td className="py-3 text-sm">
                                            {transaction.auto_renew !== null && (
                                              <span className={`px-2 py-1 rounded-full text-xs ${
                                                transaction.auto_renew 
                                                  ? 'bg-green-500/20 text-green-400' 
                                                  : 'bg-yellow-500/20 text-yellow-400'
                                              }`}>
                                                {transaction.auto_renew ? 'Enabled' : 'Disabled'}
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
                                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-400">
                                  <p>No subscription transactions found.</p>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </>
          )}
          
          {/* Subscription Management View - Note: This won't be rendered anymore since we're redirecting */}
          {view === 'subscriptions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SubscriptionManagement />
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