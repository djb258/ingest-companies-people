import axios from 'axios';

// Replace with your actual Render API URL
const BASE_URL = process.env.VITE_API_URL || 'https://render-marketing-db.onrender.com';

// Create axios instance with CORS-friendly configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true, // Enable credentials for CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Origin': window.location.origin,
  },
});

// Request interceptor for debugging and auth
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('📋 Headers:', config.headers);
    if (config.data) {
      console.log('📦 Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('📄 Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error - Possible CORS issue');
    }
    
    if (error.response?.status === 0) {
      console.error('🚫 CORS Error - Request blocked by browser');
    }
    
    // Enhanced error object
    const enhancedError = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
      isCorsError: error.code === 'ERR_NETWORK' || error.response?.status === 0,
    };
    
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
export { BASE_URL };