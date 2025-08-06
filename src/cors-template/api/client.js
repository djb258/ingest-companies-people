// Configurable API Client Factory for Render APIs
import axios from 'axios';

/**
 * Creates a configured API client for Render APIs with CORS support
 * @param {Object} config - Configuration options
 * @param {string} config.baseURL - API base URL (required)
 * @param {number} config.timeout - Request timeout in ms (default: 30000)
 * @param {boolean} config.withCredentials - Include credentials (default: true)
 * @param {boolean} config.enableLogging - Enable request/response logging (default: false)
 * @param {number} config.retryAttempts - Number of retry attempts (default: 3)
 * @param {Object} config.customHeaders - Additional headers
 * @returns {AxiosInstance} Configured axios instance
 */
export function createRenderApiClient(config = {}) {
  const {
    baseURL,
    timeout = 30000,
    withCredentials = true,
    enableLogging = false,
    retryAttempts = 3,
    customHeaders = {}
  } = config;

  if (!baseURL) {
    throw new Error('API baseURL is required');
  }

  // Create axios instance with CORS-safe configuration
  const apiClient = axios.create({
    baseURL,
    timeout,
    withCredentials,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CORS-friendly header
      ...customHeaders
    },
  });

  // Request interceptor with optional logging
  apiClient.interceptors.request.use(
    (config) => {
      if (enableLogging) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log('📋 Headers:', config.headers);
        if (config.data) {
          console.log('📦 Data:', config.data);
        }
      }
      return config;
    },
    (error) => {
      if (enableLogging) {
        console.error('❌ Request Error:', error);
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor with enhanced error handling and retry logic
  apiClient.interceptors.response.use(
    (response) => {
      if (enableLogging) {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        console.log('📄 Response Data:', response.data);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      if (enableLogging) {
        console.error('❌ API Error:', error);
      }
      
      // Retry logic for network errors
      if (
        error.code === 'ERR_NETWORK' && 
        !originalRequest._retry && 
        originalRequest._retryCount < (retryAttempts - 1)
      ) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        
        if (enableLogging) {
          console.log(`🔄 Retrying request (attempt ${originalRequest._retryCount + 1}/${retryAttempts})`);
        }
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * Math.pow(2, originalRequest._retryCount - 1))
        );
        
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
        timestamp: new Date().toISOString(),
      };
      
      // Specific error logging
      if (enableLogging) {
        if (enhancedError.isCorsError) {
          console.error('🚫 CORS Error - Check server CORS configuration');
        } else if (enhancedError.isTimeout) {
          console.error('⏰ Timeout Error - Request took too long');
        } else if (error.response?.status >= 500) {
          console.error('🔥 Server Error - Backend issue');
        } else if (error.response?.status >= 400) {
          console.error('📝 Client Error - Check request format');
        }
      }
      
      return Promise.reject(enhancedError);
    }
  );

  return apiClient;
}

// Default client factory using environment variables
export function createDefaultApiClient() {
  const baseURL = import.meta.env.VITE_API_URL;
  const enableLogging = import.meta.env.VITE_ENABLE_API_LOGGING === 'true';
  
  if (!baseURL) {
    console.warn('⚠️ VITE_API_URL not set in environment variables');
    return null;
  }

  return createRenderApiClient({
    baseURL,
    enableLogging,
  });
}

export default createRenderApiClient;