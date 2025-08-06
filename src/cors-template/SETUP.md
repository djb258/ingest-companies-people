# 🚀 Complete Setup Guide - Lovable.dev + Render API Template

## One-Click Setup for New Projects

### Step 1: Copy Template to Your Project
```bash
# Your Lovable project structure should look like this:
src/
├── cors-template/          # 👈 Copy this entire directory
│   ├── api/
│   ├── components/
│   ├── utils/
│   ├── templates/
│   ├── types.ts
│   ├── index.ts
│   ├── README.md
│   └── SETUP.md
├── components/
├── pages/
└── ...
```

### Step 2: Environment Setup
Create `.env` in your project root:
```bash
# Copy from cors-template/templates/.env.example
VITE_API_URL=https://your-render-app.onrender.com
VITE_ENABLE_API_LOGGING=true
```

### Step 3: Instant Integration
Add to any component for immediate CORS status:
```tsx
import { CorsStatus } from '@/cors-template';

<CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
```

**That's it! 🎉** Your app now has full Render API connectivity with zero CORS issues.

---

## 🎯 Quick Integration Examples

### 1. Header with Status (2 minutes)
```tsx
// In src/pages/Index.tsx or any component
import { CorsStatus } from '@/cors-template';

export default function Index() {
  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">My App</h1>
        <CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
      </header>
      {/* Your existing content */}
    </div>
  );
}
```

### 2. Debug Page (5 minutes)
```tsx
// Create src/pages/Debug.tsx
import { 
  CorsStatus, 
  ApiConnectionStatus, 
  EnhancedApiTester 
} from '@/cors-template';

export default function Debug() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Debug Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Status</h2>
          <CorsStatus 
            apiUrl={import.meta.env.VITE_API_URL}
            showDetails={true}
          />
          <ApiConnectionStatus 
            apiUrl={import.meta.env.VITE_API_URL}
            autoCheck={true}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Advanced Testing</h2>
          <EnhancedApiTester 
            apiUrl={import.meta.env.VITE_API_URL}
            showLogs={true}
          />
        </div>
      </div>
    </div>
  );
}
```

### 3. Data Operations (10 minutes)
```tsx
// Use pre-built service functions
import { 
  checkHealth, 
  getCompanies, 
  createCompany, 
  insertRecords 
} from '@/cors-template';

export default function DataPage() {
  const [companies, setCompanies] = useState([]);

  // Load companies
  const loadCompanies = async () => {
    try {
      const result = await getCompanies();
      setCompanies(result.data || []);
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  // Add new company
  const addCompany = async () => {
    try {
      await createCompany({
        company_name: "Example Corp",
        domain: "example.com",
        industry: "Technology",
        employee_count: 100
      });
      await loadCompanies(); // Reload
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  return (
    <div className="p-4">
      <button onClick={loadCompanies}>Load Companies</button>
      <button onClick={addCompany}>Add Test Company</button>
      <div>Companies: {companies.length}</div>
    </div>
  );
}
```

---

## 🔧 Server Requirements

Your Render API needs proper CORS configuration:

### Express.js Setup
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',           // Local development
    'https://*.lovable.app',           // All Lovable staging domains
    'https://your-custom-domain.com'   // Your production domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Required health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cors: 'configured'
  });
});

// Your other endpoints...
app.get('/api/companies', (req, res) => {
  // Return companies
});

app.post('/insert', (req, res) => {
  // Handle bulk inserts with payload format:
  // { records: [...], target_table: "table.name" }
});
```

---

## ✅ Verification Checklist

### Immediate Tests (30 seconds)
1. **Green Status**: CorsStatus component shows ✅ 
2. **No Console Errors**: Check browser developer tools
3. **Environment Variables**: Verify VITE_API_URL is set

### Advanced Tests (2 minutes)
4. **Connection Test**: Use ApiConnectionStatus "Test Connection"
5. **CORS Test**: Click "CORS Test" button
6. **Endpoint Test**: Use EnhancedApiTester "Run All Tests"

### Production Ready (5 minutes)
7. **Custom Endpoints**: Test your specific API endpoints
8. **Error Handling**: Verify graceful error messages
9. **Loading States**: Check UI feedback during requests

---

## 🐛 Troubleshooting

### CORS Issues
```bash
# Check if API is reachable
curl -X GET "https://your-render-app.onrender.com/api/health"

# Test CORS headers
curl -X OPTIONS "https://your-render-app.onrender.com/api/health" \
  -H "Origin: https://your-app.lovable.app" \
  -H "Access-Control-Request-Method: GET"
```

**Expected Response Headers:**
- `Access-Control-Allow-Origin: https://your-app.lovable.app`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`

### Import Errors
- ✅ Ensure `cors-template` directory is in `src/`
- ✅ Check all files copied correctly
- ✅ Verify TypeScript compilation succeeds

### Network Errors
- ✅ Verify VITE_API_URL is correct
- ✅ Check Render service is running (not sleeping)
- ✅ Test API directly in browser

---

## 🎛️ Configuration Options

### Environment Variables
```bash
# Required
VITE_API_URL=https://your-render-app.onrender.com

# Optional
VITE_ENABLE_API_LOGGING=true        # Enable request/response logging
VITE_API_TIMEOUT=30000              # Request timeout (ms)
VITE_API_RETRY_ATTEMPTS=3           # Network retry attempts
```

### Custom API Client
```tsx
import { createRenderApiClient } from '@/cors-template';

const customClient = createRenderApiClient({
  baseURL: 'https://your-api.onrender.com',
  enableLogging: true,
  retryAttempts: 5,
  timeout: 45000,
  customHeaders: {
    'X-App-Version': '1.0.0',
    'X-Custom-Header': 'value'
  }
});
```

---

## 📈 Next Steps

### 1. Customize for Your Use Case
- Add your specific endpoints to `EnhancedApiTester`
- Create custom payload formatters
- Add authentication headers if needed

### 2. Production Deployment
- Set production environment variables
- Update CORS origins for your custom domain
- Enable error tracking/monitoring

### 3. Team Integration
- Document your custom endpoints
- Share environment setup with team
- Add integration tests

---

## 🎉 Success!

You now have:
- ✅ **Zero CORS issues** - Template handles all CORS complexities
- ✅ **Visual debugging** - Instant feedback on API connectivity
- ✅ **Pre-built services** - Common operations ready to use
- ✅ **Error handling** - Graceful failure and retry logic
- ✅ **Type safety** - Full TypeScript support
- ✅ **Beautiful UI** - Professional status indicators

**Your Lovable.dev app is now production-ready with Render API integration!** 🚀

---

## 📞 Support

If you encounter issues:
1. Use `EnhancedApiTester` for detailed diagnostics
2. Check browser developer tools network tab
3. Verify server-side CORS configuration
4. Test with the provided curl commands

**Happy coding!** 💻✨