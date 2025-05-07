import { useState, useEffect } from 'react';
import { 
  IoSparklesOutline, 
  IoArrowForward, 
  IoImageOutline, 
  IoWalletOutline,
  IoRefreshOutline,
  IoDownloadOutline,
  IoStarOutline,
  IoInformationCircleOutline
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import translation hook
import 'react-toastify/dist/ReactToastify.css';
import SideNavbar from '../userlayout/sidebar';
import Background from "../../../assets/background.png";
import ApiService from '../../../Apiservice';

const Logorequest = () => {
  // Initialize translation hook
  const { t } = useTranslation();
  
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState(null);
  const [logoImageUrl, setLogoImageUrl] = useState(null);
  const [logoImageData, setLogoImageData] = useState(null); // New state for base64 data
  const [suggestedFilename, setSuggestedFilename] = useState(null);
  const [userCredits, setUserCredits] = useState(null);
  const [logoCreditCost, setLogoCreditCost] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingStage, setGeneratingStage] = useState(0); // 0: not generating, 1-3: generating stages
  const [imageError, setImageError] = useState(false);
  const [requestId, setRequestId] = useState(null); // Store request ID for fetching data

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = currentUser?.id;

  // Fetch user credits and logo credit cost on component mount
  useEffect(() => {
    const fetchCreditsInfo = async () => {
      try {
        // First API call - Get user credits
        const userResponse = await ApiService("/getcredits", "GET");
        
        if (userResponse.success || userResponse.status === 200) {
          setUserCredits(userResponse.credits);
        }

        // Second API call - Get API settings
        const settingsResponse = await ApiService("/api-settings", "GET");
        
        if (settingsResponse.success || settingsResponse.status === 200) {
          // Handle direct logo_credits_cost property or nested in settings object
          const cost = settingsResponse.logo_credits_cost || 
                      (settingsResponse.settings && settingsResponse.settings.logo_credits_cost);
          
          if (cost !== undefined) {
            setLogoCreditCost(cost);
          }
        }
      } catch (error) {
        // Silent error handling - don't set default values
      }
    };

    fetchCreditsInfo();
  }, []);

  // Effect for animating the generating stages
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setGeneratingStage(prev => (prev < 3 ? prev + 1 : 1));
      }, 1500);
    } else {
      setGeneratingStage(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Fetch image data when request ID is available but no image data
  useEffect(() => {
    if (requestId && !logoImageData && !logoImageUrl) {
      fetchLogoData();
    }
  }, [requestId]);

  // Function to fetch logo data if not already provided
  const fetchLogoData = async () => {
    if (!requestId) return;
    
    try {
      setImageError(false);
      setLoading(true);
      
      const response = await ApiService("/logos/data", "GET", null, {
        request_id: requestId
      });
      
      if (response.success) {
        setLogoImageData(response.image_data);
        setSuggestedFilename(response.filename || 'logo.png');
        setImageError(false);
      } else {
        setImageError(true);
        toast.error(t('logoRequest.errors.loadFailed', "Failed to load logo image"));
      }
    } catch (error) {
      setImageError(true);
      toast.error(t('logoRequest.errors.loadFailedRetry', "Failed to load logo image: ") + (error.message || t('logoRequest.errors.unknownError', "Unknown error")));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLogo = async () => {
    if (!prompt.trim()) {
      toast.error(t('logoRequest.errors.emptyPrompt', "Please enter a logo prompt"));
      return;
    }

    // Check client-side if user has enough credits before making the API call
    if (userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost) {
      toast.error(t('logoRequest.errors.insufficientCredits', "Insufficient credits. You need ${cost} to generate a logo.").replace('${cost}', logoCreditCost));
      return;
    }

    setLoading(true);
    setGenerating(true);
    setImageError(false);
    try {
      // Send just the prompt to the API - let backend handle any parsing
      const response = await ApiService("/generate-logo", "POST", { 
        prompt,
        user_id: userId
      });

      if (response.success) {
        setGeneratedLogo(response.data);
        setRequestId(response.request_id);
        
        // Check if we have base64 data directly in the response
        if (response.image_data) {
          setLogoImageData(response.image_data);
          setLogoImageUrl(null); // Clear URL if we're using base64
        } else if (response.image_url) {
          // Fallback to URL if that's what the API provides
          setLogoImageUrl(response.image_url);
          setLogoImageData(null);
        }
        
        setSuggestedFilename(response.filename || 'logo.png');
        
        // Update user credits with the response data
        if (response.credits_remaining !== undefined) {
          setUserCredits(response.credits_remaining);
        }
        toast.success(t('logoRequest.success.logoGenerated', "Logo generated successfully!"));
      } else {
        toast.error(response.message || t('logoRequest.errors.generateFailed', "Failed to generate logo"));
      }
    } catch (error) {
      toast.error(error.message || t('logoRequest.errors.generateFailed', "Failed to generate logo"));
    } finally {
      setLoading(false);
      setTimeout(() => {
        setGenerating(false);
      }, 600); // Keep animation visible briefly after loading completes
    }
  };

  const handleDownload = () => {
    // If we have base64 data, use it for direct download
    if (logoImageData) {
      try {
        // Create an anchor element and set properties for download
        const link = document.createElement('a');
        link.href = logoImageData;
        link.download = suggestedFilename || 'logo.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(t('logoRequest.success.downloadStarted', "Logo download started!"));
      } catch (error) {
        toast.error(t('logoRequest.errors.downloadFailed', "Failed to download logo: ") + (error.message || t('logoRequest.errors.unknownError', "Unknown error")));
        console.error("Download error:", error);
      }
    } 
    // Fallback to URL if that's what we have
    else if (logoImageUrl) {
      try {
        // Open in a new tab or trigger download
        window.open(logoImageUrl, '_blank');
        
        toast.success(t('logoRequest.success.downloadInitiated', "Logo download initiated!"));
      } catch (error) {
        toast.error(t('logoRequest.errors.downloadFailed', "Failed to download logo: ") + (error.message || t('logoRequest.errors.unknownError', "Unknown error")));
        console.error("Download error:", error);
      }
    }
  };

  // Function to handle image loading errors
  const handleImageError = (e) => {
    console.error("Image failed to load");
    setImageError(true);
    
    // If the image fails to load, show an error placeholder
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+SW1hZ2UgTG9hZCBFcnJvcjwvdGV4dD48L3N2Zz4=';
    toast.error(t('logoRequest.errors.loadFailedRetry', "Failed to load logo image. Please try again."));
  };

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavbar />
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Animated gradient background with dynamic lighting */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,200,255,0.1)_0%,transparent_60%)] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(180,100,255,0.1)_0%,transparent_60%)] animate-pulse-slower"></div>
        <img src={Background} alt="Background" className="absolute inset-0 object-cover w-full h-full opacity-40 animate-bg-zoom" />
        
        {/* Floating particles - reduced for better performance on mobile */}
        <div className="particles-container">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className={`particle particle-${i + 1}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Credit Information Display - Adjusted positioning for better visibility on small screens */}
        <div className="absolute top-1 xs:top-2 sm:top-3 md:top-4 right-1 xs:right-2 sm:right-3 md:right-4 animate-fade-in z-20">
          <div className="group flex items-center px-1.5 xs:px-2 sm:px-3 md:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-gray-800/80 border border-cyan-500/30 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-800/90 hover:border-cyan-500/40">
            <div className="mr-1.5 xs:mr-2 sm:mr-3 p-1 xs:p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-lg group-hover:from-cyan-500/40 group-hover:to-purple-500/40 transition-all duration-300">
              <IoWalletOutline className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
            </div>
            <div>
              <span className="text-gray-400 text-xxs xs:text-xs">{t('logoRequest.credits.label', 'Credits')}</span>
              <div className="text-white font-medium text-xs xs:text-sm">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  ${userCredits !== null ? userCredits : '...'}
                </span>
                {logoCreditCost !== null && (
                  <span className="ml-1 xs:ml-1 sm:ml-2 text-gray-400 text-xxs xs:text-xs">
                    ({t('logoRequest.credits.cost', 'Cost:')} <span className="text-cyan-300">${logoCreditCost}</span>)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content wrapper with adjusted spacing and padding */}
        <div className="relative z-10 flex flex-col items-center min-h-screen p-3 xs:p-4 lg:p-8 pt-10 xs:pt-12 sm:pt-14 md:pt-16">
          {/* Generator Card - Adjusted spacing to prevent overlap with credits */}
          <div className="w-full max-w-3xl mx-auto mt-16 xs:mt-18 sm:mt-20 md:mt-24 bg-transparent backdrop-blur-sm border border-gray-700/30 p-3 xs:p-4 sm:p-6 md:p-8 rounded-xl xs:rounded-2xl shadow-2xl animate-float-in overflow-hidden">
            {/* Header with glow effect - responsive */}
            <div className="text-center mb-4 xs:mb-6 sm:mb-8 relative">
              <div className="absolute -top-8 xs:-top-12 sm:-top-16 left-1/2 transform -translate-x-1/2 w-32 xs:w-48 sm:w-64 h-32 xs:h-48 sm:h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-3 mb-1 xs:mb-2">
                <div className="p-1.5 xs:p-2 sm:p-3 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 backdrop-blur-md border border-cyan-500/20 animate-float-subtle">
                  <IoSparklesOutline className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-cyan-300" />
                </div>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 animate-text-shimmer">
                {t('logoRequest.title', 'AI Logo Creator')}
              </h2>
              <p className="text-gray-400 mt-1 xs:mt-2 max-w-xl mx-auto text-xs xs:text-sm sm:text-base">
                {t('logoRequest.subtitle', 'Transform your vision into a stunning logo with AI')}
              </p>
            </div>
            
            {/* Prompt Input with enhanced glowing border - responsive */}
            {!loading && (
              <div className="relative mb-3 xs:mb-4 sm:mb-6 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-70 group-hover:animate-border-flow transition duration-1000"></div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('logoRequest.prompt.placeholder', 'Describe your dream logo with as much detail as possible...')}
                  className="relative w-full p-3 xs:p-4 sm:p-6 text-white bg-gray-800/40 border border-gray-700/50 rounded-xl focus:outline-none min-h-24 xs:min-h-36 sm:min-h-52 resize-none shadow-inner transition-all duration-300 focus:shadow-cyan-900/30 text-sm xs:text-base"
                  style={{ caretColor: '#06b6d4' }}
                />
                <div className="absolute bottom-1 xs:bottom-2 sm:bottom-4 right-1 xs:right-2 sm:right-4 text-gray-500 text-xxs xs:text-xs sm:text-sm">
                  {prompt.length} {t('logoRequest.prompt.characters', 'characters')}
                </div>
                
                {/* Prompt tips toggle */}
                <button 
                  onClick={() => setShowTips(!showTips)}
                  className="absolute top-1 xs:top-2 sm:top-4 right-1 xs:right-2 sm:right-4 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  title={t('logoRequest.prompt.tipsButton', 'Show tips for better prompts')}
                >
                  <IoInformationCircleOutline className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            )}
            
            {/* Prompt tips panel with slide animation */}
            {showTips && !loading && (
              <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-2 xs:p-3 sm:p-4 mb-3 xs:mb-4 sm:mb-6 animate-slide-down">
                <h4 className="text-cyan-300 text-xxs xs:text-xs sm:text-sm font-medium mb-0.5 xs:mb-1 sm:mb-2">
                  {t('logoRequest.prompt.tips.title', 'Tips for better logo prompts:')}
                </h4>
                <ul className="text-gray-300 text-xxs xs:text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                  <li>• {t('logoRequest.prompt.tips.items.0', 'Specify the business name and industry')}</li>
                  <li>• {t('logoRequest.prompt.tips.items.1', 'Mention preferred colors or color scheme')}</li>
                  <li>• {t('logoRequest.prompt.tips.items.2', 'Describe the style (minimalist, modern, vintage, etc.)')}</li>
                  <li>• {t('logoRequest.prompt.tips.items.3', 'Suggest graphic elements or symbols to include')}</li>
                  <li>• {t('logoRequest.prompt.tips.items.4', 'Mention any fonts or typography preferences')}</li>
                </ul>
              </div>
            )}
            
            {/* Generate Button with enhanced gradient and glow - responsive */}
            {!loading && (
              <div className="flex justify-center mt-4 xs:mt-6 sm:mt-8 relative">
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl blur-md ${loading || !prompt.trim() || (userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost) ? 'opacity-0' : 'opacity-50 animate-pulse-slow'}`}></div>
                <button 
                  onClick={handleGenerateLogo} 
                  disabled={loading || !prompt.trim() || (userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost)} 
                  className={`relative flex items-center gap-1.5 xs:gap-2 sm:gap-3 px-4 xs:px-6 sm:px-8 md:px-10 py-2 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold text-white transition-all duration-500 transform shadow-xl rounded-xl ${
                    loading ? 'bg-gray-700/80 cursor-not-allowed' : 
                    (!prompt.trim() || (userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost)) ? 
                    'bg-gray-700/80 cursor-not-allowed' : 
                    'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 hover:scale-105 hover:shadow-cyan-500/50'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 border-2 border-white border-t-transparent rounded-full mr-1.5 xs:mr-2"></div>
                      {t('logoRequest.buttons.creatingMagic', 'Creating Magic...')}
                    </>
                  ) : (
                    <>
                      {t('logoRequest.buttons.generate', 'Generate Logo')}
                      {!(userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost) && !loading && 
                        <IoArrowForward className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 animate-bounce-subtle" />
                      }
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Staged Loading Animation */}
            {loading && (
              <div className="flex flex-col items-center mt-4 xs:mt-6">
                <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mb-3 xs:mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-opacity-25"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-l-cyan-400 border-t-purple-400 border-r-cyan-400 border-b-purple-400 border-opacity-75 animate-spin"
                    style={{ animationDuration: '1.5s' }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IoSparklesOutline className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-cyan-300 animate-pulse-slow" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base xs:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                    {generatingStage === 1 && t('logoRequest.generatingStages.analyzing', "Analyzing prompt...")}
                    {generatingStage === 2 && t('logoRequest.generatingStages.crafting', "Crafting design elements...")}
                    {generatingStage === 3 && t('logoRequest.generatingStages.finalizing', "Finalizing your logo...")}
                    {generatingStage === 0 && t('logoRequest.generatingStages.creating', "Creating magic...")}
                  </p>
                  <div className="flex justify-center space-x-2 mt-2 xs:mt-3">
                    <div className={`w-2 h-2 xs:w-3 xs:h-3 rounded-full ${generatingStage >= 1 ? 'bg-cyan-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
                    <div className={`w-2 h-2 xs:w-3 xs:h-3 rounded-full ${generatingStage >= 2 ? 'bg-purple-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
                    <div className={`w-2 h-2 xs:w-3 xs:h-3 rounded-full ${generatingStage >= 3 ? 'bg-cyan-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generated Logo Display - Transparent Background with responsive design */}
          {(logoImageData || logoImageUrl) && !loading && (
            <div className="mt-6 xs:mt-8 sm:mt-10 md:mt-12 p-3 xs:p-4 sm:p-6 md:p-8 bg-transparent backdrop-blur-sm border border-gray-700/30 text-white rounded-xl xs:rounded-2xl max-w-3xl mx-auto w-full animate-fade-in-up shadow-2xl">
              <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 mb-4 xs:mb-6 sm:mb-8">
                <div className="p-1 xs:p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 animate-float-subtle">
                  <IoImageOutline className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-cyan-300" />
                </div>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 animate-text-shimmer">
                  {t('logoRequest.results.title', 'Your Logo Creation')}
                </h3>
              </div>
              
              <div className="flex justify-center mb-4 xs:mb-6 sm:mb-8 relative group">
                <div className="absolute -inset-0.5 xs:-inset-1 sm:-inset-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse-slow"></div>
                <div className="relative p-0.5 xs:p-1 sm:p-1.5 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-lg">
                  {/* Use base64 data if available, otherwise fall back to URL */}
                  <img 
                    src={logoImageData || logoImageUrl}
                    alt="Generated Logo" 
                    className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md object-contain bg-gray-800/20 backdrop-blur-sm"
                    onError={handleImageError}
                  />
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/60 rounded-lg">
                      <div className="text-center p-2 xs:p-4">
                        <p className="text-red-400 mb-1 xs:mb-2 text-xs xs:text-sm">{t('logoRequest.errors.loadFailed', 'Image failed to load')}</p>
                        <button 
                          onClick={fetchLogoData}
                          className="px-2 xs:px-3 py-0.5 xs:py-1 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white text-xs xs:text-sm"
                        >
                          {t('logoRequest.buttons.retry', 'Retry')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 mt-4 xs:mt-6 sm:mt-8 md:mt-10">
                <button 
                  onClick={() => {
                    setPrompt('');
                    setGeneratedLogo(null);
                    setLogoImageUrl(null);
                    setLogoImageData(null);
                    setRequestId(null);
                    setSuggestedFilename(null);
                    setShowTips(false);
                    setImageError(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2.5 sm:py-3 md:py-3.5 text-xs xs:text-sm sm:text-base md:text-lg text-white bg-gradient-to-r from-cyan-700/80 to-purple-700/80 hover:from-cyan-600/90 hover:to-purple-600/90 rounded-lg xs:rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-700/30 hover:scale-105"
                >
                 <IoRefreshOutline className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="hidden xxs:inline">{t('logoRequest.buttons.createNew', 'Create New')}</span>
                  <span className="xxs:hidden">{t('logoRequest.buttons.createNewShort', 'New')}</span>
                </button>
                
                <button 
                  onClick={handleDownload}
                  disabled={(!logoImageData && !logoImageUrl) || imageError}
                  className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2.5 sm:py-3 md:py-3.5 text-xs xs:text-sm sm:text-base md:text-lg text-white bg-gray-700/80 hover:bg-gray-600/90 rounded-lg xs:rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-700/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 disabled:hover:scale-100"
                >
                  <IoDownloadOutline className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {t('logoRequest.buttons.download', 'Download')}
                </button>
                
                <button 
                  className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2.5 sm:py-3 md:py-3.5 text-xs xs:text-sm sm:text-base md:text-lg text-white bg-gray-700/80 hover:bg-gray-600/90 rounded-lg xs:rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-700/30 hover:scale-105"
                >

                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes bgZoom {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes floatIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
          
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes floatSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes bounceSubtle {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulseSlower {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.3; }
        }
        
        @keyframes textShimmer {
          0% { background-position: -500% 0; }
          100% { background-position: 500% 0; }
        }
        
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -30px); }
          50% { transform: translate(60px, 0); }
          75% { transform: translate(30px, 30px); }
        }
        
        .animate-bg-zoom {
          animation: bgZoom 25s ease-in-out infinite;
        }
        
       .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-float-in {
          animation: floatIn 1s ease-out forwards;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-subtle {
          animation: floatSubtle 4s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounceSubtle 1.5s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulseSlower 6s ease-in-out infinite;
        }
        
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: textShimmer 5s linear infinite;
        }
        
        .animate-border-flow {
          background-size: 200% 200%;
          animation: borderFlow 3s linear infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.5;
          animation: particleFloat 20s infinite ease-in-out;
        }
        
        .particle-1, .particle-5 {
          background-color: rgba(100, 200, 255, 0.15);
          box-shadow: 0 0 15px rgba(100, 200, 255, 0.3);
        }
        
        .particle-2, .particle-6 {
          background-color: rgba(180, 100, 255, 0.15);
          box-shadow: 0 0 15px rgba(180, 100, 255, 0.3);
        }
        
        .particle-3, .particle-7 {
          background-color: rgba(100, 255, 200, 0.15);
          box-shadow: 0 0 15px rgba(100, 255, 200, 0.3);
        }
        
        .particle-4, .particle-8 {
          background-color: rgba(255, 100, 200, 0.15);
          box-shadow: 0 0 15px rgba(255, 100, 200, 0.3);
        }
        
        /* Custom breakpoints for extra small screens */
        .text-xxs {
          font-size: 0.65rem;
          line-height: 1rem;
        }
        
        /* Responsive utilities */
        @media (min-width: 360px) {
          .xxs\\:hidden {
            display: none;
          }
          
          .xxs\\:inline {
            display: inline;
          }
        }
        
        @media (min-width: 414px) {
          .xs\\:hidden {
            display: none;
          }
          
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};

export default Logorequest;