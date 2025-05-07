import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import translation hook
import mascot from '../../assets/man.png';
import SideNavbar from './userlayout/sidebar';
import { 
  IoLockClosedOutline, 
  IoCashOutline,
  IoRocketOutline,
  IoSparklesOutline,
  IoTrophyOutline,
  IoArrowForwardOutline
} from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../Apiservice';

const AIStart = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [isVisible, setIsVisible] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isPlanChecking, setIsPlanChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Check user's plan status
    const checkUserPlanStatus = async () => {
      try {
        const response = await ApiService("/userstatus", "GET");
        setHasActivePlan(response.has_active_plan);
      } catch (error) {
        console.error("Error checking plan status:", error);
        setHasActivePlan(false);
      } finally {
        setIsPlanChecking(false);
      }
    };

    checkUserPlanStatus();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(139, 92, 246, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const renderLockedContent = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full p-6 md:p-10 border-2 border-purple-500/20 rounded-2xl bg-gradient-to-br from-black/40 to-purple-900/10 backdrop-blur-lg"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative mb-6"
      >
        <motion.div 
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "mirror"
          }}
          className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20"
        >
          <IoLockClosedOutline className="w-16 h-16 md:w-20 md:h-20 text-purple-400" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full ring-2 ring-black"
        />
      </motion.div>
      
      <motion.h2 
        variants={itemVariants}
        className="mb-4 text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-center"
      >
        {t('aistart.locked.title', 'Premium Feature Locked')}
      </motion.h2>
      
      <motion.p 
        variants={itemVariants}
        className="mb-6 text-base md:text-lg text-gray-300 text-center max-w-md"
      >
        {t('aistart.locked.description', 'Unlock our powerful AI features to enhance your digital projects and streamline your workflow.')}
      </motion.p>

      <motion.button 
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={() => navigate('/pricingplan')}
        className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/25"
      >
        <IoCashOutline className="w-5 h-5" />
        {t('aistart.locked.upgradeButton', 'Upgrade to Premium')}
      </motion.button>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavbar />
      <div className="relative min-h-screen overflow-hidden bg-black w-full ml-0 sm:ml-[70px] md:ml-4">
        {/* Background gradient effects */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 w-full h-screen">
            <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent blur-3xl" />
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl" />
          </div>
        </div>

        {/* Main content - Side by side layout */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 p-4 md:flex-row md:p-8 md:gap-16">
          {/* Left side - Character image */}
          <div className={`relative w-full md:w-1/2 max-w-lg transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-500/30 to-purple-500/30 blur-3xl" />
            <img
              src={mascot}
              alt={t('aistart.mascotAlt', 'Mascot')}
              className="relative z-10 w-full h-auto transition-transform duration-500 transform hover:scale-105"
            />
          </div>

          {/* Right side - Content */}
          <div className={`w-full md:w-1/2 max-w-lg text-center md:text-left transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          }`}>
            {isPlanChecking ? (
              // Loading state
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : hasActivePlan ? (
              // User has active plan - show regular content
              <div className="space-y-8">
                {/* Text content */}
                <div>
                  <h1 className="mb-4 text-4xl font-bold text-transparent md:text-6xl lg:text-7xl bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text">
                    {t('aistart.coming.title', 'Coming Soon')}
                  </h1>
                  <p className="text-lg text-gray-300 md:text-xl">
                    {t('aistart.coming.description', 'Something amazing is in the works. Stay tuned for something special.')}
                  </p>
                </div>

                {/* Newsletter signup */}
                <div className="w-full">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      placeholder={t('aistart.coming.emailPlaceholder', 'Enter your email')}
                      className="flex-1 px-4 py-3 text-white placeholder-gray-400 transition-colors border rounded-lg bg-white/5 border-white/10 focus:outline-none focus:border-cyan-500"
                    />
                    <button className="px-6 py-3 font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 hover:shadow-lg hover:shadow-purple-500/25 whitespace-nowrap">
                      {t('aistart.coming.notifyButton', 'Notify Me')}
                    </button>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex justify-center gap-6 md:justify-start">
                  {[
                    { key: 'twitter', label: t('aistart.social.twitter', 'Twitter') },
                    { key: 'discord', label: t('aistart.social.discord', 'Discord') },
                    { key: 'instagram', label: t('aistart.social.instagram', 'Instagram') }
                  ].map((platform) => (
                    <a
                      key={platform.key}
                      href="#"
                      className="text-gray-400 transition-colors hover:text-white"
                    >
                      {platform.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              // User does not have active plan - show locked state
              renderLockedContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStart;