import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';
import SideNavbar from './userlayout/sidebar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to continue");
        navigate('/userlogin');
        return;
      }
        const response = await ApiService("/userprofile", "GET");
        setProfile(response.userdata);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setPageLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (submitLoading) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to continue");
        navigate('/userlogin');
        return;
      }

      setSubmitLoading(true);
      const response = await ApiService("/userupdate", "POST", profile);
      setProfile(response.userdata);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) return <LoadingPage name="Loading Profile..." />;

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavbar />
      
      <main className="flex-1 p-1 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white md:text-3xl">Profile Settings</h1>
            <p className="mt-2 text-gray-400">View and update your profile information</p>
          </div>

          {/* Profile Card */}
          <div className="overflow-hidden bg-[#2a2435] rounded-xl shadow-lg">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-6 border-b border-gray-800">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-xl">
                <FaUser className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">{profile.fname} {profile.lname}</h2>
                <p className="text-gray-400">{profile.email}</p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                disabled={submitLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-purple-600/80 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {editMode ? (
                  <>
                    <FaTimes className="w-4 h-4" /> Cancel
                  </>
                ) : (
                  <>
                    <FaEdit className="w-4 h-4" /> Edit
                  </>
                )}
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">First Name</label>
                      <input
                        type="text"
                        name="fname"
                        value={profile.fname || ''}
                        onChange={(e) => setProfile({...profile, fname: e.target.value})}
                        className="w-full p-3 text-white transition-colors rounded-lg bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                        required
                        disabled={submitLoading}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Last Name</label>
                      <input
                        type="text"
                        name="lname"
                        value={profile.lname || ''}
                        onChange={(e) => setProfile({...profile, lname: e.target.value})}
                        className="w-full p-3 text-white transition-colors rounded-lg bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                        required
                        disabled={submitLoading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm text-gray-400">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full p-3 text-white transition-colors rounded-lg bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                        required
                        disabled={submitLoading}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 min-w-[120px] text-sm font-medium text-white transition-all rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {submitLoading ? (
                        <BeatLoader size={8} color="#ffffff" />
                      ) : (
                        <>
                          <FaCheck className="w-4 h-4" /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-400">First Name</p>
                    <p className="mt-1 text-white">{profile.fname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Name</p>
                    <p className="mt-1 text-white">{profile.lname}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="mt-1 text-white">{profile.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="mt-1 text-white">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <ToastContainer/>
    </div>
  );
};

export default Profile;