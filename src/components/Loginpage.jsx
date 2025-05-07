import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import RingLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import ApiService from "../Apiservice";
import Logo from '../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(true);
      const response = await ApiService("/google-auth", "POST", { token: idToken });
      localStorage.setItem("bizwizusertoken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success('Login successful');
      navigate("/UserDashboard", { replace: true });
    } catch (error) {
      console.error('Google Auth Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowVerificationMessage(false);

    if (!email.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!password) {
      toast.error('Password is required');
      return;
    }

    if (password.length < 8) {
      toast.error('Password should be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await ApiService("/userlogin", "POST", { email, password });
      localStorage.setItem("bizwizusertoken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success('Login successful');
      navigate("/UserDashboard", { replace: true });
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.unverified) {
        setShowVerificationMessage(true);
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendingVerification(true);
      const response = await ApiService("/resend-verification", "POST", { email });
      if (response.status === 'success' || response.status === 200) {
        toast.success('Verification email resent');
      } else {
        toast.error(response.message || 'Failed to resend verification email');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResendingVerification(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Content container */}
      <div className="z-10 flex w-full max-w-md flex-col items-center px-4 sm:px-6">
        {/* Logo */}
        <div className="mb-6">
          <div className="h-20 w-20 flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
        </div>

        {showVerificationMessage ? (
          <div className="w-full bg-black/80 p-6 rounded-lg text-center">
            <div className="bg-amber-500/20 p-4 rounded-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-white text-xl font-semibold mt-4">Email Not Verified</h2>
            </div>
            <p className="text-white/80 mb-4">
              Your email <span className="font-semibold">{email}</span> has not been verified yet. Please check your inbox for the verification link we sent when you registered.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3 mb-6 text-left">
              <p className="text-blue-200 text-sm">
                <span className="font-bold">ℹ️ Note:</span> If you don't see the email in your inbox, please check your spam or junk folder.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <button 
                onClick={handleResendVerification}
                className="w-full py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 flex items-center justify-center"
                disabled={resendingVerification}
              >
                {resendingVerification ? (
                  <>
                    <RingLoader size={20} color="#ffffff" className="mr-2" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
              <button
                onClick={() => setShowVerificationMessage(false)}
                className="w-full py-2 bg-transparent border border-white/20 text-white font-medium rounded hover:bg-white/10 text-center"
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab navigation */}
            <div className="w-full mb-6 flex border border-purple-600 rounded-full overflow-hidden">
              <button className="flex-1 py-2 bg-purple-600 text-white font-medium text-center">
                Se connecter
              </button>
              <Link to="/userregister" className="flex-1 py-2 bg-transparent text-white font-medium text-center">
                S'inscrire
              </Link>
            </div>

            <form className="w-full space-y-5" onSubmit={handleLogin}>
              {/* Email field with label */}
              <div className="space-y-1">
                <label className="text-white/80 text-sm">Adresse email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-12 w-full bg-white rounded-lg text-black placeholder:text-gray-500 px-3 focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password field with label */}
              <div className="space-y-1">
                <label className="text-white/80 text-sm">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-12 w-full bg-white rounded-lg text-black placeholder:text-gray-500 px-3 pr-10 focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                        width="20"
                        height="20"
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
              </div>

              {/* Login Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <RingLoader size={20} color="#ffffff" />
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;