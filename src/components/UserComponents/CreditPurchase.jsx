import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Added translation hook
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoWalletOutline,
  IoCloseCircle,
  IoFlashOutline,
  IoReceiptOutline
} from 'react-icons/io5';
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';
import SideNavbar from './userlayout/sidebar';
import CheckoutForm from './CheckoutForm';

// Stripe will be initialized after fetching key from backend
const CreditPurchase = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [loading, setLoading] = useState(true);
  const [currentCredits, setCurrentCredits] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [creditPackages, setCreditPackages] = useState([]);
  const [basePricePerCredit, setBasePricePerCredit] = useState(1.00);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem('bizwizusertoken');
        if (!token) {
          toast.error(t('creditPurchase.pleaseLogin', "Please login to continue"));
          navigate('/userlogin');
          return;
        }

        // Fetch user's current credits and credit packages in parallel
        const [creditsResponse, packagesResponse] = await Promise.all([
          ApiService("/getcredits", "GET"),
          ApiService("/credit-packages", "GET")
        ]);

        // Process credits response
        if (creditsResponse.success) {
          setCurrentCredits(creditsResponse.credits || 0);
        }

        // Process packages response
        if (packagesResponse.success && packagesResponse.packages) {
          setCreditPackages(packagesResponse.packages);
          
          // Set base price per credit - convert to number to ensure it's a numeric value
          if (packagesResponse.base_price_per_credit) {
            setBasePricePerCredit(Number(packagesResponse.base_price_per_credit));
          }
          
          // Select the first package by default if available
          if (packagesResponse.packages.length > 0) {
            const defaultPackage = packagesResponse.packages.find(pkg => pkg.popular) || packagesResponse.packages[0];
            setSelectedAmount(Number(defaultPackage.amount));
            setSelectedPrice(Number(defaultPackage.price));
            setSelectedDiscount(Number(defaultPackage.discount_percentage) || 0);
          }
        } else {
          toast.error(t('creditPurchase.loadPackagesError', "Could not load credit packages. Please try again later."));
        }

        // Fetch Stripe configuration
        try {
          const stripeConfigResponse = await ApiService("/stripe-config", "GET");
          if (stripeConfigResponse.success && stripeConfigResponse.publishable_key) {
            // Lazy load Stripe only when needed
            const stripePromiseObj = loadStripe(stripeConfigResponse.publishable_key);
            setStripePromise(stripePromiseObj);
          }
        } catch (error) {
          toast.error(t('creditPurchase.paymentInitError', "Could not initialize payment system. Please try again later."));
        }
      } catch (error) {
        const errormessage = error?.response?.data?.message || t('creditPurchase.genericError', "An error occurred");
        
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

  // Function to handle package selection
  const handlePackageSelect = (amount, price, discount) => {
    setSelectedAmount(Number(amount));
    setSelectedPrice(Number(price));
    setSelectedDiscount(Number(discount) || 0);
  };

  // Calculate what the standard price would be without discount
  const calculateStandardPrice = (amount) => {
    return (amount * basePricePerCredit).toFixed(2);
  };

  // Function to fetch transaction history
  const fetchTransactions = async () => {
    if (transactionsLoading) return;
    
    setTransactionsLoading(true);
    try {
      const response = await ApiService("/payment/transactions", "GET");
      if (response.success) {
        setTransactions(response.data || []);
        setShowTransactions(true);
      } else {
        toast.error(response.message || t('creditPurchase.fetchTransactionsError', "Failed to fetch transaction history"));
      }
    } catch (error) {
      const errormessage = error?.response?.data?.message || t('creditPurchase.loadHistoryError', "Failed to load transaction history");
      toast.error(errormessage);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Format date for transaction history
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <LoadingPage name={t('creditPurchase.loading', "Loading Credit Info...")} />;

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
            className="mb-12 text-center"
          >
            <h1 className="mb-3 text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              {t('creditPurchase.title', "Purchase Credits")}
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400">
              {t('creditPurchase.subtitle', "Add more credits to your account.")} 
              {basePricePerCredit !== 1.00 
                ? t('creditPurchase.creditRate', "1 credit = ${{price}}", { price: Number(basePricePerCredit).toFixed(2) }) 
                : t('creditPurchase.defaultRate', "1 credit = $1.00")}
            </p>
          </motion.header>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Credit Selection Section */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:w-2/5 order-2 lg:order-1"
            >
              <div className="p-6 md:p-8 bg-black border border-gray-800 rounded-xl shadow-lg">
                <h2 className="mb-6 text-xl font-medium text-white">
                  {t('creditPurchase.selectPackage', "Select Credit Package")}
                </h2>
                
                {creditPackages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {creditPackages.map((pkg) => (
                      <motion.div
                        key={pkg.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePackageSelect(pkg.amount, pkg.price, pkg.discount_percentage)}
                        className={`relative cursor-pointer p-4 rounded-lg border ${
                          selectedAmount === pkg.amount 
                            ? 'border-purple-500 bg-purple-500/10' 
                            : 'border-gray-700 bg-gray-900/50'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-2 -right-2 text-xs px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white">
                            {t('creditPurchase.popular', "Popular")}
                          </div>
                        )}
                        <div className="text-lg font-medium text-white">{pkg.name}</div>
                        <div className="text-sm text-gray-400">${Number(pkg.price).toFixed(2)}</div>
                        
                        {/* Display discount if exists */}
                        {pkg.discount_percentage > 0 && (
                          <div className="text-xs mt-1 flex items-center gap-1 text-green-400">
                            <IoFlashOutline className="w-3 h-3" />
                            <span>{t('creditPurchase.percentOff', "{{percent}}% off", { percent: pkg.discount_percentage.toFixed(0) })}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400 border border-gray-800 rounded-lg mb-8">
                    <p>{t('creditPurchase.noPackages', "No credit packages available at the moment.")}</p>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-gray-900 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IoWalletOutline className="text-cyan-400 w-5 h-5" />
                      <span className="text-gray-300">{t('creditPurchase.currentBalance', "Current Balance")}</span>
                    </div>
                    <span className="text-white font-medium">
                      {t('creditPurchase.creditsCount', "{{count}} Credits", { count: currentCredits })}
                    </span>
                  </div>
                </div>

                {selectedAmount && selectedPrice && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-gray-800">
                    <h3 className="text-lg font-medium text-white mb-2">{t('creditPurchase.summary', "Summary")}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t('creditPurchase.creditsToPurchase', "Credits to Purchase")}</span>
                        <span className="text-white">{selectedAmount}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t('creditPurchase.pricePerCredit', "Price Per Credit")}</span>
                        <span className="text-white">${(Number(selectedPrice) / Number(selectedAmount)).toFixed(2)}</span>
                      </div>
                      
                      {/* Show discount information if there is a discount */}
                      {selectedDiscount > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">{t('creditPurchase.standardPrice', "Standard Price")}</span>
                            <span className="text-gray-400 line-through">${calculateStandardPrice(selectedAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-400">{t('creditPurchase.discount', "Discount")}</span>
                            <span className="text-green-400">
                              {t('creditPurchase.percentOff', "{{percent}}% off", { percent: selectedDiscount.toFixed(0) })}
                            </span>
                          </div>
                        </>
                      )}
                      
                      <div className="border-t border-gray-700 my-2 pt-2"></div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-medium">{t('creditPurchase.totalAmount', "Total Amount")}</span>
                        <span className="text-white font-bold">${Number(selectedPrice).toFixed(2)}</span>
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
                    disabled={transactionsLoading}
                    className="flex items-center justify-center w-full gap-2 px-4 py-2 text-gray-300 border border-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {transactionsLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
                        <span>{t('creditPurchase.loading', "Loading...")}</span>
                      </>
                    ) : (
                      <>
                        <IoReceiptOutline className="w-4 h-4" />
                        <span>
                          {showTransactions 
                            ? t('creditPurchase.refreshHistory', "Refresh Credit Transaction History")
                            : t('creditPurchase.viewHistory', "View Credit Transaction History")}
                        </span>
                      </>
                    )}
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
                <h2 className="text-xl font-medium text-white mb-6">{t('creditPurchase.paymentDetails', "Payment Details")}</h2>
                
                {selectedAmount && selectedPrice ? (
                  <>
                    {/* Credit Card Payment Form */}
                    {stripePromise ? (
                      <Elements stripe={stripePromise}>
                        <CreditCheckoutWrapper 
                          selectedAmount={selectedAmount} 
                          selectedPrice={selectedPrice} 
                        />
                      </Elements>
                    ) : (
                      <div className="text-center py-10 text-gray-400">
                        <div className="animate-spin mb-4 mx-auto w-8 h-8 border-2 border-gray-500 border-t-purple-500 rounded-full"></div>
                        <p>{t('creditPurchase.loadingPayment', "Loading payment system...")}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p>{t('creditPurchase.selectToContinue', "Please select a credit package to continue.")}</p>
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
                      <h2 className="text-xl font-medium text-white">
                        {t('creditPurchase.transactionHistory', "Credit Transactions History")}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowTransactions(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <IoCloseCircle className="w-5 h-5" />
                      </motion.button>
                    </div>
                    
                    {transactionsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-500 border-t-purple-500 rounded-full"></div>
                      </div>
                    ) : (
                      <>
                        {/* Filter only credit transactions */}
                        {(() => {
                          const creditTransactions = transactions.filter(
                            transaction => transaction.purchase_type === 'credits'
                          );
                          
                          return creditTransactions.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left border-b border-gray-800">
                                    <th className="pb-2 text-sm font-medium text-gray-400">
                                      {t('creditPurchase.date', "Date")}
                                    </th>
                                    <th className="pb-2 text-sm font-medium text-gray-400">
                                      {t('creditPurchase.transactionId', "Transaction ID")}
                                    </th>
                                    <th className="pb-2 text-sm font-medium text-gray-400">
                                      {t('creditPurchase.amount', "Amount")}
                                    </th>
                                    <th className="pb-2 text-sm font-medium text-gray-400">
                                      {t('creditPurchase.credits', "Credits")}
                                    </th>
                                    <th className="pb-2 text-sm font-medium text-gray-400">
                                      {t('creditPurchase.method', "Method")}
                                    </th>
                                    <th className="pb-2 text-sm font-medium text-gray-400">
                                      {t('creditPurchase.status', "Status")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {creditTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-900/30">
                                      <td className="py-3 text-sm text-gray-300">{formatDate(transaction.created_at)}</td>
                                      <td className="py-3 text-sm text-gray-300">
                                        <div className="flex items-center">
                                          <span className="truncate max-w-[120px]">
                                            {transaction.transaction_id}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-3 text-sm text-gray-300">
                                        ${Number(transaction.amount).toFixed(2)} {transaction.currency?.toUpperCase()}
                                      </td>
                                      <td className="py-3 text-sm text-gray-300">
                                        {transaction.credits_purchased}
                                      </td>
                                      <td className="py-3 text-sm text-gray-300">
                                        {transaction.payment_type === 'card' 
                                          ? t('creditPurchase.creditCard', "Credit Card") 
                                          : transaction.payment_type}
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
                                          {t(`creditPurchase.statusTypes.${transaction.status}`, 
                                            transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1))}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              <p>{t('creditPurchase.noTransactions', "No credit transaction history found.")}</p>
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

// Wrapper for Credit Card checkout to handle credit-specific logic
const CreditCheckoutWrapper = ({ selectedAmount, selectedPrice }) => {
  const { t } = useTranslation(); // Add translation support to the wrapper component
  
  // Create a plan object to match the structure expected by CheckoutForm
  const creditPlan = {
    name: t('creditPurchase.creditAmount', "{{amount}} Credits", { amount: selectedAmount }),
    monthly_price: selectedPrice
  };

  // Override the API call parameters for credit purchases
  const onSubmitOverrides = {
    purchase_type: 'credits',
    credits: selectedAmount
  };

  return (
    <CheckoutForm 
      selectedPlan={creditPlan} 
      apiOverrides={onSubmitOverrides}
    />
  );
};

export default CreditPurchase;