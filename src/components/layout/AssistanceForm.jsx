import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';

const AssistanceForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dateAvailability: '',
    timeAvailability: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  
  // Set loaded state after component mounts for initial animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Add submit animation
    document.querySelector('.submit-button').classList.add('submitting');
    
    // Form validation
    if (!formData.fullName || !formData.phoneNumber || !formData.dateAvailability || !formData.timeAvailability) {
      setTimeout(() => {
        document.querySelector('.submit-button').classList.remove('submitting');
        alert('Veuillez remplir tous les champs');
        setIsSubmitting(false);
      }, 500);
      return;
    }
    
    // Simulate form submission with animation
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      document.querySelector('.submit-button').classList.remove('submitting');
      document.querySelector('.submit-button').classList.add('success');
      
      setTimeout(() => {
        alert('Rendez-vous réservé avec succès!');
        document.querySelector('.submit-button').classList.remove('success');
        setFormData({
          fullName: '',
          phoneNumber: '',
          dateAvailability: '',
          timeAvailability: ''
        });
      }, 1000);
    }, 1500);
  };
  
  // Toggle date picker when the icon is clicked
  const toggleDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.focus();
      dateInputRef.current.showPicker && dateInputRef.current.showPicker();
    }
  };
  
  // Toggle time picker when the icon is clicked
  const toggleTimePicker = () => {
    if (timeInputRef.current) {
      timeInputRef.current.focus();
      timeInputRef.current.showPicker && timeInputRef.current.showPicker();
    }
  };
  
  // Generate animation delay based on index
  const getAnimationDelay = (index) => {
    return `${0.2 + (index * 0.1)}s`;
  };
  
  // Custom input styles based on focus state
  const getInputClasses = (fieldName) => {
    return `w-full bg-transparent border ${
      focusedField === fieldName 
        ? 'border-purple-500 shadow-glow' 
        : 'border-purple-900/30'
    } rounded-md py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent transition-all duration-300`;
  };
  
  return (
    <div className={`bg-black text-white min-h-screen transition-opacity duration-700 ease-in-out ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      <Header />
      
      <div className="flex justify-center items-center pt-12">
        <div className="w-full max-w-md px-4">
          <div className={`flex justify-center items-center mb-8 transform transition-all duration-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="text-2xl font-semibold flex items-center justify-center space-x-2">
              <span className="text-yellow-300 mr-2 animate-pulse">⚡</span>
              <span>Assistance</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Full Name Field */}
            <div 
              className="space-y-2 custom-fadeIn"
              style={{ 
                animationDelay: getAnimationDelay(0),
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: getAnimationDelay(0)
              }}
            >
              <label className="block text-gray-300 text-sm font-medium mb-1">Nom Prénom :</label>
              <input
                type="text"
                name="fullName"
                placeholder="Noms complets"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => handleFocus('fullName')}
                onBlur={handleBlur}
                className={getInputClasses('fullName')}
              />
            </div>
            
            {/* Phone Number Field */}
            <div 
              className="space-y-2 custom-fadeIn"
              style={{ 
                animationDelay: getAnimationDelay(1),
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: getAnimationDelay(1)
              }}
            >
              <label className="block text-gray-300 text-sm font-medium mb-1">Numéro de téléphone :</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Numéro de téléphone"
                value={formData.phoneNumber}
                onChange={handleChange}
                onFocus={() => handleFocus('phoneNumber')}
                onBlur={handleBlur}
                className={getInputClasses('phoneNumber')}
              />
            </div>
            
            {/* Date Field */}
            <div 
              className="space-y-2 custom-fadeIn"
              style={{ 
                animationDelay: getAnimationDelay(2),
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: getAnimationDelay(2)
              }}
            >
              <label className="block text-gray-300 text-sm font-medium mb-1">Votre disponibilité :</label>
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  name="dateAvailability"
                  value={formData.dateAvailability}
                  onChange={handleChange}
                  onFocus={() => handleFocus('dateAvailability')}
                  onBlur={handleBlur}
                  min={new Date().toISOString().split('T')[0]}
                  className={getInputClasses('dateAvailability')}
                />
                <div 
                  onClick={toggleDatePicker}
                  className="absolute right-3 top-3 text-purple-500 hover:text-purple-400 transition-colors duration-200 cursor-pointer transform hover:scale-110"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Time Field */}
            <div 
              className="space-y-2 custom-fadeIn"
              style={{ 
                animationDelay: getAnimationDelay(3),
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: getAnimationDelay(3)
              }}
            >
              <label className="block text-gray-300 text-sm font-medium mb-1">Votre disponibilité :</label>
              <div className="relative">
                <input
                  ref={timeInputRef}
                  type="time"
                  name="timeAvailability"
                  value={formData.timeAvailability}
                  onChange={handleChange}
                  onFocus={() => handleFocus('timeAvailability')}
                  onBlur={handleBlur}
                  className={getInputClasses('timeAvailability')}
                />
                <div 
                  onClick={toggleTimePicker}
                  className="absolute right-3 top-3 text-purple-500 hover:text-purple-400 transition-colors duration-200 cursor-pointer transform hover:scale-110"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div 
              className="pt-4 custom-fadeIn"
              style={{ 
                animationDelay: getAnimationDelay(4),
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: getAnimationDelay(4)
              }}
            >
              <div
                onClick={!isSubmitting ? handleSubmit : undefined}
                className={`submit-button w-full bg-purple-700 text-white font-medium py-3 px-4 rounded-md relative overflow-hidden group transition-all duration-300 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </>
                  ) : (
                    "Prendre rendez-vous"
                  )}
                </span>
                
                {/* Button Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Success indicator */}
                <svg className="success-icon absolute inset-0 m-auto h-6 w-6 text-white transform scale-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Custom animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .custom-fadeIn {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        /* Override default date/time picker styles */
        input[type="date"], input[type="time"] {
          color-scheme: dark;
        }
        
        /* Hide default date/time picker icons in some browsers */
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        
        /* Style placeholder text */
        input::placeholder {
          color: #6B7280;
        }
        
        /* Glowing effect for focused inputs */
        .shadow-glow {
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
        }
        
        /* Button animations */
        .submit-button.submitting {
          transform: scale(0.98);
        }
        
        .submit-button.success {
          background-color: #10B981;
          border-color: #10B981;
        }
        
        .submit-button.success span {
          opacity: 0;
        }
        
        .submit-button.success .success-icon {
          transform: scale(1);
        }
      `}</style>
    </div>
  );
};

export default AssistanceForm;