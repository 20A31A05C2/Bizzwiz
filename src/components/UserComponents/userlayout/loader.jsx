import { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Import translation hook

function LoadingPage({name="Loading"}) {
  // Initialize translation hook
  const { t } = useTranslation();
  
  // Get the translated default name
  const defaultName = t('loadings.default', 'Loading');
  
  // Use translated name or provided name
  const translatedName = name === "Loading" ? defaultName : name;
  
  // Properly destructure the name prop with default value  
  const [loadingText, setLoadingText] = useState(translatedName);
    
  useEffect(() => {
    const messages = [
      translatedName,
      t('loadings.messages.loadingData', 'Loading data'),
      t('loadings.messages.almostThere', 'Almost there'),
      t('loadings.messages.settingUp', 'Setting things up')
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(messages[currentIndex]);
      currentIndex = (currentIndex + 1) % messages.length;
    }, 2000);
    
    return () => clearInterval(interval);
  }, [translatedName, t]); // Add translatedName and t to dependency array
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo or Brand Icon */}
        <div className="w-16 h-16 mb-8 overflow-hidden bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl animate-pulse">
          <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white">
            AI
          </div>
        </div>
        
        {/* Loading Spinner */}
        <PulseLoader
          color="#8B5CF6"
          size={15}
          speedMultiplier={0.8}
        />
        
        {/* Loading Text */}
        <div className="flex flex-col items-center">
          <p className="text-lg font-medium text-white/80">
            {loadingText}
          </p>
          <p className="mt-2 text-sm text-purple-500/80">
            {t('loadings.pleaseWait', 'Please wait a moment')}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 overflow-hidden bg-gray-800 rounded-full">
          <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 animate-progress"></div>
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div 
          className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/4 left-1/4 bg-purple-500/10 filter blur-3xl animate-blob"
          style={{ animationDelay: '0ms' }}
        />
        <div 
          className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/3 right-1/4 bg-purple-700/10 filter blur-3xl animate-blob"
          style={{ animationDelay: '2000ms' }}
        />
        <div 
          className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bottom-1/4 left-1/3 bg-purple-300/10 filter blur-3xl animate-blob"
          style={{ animationDelay: '4000ms' }}
        />
      </div>
    </div>
  );
};

LoadingPage.propTypes = {
  name: PropTypes.string,
};

export default LoadingPage;