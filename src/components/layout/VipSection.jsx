import { useInView } from 'react-intersection-observer';

const VipServiceSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const processSteps = [
    { number: "1", icon: "🔍", title: "Project Analysis", description: "We study your idea and needs" },
    { number: "2", icon: "📐", title: "Strategy & Design", description: "Wireframes, specs, roadmap" },
    { number: "3", icon: "💻", title: "Development & Build", description: "Full application creation" },
    { number: "4", icon: "🚀", title: "Testing & Launch", description: "Optimization, deployment, and support" },
  ];

  const benefits = [
    { icon: "🔄", text: "360° Support – From idea to final product" },
    { icon: "🛠️", text: "Custom Development – Web, mobile, SaaS… anything is possible" },
    { icon: "🎨", text: "Top-Notch UX/UI Design – Optimized user experience" },
    { icon: "📈", text: "Launch & Maintenance – Hosting, updates, and continuous improvements" },
  ];

  return (
    <section className="relative py-20 bg-black lg:py-28">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-20 transform transition-all duration-1000 ease-in-out ${
              inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-[#9B57A4]/20 rounded-full px-6 py-2 mb-6">
              <span className="text-[#9B57A4] text-lg">🟣 VIP Service</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
              Custom App Development
            </h2>
            <p className="text-xl text-white/80">Got an idea? We bring it to life.</p>
          </div>

          {/* Benefits */}
          <div
            className={`mb-20 transform transition-all duration-1000 ease-in-out delay-300 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h3 className="mb-12 text-3xl font-bold text-center text-white md:text-4xl">
              💡 Why choose BizWiz for your tech project?
            </h3>
            <div className="grid gap-8 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9B57A4]/30 to-[#8135E7]/30 rounded-2xl filter blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  {/* Card Content */}
                  <div className="relative bg-black rounded-2xl p-8 border border-white/10 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:scale-[1.02]">
                    <p className="flex items-start gap-3 text-white/90">
                      <span className="text-2xl">{benefit.icon}</span>
                      {benefit.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div
            className={`mb-20 transform transition-all duration-1000 ease-in-out delay-500 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h3 className="mb-12 text-3xl font-bold text-center text-white md:text-4xl">
              💼 A Simple & Efficient Process
            </h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9B57A4]/30 to-[#8135E7]/30 rounded-2xl filter blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  {/* Card Content */}
                  <div className="relative bg-black rounded-2xl p-8 border border-white/10 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:scale-[1.02]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl text-[#9B57A4]">{step.icon}</span>
                      <span className="text-xl font-bold text-white">{step.number}.</span>
                    </div>
                    <h4 className="mb-2 text-xl font-medium text-white">{step.title}</h4>
                    <p className="text-lg text-white/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div
            className={`text-center transform transition-all duration-1000 ease-in-out delay-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-xl text-[#9B57A4] mb-8">
              🔥 A service reserved for serious and ambitious entrepreneurs
            </p>
            <h3 className="mb-12 text-3xl font-bold text-white md:text-4xl">
              📌 Ready to bring your project to life?
            </h3>
            <button className="relative inline-flex group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7AD3FF] to-[#8135E7] rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-[#190d2e] to-[#4a208a] px-8 py-4 rounded-lg text-lg font-semibold text-white hover:bg-opacity-90 transition-all duration-300 border border-white/10 hover:scale-105">
                Schedule a Call with Our Experts
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VipServiceSection;