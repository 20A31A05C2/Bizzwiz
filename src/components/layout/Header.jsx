import { useState, useEffect } from 'react';
import Logo from '../../assets/logo.png';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "@fontsource/inter";
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  
  // Use state for navLinks so they update with language changes
  const [navLinks, setNavLinks] = useState([]);

  // Update navLinks when language changes
  useEffect(() => {
    setNavLinks([
      { text: t('navigation.home'), href: '#' },
      { text: t('navigation.services'), href: '#' },
      { text: t('navigation.createBusiness'), href: '#' },
      { text: t('navigation.createWebsite'), href: '#' },
      { text: t('navigation.contact'), href: '#' }
    ]);
  }, [t, i18n.language]);

  const navigate = useNavigate();

  // Function to toggle language
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  return (
    <header className="py-2 sm:py-4 w-full border-b border-white/10 bg-black/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-800/20 blur group-hover:blur-md transition-all duration-300"></div>
              <div className="relative border border-white/20 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg flex justify-center items-center hover:border-white/40 transition-colors">
                <img src={Logo} alt="Logo" className="w-3/4 h-3/4" />
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

          <div className="flex items-center gap-1 xs:gap-2 sm:gap-6">
            {/* Language Toggle Button */}
            <button 
              onClick={toggleLanguage}
              className="text-white/70 hover:text-white border border-white/10 rounded-lg px-2 py-1 text-xs sm:text-sm"
            >
              {currentLang === 'en' ? 'FR' : 'EN'}
            </button>
            
            {/* Login Button container with outer border - 8px border radius */}
            <div className="border border-white/10 rounded-lg p-1 bg-black/20 backdrop-blur-sm">
              <button 
                onClick={() => navigate('/userlogin')} 
                className="relative group py-1 sm:py-2 px-3 sm:px-6 md:px-8 rounded-lg overflow-hidden"
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
                <span className="relative text-white text-xs sm:text-sm font-medium whitespace-nowrap">{t('buttons.login')}</span>
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1 sm:p-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors ml-1"
            >
              {isMenuOpen ? (
                <FaTimes className="w-4 h-4 sm:w-6 sm:h-6 text-white/70" />
              ) : (
                <FaBars className="w-4 h-4 sm:w-6 sm:h-6 text-white/70" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full mt-1 bg-black/90 border-y border-white/10 backdrop-blur-lg">
            <nav className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
              <ul className="space-y-2 sm:space-y-4">
                {navLinks.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white block transition-colors duration-200 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-2 hover:bg-white/5 rounded-lg"
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