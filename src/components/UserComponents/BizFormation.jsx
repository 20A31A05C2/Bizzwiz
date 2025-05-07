import { useState, useEffect } from 'react';
import mascot from '../../assets/man.png';
import SideNavbar from './userlayout/sidebar';
import { useTranslation } from 'react-i18next'; // Import translation hook

function BizFormation() {
  const [isVisible, setIsVisible] = useState(false);
  // Initialize translation hook
  const { t } = useTranslation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavbar />

      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 w-full h-screen">
            <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent blur-3xl" />
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl" />
          </div>
        </div>

        {/* Main content - Side by side layout */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-screen p-4 md:p-8 gap-8 md:gap-16">
          {/* Left side - Character image */}
          <div className={`relative w-full md:w-1/2 max-w-lg transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/30 to-purple-500/30 blur-3xl rounded-full" />
            <img
              src={mascot}
              alt={t('bizFormation.mascotAlt', 'Mascot')}
              className="relative z-10 w-full h-auto transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right side - Content */}
          <div className={`w-full md:w-1/2 max-w-lg text-center md:text-left transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          }`}>
            <div className="space-y-8">
              {/* Text content */}
              <div>
                <h1 className="mb-4 text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {t('bizFormation.heading', 'Coming Soon')}
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                  {t('bizFormation.description', 'Something amazing is in the works. Stay tuned for something special.')}
                </p>
              </div>

              {/* Newsletter signup */}
              <div className="w-full">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder={t('bizFormation.emailPlaceholder', 'Enter your email')}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 whitespace-nowrap">
                    {t('bizFormation.notifyButton', 'Notify Me')}
                  </button>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-6 justify-center md:justify-start">
                {[
                  { key: 'twitter', label: t('bizFormation.socials.twitter', 'Twitter') },
                  { key: 'discord', label: t('bizFormation.socials.discord', 'Discord') },
                  { key: 'instagram', label: t('bizFormation.socials.instagram', 'Instagram') }
                ].map((platform) => (
                  <a
                    key={platform.key}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {platform.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BizFormation;