import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import RingLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // Import translation hook
import ApiService from "../Apiservice";
import Logo from '../assets/logo.png';
import BlueBlob from '../assets/blueblob.png';
import PurpleBlob from '../assets/Ellipse .png';

function ForgotPasswordPage() {
  const { t } = useTranslation(); // Initialize translation hook
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(t('forgotPassword.emailRequired', 'Email is required'));
      return;
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error(t('forgotPassword.invalidEmail', 'Please enter a valid email address'));
      return;
    }

    setLoading(true);

    try {
      await ApiService("/forgotpassword", "POST", { email });
      toast.success(t('forgotPassword.resetLinkSent', 'Password reset link sent! Check your email.'));
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || t('forgotPassword.resetLinkFailed', 'Failed to send reset link.'));
    } finally {
      setLoading(false);
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
      
      <div className="z-10 flex w-full max-w-md flex-col items-center px-4 sm:px-6">
        {/* Logo */}
        <div className="mb-8 md:mb-12">
          <div className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
        </div>

        {/* Forgot Password text */}
        <div className="w-full mb-6 text-center">
          <h1 className="mb-2 text-xl font-semibold text-white md:text-2xl">
            {t('forgotPassword.title', 'Forgot Password?')}
          </h1>
          <p className="text-xs text-white/70 md:text-sm">
            {t('forgotPassword.instruction', 'Enter your email and we\'ll send you a reset link')}
          </p>
        </div>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleForgotPassword}>
          <div className="space-y-3 md:space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder={t('forgotPassword.emailAddress', 'EMAIL ADDRESS')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                className="h-10 md:h-12 w-full bg-transparent border border-white/20 rounded text-white placeholder:text-white/50 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="md:w-[18px] md:h-[18px]"
                >
                  <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v10z" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
            className="w-full h-10 md:h-12 bg-white hover:bg-white/90 text-purple-900 font-medium rounded focus:outline-none text-sm md:text-base mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RingLoader size={20} color="#4A2A8A" />
              </div>
            ) : success ? (
              t('forgotPassword.emailSent', 'EMAIL SENT')
            ) : (
              t('forgotPassword.sendResetLink', 'SEND RESET LINK')
            )}
          </button>

          <div className="text-center text-white/80 text-xs md:text-sm pt-6">
            {t('forgotPassword.rememberPassword', 'Remember your password?')}{" "}
            <Link to="/userlogin" className="text-blue-400 hover:text-blue-300">
              {t('forgotPassword.backToLogin', 'Back to login')}
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPasswordPage;