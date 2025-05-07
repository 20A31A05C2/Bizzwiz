import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import translation hook
import ApiService from '../Apiservice';
import { ToastContainer, toast } from 'react-toastify';
import RingLoader from "react-spinners/ClipLoader";
import Logo from '../assets/logo.png';
import BlueBlob from '../assets/blueblob.png';
import PurpleBlob from '../assets/Ellipse .png';

function VerifyEmail() {
  const { t } = useTranslation(); // Initialize translation hook
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    if (!token || !email) {
      setVerifying(false);
      setError(t('verifyEmail.invalidLink', 'Invalid verification link. Missing token or email.'));
      return;
    }

    setEmail(email);

    const verifyEmail = async () => {
      try {
        const response = await ApiService('/verify-email', 'POST', { token, email });
        
        if (response.status === 'success' || response.status === 200) {
          setSuccess(true);
          toast.success(response.message || t('verifyEmail.successMessage', "Email verified successfully!"));
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/userlogin');
          }, 3000);
        } else {
          setError(response.message || t('verifyEmail.verificationFailed', 'Verification failed.'));
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError(error.response?.data?.message || t('verifyEmail.tryAgain', 'Verification failed. Please try again.'));
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [location, navigate, t]);

  const goToLogin = () => {
    navigate('/userlogin');
  };

  const resendVerification = async () => {
    if (!email) {
      toast.error(t('verifyEmail.emailNotFound', 'Email address not found.'));
      return;
    }

    try {
      setVerifying(true);
      const response = await ApiService('/resend-verification', 'POST', { email });
      
      if (response.status === 'success' || response.status === 200) {
        toast.success(response.message || t('toasts.resendSuccess', "Verification email resent successfully!"));
      } else {
        toast.error(response.message || t('toasts.resendFailed', 'Failed to resend verification email.'));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('toasts.resendFailed', 'Failed to resend verification email.'));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'hsla(263, 55%, 16%, 1)' }}
    >
      {/* Top left purple circle blob */}
      <div 
        className="absolute -left-24 -top-24 h-[200px] w-[200px] md:-left-32 md:-top-32 md:h-[250px] md:w-[250px] lg:-left-40 lg:-top-40 lg:h-[300px] lg:w-[300px] rounded-full opacity-70"
        style={{ backgroundColor: '#4A2A8A' }}
      ></div>
      
      {/* Bottom left purple circle blob */}
      <div 
        className="absolute -bottom-24 -left-12 h-[200px] w-[200px] md:-bottom-32 md:-left-16 md:h-[250px] md:w-[250px] lg:-bottom-40 lg:-left-20 lg:h-[300px] lg:w-[300px] rounded-full opacity-70"
        style={{ backgroundColor: '#4A2A8A' }}
      ></div>
      
      {/* Right blue curved shape */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 sm:w-1/3 md:w-1/3 lg:w-1/4 z-0 block">
        <img 
          src={BlueBlob} 
          alt="Blue decorative shape" 
          className="w-full h-full object-cover object-left"
        />
      </div>
      
      {/* Bottom right purple blob */}
      <div className="absolute bottom-0 right-0 z-0 w-1/4 sm:w-1/4 md:w-1/4 lg:w-1/5 block">
        <img 
          src={PurpleBlob} 
          alt="Purple decorative shape" 
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="z-10 flex w-full max-w-md flex-col items-center px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-white text-center mb-6">
            {t('verifyEmail.title', 'Email Verification')}
          </h1>
          
          {verifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RingLoader size={40} color="#ffffff" />
              <p className="text-white mt-4">
                {t('verifyEmail.verifying', 'Verifying your email address...')}
              </p>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="bg-green-500/20 p-4 rounded-lg mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-white mt-2">
                  {t('verifyEmail.verificationSuccess', 'Your email has been successfully verified!')}
                </p>
              </div>
              <p className="text-white/80 mb-6">
                {t('verifyEmail.redirecting', 'You will be redirected to the login page in a few seconds.')}
              </p>
              <button 
                onClick={goToLogin}
                className="w-full py-2 bg-white text-purple-900 font-medium rounded hover:bg-white/90"
              >
                {t('verifyEmail.goToLogin', 'Go to Login')}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-red-500/20 p-4 rounded-lg mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-white mt-2">{error}</p>
              </div>
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={resendVerification}
                  className="w-full py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
                  disabled={verifying}
                >
                  {verifying ? 
                    <RingLoader size={20} color="#ffffff" /> : 
                    t('verifyEmail.resendEmail', 'Resend Verification Email')
                  }
                </button>
                <button 
                  onClick={goToLogin}
                  className="w-full py-2 bg-white text-purple-900 font-medium rounded hover:bg-white/90"
                >
                  {t('verifyEmail.backToLogin', 'Back to Login')}
                </button>
              </div>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default VerifyEmail;