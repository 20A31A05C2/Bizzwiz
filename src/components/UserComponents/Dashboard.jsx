
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SideNavbar from './userlayout/sidebar';
import anime from '../../assets/man.png';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import ApiService from '../../Apiservice';
import LoadingPage from './userlayout/loader';

const Dashboard = () => {

    const navigate=useNavigate();
    const [name,setname]=useState("");
    const [loading,setloading]=useState(true);

    useEffect(() => {
        const validate = async () => {
          let loadingTimeout;
      
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              toast.error("Please login to continue");
              navigate('/userlogin');
              return;
            }
      
            
            loadingTimeout = setTimeout(() => {
              setloading(true);
            }, 100);
      
            
            const response = await ApiService("/userdashboard", "GET");
            clearTimeout(loadingTimeout);
      
            
            if (response && response.name) {
              setname(response.name);
            } else {
              throw new Error("Invalid response data");
            }
      
          } catch (error) {
            console.log(error);
            clearTimeout(loadingTimeout);
            toast.error(error.message || "An unexpected error occurred");
            if (error.message.toLowerCase().includes('login') || 
                error.message.toLowerCase().includes('token') || 
                error.message.toLowerCase().includes('auth')) {
              localStorage.removeItem('token');
              localStorage.setItem('toastMessage', error.message);
              localStorage.setItem('toastType', 'success');
              navigate('/userlogin');
            }
      
          } finally {
            setloading(false);
          }
        };
      
        
        let mounted = true;
        if (mounted) {
          validate();
        }
      
        return () => {
          mounted = false;
        };
      }, [navigate]);








    
  const trafficData = [
    { name: 'Jan', visitors: 20 },
    { name: 'Feb', visitors: 22 },
    { name: 'Mar', visitors: 28 },
    { name: 'Apr', visitors: 45 },
    { name: 'May', visitors: 42 },
    { name: 'Jun', visitors: 38 },
    { name: 'Jul', visitors: 56 }
  ];

  const adsData = [
    { name: 'JAN', value1: 30, value2: 20 },
    { name: 'FEB', value1: 35, value2: 25 },
    { name: 'MAR', value1: 40, value2: 35 },
    { name: 'APR', value1: 45, value2: 40 },
    { name: 'MAY', value1: 50, value2: 45 },
    { name: 'JUN', value1: 55, value2: 48 },
    { name: 'JUL', value1: 60, value2: 52 },
    { name: 'AUG', value1: 65, value2: 58 },
    { name: 'SEP', value1: 70, value2: 62 },
    { name: 'OCT', value1: 75, value2: 68 },
    { name: 'NOV', value1: 80, value2: 72 },
    { name: 'DEC', value1: 85, value2: 78 }
  ];

  return (
    <div>
        {loading?<LoadingPage name="Loading DashBoard" /> :<div className="flex min-h-screen bg-black">
      <SideNavbar />
      
      <ToastContainer/>
      {/* Main Content - Scrollable */}
      <main className="flex-1 p-8 py-10 overflow-y-auto transition-all duration-300 md:ml-2">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="relative p-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 to-black md:p-12">
            <div className="relative z-10 max-w-xl">
              <h1 className="mb-6 text-3xl font-bold text-white ">
                Welcome,<span className="text-4xl text-purple-400">{name}</span>
              </h1>
              <h2 className="mb-8 text-xl font-medium leading-tight text-white md:text-xl">
                Create your business ultra quickly!
              </h2>
              <button className="px-8 py-3 text-white transition-all duration-200 bg-purple-500 rounded-lg hover:bg-purple-600 hover:transform hover:translate-y-1">
                Get Started
              </button>
            </div>
            
            {/* Background Image */}
            <div className="absolute top-0 right-0 w-1/2 opacity-70 md:opacity-90 md:right-10">
              <img
                src={anime}
                alt="Background"
                className="object-cover w-56 h-64"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
            <div className="p-6 rounded-xl bg-[#2a2435]">
              <p className="text-sm text-gray-400">LOGO GENERATED:</p>
              <p className="mt-2 text-2xl font-bold text-white">1/5</p>
            </div>
            <div className="p-6 rounded-xl bg-[#2a2435]">
              <p className="text-sm text-gray-400">GENERATED PLAN:</p>
              <p className="mt-2 text-2xl font-bold text-white">1/5</p>
            </div>
            <div className="p-6 rounded-xl bg-[#2a2435]">
              <p className="text-sm text-gray-400">WEBSITE CREATED:</p>
              <p className="mt-2 text-2xl font-bold text-white">1/5</p>
            </div>
            <div className="p-6 rounded-xl bg-[#2a2435]">
              <p className="text-sm text-gray-400">BI CREATES:</p>
              <p className="mt-2 text-2xl font-bold text-white">1/5</p>
            </div>
          </div>

          {/* Large Stats Card */}
          <div className="p-6 mt-4 rounded-xl bg-[#2a2435]">
            <p className="text-sm text-gray-400">ADS START:</p>
            <p className="mt-2 text-3xl font-bold text-white">1/10</p>
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            {/* Traffic Chart */}
            <div className="p-6 rounded-xl bg-[#2a2435]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Traffic to your website</h3>
                <select className="px-3 py-1 text-sm text-gray-400 bg-transparent border border-gray-700 rounded-md">
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        background: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ADS AI Stats */}
            <div className="p-6 rounded-xl bg-[#2a2435]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Statistics ADS AI</h3>
                <button className="px-3 py-1 text-sm text-gray-400 border border-gray-700 rounded-md">
                  SEE MORE
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={adsData}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        background: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value1"
                      stroke="#2dd4bf"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="value2"
                      stroke="#ec4899"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>   }
    
    </div>
  );
};

export default Dashboard;