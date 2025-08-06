# CORS Template Setup Guide

## For New Lovable Projects

### 1. Copy Template Files

Copy the entire `cors-template` directory to your new project:

```
src/
  cors-template/
    components/
    utils/
    types.ts
    index.ts
    README.md
```

### 2. Environment Setup

Create or update your `.env` file:

```bash
# Replace with your actual Render API URL
VITE_API_URL=https://your-render-app.onrender.com
VITE_ENABLE_API_LOGGING=true
```

### 3. Quick Integration

Add to your main page component:

```tsx
// In your main page (e.g., src/pages/Index.tsx)
import { CorsStatus } from '@/cors-template';

export default function Index() {
  return (
    <div>
      {/* Add to header for immediate feedback */}
      <div className="flex items-center justify-between">
        <h1>Your App</h1>
        <CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
      </div>
      
      {/* Your existing content */}
    </div>
  );
}
```

### 4. Render API Requirements

Your Render API MUST have proper CORS configuration:

#### Express.js Setup
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://*.lovable.app',  // All Lovable domains
    'https://your-custom-domain.com'
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

### 5. Testing Your Setup

1. **Immediate Test**: The CorsStatus component will show green ✅ if working
2. **Detailed Test**: Add ApiConnectionStatus for manual testing
3. **Full Debug**: Use EnhancedApiTester for comprehensive diagnostics

```tsx
import { 
  CorsStatus, 
  ApiConnectionStatus, 
  EnhancedApiTester 
} from '@/cors-template';

// For debugging page
<div className="space-y-4">
  <CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
  <ApiConnectionStatus apiUrl={import.meta.env.VITE_API_URL} />
  <EnhancedApiTester apiUrl={import.meta.env.VITE_API_URL} />
</div>
```

## For Existing Projects

### Migration Steps

1. **Backup**: Save your current CORS/API code
2. **Copy Template**: Add cors-template directory
3. **Update Imports**: Replace old utilities with template imports
4. **Test**: Verify everything still works
5. **Clean Up**: Remove old CORS debugging code

### Example Migration

Before:
```tsx
// Old way
import { checkCorsHealth } from '../utils/corsDebugger';
```

After:
```tsx
// New way
import { checkCorsHealth, CorsStatus } from '@/cors-template';
```

## Troubleshooting

### Common Setup Issues

1. **Import Errors**: Ensure the cors-template directory is in the right location
2. **CORS Still Failing**: Double-check your Render API CORS configuration
3. **Environment Variables**: Make sure VITE_API_URL is set correctly

### Quick Debug Commands

```bash
# Check if API is reachable
curl -X GET "https://your-render-app.onrender.com/api/health" \
  -H "Origin: https://your-app.lovable.app"

# Test CORS preflight
curl -X OPTIONS "https://your-render-app.onrender.com/api/health" \
  -H "Origin: https://your-app.lovable.app" \
  -H "Access-Control-Request-Method: GET"
```

## Next Steps

After setup:
1. ✅ Verify CorsStatus shows green
2. ✅ Test your actual API endpoints
3. ✅ Add error handling for your specific use case
4. ✅ Customize styling to match your app
5. ✅ Document any custom endpoints for your team

You should never have CORS issues again! 🎉