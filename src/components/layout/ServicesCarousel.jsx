import React, { useState, useEffect } from 'react';
import GradientText from '../ui/GradientText';
import { motion, AnimatePresence } from 'framer-motion';

const ServicesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(2); // Start with expertise spécialisée

  const services = [
    {
      id: 1,
      title: "Stratégie sur mesure",
      description: "Une approche personnalisée pour répondre à vos besoins spécifiques."
    },
    {
      id: 2,
      title: "Gestion complète",
      description: "Nous prenons en charge tous les aspects de votre projet digital."
    },
    {
      id: 3,
      title: "Expertise spécialisée",
      description: "Bénéficiez de nos connaissances pointues dans le domaine numérique."
    },
    {
      id: 4,
      title: "Suivi continu",
      description: "Un accompagnement régulier pour assurer votre succès à long terme."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black py-16 sm:py-20 md:py-24 p-4 sm:p-6 md:p-8 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto">
        {/* Title with lightning icon positioned next to text - improved spacing */}
        <motion.div 
          className="flex items-center justify-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center">
            <motion.span 
              className="text-yellow-300 text-2xl sm:text-3xl mr-3 sm:mr-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "easeInOut" 
              }}
            >
              ⚡
            </motion.span>
            <GradientText
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center"
              colors={["#B372CF", "#FFFFFF"]}
              animationSpeed={3}
            >
              Ce que Bizzwiz gère pour vous
            </GradientText>
          </div>
        </motion.div>
        
        <div className="relative px-2 sm:px-4">
          {/* Main content container with enhanced animations */}
          <motion.div 
            className="relative w-full rounded-xl bg-gradient-to-b from-[#1e1e3a]/80 to-[#141428]/80 backdrop-blur-sm border border-purple-800/50 overflow-hidden min-h-[300px] md:min-h-[350px] flex items-center shadow-lg shadow-purple-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ boxShadow: "0 8px 32px rgba(156, 39, 176, 0.3)" }}
          >
            {/* Navigation buttons - improved positioning and hover effects */}
            <motion.button 
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-purple-800/30 hover:bg-purple-700/50 rounded-full p-2 z-10 text-white/80 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              aria-label="Previous service"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button 
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-purple-800/30 hover:bg-purple-700/50 rounded-full p-2 z-10 text-white/80 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              aria-label="Next service"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
            
            {/* Content section with animations - improved spacing */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="p-6 sm:p-8 md:p-12 w-full"
              >
                <div className="flex items-center mb-4 sm:mb-6">
                  <motion.span 
                    className="text-purple-300 mr-3 text-lg sm:text-xl font-mono bg-purple-900/30 px-2 sm:px-3 py-1 rounded-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                  >
                    {String(services[currentSlide].id).padStart(2, '0')}
                  </motion.span>
                  <motion.h2 
                    className="text-xl sm:text-2xl md:text-4xl font-bold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {services[currentSlide].title}
                  </motion.h2>
                </div>
                
                <motion.div
                  className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-4 sm:my-6"
                  animate={{ 
                    width: ["0%", "100%"],
                    opacity: [0, 1]
                  }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                
                <motion.p 
                  className="text-white/90 text-base sm:text-lg md:text-2xl mt-4 mb-4 sm:mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {services[currentSlide].description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Indicators with enhanced design - improved spacing */}
          <div className="flex justify-center mt-6 sm:mt-8 md:mt-10 space-x-2 sm:space-x-3">
            {services.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 w-8 sm:w-10'
                    : 'bg-purple-900/50 w-2 sm:w-3 hover:bg-purple-700/70'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCarousel;