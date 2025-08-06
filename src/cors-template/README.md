# Complete Render API Template for Lovable.dev

🚀 **Drop-in solution** for connecting any Lovable.dev application to Render APIs with zero CORS issues.

## ✨ What This Template Provides

- ✅ **Instant CORS Resolution** - Works out of the box
- 🔧 **Complete API Services** - Pre-built functions for common operations
- 🧪 **Advanced Debugging** - Visual components for testing and troubleshooting
- ⚙️ **Full Configuration** - Environment-based setup with sensible defaults
- 📦 **TypeScript Support** - Complete type definitions
- 🎨 **Beautiful UI Components** - Ready-to-use status indicators and testers

## 🚀 Quick Start (60 seconds)

### 1. Copy Template
```bash
# Copy the entire cors-template directory to your Lovable project
# All files should be in: src/cors-template/
```

### 2. Set Environment Variable
```bash
# In your .env file (copy from templates/.env.example)
VITE_API_URL=https://your-render-app.onrender.com
```

### 3. Use Instantly
```tsx
import { CorsStatus } from '@/cors-template';

// Add to any component for immediate feedback
<CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
```

**That's it!** 🎉 Your Lovable app is now connected to Render with full CORS resolution.

## 📁 Template Structure

```
src/cors-template/
├── api/
│   ├── client.js           # Configurable API client factory
│   └── services.js         # Complete service functions
├── components/
│   ├── CorsStatus.tsx      # Simple status indicator  
│   ├── ApiConnectionStatus.tsx  # Advanced testing UI
│   └── EnhancedApiTester.tsx    # Full debugging suite
├── utils/
│   ├── corsDebugger.js     # CORS utility functions
│   └── payloadFormatter.js # Render payload helpers
├── templates/
│   ├── .env.example        # Environment setup
│   └── integration-example.tsx # Usage examples
├── types.ts               # TypeScript definitions
├── index.ts              # Main exports
└── README.md             # This file
```

## 🎯 Core Components

### 1. CorsStatus - Simple Status Indicator
```tsx
<CorsStatus 
  apiUrl="https://your-api.onrender.com"
  successMessage="✅ Connected"
  showDetails={true}
/>
```

### 2. ApiConnectionStatus - Advanced Testing
```tsx
<ApiConnectionStatus 
  apiUrl="https://your-api.onrender.com"
  autoCheck={true}
  showAdvancedTests={true}
/>
```

### 3. EnhancedApiTester - Full Debug Suite
```tsx
<EnhancedApiTester 
  apiUrl="https://your-api.onrender.com"
  endpoints={['health', 'companies']}
  showLogs={true}
/>
```

## ⚡ Pre-Built Services

### Health Check
```tsx
import { checkHealth } from '@/cors-template';

const health = await checkHealth();
// Returns: { success: true, data: {...}, status: 200 }
```

### Company Operations
```tsx
import { getCompanies, createCompany } from '@/cors-template';

// Get all companies
const companies = await getCompanies();

// Create new company (auto-formatted for Render)
const newCompany = await createCompany({
  company_name: "Acme Corp",
  domain: "acme.com",
  industry: "Tech",
  employee_count: 100
});
```

### Generic Operations
```tsx
import { getData, postData, insertRecords } from '@/cors-template';

// Generic GET/POST to any endpoint
const data = await getData('/api/custom-endpoint');
const result = await postData('/api/submit', { data: 'value' });

// Bulk insert with proper Render formatting
const inserted = await insertRecords(records, "company.marketing_company");
```

## 🔧 Custom API Client
```tsx
import { createRenderApiClient } from '@/cors-template';

const customClient = createRenderApiClient({
  baseURL: 'https://your-api.onrender.com',
  enableLogging: true,
  retryAttempts: 3,
  timeout: 30000,
  customHeaders: {
    'X-App-Version': '1.0.0'
  }
});
```

## 📱 Integration Examples

### Header Status
```tsx
<header className="flex justify-between items-center p-4">
  <h1>My App</h1>
  <CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
</header>
```

### Debug Dashboard
```tsx
<div className="space-y-4">
  <CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
  <ApiConnectionStatus apiUrl={import.meta.env.VITE_API_URL} />
  <EnhancedApiTester apiUrl={import.meta.env.VITE_API_URL} />
</div>
```

### CSV Upload Integration
```tsx
import { formatCsvPayload, insertRecords } from '@/cors-template';

const uploadCsv = async (csvData) => {
  const payload = formatCsvPayload(csvData, "company.marketing_company");
  return await insertRecords(payload.records, payload.target_table);
};
```

## 🌍 Environment Configuration

Create `.env` (copy from `templates/.env.example`):
```bash
# Required
VITE_API_URL=https://your-render-app.onrender.com

# Optional
VITE_ENABLE_API_LOGGING=true
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3
```

## 🎨 Render Server Setup

Your Render API needs proper CORS configuration:

```javascript
// Express.js example
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',           // Local dev
    'https://*.lovable.app',           // All Lovable domains  
    'https://your-custom-domain.com'   // Custom domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Required health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## 🐛 Troubleshooting

### CORS Still Failing?
1. Check server-side CORS configuration
2. Verify VITE_API_URL is correct
3. Use EnhancedApiTester for detailed diagnostics
4. Check browser developer tools network tab

### Import Errors?
1. Ensure cors-template directory is in correct location
2. Verify all files copied correctly
3. Check environment variables are set

### Quick Debug Commands
```bash
# Test API directly
curl -X GET "https://your-api.onrender.com/api/health" \
  -H "Origin: https://your-app.lovable.app"

# Test CORS preflight
curl -X OPTIONS "https://your-api.onrender.com/api/health" \
  -H "Origin: https://your-app.lovable.app" \
  -H "Access-Control-Request-Method: GET"
```

## 🔄 Migration Guide

### From Old CORS Template
```tsx
// Before
import { checkCorsHealth } from '../utils/corsDebugger';

// After  
import { checkCorsHealth, CorsStatus } from '@/cors-template';
```

### From Custom API Clients
```tsx
// Before (manual axios setup)
const apiClient = axios.create({ /* config */ });

// After (use template)
import { createRenderApiClient } from '@/cors-template';
const apiClient = createRenderApiClient({ baseURL: '...' });
```

## 💡 Pro Tips

1. **Always start with CorsStatus** for immediate feedback
2. **Use environment variables** for different deployment stages
3. **Enable logging in development** for better debugging
4. **Test with EnhancedApiTester** before going live
5. **Use payload formatters** for consistent data structure

## 📋 Integration Checklist

- [ ] ✅ Copy cors-template directory
- [ ] ✅ Set VITE_API_URL environment variable  
- [ ] ✅ Configure server-side CORS
- [ ] ✅ Add CorsStatus component for feedback
- [ ] ✅ Test with EnhancedApiTester
- [ ] ✅ Verify all endpoints work
- [ ] ✅ Add error handling for your use case
- [ ] ✅ Document custom endpoints

## 🎉 You're Done!

This template eliminates CORS issues forever. Your Lovable.dev application now has:
- ✅ Instant Render API connectivity
- ✅ Visual debugging tools  
- ✅ Pre-built service functions
- ✅ Complete error handling
- ✅ TypeScript support
- ✅ Beautiful UI components

**No more CORS headaches!** 🚀