import { useState } from "react";
import ApiService from "../Apiservice";
import { ToastContainer, toast } from "react-toastify";
import RingLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await ApiService("/forgotpassword", "POST", { email });
      toast.success("Password reset link sent! Check your email.");
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row min-w-screen">
      <div className="w-full md:w-1/2 bg-[var(--primary-bg)] responsive-padding flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-semibold text-white md:text-3xl">Forgot Password?</h1>
            <p className="text-sm text-gray-400 md:text-base">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleForgotPassword}>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                className="w-full p-3 rounded-lg bg-[var(--primary-bg)] border border-gray-600 text-white 
                  custom-input focus:outline-none focus:border-[var(--accent-turquoise)]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[var(--accent-turquoise)] text-black font-medium p-3 rounded-lg 
                hover:bg-[var(--accent-turquoise-hover)] transition-colors relative
                disabled:opacity-50 disabled:cursor-not-allowed h-[50px]"
            >
              <div className="flex items-center justify-center">
                {loading ? <RingLoader /> : success ? "Email Sent" : "Send Reset Link"}
              </div>
            </button>

            <p className="mt-6 text-sm text-center text-gray-400">
              Remember your password?{' '}
              <Link to="/userlogin" className="text-[var(--accent-turquoise)] hover:underline">
                Back to Login
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

export default ForgotPasswordPage;
