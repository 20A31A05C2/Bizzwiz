import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import template from '../../assets/template.png';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [animatedElements, setAnimatedElements] = useState({
    badge: false,
    heading1: false,
    heading2: false,
    description: false,
    button: false,
    dashboard: false
  });
  
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const heading1Ref = useRef(null);
  const heading2Ref = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const dashboardRef = useRef(null);
  
  // Check if element is in viewport
  const isInViewport = (element, offset = 100) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset) &&
      rect.bottom >= offset &&
      rect.left <= (window.innerWidth - offset) &&
      rect.right >= offset
    );
  };
  
  // Handle scroll events and check which elements are visible
  const handleScroll = () => {
    if (badgeRef.current && !animatedElements.badge && isInViewport(badgeRef.current)) {
      setAnimatedElements(prev => ({ ...prev, badge: true }));
    }
    if (heading1Ref.current && !animatedElements.heading1 && isInViewport(heading1Ref.current)) {
      setAnimatedElements(prev => ({ ...prev, heading1: true }));
    }
    if (heading2Ref.current && !animatedElements.heading2 && isInViewport(heading2Ref.current)) {
      setAnimatedElements(prev => ({ ...prev, heading2: true }));
    }
    if (descriptionRef.current && !animatedElements.description && isInViewport(descriptionRef.current)) {
      setAnimatedElements(prev => ({ ...prev, description: true }));
    }
    if (buttonRef.current && !animatedElements.button && isInViewport(buttonRef.current)) {
      setAnimatedElements(prev => ({ ...prev, button: true }));
    }
    if (dashboardRef.current && !animatedElements.dashboard && isInViewport(dashboardRef.current)) {
      setAnimatedElements(prev => ({ ...prev, dashboard: true }));
    }
  };
  
  useEffect(() => {
    // Initial check on mount
    setIsVisible(true);
    
    // Set badge to visible immediately on mobile
    setAnimatedElements(prev => ({ ...prev, badge: true }));
    
    setTimeout(() => {
      handleScroll();
    }, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="w-full overflow-hidden" ref={sectionRef}>
      {/* Dark blue-purple background with darker edges */}
      <div className="relative bg-[#120821] py-6 sm:py-8 md:py-12">
        {/* Darker edge vignette effect */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.8) 100%)',
            mixBlendMode: 'multiply'
          }}
        />
        
        {/* Purple glow effect in center */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(90, 24, 154, 0.5), transparent 70%)'
          }}
        />
        
        {/* Additional corner shadows for more depth */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{
            boxShadow: 'inset 0 0 120px 40px rgba(0, 0, 0, 0.8)'
          }}
        />
        
        {/* Header spacing - INCREASED for better mobile spacing */}
        <div className="h-10 xs:h-12 sm:h-14 md:h-16"></div>
        
        {/* Center badge with scroll animation - IMPROVED VISIBILITY */}
        <div 
          ref={badgeRef}
          className={`flex justify-center pt-4 xs:pt-5 md:pt-6 pb-5 xs:pb-6 md:pb-8 transition-all duration-700 transform
            ${animatedElements.badge ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="inline-flex items-center gap-2 xs:gap-3 bg-black rounded-full px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 border-2 border-[#6c2bd9]/50 hover:border-[#6c2bd9]/90 transition-all duration-300 shadow-lg shadow-[#6c2bd9]/30">
            <span className="text-black text-xs xs:text-sm font-bold bg-[#c729dc] px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full animate-pulse">NEW</span>
            <span className="text-[#a88bc7] text-xs xs:text-sm sm:text-base font-medium">BizzWiz - Boostez votre entreprise avec le numérique</span>
          </div>
        </div>
        
        {/* Main Content Section - improved padding and spacing */}
        <div className="relative z-10 px-4 xs:px-5 sm:px-6 mb-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading with scroll animations */}
            <h1>
              <div 
                ref={heading1Ref}
                className={`text-white text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 xs:mb-4 md:mb-5 transition-all duration-700 transform 
                  ${animatedElements.heading1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                Ne soyez plus spectateur du numérique,
              </div>
              {/* Gradient text with scroll animation */}
              <div 
                ref={heading2Ref}
                className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold transition-all duration-700 transform 
                  ${animatedElements.heading2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
                style={{
                  background: "linear-gradient(90deg, #00E5FF 0%, #33B8E5 35%, #6D95E0 70%, #8B80DA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: '200% 100%',
                  animation: animatedElements.heading2 ? 'gradientShift 5s ease infinite' : 'none'
                }}
              >
                intégrez-le pleinement !
              </div>
            </h1>
            
            {/* Description with scroll animation - INCREASED SPACING */}
            <p 
              ref={descriptionRef}
              className={`max-w-xl mx-auto mt-5 xs:mt-6 md:mt-8 mb-6 xs:mb-8 md:mb-10 text-white/80 text-sm xs:text-base md:text-lg transition-all duration-700 transform 
                ${animatedElements.description ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              Lancez votre entreprise et créez votre site web en quelques clics avec l'IA !🚀
            </p>
            
            {/* CTA Button with scroll animation */}
            <button
              ref={buttonRef}
              className={`px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 bg-white rounded-lg text-black text-sm xs:text-base font-medium shadow-md transition-all duration-500 transform hover:bg-gray-100 hover:shadow-lg hover:scale-105 
                ${animatedElements.button ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              onClick={() => navigate("/userlogin")}
            >
              Découvrir les outils IA
            </button>
          </div>
        </div>
        
        {/* Dashboard Preview Container - INCREASED SPACING */}
        <div 
          ref={dashboardRef}
          className={`relative mt-8 xs:mt-10 md:mt-12 px-4 xs:px-6 mx-auto max-w-5xl transition-all duration-1000 transform pb-6 sm:pb-8 md:pb-10 
            ${animatedElements.dashboard ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
          {/* Purple glow effect with pulse animation */}
          <div 
            className="absolute inset-0 -inset-x-12 xs:-inset-x-16 -inset-y-8 xs:-inset-y-10 bg-[#5a189a]/40 blur-3xl rounded-full opacity-70"
            style={{
              animation: 'pulse 4s infinite ease-in-out'
            }}
          ></div>
          
          {/* Dashboard container with responsive scaling */}
          <div className="relative transform transition-transform duration-700 hover:scale-[1.02]">
            {/* Top border */}
            <div className="h-6 xs:h-8 sm:h-10 md:h-12 bg-[#1a1128] rounded-t-2xl"></div>
            
            {/* Side borders container */}
            <div className="flex">
              {/* Left border */}
              <div className="w-4 xs:w-6 sm:w-8 md:w-12 bg-[#1a1128]"></div>
              
              {/* Main content */}
              <div className="flex-grow bg-[#141218] border-t border-l border-r border-[#2c1b4a] overflow-hidden">
                {/* Template image */}
                <img
                  src={template}
                  alt="Dashboard Preview"
                  className={`w-full h-auto object-cover transition-all duration-1000 ease-in-out 
                    ${isImageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>
              
              {/* Right border */}
              <div className="w-4 xs:w-6 sm:w-8 md:w-12 bg-[#1a1128]"></div>
            </div>
            
            {/* Bottom border */}
            <div className="h-6 xs:h-8 sm:h-10 md:h-12 bg-[#1a1128] rounded-b-2xl"></div>
          </div>
        </div>
      </div>
      
      {/* Add enhanced global keyframe animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
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
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        /* Add xs breakpoint for very small screens - ENHANCED WITH MORE STYLES */
        @media (min-width: 400px) {
          .xs\\:px-4 { padding-left: 1rem; padding-right: 1rem; }
          .xs\\:px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
          .xs\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .xs\\:pt-5 { padding-top: 1.25rem; }
          .xs\\:pb-6 { padding-bottom: 1.5rem; }
          .xs\\:py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
          .xs\\:py-2.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
          .xs\\:py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .xs\\:mt-6 { margin-top: 1.5rem; }
          .xs\\:mt-10 { margin-top: 2.5rem; }
          .xs\\:mb-4 { margin-bottom: 1rem; }
          .xs\\:mb-8 { margin-bottom: 2rem; }
          .xs\\:gap-3 { gap: 0.75rem; }
          .xs\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .xs\\:text-base { font-size: 1rem; line-height: 1.5rem; }
          .xs\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .xs\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
          .xs\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
          .xs\\:h-12 { height: 3rem; }
          .xs\\:-inset-x-16 { left: -4rem; right: -4rem; }
          .xs\\:-inset-y-10 { top: -2.5rem; bottom: -2.5rem; }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;