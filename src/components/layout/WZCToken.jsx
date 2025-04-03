// WZCToken.jsx (continued)
import React, { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import tokenLogo from '../../assets/token.png';

const WZCToken = () => {
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const futureSectionRef = useRef(null);
  const lineRef = useRef(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isFirstSectionVisible, setIsFirstSectionVisible] = useState(false);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);
  const [areCardsVisible, setAreCardsVisible] = useState([false, false, false]);
  const [isFutureSectionVisible, setIsFutureSectionVisible] = useState(false);
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
    <div ref={sectionRef} className="bg-black text-white w-full mt-2 sm:mt-3 md:mt-4 relative overflow-hidden">
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
        className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-7 md:py-8 flex flex-col md:flex-row items-center justify-between"
      >
        {/* Left side - Text content */}
        <div className={`md:w-3/5 mb-5 sm:mb-6 md:mb-0 md:pr-4 lg:pr-6 transition-all duration-700 transform ${isFirstSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Le Token WZC - Une crypto du futur pour les entrepreneurs
          </h1>
          
          <p className="text-sm sm:text-base leading-relaxed text-gray-200">
            WZC n'est pas seulement un jeton, c'est une opportunité pour les entrepreneurs de 
            se positionner dès aujourd'hui dans l'écosystème numérique de demain. En tant 
            que crypto-monnaie de la plateforme BizzWiz, le token WZC offre des avantages 
            exclusifs aux utilisateurs, tout en ayant un potentiel de croissance dans l'univers de 
            la blockchain et des cryptos.
          </p>
        </div>
        
        {/* Right side - Token logo image with animation */}
        <div className={`md:w-2/5 flex justify-center md:justify-end md:pl-4 lg:pl-6 transition-all duration-700 delay-300 transform ${isFirstSectionVisible ? 'translate-x-0 opacity-100 rotate-0' : 'translate-x-10 opacity-0 rotate-12'}`}>
          <img 
            src={tokenLogo} 
            alt="WZC Token Logo" 
            className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain"
            style={{
              animation: isFirstSectionVisible ? 'float 6s infinite ease-in-out' : 'none'
            }}
          />
        </div>
      </div>

      {/* Second section - Why choose WZC */}
      <div 
        ref={secondSectionRef}
        className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-7 md:py-8"
      >
        {/* Section title with animation */}
        <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-center mb-5 sm:mb-6 md:mb-8 transition-all duration-700 transform ${isSecondSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Pourquoi choisir WZC ?
        </h2>
        
        {/* Three features in cards - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div 
            ref={card1Ref}
            className={`p-4 rounded-lg bg-gray-900 border border-purple-600 flex flex-col items-center h-full min-h-[160px] sm:min-h-[180px] transition-all duration-700 transform ${areCardsVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
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
            
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-center mb-3">Offres et Réductions Exclusives</h3>
            <p className="text-center text-gray-300 text-xs sm:text-sm px-2">
              Utilisez le token WZC pour bénéficier de réductions sur nos services et d'offres spéciales réservées à nos membres.
            </p>
          </div>
          
          {/* Card 2 */}
          <div 
            ref={card2Ref}
            className={`p-4 rounded-lg bg-gray-900 border border-purple-600 flex flex-col items-center h-full min-h-[160px] sm:min-h-[180px] transition-all duration-700 delay-200 transform ${areCardsVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
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
            
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-center mb-3">Accès à des fonctionnalités premium</h3>
            <p className="text-center text-gray-300 text-xs sm:text-sm px-2">
              Le token vous permet d'accéder à des outils et des fonctionnalités avancées sur notre plateforme pour faire croître votre entreprise.
            </p>
          </div>
          
          {/* Card 3 */}
          <div 
            ref={card3Ref}
            className={`p-4 rounded-lg bg-gray-900 border border-purple-600 flex flex-col items-center h-full min-h-[160px] sm:min-h-[180px] transition-all duration-700 delay-400 transform ${areCardsVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'} sm:col-span-2 lg:col-span-1`}
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
            
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-center mb-3">Participez à l'avenir de la crypto</h3>
            <p className="text-center text-gray-300 text-xs sm:text-sm px-2">
              Investissez dans le token WZC et faites partie de notre projet ambitieux qui vise à révolutionner l'univers numérique et les petites entreprises.
            </p>
          </div>
        </div>
        
        {/* Future section - Responsive layout */}
        <div 
          ref={futureSectionRef}
          className="mt-6 sm:mt-7 md:mt-8 mb-5 sm:mb-6 mx-0 sm:mx-2 md:mx-4 lg:mx-6"
        >
          <div className={`flex items-center mb-3 sm:mb-4 transition-all duration-700 transform ${isFutureSectionVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            {/* Using Globe icon from lucide-react with responsive sizing */}
            <Globe 
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 mr-3 text-blue-400" 
              strokeWidth={1.5}
              style={{
                animation: isFutureSectionVisible ? 'spin 10s linear infinite' : 'none'
              }}
            />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Le WZC, une crypto qui a de l'avenir</h3>
          </div>
          
          <p className={`text-sm sm:text-base mb-3 sm:mb-4 pl-10 sm:pl-11 pr-2 sm:pr-3 transition-all duration-700 delay-200 transform ${isFutureSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            BizzWiz investit dans l'innovation blockchain pour que le token WZC devienne un acteur clé dans l'écosystème numérique.
          </p>
          
          <p className={`text-sm sm:text-base mb-5 sm:mb-6 flex items-center pl-10 sm:pl-11 pr-2 sm:pr-3 transition-all duration-700 delay-400 transform ${isFutureSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="mr-2 text-base sm:text-lg md:text-xl">👉</span> Ne laissez pas passer cette chance de vous préparer à l'avenir. Commencez dès aujourd'hui avec WZC !
          </p>
          
          <div className={`flex justify-center transition-all duration-700 delay-600 transform ${isFutureSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button 
              className="bg-transparent text-white px-4 sm:px-5 py-2 rounded-full border-2 border-purple-500 hover:bg-purple-900 transition-all duration-300 text-xs sm:text-sm"
              style={{
                boxShadow: isFutureSectionVisible ? '0 0 10px rgba(168, 85, 247, 0.5)' : 'none',
                animation: isFutureSectionVisible ? 'pulse 2s infinite' : 'none'
              }}
            >
              En savoir +
            </button>
          </div>
        </div>
      </div>
      
      {/* Horizontal Line */}
      <div ref={lineRef} className="relative px-4 sm:px-5 md:px-6 mt-6 sm:mt-7 md:mt-8 mb-5 sm:mb-6">
        <div 
          className={`w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent relative transition-all duration-1000 transform ${isHorizontalLineVisible ? 'opacity-60 scale-x-100' : 'opacity-0 scale-x-0'}`}
        >
          {/* Add subtle glow to the line */}
          <div className="absolute inset-0 blur-sm bg-purple-400 opacity-50"></div>
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
            box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.7);
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
      `}</style>
    </div>
  );
};

export default WZCToken;