// Generic API Service Functions for Render APIs
import { createDefaultApiClient } from './client.js';

// Create default API client (can be overridden)
let apiClient = createDefaultApiClient();

/**
 * Override the default API client
 * @param {AxiosInstance} newClient - New API client instance
 */
export function setApiClient(newClient) {
  apiClient = newClient;
}

/**
 * Get the current API client
 * @returns {AxiosInstance|null} Current API client
 */
export function getApiClient() {
  return apiClient;
}

// =============================================================================
// HEALTH & STATUS ENDPOINTS
// =============================================================================

/**
 * Check API health status
 * @returns {Promise<Object>} Health check response
 */
export const checkHealth = async () => {
  if (!apiClient) {
    throw new Error('API client not configured. Set VITE_API_URL environment variable.');
  }

  try {
    const response = await apiClient.get('/api/health');
    return {
      success: true,
      data: response.data,
      status: response.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    // Fallback to base endpoint if health endpoint doesn't exist
    try {
      const fallbackResponse = await apiClient.get('/');
      return {
        success: true,
        data: fallbackResponse.data,
        status: fallbackResponse.status,
        fallback: true,
        timestamp: new Date().toISOString()
      };
    } catch (fallbackError) {
      throw error; // Throw original health check error
    }
  }
};

// =============================================================================
// GENERIC CRUD OPERATIONS
// =============================================================================

/**
 * Generic GET request to any endpoint
 * @param {string} endpoint - API endpoint path
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response data
 */
export const getData = async (endpoint, params = {}) => {
  if (!apiClient) {
    throw new Error('API client not configured');
  }

  const response = await apiClient.get(endpoint, { params });
  return {
    success: true,
    data: response.data.data || response.data,
    status: response.status,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generic POST request to any endpoint
 * @param {string} endpoint - API endpoint path
 * @param {Object} data - Request payload
 * @returns {Promise<Object>} Response data
 */
export const postData = async (endpoint, data) => {
  if (!apiClient) {
    throw new Error('API client not configured');
  }

  const response = await apiClient.post(endpoint, data);
  return {
    success: true,
    data: response.data.data || response.data,
    status: response.status,
    timestamp: new Date().toISOString()
  };
};

// =============================================================================
// RENDER-SPECIFIC OPERATIONS
// =============================================================================

/**
 * Format data for Render bulk insert
 * @param {Array|Object} records - Single record or array of records
 * @param {string} targetTable - Target table name (e.g., "company.marketing_company")
 * @returns {Object} Formatted payload for Render
 */
export const formatRenderPayload = (records, targetTable) => {
  const recordsArray = Array.isArray(records) ? records : [records];
  
  return {
    records: recordsArray.map(record => ({
      ...record,
      created_at: record.created_at || new Date().toISOString()
    })),
    target_table: targetTable
  };
};

/**
 * Insert records into Render database
 * @param {Array|Object} records - Records to insert
 * @param {string} targetTable - Target table name
 * @returns {Promise<Object>} Insert response
 */
export const insertRecords = async (records, targetTable) => {
  const payload = formatRenderPayload(records, targetTable);
  return await postData('/insert', payload);
};

// =============================================================================
// COMPANY OPERATIONS (Example Implementation)
// =============================================================================

/**
 * Get all companies
 * @returns {Promise<Object>} Companies data
 */
export const getCompanies = async () => {
  return await getData('/api/companies');
};

/**
 * Create a single company
 * @param {Object} companyData - Company data
 * @returns {Promise<Object>} Creation response
 */
export const createCompany = async (companyData) => {
  // Ensure proper field mapping
  const record = {
    company_name: companyData.company_name || companyData.name,
    domain: companyData.domain,
    industry: companyData.industry,
    employee_count: companyData.employee_count,
    created_at: companyData.created_at || new Date().toISOString(),
    ...companyData // Include any additional fields
  };

  return await insertRecords(record, "company.marketing_company");
};

/**
 * Bulk upload companies
 * @param {Array} companies - Array of company records
 * @param {string} targetTable - Target table (default: "company.marketing_company")
 * @returns {Promise<Object>} Upload response
 */
export const postMarketingCompanies = async (companies, targetTable = "company.marketing_company") => {
  return await insertRecords(companies, targetTable);
};

// =============================================================================
// APOLLO DATA OPERATIONS (Example Implementation)
// =============================================================================

/**
 * Get Apollo data
 * @returns {Promise<Object>} Apollo data
 */
export const getApolloData = async () => {
  return await getData('/api/apollo');
};

/**
 * Post Apollo data
 * @param {Object} apolloData - Apollo data to submit
 * @returns {Promise<Object>} Submission response
 */
export const postApolloData = async (apolloData) => {
  return await postData('/api/apollo', apolloData);
};

// =============================================================================
// LEGACY COMPATIBILITY
// =============================================================================

/**
 * Legacy bulk upload function (for backward compatibility)
 * @param {Array} records - Records to upload
 * @param {string} targetTable - Target table
 * @returns {Promise<Object>} Upload response
 */
export const uploadRecords = async (records, targetTable) => {
  return await insertRecords(records, targetTable);
};

// =============================================================================
// CONFIGURATION UTILITIES
// =============================================================================

/**
 * Get current API configuration
 * @returns {Object} Current configuration
 */
export const getApiConfig = () => {
  return {
    baseURL: apiClient?.defaults?.baseURL || 'Not configured',
    timeout: apiClient?.defaults?.timeout || 'Not configured',
    withCredentials: apiClient?.defaults?.withCredentials || false,
    hasClient: !!apiClient
  };
};

/**
 * Test API connectivity
 * @returns {Promise<Object>} Connectivity test result
 */
export const testConnectivity = async () => {
  try {
    const health = await checkHealth();
    return {
      success: true,
      message: 'API connectivity confirmed',
      details: health
    };
  } catch (error) {
    return {
      success: false,
      message: 'API connectivity failed',
      error: error.message || 'Unknown error'
    };
  }
};

// Export default services
export default {
  // Core functions
  checkHealth,
  getData,
  postData,
  insertRecords,
  formatRenderPayload,
  
  // Company operations
  getCompanies,
  createCompany,
  postMarketingCompanies,
  
  // Apollo operations
  getApolloData,
  postApolloData,
  
  // Utilities
  getApiConfig,
  testConnectivity,
  setApiClient,
  getApiClient
};