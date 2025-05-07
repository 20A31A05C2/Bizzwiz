import React, { useState } from 'react';
import ApiService from '../Apiservice';
import { ToastContainer, toast } from 'react-toastify';
import RingLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from "../firebase";
import Logo from '../assets/logo.png';


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
  const strength = calculatePasswordStrength(password);
  
  let color, label;
  
  switch (strength) {
    case 0:
    case 1:
      color = "bg-red-500";
      label = "Faible";
      break;
    case 2:
    case 3:
      color = "bg-yellow-500";
      label = "Moyen";
      break;
    case 4:
    case 5:
      color = "bg-green-500";
      label = "Fort";
      break;
    default:
      color = "bg-green-600";
      label = "Très fort";
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

function RegisterPage() {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [check, setCheck] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Toggle confirm password visibility
    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };

    // Handle Google Registration
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
    
        toast.success('Inscription réussie!');
        navigate("/UserDashboard", { replace: true });
    
      } catch (error) {
        console.error('Google Auth Error:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Échec de l\'inscription';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
          setLoading(true);
          
          // Validation
          if (!(name && mobile && email && password && confirmPassword)) {
            toast.error('Veuillez remplir tous les champs');
            return;
          }

          const passwordStrength = calculatePasswordStrength(password);
          if (passwordStrength < 3) {
            toast.error('Mot de passe trop faible');
            return;
          }
          
          if (password !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
          }

          if (!check) {
            toast.error('Veuillez accepter les conditions d\'utilisation');
            return;
          }

          const data = { name, mobile, email, password };
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout de connexion')), 15000)
          );
          
          const response = await Promise.race([
            ApiService("/userregister", "POST", data),
            timeoutPromise
          ]);

          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          
          setRegistrationComplete(true);
          toast.success('Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.');
          
        } catch (error) {
          let errorMessage = 'Échec de l\'inscription';
          
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
          toast.success('Email de vérification renvoyé avec succès');
        } else {
          toast.error(response.message || 'Échec de l\'envoi de l\'email de vérification');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Échec de l\'envoi de l\'email de vérification');
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div 
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black"
      >
        <div className="z-10 flex w-full max-w-md flex-col items-center px-4 py-6">
          {/* Logo */}
          <div className="mb-6">
            <div className="h-20 w-20 flex items-center justify-center">
              <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
          </div>

          {registrationComplete ? (
            <div className="w-full bg-black/80 p-6 rounded-lg text-center">
              <div className="bg-green-500/20 p-4 rounded-lg mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h2 className="text-white text-xl font-semibold mt-4">Vérifiez votre email</h2>
              </div>
              <p className="text-white/80 mb-4">
                Un email de vérification a été envoyé à <span className="font-semibold">{email}</span>. 
                Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-3 mb-6 text-left">
                <p className="text-amber-200 text-sm">
                  <span className="font-bold">⚠️ Important:</span> Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
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
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    'Renvoyer l\'email de vérification'
                  )}
                </button>
                <Link to="/userlogin" className="w-full py-2 bg-white text-purple-900 font-medium rounded hover:bg-white/90 text-center">
                  Aller à la page de connexion
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Tab navigation */}
              <div className="w-full mb-6 flex border border-purple-600 rounded-full overflow-hidden">
                <Link to="/userlogin" className="flex-1 py-2 bg-transparent text-white font-medium text-center">
                  Se connecter
                </Link>
                <button className="flex-1 py-2 bg-purple-600 text-white font-medium text-center">
                  S'inscrire
                </button>
              </div>

              <form className="w-full space-y-4" onSubmit={handleRegister}>
                {/* Name field */}
                <div className="space-y-1">
                  <label className="text-white/80 text-sm">Nom complet</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Lily Crystalrem"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 w-full bg-white rounded-lg text-black placeholder:text-gray-500 px-3 focus:outline-none text-base"
                    />
                  </div>
                </div>

                {/* Mobile field */}
                <div className="space-y-1">
                  <label className="text-white/80 text-sm">Numéro mobile</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+33 123456789"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="h-12 w-full bg-white rounded-lg text-black placeholder:text-gray-500 px-3 focus:outline-none text-base"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-1">
                  <label className="text-white/80 text-sm">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="exemple@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full bg-white rounded-lg text-black placeholder:text-gray-500 px-3 focus:outline-none text-base"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-white/80 text-sm">Créer un mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Doit comporter 8 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full bg-white rounded-lg text-black placeholder:text-gray-500 px-3 pr-10 focus:outline-none text-base"
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
                    {password && <PasswordStrengthMeter password={password} />}
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="space-y-1">
                  <label className="text-white/80 text-sm">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Répéter le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 w-full bg-white rounded-lg text-black placeholder:text-gray-500 px-3 pr-10 focus:outline-none text-base"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? (
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

                {/* Terms and conditions checkbox */}
                <div className="flex items-start space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={check}
                    onChange={() => setCheck(!check)}
                    className="mt-1 w-4 h-4 border-gray-600 rounded"
                  />
                  <label htmlFor="terms" className="text-xs text-white/80">
                    J'accepte les conditions d'utilisation et la politique de confidentialité
                  </label>
                </div>

                {/* Register Button with StarBorder */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-purple-600 text-white font-medium rounded-lg focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <RingLoader size={20} color="#ffffff" />
                      </div>
                    ) : (
                      'S\'inscrire'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
          <ToastContainer />
        </div>
      </div>
    );
}

export default RegisterPage;