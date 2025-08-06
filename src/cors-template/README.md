# CORS Template Package

A reusable CORS debugging and API testing package for Lovable projects connecting to Render APIs.

## Features

- 🔍 **CORS Health Checking** - Instant visual feedback on CORS configuration
- 🧪 **Advanced API Testing** - Comprehensive endpoint testing with detailed logs
- 🔧 **Debug Tools** - Step-by-step CORS troubleshooting utilities
- ⚙️ **Configurable Components** - Easy to integrate into any project
- 📱 **Responsive Design** - Works beautifully on all screen sizes

## Quick Start

### 1. Copy the Template

Copy the `src/cors-template/` directory into your Lovable project:

```bash
# In your Lovable project
mkdir -p src/cors-template
# Copy all files from this template
```

### 2. Install Dependencies

The template uses these dependencies (likely already in your project):
- `axios` - API client
- `lucide-react` - Icons
- Standard Lovable UI components

### 3. Basic Usage

```tsx
import { CorsStatus, ApiConnectionStatus } from '@/cors-template';

function App() {
  return (
    <div>
      {/* Simple CORS status indicator */}
      <CorsStatus apiUrl="https://your-render-app.onrender.com" />
      
      {/* Full connection status with testing */}
      <ApiConnectionStatus 
        apiUrl="https://your-render-app.onrender.com"
        autoCheck={true}
        showAdvancedTests={true}
      />
    </div>
  );
}
```

## Components

### CorsStatus

Simple visual indicator for CORS health.

```tsx
<CorsStatus 
  apiUrl="https://your-api.onrender.com"
  successMessage="✅ API Connected"
  showDetails={true}
  className="mb-4"
/>
```

**Props:**
- `apiUrl` (required) - Your Render API URL
- `successMessage` - Custom success message
- `showDetails` - Show connection details
- `className` - Additional CSS classes

### ApiConnectionStatus

Advanced connection testing with manual controls.

```tsx
<ApiConnectionStatus 
  apiUrl="https://your-api.onrender.com"
  autoCheck={false}
  showAdvancedTests={true}
  className="mb-6"
/>
```

**Props:**
- `apiUrl` (required) - Your Render API URL
- `autoCheck` - Auto-run tests on mount
- `showAdvancedTests` - Show CORS and credential tests
- `className` - Additional CSS classes

### EnhancedApiTester

Comprehensive API testing interface.

```tsx
<EnhancedApiTester 
  apiUrl="https://your-api.onrender.com"
  endpoints={['health', 'companies', 'apollo']}
  showLogs={true}
/>
```

## Utilities

### CORS Debugger

```tsx
import { checkCorsHealth, quickCorsTest } from '@/cors-template';

// Simple health check
const error = await checkCorsHealth('https://your-api.onrender.com');

// Detailed CORS test
const result = await quickCorsTest('https://your-api.onrender.com');
```

### API Client Factory

```tsx
import { createApiClient } from '@/cors-template';

const api = createApiClient({
  baseURL: 'https://your-api.onrender.com',
  timeout: 30000,
  enableLogging: true,
  withCredentials: true
});
```

## Server-Side Setup

For your Render API to work with this template, ensure CORS is properly configured:

### Express.js Example

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https://your-app.lovable.app',  // Lovable staging
    'https://your-domain.com'  // Custom domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### Required Endpoints

Your API should have these endpoints for full compatibility:

- `GET /api/health` - Health check endpoint
- `GET /api/companies` - Example data endpoint
- `POST /api/companies` - Example creation endpoint

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Render API allows requests from your Lovable domain
2. **Network Timeouts**: Check if your Render service is sleeping (free tier)
3. **401/403 Errors**: Verify authentication headers and credentials

### Debug Steps

1. Use the CorsStatus component for immediate feedback
2. Run the Enhanced API Tester for detailed diagnostics
3. Check browser developer tools network tab
4. Verify server-side CORS configuration

## Customization

### Styling

All components use Tailwind CSS with semantic color tokens:

```tsx
// Custom styling example
<CorsStatus 
  apiUrl="..."
  className="bg-card border rounded-lg p-4"
/>
```

### Adding New Tests

Extend the API tester with custom endpoints:

```tsx
<EnhancedApiTester 
  apiUrl="..."
  endpoints={['health', 'custom-endpoint', 'another-test']}
/>
```

## Environment Variables

Create a `.env` file for easy configuration:

```bash
VITE_API_URL=https://your-render-app.onrender.com
VITE_ENABLE_API_LOGGING=true
```

Then use in your components:

```tsx
<CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
```

## Integration Checklist

- [ ] Copy `cors-template/` directory
- [ ] Update API URL in components
- [ ] Configure server-side CORS
- [ ] Test with CorsStatus component
- [ ] Add Enhanced API Tester for debugging
- [ ] Set up environment variables
- [ ] Verify all endpoints work
- [ ] Document custom endpoints

## Support

For issues or questions:
1. Check the Enhanced API Tester logs
2. Verify server-side CORS configuration
3. Test with browser developer tools
4. Review Render service logs

This template should eliminate CORS issues for future Render API integrations!