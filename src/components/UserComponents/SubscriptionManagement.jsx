import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import { 
  IoRefreshOutline, 
  IoStopCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCalendarOutline,
  IoWalletOutline,
  IoCardOutline,
  IoCloseOutline,
  IoHelpCircleOutline
} from 'react-icons/io5';
import ApiService from '../../Apiservice';
import SideNavbar from './userlayout/sidebar';


const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await ApiService("/active-subscriptions", "GET");
      if (response.success) {
        setSubscriptions(response.subscriptions || []);
      } else {
        toast.error(response.message || "Failed to fetch subscriptions");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to load subscriptions";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRenewal = async (subscriptionId, currentStatus) => {
    setProcessingId(subscriptionId);
    try {
      const response = await ApiService("/toggle-auto-renewal", "POST", {
        subscription_id: subscriptionId,
        auto_renew: !currentStatus
      });

      if (response.success) {
        // Update the local state
        setSubscriptions(prevSubs => 
          prevSubs.map(sub => 
            sub.subscription_id === subscriptionId 
              ? { ...sub, auto_renew: !currentStatus, status: !currentStatus ? 'active' : 'cancelling' }
              : sub
          )
        );
        toast.success(response.message || (!currentStatus ? "Auto-renewal enabled" : "Auto-renewal disabled"));
      } else {
        toast.error(response.message || "Failed to update auto-renewal");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const prepareToCancel = (subscription) => {
    setSubscriptionToCancel(subscription);
    setShowCancelModal(true);
  };

  const cancelSubscription = async () => {
    if (!subscriptionToCancel) return;
    
    const subscriptionId = subscriptionToCancel.subscription_id;
    setProcessingId(subscriptionId);
    setShowCancelModal(false);
    
    try {
      const response = await ApiService("/cancel-subscription", "POST", {
        subscription_id: subscriptionId
      });

      if (response.success) {
        // Update the local state
        setSubscriptions(prevSubs => 
          prevSubs.map(sub => 
            sub.subscription_id === subscriptionId 
              ? { ...sub, auto_renew: false, status: 'cancelling', cancelled_at: new Date() }
              : sub
          )
        );
        toast.success(response.message || "Subscription auto-renewal canceled successfully");
      } else {
        toast.error(response.message || "Failed to cancel subscription");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setProcessingId(null);
      setSubscriptionToCancel(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="rounded-xl bg-black border border-gray-800 shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gray-500 border-t-purple-500 rounded-full"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl bg-black border border-gray-800 shadow-lg">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-medium text-white mb-6">Manage Subscriptions</h2>

          {subscriptions.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-lg border border-gray-800 bg-gray-900/30">
              <div className="text-gray-400 mb-4">
                <IoWalletOutline className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-300 mb-2">You don't have any active subscriptions</p>
              <p className="text-gray-500 text-sm">Choose a plan to unlock premium features</p>
            </div>
          ) : (
            <div className="space-y-6">
              {subscriptions.map(subscription => (
                <motion.div
                  key={subscription.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-900/80 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        {subscription.plan.name} Plan
                        {subscription.auto_renew && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400">
                            <IoRefreshOutline className="w-3 h-3 inline mr-1" />
                            Auto-Renewal
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">${subscription.amount.toFixed(2)} / {subscription.billing_cycle}</p>
                    </div>
                    
                    <div className="mt-3 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        subscription.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : subscription.status === 'cancelling'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {subscription.status === 'active' ? (
                          <>
                            <IoCheckmarkCircleOutline className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : subscription.status === 'cancelling' ? (
                          <>
                            <IoAlertCircleOutline className="w-3 h-3 mr-1" />
                            Cancelling
                          </>
                        ) : (
                          <>
                            <IoStopCircleOutline className="w-3 h-3 mr-1" />
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-2 rounded-md bg-gray-800/50">
                      <IoTimeOutline className="text-cyan-400 w-4 h-4" />
                      <span className="text-sm text-gray-300">Next billing:</span>
                      <span className="text-sm text-white">{formatDate(subscription.next_billing_date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-md bg-gray-800/50">
                      <IoCalendarOutline className="text-purple-400 w-4 h-4" />
                      <span className="text-sm text-gray-300">Started:</span>
                      <span className="text-sm text-white">{formatDate(subscription.created_at)}</span>
                    </div>
                  </div>
                  
                  {subscription.cancelled_at && (
                    <div className="mb-4 p-3 rounded bg-yellow-500/10 border border-yellow-500/30">
                      <p className="text-sm text-yellow-400 flex items-start">
                        <IoAlertCircleOutline className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                        <span>
                          Auto-renewal cancelled on {formatDate(subscription.cancelled_at)}. 
                          Your subscription will remain active until {formatDate(subscription.next_billing_date)}.
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleAutoRenewal(subscription.subscription_id, subscription.auto_renew)}
                      disabled={processingId === subscription.subscription_id}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                        subscription.auto_renew
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {processingId === subscription.subscription_id ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <IoRefreshOutline className="w-4 h-4" />
                      )}
                      {subscription.auto_renew ? 'Disable Auto-Renewal' : 'Enable Auto-Renewal'}
                    </motion.button>
                    
                    {subscription.auto_renew && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => prepareToCancel(subscription)}
                        disabled={processingId === subscription.subscription_id}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IoStopCircleOutline className="w-4 h-4" />
                        Cancel Subscription
                      </motion.button>
                    )}

                    <div className="flex items-center ml-auto">
                      <button
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        onClick={() => toast.info("Contact customer support for help with your subscription")}
                      >
                        <IoHelpCircleOutline className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Subscription management help section */}
          <div className="mt-8 p-4 rounded-lg bg-gray-900/30 border border-gray-800">
            <h3 className="text-white text-sm font-medium mb-2">About Auto-Renewal</h3>
            <p className="text-gray-400 text-sm">
              When auto-renewal is enabled, your subscription will automatically renew at the end of each billing period.
              You can disable auto-renewal at any time to prevent your subscription from renewing.
            </p>
            <div className="mt-3 text-xs text-gray-500">
              Need help? Contact our support team for assistance with your subscription.
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              Manage Your Subscriptions
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400">
              View and manage your active subscriptions and auto-renewal settings.
            </p>
          </motion.header>
          
          {renderContent()}
        </div>
      </main>
      
      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-white">Cancel Subscription</h3>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <IoCloseOutline className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-3 mb-4 rounded bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-sm text-yellow-400 flex items-start">
                  <IoAlertCircleOutline className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>
                    Are you sure you want to cancel auto-renewal for your 
                    <strong> {subscriptionToCancel?.plan?.name || 'subscription'}</strong>?
                  </span>
                </p>
              </div>
              
              <p className="text-gray-300 mb-4 text-sm">
                Your subscription will remain active until the end of the current billing period
                ({subscriptionToCancel && formatDate(subscriptionToCancel.next_billing_date)}). 
                After that, it will be cancelled and you'll lose access to premium features.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Keep Subscription
                </button>
                
                <button
                  onClick={cancelSubscription}
                  className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2"
                >
                  <IoStopCircleOutline className="w-4 h-4" />
                  Cancel Auto-Renewal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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

export default SubscriptionManagement;