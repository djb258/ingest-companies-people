# ⚡ 60-Second Quickstart

## For New Lovable Projects

### 1. Copy Template (10 seconds)
```bash
# Copy entire cors-template directory to: src/cors-template/
```

### 2. Set Environment (10 seconds)
```bash
# In .env file (ONLY one variable needed!):
VITE_RENDER_API_URL=https://your-render-app.onrender.com
```

### 3. Add Status Component (30 seconds)
```tsx
// In any component:
import { CorsStatus } from '@/cors-template';

<CorsStatus apiUrl={import.meta.env.VITE_RENDER_API_URL} />
```

### 4. Verify (10 seconds)
- ✅ Green checkmark appears
- ✅ No console errors

**Done!** 🎉 Your app is connected to Render with zero CORS issues.

---

## For Existing Projects

### Replace Old CORS Code
```tsx
// OLD
import { checkCorsHealth } from '../utils/corsDebugger';

// NEW  
import { checkCorsHealth, CorsStatus } from '@/cors-template';
```

### Instant Visual Feedback
```tsx
// Add anywhere for immediate status
<CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
```

---

## Common Patterns

### Header Integration
```tsx
<header className="flex justify-between p-4">
  <h1>My App</h1>
  <CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
</header>
```

### Data Operations
```tsx
import { getCompanies, createCompany } from '@/cors-template';

const companies = await getCompanies();
const result = await createCompany({ name: "Acme Corp" });
```

### Debug Dashboard
```tsx
import { EnhancedApiTester } from '@/cors-template';

<EnhancedApiTester 
  apiUrl={import.meta.env.VITE_API_URL}
  showLogs={true}
/>
```

**Need more details?** See [SETUP.md](./SETUP.md) or [README.md](./README.md)