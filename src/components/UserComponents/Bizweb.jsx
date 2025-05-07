import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import translation hook
import { 
  IoAddCircleOutline, 
  IoDocumentTextOutline, 
  IoEyeOutline, 
  IoRocketOutline,
  IoCloseOutline,
  IoTimeOutline,
  IoWalletOutline,
  IoCodeSlashOutline,
  IoLayersOutline,
  IoLockClosedOutline,
  IoCashOutline
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SideNavbar from './userlayout/sidebar';
import Bizweb from './Bizweb';
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';

const WebsiteRequestDashboard = () => {
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const [requests, setRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isPlanChecking, setIsPlanChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserPlanStatus = async () => {
      try {
        const response = await ApiService("/userstatus", "GET");
        setHasActivePlan(response.has_active_plan);
        setIsPlanChecking(false);
      } catch (error) {
        console.error("Error checking plan status:", error);
        setHasActivePlan(false);
        setIsPlanChecking(false);
      }
    };

    checkUserPlanStatus();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await ApiService("/viewwebforms", "GET");
        setRequests(response.forms);
      } catch (error) {
        const errorMessage = error?.response?.data?.message || t('websiteDashboard.errors.unknown', "Unknown error occurred");
        console.error("Error fetching website requests:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isPlanChecking) {
      fetchRequests();
    }
  }, [isPlanChecking, t]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.project_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.project_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading || isPlanChecking) {
    return <LoadingPage name={t('websiteDashboard.loading', "Loading...")} />;
  }
  
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  // Format date based on the current language
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language || 'en-US');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const renderEmptyState = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <IoDocumentTextOutline className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 text-gray-500 opacity-50" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-white"
        >
          {t('websiteDashboard.emptyState.title', 'No Website Requests Yet')}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-md mb-4 sm:mb-6 text-sm sm:text-base text-gray-400"
        >
          {t('websiteDashboard.emptyState.description', 'Start your digital journey by creating your first website request. We will help you bring your online vision to life.')}
        </motion.p>
        
        <motion.button 
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate('/WebForm')}
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-white transition-all duration-300 shadow-xl rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-cyan-500/50"
        >
          <IoAddCircleOutline className="w-5 h-5 sm:w-6 sm:h-6" />
          {t('websiteDashboard.buttons.createFirst', 'Create First Website Request')}
        </motion.button>
      </motion.div>
    );
  };

  const renderLockedState = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 text-center h-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-2"
        >
          <motion.div 
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            <IoLockClosedOutline className="w-20 h-20 sm:w-24 sm:h-24 text-purple-500 opacity-80" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full ring-2 ring-black"
          />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text"
        >
          {t('websiteDashboard.locked.title', 'Feature Locked')}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-md mb-6 sm:mb-8 text-sm sm:text-base text-gray-300"
        >
          {t('websiteDashboard.locked.description', 'The Website Request Dashboard is available exclusively for premium users. Upgrade your plan to access custom website development services and manage your project requests.')}
        </motion.p>
        
        <motion.button 
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate('/pricingplan')}
          className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 shadow-xl rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/50"
        >
          <IoCashOutline className="w-5 h-5" />
          {t('websiteDashboard.locked.upgradeButton', 'Upgrade Now')}
        </motion.button>
      </motion.div>
    );
  };

  const renderRequestTable = () => {
    // If user doesn't have an active plan, show the locked state
    if (!hasActivePlan) {
      return renderLockedState();
    }

    if (!requests || requests.length === 0) {
      return renderEmptyState();
    }

    if (filteredRequests.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center p-8 text-center"
        >
          <IoDocumentTextOutline className="w-16 h-16 mb-4 text-gray-500 opacity-50" />
          <h2 className="mb-3 text-xl font-semibold text-white">
            {t('websiteDashboard.noResults.title', 'No Matching Requests Found')}
          </h2>
          <p className="max-w-md mb-6 text-gray-400">
            {t('websiteDashboard.noResults.description', "Try adjusting your search terms or filters to find what you're looking for.")}
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
            }}
            className="px-4 py-2 text-sm text-white transition-all bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            {t('websiteDashboard.buttons.clearFilters', 'Clear Filters')}
          </button>
        </motion.div>
      );
    }

    return (
      <div className="space-y-4 w-full">
        {/* Search and Filter Bar */}
        <div className="sticky top-0 z-20 flex flex-col sm:flex-row items-center gap-3 p-4 bg-black/60 backdrop-blur-md border-b border-white/10">
          <div className="relative w-full sm:w-64 lg:w-80">
            <input
              type="text"
              placeholder={t('websiteDashboard.filters.searchPlaceholder', 'Search projects...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-3 pr-10 text-sm text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {searchTerm ? (
                <button onClick={() => setSearchTerm('')} className="hover:text-white">
                  <IoCloseOutline className="w-5 h-5" />
                </button>
              ) : null}
            </span>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 text-sm text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none"
          >
            <option value="all">{t('websiteDashboard.filters.allStatuses', 'All Statuses')}</option>
            <option value="pending">{t('websiteDashboard.status.pending', 'Pending')}</option>
            <option value="in_progress">{t('websiteDashboard.status.inProgress', 'In Progress')}</option>
            <option value="completed">{t('websiteDashboard.status.completed', 'Completed')}</option>
            <option value="rejected">{t('websiteDashboard.status.rejected', 'Rejected')}</option>
          </select>
          
          <div className="hidden sm:block flex-grow"></div>
          
          <motion.button 
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate('/WebForm')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-white transition-all bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg shadow-lg hover:shadow-cyan-500/30"
          >
            <IoAddCircleOutline className="w-5 h-5" />
            {t('websiteDashboard.buttons.newRequest', 'New Request')}
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredRequests.map((request) => (
            <motion.div 
              key={request.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                borderColor: "rgba(103, 232, 249, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative p-4 sm:p-5 md:p-6 border bg-gradient-to-br from-white/8 to-white/4 border-white/10 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm"
            >
              {/* Project Type Badge */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-medium text-purple-300 rounded-full bg-purple-500/20 truncate max-w-[120px]"
                >
                  {request.project_type}
                </motion.span>
              </div>

              {/* Project Name and Status */}
              <div className="mb-3 sm:mb-4 mt-6 sm:mt-0">
                <h3 className="text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text truncate pr-2">
                  {request.project_name || t('websiteDashboard.untitledProject', 'Untitled Project')}
                </h3>
                <span
                  className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 mt-1 sm:mt-2 text-xs font-semibold rounded-full ${
                    request.status === 'pending'
                      ? 'bg-gray-500/20 text-gray-400'
                      : request.status === 'in_progress'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : request.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : request.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-300/20 text-gray-500' // Default color if status doesn't match
                  }`}
                >
                  {t(`websiteDashboard.status.${request.status.replace('_', '')}`, request.status.replace('_', ' ').toUpperCase())}
                </span>
              </div>

              {/* Description */}
              <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-300 line-clamp-2">
                {request.project_description}
              </p>

              {/* Technologies */}
              <div className="mb-3 sm:mb-4">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {request.framework?.split(',').slice(0, 3).map((tech, index) => (
                    <motion.span 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index + 0.3 }}
                      key={index} 
                      className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-300 truncate max-w-[100px]"
                    >
                      {tech.trim()}
                    </motion.span>
                  ))}
                  {request.framework?.split(',').length > 3 && (
                    <motion.span 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-300"
                    >
                      +{request.framework.split(',').length - 3} {t('websiteDashboard.more', 'more')}
                    </motion.span>
                  )}
                </div>
              </div>
              
              {/* Metadata */}
              <div className="flex items-center justify-between pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-white/10">
                <div className="text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <IoWalletOutline className="text-cyan-500" />
                    <span className="font-medium text-cyan-400">${request.amount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <IoTimeOutline className="text-purple-400" />
                    <span>{t('websiteDashboard.due', 'Due')}: {formatDate(request.deadline)}</span>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(8, 145, 178, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewDetails(request)}
                  className="p-1.5 sm:p-2 transition-all duration-300 rounded-full hover:bg-cyan-500/20 group"
                  title={t('websiteDashboard.buttons.viewDetails', 'View Details')}
                >
                  <IoEyeOutline className="w-5 h-5 sm:w-6 sm:h-6 transition-transform text-cyan-400 group-hover:scale-110" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="flex justify-center p-4 sm:p-6 sm:hidden">
          <motion.button 
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate('/WebForm')}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-white transition-all shadow-xl rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-cyan-500/50"
          >
            <IoAddCircleOutline className="w-5 h-5 sm:w-6 sm:h-6" />
            {t('websiteDashboard.buttons.newWebsiteRequest', 'New Website Request')}
          </motion.button>
        </div>
      </div>
    );
  };

  const RequestDetailsModal = () => {
    if (!selectedRequest) return null;

    const modalVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration: 0.2,
          when: "beforeChildren"
        } 
      },
      exit: { 
        opacity: 0,
        transition: { 
          duration: 0.2,
          when: "afterChildren" 
        } 
      }
    };

    const contentVariants = {
      hidden: { opacity: 0, y: 20, scale: 0.98 },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
          type: "spring",
          damping: 25,
          stiffness: 300
        }
      },
      exit: { 
        opacity: 0, 
        y: 20,
        scale: 0.98,
        transition: { 
          duration: 0.2
        }
      }
    };

    return (
      <AnimatePresence>
        <motion.div 
          key="modal-backdrop"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedRequest(null)}
        >
          <motion.div 
            key="modal-content"
            variants={contentVariants}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl p-4 sm:p-6 md:p-8 border bg-gradient-to-br from-black/80 to-purple-900/30 border-white/20 rounded-xl sm:rounded-2xl backdrop-blur-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(8, 145, 178, 0.2)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute text-white transition-colors p-1 rounded-full top-3 right-3 sm:top-4 sm:right-4 hover:text-cyan-400 hover:bg-white/10"
            >
              <IoCloseOutline className="w-6 h-6" />
            </motion.button>
            
            <div className="flex items-start sm:items-center mb-4 sm:mb-6">
              <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mr-3 sm:mr-4">
                <IoRocketOutline className="text-cyan-400 w-8 h-8 sm:w-10 sm:h-10 md:w-[40px] md:h-[40px] flex-shrink-0" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                  {selectedRequest.project_name || selectedRequest.project_type}
                </h2>
                <span
                  className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 mt-1 sm:mt-2 text-xs font-semibold rounded-full ${
                    selectedRequest.status === 'pending'
                      ? 'bg-gray-500/20 text-gray-400'
                      : selectedRequest.status === 'in_progress' || selectedRequest.status === 'In Progress'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : selectedRequest.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : selectedRequest.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-300/20 text-gray-500' // Default color if status doesn't match
                  }`}
                >
                  {t(`websiteDashboard.status.${selectedRequest.status.replace('_', '')}`, selectedRequest.status.replace('_', ' ').toUpperCase())}
                </span>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 text-gray-300 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <IoDocumentTextOutline className="text-purple-400" />
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-400">
                    {t('websiteDashboard.modal.projectDescription', 'Project Description')}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-200 ml-6">{selectedRequest.project_description}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <IoDocumentTextOutline className="text-cyan-400" />
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-400">
                    {t('websiteDashboard.modal.message', 'Message')}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-200 ml-6">{selectedRequest.message}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <IoCodeSlashOutline className="text-blue-400" />
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-400">
                    {t('websiteDashboard.modal.technologies', 'Technologies')}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-6">
                  {selectedRequest.framework?.split(',').map((tech, index) => (
                    <motion.span 
                      key={index} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="px-2 py-1 text-xs sm:text-sm rounded-md bg-cyan-500/20 text-cyan-300"
                    >
                      {tech.trim()}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <IoWalletOutline className="text-green-400" />
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-400">
                      {t('websiteDashboard.modal.budget', 'Budget')}
                    </h3>
                  </div>
                  <p className="text-lg sm:text-xl font-medium text-cyan-400 ml-6">${selectedRequest.amount}</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <IoTimeOutline className="text-yellow-400" />
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-400">
                      {t('websiteDashboard.modal.deadline', 'Deadline')}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-200 ml-6">{formatDate(selectedRequest.deadline)}</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <IoLayersOutline className="text-pink-400" />
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-400">
                    {t('websiteDashboard.modal.features', 'Features')}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-200 ml-6">{selectedRequest.features}</p>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end mt-6"
            >
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap" 
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg"
              >
                {t('websiteDashboard.buttons.close', 'Close')}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (showRequestForm) {
    return <Bizweb onClose={() => setShowRequestForm(false)} />;
  }

  return (
    <div className="flex min-h-screen bg-black overflow-x-hidden">
      <SideNavbar />
      <div className="relative flex-1 min-h-screen overflow-hidden bg-black w-full ml-0 sm:ml-[70px] md:ml-4">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl"
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen p-3 sm:p-4 pt-16 sm:pt-8 md:pt-4 lg:p-8 w-full">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6 lg:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text ml-0 sm:ml-2 md:ml-10">
              {t('websiteDashboard.title', 'BizWeb')}
            </h1>
            <p className="max-w-full mt-2 sm:mt-3 text-sm sm:text-base text-gray-300">
              {t('websiteDashboard.subtitle', 'Transform your digital presence with custom website solutions. Track, manage, and create website requests tailored to your business needs.')}
            </p>
          </motion.header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-grow overflow-hidden border bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border-white/10 w-full shadow-2xl"
          >
            {renderRequestTable()}
          </motion.div>
        </div>

        {selectedRequest && <RequestDetailsModal />}
      </div>
    </div>
  );
};

export default WebsiteRequestDashboard;