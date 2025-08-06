// Complete Integration Example for Lovable.dev + Render API
import React, { useState } from 'react';
import { 
  CorsStatus, 
  ApiConnectionStatus, 
  EnhancedApiTester,
  createRenderApiClient,
  checkHealth,
  getCompanies,
  createCompany
} from '@/cors-template';

// Example 1: Simple Status Indicator
export function SimpleStatusExample() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">API Status</h2>
      <CorsStatus 
        apiUrl={import.meta.env.VITE_API_URL}
        successMessage="✅ Connected to Render"
        showDetails={true}
      />
    </div>
  );
}

// Example 2: Advanced Connection Testing
export function AdvancedTestingExample() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">API Testing Dashboard</h2>
      
      {/* Simple status */}
      <CorsStatus apiUrl={import.meta.env.VITE_API_URL} />
      
      {/* Advanced testing */}
      <ApiConnectionStatus 
        apiUrl={import.meta.env.VITE_API_URL}
        autoCheck={true}
        showAdvancedTests={true}
      />
      
      {/* Full debugging suite */}
      <EnhancedApiTester 
        apiUrl={import.meta.env.VITE_API_URL}
        endpoints={['health', 'companies', 'apollo']}
        showLogs={true}
      />
    </div>
  );
}

// Example 3: Custom API Client Usage
export function CustomApiClientExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create custom API client
  const apiClient = createRenderApiClient({
    baseURL: import.meta.env.VITE_API_URL,
    enableLogging: true,
    retryAttempts: 3,
    customHeaders: {
      'X-App-Version': '1.0.0'
    }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/companies');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Custom API Client</h2>
      
      <button 
        onClick={fetchData}
        disabled={loading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        {loading ? 'Loading...' : 'Fetch Companies'}
      </button>
      
      {data && (
        <pre className="mt-4 p-2 bg-muted rounded text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

// Example 4: Service Functions Usage
export function ServiceFunctionsExample() {
  const [health, setHealth] = useState(null);
  const [companies, setCompanies] = useState([]);

  const checkApiHealth = async () => {
    try {
      const result = await checkHealth();
      setHealth(result);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const loadCompanies = async () => {
    try {
      const result = await getCompanies();
      setCompanies(result.data || []);
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  const addCompany = async () => {
    try {
      const newCompany = {
        company_name: "Example Corp",
        domain: "example.com",
        industry: "Technology",
        employee_count: 100
      };
      
      const result = await createCompany(newCompany);
      console.log('Company created:', result);
      
      // Reload companies list
      await loadCompanies();
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Service Functions</h2>
      
      <div className="flex gap-2">
        <button 
          onClick={checkApiHealth}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Check Health
        </button>
        
        <button 
          onClick={loadCompanies}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Load Companies
        </button>
        
        <button 
          onClick={addCompany}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Add Test Company
        </button>
      </div>
      
      {health && (
        <div className="p-2 bg-green-50 border rounded">
          <strong>Health Status:</strong> {health.success ? 'OK' : 'Failed'}
        </div>
      )}
      
      {companies.length > 0 && (
        <div className="p-2 bg-blue-50 border rounded">
          <strong>Companies:</strong> {companies.length} found
        </div>
      )}
    </div>
  );
}

// Example 5: Header Integration
export function HeaderWithStatusExample() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">My Lovable App</h1>
        <p className="text-muted-foreground">Connected to Render API</p>
      </div>
      
      <div className="flex items-center gap-2">
        <CorsStatus 
          apiUrl={import.meta.env.VITE_API_URL}
          className="text-sm"
        />
      </div>
    </header>
  );
}

// Example 6: Debugging Page
export function DebugPageExample() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">API Debug Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive testing and debugging for your Render API
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Status</h2>
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

// Complete App Example with All Features
export default function CompleteAppExample() {
  const [currentTab, setCurrentTab] = useState('status');

  const tabs = [
    { id: 'status', label: 'Status', component: SimpleStatusExample },
    { id: 'testing', label: 'Testing', component: AdvancedTestingExample },
    { id: 'custom', label: 'Custom Client', component: CustomApiClientExample },
    { id: 'services', label: 'Services', component: ServiceFunctionsExample },
    { id: 'debug', label: 'Debug Page', component: DebugPageExample }
  ];

  const CurrentComponent = tabs.find(tab => tab.id === currentTab)?.component || SimpleStatusExample;

  return (
    <div className="min-h-screen bg-background">
      <HeaderWithStatusExample />
      
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  currentTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto py-6">
        <CurrentComponent />
      </main>
    </div>
  );
}