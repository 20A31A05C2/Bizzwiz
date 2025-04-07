import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import RingLoader from "react-spinners/ClipLoader";
import { useTranslation } from 'react-i18next'; // Import translation hook
import ApiService from "../Apiservice";
import Logo from '../assets/logo.png';
import BlueBlob from '../assets/blueblob.png';
import PurpleBlob from '../assets/Ellipse .png';

// Password strength calculation function
const calculatePasswordStrength = (password) => {
  let strength = 0;
  
  // Check password length
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Check for lowercase letters
  if (/[a-z]/.test(password)) strength += 1;
  
  // Check for uppercase letters
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Check for numbers
  if (/[0-9]/.test(password)) strength += 1;
  
  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
};

// Password strength meter component
const PasswordStrengthMeter = ({ password }) => {
  const { t } = useTranslation(); // Use translation hook
  const strength = calculatePasswordStrength(password);
  
  // Determine color and label based on strength
  let color, label;
  
  switch (strength) {
    case 0:
    case 1:
      color = "bg-red-500";
      label = t('resetPassword.passwordStrength.weak', 'Weak');
      break;
    case 2:
    case 3:
      color = "bg-yellow-500";
      label = t('resetPassword.passwordStrength.medium', 'Medium');
      break;
    case 4:
    case 5:
      color = "bg-green-500";
      label = t('resetPassword.passwordStrength.strong', 'Strong');
      break;
    default:
      color = "bg-green-600";
      label = t('resetPassword.passwordStrength.veryStrong', 'Very Strong');
  }
  
  // Calculate width percentage
  const widthPercentage = Math.min((strength / 6) * 100, 100);
  
  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-300 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300 ease-in-out`} 
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
      <p className={`text-xs mt-1 ${color.replace('bg-', 'text-')}`}>{label}</p>
    </div>
  );
};

function ResetPasswordPage() {
  const { t } = useTranslation(); // Initialize translation hook
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Extract token and email from URL
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  useEffect(() => {
    if (!token || !email) {
      toast.error(t('resetPassword.invalidResetLink', 'Invalid reset link!'));
      navigate("/forgot-password"); // Redirect if the token is missing
    }
  }, [token, email, navigate, t]);
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error(t('resetPassword.allFieldsRequired', 'All fields are required!'));
      return;
    }
    
    // Check password strength
    const passwordStrength = calculatePasswordStrength(password);
    if (passwordStrength < 3) {
      toast.error(t('toasts.weakPassword', 'Password is too weak. Include uppercase, lowercase, numbers, and special characters.'));
      return;
    }
    
    if (password.length < 8) {
      toast.error(t('resetPassword.passwordTooShort', 'Password must be at least 8 characters long.'));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t('toasts.passwordsDoNotMatch', 'Passwords do not match!'));
      return;
    }
    
    setLoading(true);
    
    try {
      await ApiService("/resetpassword", "POST", {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });
      
      setSuccess(true);
      toast.success(t('resetPassword.successRedirecting', 'Password reset successful! Redirecting to login...'));
      setTimeout(() => navigate("/userlogin"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || t('resetPassword.failedReset', 'Failed to reset password.'));
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

        {/* Reset Password text */}
        <div className="w-full mb-6 text-center">
          <h1 className="mb-2 text-xl font-semibold text-white md:text-2xl">
            {t('resetPassword.title', 'Reset Password')}
          </h1>
          <p className="text-xs text-white/70 md:text-sm">
            {t('resetPassword.enterNewPassword', 'Enter your new password below')}
          </p>
        </div>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleResetPassword}>
          <div className="space-y-3 md:space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder={t('resetPassword.newPassword', 'NEW PASSWORD')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              {password && <PasswordStrengthMeter password={password} />}
            </div>

            <div className="text-xs text-white/60 mt-1 mb-3">
              {t('resetPassword.passwordRequirements', 'Password should contain at least 8 characters with uppercase, lowercase, numbers and special characters.')}
            </div>
            
            <div className="relative">
              <input
                type="password"
                placeholder={t('resetPassword.confirmPassword', 'CONFIRM PASSWORD')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
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
              t('resetPassword.passwordResetButton', 'PASSWORD RESET')
            ) : (
              t('resetPassword.resetPasswordButton', 'RESET PASSWORD')
            )}
          </button>

          <div className="text-center text-white/80 text-xs md:text-sm pt-6">
            {t('resetPassword.rememberPassword', 'Remember your password?')}{" "}
            <Link to="/userlogin" className="text-blue-400 hover:text-blue-300">
              {t('resetPassword.backToLogin', 'Back to login')}
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ResetPasswordPage;