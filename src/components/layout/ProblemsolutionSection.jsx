import { FaHandSparkles, FaLightbulb, FaRedoAlt } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const ProblemSolutionSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative py-20 bg-black lg:py-28">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        {/* Problem & Solution Cards */}
        <div ref={ref} className="grid max-w-6xl gap-8 p-8 mx-auto md:grid-cols-2">
      {/* Problem Card */}
      <div className={`transform transition-all duration-1000 ease-in-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}>
        <div className="relative group">
          {/* Enhanced Glow Effect */}
          <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-br from-red-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl filter blur-xl group-hover:blur-2xl"></div>
          
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute top-4 left-4 text-red-500/20 animate-pulse">
              <FaRedoAlt size={24} />
            </div>
            <div className="absolute delay-100 bottom-4 right-4 text-red-500/20 animate-pulse">
              <FaRedoAlt size={16} />
            </div>
          </div>

          {/* Card Content */}
          <div className="relative bg-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:scale-[1.02] overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl animate-bounce">🚨</span>
              <h3 className="text-2xl font-bold text-transparent text-white md:text-3xl bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text">
                The Problem
              </h3>
            </div>
            <p className="relative z-10 text-lg text-white/80 md:text-xl">
              Starting and running a business takes time and requires skills. Too many entrepreneurs give up before they even begin.
            </p>
          </div>
        </div>
      </div>

      {/* Solution Card */}
      <div className={`transform transition-all duration-1000 ease-in-out delay-300 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}>
        <div className="relative group">
          {/* Enhanced Glow Effect */}
          <div className="absolute inset-0 transition-all duration-300 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-emerald-500/30 rounded-2xl filter blur-xl group-hover:blur-2xl"></div>
          
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute top-4 right-4 text-blue-500/20 animate-pulse">
              <FaHandSparkles size={24} />
            </div>
            <div className="absolute delay-100 bottom-4 left-4 text-blue-500/20 animate-pulse">
              <FaLightbulb size={16} />
            </div>
          </div>

          {/* Card Content */}
          <div className="relative bg-black/90 rounded-2xl p-8 border border-white/10 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:scale-[1.02] overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl animate-pulse">✨</span>
              <h3 className="text-2xl font-bold text-transparent text-white md:text-3xl bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text">
                The BizWiz Solution
              </h3>
            </div>
            <p className="relative z-10 text-lg text-white/80 md:text-xl">
              Our AI tools assist you at every stage to save you time and maximize your chances of success.
            </p>
          </div>
        </div>
      </div>
    </div>

        {/* Key Benefits */}
        <div
          className={`mt-20 max-w-6xl mx-auto text-center transform transition-all duration-1000 ease-in-out delay-500 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h3 className="mb-12 text-3xl font-bold text-white md:text-4xl">
            📌 Key Benefits
          </h3>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🤖", text: "No skills required" },
              { icon: "⚡", text: "Fast and 100% automated" },
              { icon: "🎯", text: "AI tailored to your specific needs" },
            ].map((benefit, index) => (
              <div key={index} className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#9B57A4]/30 to-[#8135E7]/30 rounded-2xl filter blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                {/* Card Content */}
                <div className="relative bg-black rounded-2xl p-8 border border-white/30 backdrop-blur-lg transition-all duration-300 hover:border-white/90 hover:scale-[1.02]">
                  <span className="inline-block mb-4 text-4xl">{benefit.icon}</span>
                  <p className="text-lg text-white/90">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <button className="relative inline-flex group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7AD3FF] to-[#8135E7] rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-r from-[#190d2e] to-[#4a208a] px-8 py-4 rounded-lg text-lg font-semibold text-white hover:bg-opacity-90 transition-all duration-300 border border-white/10 hover:scale-105">
              See Our AI Tools in Action
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;