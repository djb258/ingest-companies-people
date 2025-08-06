// Render API Payload Formatting Utilities

/**
 * Format data for Render bulk insert operations
 * @param {Array|Object} data - Single record or array of records
 * @param {string} targetTable - Target table name (e.g., "company.marketing_company")
 * @param {Object} options - Additional formatting options
 * @returns {Object} Formatted payload for Render API
 */
export function formatRenderInsertPayload(data, targetTable, options = {}) {
  const {
    addTimestamp = true,
    timestampField = 'created_at',
    transformRecord = null
  } = options;

  const records = Array.isArray(data) ? data : [data];
  
  const formattedRecords = records.map(record => {
    let formattedRecord = { ...record };
    
    // Apply custom transformation if provided
    if (transformRecord && typeof transformRecord === 'function') {
      formattedRecord = transformRecord(formattedRecord);
    }
    
    // Add timestamp if requested
    if (addTimestamp && !formattedRecord[timestampField]) {
      formattedRecord[timestampField] = new Date().toISOString();
    }
    
    return formattedRecord;
  });

  return {
    records: formattedRecords,
    target_table: targetTable
  };
}

/**
 * Format company data for Render API
 * @param {Object|Array} companyData - Company data
 * @param {string} targetTable - Target table (default: "company.marketing_company")
 * @returns {Object} Formatted company payload
 */
export function formatCompanyPayload(companyData, targetTable = "company.marketing_company") {
  const transformRecord = (record) => ({
    company_name: record.company_name || record.name,
    domain: record.domain,
    industry: record.industry,
    employee_count: record.employee_count,
    ...record // Include any additional fields
  });

  return formatRenderInsertPayload(companyData, targetTable, { transformRecord });
}

/**
 * Format Apollo data for Render API
 * @param {Object|Array} apolloData - Apollo data
 * @param {string} targetTable - Target table (default: "apollo.data")
 * @returns {Object} Formatted Apollo payload
 */
export function formatApolloPayload(apolloData, targetTable = "apollo.data") {
  return formatRenderInsertPayload(apolloData, targetTable);
}

/**
 * Format CSV data for bulk upload
 * @param {Array} csvRecords - Array of CSV records
 * @param {string} targetTable - Target table name
 * @param {Object} fieldMapping - Mapping of CSV fields to database fields
 * @returns {Object} Formatted payload
 */
export function formatCsvPayload(csvRecords, targetTable, fieldMapping = {}) {
  const transformRecord = (record) => {
    const transformed = {};
    
    // Apply field mapping
    Object.keys(record).forEach(csvField => {
      const dbField = fieldMapping[csvField] || csvField;
      transformed[dbField] = record[csvField];
    });
    
    return transformed;
  };

  return formatRenderInsertPayload(csvRecords, targetTable, { transformRecord });
}

/**
 * Validate payload structure for Render API
 * @param {Object} payload - Payload to validate
 * @returns {Object} Validation result
 */
export function validateRenderPayload(payload) {
  const errors = [];
  
  if (!payload.records) {
    errors.push('Missing "records" field');
  } else if (!Array.isArray(payload.records)) {
    errors.push('"records" must be an array');
  } else if (payload.records.length === 0) {
    errors.push('"records" array cannot be empty');
  }
  
  if (!payload.target_table) {
    errors.push('Missing "target_table" field');
  } else if (typeof payload.target_table !== 'string') {
    errors.push('"target_table" must be a string');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Common field mappings for different data types
 */
export const FIELD_MAPPINGS = {
  company: {
    'Company Name': 'company_name',
    'Name': 'company_name',
    'Website': 'domain',
    'Domain': 'domain',
    'Industry': 'industry',
    'Employees': 'employee_count',
    'Employee Count': 'employee_count',
    'Size': 'employee_count'
  },
  
  apollo: {
    'First Name': 'first_name',
    'Last Name': 'last_name',
    'Email': 'email',
    'Company': 'company_name',
    'Title': 'job_title',
    'LinkedIn': 'linkedin_url'
  }
};

/**
 * Get recommended field mapping for a data type
 * @param {string} dataType - Type of data ('company', 'apollo', etc.)
 * @returns {Object} Field mapping object
 */
export function getFieldMapping(dataType) {
  return FIELD_MAPPINGS[dataType] || {};
}

export default {
  formatRenderInsertPayload,
  formatCompanyPayload,
  formatApolloPayload,
  formatCsvPayload,
  validateRenderPayload,
  getFieldMapping,
  FIELD_MAPPINGS
};