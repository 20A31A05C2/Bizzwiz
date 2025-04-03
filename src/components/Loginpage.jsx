import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useState } from "react";
import ApiService from "../Apiservice";
import { ToastContainer, toast } from "react-toastify";
import RingLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../firebase";

function LoginPage() {
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
    <div className="flex flex-col min-h-screen md:flex-row min-w-screen">
      <div className="w-full md:w-1/2 bg-[var(--primary-bg)] responsive-padding flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-semibold text-white md:text-3xl">Welcome back!</h1>
            <p className="text-sm text-gray-400 md:text-base">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Email/Password Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full p-3 rounded-lg bg-[var(--primary-bg)] border border-gray-600 text-white 
                  custom-input focus:outline-none focus:border-[var(--accent-turquoise)]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Password</label>
                <a href="/forgotpassword" className="text-sm text-[var(--accent-turquoise)] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full p-3 rounded-lg bg-[var(--primary-bg)] border border-gray-600 text-white 
                  custom-input focus:outline-none focus:border-[var(--accent-turquoise)]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                disabled={loading}
                className="w-4 h-4 border-gray-600 rounded custom-checkbox"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent-turquoise)] text-black font-medium p-3 rounded-lg 
                hover:bg-[var(--accent-turquoise-hover)] transition-colors relative
                disabled:opacity-50 disabled:cursor-not-allowed h-[50px]"
            >
              <div className="flex items-center justify-center">
                {loading ? <RingLoader /> : "Login"}
              </div>
            </button>

            {/* OR Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400 bg-[var(--primary-bg)]">or continue with</span>
              </div>
            </div>

            {/* Google & Apple Login */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex items-center justify-center gap-2 p-3 border border-gray-600 rounded-lg 
                  text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                disabled={loading}
                className="flex items-center justify-center gap-2 p-3 border border-gray-600 rounded-lg 
                  text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaApple className="w-5 h-5" />
                <span className="text-sm">Apple</span>
              </button>
            </div>

            <p className="mt-6 text-sm text-center text-gray-400">
              Don’t have an account?{' '}
              <Link to="/userregister" className="text-[var(--accent-turquoise)] hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden w-1/2 bg-black md:block"></div>
      <ToastContainer draggable />
    </div>
  );
}

export default LoginPage;
