import apiClient from './api.js';

// Health check endpoint
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    // Fallback to base endpoint if /api/health doesn't exist
    try {
      const fallbackResponse = await apiClient.get('/');
      return {
        success: true,
        data: fallbackResponse.data,
        status: fallbackResponse.status,
        message: 'Health check via base endpoint',
      };
    } catch (fallbackError) {
      return {
        success: false,
        error: fallbackError,
        message: 'Health check failed',
      };
    }
  }
};

// Marketing Companies endpoints
export const getCompanies = async () => {
  try {
    const response = await apiClient.get('/api/marketing/companies');
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
      message: response.data.message || 'Companies fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      message: 'Failed to fetch companies',
    };
  }
};

export const postCompany = async (companyData) => {
  try {
    const response = await apiClient.post('/api/marketing/companies', companyData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Company created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      message: 'Failed to create company',
    };
  }
};

// Apollo Data endpoints
export const getApolloData = async () => {
  try {
    const response = await apiClient.get('/api/apollo/raw');
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0,
      message: response.data.message || 'Apollo data fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      message: 'Failed to fetch Apollo data',
    };
  }
};

export const postApolloData = async (apolloData) => {
  try {
    const response = await apiClient.post('/api/apollo/raw', apolloData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Apollo data submitted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      message: 'Failed to submit Apollo data',
    };
  }
};

// Legacy upload function (for backward compatibility)
export const uploadRecords = async (records, targetTable = 'companies') => {
  try {
    const response = await apiClient.post('/insert', {
      records: records,
      target_table: targetTable,
    });
    return {
      success: true,
      inserted: response.data.inserted || 0,
      failed: response.data.failed || 0,
      errors: response.data.errors || [],
      schema_hash: response.data.schema_hash,
      source: response.data.source,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      message: 'Failed to upload records',
    };
  }
};