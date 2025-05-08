import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import "@fontsource/inter";

// Import icons (using react-icons as a substitute for Tabler icons)
import { FaBars, FaTimes } from 'react-icons/fa';

// Utility function for className merging (since we don't have the cn utility)
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Motion components (simplified versions since we don't have motion/react)
const Motion = ({ children, className, animate, transition, style }) => {
  // In a real implementation, these props would be used with motion/react
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

const AnimatePresence = ({ children }) => children;

// Lit-up Border Button Component
const LitBorderButton = ({ children, onClick, className = "", as = "button" }) => {
  const Component = as;
  return (
    <Component 
      className={`p-[3px] relative ${className}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
        {children}
      </div>
    </Component>
  );
};

// Navbar Components
export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // In a real implementation, this would use useScroll and useMotionValueEvent
  // For now, we'll use a basic window scroll event listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
  }

  return (
    <div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child,
              { visible },
            )
          : child,
      )}
    </div>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <Motion
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: visible ? "min(90vw, 800px)" : "100%", // Updated for better responsiveness
        transform: visible ? 'translateY(20px)' : 'translateY(0px)',
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "auto" : "100%", // Changed fixed width to auto
        margin: visible ? "0 auto" : "0",
        maxWidth: visible ? "90%" : "100%", // Added max-width for large screens
        transition: "all 0.5s ease",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-black bg-opacity-80 px-4 py-2 lg:flex",
        visible && "bg-black bg-opacity-80",
        className,
      )}
    >
      {children}
    </Motion>
  );
};

export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-white transition duration-200 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-3 sm:px-4 py-2 text-white whitespace-nowrap text-xs sm:text-sm"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <Motion
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-white bg-opacity-10"
              style={{
                position: 'absolute',
                inset: 0,
                height: '100%',
                width: '100%',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </div>
  );
};

export const MobileNav = ({ children, className, visible }) => {
  return (
    <Motion
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        transform: visible ? 'translateY(20px)' : 'translateY(0px)',
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        transition: "all 0.5s ease",
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-black bg-opacity-80 px-0 py-2 lg:hidden",
        visible && "bg-black bg-opacity-80",
        className,
      )}
    >
      {children}
    </Motion>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between px-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Motion
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            opacity: 1,
            transition: "opacity 0.3s ease",
          }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-black bg-opacity-90 px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
            className,
          )}
        >
          {children}
        </Motion>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }) => {
  return isOpen ? (
    <FaTimes className="text-white cursor-pointer" size={24} onClick={onClick} />
  ) : (
    <FaBars className="text-white cursor-pointer" size={24} onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-white"
    >
      <div className="relative group">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-800/20 blur group-hover:blur-md transition-all duration-300"></div>
        <div className="relative border border-white/20 h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex justify-center items-center hover:border-white/40 transition-colors">
          <img src={Logo} alt="Logo" className="w-3/4 h-3/4" />
        </div>
      </div>
      <span className="font-medium text-white">BizWiz</span>
    </a>
  );
};

// Main Header Component
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/About' },
    { name: 'Services', link: '/Services' },
    // { name: 'Create Business', link: '#create-business' },
    { name: 'Contact', link: '/AssistanceForm' }
  ];

  return (
    <header className="w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center">
            <LitBorderButton 
              onClick={() => navigate('/userlogin')}
              className="text-xs sm:text-sm"
            >
              Login
            </LitBorderButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-white block py-2 w-full hover:text-opacity-80"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 pt-4">
              <LitBorderButton 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/userlogin');
                }}
                className="w-full"
              >
                Login
              </LitBorderButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      {/* Space filler for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </header>
  );
};

export default Header;
