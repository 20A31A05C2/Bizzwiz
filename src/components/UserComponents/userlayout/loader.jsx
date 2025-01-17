import { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';

const LoadingPage = (name) => {
    
  const [loadingText, setLoadingText] = useState('Loading');
  
  // Simulate different loading messages
  useEffect(() => {
    const messages = [
      name,
      'Loading data',
      'Almost there',
      'Setting things up'
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(messages[currentIndex]);
      currentIndex = (currentIndex + 1) % messages.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo or Brand Icon */}
        <div className="w-16 h-16 mb-8 overflow-hidden bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl animate-pulse">
          {/* You can replace this with your logo */}
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
            Please wait a moment
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 overflow-hidden bg-gray-800 rounded-full">
          <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 animate-progress"></div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute w-64 h-64 rounded-full top-1/4 left-1/4 bg-purple-500/10 filter blur-3xl animate-blob"></div>
        <div className="absolute w-64 h-64 rounded-full top-1/3 right-1/4 bg-purple-700/10 filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-64 h-64 rounded-full bottom-1/4 left-1/3 bg-purple-300/10 filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default LoadingPage;