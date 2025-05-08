import React from 'react';
import GradientText from '../ui/GradientText';
import { useNavigate } from "react-router-dom";




const Question = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center bg-black p-4 sm:p-6 relative">
      {/* Purple radial gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0.1) 40%, rgba(0, 0, 0, 0) 100%)'
        }}
      />
      
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center z-10">
        {/* Heading with GradientText */}
        <div className="mb-8 md:mb-10">
          <GradientText
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center"
            colors={["#B372CF", "#FFFFFF"]}
            animationSpeed={3}
          >
            Une question ?
          </GradientText>
        </div>
        
        {/* Text description - improved spacing and responsiveness */}
        <p className="text-white/80 text-center mb-8 md:mb-12 text-base md:text-lg leading-relaxed max-w-sm mx-auto px-4">
          Cliquez sur le bouton "Assistance" pour prendre rendez-vous avec un expert et bénéficier d'un accompagnement personnalisé.
        </p>
        
        {/* Assistance button - improved hover effects */}
        <button
          onClick={() => navigate("/AssistanceForm")}
          className="bg-white hover:bg-gray-100 text-purple-900 font-semibold rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:transform hover:scale-105"
        >
          Assistance
        </button>

      </div>
    </div>
  );
};

export default Question;