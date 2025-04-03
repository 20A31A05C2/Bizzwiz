import { useEffect, useState } from 'react';
import { 
  FileText, Upload, Code2, Calendar, X, CheckSquare, Loader2, 
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import SideNavbar from '../userlayout/sidebar';
import ApiService from '../../../Apiservice';
import { useNavigate } from 'react-router-dom';


const ProjectRequestForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    project_name: '',
    project_type: '',
    project_description: '',
    framework: '',
    features: '',
    deadline: '',
    amount: '',
    terms_accepted: false,
    files: []
  });

  useEffect(() => {
    const checkLogin = async () => {
      if (!localStorage.getItem('bizwizusertoken')) {
        navigate('/userlogin');
        toast.error("Please Login Again");
        return;
      }
      
      try {
        await ApiService('/checklogin', 'POST');
      } catch (error) {
        const errorMessage = error?.response?.data?.message || "Unknown error occurred";
        
        toast.error(errorMessage || "An unexpected error occurred");
        
        if (errorMessage?.toLowerCase().includes('login') || 
            errorMessage?.toLowerCase().includes('token') || 
            errorMessage?.toLowerCase().includes('auth')) {
          localStorage.removeItem('token');
          
        }
        navigate('/userlogin');
        toast.error(errorMessage || "An unexpected error occurred");
      }
    };

    checkLogin();
  }, [navigate]);

  const projectTypes = [
    { value: 'web', label: 'Web Application' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'desktop', label: 'Desktop Software' },
    { value: 'ecommerce', label: 'E-commerce Platform' },
    { value: 'enterprise', label: 'Enterprise Solution' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const validFiles = Array.from(files).filter(file => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          toast.error(`File too large: ${file.name} (max 10MB)`);
          return false;
        }
        return true;
      });

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    const newErrors = {};
    
    if (!formData.project_name?.trim()) {
      newErrors.project_name = 'Project name is required';
    }
    if (!formData.project_type?.trim()) {
      newErrors.project_type = 'Project type is required';
    }
    if (!formData.project_description?.trim()) {
      newErrors.project_description = 'Project description is required';
    }
    if (!formData.framework?.trim()) {
      newErrors.framework = 'Framework details are required';
    }
    if (!formData.features?.trim()) {
      newErrors.features = 'Features are required';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.terms_accepted) {
      newErrors.terms_accepted = 'Terms acceptance is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      formDataToSend.append('project_name', formData.project_name.trim());
      formDataToSend.append('project_type', formData.project_type.trim());
      formDataToSend.append('project_description', formData.project_description.trim());
      formDataToSend.append('framework', formData.framework.trim());
      formDataToSend.append('features', formData.features.trim());
      formDataToSend.append('deadline', formData.deadline);
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('terms_accepted', formData.terms_accepted);

      // Append files
      formData.files.forEach((file, index) => {
        formDataToSend.append(`files[${index}]`, file);
      });

      const response = await ApiService('/bizwizai', 'POST', formDataToSend, true);

      if (response.status === 200) {
        toast.success('Project request submitted successfully');
        // Reset form
        setFormData({
          project_name: '',
          project_type: '',
          project_description: '',
          framework: '',
          features: '',
          deadline: '',
          amount: '',
          terms_accepted: false,
          files: []
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const validationErrors = error.response.data.errors;
        const newErrors = {};
        Object.keys(validationErrors).forEach(key => {
          newErrors[key] = validationErrors[key][0];
        });
        setErrors(newErrors);
        toast.error('Please correct the highlighted errors');
      } else {
        toast.error(error.message || 'Failed to submit project request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavbar />
      
      <div className="relative flex-1 w-full min-h-screen p-2 overflow-x-hidden md:p-4">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent blur-3xl animate-pulse" />
          <div className="absolute inset-0 delay-1000 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="p-3 text-center md:p-6 animate-fadeIn">
              <h1 className="mb-2 text-xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                Project Request Form
              </h1>
              <p className="text-xs text-gray-400 md:text-sm">
                Tell us about your project
              </p>
            </div>

            {/* Project Details */}
            <div className="p-3 transition-all duration-300 border md:p-4 rounded-xl bg-black/50 backdrop-blur-sm border-white/20 hover:border-cyan-500/50">
              <div className="flex items-center mb-4 space-x-2">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <h2 className="text-base font-semibold text-white md:text-lg">
                  Project Details
                </h2>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Project Name */}
                  <div className="w-full">
                    <label className="block mb-1.5 text-xs font-medium text-gray-300 md:text-sm">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="project_name"
                      value={formData.project_name}
                      onChange={handleInputChange}
                      className={`w-full text-xs md:text-sm text-white transition-all duration-200 
                        border rounded-lg bg-white/5 border-white/10 
                        focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 
                        hover:bg-white/10 p-2 md:p-2.5 ${errors.project_name ? 'border-red-500' : ''}`}
                      placeholder="Enter project name"
                    />
                    {errors.project_name && (
                      <p className="mt-1 text-xs text-red-400">{errors.project_name}</p>
                    )}
                  </div>

                  {/* Project Type */}
                  <div className="w-full">
                    <label className="block mb-1.5 text-xs font-medium text-gray-300 md:text-sm">
                      Project Type
                    </label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleInputChange}
                      className={`w-full p-2 md:p-2.5 text-xs md:text-sm text-white transition-all duration-200 
                        border rounded-lg bg-white/5 border-white/10 
                        focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 
                        hover:bg-white/10 ${errors.project_type ? 'border-red-500' : ''}`}
                    >
                      <option value="" className="bg-gray-900">Select Project Type</option>
                      {projectTypes.map(type => (
                        <option 
                          key={type.value} 
                          value={type.value}
                          className="bg-gray-900"
                        >
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.project_type && (
                      <p className="mt-1 text-xs text-red-400">{errors.project_type}</p>
                    )}
                  </div>
                </div>

                {/* Project Description */}
                <div className="w-full">
                  <label className="block mb-1.5 text-xs font-medium text-gray-300 md:text-sm">
                    Project Description
                  </label>
                  <textarea
                    name="project_description"
                    value={formData.project_description}
                    onChange={handleInputChange}
                    className={`w-full p-3 text-xs text-white transition-all duration-200 border rounded-lg 
                      md:text-sm bg-white/5 border-white/10 focus:border-purple-500 focus:outline-none 
                      focus:ring-1 focus:ring-purple-500 hover:bg-white/10 ${errors.project_description ? 'border-red-500' : ''}`}
                    rows={5}
                    placeholder="Describe your project in detail"
                  />
                  {errors.project_description && (
                    <p className="mt-1 text-xs text-red-400">{errors.project_description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Requirements */}
            <div className="p-3 transition-all duration-300 border md:p-4 rounded-xl bg-black/50 backdrop-blur-sm border-white/20 hover:border-purple-500/50">
              <div className="flex items-center mb-4 space-x-2">
                <Code2 className="w-4 h-4 text-purple-400 md:w-5 md:h-5" />
                <h2 className="text-base font-semibold text-white md:text-lg">
                  Technical Requirements
                </h2>
              </div>
              
              <div className="grid gap-4">
                {/* Framework */}
                <div className="w-full">
                  <label className="block mb-1.5 text-xs font-medium text-gray-300 md:text-sm">
                    Framework Preferences
                  </label>
                  <textarea
                    name="framework"
                    value={formData.framework}
                    onChange={handleInputChange}
                    className={`w-full p-3 text-xs text-white transition-all duration-200 border rounded-lg 
                      md:text-sm bg-white/5 border-white/10 focus:border-purple-500 focus:outline-none 
                      focus:ring-1 focus:ring-purple-500 hover:bg-white/10 ${errors.framework ? 'border-red-500' : ''}`}
                    placeholder="List preferred frameworks or technologies"
                  />
                  {errors.framework && (
                    <p className="mt-1 text-xs text-red-400">{errors.framework}</p>
                  )}
                </div>

                {/* Features */}
                <div className="w-full">
                  <label className="block mb-1.5 text-xs font-medium text-gray-300 md:text-sm">
                    Key Features
                  </label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    className={`w-full p-3 text-xs text-white transition-all duration-200 border rounded-lg 
                      md:text-sm bg-white/5 border-white/10 focus:border-purple-500 focus:outline-none 
                      focus:ring-1 focus:ring-purple-500 hover:bg-white/10 ${errors.features ? 'border-red-500' : ''}`}
                    placeholder="List main features required"
                  />
                  {errors.features && (
                    <p className="mt-1 text-xs text-red-400">{errors.features}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline & Budget */}
            {/* Continuing from Timeline & Budget section */}
            <div className="p-3 transition-all duration-300 border md:p-4 rounded-xl bg-black/50 backdrop-blur-sm border-white/20 hover:border-cyan-500/50">
              <div className="flex items-center mb-4 space-x-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <h2 className="text-base font-semibold text-white md:text-lg">
                  Timeline & Budget
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* Deadline */}
                <div className="w-full">
                  <label className="block mb-1.5 text-xs font-medium text-gray-300 md:text-sm">
                    Project Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className={`w-full p-2 md:p-2.5 text-xs md:text-sm text-white transition-all duration-200 
                      border rounded-lg bg-white/5 border-white/10 
                      focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 
                      hover:bg-white/10 ${errors.deadline ? 'border-red-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-xs text-red-400">{errors.deadline}</p>
                  )}
                </div>

                {/* Budget */}
                <div className="w-full">
                  <label className="block mb-1.5 text-xs font-medium text-gray-300 md:text-sm">
                    Budget Amount (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className={`w-full pl-8 pr-3 py-2 md:py-2.5 text-xs md:text-sm text-white transition-all duration-200 
                        border rounded-lg bg-white/5 border-white/10 
                        focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 
                        hover:bg-white/10 ${errors.amount ? 'border-red-500' : ''}`}
                      placeholder="Enter budget amount"
                      min="0"
                      step="100"
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-xs text-red-400">{errors.amount}</p>
                  )}
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="p-3 transition-all duration-300 border md:p-4 rounded-xl bg-black/50 backdrop-blur-sm border-white/20 hover:border-purple-500/50">
              <div className="flex items-center mb-4 space-x-2">
                <Upload className="w-4 h-4 text-purple-400 md:w-5 md:h-5" />
                <h2 className="text-base font-semibold text-white md:text-lg">
                  Project Files
                </h2>
              </div>

              <div className="relative p-4 transition-transform transform border-2 border-dashed rounded-xl border-white/20 hover:border-purple-500 hover:scale-[1.01] group">
                <input
                  type="file"
                  multiple
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                />
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-purple-400 transition-transform animate-bounce group-hover:scale-110 md:w-10 md:h-10" />
                  <p className="mt-3 text-xs text-gray-300 md:text-sm">
                    Drop files here or click to browse
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Supported: PDF, DOC, DOCX, TXT, CSV, XLS, XLSX (Max 10MB)
                  </p>
                </div>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.files.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 text-xs transition-all rounded-lg md:text-sm md:p-3 bg-white/5 hover:bg-white/10"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="flex-shrink-0 w-4 h-4 text-purple-400" />
                        <span className="text-gray-300 truncate">{file.name}</span>
                        <span className="text-gray-400">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-500 transition-colors rounded-full hover:bg-red-500/10"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms and Submit */}
            <div className="p-3 transition-all duration-300 border md:p-4 rounded-xl bg-black/50 backdrop-blur-sm border-white/20 hover:border-purple-500/50">
              <div className="p-3 mb-4 border rounded-lg border-white/10 bg-white/5">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={handleInputChange}
                    className={`mt-1 text-purple-500 transition-colors border-2 rounded border-white/20 
                      focus:ring-purple-500 focus:ring-offset-0 ${errors.terms_accepted ? 'border-red-500' : ''}`}
                  />
                  <span className="text-xs text-gray-300 md:text-sm">
                    I agree to the terms and conditions of the project request, including project timeline,
                    deliverables, and payment terms as discussed.
                  </span>
                </label>
                {errors.terms_accepted && (
                  <p className="mt-1 text-xs text-red-400 animate-fadeIn">{errors.terms_accepted}</p>
                )}
              </div>

              {isSubmitting && (
                <div className="mb-4">
                  <div className="h-1 mb-2 overflow-hidden rounded-full bg-white/10">
                    <div className="w-1/2 h-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-progress"></div>
                  </div>
                  <p className="text-xs text-center text-gray-400 md:text-sm">
                    Processing your request...
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-2 text-sm font-semibold text-white transition-all transform border rounded-lg md:text-base md:p-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Submit Request</span>
                    <CheckSquare className="w-4 h-4 transition-transform md:w-5 md:h-5 group-hover:scale-110" />
                  </div>
                )}
              </button>

              <p className="mt-4 text-xs text-center text-gray-400 md:text-sm">
                Your request will be reviewed within 24-48 hours
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectRequestForm;