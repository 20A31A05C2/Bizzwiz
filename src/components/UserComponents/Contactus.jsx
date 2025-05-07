/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import translation hook
import 'react-toastify/dist/ReactToastify.css';
import { 
  IoMailOutline, 
  IoCallOutline, 
  IoLocationOutline, 
  IoTimeOutline,
  IoSendOutline,
  IoCheckmarkCircle,
  IoCloseCircle
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';
import SideNavbar from './userlayout/sidebar';

const ContactUs = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [contactInfo, setContactInfo] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', message: '' });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const token = localStorage.getItem('bizwizusertoken');
        if (!token) {
          toast.error(t('contact.errors.loginRequired', 'Please login to continue'));
          navigate('/userlogin');
          return;
        }

        const response = await ApiService("/contactus", "GET");
        if (response.contacts?.length > 0) {
          setContactInfo(response.contacts[0]);
        }
      } catch (error) {
        const errormessage = error?.response?.data?.message || t('contact.errors.default', 'An error occurred');
        
        if (errormessage.toLowerCase().includes('login') || 
            errormessage.toLowerCase().includes('token') || 
            errormessage.toLowerCase().includes('auth')) {
          localStorage.removeItem('bizwizusertoken');
        }
        navigate('/userlogin');
        toast.error(errormessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContactInfo();
  }, [navigate, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('pending');
    
    try {
      const token = localStorage.getItem('bizwizusertoken');
      if (!token) {
        toast.error(t('contact.errors.loginRequired', 'Please login to continue'));
        navigate('/userlogin');
        return;
      }

      const response = await ApiService("/contactus/submit", "POST", userForm);
      if (response.success) {
        setSubmissionStatus('success');
        setUserForm({ name: '', email: '', message: '' });
        toast.success(t('contact.success.messageSent', 'Your message has been sent successfully!'));
      } else {
        setSubmissionStatus('error');
        toast.error(response.message || t('contact.errors.submitFailed', 'Something went wrong. Please try again.'));
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || t('contact.errors.default', 'An error occurred');
      toast.error(errorMessage);
      setSubmissionStatus('error');
    }
  };

  if (loading) return <LoadingPage name={t('contact.loading', 'Loading Contact Info...')} />;

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavbar />
      
      <main className="flex-1 px-4 py-8 md:px-8 lg:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center"
          >
            <h1 className="mb-3 text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              {t('contact.title', 'Get In Touch')}
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400">
              {t('contact.subtitle', 'We would love to hear from you. Fill out the form below or use our contact information.')}
            </p>
          </motion.header>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Contact Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:w-3/5 order-2 lg:order-1"
            >
              <motion.div 
                className="p-6 md:p-8 bg-black border border-gray-800 rounded-xl shadow-lg"
                whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(145, 145, 145, 0.05)" }}
              >
                <h2 className="mb-6 text-xl font-medium text-white">
                  {t('contact.form.title', 'Send us a Message')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <InputField 
                    label={t('contact.form.fullName', 'Full Name')}
                    type="text" 
                    name="name" 
                    value={userForm.name} 
                    onChange={handleInputChange} 
                    required
                    active={activeField === 'name'}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                  />
                  
                  <InputField 
                    label={t('contact.form.emailAddress', 'Email Address')}
                    type="email" 
                    name="email" 
                    value={userForm.email} 
                    onChange={handleInputChange} 
                    required
                    active={activeField === 'email'}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                  />
                  
                  <TextAreaField 
                    label={t('contact.form.yourMessage', 'Your Message')}
                    name="message" 
                    value={userForm.message} 
                    onChange={handleInputChange}
                    required
                    active={activeField === 'message'}
                    onFocus={() => setActiveField('message')}
                    onBlur={() => setActiveField(null)}
                  />
                  
                  <div className="pt-2">
                    <motion.button 
                      type="submit" 
                      disabled={submissionStatus === 'pending'}
                      className={`flex items-center justify-center w-full gap-2 px-6 py-3 text-white rounded-lg transition-all duration-200 ${
                        submissionStatus === 'pending' 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-purple-500/20'
                      }`}
                      whileHover={{ scale: submissionStatus !== 'pending' ? 1.01 : 1 }}
                      whileTap={{ scale: submissionStatus !== 'pending' ? 0.98 : 1 }}
                    >
                      {submissionStatus === 'pending' ? (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('contact.form.sending', 'Sending...')}
                        </span>
                      ) : (
                        <>
                          <IoSendOutline className="w-5 h-5" />
                          {t('contact.form.sendMessage', 'Send Message')}
                        </>
                      )}
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {submissionStatus === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 text-green-400">
                          <IoCheckmarkCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm">{t('contact.success.messageSent', 'Your message has been sent successfully!')}</p>
                        </div>
                      </motion.div>
                    )}

                    {submissionStatus === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-400">
                          <IoCloseCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm">{t('contact.errors.submitFailed', 'Something went wrong. Please try again.')}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            </motion.div>

            {/* Contact Information Section */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="lg:w-2/5 order-1 lg:order-2"
            >
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-white">
                  {t('contact.info.title', 'Contact Information')}
                </h2>
                
                <div className="space-y-4">
                  <ContactInfoCard 
                    icon={<IoCallOutline className="w-5 h-5 text-cyan-400" />} 
                    title={t('contact.info.phoneNumber', 'Phone Number')}
                    value={contactInfo?.phone} 
                    delay={0.1}
                    notAvailable={t('contact.info.notAvailable', 'Not available')}
                  />
                  <ContactInfoCard 
                    icon={<IoMailOutline className="w-5 h-5 text-purple-400" />} 
                    title={t('contact.info.emailAddress', 'Email Address')}
                    value={contactInfo?.email} 
                    delay={0.2}
                    notAvailable={t('contact.info.notAvailable', 'Not available')}
                  />
                  <ContactInfoCard 
                    icon={<IoLocationOutline className="w-5 h-5 text-cyan-400" />} 
                    title={t('contact.info.address', 'Address')}
                    value={contactInfo?.address} 
                    delay={0.3}
                    notAvailable={t('contact.info.notAvailable', 'Not available')}
                  />
                  <ContactInfoCard 
                    icon={<IoTimeOutline className="w-5 h-5 text-purple-400" />} 
                    title={t('contact.info.workingHours', 'Working Hours')}
                    value={contactInfo?.working_hours} 
                    delay={0.4}
                    notAvailable={t('contact.info.notAvailable', 'Not available')}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="p-5 mt-8 border border-gray-800 rounded-xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5"
                >
                  <p className="text-gray-400 text-sm">
                    {t('contact.info.responseTime', 'We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please contact us directly by phone.')}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

const ContactInfoCard = ({ icon, title, value, delay = 0, notAvailable = 'Not available' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-start gap-3 p-4 border border-gray-800 rounded-lg bg-black"
  >
    <div className="p-2 rounded-md bg-gray-900">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-300">{title}</h3>
      <p className="text-gray-400 mt-1">{value || notAvailable}</p>
    </div>
  </motion.div>
);

const InputField = ({ label, type, name, value, onChange, required, active, onFocus, onBlur }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-400">
      {label}
    </label>
    <motion.div
      animate={active ? { scale: 1.005 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
    >
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full px-4 py-2.5 text-gray-200 bg-gray-900 border rounded-lg transition-all duration-200 ${
          active ? 'border-purple-500 ring-1 ring-purple-500/20' : 'border-gray-700'
        }`}
        required={required}
      />
    </motion.div>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, required, active, onFocus, onBlur }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-400">
      {label}
    </label>
    <motion.div
      animate={active ? { scale: 1.005 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
    >
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full px-4 py-2.5 text-gray-200 bg-gray-900 border rounded-lg transition-all duration-200 ${
          active ? 'border-purple-500 ring-1 ring-purple-500/20' : 'border-gray-700'
        }`}
        rows="4"
        required={required}
      />
    </motion.div>
  </div>
);

export default ContactUs;