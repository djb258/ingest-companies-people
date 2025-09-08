import axios from 'axios';

// Local API base URL - connects to your Barton Outreach Core API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with CORS-safe configuration for Render
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true, // Required for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CORS-friendly header
  },
});

// Request interceptor with retry logic
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

// Response interceptor with enhanced error handling and retry
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('📄 Response Data:', response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ API Error:', error);
    
    // Retry logic for network errors (up to 3 attempts)
    if (error.code === 'ERR_NETWORK' && !originalRequest._retry && originalRequest._retryCount < 2) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      console.log(`🔄 Retrying request (attempt ${originalRequest._retryCount + 1}/3)`);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
      
      return apiClient(originalRequest);
    }
    
    // Enhanced error categorization
    const enhancedError = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
      isCorsError: error.code === 'ERR_NETWORK' || error.response?.status === 0,
      isNetworkError: error.code === 'ERR_NETWORK',
      isTimeout: error.code === 'ECONNABORTED',
      retryCount: originalRequest._retryCount || 0,
    };
    
    // Specific error logging
    if (enhancedError.isCorsError) {
      console.error('🚫 CORS Error - Check server CORS configuration');
    } else if (enhancedError.isTimeout) {
      console.error('⏰ Timeout Error - Request took too long');
    } else if (error.response?.status >= 500) {
      console.error('🔥 Server Error - Backend issue');
    } else if (error.response?.status >= 400) {
      console.error('📝 Client Error - Check request format');
    }
    
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
export { BASE_URL };