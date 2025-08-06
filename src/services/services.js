import apiClient from './api';

// =============================================================================
// HEALTH & STATUS ENDPOINTS
// =============================================================================

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

// =============================================================================
// MARKETING COMPANIES ENDPOINTS
// =============================================================================

export const getCompanies = async () => {
  try {
    const response = await apiClient.get('/api/marketing/companies');
    return {
      success: true,
      data: response.data.companies || response.data.data || response.data,
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

export const createCompany = async (companyData) => {
  try {
    // Ensure proper field mapping and add timestamp if not provided
    const record = {
      company_name: companyData.company_name || companyData.name,
      domain: companyData.domain,
      industry: companyData.industry,
      employee_count: companyData.employee_count,
      created_at: companyData.created_at || new Date().toISOString(),
      ...companyData // Include any additional fields
    };

    // Use the exact payload format required by Render
    const payload = {
      records: [record],
      target_table: "company.marketing_company"
    };

    const response = await apiClient.post('/insert', payload);
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

// Bulk upload to marketing companies endpoint with proper structure
export const postMarketingCompanies = async (records, targetTable = 'company.marketing_company') => {
  try {
    const requestData = {
      records: records,
      target_table: targetTable
    };
    
    console.log('🚀 Sending to /insert:', requestData);
    
    const response = await apiClient.post('/insert', requestData);
    
    console.log('✅ Response received:', response.data);
    
    return {
      success: true,
      data: response.data,
      inserted: response.data.inserted || records.length,
      failed: response.data.failed || 0,
      errors: response.data.errors || [],
      message: response.data.message || 'Companies uploaded successfully',
    };
  } catch (error) {
    console.error('❌ Upload error:', error);
    
    // Enhanced error details
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
    };
    
    console.error('🔍 Error details:', errorDetails);
    
    return {
      success: false,
      error: errorDetails,
      message: `Failed to upload companies: ${error.message}`,
    };
  }
};

// =============================================================================
// APOLLO DATA ENDPOINTS
// =============================================================================

export const getApolloData = async () => {
  try {
    const response = await apiClient.get('/api/apollo/raw');
    return {
      success: true,
      data: response.data.apollo_data || response.data.data || response.data,
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

// =============================================================================
// BULK UPLOAD ENDPOINTS
// =============================================================================

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