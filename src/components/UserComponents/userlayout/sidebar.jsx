import { useState, useEffect } from 'react';
import { 
  FaHome, 
  FaCog, 
  FaChartPie, 
  FaGlobe, 
  FaCommentAlt, 
  FaFile, 
  FaInfo, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import ApiService from '../../../Apiservice';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate=useNavigate();

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 1, title: 'Home', icon: FaHome, path: '/UserDashboard' },
    { id: 2, title: 'Profile', icon: CgProfile, path: '/UserProfile' },
    { id: 3, title: 'LogAI', icon: FaCog, path: '/logai' },
    { id: 4, title: 'BizzPlan', icon: FaChartPie, path: '/bizzplan' },
    { id: 5, title: 'AI-Start', icon: FaCog, path: '/ai-start' },
    { id: 6, title: 'BizWeb AI', icon: FaGlobe, path: '/bizweb' },
    { id: 7, title: 'Task', icon: FaFile, path: '/task', badge: 2 },
    { id: 8, title: 'BizFormation', icon: FaInfo, path: '/formation' },
  ];

  const handleLogout = async(e) => {
e.preventDefault();
    try{
        
        const response=await ApiService("/userlogout","GET")
        localStorage.removeItem('token');
        toast.success(response.message);
        localStorage.setItem('toastMessage', response.message);
    localStorage.setItem('toastType', 'success');
    navigate('/userlogin');
       
    }
    catch(error)
    {
        toast.error(error.message);
    }
    
  };

  return (
    <div className="flex min-h-screen">
        <ToastContainer/>
      <div 
        className={`${
          isOpen ? 'w-64' : 'w-[70px]'
        } bg-[#1a1625] fixed h-screen transition-all duration-300 z-50`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-28 ">
          <img 
            src={logo}
            alt="Logo" 
            className={`transition-all duration-300 ${
              isOpen ? 'h-32' : 'h-20'
            }`}
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow py-4">
          <ul className="px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className="relative block"
                  >
                    <div className={`flex items-center p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-[#2a2435] text-purple-500' 
                        : 'text-gray-400 hover:bg-[#2a2435]/50 hover:text-purple-500'
                      }`}
                    >
                      {/* Icon */}
                      <item.icon className={`w-5 h-5 min-w-[20px]`} />
                      
                      {/* Title */}
                      <span className={`ml-4 whitespace-nowrap transition-all duration-200
                        ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}
                      >
                        {item.title}
                      </span>
                      
                      {/* Badge */}
                      {item.badge && isOpen && (
                        <span className="absolute right-3 px-2 py-0.5 text-xs font-medium text-white bg-purple-500 rounded-full">
                          {item.badge}
                        </span>
                      )}

                      {/* Active Indicator - Right Side */}
                      {isActive && (
                        <div className="absolute top-0 right-0 w-1 h-full bg-purple-500 rounded-l" />
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-700">
          <div className="space-y-1">
            <button className={`flex items-center w-full p-3 rounded-lg text-gray-400 
              hover:bg-[#2a2435]/50 hover:text-purple-500 transition-all duration-200`}
            >
              <FaCommentAlt className="w-5 h-5 min-w-[20px]" />
              <span className={`ml-4 whitespace-nowrap transition-all duration-200
                ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}
              >
                Contact us
              </span>
            </button>
            
            <button 
              onClick={handleLogout}
              className={`flex items-center w-full p-3 rounded-lg text-gray-400 
                hover:bg-[#2a2435]/50 hover:text-purple-500 transition-all duration-200`}
            >
              <FaSignOutAlt className="w-5 h-5 min-w-[20px]" />
              <span className={`ml-4 whitespace-nowrap transition-all duration-200
                ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}
              >
                Log out
              </span>
            </button>
          </div>
        </div>

        {/* Toggle Button - Hidden on Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute p-1.5 text-white transition-transform duration-200 transform bg-purple-500 rounded-full -right-3 top-8 hover:bg-purple-600 hidden md:block"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 
              ${isOpen ? 'rotate-180' : 'rotate-0'}`}
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

      {/* Spacer */}
      <div className={`${isOpen ? 'w-64' : 'w-[70px]'} transition-all duration-300`} />
    </div>
  );
};

export default SideNavbar;