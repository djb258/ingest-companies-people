// Complete CORS Template Package - Main Export
// Drop-in solution for Lovable.dev + Render API integration

// =============================================================================
// COMPONENTS - Ready-to-use UI components
// =============================================================================
export { default as CorsStatus } from './components/CorsStatus';
export { default as ApiConnectionStatus } from './components/ApiConnectionStatus';
export { default as EnhancedApiTester } from './components/EnhancedApiTester';

// =============================================================================
// API CLIENT & SERVICES - Configured API functionality
// =============================================================================
export { 
  createRenderApiClient, 
  createDefaultApiClient 
} from './api/client.js';

export {
  // Core service functions
  checkHealth,
  getData,
  postData,
  insertRecords,
  
  // Company operations
  getCompanies,
  createCompany,
  postMarketingCompanies,
  
  // Apollo operations
  getApolloData,
  postApolloData,
  
  // Configuration utilities
  getApiConfig,
  testConnectivity,
  setApiClient,
  getApiClient,
  
  // Legacy compatibility
  uploadRecords
} from './api/services.js';

// =============================================================================
// UTILITIES - Helper functions and tools
// =============================================================================
export { 
  checkCorsHealth, 
  quickCorsTest, 
  testCorsWithCredentials 
} from './utils/corsDebugger';

export {
  formatRenderInsertPayload,
  formatCompanyPayload,
  formatApolloPayload,
  formatCsvPayload,
  validateRenderPayload,
  getFieldMapping,
  FIELD_MAPPINGS
} from './utils/payloadFormatter.js';

// =============================================================================
// TYPES - TypeScript definitions
// =============================================================================
export type { 
  CorsTestResult, 
  ApiClientConfig,
  CorsStatusProps,
  ApiConnectionStatusProps,
  EnhancedApiTesterProps
} from './types';

// =============================================================================
// LEGACY COMPATIBILITY - For existing integrations
// =============================================================================
// Backward compatibility with old imports
export { createApiClient } from './utils/apiClient';

// =============================================================================
// CONVENIENCE EXPORTS - Quick setup functions
// =============================================================================

/**
 * Quick setup function for new projects
 * Creates a configured API client and returns ready-to-use services
 * @param {string} apiUrl - Your Render API URL
 * @param {Object} options - Optional configuration
 * @returns {Object} Configured services and utilities
 */
export function setupRenderApi(apiUrl: string, options: any = {}) {
  const { enableLogging = false, ...clientOptions } = options;
  
  // Create configured client
  const { createRenderApiClient } = require('./api/client.js');
  const client = createRenderApiClient({
    baseURL: apiUrl,
    enableLogging,
    ...clientOptions
  });
  
  // Set as default client
  const { setApiClient } = require('./api/services.js');
  setApiClient(client);
  
  return {
    client,
    // Import all services with the new client
    ...require('./api/services.js'),
    ...require('./utils/corsDebugger'),
    ...require('./utils/payloadFormatter.js')
  };
}

/**
 * Environment-based setup using VITE_API_URL
 * @returns {Object|null} Configured services or null if no URL set
 */
export function setupFromEnvironment() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const enableLogging = import.meta.env.VITE_ENABLE_API_LOGGING === 'true';
  
  if (!apiUrl) {
    console.warn('⚠️ VITE_API_URL not found in environment variables');
    return null;
  }
  
  return setupRenderApi(apiUrl, { enableLogging });
}

// =============================================================================
// DEFAULT EXPORT - Complete package
// =============================================================================
export default {
  // Components
  CorsStatus: require('./components/CorsStatus').default,
  ApiConnectionStatus: require('./components/ApiConnectionStatus').default,
  EnhancedApiTester: require('./components/EnhancedApiTester').default,
  
  // API functionality
  ...require('./api/client.js'),
  ...require('./api/services.js'),
  
  // Utilities
  ...require('./utils/corsDebugger'),
  ...require('./utils/payloadFormatter.js'),
  
  // Setup functions
  setupRenderApi,
  setupFromEnvironment
};