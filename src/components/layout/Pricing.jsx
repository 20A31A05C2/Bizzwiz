import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import useScrollAnimation from "./useScrollanimation";
import ApiService from "../../Apiservice"; // Adjust the path as needed
import { toast } from "react-toastify";

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [headerRef, headerVisible] = useScrollAnimation();
  const [toggleRef, toggleVisible] = useScrollAnimation();
  const [plansRef, plansVisible] = useScrollAnimation();
  
  // States for API data
  const [apiPlans, setApiPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pricing plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await ApiService("/pricing/plans", "GET");
        
        if (response.success && response.plans && response.plans.length > 0) {
          setApiPlans(response.plans);
          
          // Find popular plan or default to first plan
          const popularPlan = response.plans.find(plan => plan.is_popular);
          setSelectedPlan(popularPlan ? popularPlan.name : response.plans[0].name);
        } else {
          console.error("No pricing plans available");
          toast?.error?.("Could not load pricing plans.");
        }
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
        toast?.error?.("Could not load pricing plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Convert API plans to the format expected by the UI
  const formatApiPlans = () => {
    return apiPlans.map(plan => ({
      name: plan.name,
      price: isMonthly ? `€${plan.monthly_price}` : `€${plan.annual_price}`,
      features: plan.features,
      isPopular: plan.is_popular
    }));
  };
  
  // Use API plans 
  const plans = formatApiPlans();

  return (
    <div className="min-h-screen p-4 mt-20 overflow-x-hidden bg-black md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div
          ref={headerRef}
          className={`text-center space-y-4 transform transition-all duration-1000 ${
            headerVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="mb-10 text-5xl font-bold text-white">Pricing</h1>
          <h3 className="mx-auto mb-5" style={{ maxWidth: "350px" }}>
            An innovative program to optimize your costs and propel you into the digital world of tomorrow.
          </h3>
        </div>

        <div
          ref={toggleRef}
          className={`flex items-center justify-center gap-4 mb-16 transform transition-all duration-1000 delay-200 ${
            toggleVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <span className={`text-sm ${isMonthly ? "text-white" : "text-gray-400"}`}>Pay Monthly</span>
          <button
            onClick={() => setIsMonthly(!isMonthly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:bg-gray-700 ${
              isMonthly ? "bg-black" : "bg-purple-600"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
              isMonthly ? "translate-x-1 bg-purple-600" : "translate-x-6 bg-white"
            }`} />
          </button>
          <span className={`text-sm ${!isMonthly ? "text-white" : "text-gray-400"}`}>Pay Annually</span>
        </div>

        <div
          ref={plansRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transform transition-all duration-1000 delay-300 ${
            plansVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.name;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col min-h-[500px] rounded-lg p-6 text-white 
                  transition-all duration-500 hover:transform hover:-translate-y-2 overflow-hidden
                  group
                  ${isSelected ? "shadow-[0_0_150px_rgb(140,69,255,0.5)]" : ""}`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg 
                    z-10 group-hover:bg-purple-500 transition-colors duration-300">
                    Popular
                  </div>
                )}
                
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isSelected ? "opacity-100" : "opacity-0"
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/30 to-purple-800/50" />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: "70px 70px",
                      mask: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.8))",
                      WebkitMask: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.8))",
                    }}
                  />
                </div>

                <div className={`absolute inset-0 bg-black border border-gray-800 rounded-lg transition-opacity duration-500 ${
                  isSelected ? "opacity-0" : "opacity-100"
                }`} />

                <div className="relative space-y-4">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-400">
                      {isMonthly ? "/mo" : "/yr"}
                    </span>
                  </div>
                </div>

                <ul className="relative flex-grow my-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={`${plan.name}-feature-${index}`} className="flex items-center gap-2">
                      <FaCheck className={`h-5 w-5 ${isSelected ? "text-purple-400" : "text-gray-500"}`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`relative w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 
                    ${isSelected 
                      ? "bg-purple-600/80 hover:bg-purple-500/80 backdrop-blur-sm transform hover:scale-105"
                      : "bg-gray-800 hover:bg-gray-700"
                    }`}
                >
                  Join the program
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;