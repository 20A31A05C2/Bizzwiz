import React, { useState, useEffect, useRef } from 'react';
import Logo from '../../assets/logo.png'; // Adjust the path to your logo

const Footer = () => {
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const linksRefs = useRef([]);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [visibleLinks, setVisibleLinks] = useState([false, false, false, false, false, false]);

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
    
    if (containerRef.current && !isVisible && isInViewport(containerRef.current)) {
      setIsVisible(true);
    }
    
    if (titleRef.current && !isTitleVisible && isInViewport(titleRef.current)) {
      setIsTitleVisible(true);
    }
    
    // Check each link item
    linksRefs.current.forEach((ref, index) => {
      if (ref && !visibleLinks[index] && isInViewport(ref)) {
        setVisibleLinks(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }
    });
  };

  useEffect(() => {
    // Initialize refs array for links
    linksRefs.current = new Array(6).fill().map((_, i) => linksRefs.current[i] || React.createRef());
    
    // Initial check for elements in viewport
    setTimeout(() => {
      handleScroll();
    }, 300);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Force all links to be visible after a delay (ensures they show even if not in viewport)
    const timer = setTimeout(() => {
      setVisibleLinks(Array(6).fill(true));
    }, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Main header
  const mainHeader = 'Informations légales';
  
  // Footer link items as pairs based on your image
  const linkPairs = [
    ['Éditeur du site', 'Politique de confidentialité'],
    ['Responsabilité', 'Données personnelles'],
    ['Conditions d\'utilisation', 'Conditions Générales de Vente'],
  ];

  // Social media icons
  const socialIcons = [
    { name: 'Instagram', icon: <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
    { name: 'TikTok', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg> },
    { name: 'YouTube', icon: <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> }
  ];

  return (
    <div 
      ref={sectionRef} 
      className="w-full bg-black py-10 sm:py-12 md:py-16 mt-10 sm:mt-14 md:mt-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* App Logo and Social Icons - improved spacing */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center mb-4 sm:mb-0">
            {/* BizzWiz Logo using imported logo */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-2 sm:mr-3">
              <img src={Logo} alt="BizzWiz Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white text-base sm:text-lg md:text-xl font-semibold">BIZZWIZ APP</span>
          </div>
          
          <div className="flex space-x-2 sm:space-x-3 md:space-x-4">
            {socialIcons.map((social, index) => (
              <div 
                key={index}
                className="text-white cursor-pointer hover:text-purple-400 transition-colors duration-300 bg-purple-900 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center"
              >
                {social.icon}
              </div>
            ))}
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{
            transition: 'all 0.7s ease-out'
          }}
        >
          {/* Main header */}
          <h2 
            ref={titleRef}
            className={`text-white text-base sm:text-lg md:text-xl font-medium mb-4 sm:mb-6 md:mb-8 text-center transition-all duration-700 delay-200 transform ${isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
          >
            {mainHeader}
          </h2>
          
          <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-6">
            {/* Link pairs */}
            {linkPairs.map((pair, pairIndex) => (
              <div 
                key={pairIndex}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
              >
                {pair.map((item, itemIndex) => (
                  <div 
                    key={`${pairIndex}-${itemIndex}`}
                    ref={el => {
                      const index = pairIndex * 2 + itemIndex;
                      if (index < linksRefs.current.length) {
                        linksRefs.current[index] = el;
                      }
                    }}
                    className={`text-gray-400 hover:text-gray-300 cursor-pointer transition-all duration-500 transform text-xs sm:text-sm md:text-base text-center ${
                      visibleLinks[pairIndex * 2 + itemIndex] ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: `${300 + (pairIndex * 2 + itemIndex) * 100}ms`,
                      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;