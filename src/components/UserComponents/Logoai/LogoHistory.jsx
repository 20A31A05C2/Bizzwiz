import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  IoAddCircleOutline, 
  IoImageOutline,
  IoDownloadOutline,
  IoEyeOutline,
  IoTimeOutline,
  IoChatbubblesOutline,
  IoChevronBackOutline,
  IoCloseCircleOutline,
  IoRefreshOutline,
  IoWalletOutline
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import SideNavbar from '../userlayout/sidebar';
import ApiService from '../../../Apiservice';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingPage from '../userlayout/loader';

const LogoHistory = () => {
  // Initialize translation hook
  const { t } = useTranslation();
  
  // All state hooks must be called unconditionally at the top
  const [logos, setLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoData, setSelectedLogoData] = useState(null);
  const [logoImageCache, setLogoImageCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [activeImageFetches, setActiveImageFetches] = useState({});
  const navigate = useNavigate();

  // Get current user info as a memo to avoid re-parsing on every render
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      return {};
    }
  }, []);
  
  const userId = currentUser?.id;

  // Fetch logo history
  const fetchLogoHistory = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setError(t('logoHistory.errors.loginRequired', "User not found. Please log in again."));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService(`/user-logo-requests?user_id=${userId}`, "GET");
      
      if (response && response.success) {
        const logoData = response.logo_requests || [];
        const validLogos = logoData.filter(logo => logo && typeof logo === 'object');
        setLogos(validLogos);
      } else {
        const errorMessage = response?.message || t('logoHistory.errors.default', "Failed to fetch logo history");
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.message || t('logoHistory.errors.default', "Error connecting to server");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  // Format date helper function
  const formatDate = useCallback((dateString) => {
    if (!dateString) return t('logoHistory.logoDetails.date', "Unknown date");
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return t('logoHistory.logoDetails.invalidDate', "Invalid date");
    }
  }, [t]);

  // Optimized fetch logo data with request deduplication
  const fetchLogoData = useCallback(async (logoId) => {
    if (!logoId) return null;
    
    // Check if this logo ID is already being fetched
    if (activeImageFetches[logoId]) {
      return null;
    }
    
    // Check if we already have this logo in cache
    if (logoImageCache[logoId]) {
      return logoImageCache[logoId];
    }
    
    try {
      // Mark this logo as being fetched
      setActiveImageFetches(prev => ({ ...prev, [logoId]: true }));
      
      if (selectedLogo && selectedLogo.id === logoId) {
        setLoadingImage(true);
      }
      
      // Using POST method with request_id in the body
      const response = await ApiService("/logos/data", "POST", {
        request_id: logoId
      });
      
      if (response && response.success) {
        // Update cache
        setLogoImageCache(prev => ({
          ...prev,
          [logoId]: response.image_data
        }));
        
        // If this is the selected logo, update the selected logo data
        if (selectedLogo && selectedLogo.id === logoId) {
          setSelectedLogoData(response.image_data);
        }
        
        return response.image_data;
      } else {
        if (selectedLogo && selectedLogo.id === logoId) {
          toast.error(t('logoHistory.errors.default', "Failed to load logo image"));
        }
        return null;
      }
    } catch (error) {
      if (selectedLogo && selectedLogo.id === logoId) {
        toast.error(t('logoHistory.errors.default', "Error loading logo image: ") + (error?.message || "Unknown error"));
      }
      return null;
    } finally {
      // Remove this logo from active fetches
      setActiveImageFetches(prev => {
        const newState = { ...prev };
        delete newState[logoId];
        return newState;
      });
      
      if (selectedLogo && selectedLogo.id === logoId) {
        setLoadingImage(false);
      }
    }
  }, [logoImageCache, selectedLogo, activeImageFetches, t]);

  // Handle viewing logo details
  const handleViewDetails = useCallback((logo) => {
    if (!logo || !logo.id) {
      return;
    }
    
    setSelectedLogo(logo);
    
    // If we already have the logo data in cache, use it
    if (logoImageCache[logo.id]) {
      setSelectedLogoData(logoImageCache[logo.id]);
    } else {
      setSelectedLogoData(null); // Reset image data when selecting a new logo
      // Fetch the logo data immediately
      fetchLogoData(logo.id);
    }
  }, [logoImageCache, fetchLogoData]);

  // Handle logo download
  const handleDownload = useCallback((logo) => {
    if (!logo || !logo.id) {
      return;
    }
    
    // Check for data in cache or selected logo data
    const imageData = logoImageCache[logo.id] || selectedLogoData;
    
    if (imageData) {
      try {
        // Create an anchor element and set properties for download
        const link = document.createElement('a');
        link.href = imageData;
        const filename = `logo_${logo.id || Date.now()}.png`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Download started!");
      } catch (error) {
        toast.error(t('logoHistory.errors.default', "Failed to download logo: ") + (error?.message || "Unknown error"));
      }
    } else {
      // If we don't have image data yet, fetch it first
      toast.info("Preparing logo for download...");
      fetchLogoData(logo.id);
    }
  }, [fetchLogoData, logoImageCache, selectedLogoData, t]);

  // Initial fetch of logo history - this must be separate from the batch loading effect
  useEffect(() => {
    fetchLogoHistory();
  }, [fetchLogoHistory]);

  // Batch load images for the visible logos
  useEffect(() => {
    if (loading || !logos.length) return;
    
    // Create a batch loading function that processes logos in smaller batches
    const loadLogoImagesInBatches = async () => {
      const BATCH_SIZE = 2; // Process only 2 logos at a time
      const BATCH_DELAY = 500; // Wait 500ms between batches
      
      // Only load logos that aren't already in the cache
      const logosToLoad = logos.filter(logo => 
        logo && 
        logo.id && 
        !logoImageCache[logo.id] && 
        !activeImageFetches[logo.id]
      );
      
      // Process in batches
      for (let i = 0; i < logosToLoad.length; i += BATCH_SIZE) {
        const batch = logosToLoad.slice(i, i + BATCH_SIZE);
        
        // Load images in parallel within this batch
        await Promise.all(batch.map(logo => fetchLogoData(logo.id)));
        
        // Wait before processing the next batch
        if (i + BATCH_SIZE < logosToLoad.length) {
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
      }
    };
    
    loadLogoImagesInBatches();
  }, [logos, loading, logoImageCache, activeImageFetches, fetchLogoData]);

  // Pre-define all components that use hooks to avoid conditional hook calls
  // Each of these must be defined here - before any conditional returns
  
  // Error view component - defined unconditionally
  const ErrorView = useCallback(() => (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full">
      <IoCloseCircleOutline className="w-16 h-16 mb-4 text-red-500 opacity-70" />
      <h2 className="mb-3 text-xl font-semibold text-white">{t('logoHistory.errors.loadingError', 'Error Loading Logos')}</h2>
      <p className="mb-6 text-gray-400">{error}</p>
      <button 
        onClick={fetchLogoHistory}
        className="flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 hover:shadow-lg"
      >
        <IoRefreshOutline size={20} />
        {t('logoHistory.buttons.retry', 'Retry')}
      </button>
    </div>
  ), [error, fetchLogoHistory, t]);

  // Empty state view - defined unconditionally
  const EmptyStateView = useCallback(() => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 text-center h-full"
    >
      <div className="relative w-24 h-24 mb-6">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-cyan-500 opacity-20 blur-xl"
        />
        <IoImageOutline className="absolute inset-0 w-24 h-24 text-cyan-400" />
      </div>
      
      <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
        {t('logoHistory.emptyState.title', 'No Logo Requests Yet')}
      </h2>
      
      <p className="max-w-md mb-6 text-sm sm:text-base text-gray-400">
        {t('logoHistory.emptyState.description', "Start your branding journey by creating your first AI-generated logo request. We'll help you create the perfect logo for your brand.")}
      </p>
      
      <motion.button 
        onClick={() => navigate('/logorequest')}
        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)" }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 px-6 py-3 text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
      >
        <IoAddCircleOutline size={24} />
        {t('logoHistory.buttons.createFirst', 'Create First Logo')}
      </motion.button>
    </motion.div>
  ), [navigate, t]);

  // Logo details modal component
  const LogoDetailsModal = useCallback(() => {
    if (!selectedLogo) return null;

    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => {
            setSelectedLogo(null);
            setSelectedLogoData(null);
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg p-4 sm:p-5 mx-auto my-4 border bg-gradient-to-br from-gray-900 to-black border-white/20 rounded-xl shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedLogo(null);
                  setSelectedLogoData(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <IoChevronBackOutline size={22} />
              </motion.button>
              <h2 className="text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                {t('logoHistory.logoDetails.title', 'Logo Details')}
              </h2>
              <div className="w-6"></div> {/* Empty div for centering */}
            </div>
            
            <div className="mb-4 text-center">
              <div className="flex items-center justify-center space-x-4 text-xs sm:text-sm text-gray-400">
                <span className="flex items-center">
                  <IoTimeOutline size={14} className="mr-1" />
                  {formatDate(selectedLogo.created_at)}
                </span>
                <span className="mx-2">•</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold
                  ${selectedLogo.status === 'pending' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-green-500/20 text-green-400'}`}
                >
                  {selectedLogo.status === 'pending' 
                    ? t('logoHistory.status.pending', 'pending') 
                    : t('logoHistory.status.completed', 'completed')}
                </span>
              </div>
            </div>
            
            <div className="relative overflow-hidden mb-4 rounded-lg bg-gradient-to-br from-black to-gray-900 border border-white/10">
              {selectedLogoData ? (
                <div className="flex items-center justify-center p-4 max-h-[50vh] overflow-hidden">
                  <motion.img 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={selectedLogoData} 
                    alt="AI Generated Logo"
                    className="max-w-full max-h-full object-contain rounded shadow-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+SW1hZ2UgTG9hZCBFcnJvcjwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              ) : loadingImage ? (
                <div className="flex items-center justify-center p-12">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-l-cyan-400 border-r-purple-400 border-t-cyan-400 border-b-purple-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-cyan-400 text-sm">{t('logoHistory.imageStatus.loading', 'Loading')}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-12">
                  <IoImageOutline className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>

            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <IoChatbubblesOutline size={18} className="mt-1 mr-2 flex-shrink-0 text-cyan-400" />
                <div>
                  <div className="font-medium text-sm sm:text-base">{t('logoHistory.logoDetails.prompt', 'Prompt')}</div>
                  <p className="text-xs sm:text-sm text-gray-400">{selectedLogo.prompt || t('logoHistory.logoDetails.noPrompt', 'No prompt available')}</p>
                </div>
              </div>
              
              {selectedLogo.credits_used && (
                <div className="flex items-start">
                  <IoWalletOutline size={18} className="mt-1 mr-2 flex-shrink-0 text-cyan-400" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">{t('logoHistory.logoDetails.creditsUsed', 'Credits Used')}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{selectedLogo.credits_used}</div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <motion.button 
                  onClick={() => handleDownload(selectedLogo)}
                  disabled={loadingImage && !selectedLogoData}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white rounded-lg 
                    ${loadingImage && !selectedLogoData 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'} 
                    transition-colors`}
                >
                  {loadingImage && !selectedLogoData ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-1"></div>
                      {t('logoHistory.buttons.preparing', 'Preparing...')}
                    </>
                  ) : (
                    <>
                      <IoDownloadOutline size={16} />
                      {t('logoHistory.buttons.download', 'Download Logo')}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }, [selectedLogo, selectedLogoData, loadingImage, formatDate, handleDownload, t]);

  // Logo card component - defined here to avoid conditional hook usage
  const renderLogoCard = useCallback((logo, index) => {
    if (!logo || !logo.id) return null;
    
    return (
      <motion.div 
        key={logo.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }} 
        className="group relative p-4 transition-all duration-300 transform border bg-gradient-to-br from-white/10 to-white/5 border-white/10 rounded-xl hover:border-cyan-500/50"
        whileHover={{ scale: 1.02, y: -5 }}
      >
        <div className="absolute inset-0 bg-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-0.5 text-xs rounded-full font-semibold whitespace-nowrap
            ${(logo.status === 'pending') 
              ? 'bg-yellow-500/20 text-yellow-400' 
              : 'bg-green-500/20 text-green-400'}`}
          >
            {logo.status === 'pending' 
              ? t('logoHistory.status.pending', 'pending') 
              : t('logoHistory.status.completed', 'completed')}
          </span>
          
          {logo.credits_used && (
            <div className="flex items-center text-xs text-gray-400">
              <IoWalletOutline size={14} className="mr-1 text-purple-400/70" />
              <span>{logo.credits_used} {t('logoHistory.logoDetails.creditsUsed', 'credits')}</span>
            </div>
          )}
        </div>
        
        <div className="relative h-36 mb-3 overflow-hidden rounded-lg bg-black/40 flex items-center justify-center">
          {/* Image display with loading state */}
          {logoImageCache[logo.id] ? (
            <img 
              src={logoImageCache[logo.id]} 
              alt="AI Generated Logo"
              className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+SW1hZ2UgTG9hZCBFcnJvcjwvdGV4dD48L3N2Zz4=';
              }}
            />
          ) : activeImageFetches[logo.id] ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-l-cyan-400 border-r-purple-400 border-t-cyan-400 border-b-purple-400 rounded-full animate-spin"></div>
              <div className="absolute text-sm text-cyan-300 mt-16">{t('logoHistory.imageStatus.loading', 'Loading image...')}</div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <IoImageOutline className="w-12 h-12 text-gray-500" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
            <div className="flex gap-3">
              <motion.button 
                onClick={() => handleViewDetails(logo)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-cyan-500/80 transition-colors"
                title="Preview"
              >
                <IoEyeOutline size={18} />
              </motion.button>
              
              <motion.button 
                onClick={() => handleDownload(logo)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-cyan-500/80 transition-colors"
                title="Download"
              >
                <IoDownloadOutline size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex items-start mb-2">
          <IoChatbubblesOutline size={14} className="mt-1 mr-1 flex-shrink-0 text-cyan-400/70" />
          <p className="text-xs text-gray-400 line-clamp-2">{logo.prompt || t('logoHistory.logoDetails.noPrompt', 'No prompt available')}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <IoTimeOutline size={14} className="mr-1 text-cyan-400/70" />
            <span>{formatDate(logo.created_at)}</span>
          </div>
          
          <motion.button 
            onClick={() => handleViewDetails(logo)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded-md bg-cyan-500/30 hover:bg-cyan-500/50 transition-colors"
          >
            {t('logoHistory.buttons.details', 'Details')}
          </motion.button>
        </div>
      </motion.div>
    );
  }, [logoImageCache, activeImageFetches, formatDate, handleViewDetails, handleDownload, t]);

  // Create the LogoGrid component
  const renderLogoGrid = useCallback(() => {
    if (error) {
      return <ErrorView />;
    }

    if (!logos || logos.length === 0) {
      return <EmptyStateView />;
    }

    return (
      <div className="space-y-4 w-full">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 p-3 sm:p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {logos.map((logo, index) => renderLogoCard(logo, index))}
        </div>
        <div className="flex justify-center p-4 sm:p-6">
          <motion.button 
            onClick={() => navigate('/logorequest')}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-6 py-3 text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <IoAddCircleOutline size={24} />
            {t('logoHistory.buttons.newRequest', 'New Logo Request')}
          </motion.button>
        </div>
      </div>
    );
  }, [logos, error, navigate, renderLogoCard, ErrorView, EmptyStateView, t]);

  // Show loading screen
  if (loading) {
    return <LoadingPage name={t('logoHistory.loading', 'Loading Logos...')} />;
  }

  // Main render function
  return (
    <div className="flex min-h-screen bg-black w-full overflow-hidden">
      <SideNavbar />
      <div className="relative flex-1 min-h-screen overflow-hidden bg-black md:ml-2 w-full">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -top-[500px] -left-[500px] w-[1000px] h-[1000px] rounded-full bg-gradient-radial from-purple-600/30 via-transparent to-transparent blur-3xl"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-full h-full opacity-30">
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -bottom-[600px] -right-[600px] w-[1200px] h-[1200px] rounded-full bg-gradient-radial from-cyan-500/30 via-transparent to-transparent blur-3xl"
            />
          </div>
          {/* Simple background without problematic SVG */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen p-3 sm:p-4 md:p-5 lg:p-6 pt-16 sm:pt-12 md:pt-6 w-full">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6 lg:mb-8 w-full"
          >
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
            >
              {t('logoHistory.title', 'LogoAI')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-3xl mt-2 sm:mt-3 text-sm sm:text-base text-gray-300"
            >
              {t('logoHistory.subtitle', 'Create stunning logos powered by AI. Generate, manage, and download unique logos tailored to your brand identity.')}
            </motion.p>
          </motion.header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-grow overflow-hidden border bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border-white/10 w-full"
            style={{ boxShadow: "0 20px 80px -20px rgba(6, 182, 212, 0.1)" }}
          >
            {renderLogoGrid()}
          </motion.div>
        </div>

        {selectedLogo && <LogoDetailsModal />}
      </div>
      
      <style>
        {`
        @keyframes floatIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
          100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
        }
        
        .float-in {
          animation: floatIn 0.5s ease-out forwards;
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        `}
      </style>
    </div>
  );
};

export default LogoHistory;