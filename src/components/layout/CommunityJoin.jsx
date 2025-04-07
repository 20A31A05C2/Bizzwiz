import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const CommunityJoin = () => {
  const { t } = useTranslation(); // Use translation hook
  
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const lineRef = useRef(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isHorizontalLineVisible, setIsHorizontalLineVisible] = useState(false);
  const [areStarsVisible, setAreStarsVisible] = useState(false);
  const [areCloudsVisible, setAreCloudsVisible] = useState(false);

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
      // When section becomes visible, trigger stars and clouds too
      setAreStarsVisible(true);
      setAreCloudsVisible(true);
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
    <div ref={sectionRef} className="w-full min-h-[600px] sm:min-h-[650px] md:min-h-[700px] bg-black flex flex-col items-center justify-center py-12 sm:py-16 md:py-18 relative overflow-hidden">
      <div className="relative w-full max-w-6xl h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950">
        {/* Background glow effects */}
        <div 
          className={`absolute top-1/4 left-1/4 w-24 sm:w-32 md:w-48 lg:w-64 h-24 sm:h-32 md:h-48 lg:h-64 bg-purple-700 opacity-0 rounded-full blur-3xl transition-all duration-1500 ease-in-out ${isVisible ? 'opacity-10' : ''}`}
          style={{ 
            animation: isVisible ? 'pulse 8s infinite alternate ease-in-out' : 'none'
          }}
        ></div>
        <div 
          className={`absolute bottom-1/3 right-1/4 w-32 sm:w-40 md:w-56 lg:w-72 h-32 sm:h-40 md:h-56 lg:h-72 bg-blue-600 opacity-0 rounded-full blur-3xl transition-all duration-1500 ease-in-out ${isVisible ? 'opacity-10' : ''}`}
          style={{ 
            animation: isVisible ? 'pulse 12s infinite alternate-reverse ease-in-out' : 'none',
            animationDelay: '1s'
          }}
        ></div>
        
        {/* Clouds - Responsive and scroll-triggered */}
        <div
          className={`absolute top-20 sm:top-24 left-16 sm:left-24 md:left-32 transition-all duration-1000 transform ${areCloudsVisible ? 'opacity-40 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          style={{ 
            animation: areCloudsVisible ? 'float-x 8s infinite alternate ease-in-out' : 'none'
          }}
        >
          <svg width="50" height="18" viewBox="0 0 80 30" className="sm:w-16 sm:h-6 md:w-20 md:h-8" fill="#283467">
            <path d="M10,20 C15,10 30,10 35,15 C40,5 55,5 60,15 C65,10 70,15 75,20 C75,25 65,30 55,25 C50,30 40,30 35,25 C30,30 20,30 15,25 C10,30 5,25 5,20 C5,15 8,15 10,20 Z" />
          </svg>
        </div>
        
        <div
          className={`absolute top-12 sm:top-16 right-16 sm:right-28 md:right-40 transition-all duration-1000 delay-200 transform ${areCloudsVisible ? 'opacity-40 translate-x-0' : 'opacity-0 translate-x-10'}`}
          style={{ 
            animation: areCloudsVisible ? 'float-x-reverse 8s infinite alternate ease-in-out' : 'none',
            animationDelay: '1.5s'
          }}
        >
          <svg width="60" height="20" viewBox="0 0 120 40" className="sm:w-20 sm:h-8 md:w-24 md:h-10" fill="#283467">
            <path d="M10,30 C20,15 40,15 50,25 C55,10 85,10 95,25 C100,15 110,20 110,30 C110,35 100,40 90,35 C85,40 65,40 60,35 C55,40 35,40 30,35 C20,40 10,35 10,30 Z" />
          </svg>
        </div>
        
        <div
          className={`absolute top-16 sm:top-20 left-8 sm:left-12 transition-all duration-1000 delay-300 transform ${areCloudsVisible ? 'opacity-40 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          style={{ 
            animation: areCloudsVisible ? 'float-x 8s infinite alternate ease-in-out' : 'none',
            animationDelay: '0.8s'
          }}
        >
          <svg width="55" height="20" viewBox="0 0 100 35" className="sm:w-18 sm:h-7 md:w-22 md:h-9" fill="#283467">
            <path d="M10,25 C15,10 35,10 45,20 C50,5 75,5 85,20 C90,15 95,20 95,25 C95,30 85,35 75,30 C70,35 55,35 50,30 C45,35 30,35 25,30 C15,35 5,30 5,25 C5,20 8,15 10,25 Z" />
          </svg>
        </div>
        
        <div
          className={`absolute bottom-48 sm:bottom-56 right-10 sm:right-20 transition-all duration-1000 delay-400 transform ${areCloudsVisible ? 'opacity-30 translate-x-0' : 'opacity-0 translate-x-10'}`}
          style={{ 
            animation: areCloudsVisible ? 'float-x-reverse 8s infinite alternate ease-in-out' : 'none',
            animationDelay: '2.2s'
          }}
        >
          <svg width="45" height="16" viewBox="0 0 90 35" className="sm:w-16 sm:h-6 md:w-20 md:h-8" fill="#283467">
            <path d="M10,25 C15,10 35,10 40,20 C45,5 70,5 75,20 C80,15 85,20 85,25 C85,30 75,35 65,30 C60,35 50,35 45,30 C40,35 30,35 25,30 C15,35 5,30 5,25 C5,20 8,15 10,25 Z" />
          </svg>
        </div>
        
        <div
          className={`absolute bottom-40 sm:bottom-48 right-24 sm:right-44 transition-all duration-1000 delay-500 transform ${areCloudsVisible ? 'opacity-30 translate-x-0' : 'opacity-0 translate-x-10'}`}
          style={{ 
            animation: areCloudsVisible ? 'float-x-reverse 8s infinite alternate ease-in-out' : 'none',
            animationDelay: '3s'
          }}
        >
          <svg width="35" height="15" viewBox="0 0 70 30" className="sm:w-14 sm:h-6" fill="#283467">
            <path d="M10,20 C15,5 30,5 35,15 C40,5 55,5 60,15 C65,10 68,15 65,20 C60,25 50,25 45,20 C40,25 30,25 25,20 C20,25 15,25 10,20 Z" />
          </svg>
        </div>
        
        {/* Star elements - responsive and scroll-triggered */}
        <div
          className={`absolute top-32 sm:top-40 left-24 sm:left-44 transition-all duration-1000 transform ${areStarsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ 
            animation: areStarsVisible ? 'twinkle 3s infinite ease-in-out' : 'none'
          }}
        >
          <svg width="8" height="8" viewBox="0 0 16 16" className="sm:w-3 sm:h-3">
            <path d="M8 0L9.8 5.4L16 5.4L10.9 8.8L12.8 14.2L8 10.8L3.2 14.2L5.1 8.8L0 5.4L6.2 5.4L8 0Z" fill="#4ADE80" />
          </svg>
        </div>
        
        <div
          className={`absolute top-40 sm:top-52 right-20 sm:right-28 transition-all duration-1000 delay-200 transform ${areStarsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ 
            animation: areStarsVisible ? 'twinkle 3s infinite ease-in-out' : 'none',
            animationDelay: '1.5s'
          }}
        >
          <svg width="6" height="6" viewBox="0 0 16 16" className="sm:w-2.5 sm:h-2.5">
            <path d="M8 0L9.8 5.4L16 5.4L10.9 8.8L12.8 14.2L8 10.8L3.2 14.2L5.1 8.8L0 5.4L6.2 5.4L8 0Z" fill="#3B82F6" />
          </svg>
        </div>
        
        <div
          className={`absolute bottom-48 sm:bottom-60 left-14 sm:left-20 transition-all duration-1000 delay-300 transform ${areStarsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ 
            animation: areStarsVisible ? 'twinkle 3s infinite ease-in-out' : 'none',
            animationDelay: '0.8s'
          }}
        >
          <svg width="5" height="5" viewBox="0 0 16 16" className="sm:w-2 sm:h-2">
            <path d="M8 0L9.8 5.4L16 5.4L10.9 8.8L12.8 14.2L8 10.8L3.2 14.2L5.1 8.8L0 5.4L6.2 5.4L8 0Z" fill="#A855F7" />
          </svg>
        </div>
        
        <div
          className={`absolute bottom-40 sm:bottom-52 right-28 sm:right-60 transition-all duration-1000 delay-400 transform ${areStarsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ 
            animation: areStarsVisible ? 'twinkle 3s infinite ease-in-out' : 'none',
            animationDelay: '2.2s'
          }}
        >
          <svg width="7" height="7" viewBox="0 0 16 16" className="sm:w-3 sm:h-3">
            <path d="M8 0L9.8 5.4L16 5.4L10.9 8.8L12.8 14.2L8 10.8L3.2 14.2L5.1 8.8L0 5.4L6.2 5.4L8 0Z" fill="#3B82F6" />
          </svg>
        </div>
        
        {/* Mountains/Waves at the bottom - responsive sizes */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full">
            <path
              fill="#2c2d5a"
              fillOpacity="1"
              d="M0,192L60,202.7C120,213,240,235,360,229.3C480,224,600,192,720,192C840,192,960,224,1080,229.3C1200,235,1320,213,1380,202.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Additional wave layer with different color */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full">
            <path
              fill="#1e1b4b"
              fillOpacity="0.8"
              d="M0,96L60,117.3C120,139,240,181,360,181.3C480,181,600,139,720,133.3C840,128,960,160,1080,170.7C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Cloud outlines at the bottom - responsive sizes */}
        <div className="absolute bottom-8 sm:bottom-10 right-8 sm:right-14">
          <svg width="50" height="25" viewBox="0 0 100 50" className="sm:w-18 sm:h-9 md:w-22 md:h-11" fill="none" stroke="#8B5CF6" strokeWidth="1" opacity="0.4">
            <path d="M10,30 C15,10 35,10 40,20 C45,5 75,5 80,20 C85,10 95,15 95,25 C95,35 85,40 75,38 C70,45 55,45 50,38 C45,45 30,45 25,38 C15,40 5,35 5,25 C5,20 8,15 10,30 Z" />
          </svg>
        </div>
        
        <div className="absolute bottom-12 sm:bottom-16 right-20 sm:right-36">
          <svg width="40" height="16" viewBox="0 0 80 30" className="sm:w-16 sm:h-6" fill="none" stroke="#8B5CF6" strokeWidth="1" opacity="0.3">
            <path d="M10,20 C15,5 35,5 40,15 C45,5 65,5 70,15 C75,10 78,15 75,20 C70,25 55,25 50,20 C45,25 30,25 25,20 C20,25 15,25 10,20 Z" />
          </svg>
        </div>
        
        {/* Content container with scroll-triggered animations */}
        <div ref={contentRef} className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center text-center px-6 sm:px-8">
          <h1 
            ref={titleRef}
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 sm:mb-6 transition-all duration-700 transform ${isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {t('community.heading')}
          </h1>
                  
          <p 
            ref={descriptionRef}
            className={`text-gray-300 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg transition-all duration-700 delay-200 transform ${isDescriptionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {t('community.description')}
          </p>
                  
          <div 
            ref={buttonRef}
            className={`transition-all duration-700 delay-400 transform ${isButtonVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}
          >
            <button 
              className="bg-transparent hover:bg-opacity-20 hover:bg-purple-800 text-white font-medium py-3 sm:py-3.5 px-8 sm:px-10 rounded-full border border-purple-500 transition duration-300 hover:scale-105 active:scale-95 text-base sm:text-lg"
            >
              {t('community.button')}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal line OUTSIDE the content container */}
<div ref={lineRef} className="w-full max-w-6xl mt-24 sm:mt-28 md:mt-32 mb-8 sm:mb-10 md:mb-12">
  <div 
    className={`w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent relative transition-all duration-1000 transform ${isHorizontalLineVisible ? 'opacity-60 scale-x-100' : 'opacity-0 scale-x-0'}`}
  >
    {/* Add subtle glow to the line */}
    <div className="absolute inset-0 blur-sm bg-purple-400 opacity-50"></div>
  </div>
</div>
      
      {/* Add global keyframe animations */}
      <style jsx>{`
        @keyframes float-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }
        
        @keyframes float-x-reverse {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-10px);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default CommunityJoin;