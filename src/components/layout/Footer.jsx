import { useState } from 'react';
import { FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import useScrollAnimation from './useScrollanimation';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [heroRef, heroVisible] = useScrollAnimation();
  const [footerRef, footerVisible] = useScrollAnimation();
  const [socialsRef, socialsVisible] = useScrollAnimation();
  
  const footerLinks = {
    Product: ['Features', 'Integration', 'Updates', 'FAQ', 'Pricing'],
    Company: ['About', 'Blog', 'Careers', 'Manifesto', 'Press', 'Contract'],
    Resources: ['Examples', 'Community', 'Guides', 'Docs', 'Press'],
    Legal: ['Privacy', 'Terms', 'Security']
  };

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className={`min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900/20 to-black transform transition-all duration-1000 ${
          heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-3xl mx-auto space-y-3 text-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            <span className="inline-block mb-3">create your own</span>
            <br />
            <span className="inline-block mb-3">business for</span>
            <br />
            <span className="inline-block p-2 mb-5 text-transparent bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text">
              free using AI
            </span>
          </h1>

          <div className="w-full max-w-md mx-auto space-y-4">
            <div className="relative group">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 transition-all duration-300 border rounded-lg bg-black/40 border-purple-500/30 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2.5 
                bg-white text-black rounded-md hover:bg-gray-100 transition-all duration-300 
                hover:-translate-y-[52%] text-sm font-medium group-hover:scale-105">
                tried for free
              </button>
            </div>
            <p className="text-sm text-gray-400">
              No credit card required · it s free
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer
        ref={footerRef}
        className={`border-t border-gray-800 transform transition-all duration-1000 ${
          footerVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="px-4 py-12 mx-auto max-w-7xl md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div
                key={category}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`transform transition-all duration-700 ${
                  footerVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <h3 className="mb-4 font-medium text-gray-300">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="inline-block text-gray-500 transition-colors duration-300 transform hover:text-gray-300 hover:translate-x-1 hover:scale-105"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social Icons */}
            <div
              ref={socialsRef}
              className={`col-span-2 md:col-span-1 flex md:justify-end gap-6 items-start transform transition-all duration-1000 delay-500 ${
                socialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <a 
                href="#" 
                className="text-gray-500 transition-all duration-300 transform hover:text-gray-300 hover:scale-110 hover:-translate-y-1"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 transition-all duration-300 transform hover:text-gray-300 hover:scale-110 hover:-translate-y-1"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 transition-all duration-300 transform hover:text-gray-300 hover:scale-110 hover:-translate-y-1"
              >
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;