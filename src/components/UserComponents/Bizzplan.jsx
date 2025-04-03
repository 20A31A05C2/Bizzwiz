import { useState, useEffect } from 'react';
import { 
  IoAddCircleOutline, 
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoEyeOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoHourglassOutline
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import SideNavbar from './userlayout/sidebar';
import ApiService from '../../Apiservice';
import Background from "../../assets/background.png";

const Bizzplan = () => {
  const [businessPlans, setBusinessPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = currentUser?.id;

  // Fetch user's business plans
  useEffect(() => {
    const fetchBusinessPlans = async () => {
      setLoading(true);
      try {
        // Uncomment this when API endpoint is ready
        // const response = await ApiService("/business-plans", "GET", { user_id: userId });
        // if (response.success) {
        //   setBusinessPlans(response.data);
        // }
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockPlans = [
            {
              id: 1,
              name: 'Tech Startup Plan',
              status: 'Completed',
              createdAt: '2024-01-20',
              prompt: 'Create a business plan for a SaaS company focused on AI-powered marketing analytics.',
              industry: 'Technology',
              targetMarket: 'B2B Marketing Teams',
              preview: '/api/placeholder/400/300',
              downloadUrl: '#',
              tags: ['SaaS', 'Tech', 'AI']
            },
            {
              id: 2,
              name: 'Eco-Friendly Restaurant',
              status: 'In Progress',
              createdAt: '2024-01-28',
              prompt: 'Develop a business plan for a sustainable farm-to-table restaurant concept in urban areas.',
              industry: 'Food & Hospitality',
              targetMarket: 'Urban Millennials',
              preview: '/api/placeholder/400/300',
              downloadUrl: '#',
              tags: ['Sustainable', 'Restaurant', 'Organic']
            },
            {
              id: 3,
              name: 'Online Fitness Platform',
              status: 'Completed',
              createdAt: '2024-01-15',
              prompt: 'Create a comprehensive business plan for a subscription-based online fitness platform with personalized training programs.',
              industry: 'Health & Fitness',
              targetMarket: 'Health-conscious professionals',
              preview: '/api/placeholder/400/300',
              downloadUrl: '#',
              tags: ['Fitness', 'Digital', 'Subscription']
            }
          ];
          setBusinessPlans(mockPlans);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch business plans:", error);
        setLoading(false);
      }
    };

    fetchBusinessPlans();
  }, [userId]);

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <IoCheckmarkCircleOutline className="mr-1" />;
      case 'In Progress':
        return <IoHourglassOutline className="mr-1" />;
      default:
        return null;
    }
  };

  const renderBusinessPlanGrid = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-12 text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading your business plans...</p>
        </div>
      );
    }

    if (businessPlans.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <IoDocumentTextOutline className="w-20 h-20 mb-6 text-gray-500 opacity-50" />
          <h2 className="mb-4 text-2xl font-semibold text-white">No Business Plan Requests Yet</h2>
          <p className="max-w-md mb-6 text-gray-400">
            Start your business planning journey by creating your first AI-powered Business Plan.
            We'll help you develop a comprehensive strategy for your venture.
          </p>
          <button 
            onClick={() => navigate('/planprompt')}
            className="flex items-center gap-3 px-6 py-3 text-white transition-all duration-300 transform shadow-xl rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 hover:from-cyan-600 hover:to-purple-600 hover:shadow-cyan-500/50"
          >
            <IoAddCircleOutline size={24} />
            Create First Business Plan
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          {businessPlans.map((plan) => (
            <div 
              key={plan.id} 
              className="relative p-5 transition-all duration-300 transform border bg-white/5 border-white/10 rounded-xl hover:scale-102 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white truncate" title={plan.name}>
                  {plan.name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full font-semibold flex items-center
                  ${plan.status === 'In Progress' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-green-500/20 text-green-400'}`}
                >
                  {getStatusIcon(plan.status)}
                  {plan.status}
                </span>
              </div>
              
              <div className="mb-3 text-gray-300 line-clamp-3 text-sm">
                <p title={plan.prompt}>
                  <span className="font-semibold text-cyan-400">Prompt: </span>
                  {plan.prompt}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {plan.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div>
                  <div className="flex items-center">
                    <span className="opacity-70">Industry: </span>
                    <span className="ml-1 text-white">{plan.industry}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <IoTimeOutline className="mr-1" />
                    <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewDetails(plan)}
                    className="p-1.5 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    title="View Details"
                  >
                    <IoEyeOutline size={18} />
                  </button>
                  {plan.status === 'Completed' && (
                    <button 
                      className="p-1.5 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                      title="Download"
                    >
                      <IoDownloadOutline size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center p-6">
          <button 
            onClick={() => navigate('/BizzPlanprompt')}
            className="flex items-center gap-3 px-6 py-3 text-white transition-all duration-300 transform shadow-xl rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 hover:from-cyan-600 hover:to-purple-600 hover:shadow-cyan-500/50"
          >
            <IoAddCircleOutline size={24} />
            New Business Plan
          </button>
        </div>
      </div>
    );
  };

  const PlanDetailsModal = () => {
    if (!selectedPlan) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-3xl p-6 mx-4 border bg-gray-900/90 border-white/20 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{selectedPlan.name}</h2>
            <button 
              onClick={() => setSelectedPlan(null)}
              className="p-1 text-white rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 text-gray-300">
            <div className="p-4 border border-white/10 rounded-lg bg-white/5">
              <h3 className="mb-2 text-lg font-medium text-cyan-400">Prompt</h3>
              <p>{selectedPlan.prompt}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                <h3 className="mb-2 text-lg font-medium text-cyan-400">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Status:</div>
                  <div className={selectedPlan.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}>
                    {selectedPlan.status}
                  </div>
                  <div className="font-medium">Created:</div>
                  <div>{new Date(selectedPlan.createdAt).toLocaleDateString()}</div>
                  <div className="font-medium">Industry:</div>
                  <div>{selectedPlan.industry}</div>
                  <div className="font-medium">Target Market:</div>
                  <div>{selectedPlan.targetMarket}</div>
                </div>
              </div>
              
              <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                <h3 className="mb-2 text-lg font-medium text-cyan-400">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPlan.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 text-sm rounded-full bg-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {selectedPlan.status === 'Completed' ? (
                <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-cyan-500 hover:bg-cyan-600">
                  <IoDownloadOutline size={18} />
                  Download Full Plan
                </button>
              ) : (
                <div className="px-4 py-2 text-sm text-yellow-400 bg-yellow-400/10 rounded-lg">
                  Your plan is still being generated
                </div>
              )}
              <button 
                onClick={() => setSelectedPlan(null)}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-white/10 hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#18001F]">
      <div className="fixed inset-0 z-0 w-full h-full bg-cover bg-center animate-bg-zoom" 
           style={{ backgroundImage: `url(${Background})` }}></div>
      
      <SideNavbar />
      
      <div className="relative flex-1 min-h-screen overflow-hidden">
        {/* Animated gradient bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full opacity-80">
            <div className="absolute top-0 right-0 w-2/3 h-2/3 animate-float-slow">
              <div className="absolute rounded-full w-96 h-96 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-25 blur-3xl"></div>
            </div>
            <div className="absolute top-1/3 left-0 w-2/3 h-2/3 animate-float-medium">
              <div className="absolute rounded-full w-96 h-96 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-25 blur-3xl"></div>
            </div>
            <div className="absolute bottom-0 right-1/4 w-2/3 h-2/3 animate-float-fast">
              <div className="absolute rounded-full w-96 h-96 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-25 blur-3xl"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen p-4 md:pl-20 lg:pl-4 pt-6 lg:p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text animate-shimmer">
              Business Plans
            </h1>
            <p className="max-w-full mt-3 text-gray-300">
              Create comprehensive business plans powered by AI. Generate, manage, and download 
              detailed strategies tailored to your business needs.
            </p>
          </header>

          <div className="flex-grow overflow-hidden border bg-black/30 backdrop-blur-xl rounded-3xl border-white/10">
            {renderBusinessPlanGrid()}
          </div>
        </div>

        {selectedPlan && <PlanDetailsModal />}
      </div>
      
      {/* Custom styles */}
      <style jsx global>{`
        /* Background zoom animation */
        @keyframes bgZoom {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1.1); }
        }
        
        .animate-bg-zoom {
          animation: bgZoom 20s ease-in-out infinite;
        }
        
        /* Floating animations for gradient blobs */
        @keyframes float-slow {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(5%, 3%) rotate(3deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float-medium {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-4%, 2%) rotate(-2deg); }
          66% { transform: translate(2%, -3%) rotate(1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float-fast {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(3%, -2%) rotate(1deg); }
          50% { transform: translate(-1%, -4%) rotate(-1deg); }
          75% { transform: translate(-3%, 1%) rotate(-2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 12s ease-in-out infinite;
        }
        
        /* Shimmer effect for headings */
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 5s infinite;
          background-clip: text;
          -webkit-background-clip: text;
        }
        
        /* Scale animation */
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        /* Line clamping */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Bizzplan;