import React, { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import tokenLogo from '../../assets/token.png';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const WZCToken = () => {
  const { t } = useTranslation(); // Use translation hook
  
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const futureSectionRef = useRef(null);
  const lineRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isFirstSectionVisible, setIsFirstSectionVisible] = useState(false);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);
  const [areCardsVisible, setAreCardsVisible] = useState([false, false, false]);
  const [isFutureSectionVisible, setIsFutureSectionVisible] = useState(false);
  const [isHorizontalLineVisible, setIsHorizontalLineVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

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
    
    if (firstSectionRef.current && !isFirstSectionVisible && isInViewport(firstSectionRef.current)) {
      setIsFirstSectionVisible(true);
    }
    
    if (secondSectionRef.current && !isSecondSectionVisible && isInViewport(secondSectionRef.current)) {
      setIsSecondSectionVisible(true);
    }
    
    if (card1Ref.current && !areCardsVisible[0] && isInViewport(card1Ref.current)) {
      setAreCardsVisible(prev => [true, prev[1], prev[2]]);
    }
    
    if (card2Ref.current && !areCardsVisible[1] && isInViewport(card2Ref.current)) {
      setAreCardsVisible(prev => [prev[0], true, prev[2]]);
    }
    
    if (card3Ref.current && !areCardsVisible[2] && isInViewport(card3Ref.current)) {
      setAreCardsVisible(prev => [prev[0], prev[1], true]);
    }
    
    if (futureSectionRef.current && !isFutureSectionVisible && isInViewport(futureSectionRef.current)) {
      setIsFutureSectionVisible(true);
    }
    
    if (lineRef.current && !isHorizontalLineVisible && isInViewport(lineRef.current)) {
      setIsHorizontalLineVisible(true);
    }
    
    if (buttonRef.current && !isButtonVisible && isInViewport(buttonRef.current)) {
      setIsButtonVisible(true);
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
    <div ref={sectionRef} className="bg-black text-white w-full mt-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div 
        className={`absolute top-1/4 left-1/4 w-24 sm:w-32 md:w-48 lg:w-64 h-24 sm:h-32 md:h-48 lg:h-64 bg-purple-700 opacity-0 rounded-full blur-3xl transition-all duration-1500 ease-in-out ${isVisible ? 'opacity-10' : ''}`}
        style={{ 
          animation: isVisible ? 'pulse 8s infinite alternate ease-in-out' : 'none'
        }}
      ></div>
      <div 
        className={`absolute bottom-1/3 right-1/4 w-32 sm:w-40 md:w-56 lg:w-72 h-32 sm:h-40 md:h-56 lg:h-72 bg-purple-600 opacity-0 rounded-full blur-3xl transition-all duration-1500 ease-in-out ${isVisible ? 'opacity-10' : ''}`}
        style={{ 
          animation: isVisible ? 'pulse 12s infinite alternate-reverse ease-in-out' : 'none',
          animationDelay: '1s'
        }}
      ></div>
      
      {/* First section - Token intro with logo */}
      <div 
        ref={firstSectionRef}
        className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 flex flex-col md:flex-row items-center justify-between"
      >
        {/* Left side - Text content */}
        <div className={`md:w-3/5 mb-8 sm:mb-10 md:mb-0 md:pr-6 lg:pr-10 transition-all duration-700 transform ${isFirstSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            {t('token.heading')}
          </h1>
          
          <p className="text-base sm:text-lg leading-relaxed text-gray-200 mb-6">
            {t('token.description')}
          </p>
        </div>
        
        {/* Right side - Token logo image with animation */}
        <div className={`md:w-2/5 flex justify-center md:justify-end md:pl-6 lg:pl-10 transition-all duration-700 delay-300 transform ${isFirstSectionVisible ? 'translate-x-0 opacity-100 rotate-0' : 'translate-x-10 opacity-0 rotate-12'}`}>
          <img 
            src={tokenLogo} 
            alt={t('token.logoAlt')} 
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
            style={{
              animation: isFirstSectionVisible ? 'float 6s infinite ease-in-out' : 'none'
            }}
          />
        </div>
      </div>

      {/* Spacer between sections */}
      <div className="py-8 sm:py-10 md:py-12"></div>

      {/* Second section - Why choose WZC */}
      <div 
        ref={secondSectionRef}
        className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12"
      >
        {/* Section title with animation */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-700 transform ${isSecondSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {t('token.whyChoose')}
        </h2>
        
        {/* Three features in cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-12">
          {/* Card 1 */}
          <div 
            ref={card1Ref}
            className={`p-6 rounded-lg bg-gray-900 border border-purple-600 flex flex-col items-center h-full min-h-[200px] transition-all duration-700 transform ${areCardsVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
            style={{
              boxShadow: areCardsVisible[0] ? '0 0 15px rgba(147, 51, 234, 0.2)' : 'none',
              transition: 'all 0.7s ease, box-shadow 1.5s ease'
            }}
          >
            {/* Card glow effect */}
            <div 
              className={`absolute -top-10 -left-10 w-24 h-24 bg-purple-700 opacity-0 rounded-full blur-xl transition-all duration-1000 ${areCardsVisible[0] ? 'opacity-10' : ''}`}
              style={{ 
                animation: areCardsVisible[0] ? 'float 8s infinite alternate ease-in-out' : 'none'
              }}
            ></div>
            
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4">{t('token.card1.title')}</h3>
            <p className="text-center text-gray-300 text-sm sm:text-base px-4">
              {t('token.card1.description')}
            </p>
          </div>
          
          {/* Card 2 */}
          <div 
            ref={card2Ref}
            className={`p-6 rounded-lg bg-gray-900 border border-purple-600 flex flex-col items-center h-full min-h-[200px] transition-all duration-700 delay-200 transform ${areCardsVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
            style={{
              boxShadow: areCardsVisible[1] ? '0 0 15px rgba(147, 51, 234, 0.2)' : 'none',
              transition: 'all 0.7s ease, box-shadow 1.5s ease' 
            }}
          >
            {/* Card glow effect */}
            <div 
              className={`absolute -top-10 -right-10 w-24 h-24 bg-purple-700 opacity-0 rounded-full blur-xl transition-all duration-1000 ${areCardsVisible[1] ? 'opacity-10' : ''}`}
              style={{ 
                animation: areCardsVisible[1] ? 'float 9s infinite alternate-reverse ease-in-out' : 'none'
              }}
            ></div>
            
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4">{t('token.card2.title')}</h3>
            <p className="text-center text-gray-300 text-sm sm:text-base px-4">
              {t('token.card2.description')}
            </p>
          </div>
          
          {/* Card 3 */}
          <div 
            ref={card3Ref}
            className={`p-6 rounded-lg bg-gray-900 border border-purple-600 flex flex-col items-center h-full min-h-[200px] transition-all duration-700 delay-400 transform ${areCardsVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'} sm:col-span-2 lg:col-span-1`}
            style={{
              boxShadow: areCardsVisible[2] ? '0 0 15px rgba(147, 51, 234, 0.2)' : 'none',
              transition: 'all 0.7s ease, box-shadow 1.5s ease'
            }}
          >
            {/* Card glow effect */}
            <div 
              className={`absolute -bottom-10 -right-10 w-24 h-24 bg-purple-700 opacity-0 rounded-full blur-xl transition-all duration-1000 ${areCardsVisible[2] ? 'opacity-10' : ''}`}
              style={{ 
                animation: areCardsVisible[2] ? 'float 7s infinite alternate ease-in-out' : 'none'
              }}
            ></div>
            
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4">{t('token.card3.title')}</h3>
            <p className="text-center text-gray-300 text-sm sm:text-base px-4">
              {t('token.card3.description')}
            </p>
          </div>
        </div>
        
        {/* Spacer between cards and future section */}
        <div className="py-8 sm:py-10 md:py-12"></div>
        
        {/* Future section */}
        <div 
          ref={futureSectionRef}
          className="mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 mx-4 sm:mx-6 md:mx-8"
        >
          <div className={`flex items-center mb-6 transition-all duration-700 transform ${isFutureSectionVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <Globe 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-4 text-blue-400" 
              strokeWidth={1.5}
              style={{
                animation: isFutureSectionVisible ? 'spin 10s linear infinite' : 'none'
              }}
            />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{t('token.future.title')}</h3>
          </div>
          
          <p className={`text-base sm:text-lg mb-6 pl-12 sm:pl-14 pr-4 sm:pr-6 transition-all duration-700 delay-200 transform ${isFutureSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {t('token.future.description')}
          </p>
          
          <p className={`text-base sm:text-lg mb-8 flex items-center pl-12 sm:pl-14 pr-4 sm:pr-6 transition-all duration-700 delay-400 transform ${isFutureSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="mr-3 text-xl sm:text-2xl">👉</span> {t('token.future.callToAction')}
          </p>
          
          {/* Updated Button from Advertisement Component */}
          <div 
            ref={buttonRef}
            className={`flex justify-center transition-all duration-700 delay-600 transform ${isButtonVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          >
            <button 
              className="bg-transparent text-white px-4 sm:px-5 py-2 rounded-full border border-purple-500 hover:bg-purple-900/20 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
              style={{
                boxShadow: isButtonVisible ? '0 0 15px rgba(168, 85, 247, 0.1)' : 'none',
                transition: 'all 0.3s ease-out, box-shadow 1.5s ease'
              }}
            >
              {t('token.button')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Horizontal Line - Enhanced with responsive styling */}
      <div ref={lineRef} className="relative w-full mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6 md:mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div 
            className={`w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent relative transition-all duration-1000 transform ${isHorizontalLineVisible ? 'opacity-60 scale-x-100' : 'opacity-0 scale-x-0'}`}
          >
            {/* Add subtle glow to the line */}
            <div className="absolute inset-0 blur-sm bg-purple-400 opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Add global keyframe animations */}
      <style jsx>{`
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
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.2;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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

export default WZCToken;