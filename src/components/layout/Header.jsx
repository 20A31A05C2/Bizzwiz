import { useState } from 'react';
import Logo from '../../assets/logo.png';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "@fontsource/inter"; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { text: 'Accueil', href: '#' },
    { text: 'Nos services', href: '#' },
    { text: 'Créer mon entreprise', href: '#' },
    { text: 'Créer mon site web', href: '#' },
    { text: 'Contact', href: '#' }
  ];

  const navigate = useNavigate();

  return (
    <header className="py-4 w-full border-b border-white/10 bg-black/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-800/20 blur group-hover:blur-md transition-all duration-300"></div>
              <div className="relative border border-white/20 h-12 w-12 rounded-lg flex justify-center items-center hover:border-white/40 transition-colors">
                <img src={Logo} alt="Logo" />
              </div>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:block">
            {/* Nav links with border - 60px border radius */}
            <div className="border border-white/10 rounded-[60px] px-8 py-2 bg-black/20 backdrop-blur-sm">
              <ul className="flex gap-8">
                {navLinks.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium hover:scale-105 transform inline-block"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

         
          <div className="flex items-center gap-6">
            {/* Button container with outer border - 8px border radius */}
            <div className="border border-white/10 rounded-lg p-1 bg-black/20 backdrop-blur-sm">
              <button 
                onClick={() => navigate('/userlogin')} 
                className="relative group py-2 px-8 rounded-lg overflow-hidden"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 shadow-[0_0_15px_rgba(140,69,255,0.4)] rounded-lg"></div>
                
                {/* Inner border */}
                <div className="absolute inset-0 rounded-lg border border-purple-500/30"></div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Text */}
                <span className="relative text-white text-sm font-medium">SE CONNECTER</span>
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6 text-white/70" />
              ) : (
                <FaBars className="w-6 h-6 text-white/70" />
              )}
            </button>
          </div>
        </div>

        
        {isMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full mt-2 bg-black/90 border-y border-white/10 backdrop-blur-lg">
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white block transition-colors duration-200 text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-lg"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;