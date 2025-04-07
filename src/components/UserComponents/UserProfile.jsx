import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import translation hook
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaCheck, FaTimes, FaUser, FaCalendar, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';
import SideNavbar from './userlayout/sidebar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('bizwizusertoken');
        if (!token) {
          navigate('/userlogin', { replace: true });
          toast.error(t('profile.errors.loginRequired', 'Please login to continue'));
          return;
        }
        const response = await ApiService("/userprofile", "GET");
        setProfile(response.userdata);
      } catch (error) {
        const errorMessage = error?.response?.data?.message || t('profile.errors.unknown', 'Unknown error occurred');
        
        if (errorMessage.toLowerCase().includes('login') || 
            errorMessage.toLowerCase().includes('token') || 
            errorMessage.toLowerCase().includes('auth')) {
          localStorage.removeItem('bizwizusertoken');
        }
        navigate('/userlogin', { replace: true });
        toast.error(errorMessage);
      } finally {
        setPageLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLoading) return;

    try {
      const token = localStorage.getItem('bizwizusertoken');
      if (!token) {
        toast.error(t('profile.errors.loginRequired', 'Please login to continue'));
        navigate('/userlogin');
        return;
      }

      setSubmitLoading(true);
      const response = await ApiService("/userupdate", "POST", profile);
      setProfile(response.userdata);
      setEditMode(false);
      toast.success(t('profile.success.profileUpdated', 'Profile updated successfully'));
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || t('profile.errors.updateFailed', 'Failed to update profile');
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Format date based on current language
  const formatDate = (dateString) => {
    if (!dateString) return t('profile.notAvailable', 'N/A');
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language || 'en-US');
  };

  if (pageLoading) return <LoadingPage name={t('profile.loading', 'Loading Profile...')} />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      <SideNavbar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header with animation */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-transparent md:text-4xl ml-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              {t('profile.title', 'Profile Settings')}
            </h1>
            <p className="mt-2 text-gray-400">
              {t('profile.subtitle', 'Manage your account preferences and information')}
            </p>
          </motion.div>

          {/* Profile Card with animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-hidden bg-gradient-to-b from-[#2a2435] to-[#1a1625] rounded-2xl shadow-2xl"
          >
            {/* Profile Header */}
            <div className="relative p-4 md:p-8 border-b border-purple-900/30">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent blur-xl" />
              
              <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="flex items-center justify-center w-20 h-20 border bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border-purple-500/20"
                >
                  <FaUserCircle className="w-10 h-10 text-purple-400" />
                </motion.div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">{profile.fname} {profile.lname}</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-gray-400">
                    <FaEnvelope className="w-4 h-4" />
                    <p className="text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">{profile.email}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditMode(!editMode)}
                  disabled={submitLoading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition-all rounded-xl bg-purple-600/80 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/20"
                >
                  {editMode ? (
                    <>
                      <FaTimes className="w-4 h-4" /> {t('profile.buttons.cancel', 'Cancel')}
                    </>
                  ) : (
                    <>
                      <FaEdit className="w-4 h-4" /> {t('profile.buttons.editProfile', 'Edit Profile')}
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-4 md:p-8">
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-gray-400">
                        {t('profile.fields.firstName', 'First Name')}
                      </label>
                      <input
                        type="text"
                        value={profile.fname || ''}
                        onChange={(e) => setProfile({...profile, fname: e.target.value})}
                        className="w-full p-3 text-white transition-all border rounded-xl bg-black/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-black/50 border-purple-500/20"
                        required
                        disabled={submitLoading}
                      />
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-gray-400">
                        {t('profile.fields.lastName', 'Last Name')}
                      </label>
                      <input
                        type="text"
                        value={profile.lname || ''}
                        onChange={(e) => setProfile({...profile, lname: e.target.value})}
                        className="w-full p-3 text-white transition-all border rounded-xl bg-black/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-black/50 border-purple-500/20"
                        required
                        disabled={submitLoading}
                      />
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="space-y-2 md:col-span-2"
                    >
                      <label className="block text-sm font-medium text-gray-400">
                        {t('profile.fields.emailAddress', 'Email Address')}
                      </label>
                      <input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full p-3 text-white transition-all border rounded-xl bg-black/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-black/50 border-purple-500/20"
                        required
                        disabled={submitLoading}
                      />
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="flex justify-end pt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={submitLoading}
                      className="flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] text-sm font-medium text-white transition-all rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      {submitLoading ? (
                        <BeatLoader size={8} color="#ffffff" />
                      ) : (
                        <>
                          <FaCheck className="w-4 h-4" /> {t('profile.buttons.saveChanges', 'Save Changes')}
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              ) : (
                <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 md:p-6 transition-all border rounded-xl bg-purple-500/5 border-purple-500/10 hover:border-purple-500/20 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/5"
                  >
                    <p className="text-sm font-medium text-gray-400">
                      {t('profile.fields.firstName', 'First Name')}
                    </p>
                    <p className="mt-2 text-lg text-white">{profile.fname}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-4 md:p-6 transition-all border rounded-xl bg-purple-500/5 border-purple-500/10 hover:border-purple-500/20 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/5"
                  >
                    <p className="text-sm font-medium text-gray-400">
                      {t('profile.fields.lastName', 'Last Name')}
                    </p>
                    <p className="mt-2 text-lg text-white">{profile.lname}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-4 md:p-6 transition-all border rounded-xl bg-purple-500/5 border-purple-500/10 hover:border-purple-500/20 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/5"
                  >
                    <p className="text-sm font-medium text-gray-400">
                      {t('profile.fields.emailAddress', 'Email Address')}
                    </p>
                    <p className="mt-2 text-lg text-white break-all">{profile.email}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="p-4 md:p-6 transition-all border rounded-xl bg-purple-500/5 border-purple-500/10 hover:border-purple-500/20 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/5"
                  >
                    <p className="text-sm font-medium text-gray-400">
                      {t('profile.fields.memberSince', 'Member Since')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <FaCalendar className="w-4 h-4 text-purple-400" />
                      <p className="text-lg text-white">
                        {formatDate(profile.created_at)}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} pauseOnHover />
    </div>
  );
};

export default Profile;