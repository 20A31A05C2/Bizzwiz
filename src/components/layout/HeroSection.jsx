import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import template from '../../assets/template.png';
// Import GradientText component
import GradientText from '../ui/GradientText';

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
  
  // Check if element is in viewport with consistent offset
  const isInViewport = (element, offset = 150) => {
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
      <div className="relative bg-[#120821] py-10 sm:py-12 md:py-16 lg:py-20">
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
        
        {/* Header spacing - improved consistency */}
        <div className="h-10 sm:h-12 md:h-16 lg:h-20"></div>
        
        {/* Center badge with scroll animation - improved spacing */}
        <div 
          ref={badgeRef}
          className={`flex justify-center pt-4 sm:pt-5 md:pt-6 pb-6 sm:pb-8 md:pb-10 transition-all duration-700 transform
            ${animatedElements.badge ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-black rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 border-2 border-[#6c2bd9]/50 hover:border-[#6c2bd9]/90 transition-all duration-300 shadow-lg shadow-[#6c2bd9]/30">
            <span className="text-white text-xs sm:text-sm font-bold bg-[#c729dc] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              NEW
            </span>
            <span className="text-[#a88bc7] text-xs sm:text-sm md:text-base font-medium">
              Le Cloud, L'IA. Votre projet, sans limites.
            </span>
          </div>
        </div>
        
        {/* Main Content Section - improved spacing */}
        <div className="relative z-10 px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 md:mb-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading with scroll animations */}
            <h1>
              <div 
                ref={heading1Ref}
                className={`text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 transition-all duration-700 transform 
                  ${animatedElements.heading1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                Lancez votre projet digital avec puissance.
              </div>
              
              {/* Gradient text with GradientText component */}
              <div 
                ref={heading2Ref}
                className={`transition-all duration-700 transform 
                  ${animatedElements.heading2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <GradientText 
                  colors={["#FFFFFF","#B372CF"]}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
                  animationSpeed={2}
                >
                  Bizzwiz s'occupe de tout — stratégie, tech, cloud, IA.
                </GradientText>
              </div>
            </h1>
            
            {/* Description with scroll animation - improved responsiveness */}
            <p 
              ref={descriptionRef}
              className={`max-w-xl mx-auto mt-5 sm:mt-6 md:mt-8 mb-6 sm:mb-8 md:mb-10 text-white/80 text-sm sm:text-base md:text-lg transition-all duration-700 transform 
                ${animatedElements.description ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              App, plateforme ou logiciel — Bizzwiz orchestre tout, du concept à l'optimisation, pour un projet sans friction.
            </p>
            
            {/* CTA Button with scroll animation - improved hover effects */}
            <button
              ref={buttonRef}
              className={`px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white rounded-lg text-black text-sm sm:text-base font-medium shadow-md transition-all duration-500 transform hover:bg-gray-100 hover:shadow-lg hover:scale-105 
                ${animatedElements.button ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              onClick={() => navigate("/userlogin")}
            >
              Lancer mon projet avec Bizzwiz
            </button>
          </div>
        </div>
        
        {/* Dashboard Preview Container - improved responsive scaling */}
        <div 
          ref={dashboardRef}
          className={`relative mt-8 sm:mt-10 md:mt-12 px-4 sm:px-6 mx-auto max-w-5xl transition-all duration-1000 transform pb-8 sm:pb-10 md:pb-12 
            ${animatedElements.dashboard ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
          {/* Purple glow effect with pulse animation */}
          <div 
            className="absolute inset-0 -inset-x-12 sm:-inset-x-16 -inset-y-8 sm:-inset-y-10 bg-[#5a189a]/40 blur-3xl rounded-full opacity-70"
            style={{
              animation: 'pulse 4s infinite ease-in-out'
            }}
          ></div>
          
          {/* Dashboard container with responsive scaling */}
          <div className="relative transform transition-transform duration-700 hover:scale-[1.02]">
            {/* Top border */}
            <div className="h-6 sm:h-8 md:h-10 lg:h-12 bg-[#1a1128] rounded-t-2xl"></div>
            
            {/* Side borders container */}
            <div className="flex">
              {/* Left border */}
              <div className="w-4 sm:w-6 md:w-8 lg:w-12 bg-[#1a1128]"></div>
              
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
              <div className="w-4 sm:w-6 md:w-8 lg:w-12 bg-[#1a1128]"></div>
            </div>
            
            {/* Bottom border */}
            <div className="h-6 sm:h-8 md:h-10 lg:h-12 bg-[#1a1128] rounded-b-2xl"></div>
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
      `}</style>
    </div>
  );
};

export default HeroSection;