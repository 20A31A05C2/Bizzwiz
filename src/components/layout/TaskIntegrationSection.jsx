import React, { useState, useEffect, useRef } from 'react';
import integrationIcons from '../../assets/task.png';
import { useTranslation } from 'react-i18next'; // Import translation hook

const TaskIntegrationSection = () => {
  const { t } = useTranslation(); // Use translation hook
  
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const lineRef = useRef(null);
  const leftDotsRef = useRef(null);
  const rightDotsRef = useRef(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [isText1Visible, setIsText1Visible] = useState(false);
  const [isText2Visible, setIsText2Visible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isHorizontalLineVisible, setIsHorizontalLineVisible] = useState(false);
  const [areLeftDotsVisible, setAreLeftDotsVisible] = useState(false);
  const [areRightDotsVisible, setAreRightDotsVisible] = useState(false);
  
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
    
    if (labelRef.current && !isLabelVisible && isInViewport(labelRef.current)) {
      setIsLabelVisible(true);
    }
    
    if (headingRef.current && !isHeadingVisible && isInViewport(headingRef.current)) {
      setIsHeadingVisible(true);
    }
    
    if (text1Ref.current && !isText1Visible && isInViewport(text1Ref.current)) {
      setIsText1Visible(true);
    }
    
    if (text2Ref.current && !isText2Visible && isInViewport(text2Ref.current)) {
      setIsText2Visible(true);
    }
    
    if (buttonRef.current && !isButtonVisible && isInViewport(buttonRef.current)) {
      setIsButtonVisible(true);
    }
    
    if (imageRef.current && !isImageVisible && isInViewport(imageRef.current)) {
      setIsImageVisible(true);
    }
    
    if (lineRef.current && !isHorizontalLineVisible && isInViewport(lineRef.current)) {
      setIsHorizontalLineVisible(true);
    }
    
    if (leftDotsRef.current && !areLeftDotsVisible && isInViewport(leftDotsRef.current)) {
      setAreLeftDotsVisible(true);
    }
    
    if (rightDotsRef.current && !areRightDotsVisible && isInViewport(rightDotsRef.current)) {
      setAreRightDotsVisible(true);
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

  // Create a dot component for reuse
  const Dot = ({ style, visible, index, total }) => {
    const staggerDelay = index * 0.01; // Small stagger for each dot
    const rowDelay = Math.floor(index / 6) * 0.05; // Additional delay for each row
    const delay = staggerDelay + rowDelay;
    
    return (
      <div
        className="w-1 h-1 rounded-full bg-purple-900 opacity-0"
        style={{
          ...style,
          transition: `opacity 0.5s ease-out ${delay}s`,
          opacity: visible ? 0.4 : 0,
          animation: visible ? `pulseOpacity 3s infinite alternate ease-in-out ${delay + 1}s` : 'none'
        }}
      ></div>
    );
  };

  return (
    <div 
      ref={sectionRef} 
      className="w-full bg-black text-white py-6 sm:py-8 md:py-10 lg:py-12 relative overflow-hidden"
    >
      {/* Left side dot pattern - improved responsive visibility */}
      <div 
        ref={leftDotsRef}
        className="absolute left-0 top-16 h-full w-12 sm:w-16 md:w-20 lg:w-24 hidden sm:block"
      >
        {/* Create 6 columns of dots with responsive spacing */}
        {[...Array(6)].map((_, colIndex) => (
          <div 
            key={`col-${colIndex}`} 
            className="absolute h-full" 
            style={{ left: `${colIndex * 6 + 4}px` }}
          >
            {/* Create dots in each column with consistent spacing */}
            {[...Array(14)].map((_, rowIndex) => {
              const dotIndex = colIndex * 14 + rowIndex;
              return (
                <Dot
                  key={`dot-${colIndex}-${rowIndex}`}
                  style={{
                    position: 'absolute',
                    top: `${rowIndex * 16 + 20}px`
                  }}
                  visible={areLeftDotsVisible}
                  index={dotIndex}
                  total={6 * 14}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Right-bottom dot pattern - improved responsive visibility */}
      <div 
        ref={rightDotsRef}
        className="absolute right-0 bottom-16 h-40 sm:h-44 md:h-48 lg:h-52 w-16 sm:w-20 md:w-24 lg:w-28 hidden sm:block"
      >
        {/* Create 6 columns of dots with responsive spacing */}
        {[...Array(6)].map((_, colIndex) => (
          <div 
            key={`rcol-${colIndex}`} 
            className="absolute h-full" 
            style={{ right: `${colIndex * 6 + 6}px` }}
          >
            {/* Create dots in each column with consistent spacing */}
            {[...Array(10)].map((_, rowIndex) => {
              const dotIndex = colIndex * 10 + rowIndex;
              return (
                <Dot
                  key={`rdot-${colIndex}-${rowIndex}`}
                  style={{
                    position: 'absolute',
                    bottom: `${rowIndex * 16 + 20}px`
                  }}
                  visible={areRightDotsVisible}
                  index={dotIndex}
                  total={6 * 10}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Main content container with improved responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Left content - improved spacing */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-4 lg:pr-8">
          <div
            ref={labelRef}
            className={`uppercase text-blue-400 text-xs sm:text-sm font-medium tracking-wider mb-3 sm:mb-4 transition-all duration-700 transform ${isLabelVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {t('task.label')}
          </div>
          
          <h2
            ref={headingRef}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 transition-all duration-700 delay-100 transform ${isHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {t('task.heading')}
          </h2>
          
          <p
            ref={text1Ref}
            className={`text-gray-400 text-sm sm:text-base md:text-lg mb-2 sm:mb-3 transition-all duration-700 delay-200 transform ${isText1Visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {t('task.text1')}
          </p>
          
          <p
            ref={text2Ref}
            className={`text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 transition-all duration-700 delay-300 transform ${isText2Visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {t('task.text2')}
          </p>
          
          <div
            ref={buttonRef}
            className={`transition-all duration-700 delay-400 transform ${isButtonVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <a
              href="#"
              className="inline-block bg-transparent text-white border border-purple-600 rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:bg-purple-900/20 hover:scale-105 active:scale-95"
            >
              {t('task.button')}
            </a>
          </div>
        </div>

        {/* Right content - Integration Icons with improved responsive sizing */}
        <div
          ref={imageRef}
          className={`w-full md:w-1/2 relative transition-all duration-700 delay-300 transform ${isImageVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'}`}
        >
          <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 px-4 sm:px-6 md:px-0">
            <img
              src={integrationIcons}
              alt={t('task.imageAlt')}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      
      {/* Horizontal Line - Updated with the styling from Advertisement component */}
      <div ref={lineRef} className="w-full max-w-6xl mx-auto relative mt-24 sm:mt-28 md:mt-32 mb-2 sm:mb-3 md:mb-4 flex justify-center items-center">
        <div 
          className={`w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent relative transition-all duration-1000 transform ${isHorizontalLineVisible ? 'opacity-60 scale-x-100' : 'opacity-0 scale-x-0'}`}
        >
          {/* Add subtle glow to the line */}
          <div className="absolute inset-0 blur-sm bg-purple-400 opacity-50"></div>
        </div>
      </div>

      {/* Add global keyframe animations */}
      <style jsx>{`
        @keyframes pulseOpacity {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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
        
        @keyframes glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskIntegrationSection;