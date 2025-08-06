// Neon Table Helpers for Render API Integration

/**
 * Common Neon table names - update these based on your actual schema
 */
export const NEON_TABLES = {
  MARKETING_COMPANIES: 'marketing_companies',
  APOLLO_DATA: 'apollo_data',
  CONTACTS: 'contacts',
  CAMPAIGNS: 'campaigns',
  // Add your specific table names here
};

/**
 * Validate Neon table name
 * @param {string} tableName - Table name to validate
 * @returns {boolean} True if valid table name
 */
export function isValidNeonTable(tableName) {
  const validTables = Object.values(NEON_TABLES);
  return validTables.includes(tableName);
}

/**
 * Format data specifically for Neon table structures
 * @param {Array} records - Raw data records
 * @param {string} tableName - Target Neon table
 * @returns {Array} Formatted records
 */
export function formatForNeonTable(records, tableName) {
  if (!isValidNeonTable(tableName)) {
    throw new Error(`Invalid table name: ${tableName}. Valid tables: ${Object.values(NEON_TABLES).join(', ')}`);
  }

  switch (tableName) {
    case NEON_TABLES.MARKETING_COMPANIES:
      return records.map(record => ({
        name: record.name || record.company_name,
        email: record.email,
        phone: record.phone,
        website: record.website || record.url,
        industry: record.industry,
        size: record.size || record.company_size,
        location: record.location || record.address,
        created_at: record.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

    case NEON_TABLES.APOLLO_DATA:
      return records.map(record => ({
        person_name: record.person_name || record.name,
        title: record.title,
        company: record.company,
        email: record.email,
        linkedin_url: record.linkedin_url,
        phone: record.phone,
        industry: record.industry,
        created_at: record.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

    case NEON_TABLES.CONTACTS:
      return records.map(record => ({
        first_name: record.first_name,
        last_name: record.last_name,
        email: record.email,
        phone: record.phone,
        company_id: record.company_id,
        status: record.status || 'active',
        created_at: record.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

    default:
      // Generic formatting for unknown tables
      return records.map(record => ({
        ...record,
        created_at: record.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
  }
}

/**
 * Get endpoint path for specific Neon table operations
 * @param {string} tableName - Neon table name
 * @param {string} operation - Operation type (insert, update, delete, select)
 * @returns {string} API endpoint path
 */
export function getNeonEndpoint(tableName, operation = 'insert') {
  if (!isValidNeonTable(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  const endpoints = {
    insert: `/api/neon/${tableName}/insert`,
    update: `/api/neon/${tableName}/update`,
    delete: `/api/neon/${tableName}/delete`,
    select: `/api/neon/${tableName}`,
    bulk_insert: `/api/neon/${tableName}/bulk-insert`
  };

  return endpoints[operation] || endpoints.select;
}

/**
 * Validate record structure for specific Neon table
 * @param {Object} record - Record to validate
 * @param {string} tableName - Target table name
 * @returns {Object} Validation result
 */
export function validateNeonRecord(record, tableName) {
  const validationRules = {
    [NEON_TABLES.MARKETING_COMPANIES]: {
      required: ['name'],
      optional: ['email', 'phone', 'website', 'industry', 'size', 'location']
    },
    [NEON_TABLES.APOLLO_DATA]: {
      required: ['person_name', 'company'],
      optional: ['title', 'email', 'linkedin_url', 'phone', 'industry']
    },
    [NEON_TABLES.CONTACTS]: {
      required: ['first_name', 'last_name', 'email'],
      optional: ['phone', 'company_id', 'status']
    }
  };

  const rules = validationRules[tableName];
  if (!rules) {
    return { valid: true, message: 'No validation rules defined for table' };
  }

  const missing = rules.required.filter(field => !record[field]);
  if (missing.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missing.join(', ')}`
    };
  }

  return { valid: true, message: 'Record is valid' };
}