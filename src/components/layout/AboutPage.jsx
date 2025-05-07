import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const AboutPage = () => {
  // State for animation controls
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [textBoxContent, setTextBoxContent] = useState('');

  // Set loaded state after component mounts (for initial animations)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Animation classes based on state
  const pageClasses = `bg-black text-white min-h-screen transition-opacity duration-700 ease-in-out ${
    isLoaded ? 'opacity-100' : 'opacity-0'
  }`;
  
  const titleClasses = `flex items-center justify-center mb-6 transform transition-all duration-500 ${
    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
  }`;
  
  const boxClasses = `border border-gray-800 rounded-lg w-full mb-8 transition-all duration-500 ${
    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
  }`;
  
  const buttonClasses = `bg-purple-700 hover:bg-purple-800 text-white py-3 px-8 rounded-md transition-all duration-300 transform ${
    isHovering ? 'scale-105 shadow-lg' : ''
  } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

  return (
    <div className={pageClasses}>
      <Header />
      
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md px-4">
          {/* Title with lightning bolt and animation */}
          <div className={titleClasses}>
            <span className="text-yellow-300 mr-2 animate-pulse">⚡</span>
            <span className="text-xl font-medium">À propos</span>
          </div>
          
          {/* Text box area with fade-in and shimmer effect */}
          <div 
            className={boxClasses}
            style={{ 
              minHeight: "180px",
              background: "linear-gradient(to right, rgba(30,30,30,0.05) 0%, rgba(60,60,60,0.15) 50%, rgba(30,30,30,0.05) 100%)",
              backgroundSize: "200% 100%",
              animation: isLoaded ? "shimmer 3s infinite" : "none"
            }}
            onMouseEnter={() => setTextBoxContent('Découvrez notre histoire, notre mission et nos valeurs fondamentales.')}
            onMouseLeave={() => setTextBoxContent('')}
          >
            <div className="p-4 h-full flex items-center justify-center text-gray-400 text-sm transition-opacity duration-300">
              {textBoxContent || "Passez le curseur ici pour en savoir plus sur nous"}
            </div>
          </div>
          
          {/* Button with hover effect and delayed fade-in */}
          <div 
            className="flex justify-center transition-all duration-500"
            style={{ 
              transitionDelay: "200ms",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <button
              className={buttonClasses}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Commencez gratuitement
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;