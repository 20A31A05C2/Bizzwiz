import React, { useState, useEffect, useRef } from 'react';
import leftside from '../../assets/leftside.png'; // Import the left side image
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Advertisement = () => {
  const { t } = useTranslation(); // Use translation hook
  
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const lineRef = useRef(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isHorizontalLineVisible, setIsHorizontalLineVisible] = useState(false);
  const [dotMatrixVisible, setDotMatrixVisible] = useState(false);

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
      setDotMatrixVisible(true);
    }
    
    if (imageRef.current && !isImageVisible && isInViewport(imageRef.current)) {
      setIsImageVisible(true);
    }
    
    if (labelRef.current && !isLabelVisible && isInViewport(labelRef.current)) {
      setIsLabelVisible(true);
    }
    
    if (titleRef.current && !isTitleVisible && isInViewport(titleRef.current)) {
      setIsTitleVisible(true);
    }
    
    if (descriptionRef.current && !isDescriptionVisible && isInViewport(descriptionRef.current)) {
      setIsDescriptionVisible(true);
    }
    
    if (buttonRef.current && !isButtonVisible && isInViewport(buttonRef.current)) {
      setIsButtonVisible(true);
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
    <div ref={sectionRef} className="relative bg-black text-white w-full py-4 sm:py-6 md:py-12 flex flex-col justify-center items-center p-3 sm:p-4 overflow-hidden">
      {/* Background dots pattern - now in top left corner with dark purple color */}
      <div className={`absolute top-0 left-0 w-28 sm:w-32 md:w-36 lg:w-40 h-28 sm:h-32 md:h-36 lg:h-40 overflow-hidden transition-opacity duration-1500 ${dotMatrixVisible ? 'opacity-100' : 'opacity-0'}`}>
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-start">
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <div 
                key={`dot-${rowIndex}-${colIndex}`} 
                className="w-1 h-1 rounded-full bg-purple-900 opacity-0 m-2.5 sm:m-3 md:m-3.5"
                style={{
                  opacity: dotMatrixVisible ? 0.4 : 0,
                  transition: `opacity 0.5s ease-out ${(rowIndex * 5 + colIndex) * 0.02}s`,
                  animation: dotMatrixVisible ? `pulseOnce 1.5s forwards ${(rowIndex + colIndex) * 0.1}s` : 'none'
                }}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Main content container - REDUCED margins */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        {/* Left side - image with initial animation only */}
        <div 
          ref={imageRef}
          className={`flex-1 flex justify-center mb-4 md:mb-0 transition-all duration-700 transform ${isImageVisible ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'}`}
        >
          <img 
            src={leftside} 
            alt={t('ads.imageAlt')} 
            className="max-w-full w-3/4 sm:w-4/5 md:w-auto h-auto"
          />
        </div>
        
        {/* Right side with text content - staggered animations */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg pl-0 md:pl-3 lg:pl-4">
          <div 
            ref={labelRef}
            className={`text-blue-500 mb-2 tracking-wide text-xs sm:text-sm transition-all duration-700 transform ${isLabelVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            {t('ads.label')}
          </div>
          
          <h1 
            ref={titleRef}
            className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 delay-200 transform ${isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            {t('ads.title')}
          </h1>
          
          <p 
            ref={descriptionRef}
            className={`mb-3 sm:mb-4 text-gray-300 text-sm sm:text-base transition-all duration-700 delay-400 transform ${isDescriptionVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            {t('ads.description')}
          </p>
          
          <div 
            ref={buttonRef}
            className={`transition-all duration-700 delay-600 transform ${isButtonVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <button 
              className="bg-transparent text-white px-4 sm:px-5 py-2 rounded-full border border-purple-500 hover:bg-purple-900 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
              style={{
                boxShadow: isButtonVisible ? '0 0 15px rgba(168, 85, 247, 0.1)' : 'none',
                transition: 'all 0.3s ease-out, box-shadow 1.5s ease'
              }}
            >
              {t('ads.button')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Horizontal Line - REDUCED margins */}
      <div ref={lineRef} className="w-full max-w-6xl relative mt-24 sm:mt-28 md:mt-32 mb-2 sm:mb-3 md:mb-4">
        <div 
          className={`w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent relative transition-all duration-1000 transform ${isHorizontalLineVisible ? 'opacity-60 scale-x-100' : 'opacity-0 scale-x-0'}`}
        >
          {/* Add subtle glow to the line */}
          <div className="absolute inset-0 blur-sm bg-purple-400 opacity-50"></div>
        </div>
      </div>
      
      {/* Add global keyframe animations */}
      <style jsx>{`
        @keyframes pulseOnce {
          0% {
            opacity: 0;
          }
          70% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default Advertisement;