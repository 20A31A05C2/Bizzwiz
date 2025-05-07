import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import SideNavbar from './userlayout/sidebar';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import translation hook
import 'react-toastify/dist/ReactToastify.css';
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCreditCard, FiCalendar, FiUser, FiAward, FiBarChart2, 
  FiPenTool, FiMessageSquare, FiCode, FiDollarSign, 
  FiCheckCircle, FiXCircle, FiClock, FiChevronRight,
  FiSettings, FiRefreshCw
} from 'react-icons/fi';

const Dashboard = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    fname: "",
    lname: "",
    email: "",
    credits: 0,
    activePlan: null,
    planActivatedAt: null,
    planExpiresAt: null,
    autoRenew: false,
    isAdmin: false,
    usageStats: {
      logo_requests: 0,
      chat_history: 0,
      bizwebai: 0
    },
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('bizwizusertoken');
        if (!token) {
          navigate('/userlogin');
          toast.error(t('dashboard.errors.loginRequired', "Please login to continue"));
          return;
        }

        const loadingTimeout = setTimeout(() => setLoading(true), 100);
        const response = await ApiService("/userdashboard", "GET");
        clearTimeout(loadingTimeout);

        if (response) {
          setUserData({
            name: `${response.fname} ${response.lname}`,
            fname: response.fname,
            lname: response.lname,
            email: response.email,
            credits: response.credits,
            activePlan: response.active_plan,
            planActivatedAt: response.plan_activated_at,
            planExpiresAt: response.plan_expires_at,
            autoRenew: response.auto_renew,
            isAdmin: response.isAdmin,
            usageStats: response.usage_stats || {
              logo_requests: 0,
              chat_history: 0,
              bizwebai: 0
            },
            transactions: response.transactions || []
          });
        } else {
          throw new Error("Invalid response data");
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || t('dashboard.errors.unknown', "Unknown error occurred");
        console.log(errorMessage);
        navigate('/userlogin', { replace: true });
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    return () => {
      // Cleanup
    };
  }, [navigate, t]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return t('dashboard.notAvailable', 'Not available');
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Format transaction date
  const formatTransactionDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate days remaining until plan expiration
  const getDaysRemaining = () => {
    if (!userData.planExpiresAt) return 0;
    
    const expiryDate = new Date(userData.planExpiresAt);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate how many days since plan activation
  const getDaysSinceActivation = () => {
    if (!userData.planActivatedAt) return 0;
    
    const activationDate = new Date(userData.planActivatedAt);
    const today = new Date();
    const diffTime = today - activationDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate the percentage of plan duration left
  const calculatePlanTimePercentage = () => {
    if (!userData.planExpiresAt || !userData.planActivatedAt) return 0;
    
    const activationDate = new Date(userData.planActivatedAt);
    const expiryDate = new Date(userData.planExpiresAt);
    const today = new Date();
    
    const totalPlanDuration = expiryDate - activationDate;
    const timeElapsed = today - activationDate;
    
    const percentageUsed = (timeElapsed / totalPlanDuration) * 100;
    const percentageRemaining = 100 - percentageUsed;
    
    return percentageRemaining > 0 ? Math.min(percentageRemaining, 100) : 0;
  };

  // Get status icon based on transaction status
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'failed':
      case 'error':
        return <FiXCircle className="text-red-500" />;
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  // Prepare data for usage stats pie chart
  const pieData = useMemo(() => {
    const usageData = [
      { name: t('dashboard.usageStats.logoRequests', 'Logo Requests'), value: userData.usageStats.logo_requests, fill: '#8b5cf6' },
      { name: t('dashboard.usageStats.chatHistory', 'Chat History'), value: userData.usageStats.chat_history, fill: '#3b82f6' },
      { name: t('dashboard.usageStats.bizWebAI', 'BizWebAI'), value: userData.usageStats.bizwebai, fill: '#06b6d4' }
    ];

    // If all values are 0, add a placeholder for better visualization
    return usageData.every(item => item.value === 0) 
      ? [...usageData, { name: t('dashboard.usageStats.noUsageYet', 'No Usage Yet'), value: 1, fill: '#4b5563' }]
      : usageData;
  }, [userData.usageStats, t]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="font-inter">
      {loading ? (
        <LoadingPage name={t('dashboard.loading', "Loading Dashboard")} />
      ) : (
        <div className="flex min-h-screen bg-gradient-to-br from-black to-purple-900/20">
          <SideNavbar />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />

          {/* Main Content */}
          <main className="flex-1 p-4 overflow-y-auto md:p-6">
            <div className="max-w-6xl mx-auto">
              {/* Welcome Header */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-700/30 flex items-center justify-center mr-3">
                    <FiUser className="text-purple-300" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    {t('dashboard.welcome', 'Welcome')}, {userData.fname}
                  </h1>
                </div>
                <p className="text-gray-400">
                  {t('dashboard.overview', "Here's an overview of your account status and activity")}
                </p>
              </motion.div>

              {/* Status Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Credits Card */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-900/30 to-black border border-purple-900/20 shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        {t('dashboard.cards.availableCredits', 'Available Credits')}
                      </h3>
                      <p className="text-2xl font-bold text-white mt-1">{userData.credits.toFixed(2)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-600/20">
                      <FiCreditCard className="text-purple-400" />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-2 py-2 text-sm font-medium bg-purple-600/30 text-purple-200 rounded-lg hover:bg-purple-600/40 transition-colors"
                    onClick={() => navigate('/creditpurchase')}
                  >
                    {t('dashboard.buttons.addCredits', 'Add Credits')}
                  </motion.button>
                </motion.div>

                {/* Plan Name Card */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-900/30 to-black border border-purple-900/20 shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        {t('dashboard.cards.currentPlan', 'Current Plan')}
                      </h3>
                      <p className="text-2xl font-bold text-white mt-1">
                        {userData.activePlan?.name || t('dashboard.cards.noActivePlan', 'No Active Plan')}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-600/20">
                      <FiAward className="text-purple-400" />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2 text-sm font-medium bg-purple-600/30 text-purple-200 rounded-lg hover:bg-purple-600/40 transition-colors"
                      onClick={() => navigate('/pricingplan')}
                    >
                      {t('dashboard.buttons.upgradePlan', 'Upgrade Plan')}
                    </motion.button>
                    {userData.activePlan && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 text-sm font-medium bg-blue-600/30 text-blue-200 rounded-lg hover:bg-blue-600/40 transition-colors flex items-center justify-center"
                        onClick={() => navigate('/manageplan')}
                      >
                        <FiSettings className="mr-1 w-4 h-4" />
                        {t('dashboard.buttons.manage', 'Manage')}
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* Days Remaining Card */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-900/30 to-black border border-purple-900/20 shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        {t('dashboard.cards.planExpires', 'Plan Expires')}
                      </h3>
                      <p className="text-2xl font-bold text-white mt-1">
                        {getDaysRemaining()} {t('dashboard.cards.days', 'Days')}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-600/20">
                      <FiCalendar className="text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="text-gray-400">
                        {t('dashboard.cards.expires', 'Expires')} {formatDate(userData.planExpiresAt)}
                      </span>
                      <span className="text-gray-400">{calculatePlanTimePercentage().toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calculatePlanTimePercentage()}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                      ></motion.div>
                    </div>
                    {userData.autoRenew !== undefined && (
                      <div className="mt-2 flex items-center justify-end">
                        <FiRefreshCw className={`w-3 h-3 mr-1 ${userData.autoRenew ? 'text-green-400' : 'text-gray-500'}`} />
                        <span className={`text-xs ${userData.autoRenew ? 'text-green-400' : 'text-gray-500'}`}>
                          {userData.autoRenew 
                            ? t('dashboard.cards.autoRenewEnabled', 'Auto-renewal enabled')
                            : t('dashboard.cards.autoRenewDisabled', 'Auto-renewal disabled')}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Usage Stats Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Logo Requests Card */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-900/30 to-black border border-purple-900/20 shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-lg bg-purple-600/20 mr-3">
                      <FiPenTool className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        {t('dashboard.usageStats.logoRequests', 'Logo Requests')}
                      </h3>
                      <p className="text-xl font-bold text-white">{userData.usageStats.logo_requests}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${userData.usageStats.logo_requests > 0 ? 100 : 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-1.5 bg-purple-500 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Chat History Card */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-900/30 to-black border border-purple-900/20 shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-lg bg-blue-600/20 mr-3">
                      <FiMessageSquare className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        {t('dashboard.usageStats.chatHistory', 'Chat History')}
                      </h3>
                      <p className="text-xl font-bold text-white">{userData.usageStats.chat_history}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${userData.usageStats.chat_history > 0 ? 100 : 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-1.5 bg-blue-500 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* BizWebAI Card */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-900/30 to-black border border-purple-900/20 shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-lg bg-cyan-600/20 mr-3">
                      <FiCode className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        {t('dashboard.usageStats.bizWebAI', 'BizWebAI')}
                      </h3>
                      <p className="text-xl font-bold text-white">{userData.usageStats.bizwebai}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${userData.usageStats.bizwebai > 0 ? 100 : 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-1.5 bg-cyan-500 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Plan Details */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:col-span-1 p-6 rounded-xl bg-gradient-to-br from-[#2a2435] to-[#231e2e] border border-purple-900/20 shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-white">
                      {t('dashboard.planDetails.title', 'Plan Features')}
                    </h3>
                    <div className="h-8 w-8 rounded-lg bg-purple-800/30 flex items-center justify-center">
                      <FiAward className="text-purple-300" />
                    </div>
                  </div>

                  {userData.activePlan ? (
                    <div className="space-y-5">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-400">
                            {t('dashboard.planDetails.planName', 'Plan Name')}
                          </p>
                          <p className="text-lg font-bold text-white">{userData.activePlan.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            {t('dashboard.planDetails.price', 'Price')}
                          </p>
                          {/* We need to directly check the transaction amount */}
                          {userData.transactions && userData.transactions.some(t => 
                            t.purchase_type === 'subscription' && 
                            t.plan_name === userData.activePlan.name && 
                            parseFloat(t.amount) === parseFloat(userData.activePlan.annual_price)
                          ) ? (
                            <p className="text-lg font-bold text-white">${userData.activePlan.annual_price}/yr</p>
                          ) : (
                            <p className="text-lg font-bold text-white">${userData.activePlan.monthly_price}/mo</p>
                          )}
                        </div>
                      </div>

                      {/* Subscription Type Indicator */}
                      <div className="mt-1 py-2 px-3 bg-purple-500/10 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-green-300">
                            {userData.transactions && userData.transactions.some(t => 
                              t.purchase_type === 'subscription' && 
                              t.plan_name === userData.activePlan.name && 
                              parseFloat(t.amount) === parseFloat(userData.activePlan.annual_price)
                            ) ? 
                              t('dashboard.planDetails.annualSubscription', 'Annual Subscription') : 
                              t('dashboard.planDetails.monthlySubscription', 'Monthly Subscription')}
                          </span>
                        </div>
                      </div>

                      {/* Plan dates and auto-renewal status */}
                      <div className="mt-1 py-2 px-3 bg-gray-800/40 rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">
                            {t('dashboard.planDetails.activated', 'Activated:')}
                          </span>
                          <span className="text-gray-300">{formatDate(userData.planActivatedAt)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">
                            {t('dashboard.planDetails.expires', 'Expires:')}
                          </span>
                          <span className="text-gray-300">{formatDate(userData.planExpiresAt)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">
                            {t('dashboard.planDetails.autoRenewal', 'Auto-renewal:')}
                          </span>
                          <span className={userData.autoRenew ? 'text-green-400' : 'text-yellow-400'}>
                            {userData.autoRenew ? 
                              t('dashboard.planDetails.enabled', 'Enabled') : 
                              t('dashboard.planDetails.disabled', 'Disabled')}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-purple-900/30">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">
                          {t('dashboard.planDetails.featuresIncluded', 'Features Included:')}
                        </h4>
                        {userData.activePlan.raw_features && Array.isArray(userData.activePlan.raw_features) ? (
                          <ul className="space-y-4">
                            {userData.activePlan.raw_features.map((feature, index) => (
                              <motion.li 
                                key={index}
                                className="flex items-center"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                                <span className="text-gray-300">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400">
                            {t('dashboard.planDetails.noFeatures', 'No features available')}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 text-center space-y-2">
                        <p className="text-xs text-gray-400 mb-2">
                          {t('dashboard.planDetails.planExpires', 'Plan Expires:')} {formatDate(userData.planExpiresAt)}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-6 py-2 text-sm font-medium bg-purple-600/30 text-purple-200 rounded-lg hover:bg-purple-600/40 transition-colors"
                          onClick={() => navigate('/pricingplan')}
                        >
                          {t('dashboard.buttons.upgradePlan', 'Upgrade Plan')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-6 py-2 text-sm font-medium bg-blue-600/30 text-blue-200 rounded-lg hover:bg-blue-600/40 transition-colors flex items-center justify-center"
                          onClick={() => navigate('/manageplan')}
                        >
                          <FiSettings className="mr-2 w-4 h-4" />
                          {t('dashboard.buttons.manageSubscription', 'Manage Subscription')}
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-gray-400 mb-4">
                        {t('dashboard.planDetails.noActivePlan', 'No active plan')}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 text-sm font-medium bg-purple-600/30 text-purple-200 rounded-lg hover:bg-purple-600/40 transition-colors"
                        onClick={() => navigate('/pricingplan')}
                      >
                        {t('dashboard.buttons.viewPlans', 'View Plans')}
                      </motion.button>
                    </div>
                  )}


                  {/* Usage Pie Chart */}
                  <div className="mt-8 border-t border-purple-900/30 pt-5">
                    <div className="flex items-center mb-4">
                      <div className="h-7 w-7 rounded-lg bg-purple-800/30 flex items-center justify-center mr-2">
                        <FiBarChart2 className="text-purple-300" />
                      </div>
                      <h3 className="text-md font-medium text-white">
                        {t('dashboard.usageBreakdown.title', 'Usage Breakdown')}
                      </h3>
                    </div>
                    
                    <div className="h-48 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={1}
                            dataKey="value"
                            animationBegin={200}
                            animationDuration={800}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(26, 27, 38, 0.9)',
                              border: '1px solid #3f3f5a',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 mt-3">
                      <div className="flex items-center text-xs">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-gray-400">
                          {t('dashboard.usageBreakdown.logoRequests', 'Logo Requests')}: {userData.usageStats.logo_requests}
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-gray-400">
                          {t('dashboard.usageBreakdown.chatHistory', 'Chat History')}: {userData.usageStats.chat_history}
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></div>
                        <span className="text-gray-400">
                          {t('dashboard.usageBreakdown.bizWebAI', 'BizWebAI')}: {userData.usageStats.bizwebai}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Transaction History - Revised Modern UI */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="lg:col-span-2 p-6 rounded-xl bg-gradient-to-br from-[#2a2435] to-[#231e2e] border border-purple-900/20 shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                        <FiDollarSign className="text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {t('dashboard.transactionHistory.title', 'Transaction History')}
                      </h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar">
                    <AnimatePresence>
                      {userData.transactions && userData.transactions.length > 0 ? (
                        <div className="space-y-3">
                          {userData.transactions.map((transaction, index) => (
                            <motion.div
                              key={transaction.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-3 rounded-lg bg-purple-900/10 border border-purple-900/10 hover:border-purple-500/20 hover:bg-purple-900/20 transition-all duration-300"
                            >
                              <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                                <div className="w-full md:w-auto mb-2 md:mb-0">
                                  <div className="flex items-center">
                                    {getStatusIcon(transaction.status)}
                                    <span className="ml-2 text-sm font-medium text-gray-300 capitalize">
                                      {t(`dashboard.transactionHistory.types.${transaction.payment_type || transaction.purchase_type || 'transaction'}`, 
                                        transaction.payment_type || transaction.purchase_type || 'Transaction')}
                                    </span>
                                    {transaction.plan_name && (
                                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-200">
                                        {transaction.plan_name}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatTransactionDate(transaction.created_at)}
                                  </p>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                  {transaction.credits_purchased ? (
                                    <div className="text-center">
                                      <p className="text-xs text-gray-400">
                                        {t('dashboard.transactionHistory.credits', 'Credits')}
                                      </p>
                                      <p className="text-sm font-semibold text-blue-400">
                                        {transaction.credits_purchased}
                                      </p>
                                    </div>
                                  ) : null}
                                  
                                  <div className="text-center">
                                    <p className="text-xs text-gray-400">{transaction.currency || 'USD'}</p>
                                    <p className={`text-sm font-bold ${parseFloat(transaction.amount) > 0 ? 'text-green-400' : 'text-purple-400'}`}>
                                      {parseFloat(transaction.amount).toFixed(2)}
                                    </p>
                                  </div>
                                  
                                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center ml-2">
                                    <FiChevronRight className="text-gray-400" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-10"
                        >
                          <div className="flex justify-center mb-3">
                            <FiDollarSign className="text-gray-500 text-4xl" />
                          </div>
                          <p className="text-gray-400">
                            {t('dashboard.transactionHistory.noTransactions', 'No transactions found')}
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            {t('dashboard.transactionHistory.willAppearHere', 'Your recent transactions will appear here')}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {userData.transactions && userData.transactions.length > 0 && (
                    <div className="mt-4 text-right">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-sm font-medium bg-purple-600/30 text-purple-200 rounded-lg hover:bg-purple-600/40 transition-colors"
                        onClick={() => navigate('/transactions')}
                      >
                        {t('dashboard.buttons.viewAllTransactions', 'View All Transactions')}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default Dashboard;