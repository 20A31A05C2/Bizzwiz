import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Footer = () => {
  const { t } = useTranslation(); // Use translation hook
  
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const linksRefs = useRef([]);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [visibleLinks, setVisibleLinks] = useState([false, false, false, false, false, false, false]);

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
    linksRefs.current = new Array(7).fill().map((_, i) => linksRefs.current[i] || React.createRef());
    
    // Initial check for elements in viewport
    setTimeout(() => {
      handleScroll();
    }, 300);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Force all links to be visible after a delay (ensures they show even if not in viewport)
    const timer = setTimeout(() => {
      setVisibleLinks(Array(7).fill(true));
    }, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Get link items from translations
  const linkItems = [
    t('footer.legalNotice'),
    t('footer.privacyPolicy'),
    t('footer.termsOfUse'),
    t('footer.termsOfSale'),
    t('footer.copyright'),
    t('footer.accessibility'),
    t('footer.faq')
  ];

  return (
    <div ref={sectionRef} className="w-full bg-black py-8 sm:py-5 md:py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-5">
        <div 
          ref={containerRef}
          className={`border border-gray-800 rounded-md p-4 sm:p-5 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{
            boxShadow: isVisible ? '0 0 30px rgba(75, 0, 130, 0.1)' : 'none',
            transition: 'all 0.7s ease-out, box-shadow 1.5s ease'
          }}
        >
          <h2 
            ref={titleRef}
            className={`text-white text-lg font-medium mb-3 transition-all duration-700 delay-200 transform ${isTitleVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
          >
            {t('footer.title')}
          </h2>
          
          <div className="flex flex-col space-y-2.5">
            {linkItems.map((item, index) => (
              <div 
                key={index}
                ref={el => linksRefs.current[index] = el}
                className={`text-gray-400 hover:text-gray-300 cursor-pointer transition-all duration-500 transform ${visibleLinks[index] ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'}`}
                style={{ 
                  transitionDelay: `${300 + index * 100}ms`,
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
        </div>
      </div>
    </div>
  );
};

export default Footer;