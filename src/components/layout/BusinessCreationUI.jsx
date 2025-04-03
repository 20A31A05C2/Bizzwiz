import React, { useState, useEffect, useRef } from 'react';
import grid from '../../assets/grid.png';

const BusinessCreationUI = () => {
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const lineRef = useRef(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isHorizontalLineVisible, setIsHorizontalLineVisible] = useState(false);

  // Check if element is in viewport
  const isInViewport = (element, offset = 150) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset) &&
      rect.bottom >= offset
    );
  };

  // Handle scroll events
  const handleScroll = () => {
    if (sectionRef.current && !isVisible && isInViewport(sectionRef.current)) {
      setIsVisible(true);
    }
    
    if (titleRef.current && !isTitleVisible && isInViewport(titleRef.current)) {
      setIsTitleVisible(true);
    }
    
    if (subtitleRef.current && !isSubtitleVisible && isInViewport(subtitleRef.current)) {
      setIsSubtitleVisible(true);
    }
    
    if (formRef.current && !isFormVisible && isInViewport(formRef.current)) {
      setIsFormVisible(true);
    }
    
    if (lineRef.current && !isHorizontalLineVisible && isInViewport(lineRef.current)) {
      setIsHorizontalLineVisible(true);
    }
  };

  useEffect(() => {
    // Initial check for elements in viewport
    setTimeout(() => {
      handleScroll();
    }, 300);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full min-h-screen sm:h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Main container with responsive sizing */}
      <div 
        ref={contentRef}
        className={`w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl h-64 sm:h-80 md:h-96 rounded-lg border border-gray-700 relative overflow-hidden transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
        style={{
          backgroundImage: `url(${grid})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1a0933' // Dark purple base
        }}
      >
        {/* Background overlay - dark purple with black edges */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-950/90 to-black/90"></div>
        
        {/* Black vignette effect for darkened edges */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-black opacity-60"></div>
        
        {/* Content with animated elements */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <h1 
            ref={titleRef}
            className={`text-white text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 font-light transition-all duration-700 transform ${isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            Créez votre propre entreprise
          </h1>
          
          <p 
            ref={subtitleRef}
            className={`text-white text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-10 font-light transition-all duration-700 delay-200 transform ${isSubtitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            gratuitement grâce à l'IA
          </p>
          
          <div 
            ref={formRef}
            className={`flex flex-col sm:flex-row w-full max-w-xs sm:max-w-md gap-2 transition-all duration-700 delay-400 transform ${isFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 sm:px-4 py-2 rounded-md bg-opacity-30 bg-purple-950 border border-purple-700 text-white text-sm sm:text-base mb-2 sm:mb-0"
            />
            <button className="bg-white text-purple-900 px-3 sm:px-4 py-2 rounded-md font-medium whitespace-nowrap text-sm sm:text-base hover:bg-gray-100 transition-colors duration-300">
              Essayé gratuitement
            </button>
          </div>
          
          <p className={`text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6 transition-all duration-700 delay-600 transform ${isFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Aucune carte de crédit requise · c'est gratuit
          </p>
        </div>
      </div>

      {/* Horizontal line below the main content - exactly as in KeyAdvantagesSection */}
      <div ref={lineRef} className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl mt-8 sm:mt-12 md:mt-16 mb-6 sm:mb-8 md:mb-10">
        <div 
          className={`w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent relative transition-all duration-1000 transform ${isHorizontalLineVisible ? 'opacity-60 scale-x-100' : 'opacity-0 scale-x-0'}`}
        >
          {/* Add subtle glow to the line */}
          <div className="absolute inset-0 blur-sm bg-purple-400 opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCreationUI;