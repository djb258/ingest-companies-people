// Configurable API Client Factory
import axios, { AxiosInstance } from 'axios';
import type { ApiClientConfig } from '../types';

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 30000,
    withCredentials: config.withCredentials ?? true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (config.enableLogging) {
    // Request interceptor for logging
    client.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
          data: config.data,
        });
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    client.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });
        return response;
      },
      (error) => {
        const enhancedError = {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          isCorsError: error.message.includes('CORS') || error.code === 'ERR_NETWORK',
          isNetworkError: error.code === 'ERR_NETWORK' || !error.response,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
          },
        };

        console.error('❌ API Error:', enhancedError);
        return Promise.reject({ ...error, enhancedError });
      }
    );
  }

  return client;
}