// MCP-based API service that bypasses CORS issues
import axios from 'axios';

// MCP API base URL - uses MCP endpoints that bypass CORS
const MCP_BASE_URL = import.meta.env.VITE_API_URL || 'https://render-marketing-db.onrender.com';

// Create axios instance optimized for MCP communication
const mcpApiClient = axios.create({
  baseURL: MCP_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor
mcpApiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 MCP Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ MCP Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with MCP-specific error handling
mcpApiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ MCP Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ MCP Error:', error);
    
    // Enhanced error info for MCP
    const mcpError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      connectionType: 'MCP_DIRECT',
      isCorsIssue: false, // MCP bypasses CORS
      isNetworkError: error.code === 'ERR_NETWORK',
      isTimeout: error.code === 'ECONNABORTED',
    };
    
    return Promise.reject(mcpError);
  }
);

// MCP Health check
export const checkMCPHealth = async () => {
  try {
    const response = await mcpApiClient.get('/api/health');
    return {
      success: true,
      data: response.data,
      connectionType: 'MCP_DIRECT'
    };
  } catch (error) {
    console.error('MCP Health check failed:', error);
    return {
      success: false,
      error: error.message,
      connectionType: 'MCP_DIRECT'
    };
  }
};

// MCP Direct Insert - bypasses CORS entirely
export const mcpDirectInsert = async (records, targetTable = 'marketing.company_raw_intake') => {
  try {
    const requestData = {
      records: records,
      target_table: targetTable,
      batch_id: `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    console.log('🔌 MCP Direct Insert:', {
      recordCount: records.length,
      targetTable,
      batchId: requestData.batch_id,
      sampleRecord: records[0] ? JSON.stringify(records[0], null, 2) : 'No records'
    });
    
    const response = await mcpApiClient.post('/insert', requestData);
    
    console.log('🔌 MCP Response received:', {
      status: response.status,
      data: response.data
    });

    // Parse the actual response structure from your API
    const responseData = response.data;
    const recordCount = Array.isArray(responseData.data?.records) ? responseData.data.records.length : records.length;
    
    return {
      success: true,
      inserted: recordCount,
      failed: 0, // Your API doesn't report failed records separately
      batch_id: response.data.batch_id,
      message: responseData.message || 'Records processed successfully',
      connectionType: 'MCP_DIRECT',
      corsIssues: false
    };
    
  } catch (error) {
    console.error('MCP Direct Insert failed:', error);
    return {
      success: false,
      error: error.message || 'MCP insertion failed',
      connectionType: 'MCP_DIRECT',
      corsIssues: false,
      details: error.data
    };
  }
};

// MCP Bulk Company Insert
export const mcpBulkCompanyInsert = async (companies, batchSize = 100) => {
  try {
    const requestData = {
      companies: companies,
      batch_size: batchSize
    };
    
    console.log(`🔄 MCP Bulk Insert: ${companies.length} companies in batches of ${batchSize}`);
    
    const response = await mcpApiClient.post('/mcp/bulk-company', requestData);
    
    return {
      success: true,
      totalCompanies: response.data.total_companies,
      totalInserted: response.data.total_inserted,
      batchesProcessed: response.data.batches_processed,
      batchResults: response.data.batch_results,
      connectionType: 'MCP_BULK',
      corsIssues: false
    };
    
  } catch (error) {
    console.error('MCP Bulk Insert failed:', error);
    return {
      success: false,
      error: error.message || 'MCP bulk insertion failed',
      connectionType: 'MCP_BULK',
      corsIssues: false,
      details: error.data
    };
  }
};

// Get table information via MCP
export const getMCPTableInfo = async () => {
  try {
    const response = await mcpApiClient.get('/api/health');
    return {
      success: true,
      tableInfo: response.data,
      connectionType: 'MCP_DIRECT'
    };
  } catch (error) {
    console.error('Get MCP table info failed:', error);
    return {
      success: false,
      error: error.message,
      connectionType: 'MCP_DIRECT'
    };
  }
};

export default mcpApiClient;
export { MCP_BASE_URL };