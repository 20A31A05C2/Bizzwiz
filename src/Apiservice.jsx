const BaseUrl = "http://127.0.0.1:8000/api";

// Flag to prevent multiple redirects
let isRedirecting = false;

const ApiService = async (endpoint, method, data = null, isFormData = false) => {
    try {
        const options = {
            method,
            headers: {
                'Accept': 'application/json',
                ...(localStorage.getItem('bizwizusertoken') && {
                    'Authorization': `Bearer ${localStorage.getItem('bizwizusertoken')}`
                }),
            }
        };
        
        if (!isFormData) {
            options.headers['Content-Type'] = 'application/json';
        }
        
        if (method !== 'GET' && data) {
            options.body = isFormData ? data : JSON.stringify(data);
        }
        
        const response = await fetch(`${BaseUrl}${endpoint}`, options);
        const responseData = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                // Handle authentication errors
                handleAuthError();
                throw { response: { status: 401, data: responseData } };
            }
            if (response.status === 500) {
                throw new Error("Server error, please try again later.");
            }
            throw new Error(responseData.message || "Something went wrong!");
        }
        
        return responseData;
    } catch (error) {
        if (error.message === "Failed to fetch") {
            throw new Error("Network error, please check your internet connection.");
        }
        if (error.response?.status === 401) {
            // Handle authentication errors
            handleAuthError();
            throw error;
        }
        throw new Error(error.message || "An unexpected error occurred");
    }
};

// Function to handle authentication errors
function handleAuthError() {
    // Prevent multiple redirects
    if (!isRedirecting) {
        isRedirecting = true;
        
        // Clear auth token
        localStorage.removeItem('bizwizusertoken');
        
        // Redirect to login page
        window.location.href = '/userlogin';
        
        // Reset flag after a delay (in case operation is canceled)
        setTimeout(() => {
            isRedirecting = false;
        }, 5000);
    }
}

export default ApiService;