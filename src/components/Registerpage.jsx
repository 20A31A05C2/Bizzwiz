/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ApiService from '../Apiservice';
import { ToastContainer, toast } from 'react-toastify';
import RingLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from "../firebase";
import Logo from '../assets/logo.png';
import BlueBlob from '../assets/blueblob.png';
import PurpleBlob from '../assets/Ellipse .png';
import { useTranslation } from 'react-i18next';

// Password strength calculation function
const calculatePasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
};

// Password strength meter component
const PasswordStrengthMeter = ({ password }) => {
  const { t } = useTranslation();
  
  const strength = calculatePasswordStrength(password);
  
  let color, label;
  
  switch (strength) {
    case 0:
    case 1:
      color = "bg-red-500";
      label = t('register.passwordStrength.weak');
      break;
    case 2:
    case 3:
      color = "bg-yellow-500";
      label = t('register.passwordStrength.medium');
      break;
    case 4:
    case 5:
      color = "bg-green-500";
      label = t('register.passwordStrength.strong');
      break;
    default:
      color = "bg-green-600";
      label = t('register.passwordStrength.veryStrong');
  }
  
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

function Registerpage() {
    const { t } = useTranslation();
    
    const [fname, setfname] = useState("");
    const [lname, setlname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [check, setcheck] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // For password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility
    const navigate = useNavigate();

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Toggle confirm password visibility
    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };

    // ✅ Handle Google Registration
    const handleGoogleRegister = async () => {
      try {
        setLoading(true);
    
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken(true);
        const response = await ApiService("/google-auth", "POST", { 
          token: idToken,
          isRegistration: true 
        });
    
        localStorage.setItem("bizwizusertoken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
    
        toast.success(t('register.toasts.success'));
        navigate("/UserDashboard", { replace: true });
    
      } catch (error) {
        console.error('Google Auth Error:', error);
        const errorMessage = error.response?.data?.error || error.message || t('register.toasts.failed');
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
          setLoading(true);
          
          if (!(fname && lname && email && password && confirmpassword)) {
            toast.error(t('register.toasts.fillAllFields'));
            return;
          }

          const passwordStrength = calculatePasswordStrength(password);
          if (passwordStrength < 3) {
            toast.error(t('register.toasts.weakPassword'));
            return;
          }
          
          if (password !== confirmpassword) {
            toast.error(t('register.toasts.passwordsDoNotMatch'));
            return;
          }

          if (!check) {
            toast.error(t('register.toasts.acceptTerms'));
            return;
          }

          const data = { fname, lname, email, password };
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(t('register.toasts.timeout'))), 15000)
          );
          
          const response = await Promise.race([
            ApiService("/userregister", "POST", data),
            timeoutPromise
          ]);

          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          
          setRegistrationComplete(true);
          toast.success(t('register.toasts.successVerification'));
          
        } catch (error) {
          let errorMessage = t('register.toasts.failed');
          
          if (error.message && error.message.includes("already registered")) {
            errorMessage = error.message;
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.errors) {
            const firstErrorField = Object.keys(error.response.data.errors)[0];
            errorMessage = error.response.data.errors[firstErrorField][0];
          } else if (typeof error === 'string') {
            errorMessage = error;
          }
          
          if (errorMessage.includes(" (and ")) {
            errorMessage = errorMessage.substring(0, errorMessage.indexOf(" (and "));
          }
          
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
    };
    
    const handleResendVerification = async () => {
      try {
        setLoading(true);
        const response = await ApiService("/resend-verification", "POST", { email });
        
        if (response.status === 'success' || response.status === 200) {
          toast.success(t('register.toasts.resendSuccess'));
        } else {
          toast.error(response.message || t('register.toasts.resendFailed'));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || t('register.toasts.resendFailed'));
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
            alt={t('register.altTexts.blueShape')} 
            className="w-full h-full object-cover object-left"
          />
        </div>
        
        {/* Bottom right purple blob */}
        <div className="absolute bottom-0 right-0 z-0 w-1/4 sm:w-1/4 md:w-1/4 lg:w-1/5 block">
          <img 
            src={PurpleBlob} 
            alt={t('register.altTexts.purpleShape')} 
            className="w-full h-auto object-contain"
          />
        </div>
        
        <div className="z-10 flex w-full max-w-md flex-col items-center px-4 sm:px-6 py-8">
          {/* Logo */}
          <div className="mb-8">
            <div className="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 flex items-center justify-center">
              <img src={Logo} alt={t('register.altTexts.logo')} className="h-full w-full object-contain" />
            </div>
          </div>

          {registrationComplete ? (
            <div className="w-full bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center">
              <div className="bg-green-500/20 p-4 rounded-lg mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h2 className="text-white text-xl font-semibold mt-4">{t('register.verification.title')}</h2>
              </div>
              <p className="text-white/80 mb-4">
                {t('register.verification.message')} <span className="font-semibold">{email}</span>. 
                {t('register.verification.instruction')}
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-3 mb-6 text-left">
                <p className="text-amber-200 text-sm">
                  <span className="font-bold">⚠️ {t('register.verification.important')}</span> {t('register.verification.checkSpam')}
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={handleResendVerification}
                  className="w-full py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RingLoader size={20} color="#ffffff" className="mr-2" />
                      <span>{t('register.verification.sending')}</span>
                    </>
                  ) : (
                    t('register.verification.resend')
                  )}
                </button>
                <Link to="/userlogin" className="w-full py-2 bg-white text-purple-900 font-medium rounded hover:bg-white/90 text-center">
                  {t('register.verification.goToLogin')}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full mb-6 text-center">
                <h1 className="text-2xl font-semibold text-white">{t('register.title')}</h1>
                <p className="text-sm text-white/70 mt-1">
                  {t('register.subtitle')}
                </p>
              </div>

              <form className="w-full space-y-4" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('register.form.firstName')}
                      value={fname}
                      onChange={(e) => setfname(e.target.value)}
                      className="h-10 md:h-12 w-full bg-transparent border border-white/20 rounded text-white placeholder:text-white/50 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('register.form.lastName')}
                      value={lname}
                      onChange={(e) => setlname(e.target.value)}
                      className="h-10 md:h-12 w-full bg-transparent border border-white/20 rounded text-white placeholder:text-white/50 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    placeholder={t('register.form.email')}
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="h-10 md:h-12 w-full bg-transparent border border-white/20 rounded text-white placeholder:text-white/50 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    >
                      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v10z" />
                      <path d="m2 7 10 7 10-7" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('register.form.password')}
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="h-10 md:h-12 w-full bg-transparent border border-white/20 rounded text-white placeholder:text-white/50 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                    tabIndex="-1"
                  >
                    {showPassword ? (
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
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
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
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                  {password && <PasswordStrengthMeter password={password} />}
                </div>
                
                <div className="text-xs text-white/60 -mt-2">
                  {t('register.form.passwordRequirements')}
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('register.form.confirmPassword')}
                    value={confirmpassword}
                    onChange={(e) => setconfirmpassword(e.target.value)}
                    className="h-10 md:h-12 w-full bg-transparent border border-white/20 rounded text-white placeholder:text-white/50 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? (
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
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
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
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={check}
                    onChange={() => setcheck(!check)}
                    className="mt-1 w-4 h-4 border-gray-600 rounded"
                  />
                  <label htmlFor="terms" className="text-xs text-white/80">
                    {t('register.form.termsAgreement')}
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-10 md:h-12 bg-white hover:bg-white/90 text-purple-900 font-medium rounded focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <RingLoader size={20} color="#4A2A8A" /> : t('register.form.createAccount')}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-base">
                    <span className="px-4 text-white/50 bg-[hsla(263,55%,16%,1)] text-xs">{t('register.form.orSignUpWith')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  disabled={loading}
                  className="w-full h-10 flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white hover:bg-white/10 rounded"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {t('register.form.signInWithGoogle')}
                </button>

                <div className="text-center text-white/80 text-xs pt-4">
                  {t('register.form.alreadyHaveAccount')}{" "}
                  <Link to="/userlogin" className="text-blue-400 hover:text-blue-300">
                    {t('register.form.signIn')}
                  </Link>
                </div>
              </form>
            </>
          )}
          <ToastContainer />
        </div>
      </div>
    );
}

export default Registerpage;