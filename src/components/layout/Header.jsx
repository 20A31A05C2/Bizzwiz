import { useState } from 'react';
import Logo from '../../assets/logo.png';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { text: 'Features', href: '#' },
    { text: 'Developers', href: '#' },
    { text: 'Pricing', href: '#' },
    { text: 'Changelog', href: '#' }
  ];

  const navigate = useNavigate();

  return (
    <header className="py-4 w-full border border-white/15 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm fixed top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-800/20 blur group-hover:blur-md transition-all duration-300"></div>
              <div className="relative border border-white/20 h-12 w-12 rounded-lg flex justify-center items-center hover:border-white/40 transition-colors">
                <img src={Logo} alt="Logo" />
              </div>
            </div>
          </div>

          <nav className="hidden lg:block">
            <div className="border border-white/20 p-2 rounded-full bg-black/20 backdrop-blur-sm">
              <ul className="flex gap-16 px-8">
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
            <button onClick={()=>{
                navigate('/userlogin')
            }} className="relative group py-2.5 px-6 rounded-lg font-medium text-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-[#190d2e] to-[#4a208a] rounded-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/50 to-purple-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 shadow-[0_0_20px_rgb(140,69,255,0.5)] rounded-lg"></div>
              <div className="absolute inset-0">
                <div className="rounded-lg border border-white/20 absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                <div className="rounded-lg border border-white/40 absolute inset-0 [mask-image:linear-gradient(to_top,white,transparent)]"></div>
              </div>
              <span className="relative text-white">Join Now</span>
            </button>

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
          <div className="lg:hidden absolute left-0 right-0 top-full mt-2 bg-transparent border-y border-white/10 backdrop-blur-lg">
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