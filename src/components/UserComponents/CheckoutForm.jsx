import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import {
  IoCardOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoRefreshOutline,
  IoInformationCircleOutline
} from 'react-icons/io5';
import ApiService from '../../Apiservice';

const CheckoutForm = ({ selectedPlan, billingCycle = 'monthly', apiOverrides = {} }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [autoRenew, setAutoRenew] = useState(true);

  // Get the correct price based on billing cycle
  const getPrice = () => {
    if (billingCycle === 'yearly') {
      const price = selectedPlan.yearly_price || selectedPlan.annual_price;
      return price ? Number(price) : Number(selectedPlan.monthly_price * 10);
    }
    return Number(selectedPlan.monthly_price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setPaymentStatus('pending');
    setErrorMessage('');

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error(t('checkout.errors.cardElementNotFound'));
      }
      
      // First create a payment method from card details
      const { error: createPaymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (createPaymentMethodError) {
        throw new Error(createPaymentMethodError.message);
      }
      
      if (!paymentMethod || !paymentMethod.id) {
        throw new Error(t('checkout.errors.paymentMethodCreation'));
      }

      // If auto-renewal is enabled and this is a subscription (not credits), use the recurring flow
      if (autoRenew && apiOverrides.purchase_type !== 'credits') {
        // Create a subscription with auto-renewal
        const subscriptionResponse = await ApiService("/create-subscription", "POST", {
          plan_id: selectedPlan.id,
          billing_cycle: billingCycle,
          payment_method_id: paymentMethod.id,
          auto_renew: autoRenew
        });
        
        if (!subscriptionResponse.success) {
          throw new Error(subscriptionResponse.message || t('checkout.errors.subscriptionCreation'));
        }
        
        const responseData = subscriptionResponse.data || {};
        
        // If the backend indicates additional confirmation is needed
        if (responseData.requires_action && responseData.client_secret) {
          const { error: confirmError } = await stripe.confirmCardPayment(
            responseData.client_secret, {
              payment_method: paymentMethod.id
            }
          );
          
          if (confirmError) {
            throw new Error(confirmError.message || t('checkout.errors.paymentConfirmation'));
          }
        }
        
        setPaymentStatus('success');
        toast.success(t('checkout.success.subscription', { planName: selectedPlan.name }));
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Use the one-time payment flow (existing logic)
        const amount = getPrice();
        
        // Create payment intent
        const intentResponse = await ApiService("/create-intent", "POST", {
          amount: amount,
          currency: 'usd',
          purchase_type: apiOverrides.purchase_type || 'subscription',
          plan_id: apiOverrides.purchase_type === 'credits' ? undefined : selectedPlan.id,
          credits: apiOverrides.credits,
          billing_cycle: billingCycle,
          auto_renew: autoRenew,
          ...apiOverrides
        });
        
        if (!intentResponse.success || !intentResponse.clientSecret) {
          throw new Error(intentResponse.message || t('checkout.errors.paymentInitialization'));
        }
        
        // Confirm payment with the payment method we just created
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          intentResponse.clientSecret, {
            payment_method: paymentMethod.id
          }
        );
        
        if (confirmError) {
          throw new Error(confirmError.message);
        }
        
        if (paymentIntent.status === 'succeeded') {
          // Verify payment with backend
          const verifyResponse = await ApiService("/verify", "POST", {
            payment_intent_id: paymentIntent.id,
            amount: amount,
            purchase_type: apiOverrides.purchase_type || 'subscription',
            plan_id: apiOverrides.purchase_type === 'credits' ? undefined : selectedPlan.id,
            credits: apiOverrides.credits,
            billing_cycle: billingCycle,
            auto_renew: autoRenew,
            ...apiOverrides
          });
          
          if (!verifyResponse.success) {
            throw new Error(verifyResponse.message || t('checkout.errors.paymentVerification'));
          }
          
          setPaymentStatus('success');
          const successMessage = apiOverrides.purchase_type === 'credits'
            ? t('checkout.success.credits', { credits: apiOverrides.credits })
            : t('checkout.success.subscriptionWithoutAutoRenewal', { planName: selectedPlan.name });
          
          toast.success(successMessage);
          
          // Reload the page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          throw new Error(t('checkout.errors.paymentStatus', { status: paymentIntent.status }));
        }
      }
    } catch (error) {
      const errorMsg = error.message || t('checkout.errors.generic');
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      setPaymentStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: '#E4E4E7',
        fontFamily: '"Inter", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#71717A'
        }
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444'
      }
    },
    hidePostalCode: true
  };

  // Get duration based on billing cycle
  const getDuration = () => {
    return t(`checkout.duration.${billingCycle === 'yearly' ? 'yearly' : 'monthly'}`);
  };

  // Get button text based on billing cycle
  const getButtonText = () => {
    const price = getPrice().toFixed(2);
    
    if (apiOverrides.purchase_type === 'credits') {
      return t('checkout.form.button.pay', { price });
    }
    
    return autoRenew 
      ? t('checkout.form.button.subscribeWithAutoRenewal', { price })
      : t('checkout.form.button.subscribe', { price });
  };

  // Only show auto-renewal for subscriptions, not credits
  const showAutoRenewal = !apiOverrides.purchase_type || apiOverrides.purchase_type === 'subscription';

  // Get the auto-renewal cycle term (year/month)
  const getAutoRenewalCycleTerm = () => {
    return t(`checkout.form.autoRenewal.${billingCycle === 'yearly' ? 'year' : 'month'}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-400">
          {t('checkout.form.cardDetails')}
        </label>
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Auto-renewal toggle (only for subscriptions) */}
      {showAutoRenewal && (
        <div className="mt-4 p-4 rounded-lg bg-gray-900/80 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IoRefreshOutline className={`w-5 h-5 ${autoRenew ? 'text-cyan-400' : 'text-gray-500'}`} />
              <span className="text-gray-200 font-medium">{t('checkout.form.autoRenewal.title')}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autoRenew}
                onChange={() => setAutoRenew(!autoRenew)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-purple-500"></div>
            </label>
          </div>
          
          <div className="mt-2 flex items-start gap-2 text-sm text-gray-400">
            <IoInformationCircleOutline className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
            <p>
              {autoRenew
                ? t('checkout.form.autoRenewal.enabledInfo', { term: getAutoRenewalCycleTerm() })
                : t('checkout.form.autoRenewal.disabledInfo', { duration: getDuration() })}
            </p>
          </div>
        </div>
      )}

      {/* Plan summary and payment action */}
      <div className="mt-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          {apiOverrides.purchase_type === 'credits' ? (
            <>
              <span className="text-sm text-gray-400">{t('checkout.form.summary.product')}</span>
              <span className="text-white font-medium">{apiOverrides.credits} Credits</span>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-400">{t('checkout.form.summary.plan')}</span>
              <span className="text-white font-medium">{selectedPlan.name}</span>
            </>
          )}
        </div>
        
        {/* Only show billing cycle and duration for subscriptions */}
        {(!apiOverrides.purchase_type || apiOverrides.purchase_type === 'subscription') && (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{t('checkout.form.summary.billingCycle')}</span>
              <span className="text-white capitalize">{billingCycle}</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{t('checkout.form.summary.duration')}</span>
              <span className="text-white">{getDuration()}</span>
            </div>
          </>
        )}
        
        {showAutoRenewal && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">{t('checkout.form.summary.autoRenewal')}</span>
            <span className={`text-white ${autoRenew ? 'text-green-400' : 'text-yellow-400'}`}>
              {t(`checkout.form.summary.${autoRenew ? 'enabled' : 'disabled'}`)}
            </span>
          </div>
        )}
        
        <div className="border-t border-gray-700 my-3 pt-3 flex items-center justify-between">
          <span className="text-white font-medium">{t('checkout.form.summary.total')}</span>
          <span className="text-lg font-bold text-white">${getPrice().toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4">
        <motion.button 
          type="submit" 
          disabled={!stripe || processing}
          className={`flex items-center justify-center w-full gap-2 px-6 py-3 text-white rounded-lg transition-all duration-200 ${
            !stripe || processing
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-purple-500/20'
          }`}
          whileHover={{ scale: (!stripe || processing) ? 1 : 1.01 }}
          whileTap={{ scale: (!stripe || processing) ? 1 : 0.98 }}
        >
          {processing ? (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('checkout.form.button.processing')}
            </span>
          ) : (
            <>
              <IoCardOutline className="w-5 h-5" />
              {getButtonText()}
            </>
          )}
        </motion.button>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-400">
          <IoCloseCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <AnimatePresence>
        {paymentStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 text-green-400">
              <IoCheckmarkCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                {apiOverrides.purchase_type === 'credits'
                  ? t('checkout.status.successCredits')
                  : t('checkout.status.successSubscription', { planName: selectedPlan.name })}
                {!apiOverrides.purchase_type && autoRenew && ' ' + t('checkout.status.successAutoRenewal')}
              </p>
            </div>
          </motion.div>
        )}

        {paymentStatus === 'error' && !errorMessage && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-400">
              <IoCloseCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{t('checkout.status.error')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-xs text-center text-gray-500 mt-4">
        {t('checkout.disclaimer.securityNotice')}
        {autoRenew && !apiOverrides.purchase_type && (
          <p className="mt-1">
            {t('checkout.disclaimer.autoRenewalNotice')}
          </p>
        )}
      </div>
    </form>
  );
};

export default CheckoutForm;