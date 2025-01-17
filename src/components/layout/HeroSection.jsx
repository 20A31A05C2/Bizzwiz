import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';


const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative flex items-center justify-center w-full min-h-screen py-20 overflow-hidden bg-black">
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black to-transparent" />
        <div 
          className="absolute bottom-0 w-full h-screen transition-transform duration-1000 ease-out transform"
          style={{
            background: `
              radial-gradient(circle at 50% 100%, rgba(79,59,149,255), transparent 70%),
              radial-gradient(circle at 50% 100%, rgba(79,59,149,255), transparent 50%)
            `
          }}
        />
      </div>
      
      <div className={`container relative z-10 p-4 mx-auto mt-5 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 bg-black/50 border border-[#9B57A4] rounded-full px-7 py-2 mb-8 backdrop-blur-sm transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-black bg-[#9B57A4] text-sm font-semibold border border-white/30 px-2 py-0 rounded-xl transition-colors duration-300 hover:bg-[#8d4e96]">
              NEW
            </span>
            <span className="text-[#9B57A4] text-lg">Latest integration just arrived</span>
          </div>

          <h1 className={`mb-6 text-4xl font-bold md:text-6xl lg:text-7xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-white">Build your</span>
            <br />
            <span className="bg-gradient-to-b from-[#7AD3FF] via-[#7AD3FF] to-[#8135E7] text-transparent md:text-5xl lg:text-6xl bg-clip-text">
              business with AI
            </span>
          </h1>

          <p className={`max-w-2xl mx-auto mb-8 text-lg text-white transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Avec Bizwiz, créez votre entreprise et bénéficiez d un accompagnement personnalisé pour stimuler votre croissance numérique.
          </p>

          <button 
            className={`relative group transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            onClick={() => {
              navigate('/userlogin');
            }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7AD3FF] to-[#8135E7] rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-r from-[#190d2e] to-[#4a208a] px-6 py-3 rounded-lg font-medium text-white hover:bg-opacity-90 transition-all duration-300 border border-white/10 hover:scale-105">
              Start for free
            </div>
          </button>
        </div>
        
      </div>
     
      
    </section>
  );
};

export default HeroSection;