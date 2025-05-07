import React from 'react';
import { useEffect, useState } from 'react';
import GradientText from '../ui/GradientText';

const BizzWizUI = () => {
  return (
    <div className="flex flex-col items-center w-full bg-black text-white min-h-screen py-12 sm:py-16 md:py-20">
      {/* Header - Improved spacing and responsiveness */}
      <div className="w-full px-4 sm:px-6 py-6 text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
          Ils ont choisi de faire confiance à BizzWiz !
        </h1>
      </div>
      
      {/* Video Container - Improved responsive width and consistent spacing */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="relative w-full rounded-lg border border-gray-700 overflow-hidden aspect-video flex items-center justify-center bg-gray-900/50">
          {/* Play button with improved styling */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-900/70 flex items-center justify-center cursor-pointer hover:bg-purple-800/90 transition-colors duration-300">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>
      
      {/* Text section - Consistent spacing and improved responsiveness */}
      <div className="w-full px-4 sm:px-6 mb-10 sm:mb-12 text-center">
        <div className="mb-4 sm:mb-6">
          <span className="text-lg sm:text-xl md:text-2xl">Une idée ? </span>
          <span className="text-lg sm:text-xl md:text-2xl text-purple-400 font-semibold">Bizzweb !</span>
        </div>
        
        {/* Main heading with GradientText */}
        <GradientText
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8"
          colors={["#B372CF", "#FFFFFF"]}
          animationSpeed={3}
        >
          Ce que Bizzwiz gère pour vous
        </GradientText>
      </div>
      
      {/* Description - Consistent width and improved spacing */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl px-4 sm:px-6 md:px-8 text-center mb-12 sm:mb-16">
        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/90">
          BizzWiz vous accompagne dans la création d'applications web, de logiciels ou de tout autre projet 
          complexe, avec une équipe dédiée sur le long terme et une gestion de projet efficace grâce à BizzWeb Pro.
        </p>
      </div>
      
      {/* CTA Button - Improved responsive sizing and hover effects */}
      <div className="mb-12 sm:mb-16">
        <button className="bg-white text-purple-900 font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-md hover:bg-purple-100 transition-all duration-300 text-base sm:text-lg hover:shadow-lg hover:shadow-purple-500/20 hover:transform hover:scale-105">
          Planifier un rendez-vous
        </button>
      </div>
    </div>
  );
};

export default BizzWizUI;