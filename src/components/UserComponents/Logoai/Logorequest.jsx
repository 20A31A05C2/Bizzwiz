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
import 'react-toastify/dist/ReactToastify.css';
import SideNavbar from '../userlayout/sidebar';
import Background from "../../../assets/background.png";
import ApiService from '../../../Apiservice';

const Logorequest = () => {
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
        toast.error(response.message || "Failed to load logo image");
      }
    } catch (error) {
      setImageError(true);
      toast.error("Failed to load logo image: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLogo = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a logo prompt");
      return;
    }

    // Check client-side if user has enough credits before making the API call
    if (userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost) {
      toast.error(`Insufficient credits. You need $${logoCreditCost} to generate a logo.`);
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
        toast.success("Logo generated successfully!");
      } else {
        toast.error(response.message || "Failed to generate logo");
      }
    } catch (error) {
      toast.error(error.message || "Failed to generate logo");
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
        
        toast.success("Logo download started!");
      } catch (error) {
        toast.error("Failed to download logo: " + (error.message || "Unknown error"));
        console.error("Download error:", error);
      }
    } 
    // Fallback to URL if that's what we have
    else if (logoImageUrl) {
      try {
        // Open in a new tab or trigger download
        window.open(logoImageUrl, '_blank');
        
        toast.success("Logo download initiated!");
      } catch (error) {
        toast.error("Failed to download logo: " + (error.message || "Unknown error"));
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
    toast.error("Failed to load logo image. Please try again.");
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
        
        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(12)].map((_, i) => (
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
        
        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center min-h-screen p-4 lg:p-8">
          {/* Credit Information Display with animated border - made responsive */}
          <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 animate-fade-in">
            <div className="group flex items-center px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-800/60 border border-cyan-500/20 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-800/80 hover:border-cyan-500/40">
              <div className="mr-2 sm:mr-3 p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                <IoWalletOutline size={16} className="sm:text-xl md:text-2xl text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
              </div>
              <div>
                <span className="text-gray-400 text-xs">Credits</span>
                <div className="text-white font-medium">
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    ${userCredits !== null ? userCredits : '...'}
                  </span>
                  {logoCreditCost !== null && (
                    <span className="ml-1 sm:ml-2 text-gray-400 text-xs">
                      (Cost: <span className="text-cyan-300">${logoCreditCost}</span>)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Generator Card - Transparent Background with responsive padding */}
          <div className="w-full max-w-3xl mx-auto mt-8 sm:mt-12 md:mt-16 bg-transparent backdrop-blur-sm border border-gray-700/30 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl animate-float-in overflow-hidden">
            {/* Header with glow effect - responsive */}
            <div className="text-center mb-6 sm:mb-8 relative">
              <div className="absolute -top-12 sm:-top-16 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 backdrop-blur-md border border-cyan-500/20 animate-float-subtle">
                  <IoSparklesOutline size={24} className="sm:text-3xl text-cyan-300" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 animate-text-shimmer">AI Logo Creator</h2>
              <p className="text-gray-400 mt-2 max-w-xl mx-auto text-sm sm:text-base">Transform your vision into a stunning logo with AI</p>
            </div>
            
            {/* Prompt Input with enhanced glowing border - responsive */}
            {!loading && (
              <div className="relative mb-4 sm:mb-6 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-70 group-hover:animate-border-flow transition duration-1000"></div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your dream logo with as much detail as possible..."
                  className="relative w-full p-4 sm:p-6 text-white bg-gray-800/40 border border-gray-700/50 rounded-xl focus:outline-none min-h-36 sm:min-h-52 resize-none shadow-inner transition-all duration-300 focus:shadow-cyan-900/30"
                  style={{ caretColor: '#06b6d4' }}
                />
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-gray-500 text-xs sm:text-sm">
                  {prompt.length} characters
                </div>
                
                {/* Prompt tips toggle */}
                <button 
                  onClick={() => setShowTips(!showTips)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  title="Show tips for better prompts"
                >
                  <IoInformationCircleOutline size={18} className="sm:text-xl" />
                </button>
              </div>
            )}
            
            {/* Prompt tips panel with slide animation */}
            {showTips && !loading && (
              <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 animate-slide-down">
                <h4 className="text-cyan-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Tips for better logo prompts:</h4>
                <ul className="text-gray-300 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                  <li>• Specify the business name and industry</li>
                  <li>• Mention preferred colors or color scheme</li>
                  <li>• Describe the style (minimalist, modern, vintage, etc.)</li>
                  <li>• Suggest graphic elements or symbols to include</li>
                  <li>• Mention any fonts or typography preferences</li>
                </ul>
              </div>
            )}
            
            {/* Generate Button with enhanced gradient and glow - responsive */}
            {!loading && (
              <div className="flex justify-center mt-6 sm:mt-8 relative">
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl blur-md ${loading || !prompt.trim() || (userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost) ? 'opacity-0' : 'opacity-50 animate-pulse-slow'}`}></div>
                <button 
                  onClick={handleGenerateLogo} 
                  disabled={loading || !prompt.trim() || (userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost)} 
                  className={`relative flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all duration-500 transform shadow-xl rounded-xl ${
                    loading ? 'bg-gray-700/80 cursor-not-allowed' : 
                    (!prompt.trim() || (userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost)) ? 
                    'bg-gray-700/80 cursor-not-allowed' : 
                    'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 hover:scale-105 hover:shadow-cyan-500/50'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 sm:h-5 w-4 sm:w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      Generate Logo
                      {!(userCredits !== null && logoCreditCost !== null && userCredits < logoCreditCost) && !loading && 
                        <IoArrowForward size={18} className="sm:text-xl animate-bounce-subtle" />
                      }
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Staged Loading Animation */}
            {loading && (
              <div className="flex flex-col items-center mt-6">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-opacity-25"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-l-cyan-400 border-t-purple-400 border-r-cyan-400 border-b-purple-400 border-opacity-75 animate-spin"
                    style={{ animationDuration: '1.5s' }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IoSparklesOutline size={24} className="text-cyan-300 animate-pulse-slow" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                    {generatingStage === 1 && "Analyzing prompt..."}
                    {generatingStage === 2 && "Crafting design elements..."}
                    {generatingStage === 3 && "Finalizing your logo..."}
                    {generatingStage === 0 && "Creating magic..."}
                  </p>
                  <div className="flex justify-center space-x-2 mt-3">
                    <div className={`w-3 h-3 rounded-full ${generatingStage >= 1 ? 'bg-cyan-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
                    <div className={`w-3 h-3 rounded-full ${generatingStage >= 2 ? 'bg-purple-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
                    <div className={`w-3 h-3 rounded-full ${generatingStage >= 3 ? 'bg-cyan-400' : 'bg-gray-600'} transition-colors duration-300`}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generated Logo Display - Transparent Background with responsive design */}
          {(logoImageData || logoImageUrl) && !loading && (
            <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 md:p-8 bg-transparent backdrop-blur-sm border border-gray-700/30 text-white rounded-2xl max-w-3xl mx-auto w-full animate-fade-in-up shadow-2xl">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 animate-float-subtle">
                  <IoImageOutline size={20} className="sm:text-2xl md:text-3xl text-cyan-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 animate-text-shimmer">
                  Your Logo Creation
                </h3>
              </div>
              
              <div className="flex justify-center mb-6 sm:mb-8 relative group">
                <div className="absolute -inset-1 sm:-inset-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse-slow"></div>
                <div className="relative p-1 sm:p-1.5 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-lg">
                  {/* Use base64 data if available, otherwise fall back to URL */}
                  <img 
                    src={logoImageData || logoImageUrl}
                    alt="Generated Logo" 
                    className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md object-contain bg-gray-800/20 backdrop-blur-sm"
                    onError={handleImageError}
                  />
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/60 rounded-lg">
                      <div className="text-center p-4">
                        <p className="text-red-400 mb-2">Image failed to load</p>
                        <button 
                          onClick={fetchLogoData}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white text-sm"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8 md:mt-10">
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
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg text-white bg-gradient-to-r from-cyan-700/80 to-purple-700/80 hover:from-cyan-600/90 hover:to-purple-600/90 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-700/30 hover:scale-105"
                >
                  <IoRefreshOutline size={16} className="sm:text-xl md:text-2xl" />
                  <span className="hidden xs:inline">Create New</span>
                  <span className="xs:hidden">New</span>
                </button>
                
                <button 
                  onClick={handleDownload}
                  disabled={(!logoImageData && !logoImageUrl) || imageError}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg text-white bg-gray-700/80 hover:bg-gray-600/90 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-700/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700 disabled:hover:scale-100"
                >
                  <IoDownloadOutline size={16} className="sm:text-xl md:text-2xl" />
                  Download
                </button>
                
                <button 
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg text-white bg-gray-700/80 hover:bg-gray-600/90 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-700/30 hover:scale-105"
                >
                  <IoStarOutline size={16} className="sm:text-xl md:text-2xl" />
                  <span className="hidden xs:inline">Save to Favorites</span>
                  <span className="xs:hidden">Save</span>
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
        
        .animate-float-random {
          animation: floatRandom 6s ease-in-out infinite;
        }
        
        .animate-typing {
          animation: typing 3.5s steps(40, end);
        }
        
        .animate-text-shimmer-wide {
          background-size: 200% auto;
          animation: textShimmerWide 6s linear infinite;
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
        
        .animate-spin-fast {
          animation: spinFast 1s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spinReverse 10s linear infinite;
        }
        
        .animate-pulse-dots {
          animation: pulseDots 1.5s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        
        .animate-pulse-scale {
          animation: pulseScale 1.5s ease-in-out infinite;
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
        
        .particle-1, .particle-5, .particle-9 {
          background-color: rgba(100, 200, 255, 0.15);
          box-shadow: 0 0 15px rgba(100, 200, 255, 0.3);
        }
        
        .particle-2, .particle-6, .particle-10 {
          background-color: rgba(180, 100, 255, 0.15);
          box-shadow: 0 0 15px rgba(180, 100, 255, 0.3);
        }
        
        .particle-3, .particle-7, .particle-11 {
          background-color: rgba(100, 255, 200, 0.15);
          box-shadow: 0 0 15px rgba(100, 255, 200, 0.3);
        }
        
        .particle-4, .particle-8, .particle-12 {
          background-color: rgba(255, 100, 200, 0.15);
          box-shadow: 0 0 15px rgba(255, 100, 200, 0.3);
        }
        
        /* Responsive utilities */
        @media (min-width: 475px) {
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