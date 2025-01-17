const BaseUrl = "http://127.0.0.1:8000/api";

const ApiService = async (endpoint, method, data = null) => {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(localStorage.getItem('token') && {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                })
            }
        };

        
        if (method !== 'GET' && data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${BaseUrl}${endpoint}`, options);
        const responseData = await response.json();
        

        if (!response.ok) {
            throw new Error(responseData.message || "Something went wrong!");
        }

        return responseData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export default ApiService