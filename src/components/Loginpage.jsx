import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import RingLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import ApiService from "../Apiservice";
import Logo from '../assets/logo.png';
import BlueBlob from '../assets/blueblob.png';
import PurpleBlob from '../assets/Ellipse .png';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
  
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the ID token
      const idToken = await result.user.getIdToken(true);
      
      // Send to backend
      const response = await ApiService("/google-auth", "POST", { token: idToken });
  
      // Save authentication data
      localStorage.setItem("bizwizusertoken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
  
      toast.success("Login successful");
      navigate("/UserDashboard", { replace: true });
  
    } catch (error) {
      console.error('Google Auth Error:', error);
      const errorMessage = error.response?.data?.error || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password should be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await ApiService("/userlogin", "POST", { email, password });

      localStorage.setItem("bizwizusertoken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Login successful");
      navigate("/UserDashboard", { replace: true });

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'hsla(263, 55%, 16%, 1)' }}
    >
      {/* Top left purple circle blob - responsive positioning with reduced size */}
      <div 
        className="absolute -left-24 -top-24 h-[200px] w-[200px] md:-left-32 md:-top-32 md:h-[250px] md:w-[250px] lg:-left-40 lg:-top-40 lg:h-[300px] lg:w-[300px] rounded-full opacity-70"
        style={{ backgroundColor: '#4A2A8A' }}
      ></div>
      
      {/* Bottom left purple circle blob - responsive positioning with reduced size */}
      <div 
        className="absolute -bottom-24 -left-12 h-[200px] w-[200px] md:-bottom-32 md:-left-16 md:h-[250px] md:w-[250px] lg:-bottom-40 lg:-left-20 lg:h-[300px] lg:w-[300px] rounded-full opacity-70"
        style={{ backgroundColor: '#4A2A8A' }}
      ></div>
      
      {/* Right blue curved shape - responsive sizing with reduced size */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 sm:w-1/3 md:w-1/3 lg:w-1/4 z-0 block">
        <img 
          src={BlueBlob} 
          alt="Blue decorative shape" 
          className="w-full h-full object-cover object-left"
        />
      </div>
      
      {/* Bottom right purple blob - responsive positioning with reduced size */}
      <div className="absolute bottom-0 right-0 z-0 w-1/4 sm:w-1/4 md:w-1/4 lg:w-1/5 block">
        <img 
          src={PurpleBlob} 
          alt="Purple decorative shape" 
          className="w-full h-auto object-contain"
        />
      </div>
      
      <div className="z-10 flex w-full max-w-md flex-col items-center px-4 sm:px-6">
        {/* Logo - responsive sizing */}
        <div className="mb-8 md:mb-12">
          <div className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
        </div>

        {/* Welcome text */}
        <div className="w-full mb-6 text-center">
          <h1 className="mb-2 text-xl font-semibold text-white md:text-2xl">Welcome back!</h1>
          <p className="text-xs text-white/70 md:text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <form className="w-full space-y-4" onSubmit={handleLogin}>
          <div className="space-y-3 md:space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="ADRESSE EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="MOT DE PASSE"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
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
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                disabled={loading}
                className="w-4 h-4 border-gray-600 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-white/80">
                Remember me
              </label>
            </div>
            <a href="/forgotpassword" className="text-xs text-white/80 hover:text-white">
              Mot de passe oublié ?
            </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-10 md:h-12 bg-white hover:bg-white/90 text-purple-900 font-medium rounded focus:outline-none text-sm md:text-base mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RingLoader size={20} color="#4A2A8A" />
              </div>
            ) : (
              "SE CONNECTER"
            )}
          </button>

          {/* Only Google Login */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-base">
              <span className="px-4 text-white/50 bg-[hsla(263,55%,16%,1)] text-xs">ou continuer avec</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-9 md:h-10 flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white hover:bg-white/10 rounded text-xs md:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" viewBox="0 0 24 24">
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
            Sign in with Google
          </button>

          <div className="text-center text-white/80 text-xs md:text-sm pt-3 md:pt-4">
            Vous n'avez pas de compte ?{" "}
            <Link to="/userregister" className="text-blue-400 hover:text-blue-300">
              inscrivez-vous
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;