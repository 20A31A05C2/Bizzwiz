/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import ApiService from '../Apiservice';
import { ToastContainer, toast } from 'react-toastify';
import RingLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from "../firebase";
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
  const strength = calculatePasswordStrength(password);
  
  // Determine color and label based on strength
  let color, label;
  
  switch (strength) {
    case 0:
    case 1:
      color = "bg-red-500";
      label = "Weak";
      break;
    case 2:
    case 3:
      color = "bg-yellow-500";
      label = "Medium";
      break;
    case 4:
    case 5:
      color = "bg-green-500";
      label = "Strong";
      break;
    default:
      color = "bg-green-600";
      label = "Very Strong";
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

function Registerpage() {
    const [fname, setfname] = useState("");
    const [lname, setlname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [check, setcheck] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Handle Google Registration
    const handleGoogleRegister = async () => {
      try {
        setLoading(true);
    
        // Sign in with Google
        const result = await signInWithPopup(auth, googleProvider);
        
        // Get the ID token
        const idToken = await result.user.getIdToken(true);
        
        // Send to backend - using the same endpoint as login but with registration intent
        const response = await ApiService("/google-auth", "POST", { 
          token: idToken,
          isRegistration: true // Add flag to indicate this is a registration
        });
    
        // Save authentication data
        localStorage.setItem("bizwizusertoken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
    
        toast.success("Registration successful");
        navigate("/UserDashboard", { replace: true });
    
      } catch (error) {
        console.error('Google Auth Error:', error);
        const errorMessage = error.response?.data?.error || error.message || "Registration failed";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
          setLoading(true);
          if (fname && lname && email && password && confirmpassword) {
            // Check password strength
            const passwordStrength = calculatePasswordStrength(password);
            if (passwordStrength < 3) {
              toast.error("Password is too weak. Include uppercase, lowercase, numbers, and special characters.");
              setLoading(false);
              return;
            }
            
            if (password === confirmpassword) {
              if (check === true) {
                const data = { fname, lname, email, password };
                const response = await ApiService("/userregister", "POST", data);

                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                console.log(response.user);
                navigate('/userlogin'); 
                toast.success("Registered Successfully");
              } else {
                toast.error("Please accept the terms and conditions");
                return;
              }
            } else {
              toast.error("Passwords do not match");
              return;
            }
          } else {
            toast.error("Please fill all the fields");
            return;
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
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
        
        <div className="z-10 flex w-full max-w-md flex-col items-center px-4 sm:px-6 py-8">
          {/* Logo */}
          <div className="mb-8">
            <div className="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 flex items-center justify-center">
              <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
          </div>

          <div className="w-full mb-6 text-center">
            <h1 className="text-2xl font-semibold text-white">Create Account</h1>
            <p className="text-sm text-white/70 mt-1">
              Enter your details to create your account
            </p>
          </div>

          <form className="w-full space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="FIRST NAME"
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
                  placeholder="LAST NAME"
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
                placeholder="ADRESSE EMAIL"
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
                type="password"
                placeholder="MOT DE PASSE"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
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
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              {password && <PasswordStrengthMeter password={password} />}
            </div>
            
            <div className="text-xs text-white/60 -mt-2">
              Password should contain at least 8 characters with uppercase, lowercase, numbers and special characters.
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="CONFIRMER MOT DE PASSE"
                value={confirmpassword}
                onChange={(e) => setconfirmpassword(e.target.value)}
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
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
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
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-10 md:h-12 bg-white hover:bg-white/90 text-purple-900 font-medium rounded focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <RingLoader size={20} color="#4A2A8A" /> : "CRÉER UN COMPTE"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-4 text-white/50 bg-[hsla(263,55%,16%,1)] text-xs">ou s'inscrire avec</span>
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
              Sign in with Google
            </button>

            <div className="text-center text-white/80 text-xs pt-4">
              Vous avez déjà un compte ?{" "}
              <Link to="/userlogin" className="text-blue-400 hover:text-blue-300">
                connectez-vous
              </Link>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    );
}

export default Registerpage;