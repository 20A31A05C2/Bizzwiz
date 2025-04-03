// TestimonialSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

const TestimonialSection = () => {
  // Refs for scroll detection
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const testimonialsRefs = useRef([]);
  const navigationRef = useRef(null);
  const lineRef = useRef(null);
  
  // Animation states
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [areTestimonialsVisible, setAreTestimonialsVisible] = useState([false, false, false]);
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const [isHorizontalLineVisible, setIsHorizontalLineVisible] = useState(false);
  
  const testimonials = [
    {
      id: 1,
      name: 'Jean M',
      role: 'Entrepreneur',
      quote: 'Grâce à ADS IA, j\'ai multiplié mes ventes en ligne sans toucher aux publicités. L\'IA optimise tout toute seule, c\'est bluffant !',
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      id: 2,
      name: 'Sophie L',
      role: 'Fondatrice d\'une boutique en ligne',
      quote: 'Je n\'y connaissais rien en publicité, mais avec ADS IA, mon trafic a explosé en quelques semaines ! Une vraie révolution pour mon business.',
      gradient: 'from-blue-600 to-purple-500'
    },
    {
      id: 3,
      name: 'David R',
      role: 'Consultant indépendant',
      quote: 'Je passais des heures à ajuster mes campagnes. Maintenant, ADS IA le fait pour moi et avec de meilleurs résultats. Un must-have !',
      gradient: 'from-teal-500 to-blue-600'
    }
  ];

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
    
    if (headingRef.current && !isHeadingVisible && isInViewport(headingRef.current)) {
      setIsHeadingVisible(true);
    }
    
    if (descriptionRef.current && !isDescriptionVisible && isInViewport(descriptionRef.current)) {
      setIsDescriptionVisible(true);
    }
    
    // Check each testimonial card
    testimonialsRefs.current.forEach((ref, index) => {
      if (ref && !areTestimonialsVisible[index] && isInViewport(ref)) {
        setAreTestimonialsVisible(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }
    });
    
    if (navigationRef.current && !isNavigationVisible && isInViewport(navigationRef.current)) {
      setIsNavigationVisible(true);
    }
    
    if (lineRef.current && !isHorizontalLineVisible && isInViewport(lineRef.current)) {
      setIsHorizontalLineVisible(true);
    }
  };

  useEffect(() => {
    // Initialize refs array for testimonials
    testimonialsRefs.current = new Array(testimonials.length).fill().map((_, i) => testimonialsRefs.current[i] || React.createRef());
    
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

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div 
      ref={sectionRef} 
      className="bg-black text-white py-6 sm:py-7 md:py-8 px-4 sm:px-5 mt-2 sm:mt-3 md:mt-4 relative overflow-hidden"
    >
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
      
      <div className="container mx-auto max-w-6xl">
        {/* Heading and description */}
        <h2 
          ref={headingRef}
          className={`text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 transition-all duration-700 transform ${isHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          Ce que disent nos clients
        </h2>
        <p 
          ref={descriptionRef}
          className={`text-center text-gray-300 text-xs sm:text-sm md:text-base max-w-3xl mx-auto mb-6 sm:mb-7 md:mb-8 transition-all duration-700 delay-200 transform ${isDescriptionVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          Ne laissez plus votre publicité au hasard ! ADS IA génère des annonces 
          percutantes, les optimise en temps réel et maximise votre retour sur investissement. 
          Automatisez votre visibilité et attirez plus de clients sans effort.
        </p>

        {/* Testimonials display - responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              ref={el => testimonialsRefs.current[index] = el}
              className={`relative transition-all duration-700 transform 
                ${areTestimonialsVisible[index] ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-95'}
                mb-4 sm:mb-5`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
              }}
            >
              {/* Outer colored card/backdrop that shows behind the main card */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} rounded-xl transform rotate-3`}
                style={{
                  animation: areTestimonialsVisible[index] ? 'float 5s infinite alternate-reverse ease-in-out' : 'none',
                  animationDelay: `${index * 0.5}s`,
                  top: '-4px',
                  bottom: '-4px',
                  left: '-4px',
                  right: '-4px'
                }}
              ></div>
              
              {/* Inner backdrop/shadow for depth effect */}
              <div 
                className="absolute inset-0 bg-black opacity-30 rounded-xl transform rotate-2"
                style={{
                  animation: areTestimonialsVisible[index] ? 'float 4s infinite alternate ease-in-out' : 'none',
                  animationDelay: `${index * 0.3}s`,
                  top: '-2px',
                  bottom: '-2px',
                  left: '-2px',
                  right: '-2px'
                }}
              ></div>
              
              {/* Main content card - responsive sizing */}
              <div className="relative bg-gray-900 rounded-xl px-4 sm:px-5 py-5 sm:py-6 h-full z-10 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20">
                {/* User info */}
                <div className="flex items-center mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 overflow-hidden border-2 border-gray-700">
                    {/* Background gradient with User icon */}
                    <div 
                      className={`w-full h-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center`}
                      style={{
                        animation: areTestimonialsVisible[index] ? 'pulse 3s infinite ease-in-out' : 'none',
                        animationDelay: `${index * 0.2}s`
                      }}
                    >
                      <User size={18} color="white" className="sm:w-5 sm:h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>

                {/* Quote text - responsive sizing */}
                <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">{testimonial.quote}</p>

                {/* Large quote mark - responsive positioning */}
                <div 
                  className="absolute top-4 sm:top-5 right-3 sm:right-4 text-4xl sm:text-5xl text-gray-700 opacity-30 font-serif"
                  style={{
                    animation: areTestimonialsVisible[index] ? 'fadeIn 1s ease-in-out' : 'none',
                    animationDelay: `${index * 0.5 + 0.5}s`
                  }}
                >
                  "
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows - responsive sizing */}
        <div 
          ref={navigationRef}
          className={`flex justify-center mt-6 sm:mt-7 md:mt-8 gap-3 transition-all duration-700 delay-600 transform ${isNavigationVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <button 
            onClick={prevSlide}
            className="p-1.5 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-1.5 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {/* Horizontal Line */}
        <div ref={lineRef} className="relative mt-6 sm:mt-7 md:mt-8 mb-3 sm:mb-4 md:mb-5 pt-4 sm:pt-5 md:pt-6">
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
            transform: translateY(0) rotate(3deg);
          }
          50% {
            transform: translateY(-5px) rotate(2deg);
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default TestimonialSection;