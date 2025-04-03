import React, { useState, useEffect, useRef } from 'react';
import icon1 from '../../assets/icon1.png';
import icon2 from '../../assets/icon2.png';
import icon3 from '../../assets/icon3.png';
import code from '../../assets/code.png';

const KeyAdvantagesSection = () => {
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const lineRef = useRef(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isFirstCardVisible, setIsFirstCardVisible] = useState(false);
  const [isSecondCardVisible, setIsSecondCardVisible] = useState(false);
  const [isBottomCardVisible, setIsBottomCardVisible] = useState(false);
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
    
    if (card1Ref.current && !isFirstCardVisible && isInViewport(card1Ref.current)) {
      setIsFirstCardVisible(true);
    }
    
    if (card2Ref.current && !isSecondCardVisible && isInViewport(card2Ref.current)) {
      setIsSecondCardVisible(true);
    }
    
    if (card3Ref.current && !isBottomCardVisible && isInViewport(card3Ref.current)) {
      setIsBottomCardVisible(true);
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
    <div ref={sectionRef} className="w-full py-8 md:py-16 lg:py-20 bg-black relative overflow-hidden">
      {/* Background highlight effects with animation */}
      <div 
        className={`absolute top-1/4 left-1/4 w-24 sm:w-32 md:w-48 lg:w-64 h-24 sm:h-32 md:h-48 lg:h-64 bg-purple-700 opacity-0 rounded-full blur-3xl transition-all duration-1500 ease-in-out ${isVisible ? 'opacity-10' : ''}`}
        style={{ 
          animation: isVisible ? 'pulse 8s infinite alternate ease-in-out' : 'none'
        }}
      ></div>
      <div 
        className={`absolute top-1/2 right-1/4 w-32 sm:w-40 md:w-64 lg:w-96 h-32 sm:h-40 md:h-64 lg:h-96 bg-purple-600 opacity-0 rounded-full blur-3xl transition-all duration-1500 ease-in-out ${isVisible ? 'opacity-10' : ''}`}
        style={{ 
          animation: isVisible ? 'pulse 12s infinite alternate-reverse ease-in-out' : 'none',
          animationDelay: '1s'
        }}
      ></div>
      <div 
        className={`absolute bottom-1/4 left-1/3 w-28 sm:w-36 md:w-56 lg:w-72 h-28 sm:h-36 md:h-56 lg:h-72 bg-pink-600 opacity-0 rounded-full blur-3xl transition-all duration-1500 ease-in-out ${isVisible ? 'opacity-10' : ''}`}
        style={{ 
          animation: isVisible ? 'pulse 10s infinite alternate ease-in-out' : 'none',
          animationDelay: '2s'
        }}
      ></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Title with animation */}
        <div 
          ref={titleRef}
          className={`text-center mb-6 md:mb-10 lg:mb-16 transition-all duration-700 transform ${isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-500 mt-8 sm:mt-10 md:mt-10 mb-3 md:mb-4 lg:mb-6">
            LES AVANTAGES CLÉS
          </h2>
          <div className={`w-0 h-1 bg-purple-500 mx-auto transition-all duration-1000 delay-300 ${isTitleVisible ? 'w-12 sm:w-16' : ''}`}></div>
        </div>
        
        {/* Top Row - Two Cards with staggered animations and responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mb-6 sm:mb-8 lg:mb-10">
          {/* Advantage 1 */}
          <div 
            ref={card1Ref}
            className={`advantage-card bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 border border-gray-800 relative overflow-hidden w-full h-auto sm:h-[220px] md:h-[240px] lg:h-[280px] transition-all duration-700 transform ${isFirstCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
            style={{ 
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)"
            }}
          >
            {/* Inner glow effect with animation */}
            <div 
              className={`absolute -top-10 -left-10 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-purple-700 opacity-0 rounded-full blur-xl transition-all duration-1000 ${isFirstCardVisible ? 'opacity-20' : ''}`}
              style={{ 
                animation: isFirstCardVisible ? 'float 8s infinite alternate ease-in-out' : 'none'
              }}
            ></div>
            
            <div className="flex flex-col items-start relative z-10">
              <div 
                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-700 rounded-lg flex items-center justify-center mb-3 md:mb-4 relative transition-all duration-500 delay-200 transform ${isFirstCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{ 
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.15), 0 0 20px rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* Icon glow with pulse animation */}
                <div 
                  className="absolute inset-0 bg-purple-500 opacity-30 rounded-lg blur-sm"
                  style={{ 
                    animation: isFirstCardVisible ? 'glow 2s infinite alternate ease-in-out' : 'none'
                  }}
                ></div>
                <img src={icon1} alt="Business creation icon" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 relative z-10" />
              </div>
              <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white mb-2 md:mb-3 transition-all duration-500 delay-300 transform ${isFirstCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                Création d'entreprise assistée par IA
              </h3>
              <a 
                href="#" 
                className={`text-xs sm:text-sm md:text-base text-gray-400 hover:text-purple-400 border-b border-transparent hover:border-purple-400 transition-all duration-500 delay-400 transform ${isFirstCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              >
                Voir l'offre
              </a>
            </div>
          </div>
          
          {/* Advantage 2 */}
          <div 
            ref={card2Ref}
            className={`advantage-card bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 border border-gray-800 relative overflow-hidden w-full h-auto sm:h-[220px] md:h-[240px] lg:h-[280px] transition-all duration-700 transform ${isSecondCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
            style={{ 
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)"
            }}
          >
            {/* Inner glow effect with animation */}
            <div 
              className={`absolute -top-10 -right-10 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-purple-700 opacity-0 rounded-full blur-xl transition-all duration-1000 ${isSecondCardVisible ? 'opacity-20' : ''}`}
              style={{ 
                animation: isSecondCardVisible ? 'float 7s infinite alternate-reverse ease-in-out' : 'none'
              }}
            ></div>
            
            <div className="flex flex-col items-start relative z-10">
              <div 
                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-700 rounded-lg flex items-center justify-center mb-3 md:mb-4 relative transition-all duration-500 delay-200 transform ${isSecondCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{ 
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.15), 0 0 20px rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* Icon glow with pulse animation */}
                <div 
                  className="absolute inset-0 bg-purple-500 opacity-30 rounded-lg blur-sm"
                  style={{ 
                    animation: isSecondCardVisible ? 'glow 2.5s infinite alternate ease-in-out' : 'none'
                  }}
                ></div>
                <img src={icon2} alt="Web site icon" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 relative z-10" />
              </div>
              <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white mb-2 md:mb-3 transition-all duration-500 delay-300 transform ${isSecondCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                Site web prêt en 24 heures
              </h3>
              <a 
                href="#" 
                className={`text-xs sm:text-sm md:text-base text-gray-400 hover:text-purple-400 border-b border-transparent hover:border-purple-400 transition-all duration-500 delay-400 transform ${isSecondCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              >
                Voir l'offre
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Row - Wide Card with Tools and Code */}
        <div 
          ref={card3Ref}
          className={`advantage-card bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 border border-gray-800 relative overflow-hidden w-full h-auto md:h-[300px] lg:h-[360px] transition-all duration-700 transform ${isBottomCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
          style={{ 
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)"
          }}
        >
          {/* Inner glow effects with animation */}
          <div 
            className={`absolute -bottom-20 -left-10 w-28 sm:w-32 md:w-40 h-28 sm:h-32 md:h-40 bg-pink-600 opacity-0 rounded-full blur-xl transition-all duration-1000 ${isBottomCardVisible ? 'opacity-20' : ''}`}
            style={{ 
              animation: isBottomCardVisible ? 'float 9s infinite alternate ease-in-out' : 'none'
            }}
          ></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 h-full">
            {/* Advantage 3 */}
            <div className="flex flex-col items-start">
              <div 
                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 relative transition-all duration-500 delay-200 transform ${isBottomCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{ 
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.15), 0 0 20px rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* Icon glow with pulse animation */}
                <div 
                  className="absolute inset-0 bg-pink-400 opacity-30 rounded-lg blur-sm"
                  style={{ 
                    animation: isBottomCardVisible ? 'glow 3s infinite alternate ease-in-out' : 'none'
                  }}
                ></div>
                <img src={icon3} alt="Tools icon" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 relative z-10" />
              </div>
              <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white mb-2 md:mb-3 transition-all duration-500 delay-300 transform ${isBottomCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                Outils intelligents pour automatiser votre activité
              </h3>
              <a 
                href="#" 
                className={`text-xs sm:text-sm md:text-base text-gray-400 hover:text-purple-400 border-b border-transparent hover:border-purple-400 transition-all duration-500 delay-400 transform ${isBottomCardVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              >
                Voir l'offre
              </a>
            </div>
            
            {/* Code Example with shimmer animation - responsive height */}
            <div 
              className={`rounded-lg overflow-hidden h-44 sm:h-52 md:h-full flex items-center transition-all duration-700 delay-500 transform ${isBottomCardVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}
              style={{ 
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)"
              }}
            >
              <div className="w-full h-full relative">
                <div 
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 ${isBottomCardVisible ? 'shimmer-effect' : ''}`}
                  style={{ 
                    transform: 'skewX(-20deg)',
                  }}
                ></div>
                <img 
                  src={code}
                  alt="Code snippet showing addNumbersToToken function" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Horizontal Line at the end with animation */}
        <div ref={lineRef} className="relative mt-12 sm:mt-16 md:mt-20 mb-6 sm:mb-8 md:mb-10">
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
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
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
        
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) skewX(-20deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(150%) skewX(-20deg);
            opacity: 0;
          }
        }
        
        .shimmer-effect {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default KeyAdvantagesSection;