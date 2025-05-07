/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import translation hook
import { 
  FaHome, 
  FaCog, 
  FaChartPie, 
  FaGlobe, 
  FaCommentAlt, 
  FaFile, 
  FaInfo, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCoins,
  FaReceipt,

} from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import logo from '../../../assets/logo.png';
import ApiService from '../../../Apiservice';

const SideNavbar = () => {
  // Initialize translation hook
  const { t } = useTranslation();
  
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, title: t('sidebar.menuItems.home', 'Home'), icon: FaHome, path: '/UserDashboard' },
    { id: 2, title: t('sidebar.menuItems.profile', 'Profile'), icon: CgProfile, path: '/UserProfile' },
    { id: 3, title: t('sidebar.menuItems.logoAI', 'LogoAI'), icon: FaCog, path: '/Logoai' },
    { id: 4, title: t('sidebar.menuItems.bizzPlan', 'BizzPlan'), icon: FaChartPie, path: '/BizzPlan' },
    { id: 5, title: t('sidebar.menuItems.aiStart', 'AI-Start'), icon: FaCog, path: '/AIStart' },
    { id: 6, title: t('sidebar.menuItems.bizWebAI', 'BizWeb AI'), icon: FaGlobe, path: '/Bizweb' },
    { id: 7, title: t('sidebar.menuItems.task', 'Task'), icon: FaFile, path: '/Task', badge: 2 },
    { id: 8, title: t('sidebar.menuItems.bizFormation', 'BizFormation'), icon: FaInfo, path: '/BizFormation' },
    { id: 9, title: t('sidebar.menuItems.creditsPurchase', 'Credits Purchase'), icon: FaCoins, path: '/creditpurchase' },
    { id: 10, title: t('sidebar.menuItems.subscriptionPurchase', 'Subscription Purchase'), icon: FaReceipt, path: '/pricingplan' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      if (mobile) {
        setIsOpen(false);
        setShowMobileMenu(false);
      } else if (tablet) {
        setIsOpen(false);
      } else {
        const savedState = localStorage.getItem('sidebarCollapsed') === 'true';
        setIsOpen(!savedState);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService("/userlogout", "GET");
      localStorage.removeItem('bizwizusertoken');      
      navigate('/userlogin');
      toast.success(t('sidebar.notifications.logoutSuccess', "Logout successfully"));
    } catch (error) {
      toast.error(t('sidebar.notifications.error', "Something went wrong"));
    }
  };

  const isMenuItemActive = (itemPath) => location.pathname === itemPath;

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    if (isMobile || isTablet) {
      setIsOpen(!isOpen);
      document.body.style.overflow = !showMobileMenu ? 'hidden' : '';
    }
  };

  const handleMenuItemClick = () => {
    if (isMobile || isTablet) {
      setShowMobileMenu(false);
      setIsOpen(false);
      document.body.style.overflow = '';
    }
  };

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarCollapsed', !newState);
  };

  return (
    <>
      <ToastContainer />
      
      {/* Mobile Menu Button - Visible on mobile and tablet */}
      <button
        onClick={toggleMobileMenu}
        className="fixed z-50 p-2 text-white bg-purple-500 rounded-lg top-4 left-4 lg:hidden shadow-md hover:bg-purple-600 transition-all duration-200"
        aria-label={showMobileMenu ? t('sidebar.aria.closeMenu', "Close menu") : t('sidebar.aria.openMenu', "Open menu")}
      >
        {showMobileMenu ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Overlay - Visible when mobile menu is open */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-screen bg-[#1a1625] z-40
        transform transition-all duration-300 ease-in-out
        ${(isMobile || isTablet)
          ? showMobileMenu ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          : 'translate-x-0'
        }
        ${isOpen ? 'w-64' : 'w-20'}
        ${(isMobile || isTablet) && !showMobileMenu ? 'w-0' : ''}
        flex flex-col
      `}>
        {/* Logo Container */}
        <div className="flex items-center justify-center mt-4 h-28">
          <img 
            src={logo}
            alt={t('sidebar.logoAlt', 'Logo')} 
            className={`transition-all duration-300 ${isOpen ? 'h-32 max-w-full' : 'h-20 max-w-full'}`}
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow py-4 overflow-y-auto custom-scrollbar">
          <ul className="px-2 space-y-2">
            {menuItems.map((item) => {
              const isActive = isMenuItemActive(item.path);
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className="relative block group"
                    onClick={handleMenuItemClick}
                    data-title={item.title}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className={`
                      flex items-center p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-[#2a2435] text-purple-500' 
                        : 'text-gray-400 hover:bg-[#2a2435]/50 hover:text-purple-500'
                      }
                    `}>
                      <item.icon className="w-5 h-5 min-w-[20px]" />
                      
                      <span className={`
                        ml-4 whitespace-nowrap transition-all duration-200
                        ${!isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
                      `}>
                        {item.title}
                      </span>
                      
                      {/* Badge */}
                      {item.badge && (
                        <>
                          {isOpen ? (
                            <span className="absolute right-3 px-2 py-0.5 text-xs font-medium text-white bg-purple-500 rounded-full">
                              {item.badge}
                            </span>
                          ) : (
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-medium text-white bg-purple-500 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}

                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute top-0 right-0 w-1 h-full bg-purple-500 rounded-l" />
                      )}
                    </div>
                    
                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-[#2a2435] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                        {item.title}
                        {item.badge && (
                          <span className="ml-1 px-1.5 py-0.5 text-xs font-medium text-white bg-purple-500 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-700 mt-auto">
          <div className="space-y-2">
            <button 
              onClick={() => {
                navigate('/contactus');
                handleMenuItemClick();
              }}
              className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:bg-[#2a2435]/50 hover:text-purple-500 transition-all duration-200 group relative"
            >
              <FaCommentAlt className="w-5 h-5 min-w-[20px]" />
              <span className={`ml-4 whitespace-nowrap transition-all duration-200 ${!isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {t('sidebar.actions.contactUs', 'Contact us')}
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#2a2435] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {t('sidebar.actions.contactUs', 'Contact us')}
                </div>
              )}
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:bg-[#2a2435]/50 hover:text-purple-500 transition-all duration-200 group relative"
            >
              <FaSignOutAlt className="w-5 h-5 min-w-[20px]" />
              <span className={`ml-4 whitespace-nowrap transition-all duration-200 ${!isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {t('sidebar.actions.logout', 'Log out')}
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#2a2435] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {t('sidebar.actions.logout', 'Log out')}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Toggle Button - Only visible on desktop */}
        <button
          onClick={toggleSidebar}
          className="absolute p-1.5 text-white transition-transform duration-200 transform bg-purple-500 rounded-full -right-3 top-8 hover:bg-purple-600 hidden lg:block shadow-md"
          aria-label={isOpen ? t('sidebar.aria.collapseSidebar', "Collapse sidebar") : t('sidebar.aria.expandSidebar', "Expand sidebar")}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Spacer to prevent content overlap */}
      <div 
        className={`
          transition-all duration-300
          ${isMobile || isTablet ? 'w-0' : isOpen ? 'w-64' : 'w-20'}
        `} 
      />

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1625;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
      `}</style>
    </>
  );
};

export default SideNavbar;