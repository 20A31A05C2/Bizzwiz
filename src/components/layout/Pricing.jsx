import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import useScrollAnimation from './useScrollanimation';

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [headerRef, headerVisible] = useScrollAnimation();
  const [toggleRef, toggleVisible] = useScrollAnimation();
  const [plansRef, plansVisible] = useScrollAnimation();

  const plans = [
    {
      name: 'Free',
      price: '€0',
      features: ['business creation 1/1', 'logo generator 1/1', 'plan generator 1/1'],
    },
    {
      name: 'Pro',
      price: isMonthly ? '€25' : '€250',
      features: [
        'business creation 3/3',
        'logo generator 3/3',
        'plan generator 3/3',
        'WebSite AI 2/2',
        'Ads AI',
      ],
    },
    {
      name: 'Premium',
      price: isMonthly ? '€150' : '€1500',
      features: [
        'business creation 5/5',
        'logo generator 5/5',
        'plan generator 5/5',
        'WebSite AI 5/5',
        'Ads AI + 50€ offered',
        'Support 24h/24',
      ],
    },
  ];

  return (
    <div className="min-h-screen p-4 bg-black md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header and Toggle sections remain unchanged */}
        <div ref={headerRef} className={`text-center space-y-4 transform transition-all duration-1000 ${
          headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="mb-12 text-5xl font-bold text-white">Pricing</h1>
          <p className="max-w-xl mx-auto mb-5 text-gray-400">
            An innovative program to optimize your costs and propel you into the digital world of tomorrow.
          </p>
        </div>

        <div ref={toggleRef} className={`flex items-center justify-center gap-4 mb-16 transform transition-all duration-1000 delay-200 ${
          toggleVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <span className={`text-sm ${isMonthly ? 'text-white' : 'text-gray-400'}`}>Pay Monthly</span>
          <button
            onClick={() => setIsMonthly(!isMonthly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:bg-gray-700 ${
              isMonthly ? 'bg-black' : 'bg-purple-600'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
              isMonthly ? 'translate-x-1 bg-purple-600' : 'translate-x-6 bg-white'
            }`} />
          </button>
          <span className={`text-sm ${!isMonthly ? 'text-white' : 'text-gray-400'}`}>Pay Annually</span>
        </div>

        <div ref={plansRef} className={`grid grid-cols-1 md:grid-cols-3 gap-6 transform transition-all duration-1000 delay-300 ${
          plansVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.name;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col min-h-[500px] rounded-lg p-6 text-white 
                  transition-all duration-500 hover:transform hover:-translate-y-2 overflow-hidden
                  ${isSelected ? 'shadow-[0_0_150px_rgb(140,69,255,0.5)]' : ''}`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {/* Background gradient and grid for selected card */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isSelected ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* New gradient that starts black and fades to purple */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/30 to-purple-800/50" />
                  
                  {/* Grid pattern with gradient mask for fade-in effect */}
                  <div className="absolute inset-0" 
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '70px 70px',
                      mask: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.8))',
                      WebkitMask: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.8))'
                    }}
                  />
                </div>

                {/* Default background for non-selected cards */}
                <div className={`absolute inset-0 bg-black border border-gray-800 rounded-lg transition-opacity duration-500 ${
                  isSelected ? 'opacity-0' : 'opacity-100'
                }`} />

               
                <div className="relative space-y-4">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-400">
                      {isMonthly ? '/mo' : '/yr'}
                    </span>
                  </div>
                </div>

                <ul className="relative flex-grow my-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <FaCheck className={`h-5 w-5 ${isSelected ? 'text-purple-400' : 'text-gray-500'}`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`relative w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 
                    ${isSelected 
                      ? 'bg-purple-600/80 hover:bg-purple-500/80 backdrop-blur-sm transform hover:scale-105'
                      : 'bg-gray-800 hover:bg-gray-700'
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